// ==========================================================
// llm.js – satu-satunya file yang bicara ke penyedia AI.
// Memakai standar "OpenAI-compatible" (POST {BASE_URL}/chat/completions),
// jadi ganti penyedia (Gemini -> DeepSeek, dll.) cukup ubah 3 baris di .env:
//   LLM_BASE_URL, LLM_API_KEY, LLM_MODEL
// API key dibaca dari .env di server, TIDAK PERNAH dikirim ke browser.
// ==========================================================

export class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra; // data tambahan untuk frontend, mis. { redirect: "dokumen" }
  }
}

/**
 * @param {{system:string, userText:string}} p
 * @returns {Promise<string>} teks mentah balasan AI
 */
export async function askLLM({ system, userText }) {
  const base = (process.env.LLM_BASE_URL || "").replace(/\/+$/, ""); // buang "/" di akhir
  const key = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;
  if (!base || !key || !model) {
    throw new HttpError(500, "Server belum dikonfigurasi (LLM_BASE_URL / LLM_API_KEY / LLM_MODEL).");
  }

  const body = {
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: userText }
    ],
    temperature: 0.2,   // rendah = lebih konsisten
    max_tokens: 8192    // cukup besar agar JSON (dan proses berpikir model) tidak terpotong
  };
  // Mode JSON (didukung Gemini & DeepSeek). Jika suatu penyedia menolaknya,
  // set LLM_JSON_MODE=false di .env.
  if (process.env.LLM_JSON_MODE !== "false") body.response_format = { type: "json_object" };

  // Beberapa penyedia kadang mengembalikan isi kosong di mode JSON -> coba ulang 1x
  for (let attempt = 1; attempt <= 2; attempt++) {
    const text = await callOnce(base, key, body);
    if (text) return text;
    console.warn("[llm] jawaban kosong, percobaan", attempt);
  }
  throw new HttpError(502, "AI tidak memberikan jawaban. Coba lagi atau ubah isi pesanmu.");
}

async function callOnce(base, key, body) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 45_000);
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify(body),
      signal: ctrl.signal
    });

    if (!res.ok) {
      // Log hanya status + potongan pesan error penyedia (bukan isi data pengguna)
      console.error("[llm]", res.status, (await res.text()).slice(0, 300));
      if (res.status === 429) throw new HttpError(429, "Layanan AI sedang ramai. Coba lagi beberapa menit lagi.");
      if (res.status === 401 || res.status === 403) throw new HttpError(502, "API key ditolak. Periksa LLM_API_KEY di server.");
      if (res.status === 404) throw new HttpError(502, "Model atau alamat AI tidak ditemukan. Periksa LLM_MODEL dan LLM_BASE_URL.");
      if (res.status === 400) throw new HttpError(502, "Permintaan ke AI ditolak. Periksa LLM_MODEL (atau coba LLM_JSON_MODE=false).");
      throw new HttpError(502, "Layanan AI sedang bermasalah. Coba lagi nanti.");
    }

    const data = await res.json();
    const choice = data?.choices?.[0];
    if (choice?.finish_reason === "length") console.warn("[llm] jawaban terpotong: naikkan max_tokens di llm.js");
    return (choice?.message?.content || "").trim();
  } catch (e) {
    if (e instanceof HttpError) throw e;
    if (e.name === "AbortError") throw new HttpError(504, "AI terlalu lama merespons. Coba lagi.");
    console.error("[llm] fetch gagal:", e.message);
    throw new HttpError(502, "Tidak dapat terhubung ke layanan AI.");
  } finally {
    clearTimeout(timer);
  }
}

// ---------- Bersihkan & validasi balasan AI (jangan percaya mentah-mentah) ----------
const LEVELS = ["rendah", "sedang", "tinggi"];
const KINDS = ["pesan_lengkap", "daftar_persyaratan", "tautan", "lainnya"];
const STATUSES = ["wajar", "waspada", "berbahaya"];
const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const norm = v => String(v ?? "").toLowerCase().trim();

/** @returns {{level:string, input_kind:string, flags:{title:string,detail:string}[], items:{item:string,status:string,reason:string}[], summary:string, advice:string[]}} */
export function parseResult(raw) {
  let obj;
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    try {
      obj = JSON.parse(cleaned);
    } catch {
      // cadangan: ambil dari "{" pertama sampai "}" terakhir
      obj = JSON.parse(cleaned.slice(cleaned.indexOf("{"), cleaned.lastIndexOf("}") + 1));
    }
  } catch {
    throw new HttpError(502, "Jawaban AI tidak bisa dibaca. Silakan coba lagi.");
  }

  if (obj.applicable === false) {
    throw new HttpError(422, str(obj.reason, 300) || "Data yang kamu masukkan tidak bisa diperiksa. Pastikan isinya sesuai fitur yang dipilih.");
  }

  const flags = (Array.isArray(obj.flags) ? obj.flags : [])
    .slice(0, 10)
    .map(f => ({ title: str(f?.title, 120), detail: str(f?.detail, 400) }))
    .filter(f => f.title);

  const items = (Array.isArray(obj.items) ? obj.items : [])
    .slice(0, 25)
    .map(i => ({ item: str(i?.item, 200), status: STATUSES.includes(norm(i?.status)) ? norm(i.status) : "waspada", reason: str(i?.reason, 300) }))
    .filter(i => i.item);

  const advice = (Array.isArray(obj.advice) ? obj.advice : [])
    .slice(0, 6)
    .map(a => str(a, 300))
    .filter(Boolean);

  let level = LEVELS.includes(norm(obj.level)) ? norm(obj.level) : "sedang";
  // Pengaman konsistensi dengan jumlah tanda yang ditampilkan
  if (flags.length === 0) level = "rendah";
  if (flags.length >= 4 && level === "rendah") level = "sedang";

  const input_kind = KINDS.includes(norm(obj.input_kind)) ? norm(obj.input_kind) : "lainnya";
  return { level, input_kind, flags, items, summary: str(obj.summary, 800), advice };
}
