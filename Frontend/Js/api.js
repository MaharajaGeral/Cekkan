/* ==========================================================
   CEKKAN – api.js
   Satu-satunya tempat yang perlu diubah saat backend/AI siap.

   Sekarang: DEMO_MODE = true -> hasil dibuat dari aturan kata kunci
   sederhana di browser, HANYA untuk menguji tampilan.

   Nanti:    set DEMO_MODE = false, isi API_BASE_URL, dan buat endpoint
             POST {API_BASE_URL}/api/check/{type}
             type = pesan | tautan | dokumen | kontrak
             - pesan/tautan/dokumen : body JSON  { "text": "..." }
             - kontrak              : FormData, field "images" (banyak file)

   Format balasan yang diharapkan UI:
   {
     "level":  "tinggi" | "sedang" | "rendah",
     "flags":  [ { "title": "...", "detail": "..." } ],
     "summary": "ringkasan singkat",
     "advice":  [ "langkah 1", "langkah 2" ]
   }
   ========================================================== */

const DEMO_MODE = false;
const API_BASE_URL = "https://cekkan-backend.vercel.app";
async function analyze(type, payload) {
  if (!DEMO_MODE) {
    const isForm = payload instanceof FormData;
    const res = await fetch(`${API_BASE_URL}/api/check/${type}`, {
      method: "POST",
      headers: isForm ? {} : { "Content-Type": "application/json" },
      body: isForm ? payload : JSON.stringify(payload)
    });
        if (!res.ok) {
      let msg = "Pemeriksaan gagal. Coba lagi sebentar.";
      try { const j = await res.json(); if (j && j.error) msg = j.error; } catch {}
      throw new Error(msg);
    }
    return res.json();
  }
  await new Promise(r => setTimeout(r, 900));
  return mockAnalyze(type, payload);
}

/* ---------- Mode demo (hapus jika sudah ada backend) ---------- */
const DEMO_RULES = {
  pesan: [
    [/transfer|biaya\s*(seragam|administrasi|pelatihan|pendaftaran)|bayar/i, "Diminta membayar di awal", "Perusahaan resmi umumnya tidak meminta biaya dari pelamar."],
    [/gaji\s*\d{2,}\s*juta|tanpa\s*pengalaman/i, "Gaji atau syarat tidak wajar", "Gaji tinggi tanpa syarat pengalaman sering dipakai sebagai umpan."],
    [/hari ini|kuota\s*terbatas|segera|buruan|terakhir/i, "Menekan agar buru-buru", "Tekanan waktu membuat korban tidak sempat memverifikasi."],
    [/https?:\/\/|bit\.ly|wa\.me|t\.me/i, "Mengarahkan ke tautan atau aplikasi lain", "Periksa dulu tautannya sebelum dibuka."],
    [/\b[12]\s*jam\s*\/?\s*(per\s*)?hari/i, "Jam kerja tidak masuk akal", "Pekerjaan bergaji tinggi dengan 1–2 jam kerja per hari patut dipertanyakan."],
    [/otp|\bpin\b|password|kata sandi/i, "Meminta data rahasia", "OTP, PIN, dan kata sandi tidak pernah dibutuhkan untuk melamar kerja."]
  ],
  tautan: [
    [/^http:\/\//i, "Tidak memakai HTTPS", "Tautan tanpa enkripsi lebih berisiko untuk memasukkan data."],
    [/\.(xyz|top|click|icu|site|online|shop)(\/|$)/i, "Domain tidak lazim", "Ekstensi domain ini sering dipakai pada situs sekali pakai."],
    [/bit\.ly|tinyurl|s\.id|cutt\.ly|wa\.me|t\.me/i, "Tautan pendek atau ke aplikasi chat", "Tujuan sebenarnya disembunyikan."],
    [/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, "Memakai alamat IP", "Situs perusahaan asli hampir selalu memakai nama domain."],
    [/-.*-|karir.*gaji|loker.*\d{3,}/i, "Nama domain janggal", "Nama panjang berisi tanda hubung atau angka bisa meniru situs resmi."]
  ],
  dokumen: [
    [/otp|pin\s*atm|\bpin\b|password|kata sandi/i, "Meminta data rahasia", "PIN, OTP, dan kata sandi tidak boleh diberikan kepada siapa pun."],
    [/selfie.*ktp|ktp.*selfie|foto.*pegang.*ktp/i, "Selfie dengan KTP di tahap awal", "Bisa disalahgunakan untuk pinjaman atau akun palsu."],
    [/rekening|buku tabungan|kartu atm/i, "Data rekening diminta", "Biasanya baru dibutuhkan setelah resmi diterima, untuk penggajian."],
    [/biaya|uang\s*(jaminan|muka)|deposit/i, "Ada biaya atau uang jaminan", "Pelamar tidak seharusnya diminta membayar."],
    [/ijazah\s*asli|sertifikat\s*asli/i, "Dokumen asli ditahan", "Menahan ijazah asli dapat merugikan kamu."]
  ]
};

function mockAnalyze(type, payload) {
  const text = (payload && payload.text) || "";
  const flags = (DEMO_RULES[type] || [])
    .filter(([re]) => re.test(text))
    .map(([, title, detail]) => ({ title, detail }));
  const level = flags.length >= 3 ? "tinggi" : flags.length >= 1 ? "sedang" : "rendah";
  return {
    level,
    flags,
    summary: flags.length
      ? `Ditemukan ${flags.length} kejanggalan. Ini bukan vonis mutlak, tetapi sebaiknya kamu berhati-hati dan memverifikasi dulu.`
      : "Tidak ada kejanggalan yang menonjol dari yang kamu masukkan. Tetap verifikasi lewat sumber resmi sebelum melanjutkan.",
    advice: [
      "Jangan transfer uang atau kirim data sensitif dulu.",
      "Cari tahu perusahaannya lewat situs resmi atau sumber terpercaya.",
      "Tanyakan ke teman, keluarga, atau Disnaker bila ragu.",
      "Hentikan komunikasi jika tekanan atau permintaan makin janggal."
    ]
  };
}
