// ==========================================================
// server.js – backend Cekkan
//   POST /api/check/pesan | tautan | dokumen   body JSON {"text": "..."}
//   GET  /health
// ==========================================================
import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { askLLM, parseResult, HttpError } from "./llm.js";
import { buildSystemPrompt, wrapUserData } from "./prompts.js";
import { analyzeUrl } from "./urlChecks.js";

const PORT = process.env.PORT || 3000;
const DAILY_LIMIT = Number(process.env.DAILY_LIMIT || 300);
const ALLOWED = (process.env.ALLOWED_ORIGINS || "http://127.0.0.1:5500,http://localhost:5500")
  .split(",").map(s => s.trim()).filter(Boolean);

for (const k of ["LLM_BASE_URL", "LLM_API_KEY", "LLM_MODEL"]) {
  if (!process.env[k]) console.warn(`⚠️  ${k} belum diisi di file .env — pemeriksaan akan gagal.`);
}

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1); // agar batas per-IP benar saat di balik proxy hosting (Render/Railway, dll.)

// ---------- CORS: hanya website kamu yang boleh memanggil ----------
app.use(cors({
  origin: (origin, cb) => (!origin || ALLOWED.includes(origin) ? cb(null, true) : cb(new HttpError(403, "Origin tidak diizinkan."))),
  methods: ["GET", "POST"]
}));
app.use(express.json({ limit: "50kb" }));

// ---------- Batas pemakaian ----------
// 1) per IP: 15 pemeriksaan / 10 menit
app.use("/api/", rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: Number(process.env.RATE_LIMIT || 15),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Terlalu banyak permintaan. Coba lagi beberapa menit lagi." }
}));
// 2) global per hari: melindungi kuota gratis dari habis
let day = new Date().toDateString();
let used = 0;
app.use("/api/", (req, res, next) => {
  const today = new Date().toDateString();
  if (today !== day) { day = today; used = 0; }
  if (used >= DAILY_LIMIT) return res.status(429).json({ error: "Kuota pemeriksaan hari ini sudah habis. Coba lagi besok." });
  used++;
  next();
});

// Samarkan angka panjang & kontak sebelum dikirim ke AI (teks saja).
function maskSensitive(text) {
  return text
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[EMAIL]")
    .replace(/(?:\+?62|0)[\s.-]?8\d(?:[\s.-]?\d){7,11}/g, "[NO_HP]")     // 0812-3456-7890, +62 812 3456 7890
    .replace(/\b\d(?:[\s-]?\d){9,18}\b/g, "[ANGKA_PANJANG]");              // NIK/rekening, boleh berspasi atau bertanda hubung
}

// Gerbang bentuk teks: pastikan tiap fitur menerima jenis masukan yang tepat.
// Hanya menolak jika AI yakin bentuknya tertukar; selain itu tetap diproses.
function gate(type, kind) {
  if (type === "dokumen" && kind === "pesan_lengkap") {
    throw new HttpError(422,
      "Teks ini berupa pesan tawaran lengkap (ada sapaan, gaji, atau ajakan). Gunakan fitur Periksa Pesan Loker agar seluruh isinya dianalisis, atau tempel di sini hanya daftar dokumen/persyaratannya.",
      { redirect: "pesan" });
  }
  if (type === "pesan" && kind === "daftar_persyaratan") {
    throw new HttpError(422,
      "Teks ini hanya berisi daftar dokumen/persyaratan. Gunakan fitur Periksa Dokumen Persyaratan agar setiap persyaratan dinilai satu per satu.",
      { redirect: "dokumen" });
  }
}

// Untuk fitur dokumen: level dihitung dari hasil per persyaratan agar konsisten,
// dan "flags" disusun dari butir yang waspada/berbahaya.
function finalizeDokumen(r) {
  if (!r.items.length) return r; // AI tidak memberi rincian: pakai hasil apa adanya
  const bad = r.items.filter(i => i.status === "berbahaya").length;
  const warn = r.items.filter(i => i.status === "waspada").length;
  r.level = bad >= 1 || warn >= 3 ? "tinggi" : warn >= 1 ? "sedang" : "rendah";
  r.flags = r.items
    .filter(i => i.status !== "wajar")
    .sort((a, b) => (a.status === "berbahaya" ? 0 : 1) - (b.status === "berbahaya" ? 0 : 1))
    .map(i => ({ title: i.item.slice(0, 120), detail: i.reason }));
  return r;
}

// ---------- Logika utama ----------
async function runCheck(type, { text }) {
  let userText;
  if (type === "tautan") {
    const r = analyzeUrl(text);
    if (!r.ok) throw new HttpError(400, r.error);
    userText = wrapUserData(r.summary);
  } else {
    userText = wrapUserData(maskSensitive(text));
  }
  const raw = await askLLM({ system: buildSystemPrompt(type), userText });
  const r = parseResult(raw);
  gate(type, r.input_kind);
  if (type === "dokumen") finalizeDokumen(r);
  else r.items = [];          // items hanya untuk fitur dokumen
  delete r.input_kind;        // urusan internal, tidak perlu dikirim ke frontend
  return r;
}

const wrap = fn => (req, res, next) => fn(req, res).catch(next);

app.post("/api/check/:type(pesan|tautan|dokumen)", wrap(async (req, res) => {
  const type = req.params.type;
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  const max = type === "pesan" ? 10000 : type === "dokumen" ? 5000 : 2000;
  if (!text) throw new HttpError(400, "Isi dulu bagian yang akan diperiksa.");
  if (text.length > max) throw new HttpError(400, `Teks terlalu panjang (maks ${max} karakter).`);
  res.json(await runCheck(type, { text }));
}));

app.get("/health", (_req, res) => res.json({ ok: true }));

// ---------- Penanganan error (pesan aman, tanpa membocorkan detail internal) ----------
app.use((req, res) => res.status(404).json({ error: "Tidak ditemukan." }));
app.use((err, _req, res, _next) => {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message, ...err.extra });
  if (err.type === "entity.too.large") return res.status(413).json({ error: "Data terlalu besar." });
  if (err instanceof SyntaxError) return res.status(400).json({ error: "Permintaan tidak valid." });
  console.error("[server]", err.message); // sengaja tidak mencetak isi permintaan
  res.status(500).json({ error: "Terjadi kesalahan pada server." });
});

app.listen(PORT, () => console.log(`Cekkan backend jalan di http://localhost:${PORT}`));
