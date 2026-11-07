// ==========================================================
// urlChecks.js – pemeriksaan teknis alamat tautan.
// PENTING: server TIDAK membuka/mengunduh tautan (menghindari SSRF dan
// menghindari server terkena situs berbahaya). Hanya membedah teks alamatnya.
// ==========================================================

const SHORTENERS = ["bit.ly", "tinyurl.com", "s.id", "cutt.ly", "t.co", "rebrand.ly", "is.gd", "shorturl.at", "wa.me", "t.me", "linktr.ee"];
const RISKY_TLDS = ["xyz", "top", "click", "icu", "site", "online", "shop", "cfd", "sbs", "buzz", "work", "live", "vip", "monster"];
const BAIT_WORDS = ["gaji", "bonus", "hadiah", "klaim", "gratis", "promo", "slot"];
const SECOND_LEVEL = ["co.id", "or.id", "go.id", "ac.id", "sch.id", "web.id", "my.id", "net.id", "mil.id", "com.au", "co.uk"];

// merek/instansi yang sering ditiru -> domain resminya
const BRANDS = {
  bca: ["bca.co.id"], bri: ["bri.co.id"], mandiri: ["bankmandiri.co.id"], bni: ["bni.co.id"],
  shopee: ["shopee.co.id", "shopee.com"], tokopedia: ["tokopedia.com"], gojek: ["gojek.com"], grab: ["grab.com"],
  google: ["google.com", "google.co.id"], whatsapp: ["whatsapp.com"], telegram: ["telegram.org"],
  kemnaker: ["kemnaker.go.id"], bumn: ["bumn.go.id"], pertamina: ["pertamina.com"], telkom: ["telkom.co.id"],
  linkedin: ["linkedin.com"], jobstreet: ["jobstreet.co.id", "jobstreet.com"], kalibrr: ["kalibrr.com"]
};

function registrable(host) {
  const labels = host.split(".");
  const last2 = labels.slice(-2).join(".");
  return SECOND_LEVEL.includes(last2) ? labels.slice(-3).join(".") : last2;
}

/** @returns {{ok:boolean, error?:string, summary?:string}} summary = teks hasil pemeriksaan untuk AI */
export function analyzeUrl(input) {
  const raw = String(input || "").trim();
  if (!raw) return { ok: false, error: "Tautan kosong." };
  if (raw.length > 2000) return { ok: false, error: "Tautan terlalu panjang." };

  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw);
  let url;
  try {
    url = new URL(hasScheme ? raw : `http://${raw}`);
  } catch {
    return { ok: false, error: "Format tautan tidak valid. Contoh: https://contoh.com/karir" };
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    return { ok: false, error: "Hanya tautan http/https yang bisa diperiksa." };
  }

  const host = url.hostname.toLowerCase();
  const labels = host.split(".");
  const tld = labels[labels.length - 1];
  const reg = registrable(host);
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(":");
  const findings = [];

  findings.push(hasScheme ? `Protokol: ${url.protocol.replace(":", "")}` : "Protokol tidak ditulis pada tautan (diasumsikan http)");
  if (url.protocol === "http:") findings.push("TIDAK memakai HTTPS (tidak terenkripsi)");
  if (isIp) findings.push("Memakai alamat IP, bukan nama domain");
  if (SHORTENERS.some(s => host === s || host.endsWith(`.${s}`))) findings.push("Merupakan tautan pendek / tautan ke aplikasi chat; tujuan sebenarnya tersembunyi");
  if (RISKY_TLDS.includes(tld)) findings.push(`Ekstensi domain .${tld} sering dipakai situs sekali pakai`);
  if (host.includes("xn--")) findings.push("Mengandung punycode (bisa menyamarkan huruf mirip)");
  if (labels.length - reg.split(".").length >= 2) findings.push(`Subdomain bertingkat (${labels.length} bagian) pada ${host}`);
  if ((host.match(/-/g) || []).length >= 2) findings.push("Nama domain mengandung banyak tanda hubung");
  if ((host.match(/\d/g) || []).length >= 3) findings.push("Nama domain mengandung banyak angka");
  if (url.username || url.password) findings.push("Tautan memuat nama pengguna/kata sandi di alamat (teknik penyamaran)");
  const bait = BAIT_WORDS.filter(w => host.includes(w));
  if (bait.length) findings.push(`Nama domain memuat kata pancingan: ${bait.join(", ")}`);

  for (const [brand, official] of Object.entries(BRANDS)) {
    if (host.includes(brand) && !official.includes(reg)) {
      findings.push(`Menyebut "${brand}" tetapi domainnya bukan domain resmi (${official.join(" / ")})`);
    }
  }
  if (url.pathname.length + url.search.length > 150) findings.push("Alamat sangat panjang / banyak parameter");

  const summary =
    `Alamat: ${raw.slice(0, 300)}\nDomain utama (perkiraan): ${reg}\n` +
    `Hasil pemeriksaan otomatis (hanya dari bentuk alamat):\n` +
    findings.map(f => `- ${f}`).join("\n");
  return { ok: true, summary };
}
