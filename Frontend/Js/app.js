/* helper */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const wait = ms => new Promise(r => setTimeout(r, ms));

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text; // textContent = aman dari XSS
  return n;
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2400);
}

/* 1. ROUTER */
const pages = $$(".page");

// nama tiap halaman untuk breadcrumb
const NAMA_HALAMAN = {
  "/periksa": "Periksa",
  "/periksa/pesan": "Pesan Loker",
  "/periksa/tautan": "Tautan Lowongan",
  "/periksa/dokumen": "Dokumen Persyaratan",
  "/simulasi": "Simulasi Lowongan Kerja",
  "/tentang": "Tentang",
  "/panduan": "Panduan",
  "/faq": "FAQ"
};

function tampilkanBreadcrumb(path, page) {
  const nav = $("#breadcrumb");
  nav.replaceChildren();

  // beranda tidak punya breadcrumb
  if (path === "/") {
    nav.hidden = true;
    return;
  }

  // susun urutan: Beranda, lalu tiap tingkat alamat
  const urutan = [{ nama: "Beranda", alamat: "/" }];
  const bagian = path.split("/").filter(Boolean);
  let alamat = "";
  for (const b of bagian) {
    alamat += "/" + b;
    urutan.push({ nama: NAMA_HALAMAN[alamat], alamat: alamat });
  }

  urutan.forEach((item, i) => {
    if (i > 0) {
      const pemisah = el("span", "bc-sep", "›");
      pemisah.setAttribute("aria-hidden", "true");
      nav.append(pemisah);
    }

    if (i === urutan.length - 1) {
      // halaman sekarang: bukan tautan
      const sekarang = el("span", "bc-current", item.nama);
      sekarang.setAttribute("aria-current", "page");
      nav.append(sekarang);
    } else {
      const a = el("a", "", item.nama);
      a.href = "#" + item.alamat;
      nav.append(a);
    }
  });

  // halaman tanpa tombol back (Tentang, Panduan, FAQ) -> geser ke kiri
  nav.classList.toggle("no-back", !page.querySelector(".back-btn"));
  nav.hidden = false;
}

