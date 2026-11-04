/* ==========================================================
   CEKKAN – app.js
   1. Router (hash)   2. Halaman Periksa   3. Simulasi chat
   ========================================================== */

/* ---------- helper ---------- */
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

/* ==========================================================
   1. ROUTER
   ========================================================== */
const pages = $$(".page");

function route() {
  const path = location.hash.replace(/^#/, "") || "/";
  const page = pages.find(p => p.dataset.route === path) || pages.find(p => p.dataset.route === "/");
  const current = page.dataset.route;

  pages.forEach(p => p.classList.toggle("active", p === page));
  $$("[data-nav]").forEach(a => a.classList.toggle("active", a.dataset.nav === current));
  window.scrollTo(0, 0);

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

/* ==========================================================
   2. HALAMAN PERIKSA
   ========================================================== */
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
  let files = []; // khusus kontrak

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
  }

  // upload kontrak
  if (type === "kontrak") {
    const thumbs = $(".thumbs", section);
    const drawThumbs = () => {
      thumbs.replaceChildren();
      files.forEach((f, i) => {
        const t = el("div", "thumb");
        const img = document.createElement("img");
        img.alt = f.name;
        img.src = URL.createObjectURL(f);
        img.onload = () => URL.revokeObjectURL(img.src);
        const x = el("button", "", "×");
        x.type = "button";
        x.setAttribute("aria-label", "Hapus foto");
        x.addEventListener("click", () => { files.splice(i, 1); drawThumbs(); });
        t.append(img, x);
        thumbs.append(t);
      });
    };
    input.addEventListener("change", () => {
      setError("");
      for (const f of input.files) {
        if (!f.type.startsWith("image/")) { setError("Hanya file gambar (JPG/PNG) yang bisa diunggah."); continue; }
        if (f.size > 5 * 1024 * 1024) { setError(`“${f.name}” lebih dari 5 MB.`); continue; }
        if (files.length >= 5) { setError("Maksimal 5 foto."); break; }
        files.push(f);
      }
      input.value = "";
      drawThumbs();
    });
    $(".js-clear", section).addEventListener("click", () => { files = []; drawThumbs(); setError(""); showEmpty(body); });
  }

  submit.addEventListener("click", async () => {
    let payload;
    if (type === "kontrak") {
      if (!files.length) return setError("Unggah minimal satu foto kontrak.");
      payload = new FormData();
      files.forEach(f => payload.append("images", f));
    } else {
      const text = input.value.trim();
      if (!text) return setError("Isi dulu bagian yang akan diperiksa.");
      payload = { text };
    }
    setError("");
    submit.disabled = true;
    showLoading(body);
    try {
      renderResult(body, await analyze(type, payload));
    } catch (e) {
      showError(body, e.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      submit.disabled = false;
    }
  });
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
  const token = ++simToken;
  const chat = $("#chatBody");
  const area = $("#answerArea");
  const title = $("#answerTitle");
  const state = { step: 0, score: 0 };

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

  async function runStep() {
    const step = sc.steps[state.step];
    area.replaceChildren();
    title.textContent = "HR sedang mengetik…";
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
    if (choice.good) state.score++;

    const fb = el("div", `feedback ${choice.good ? "good" : "bad"}`);
    fb.append(el("h3", "", choice.good ? "Pilihan tepat ✓" : "Hati-hati ✗"), el("p", "", choice.tip));
    const next = el("button", "btn btn-primary", state.step === sc.steps.length - 1 ? "Lihat hasil" : "Lanjut");
    next.type = "button";
    next.addEventListener("click", () => {
      state.step++;
      state.step >= sc.steps.length ? finish() : runStep();
    });
    fb.append(next);
    title.textContent = "Penjelasan";
    area.replaceChildren(fb);
  }

  function finish() {
    title.textContent = "Simulasi selesai";
    const total = sc.steps.length;
    const wrap = document.createDocumentFragment();
    wrap.append(el("div", "score", `${state.score}/${total}`));
    wrap.append(el("p", "center", state.score === total
      ? "Mantap! Kamu jeli mengenali tanda-tandanya."
      : "Terus berlatih. Perhatikan tanda bahaya berikut:"));
    const list = el("ul", "recap");
    sc.redflags.forEach(r => list.append(el("li", "", r)));
    wrap.append(list);

    const row = el("div", "btn-row");
    const again = el("button", "btn btn-outline", "Ulangi");
    again.type = "button";
    again.addEventListener("click", () => startSimulation(id));
    const other = el("a", "btn btn-primary", "Simulasi lain");
    other.href = "#/simulasi";
    row.append(again, other);
    wrap.append(row);
    area.replaceChildren(wrap);
  }

  runStep();
}

/* ---------- mulai ---------- */
route();