function route() {
  const requestedPath = location.hash.replace(/^#/, "") || "/";
  const path = requestedPath === "/simulasi/lowongan" ? "/simulasi" : requestedPath;
  const page = pages.find(p => p.dataset.route === path) || pages.find(p => p.dataset.route === "/");
  const current = page.dataset.route;

  pages.forEach(p => p.classList.toggle("active", p === page));
  $$("[data-nav]").forEach(a => a.classList.toggle("active", a.dataset.nav === current));
  window.scrollTo(0, 0);
  tampilkanBreadcrumb(current, page);

  // masuk ke halaman simulasi -> mulai ulang
  if (page.dataset.scenario) startSimulation(page.dataset.scenario);
  else simToken++; // hentikan simulasi yang sedang berjalan
}
window.addEventListener("hashchange", route);

// kartu simulasi yang belum tersedia
$$("[data-soon]").forEach(a =>
  a.addEventListener("click", e => {
    e.preventDefault();
    toast(`Simulasi “${a.dataset.soon}” segera hadir`);
  })
);

/* 2. HALAMAN PERIKSA */
const ICON_WARN =
  '<svg viewBox="0 0 24 24"><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v5M12 17.5v.5"/></svg>';
const LEVEL_LABEL = { tinggi: "Tinggi", sedang: "Sedang", rendah: "Rendah" };

function showEmpty(body) {
  body.replaceChildren(el("p", "result-empty", "Hasil pemeriksaan akan muncul di sini setelah kamu menekan tombol periksa."));
}

function showLoading(body) {
  const box = el("div", "result-loading");
  box.append(el("div", "spinner"), el("span", "", "Sedang memeriksa…"));
  body.replaceChildren(box);
}

function showError(body, msg) {
  body.replaceChildren(el("p", "result-empty", msg));
}

function renderResult(body, r) {
  const frag = document.createDocumentFragment();
  const flags = Array.isArray(r.flags) ? r.flags : [];
  const level = LEVEL_LABEL[r.level] ? r.level : "sedang";

  // badge tingkat risiko
  const risk = el("div", `risk ${level}`);
  risk.innerHTML = ICON_WARN; // ikon statis milik kita sendiri
  const rt = el("div");
  rt.append(el("small", "", "Tingkat Risiko"), el("strong", "", `${LEVEL_LABEL[level]} (${flags.length} tanda bahaya)`));
  risk.append(rt);
  frag.append(risk);

  // daftar tanda (3 pertama tampil, sisanya bisa dibuka)
  const flagEls = flags.map((f, i) => {
    const d = el("div", "flag");
    d.append(el("strong", "", f.title || "Kejanggalan"), el("span", "", f.detail || ""));
    if (i >= 3) d.hidden = true;
    frag.append(d);
    return d;
  });
  if (flags.length > 3) {
    const rest = flags.length - 3;
    const more = el("button", "link-btn", `Lihat ${rest} tanda lainnya`);
    more.type = "button";
    more.addEventListener("click", () => {
      const open = flagEls[3].hidden;
      flagEls.slice(3).forEach(f => (f.hidden = !open));
      more.textContent = open ? "Sembunyikan" : `Lihat ${rest} tanda lainnya`;
    });
    frag.append(more);
  }

  // ringkasan + saran
  frag.append(el("h4", "result-sub", "Ringkasan"));
  const box = el("div", "summary-box");
  box.append(el("p", "", r.summary || ""));
  const advice = Array.isArray(r.advice) ? r.advice : [];
  if (advice.length) {
    const list = el("ul", "advice");
    list.hidden = true;
    advice.forEach(a => list.append(el("li", "", a)));
    const btn = el("button", "btn btn-primary", "Apa yang harus dilakukan?");
    btn.type = "button";
    btn.addEventListener("click", () => (list.hidden = !list.hidden));
    box.append(btn, list);
  }
  frag.append(box);

  const note = el("p", "disclaimer", "Hasil ini hanya alat bantu menemukan kejanggalan, bukan vonis mutlak. Selalu verifikasi lewat sumber resmi.");
  if (typeof DEMO_MODE !== "undefined" && DEMO_MODE) note.append(el("span", "demo-tag", "mode demo"));
  frag.append(note);

  body.replaceChildren(frag);
}

function setupCheck(section) {
  const type = section.dataset.check;
  const body = $(".result-body", section);
  const input = $(".js-input", section);
  const submit = $(".js-submit", section);
  const err = $(".field-error", section);
  const counter = $(".js-count", section);

  showEmpty(body);

  const setError = msg => { err.textContent = msg || ""; err.hidden = !msg; };

  if (counter) {
    input.addEventListener("input", () => (counter.textContent = input.value.length));
  }

  // contoh
  const sampleBtn = $(".js-sample", section);
  if (sampleBtn) {
    sampleBtn.addEventListener("click", () => {
      input.value = SAMPLES[type];
      input.dispatchEvent(new Event("input"));
      setError("");
    });
    // tombol periksa
  submit.addEventListener("click", async () => {
    const text = input.value.trim();

    // kolom tidak boleh kosong
    if (!text) {
      setError("Isi dulu sebelum diperiksa.");
      return;
    }
    setError("");

    submit.disabled = true;
    showLoading(body);

    try {
      const hasil = await analyze(type, { text: text });
      renderResult(body, hasil);
    } catch (e) {
      const msg = e instanceof TypeError
        ? "Tidak bisa terhubung ke server. Pastikan backend menyala dan alamat web diizinkan."
        : e.message;
      showError(body, msg || "Pemeriksaan gagal. Coba lagi sebentar.");
    }

    submit.disabled = false;
  });
  }
}
$$("[data-check]").forEach(setupCheck);

/* ==========================================================
   3. SIMULASI CHAT
   ========================================================== */
let simToken = 0; // naik setiap simulasi dimulai/dihentikan, agar proses async lama berhenti
const LETTERS = "ABCDEFGH";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startSimulation(id) {
  const sc = SIM_SCENARIOS[id];
  if (!sc) return;
  const page = pages.find(p => p.dataset.scenario === id);
  const token = ++simToken;
  const chat = $(".chat-body", page);
  const area = $(".answer-area", page);
  const title = $(".answer-title", page);
  $(".chat-name", page).textContent = sc.contact;
  const steps = new Map(sc.steps.map(step => [step.id, step]));
  const state = { score: 0, answered: 0, followUpIndex: 0 };

  chat.replaceChildren(el("span", "date-chip", "Hari ini"));
  area.replaceChildren();
  title.textContent = "Pilih jawaban anda:";

  const scroll = () => (chat.scrollTop = chat.scrollHeight);
  const bubble = (text, who) => { chat.append(el("div", `bubble ${who}`, text)); scroll(); };

  async function hrSays(messages) {
    for (const m of messages) {
      const t = el("div", "bubble typing");
      t.append(el("i"), el("i"), el("i"));
      chat.append(t); scroll();
      await wait(600 + Math.min(m.length * 12, 900));
      if (token !== simToken) return false;
      t.remove();
      bubble(m, "");
    }
    return true;
  }

  async function runStep(stepId) {
    const step = steps.get(stepId);
    if (!step) {
      throw new Error(`Langkah simulasi "${stepId}" tidak ditemukan pada skenario "${id}".`);
    }
    area.replaceChildren();
    title.textContent = `${sc.contact} sedang mengetik…`;
    if (!(await hrSays(step.hr))) return;
    title.textContent = "Pilih jawaban anda:";

    shuffle(step.choices).forEach((c, i) => {
      const b = el("button", "option");
      b.type = "button";
      b.append(el("span", "letter", LETTERS[i]), el("span", "opt-text", c.text));
      b.addEventListener("click", () => pick(step, c));
      area.append(b);
    });
  }

  function pick(step, choice) {
    if (token !== simToken) return;
    bubble(choice.text, "me");
    state.answered++;
    if (choice.good) state.score++;

    const hasNextStep = choice.next || (
      state.answered < sc.minAnswers &&
      state.followUpIndex < sc.followUp.length
    );
    const fb = el("div", `feedback ${choice.good ? "good" : "bad"}`);
    fb.append(el("h3", "", choice.good ? "Pilihan aman ✓" : "Perlu diwaspadai ✗"), el("p", "", choice.tip));
    const next = el("button", "btn btn-primary", hasNextStep ? "Lanjut chat" : "Lihat hasil");
    next.type = "button";
    next.addEventListener("click", async () => {
      next.disabled = true;
      if (choice.reply && !(await hrSays(choice.reply))) return;
      if (choice.next) {
        runStep(choice.next);
      } else if (state.answered < sc.minAnswers && state.followUpIndex < sc.followUp.length) {
        runStep(sc.followUp[state.followUpIndex++]);
      } else {
        finish();
      }
    });
    fb.append(next);
    title.textContent = "Penjelasan";
    area.replaceChildren(fb);
  }

  function finish() {
    title.textContent = "Simulasi selesai";
    const total = state.answered;
    const wrap = document.createDocumentFragment();
    wrap.append(el("div", "score", `${state.score}/${total}`));
    wrap.append(el("p", "center", state.score === total
      ? "Bagus, kamu berhasil mengenali semua tanda bahaya."
      : "Tinjau lagi tanda-tanda yang muncul di percakapan tadi:"));
    const list = el("ul", "recap");
    sc.redflags.forEach(r => list.append(el("li", "", r)));
    wrap.append(list);

    const row = el("div", "btn-row");
    const again = el("button", "btn btn-outline", "Ulangi");
    again.type = "button";
    again.addEventListener("click", () => startSimulation(id));
    const home = el("a", "btn btn-primary", "Kembali ke beranda");
    home.href = "#/";
    row.append(again, home);
    wrap.append(row);
    area.replaceChildren(wrap);
  }

  runStep(sc.start);
}

/* mulai */
route();
