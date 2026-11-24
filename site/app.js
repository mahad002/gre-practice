/* GRE Practice web app. Plain JS, no build step. Progress is stored in localStorage. */
(function () {
  "use strict";

  const KEY = "grePractice.v1";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const main = $("#main");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const todayKey = () => new Date().toISOString().slice(0, 10);
  const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
  const fmtTime = (s) => { s = Math.max(0, Math.round(s)); const m = Math.floor(s / 60); return `${m}:${String(s % 60).padStart(2, "0")}`; };

  /* ---------------- state ---------------- */
  const blank = () => ({ syllabus: {}, checks: {}, qstats: {}, exams: [], vocab: {}, notes: {}, done: {}, settings: { testDate: GRE.TEST_DATE_DEFAULT }, active: null });
  let S;
  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { S = blank(); }
  S.settings = Object.assign({ testDate: GRE.TEST_DATE_DEFAULT }, S.settings || {});
  S.done = S.done || {};
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast("Could not save progress in this browser."); } };

  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2200);
  }

  /* ---------------- data ---------------- */
  const D = { questions: [], contexts: {}, vocab: [], files: [], byId: {}, loaded: false };
  async function loadJSON(path) { try { const r = await fetch(path, { cache: "no-cache" }); if (!r.ok) throw 0; return await r.json(); } catch (e) { return null; } }
  async function loadData() {
    const [qs, vocab, manifest] = await Promise.all([loadJSON("site/data/questions.json"), loadJSON("site/data/vocab.json"), loadJSON("site/data/manifest.json")]);
    if (qs) { D.questions = qs.questions || []; D.contexts = qs.contexts || {}; }
    if (vocab) D.vocab = Array.isArray(vocab) ? vocab : vocab.words || [];
    if (manifest) D.files = manifest.files || manifest.lessons || [];
    D.questions.forEach((q) => (D.byId[q.id] = q));
    D.loaded = true;
  }
  const mdCache = {};
  async function loadMd(path) {
    if (mdCache[path]) return mdCache[path];
    const r = await fetch(encodeURI(path), { cache: "no-cache" });
    if (!r.ok) throw new Error("Not found: " + path);
    return (mdCache[path] = await r.text());
  }
  const md = (s) => (window.marked ? marked.parse(String(s || ""), { gfm: true, breaks: false }) : `<pre>${esc(s)}</pre>`);

  const TOPIC_NAMES = {
    arithmetic: "Arithmetic", "fractions-percents-ratios": "Fractions, percents, ratios", "exponents-roots": "Exponents and roots",
    algebra: "Algebra", "word-problems": "Word problems", geometry: "Geometry", "coordinate-geometry": "Coordinate geometry",
    statistics: "Statistics", "counting-probability": "Counting and probability", "data-interpretation": "Data interpretation",
    mixed: "Mixed", tc: "Text Completion", se: "Sentence Equivalence", rc: "Reading Comprehension", cr: "Critical reasoning",
  };
  const topicName = (t) => TOPIC_NAMES[t] || (t && t.startsWith("vocab-week-") ? "Vocab week " + t.split("-").pop() : t || "Other");
  const SECTION_NAMES = { quant: "Quant", verbal: "Verbal", vocab: "Vocab", any: "Any" };
  const secPill = (s) => `<span class="pill ${s === "quant" ? "q" : s === "verbal" ? "v" : "w"}">${SECTION_NAMES[s] || s}</span>`;
  const diffName = (d) => ["", "Easy", "Medium", "Hard"][d] || "";

  /* ---------------- grading ---------------- */
  const QC_OPTS = [
    { key: "A", text: "Quantity A is greater." }, { key: "B", text: "Quantity B is greater." },
    { key: "C", text: "The two quantities are equal." }, { key: "D", text: "The relationship cannot be determined from the information given." },
  ];
  function kind(q) {
    if (q.blanks && q.blanks.length) return "blanks";
    if (q.type === "passage") return "passage";
    if (q.type === "numeric") return "numeric";
    const opts = optionsOf(q);
    if (!opts.length) return "self";
    const ans = answerList(q);
    if (q.type === "multi" || q.type === "se" || ans.length > 1) return "multi";
    return "single";
  }
  function optionsOf(q) { if (q.options && q.options.length) return q.options; if (q.type === "qc") return QC_OPTS; return []; }
  function answerList(q) { const a = q.answer; if (a == null) return []; return Array.isArray(a) ? a.map(String) : [String(a)]; }
  function numVal(s) {
    s = String(s).replace(/[,\s$%]/g, "");
    const f = s.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/);
    if (f) return parseFloat(f[1]) / parseFloat(f[2]);
    const n = parseFloat(s); return isNaN(n) || !/^-?\d*\.?\d+(e-?\d+)?$/i.test(s) ? null : n;
  }
  const norm = (s) => String(s || "").toLowerCase().replace(/[*_`"“”‘’'.,;:!?()]/g, "").replace(/\s+/g, " ").trim();
  function grade(q, given) {
    const k = kind(q); const ans = answerList(q);
    if (given == null || (Array.isArray(given) && !given.length)) return false;
    if (k === "numeric") {
      const g = String(Array.isArray(given) ? given[0] : given);
      return ans.some((a) => { const x = numVal(a), y = numVal(g); if (x != null && y != null) return Math.abs(x - y) <= 1e-6 * Math.max(1, Math.abs(x)); return norm(a) === norm(g); });
    }
    if (k === "passage") {
      const g = norm(Array.isArray(given) ? given[0] : given); const a = norm(ans[0]);
      if (!g || !a) return false; const n = Math.min(24, a.length, g.length); return g.slice(0, n) === a.slice(0, n);
    }
    if (k === "self") return given === "self-ok";
    if (k === "blanks") return ans.length === given.length && ans.every((a, i) => a === given[i]);
    const g = given.slice().sort().join(","); return g === ans.slice().sort().join(",");
  }
  function record(q, ok) {
    const st = S.qstats[q.id] || (S.qstats[q.id] = { a: 0, c: 0 });
    st.a++; if (ok) st.c++; st.last = todayKey(); st.lastOk = ok;
    if (!ok) { st.missed = true; st.fixed = false; st.redo = []; }
    else if (st.missed && !st.fixed) {
      st.redo = st.redo || []; if (!st.redo.includes(todayKey())) st.redo.push(todayKey());
      if (st.redo.length >= 2) st.fixed = true;
    }
  }

  /* ---------------- question rendering ---------------- */
  function passageSentences(q) {
    const ctx = q.context && D.contexts[q.context];
    const raw = (ctx ? ctx.markdown : q.passage || "").replace(/[#>*_`|]/g, " ").replace(/\[[^\]]*\]\([^)]*\)/g, " ");
    return raw.split(/\n+/).flatMap((p) => p.split(/(?<=[.!?]["”]?)\s+(?=["“A-Z(])/)).map((s) => s.trim()).filter((s) => s.length > 25);
  }
  /* opts: {given, reveal, name, onChange} */
  function questionHTML(q, opts = {}) {
    const k = kind(q); const given = opts.given; const reveal = opts.reveal; const ans = answerList(q); const name = opts.name || q.id;
    const ctx = q.context && D.contexts[q.context];
    let h = "";
    if (ctx && k !== "passage") h += `<div class="q-context md">${ctx.title ? `<p class="small muted"><b>${esc(ctx.title)}</b></p>` : ""}${md(ctx.markdown)}</div>`;
    h += `<div class="q-stem md">${md(q.stem)}</div>`;
    if (q.qa != null || q.qb != null) h += `<div class="qc"><div><b>Quantity A</b>${md(q.qa)}</div><div><b>Quantity B</b>${md(q.qb)}</div></div>`;
    const mark = (key, isSel) => (reveal ? (ans.includes(key) ? " right" : isSel ? " wrong" : "") : isSel ? " sel" : "");
    if (k === "single" || k === "multi") {
      const t = k === "single" ? "radio" : "checkbox"; const sel = Array.isArray(given) ? given : [];
      if (k === "multi") h += `<p class="small muted">${q.selectCount ? `Select exactly ${q.selectCount === 2 ? "two" : q.selectCount} answers.` : q.topic === "se" ? "Select exactly two answers." : "Select all that apply."}</p>`;
      h += `<div class="opts">` + optionsOf(q).map((o) => `<label class="opt${mark(o.key, sel.includes(o.key))}"><input type="${t}" name="${esc(name)}" value="${esc(o.key)}" ${sel.includes(o.key) ? "checked" : ""} ${reveal ? "disabled" : ""}><span class="k">${esc(o.key)}</span><span>${md(o.text).replace(/^<p>|<\/p>\s*$/g, "")}</span></label>`).join("") + `</div>`;
    } else if (k === "blanks") {
      const sel = Array.isArray(given) ? given : [];
      h += `<div class="blanks">` + q.blanks.map((b, bi) => `<div class="blank-col"><h5>Blank ${esc(b.label || "(" + (bi + 1) + ")")}</h5><div class="opts">` +
        b.options.map((o) => `<label class="opt${reveal ? (ans[bi] === o.key ? " right" : sel[bi] === o.key ? " wrong" : "") : sel[bi] === o.key ? " sel" : ""}"><input type="radio" name="${esc(name)}-b${bi}" data-blank="${bi}" value="${esc(o.key)}" ${sel[bi] === o.key ? "checked" : ""} ${reveal ? "disabled" : ""}><span class="k">${esc(o.key)}</span><span>${esc(o.text)}</span></label>`).join("") + `</div></div>`).join("") + `</div>`;
    } else if (k === "numeric") {
      const v = Array.isArray(given) ? given[0] : given || "";
      h += `<div class="row" style="margin-top:12px"><input type="text" class="num-in" data-name="${esc(name)}" value="${esc(v)}" placeholder="Your answer (e.g. 12, 0.5 or 3/4)" ${reveal ? "disabled" : ""} style="max-width:260px"></div>`;
      if (reveal) h += `<p class="small" style="margin-top:8px">Correct answer: <b>${esc(ans.join(" or "))}</b></p>`;
    } else if (k === "passage") {
      const g = Array.isArray(given) ? given[0] : given;
      if (ctx) h = `<p class="small muted">Click the sentence that answers the question.</p>` + h;
      h += `<div class="q-context">` + passageSentences(q).map((s) => {
        const isSel = g && norm(g) === norm(s); const isAns = reveal && norm(s).startsWith(norm(ans[0]).slice(0, 24));
        return `<button type="button" class="sentence-opt${isSel ? " sel" : ""}" style="${isAns ? "background:var(--good-soft);border-color:var(--good)" : ""}" data-sentence="${esc(s)}" ${reveal ? "disabled" : ""}>${esc(s)}</button>`;
      }).join("") + `</div>`;
      if (reveal) h += `<p class="small">Correct sentence begins: <b>${esc(ans[0])}</b></p>`;
    } else {
      h += reveal ? "" : `<p class="small muted">Work it out, then reveal the answer and mark yourself.</p><div class="row"><button type="button" class="btn sm good" data-self="self-ok">I got it right</button><button type="button" class="btn sm" data-self="self-no">I got it wrong</button></div>`;
    }
    if (reveal) {
      const ok = grade(q, given);
      if (given != null && k !== "self") h += `<div class="verdict ${ok ? "ok" : "no"}">${ok ? "Correct" : "Not correct"} · answer: ${esc(ans.join(", "))}</div>`;
      else if (k === "self" || given == null) h += `<div class="verdict">Answer: ${esc(ans.join(", "))}</div>`;
      if (q.explanation) h += `<div class="explain md">${md(q.explanation)}</div>`;
    }
    return h;
  }
  /* read current answer from a rendered question container */
  function readGiven(q, el) {
    const k = kind(q);
    if (k === "single" || k === "multi") { const v = $$("input:checked", el).map((i) => i.value); return v.length ? v : null; }
    if (k === "blanks") { const v = q.blanks.map((_, bi) => { const i = $(`input[data-blank="${bi}"]:checked`, el); return i ? i.value : null; }); return v.some((x) => x) ? v : null; }
    if (k === "numeric") { const i = $(".num-in", el); return i && i.value.trim() ? [i.value.trim()] : null; }
    if (k === "passage") { const b = $(".sentence-opt.sel", el); return b ? [b.dataset.sentence] : null; }
    return el.dataset.self || null;
  }
  function wireQuestion(q, el, onChange) {
    el.addEventListener("change", () => { $$(".opt", el).forEach((o) => o.classList.toggle("sel", $("input", o).checked)); onChange && onChange(readGiven(q, el)); });
    el.addEventListener("input", (e) => { if (e.target.classList.contains("num-in")) onChange && onChange(readGiven(q, el)); });
    el.addEventListener("click", (e) => {
      const b = e.target.closest(".sentence-opt"); if (b && !b.disabled) { $$(".sentence-opt", el).forEach((x) => x.classList.remove("sel")); b.classList.add("sel"); onChange && onChange(readGiven(q, el)); }
      const s = e.target.closest("[data-self]"); if (s) { el.dataset.self = s.dataset.self; onChange && onChange(s.dataset.self, true); }
    });
  }

  /* ---------------- syllabus helpers ---------------- */
  function syllabusItems() {
    const out = [];
    GRE.SYLLABUS.forEach((sec) => sec.groups.forEach((g) => g.items.forEach((it, ii) => out.push({ sec: sec.section, group: g, id: slug(sec.section + "-" + g.name) + "-" + ii, label: it }))));
    return out;
  }
  function stateCounts(items) { const c = [0, 0, 0, 0]; items.forEach((i) => c[S.syllabus[i.id] || 0]++); return c; }
  function stateBar(c) {
    const t = c.reduce((a, b) => a + b, 0) || 1;
    return `<div class="bar">${[1, 2, 3].map((s) => `<i style="width:${(100 * c[s]) / t}%;background:var(--s${s})"></i>`).join("")}</div>`;
  }

  /* ---------------- topic stats ---------------- */
  function topicStats() {
    const t = {};
    D.questions.forEach((q) => { const st = S.qstats[q.id]; if (!st) return; const k = q.topic || "other"; t[k] = t[k] || { a: 0, c: 0, sec: q.section }; t[k].a += st.a; t[k].c += st.c; });
    return t;
  }

  /* ================= PAGES ================= */
  const pages = {};

  /* ================= GUIDED PLAN ================= */
  const DAY_MS = 864e5;
  const ETS = {
    powerprep: "https://www.ets.org/gre/test-takers/general-test/prepare/powerprep.html",
    register: "https://www.ets.org/gre/test-takers/general-test/register.html",
    pool: "https://www.ets.org/gre/test-takers/general-test/prepare/content/analytical-writing/issue-pool.html",
  };
  const SHORT = {
    "00-START-HERE.md": "Start here", "01-Plan/Study-Schedule.md": "Study schedule", "01-Plan/Test-Day.md": "Test-day checklist",
    "01-Plan/Resources.md": "Resources guide", "01-Plan/GRE-Plan.md": "GRE master plan", "02-Quant/00-Formula-Sheet.md": "Formula sheet",
    "02-Quant/11-Quantitative-Comparison.md": "Quantitative Comparison lesson", "02-Quant/12-Mixed-Timed-Sets.md": "Mixed timed sets",
    "02-Quant/13-Quant-Pacing.md": "Quant pacing guide", "03-Verbal/01-Text-Completion.md": "Text Completion lesson",
    "03-Verbal/02-Sentence-Equivalence.md": "Sentence Equivalence lesson", "03-Verbal/03-Reading-Comprehension.md": "Reading Comprehension lesson",
    "03-Verbal/04-Verbal-Pacing.md": "Verbal pacing guide", "04-Vocab/README.md": "Vocab guide", "06-Practice-Tests/Mock-Test-Guide.md": "Mock test guide",
    "06-Practice-Tests/Error-Log.md": "Error log", "05-Writing/01-Issue-Essay-Guide.md": "Essay guide", "05-Writing/02-Sample-Essays.md": "Sample essays",
    "05-Writing/03-Essay-Scorecard.md": "Essay scorecard",
  };
  function fileTitle(p) {
    if (SHORT[p]) return SHORT[p];
    const f = D.files.find((x) => x.path === p);
    let t = f ? f.title : p.split("/").pop().replace(/\.md$/, "").replace(/-/g, " ");
    t = t.replace(/^\d+\.\s*/, "");
    if (/^GRE Verbal Practice: /.test(t)) return t.replace(/^GRE Verbal Practice: /, "").replace(/\s*\(.*$/, "") + " practice";
    return t.replace(/:.*$/, "");
  }
  function resolveFile(p, col, text) {
    p = p.replace(/^\.\//, "");
    const known = D.files.map((f) => f.path);
    if (/^\d\d$/.test(p)) {
      const dir = /05-Writing/.test(text || "") ? "05-Writing/" : col === "Verbal" ? "03-Verbal/" : "02-Quant/";
      return known.find((k) => k.startsWith(dir + p + "-")) || null;
    }
    if (!/\.md$/.test(p)) return null;
    if (known.includes(p)) return p;
    return known.find((k) => k.endsWith("/" + p)) || null;
  }
  function matchSet(q, f) {
    if (f.source && q.source !== f.source) return false;
    if (!f.pat) return true;
    const re = new RegExp(f.pat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace("#", "(\\d+)\\b"));
    const m = (q.label || "").match(re); if (!m) return false;
    const n = +m[1]; return (!f.from || n >= +f.from) && (!f.to || n <= +f.to);
  }

  let PLAN = null;
  const cellsOf = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((s) => s.trim());
  async function loadPlan() {
    if (PLAN) return PLAN;
    const text = await loadMd("01-Plan/Study-Schedule.md");
    const weeks = [], days = []; let wk = null, header = null;
    text.split("\n").forEach((line) => {
      const h = line.match(/^## Week (\d+) · [^·]+ · (.+)$/);
      if (h) { wk = { n: +h[1], name: h[2].replace(/\s*\(light (week|weekend)\)/i, "").trim(), note: "", days: [] }; weeks.push(wk); header = null; return; }
      if (line.startsWith("## ")) { wk = null; return; }
      if (!wk) return;
      if (/^\|\s*Day\s*\|/.test(line)) { header = cellsOf(line); return; }
      const m = line.match(/^\|\s*\**([A-Z][a-z]{2}) (\d{1,2})\**\s*\|/);
      if (m && header) {
        const c = cellsOf(line); const row = {}; header.forEach((k, i) => (row[k] = c[i] || ""));
        const d = { idx: days.length, dow: m[1], week: wk, row }; d.tasks = buildTasks(d); days.push(d); wk.days.push(d); return;
      }
      if (!line.startsWith("|") && line.trim() && !header) wk.note += line + "\n";
    });
    return (PLAN = { weeks, days });
  }
  const planLen = () => (PLAN ? PLAN.days.length : 62);
  const parseISO = (s) => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d); };
  const startDate = () => { const d = parseISO(S.settings.testDate); d.setDate(d.getDate() - (planLen() - 1)); return d; };
  const dateOf = (idx) => { const d = startDate(); d.setDate(d.getDate() + idx); return d; };
  const todayIndex = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((t - startDate()) / DAY_MS); };
  const fmtLong = (d) => d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const fmtShort = (d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const fmtDur = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? " " + (m % 60) + " min" : ""}` : `${m} min`);
  const dayCount = (d) => d.tasks.filter((t) => S.done[t.key]).length;
  const dayDone = (d) => d.tasks.length > 0 && dayCount(d) === d.tasks.length;

  const MIN = { vocab: 25, quant: 60, verbal: 35, review: 20, mock: 150, writing: 35 };
  const KIND_LABEL = { vocab: "Vocab", quant: "Quant", verbal: "Verbal", review: "Review", log: "Review", mock: "Practice test", writing: "Writing", do: "Task" };
  const HINT = {
    vocab: "Flip each card, say the meaning out loud, then rate yourself honestly.",
    quant: "Read first, then solve without notes. Check answers only at the end.",
    verbal: "Predict the answer before you look at the choices, then prove it from the text.",
    review: "Redo each question from scratch before you look at the solution.",
    log: "Write one short rule for each miss. A mistake is fixed after two correct redos on different days.",
    mock: "One sitting, timed, phone in another room. This one runs on the ETS website.",
    writing: "30 minutes, timed, no spell-check. Score it with the essay scorecard afterwards.",
    do: "",
  };
  const colGuess = (s) => (/Anki|Quiz|words/i.test(s) ? "Vocab" : /Quant|formula/i.test(s) ? "Quant" : /Verbal|essay|article/i.test(s) ? "Verbal" : "Do");
  function buildTasks(d) {
    const out = []; const r = d.row; const finalWeek = "What" in r;
    const push = (col, text) => {
      text = String(text || "").replace(/\s+/g, " ").trim();
      if (!text || /^(none|rest)\b/i.test(text) || /^\[[ x]?\]$/i.test(text)) return;
      let kind = { Vocab: "vocab", Quant: "quant", Verbal: "verbal" }[col] || "do";
      if (col !== "Vocab" && /^(\*\*)?(redo|review)\b/i.test(text)) kind = "review";
      else if (/POWERPREP/i.test(text)) kind = "mock";
      else if (col !== "Vocab" && /\bEssay \d/i.test(text)) kind = "writing";
      const t = { key: d.idx + "-" + out.length, day: d.idx, col, kind, text, minutes: finalWeek ? 0 : MIN[kind] || 0 };
      t.actions = actionsFor(t);
      out.push(t);
    };
    if (finalWeek) {
      const frags = r.What.split(/(?<=\.\**)\s+(?=[A-Z0-9*])/).map((x) => x.replace(/\.$/, ""));
      const merged = [];
      frags.forEach((f) => {
        const lone = f.replace(/\*/g, "").length < 30 && !actionsFor({ text: f, col: colGuess(f) }).length;
        if (lone && merged.length) merged[merged.length - 1] += ". " + f; else if (lone) merged.push(f + "__NEXT"); else if (merged.length && merged[merged.length - 1].endsWith("__NEXT")) merged[merged.length - 1] = merged[merged.length - 1].replace("__NEXT", " ") + f; else merged.push(f);
      });
      merged.forEach((f) => push(colGuess(f), f.replace("__NEXT", "")));
    }
    else { push("Vocab", r.Vocab); push("Quant", r.Quant); push("Verbal", r.Verbal); }
    if (!finalWeek && ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(d.dow) && out.some((t) => t.col !== "Vocab"))
      out.push({ key: d.idx + "-log", day: d.idx, col: "Review", kind: "log", minutes: 10, text: "Log today's mistakes: one short rule for every wrong, guessed or slow question", actions: [{ label: "Open mistakes log", href: "#/mistakes" }] });
    return out;
  }
  function actionsFor(t) {
    const s = t.text; const A = [];
    const add = (a) => { if (!A.some((x) => (a.href && x.href === a.href) || x.label === a.label)) A.push(a); };
    const lesson = (p, label) => p && add({ label: label || "Open " + fileTitle(p), href: "#/lesson/" + encodeURIComponent(p) });
    const bank = (source, pat, from, to, label) => add({ label, href: "#/bank?" + new URLSearchParams(Object.assign({ source }, pat ? { pat } : {}, from ? { from, to } : {})).toString() });
    const refs = [...s.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    const files = refs.map((r) => resolveFile(r, t.col, s)).filter(Boolean);
    let m;
    if (t.col === "Vocab") {
      if ((m = s.match(/Review days (\d+)[–-](\d+)/i))) add({ label: "Review this week's words", href: `#/vocab?day=w${Math.ceil(+m[2] / 5)}&mode=due` });
      else if ((m = s.match(/\bDay (\d+)/))) add({ label: `Learn the Day ${m[1]} words`, href: `#/vocab?day=${m[1]}` });
      if ((m = s.match(/Quiz-Week-(\d)|Quiz (\d)/i))) { const n = m[1] || m[2]; add({ label: `Take vocab quiz ${n}`, exam: { name: `Vocab quiz: week ${n}`, source: `04-Vocab/Quiz-Week-${n}.md`, minutes: 15 } }); }
      if (/^Anki\b/.test(s)) add({ label: "Review words you don't know yet", href: "#/vocab?day=all&mode=due" });
    }
    if (/Book the test/i.test(s)) add({ label: "Book your test on ETS", href: ETS.register });
    if ((m = s.match(/\bSet (\d)\*{0,2} \((\d+) min/))) add({ label: `Start timed Set ${m[1]} (${m[2]} min)`, exam: { name: `Timed Quant Set ${m[1]}`, source: "02-Quant/12-Mixed-Timed-Sets.md", pat: `Timed Set ${m[1]} · Q#`, minutes: +m[2] } });
    const qsrc = files.find((f) => /^02-Quant\/(0[1-9]|10)-/.test(f));
    if (qsrc && (m = s.match(/sections? [\d–-]+/))) lesson(qsrc, `Read ${fileTitle(qsrc)} (${m[0]})`);
    if (qsrc && (m = s.match(/\bQ(\d+)[–-](\d+)/))) bank(qsrc, "Practice #", m[1], m[2], `Practice questions ${m[1]}–${m[2]}`);
    else if (qsrc && /sets/.test(s)) bank(qsrc, "Practice #", null, null, `${fileTitle(qsrc)} practice`);
    if (qsrc) lesson(qsrc, `Open ${fileTitle(qsrc)}`);
    if (/11-Quantitative-Comparison/.test(s) && /drill/.test(s)) { lesson("02-Quant/11-Quantitative-Comparison.md"); bank("02-Quant/11-Quantitative-Comparison.md", null, null, null, "QC mini drill"); }
    if ((m = s.match(/\b(TC|SE)[^`]*?`? Set ([A-C])\b/))) bank(`03-Verbal/Practice/${m[1]}-Practice.md`, `Set ${m[2]} · #`, null, null, `${m[1] === "TC" ? "Text Completion" : "Sentence Equivalence"} Set ${m[2]}`);
    if ((m = s.match(/passages? (\d+)[–-](\d+)/i))) bank("03-Verbal/Practice/RC-Practice.md", "Passage #", m[1], m[2], `Reading passages ${m[1]}–${m[2]}`);
    if (/RC lesson/i.test(s) || /article/i.test(s)) lesson("03-Verbal/03-Reading-Comprehension.md", /article/i.test(s) && !/RC lesson sections/.test(s) ? "How to read an article (RC lesson)" : "Reading Comprehension lesson");
    if (/formula sheet/i.test(s)) lesson("02-Quant/00-Formula-Sheet.md", "Open the formula sheet");
    if ((m = s.match(/grade Essay (\d)/i))) { lesson("05-Writing/03-Essay-Scorecard.md", "Score it with the essay scorecard"); lesson(`05-Writing/My-Essays/Essay-${m[1]}.md`, `Open Essay ${m[1]}`); }
    else if ((m = s.match(/\bEssay (\d)/))) { lesson(`05-Writing/My-Essays/Essay-${m[1]}.md`, `Write Essay ${m[1]}`); lesson("05-Writing/01-Issue-Essay-Guide.md", "Essay guide"); }
    if (/Verbal lessons/i.test(s)) ["03-Verbal/01-Text-Completion.md", "03-Verbal/02-Sentence-Equivalence.md", "03-Verbal/03-Reading-Comprehension.md"].forEach((p) => lesson(p));
    if (/essay prompts|from the pool/i.test(s)) add({ label: "ETS essay prompt pool", href: ETS.pool });
    if (/POWERPREP/i.test(s)) { if (t.kind !== "review") add({ label: "Open POWERPREP on ETS", href: ETS.powerprep }); lesson("06-Practice-Tests/Mock-Test-Guide.md", "How to take and review a mock"); }
    if (/Review the mock|Decision point/i.test(s)) lesson("06-Practice-Tests/Mock-Test-Guide.md", "How to review a mock");
    if (/Weak(est)? topic/i.test(s)) { add({ label: "Weak-topic drill", preset: "quant-weak" }); add({ label: "See your weakest topics", href: "#/progress" }); }
    if (/timed Quant section/i.test(s) && !/Official/i.test(s)) add({ label: "Timed Quant section", preset: "quant-s1" });
    if (/timed Verbal section/i.test(s) && !/Official/i.test(s)) add({ label: "Timed Verbal section", preset: "verbal-s1" });
    if ((m = s.match(/official (Verbal|Quant)/i))) { add({ label: "Where to get official questions", href: "#/resources" }); add({ label: `Or: timed ${m[1]} set here`, preset: /verbal/i.test(m[1]) ? "verbal-s1" : "quant-s1" }); }
    if (/Math Review PDF/i.test(s)) add({ label: "ETS Math Review (free PDF)", href: "#/resources" });
    if (/error.log|misses|\bmiss\b/i.test(s)) add({ label: "Redo your open mistakes", href: "#/mistakes" });
    files.filter((f) => /\.md$/.test(f) && !/Practice\.md$|Quiz-Week|12-Mixed|Study-Schedule/.test(f)).forEach((f) => lesson(f));
    return A;
  }
  function taskText(t) {
    let s = t.text.replace(/\bQ(\d+)[–-](\d+)\b/g, "questions $1–$2");
    if (t.col === "Vocab") s = s.replace(/^\**Day (\d+)\**(.*)$/, "Learn 20 new words (Day $1)$2, then do your Anki reviews").replace(/^Review days/, "Review the words from days").replace(/^`[^`]*Quiz-Week-\d\.md`$/, "Take this week's vocab quiz").replace(/^Anki$/, "Anki reviews (15 min)");
    else if (/^`/.test(s) && t.kind !== "review") s = "Study " + s;
    s = s.replace(/Ask Codex to grade (Essay \d) provisionally against the ETS rubric/, "Grade $1 against the ETS rubric (use the scorecard)");
    let h = window.marked ? marked.parseInline(s) : esc(s);
    return h.replace(/<code>([^<]+)<\/code>/g, (m0, p) => { const r = resolveFile(p, t.col, t.text); return `<b>${esc(r ? fileTitle(r) : p)}</b>`; });
  }
  function findTask(key) {
    if (!PLAN) return null;
    for (const d of PLAN.days) for (const [i, t] of d.tasks.entries()) if (t.key === key) return { d, t, i };
    return null;
  }
  function actionHTML(a, ai, t, primary) {
    const cls = "btn" + (primary ? " primary" : "");
    if (a.href) {
      const ext = /^https?:/.test(a.href);
      const href = ext ? a.href : a.href + (a.href.includes("?") ? "&" : "?") + "task=" + encodeURIComponent(t.key);
      return `<a class="${cls}" href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}>${esc(a.label)}${ext ? " ↗" : primary ? " →" : ""}</a>`;
    }
    return `<button class="${cls}" data-act="${ai}" data-task="${esc(t.key)}">⏱ ${esc(a.label)}</button>`;
  }
  function runAction(t, a) {
    if (a.preset) return startPreset(a.preset, t.key);
    if (a.exam) {
      const ids = D.questions.filter((q) => matchSet(q, a.exam) && !q.isExample).map((q) => q.id);
      const first = D.byId[ids[0]];
      startExam({ name: a.exam.name, task: t.key, sections: [{ section: first ? first.section : "any", ids, minutes: a.exam.minutes }] });
    }
  }
  function taskCardHTML(t, i, isNext) {
    const done = !!S.done[t.key];
    return `<li class="task k-${t.kind}${done ? " done" : ""}${isNext ? " next" : ""}">
      <button class="tick" data-tick="${esc(t.key)}" aria-pressed="${done}" title="${done ? "Mark as not done" : "Mark done"}">${done ? "✓" : i + 1}</button>
      <div class="task-body">
        <div class="task-meta"><span class="kind">${KIND_LABEL[t.kind]}</span>${t.minutes ? `<span>${t.minutes} min</span>` : ""}${isNext ? `<span class="next-tag">Start here</span>` : ""}</div>
        <div class="task-title">${taskText(t)}</div>
        ${HINT[t.kind] && !done ? `<p class="task-hint">${HINT[t.kind]}</p>` : ""}
        <div class="task-actions">${t.actions.map((a, ai) => actionHTML(a, ai, t, ai === 0 && !done)).join("")}<button class="btn ${done ? "subtle" : "done-btn"}" data-tick="${esc(t.key)}">${done ? "Undo" : "✓ Mark done"}</button></div>
      </div></li>`;
  }
  function weekStripHTML(w, cur, ti) {
    return `<div class="week-strip">${w.days.map((x) => {
      const st = dayDone(x) ? " full" : dayCount(x) ? " part" : x.idx < ti ? " missed" : ""; const dt = dateOf(x.idx);
      const flag = x.tasks.some((t) => t.kind === "mock") ? "Mock" : x.idx === planLen() - 1 ? "Test" : "";
      return `<a href="#/today?day=${x.idx}" class="wd${st}${x.idx === cur ? " cur" : ""}${x.idx === ti ? " today" : ""}" title="${esc(fmtLong(dt))}"><span>${dt.toLocaleDateString("en-GB", { weekday: "short" })}</span><b>${dt.getDate()}</b><i>${flag || (dayDone(x) ? "✓" : x.tasks.length ? dayCount(x) + "/" + x.tasks.length : "")}</i></a>`;
    }).join("")}</div>`;
  }
  function onboardingHTML() {
    return `<section class="card welcome"><div class="eyebrow">Welcome</div><h2>Set up your plan in three steps</h2>
      <ol class="steps">
        <li><b>Set your test date.</b> The plan is ${planLen()} days long and ends on test day, so every day gets a fixed list of steps.
          <div class="row" style="margin-top:8px"><input type="date" id="obTest" value="${esc(S.settings.testDate)}"><span class="small muted" id="obInfo"></span></div></li>
        <li><b>Book your seat</b> on the ETS website if you haven't yet. <a href="${ETS.register}" target="_blank" rel="noopener">Book on ETS ↗</a></li>
        <li><b>Open this page every day.</b> It always shows today's steps. Work from top to bottom: press <b>Start</b>, do the work, then press <b>Mark done</b>.</li>
      </ol>
      <div class="row"><button class="btn primary" id="obGo">Start my plan</button><a class="btn ghost" href="#/guide">How this site works</a></div></section>`;
  }

  pages.today = async function (_, params) {
    let plan; try { plan = await loadPlan(); } catch (e) { main.innerHTML = `<div class="empty">Could not load the study plan.</div>`; return; }
    const N = plan.days.length; const ti = todayIndex();
    let idx = params.day != null && params.day !== "" ? +params.day : ti;
    idx = Math.min(Math.max(isNaN(idx) ? 0 : idx, 0), N - 1);
    const d = plan.days[idx]; const isToday = idx === ti;
    const done = dayCount(d), total = d.tasks.length;
    const left = d.tasks.reduce((a, t) => a + (S.done[t.key] ? 0 : t.minutes || 0), 0);
    const testDays = Math.ceil((parseISO(S.settings.testDate) - new Date()) / DAY_MS);
    const behind = ti > 0 ? plan.days.slice(0, Math.min(ti, N)).filter((x) => x.tasks.length && !dayDone(x)) : [];
    const next = d.tasks.find((t) => !S.done[t.key]);
    const rel = isToday ? "Today" : idx === ti - 1 ? "Yesterday" : idx === ti + 1 ? "Tomorrow" : idx < ti ? "Earlier day" : "Coming up";
    const weekStart = d.week.days[0].idx === idx;
    main.innerHTML = `
      ${S.settings.onboarded ? "" : onboardingHTML()}
      ${ti < 0 && params.day == null ? `<div class="note">Your plan starts on <b>${fmtLong(dateOf(0))}</b>. This is Day 1, so you can look ahead.</div>` : ""}
      ${ti >= N && params.day == null ? `<div class="note">Your plan has finished. Good luck with the result! You can still browse every day below.</div>` : ""}
      <section class="day-hero">
        <div class="eyebrow">${rel} · Week ${d.week.n} of ${plan.weeks.length} · ${esc(d.week.name)}</div>
        <h1>${fmtLong(dateOf(idx))}</h1>
        <p class="sub">Day ${idx + 1} of ${N}${left ? ` · about ${fmtDur(left)} of work left` : ""}${testDays > 0 ? ` · ${testDays} days until your test` : ""}</p>
        <div class="day-progress"><div class="bar"><i style="width:${pct(done, total)}%"></i></div><span>${done} of ${total} steps done</span></div>
        <div class="day-nav">
          ${idx > 0 ? `<a class="btn ghost" href="#/today?day=${idx - 1}">← Previous day</a>` : ""}
          ${isToday || ti < 0 || ti >= N ? "" : `<a class="btn ghost" href="#/today">Back to today</a>`}
          ${idx < N - 1 ? `<a class="btn ghost" href="#/today?day=${idx + 1}">Next day →</a>` : ""}
          <span class="spacer"></span><a class="btn ghost" href="#/plan">Whole plan</a>
        </div>
      </section>
      ${isToday && behind.length && S.settings.onboarded ? `<div class="note warn"><b>${behind.length === 1 ? "One earlier day isn't" : behind.length + " earlier days aren't"} finished.</b> Don't try to catch up all at once. Do today's steps first, then finish missed Quant work on Sunday. <a href="#/today?day=${behind[0].idx}">Open ${esc(fmtShort(dateOf(behind[0].idx)))} →</a></div>` : ""}
      ${weekStart && d.week.note.trim() ? `<div class="note">${md(d.week.note)}</div>` : ""}
      <ol class="tasks">${d.tasks.map((t, i) => taskCardHTML(t, i, t === next && isToday)).join("")}</ol>
      ${total && done === total ? `<div class="card done-card"><h2>Day complete ✓</h2><p>Nice work. Rest, or look at what's coming tomorrow.</p>${idx < N - 1 ? `<a class="btn primary" href="#/today?day=${idx + 1}">Preview tomorrow →</a>` : ""}</div>` : ""}
      <div class="grid g2 below">
        <div class="card"><h3>Week ${d.week.n}: ${esc(d.week.name)}</h3>${weekStripHTML(d.week, idx, ti)}<p class="small muted" style="margin:10px 0 0">Click a day to open it.</p></div>
        <div class="card"><h3>How to get through a day</h3><ol class="howto">
          <li>Go from top to bottom. <b>Start</b> opens exactly the right page.</li>
          <li>When a step is finished, press <b>Mark done</b>.</li>
          <li>Wrong answers go to your mistakes log on their own. Write a short rule for each one.</li>
          <li>Missed a day? Don't double up. Do today's vocab, and move the missed Quant to Sunday.</li></ol>
          <a href="#/guide">Read the full guide →</a></div>
      </div>`;
    $$("[data-tick]", main).forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.tick; S.done[k] = !S.done[k]; if (!S.done[k]) delete S.done[k]; save();
      const y = window.scrollY; pages.today(_, params).then(() => window.scrollTo(0, y));
    }));
    $$("[data-act]", main).forEach((b) => b.addEventListener("click", () => { const f = findTask(b.dataset.task); if (f) runAction(f.t, f.t.actions[+b.dataset.act]); }));
    if (!S.settings.onboarded) {
      const info = () => { const v = $("#obTest").value; if (!v) return; S.settings.testDate = v; $("#obInfo").textContent = `Plan runs ${fmtShort(startDate())} → ${fmtShort(parseISO(v))}`; };
      $("#obTest").addEventListener("change", () => { info(); save(); setCountdown(); }); info();
      $("#obGo").addEventListener("click", () => { S.settings.onboarded = true; save(); setCountdown(); location.hash = "#/today"; pages.today(_, {}); });
    }
  };

  pages.plan = async function () {
    let plan; try { plan = await loadPlan(); } catch (e) { main.innerHTML = `<div class="empty">Could not load the study plan.</div>`; return; }
    const N = plan.days.length; const ti = todayIndex(); const doneDays = plan.days.filter(dayDone).length;
    const doneTasks = plan.days.reduce((a, d) => a + dayCount(d), 0), allTasks = plan.days.reduce((a, d) => a + d.tasks.length, 0);
    main.innerHTML = `<div class="page-head"><div><h1>Your plan</h1><p>${N} days in ${plan.weeks.length} weeks, from ${esc(fmtShort(dateOf(0)))} to test day on ${esc(fmtShort(dateOf(N - 1)))}. Each week has one focus. Click any day to see its steps.</p></div><a class="btn primary" href="#/today">Go to today →</a></div>
      <div class="card plan-sum"><div><div class="stat">${doneDays}<small>/${N}</small></div><div class="stat-label">days complete</div></div><div style="flex:1;min-width:200px"><div class="bar big"><i style="width:${pct(doneTasks, allTasks)}%"></i></div><p class="small muted" style="margin:6px 0 0">${doneTasks} of ${allTasks} steps done</p></div></div>
      <div class="weeks">${plan.weeks.map((w) => `<section class="card week${w.days.some((x) => x.idx === ti) ? " current" : ""}">
        <div class="week-head"><span class="eyebrow">Week ${w.n}${w.days.some((x) => x.idx === ti) ? " · this week" : ""}</span><h3>${esc(w.name)}</h3><span class="small muted">${w.days.filter(dayDone).length}/${w.days.length} days done</span></div>
        ${weekStripHTML(w, -1, ti)}</section>`).join("")}</div>
      <p class="small muted" style="margin-top:16px">Want to see it as one document? <a href="#/lesson/${encodeURIComponent("01-Plan/Study-Schedule.md")}">Open the full schedule</a>. Need a different balance of Quant and Verbal? <a href="#/combos">See study combos</a>.</p>`;
  };

  pages.guide = function () {
    main.innerHTML = `<div class="page-head"><div><h1>How this site works</h1><p>Read this once. After that, you only need the <a href="#/today">Today</a> page.</p></div></div>
      <div class="card prose">
        <h2>The idea</h2>
        <p>Your GRE prep is a ${planLen()}-day plan that ends on test day. Every day has a short list of steps, usually: learn 20 words, study one Quant topic, practise one Verbal skill, and log your mistakes. The <b>Today</b> page shows those steps, and each one has a <b>Start</b> button that opens exactly the right lesson, question set or flashcards.</p>
        <h2>A normal weekday (about 2 hours 15 minutes)</h2>
        <ol>
          <li><b>Vocab, 25 min.</b> Learn the day's 20 words on the flashcards.</li>
          <li><b>Quant, 60 min.</b> Read the lesson section, then do the practice questions without notes.</li>
          <li><b>Verbal, 35 min.</b> One practice set. Predict before you look at the choices.</li>
          <li><b>Review, 10 min.</b> Open your mistakes log and write a short rule for each miss.</li>
        </ol>
        <p>Saturdays are longer (3–4 hours, often a timed set or a full practice test). Sundays are short: a vocab quiz and redoing mistakes.</p>
        <h2>If you fall behind</h2>
        <p>Don't do two days in one. Do today's vocab, carry on with today's plan, and move the missed Quant work to Sunday. The Today page tells you when earlier days are unfinished.</p>
        <h2>What each page is for</h2>
        <table class="data">
          <tr><td><a href="#/today">Today</a></td><td>Your steps for today. Start here every time.</td></tr>
          <tr><td><a href="#/plan">Your plan</a></td><td>All 9 weeks at a glance. Open any day.</td></tr>
          <tr><td><a href="#/practice">Practice</a></td><td>Extra practice when you want more than the plan gives you.</td></tr>
          <tr><td><a href="#/bank">Question bank</a></td><td>Untimed questions. You see the answer and explanation straight away. Best for learning a topic.</td></tr>
          <tr><td><a href="#/exam">Timed exams</a></td><td>GRE-style timed sections and a mini mock. Best for speed, once you know the topics.</td></tr>
          <tr><td><a href="#/mistakes">Mistakes log</a></td><td>Every question you got wrong, until you've fixed it.</td></tr>
          <tr><td><a href="#/vocab">Vocab cards</a></td><td>600 words, 20 per day.</td></tr>
          <tr><td><a href="#/lessons">Lessons</a></td><td>The full course to read: plan, Quant, Verbal, vocab lists, writing and test guides.</td></tr>
          <tr><td><a href="#/syllabus">Syllabus checklist</a></td><td>Every GRE topic. Mark each one Studied, Revised or Mastered.</td></tr>
          <tr><td><a href="#/combos">Study combos</a></td><td>Other ways to split your time, for example more Quant if Quant is weak.</td></tr>
          <tr><td><a href="#/resources">Official resources</a></td><td>Free ETS practice tests and PDFs, and which books to buy.</td></tr>
          <tr><td><a href="#/progress">Progress</a></td><td>Your scores, weak topics, test date and backup.</td></tr>
        </table>
        <h2>How you'll know you're ready</h2>
        <ul>
          <li>Your official practice tests (POWERPREP) reach your target: 325+.</li>
          <li>Most syllabus topics are marked <b>Mastered</b>: 80%+ on timed questions with no repeated mistakes.</li>
          <li>Your open mistakes keep going down from week to week.</li>
        </ul>
        <h2>Your progress is saved in this browser</h2>
        <p>Nothing is sent anywhere. To move to another device, download a backup from <a href="#/progress">Progress</a> and import it there.</p>
      </div>`;
  };

  pages.practice = function () {
    const open = Object.values(S.qstats).filter((s) => s.missed && !s.fixed).length;
    const card = (href, title, body, cta, extra = "") => `<a class="card hub" href="${href}"><h3>${title}</h3><p>${body}</p>${extra}<span class="hub-cta">${cta} →</span></a>`;
    main.innerHTML = `<div class="page-head"><div><h1>Practice</h1><p>Your daily steps already include practice. Use this page when you want more, or to work on something specific.</p></div></div>
      <div class="grid g2">
        ${card("#/bank", "Question bank", `${D.questions.length} questions with explanations. Untimed. You see the answer right after each question. <b>Use it to learn a topic.</b>`, "Open the bank")}
        ${card("#/exam", "Timed exams", "GRE-style timed sections and a 54-question mini mock. <b>Use it to build speed</b> once you know the topics.", "Create an exam")}
        ${card("#/mistakes", `Mistakes log <span class="pill ${open ? "bad" : "good"}">${open} open</span>`, "Every question you got wrong. Redo each one until it's fixed: two correct answers on different days.", "Open mistakes")}
        ${card("#/vocab", "Vocab cards", `${D.vocab.length} words in 30 daily groups. Flip, say the meaning out loud, rate yourself.`, "Study words")}
      </div>
      <h2 style="margin-top:28px">Quick start</h2>
      <div class="row">${["daily-16", "quant-s1", "verbal-s1", "vocab-20", "mini-mock"].map((p) => `<button class="btn" data-preset="${p}">⏱ ${esc(GRE.PRESETS[p].name)}</button>`).join("")}</div>`;
    wirePresetButtons(main);
  };

  async function showTaskBanner(key) {
    try { await loadPlan(); } catch (e) { return; }
    const f = findTask(key); if (!f) return;
    const bar = document.createElement("div"); bar.className = "taskbar";
    bar.innerHTML = `<div class="tb-text"><span class="eyebrow">${esc(fmtShort(dateOf(f.d.idx)))} · step ${f.i + 1}</span><span class="tb-title">${taskText(f.t)}</span></div>
      <div class="row"><a class="btn ghost" href="#/today?day=${f.d.idx}">← Back to plan</a>${S.done[key] ? `<span class="pill good">Done</span>` : `<button class="btn primary" id="tbDone">✓ Mark done</button>`}</div>`;
    main.prepend(bar);
    const b = $("#tbDone", bar); if (b) b.onclick = () => { S.done[key] = true; save(); toast("Step marked done"); location.hash = "#/today?day=" + f.d.idx; };
  }

  function examTable(list) {
    if (!list.length) return `<p class="muted">No exams yet. <a href="#/exam">Create one →</a></p>`;
    return `<table class="data"><tr><th>Date</th><th>Exam</th><th>Score</th><th>Time</th><th></th></tr>${list.map((e) => `<tr><td>${esc(e.date)}</td><td>${esc(e.name)}</td><td><b>${e.correct}/${e.total}</b> (${pct(e.correct, e.total)}%)</td><td>${fmtTime(e.secs)}</td><td><a href="#/result/${e.id}">Review</a></td></tr>`).join("")}</table>`;
  }

  function wirePresetButtons(root) {
    $$("[data-preset]", root).forEach((b) => b.addEventListener("click", () => startPreset(b.dataset.preset)));
    $$("[data-topic-drill]", root).forEach((b) => b.addEventListener("click", () => {
      const t = b.dataset.topicDrill; const q = D.questions.find((x) => x.topic === t);
      startExam({ name: "Drill: " + topicName(t), sections: [{ section: q ? q.section : "any", topics: [t], count: 12, minutes: 20, difficulty: [1, 2, 3] }] });
    }));
  }

  /* ---------- syllabus ---------- */
  pages.syllabus = function () {
    const items = syllabusItems();
    let h = `<div class="page-head"><div><h1>Syllabus checklist</h1><p>Every topic on the GRE. Mark each one <b>Studied</b> (gone through once), <b>Revised</b> (practised and reviewed) or <b>Mastered</b> (80%+ on timed questions, no repeated errors).</p></div>
      <div class="legend"><span style="--c:var(--s0)">Not started</span><span style="--c:var(--s1)">Studied</span><span style="--c:var(--s2)">Revised</span><span style="--c:var(--s3)">Mastered</span></div></div>`;
    GRE.SYLLABUS.forEach((sec) => {
      const secItems = items.filter((i) => i.sec === sec.section); const c = stateCounts(secItems);
      h += `<div class="syl-section"><h2>${esc(sec.section)} <span class="pill">${c[3]}/${secItems.length} mastered</span></h2>`;
      sec.groups.forEach((g) => {
        const gi = secItems.filter((i) => i.group === g); const gc = stateCounts(gi);
        h += `<details class="syl-group" ${gc[3] === gi.length ? "" : "open"}><summary><span class="name">${esc(g.name)}</span><span class="meta"><span class="small muted">${gc[3]}/${gi.length}</span>${stateBar(gc)}</span></summary><div class="syl-items">`;
        h += `<div class="syl-item small"><a href="#/lesson/${encodeURIComponent(g.lesson)}">Open lesson</a>${g.topic ? ` · <a href="#/bank?topic=${g.topic}">Practice questions</a> · <a href="#" data-topic-drill="${g.topic}">Quick exam</a>` : ""}<span class="spacer"></span><span class="muted">Set all:</span>${statesHTML("group:" + slug(sec.section + "-" + g.name), -1)}</div>`;
        gi.forEach((i) => { h += `<div class="syl-item"><span class="lbl">${esc(i.label)}</span>${statesHTML(i.id, S.syllabus[i.id] || 0)}</div>`; });
        h += `</div></details>`;
      });
      h += `</div>`;
    });
    main.innerHTML = h;
    $$(".states button", main).forEach((b) => b.addEventListener("click", (e) => {
      e.preventDefault(); const id = b.parentElement.dataset.id; const v = +b.dataset.v;
      if (id.startsWith("group:")) { const g = id.slice(6); items.filter((i) => slug(i.sec + "-" + i.group.name) === g).forEach((i) => (S.syllabus[i.id] = v)); }
      else S.syllabus[id] = v;
      save(); const open = $$("details", main).map((d) => d.open); const y = window.scrollY; pages.syllabus(); $$("details", main).forEach((d, i) => (d.open = open[i])); window.scrollTo(0, y);
    }));
    $$("[data-topic-drill]", main).forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
    wirePresetButtons(main);
  };
  function statesHTML(id, cur) { return `<span class="states" data-id="${esc(id)}">${GRE.STATES.map((s) => `<button class="s${s.key}${cur === s.key ? " on" : ""}" data-v="${s.key}" title="${s.label}">${s.label}</button>`).join("")}</span>`; }

  /* ---------- combos ---------- */
  pages.combos = function () {
    const colors = ["var(--q)", "var(--v)", "var(--w)", "var(--a)", "var(--t)", "#5d6478"];
    main.innerHTML = `<div class="page-head"><div><h1>Study combos</h1><p>Ready-made ways to split your study time. Start with the recommended combo; switch to a strength combo for 2–3 weeks when a mock shows a weak section, then switch back.</p></div></div>
      <div class="grid g2">${GRE.COMBOS.map((c) => {
        const total = c.split.reduce((a, s) => a + s[1], 0);
        return `<div class="card combo"><div class="row"><h3>${esc(c.name)}</h3><span class="spacer"></span><span class="pill">${esc(c.tag)}</span></div>
          <p class="muted small">${esc(c.who)}</p>
          <div class="split">${c.split.map((s, i) => `<div style="flex:${s[1]};background:${colors[i % colors.length]}" title="${esc(s[0])} ${s[1]} min">${s[1]}m</div>`).join("")}</div>
          <div class="legend">${c.split.map((s, i) => `<span style="--c:${colors[i % colors.length]}">${esc(s[0])} ${s[1]}m</span>`).join("")}</div>
          <p class="small muted" style="margin-top:6px">About ${total} minutes a day.</p>
          <table class="data weektbl">${c.week.map((w) => `<tr><td>${esc(w[0])}</td><td>${esc(w[1])}</td></tr>`).join("")}</table>
          <ul class="small">${c.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
          <div class="row" style="margin-top:auto;padding-top:10px">${c.presets.map((p) => `<button class="btn sm" data-preset="${p}">⏱ ${esc(GRE.PRESETS[p].name)}</button>`).join("")}<a class="btn sm" href="#/lesson/${encodeURIComponent(c.link)}">Guide</a></div>
        </div>`;
      }).join("")}</div>`;
    wirePresetButtons(main);
  };

  /* ---------- lessons ---------- */
  const FOLDER_NAMES = { "": "Start", "01-Plan": "Plan", "02-Quant": "Quant", "03-Verbal": "Verbal", "03-Verbal/Practice": "Verbal practice", "04-Vocab": "Vocab", "05-Writing": "Writing", "05-Writing/My-Essays": "My essays", "06-Practice-Tests": "Practice tests" };
  function lessonNav(active) {
    const files = D.files.length ? D.files : [];
    const groups = {};
    files.forEach((f) => { const folder = f.path.split("/").slice(0, -1).join("/"); (groups[folder] = groups[folder] || []).push(f); });
    return Object.keys(groups).sort().map((g) => `<h4>${esc(FOLDER_NAMES[g] || g)}</h4>` + groups[g].sort((a, b) => a.path.localeCompare(b.path)).map((f) => `<a href="#/lesson/${encodeURIComponent(f.path)}" class="${f.path === active ? "active" : ""}">${esc(f.title || f.path.split("/").pop())}</a>`).join("")).join("");
  }
  pages.lessons = function () {
    main.innerHTML = `<div class="page-head"><div><h1>Lessons</h1><p>Every file of the course: plan, Quant and Verbal lessons, practice sets, vocab lists, writing guides and test guides. Answers are hidden behind a "Show answers" button.</p></div></div>
      <div class="card"><div class="lesson-nav" style="position:static;max-height:none;columns:2 260px">${lessonNav("") || `<p class="muted">Lesson list not available.</p>`}</div></div>`;
  };
  pages.lesson = async function (path) {
    path = decodeURIComponent(path || "");
    main.innerHTML = `<div class="lesson-layout"><details class="lesson-nav card" ${innerWidth > 1000 ? "open" : ""}><summary>All lessons</summary>${lessonNav(path)}</details><article class="card md" id="lesson">Loading…</article></div>`;
    const el = $("#lesson");
    try {
      const text = await loadMd(path);
      const folder = path.split("/").slice(0, -1).join("/");
      el.innerHTML = `<p class="crumb"><a href="#/lessons">Lessons</a> › ${esc(FOLDER_NAMES[folder] || "Start")}</p>` + linkify(md(text), path);
      wrapAnswers(el); enhanceChecks(el, path);
      const bankTopic = (GRE.SYLLABUS.flatMap((s) => s.groups).find((g) => g.lesson === path) || {}).topic;
      const st = D.questions.filter((q) => q.source === path).length;
      if (st) el.insertAdjacentHTML("afterbegin", `<div class="row" style="margin-bottom:12px"><a class="btn sm" href="#/bank?source=${encodeURIComponent(path)}">Practise these ${st} questions interactively</a>${bankTopic ? `<button class="btn sm" data-topic-drill="${bankTopic}">Quick exam on this topic</button>` : ""}</div>`);
      wirePresetButtons(el);
    } catch (e) { el.innerHTML = `<p>Could not load <code>${esc(path)}</code>.</p>`; }
    window.scrollTo(0, 0);
  };
  /* make `path.md` mentions clickable */
  function linkify(html, base) {
    const known = new Set(D.files.map((f) => f.path));
    const dir = base.split("/").slice(0, -1);
    const resolve = (p) => {
      if (known.has(p)) return p;
      for (let i = dir.length; i >= 0; i--) { const c = [...dir.slice(0, i), p].join("/"); if (known.has(c)) return c; }
      const hit = D.files.find((f) => f.path.endsWith("/" + p)); return hit ? hit.path : null;
    };
    return html.replace(/<code>([^<]+?\.md)<\/code>/g, (m, p) => { const r = resolve(p.replace(/^\.\//, "")); return r ? `<a class="mdlink" href="#/lesson/${encodeURIComponent(r)}">${esc(fileTitle(r))}</a>` : m; });
  }
  function wrapAnswers(el) {
    const hs = $$("h2, h3", el).filter((h) => /^(\d+\.\s*)?answers?\b|answers and (solutions|explanations)|answer key/i.test(h.textContent.trim()));
    if (!hs.length) return;
    const h = hs[0]; const level = h.tagName;
    const det = document.createElement("details"); det.className = "answers";
    det.innerHTML = `<summary>Show answers and solutions</summary>`;
    h.parentNode.insertBefore(det, h);
    let n = h; while (n) { const nx = n.nextSibling; if (n !== h && n.nodeType === 1 && n.tagName === level && /score yourself/i.test(n.textContent)) break; det.appendChild(n); n = nx; }
  }
  function enhanceChecks(el, path) {
    let idx = 0;
    $$("input[type=checkbox]", el).forEach((i) => { const k = path + "#" + idx++; i.disabled = false; i.checked = !!S.checks[k]; i.addEventListener("change", () => { S.checks[k] = i.checked; save(); }); });
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); const nodes = [];
    while (walker.nextNode()) if (/\[( |x)\]/i.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
    nodes.forEach((tn) => {
      const parts = tn.nodeValue.split(/(\[[ xX]\])/); const frag = document.createDocumentFragment();
      parts.forEach((p) => {
        if (/^\[[ xX]\]$/.test(p)) { const k = path + "#" + idx++; const i = document.createElement("input"); i.type = "checkbox"; i.checked = S.checks[k] ?? /x/i.test(p); i.addEventListener("change", () => { S.checks[k] = i.checked; save(); }); frag.appendChild(i); }
        else frag.appendChild(document.createTextNode(p));
      });
      tn.parentNode.replaceChild(frag, tn);
    });
  }

  /* ---------- question bank ---------- */
  pages.bank = function (_, params) {
    if (!D.questions.length) { main.innerHTML = `<h1>Question bank</h1><div class="empty">The question bank file is not available yet.</div>`; return; }
    const f = Object.assign({ section: "", topic: "", diff: "", status: "", q: "", source: "", ex: "0", pat: "", from: "", to: "" }, params);
    const topics = [...new Set(D.questions.filter((q) => !f.section || q.section === f.section).map((q) => q.topic))];
    const sources = [...new Set(D.questions.map((q) => q.source))].sort();
    main.innerHTML = `<div class="page-head"><div><h1>Question bank</h1><p>Untimed practice. Choose an answer, press <b>Check</b>, and read the explanation. Wrong answers go to your <a href="#/mistakes">mistakes log</a> automatically.</p></div><a class="btn" href="#/exam">Want a timer? Create an exam</a></div>
      <div class="card filters" ${f.pat ? 'style="display:none"' : ""}>
        <select id="fSec"><option value="">All sections</option>${["quant", "verbal", "vocab"].map((s) => `<option value="${s}" ${f.section === s ? "selected" : ""}>${SECTION_NAMES[s]}</option>`).join("")}</select>
        <select id="fTop"><option value="">All topics</option>${topics.map((t) => `<option value="${esc(t)}" ${f.topic === t ? "selected" : ""}>${esc(topicName(t))}</option>`).join("")}</select>
        <select id="fDiff"><option value="">Any difficulty</option>${[1, 2, 3].map((d) => `<option value="${d}" ${f.diff == d ? "selected" : ""}>${diffName(d)}</option>`).join("")}</select>
        <select id="fStat"><option value="">Any status</option><option value="new" ${f.status === "new" ? "selected" : ""}>Not tried</option><option value="wrong" ${f.status === "wrong" ? "selected" : ""}>Open mistakes</option><option value="right" ${f.status === "right" ? "selected" : ""}>Last answer right</option></select>
        <select id="fSrc"><option value="">All files</option>${sources.map((s) => `<option value="${esc(s)}" ${f.source === s ? "selected" : ""}>${esc(s.split("/").pop().replace(".md", ""))}</option>`).join("")}</select>
        <label class="chk"><input type="checkbox" id="fEx" ${f.ex === "1" ? "checked" : ""}> Include worked examples</label>
        <input type="text" id="fQ" placeholder="Search text" value="${esc(f.q)}" style="flex:1;min-width:140px">
      </div>${f.pat ? `<div class="note">Showing one practice set: <b>${esc(fileTitle(f.source))}</b>, ${esc(f.pat.replace(" · #", "").replace("#", ""))}${f.from ? ` ${esc(f.from)}–${esc(f.to)}` : ""}. <a href="#/bank">Show all questions</a></div>` : ""}<div id="bankList"></div>`;
    const apply = () => {
      const p = { section: $("#fSec").value, topic: $("#fTop").value, diff: $("#fDiff").value, status: $("#fStat").value, source: $("#fSrc").value, q: $("#fQ").value, ex: $("#fEx").checked ? "1" : "0" };
      if (p.section !== f.section) p.topic = "";
      location.hash = "#/bank?" + new URLSearchParams(Object.fromEntries(Object.entries(p).filter(([, v]) => v && v !== "0"))).toString();
    };
    $$(".filters select, #fEx", main).forEach((s) => s.addEventListener("change", apply));
    $("#fQ").addEventListener("keydown", (e) => { if (e.key === "Enter") apply(); });
    const list = D.questions.filter((q) => (f.ex === "1" || !q.isExample) && (!f.section || q.section === f.section) && (!f.topic || q.topic === f.topic) && (!f.diff || q.difficulty == f.diff) && (!f.source || q.source === f.source)
      && (!f.status || (f.status === "new" ? !S.qstats[q.id] : f.status === "wrong" ? S.qstats[q.id] && S.qstats[q.id].missed && !S.qstats[q.id].fixed : S.qstats[q.id] && S.qstats[q.id].lastOk))
      && (!f.pat || matchSet(q, f)) && (!f.q || (q.stem + " " + (q.label || "")).toLowerCase().includes(f.q.toLowerCase())));
    renderBankList(list, 0);
  };
  function renderBankList(list, page) {
    const per = 15; const box = $("#bankList");
    const slice = list.slice(page * per, page * per + per);
    box.innerHTML = `<p class="small muted">${list.length} questions</p>` + (list.length ? "" : `<div class="empty">No questions match these filters.</div>`) +
      slice.map((q) => { const st = S.qstats[q.id]; return `<div class="q-card" data-id="${esc(q.id)}"><div class="q-head">${secPill(q.section)}<span class="pill">${esc(topicName(q.topic))}</span><span class="pill">${diffName(q.difficulty)}</span>${st ? `<span class="pill ${st.lastOk ? "good" : "bad"}">${st.lastOk ? "Last: right" : "Last: wrong"} · ${st.c}/${st.a}</span>` : ""}<span class="lab">${esc(q.label || q.id)}</span></div><div class="qbody">${questionHTML(q)}</div><div class="row" style="margin-top:12px"><button class="btn sm primary" data-check>Check</button><button class="btn sm ghost" data-show>Just show the answer</button></div></div>`; }).join("") +
      (list.length > per ? `<div class="row">${page > 0 ? `<button class="btn" data-pg="${page - 1}">← Previous</button>` : ""}<span class="muted small">Page ${page + 1} of ${Math.ceil(list.length / per)}</span>${(page + 1) * per < list.length ? `<button class="btn" data-pg="${page + 1}">Next →</button>` : ""}</div>` : "");
    $$("[data-pg]", box).forEach((b) => b.addEventListener("click", () => { renderBankList(list, +b.dataset.pg); window.scrollTo(0, 0); }));
    $$(".q-card", box).forEach((card) => {
      const q = D.byId[card.dataset.id]; const body = $(".qbody", card); let given = null;
      wireQuestion(q, body, (g, selfGraded) => { given = g; if (selfGraded) finish(true); });
      const finish = (counted) => {
        if (counted && given != null) { const ok = kind(q) === "self" ? given === "self-ok" : grade(q, given); record(q, ok); save(); }
        body.innerHTML = questionHTML(q, { given: kind(q) === "self" ? null : given, reveal: true }); $$("[data-check],[data-show]", card).forEach((b) => b.remove());
      };
      $("[data-check]", card).addEventListener("click", () => { if (given == null) { toast("Choose an answer first."); return; } finish(true); });
      $("[data-show]", card).addEventListener("click", () => finish(false));
    });
  }

  /* ---------- exam builder ---------- */
  pages.exam = function () {
    if (S.active) { main.innerHTML = `<h1>Create exam</h1><div class="card"><p>You have an exam in progress: <b>${esc(S.active.name)}</b>.</p><div class="row"><a class="btn primary" href="#/run">Resume</a><button class="btn bad" id="discard">Discard it</button></div></div>`; $("#discard").onclick = () => { S.active = null; save(); pages.exam(); }; return; }
    const quantTopics = [...new Set(D.questions.filter((q) => q.section === "quant").map((q) => q.topic))];
    const verbalTopics = [...new Set(D.questions.filter((q) => q.section === "verbal").map((q) => q.topic))];
    const vocabTopics = [...new Set(D.questions.filter((q) => q.section === "vocab").map((q) => q.topic))].sort();
    const chip = (name, v, checked = true) => `<label><input type="checkbox" name="${name}" value="${esc(v)}" ${checked ? "checked" : ""}><span>${esc(topicName(v))}</span></label>`;
    main.innerHTML = `<div class="page-head"><div><h1>Create exam</h1><p>Pick a ready-made GRE-style exam, or build your own from the question bank. Exams are timed; you can mark questions for review and move freely inside a section, like the real test.</p></div></div>
      <h2>Ready-made</h2>
      <div class="grid g3" style="margin-bottom:24px">${Object.entries(GRE.PRESETS).map(([k, p]) => `<div class="card"><h3>${esc(p.name)}</h3><p class="small muted">${p.sections.map((s) => `${s.count} ${SECTION_NAMES[s.section]} in ${s.minutes} min`).join(" → ")}</p><button class="btn primary sm" data-preset="${k}">Start</button></div>`).join("")}</div>
      <h2>Build your own</h2>
      <div class="card builder">
        <label class="f">Section</label>
        <div class="tabs" id="bSec">${["quant", "verbal", "vocab", "mixed"].map((s, i) => `<button type="button" data-s="${s}" class="${i === 0 ? "on" : ""}">${s === "mixed" ? "Quant + Verbal" : SECTION_NAMES[s]}</button>`).join("")}</div>
        <div id="bTopicsQ"><label class="f">Quant topics</label><div class="chips">${quantTopics.map((t) => chip("tq", t)).join("")}</div></div>
        <div id="bTopicsV" style="display:none"><label class="f">Verbal topics</label><div class="chips">${verbalTopics.map((t) => chip("tv", t)).join("")}</div></div>
        <div id="bTopicsW" style="display:none"><label class="f">Vocab weeks</label><div class="chips">${vocabTopics.map((t) => chip("tw", t)).join("")}</div></div>
        <label class="f">Difficulty</label><div class="chips">${[1, 2, 3].map((d) => `<label><input type="checkbox" name="d" value="${d}" checked><span>${diffName(d)}</span></label>`).join("")}</div>
        <label class="f">Question pool</label><div class="chips">
          <label><input type="radio" name="pool" value="all" checked><span>All questions</span></label>
          <label><input type="radio" name="pool" value="new"><span>Only ones I haven't tried</span></label>
          <label><input type="radio" name="pool" value="missed"><span>Only my open mistakes</span></label></div>
        <div class="row" style="margin-top:12px">
          <label class="chk">Questions <input type="number" id="bCount" value="12" min="1" max="100" style="width:80px"></label>
          <label class="chk">Minutes <input type="number" id="bMin" value="21" min="0" max="240" style="width:80px"></label>
          <span class="small muted">(0 = untimed)</span>
          <label class="chk"><input type="checkbox" id="bEx"> Include worked examples</label>
        </div>
        <div class="row" style="margin-top:16px"><button class="btn primary" id="bStart">Start exam</button><span class="small muted" id="bInfo"></span></div>
      </div>`;
    wirePresetButtons(main);
    let sec = "quant";
    const per = { quant: 1.75, verbal: 1.5, vocab: 0.6, mixed: 1.65 };
    $$("#bSec button").forEach((b) => b.addEventListener("click", () => {
      $$("#bSec button").forEach((x) => x.classList.toggle("on", x === b)); sec = b.dataset.s;
      $("#bTopicsQ").style.display = sec === "quant" || sec === "mixed" ? "" : "none";
      $("#bTopicsV").style.display = sec === "verbal" || sec === "mixed" ? "" : "none";
      $("#bTopicsW").style.display = sec === "vocab" ? "" : "none";
      $("#bMin").value = Math.round(+$("#bCount").value * per[sec]); info();
    }));
    $("#bCount").addEventListener("input", () => { $("#bMin").value = Math.round(+$("#bCount").value * per[sec]); info(); });
    const cfg = () => {
      const vals = (n) => $$(`input[name=${n}]:checked`, main).map((i) => i.value);
      const topics = sec === "quant" ? vals("tq") : sec === "verbal" ? vals("tv") : sec === "vocab" ? vals("tw") : vals("tq").concat(vals("tv"));
      const pool = $("input[name=pool]:checked").value;
      return { name: "Custom: " + (sec === "mixed" ? "Quant + Verbal" : SECTION_NAMES[sec]), unseen: pool === "new", missed: pool === "missed", examples: $("#bEx").checked,
        sections: [{ section: sec === "mixed" ? "any" : sec, sectionsAllowed: sec === "mixed" ? ["quant", "verbal"] : null, topics, count: +$("#bCount").value || 10, minutes: +$("#bMin").value, difficulty: vals("d").map(Number) }] };
    };
    const info = () => { const c = cfg(); $("#bInfo").textContent = `${poolFor(c.sections[0], c).length} questions match.`; };
    $$("input", main).forEach((i) => i.addEventListener("change", info)); info();
    $("#bStart").addEventListener("click", () => startExam(cfg()));
  };
  function poolFor(s, cfg) {
    return D.questions.filter((q) => (cfg.examples || !q.isExample)
      && (s.section === "any" ? (!s.sectionsAllowed || s.sectionsAllowed.includes(q.section)) : q.section === s.section)
      && (!s.topics || !s.topics.length || s.topics.includes(q.topic))
      && (!s.types || s.types.includes(q.type))
      && (!s.difficulty || s.difficulty.includes(q.difficulty || 2))
      && (!cfg.unseen || !S.qstats[q.id])
      && (!cfg.missed || (S.qstats[q.id] && S.qstats[q.id].missed && !S.qstats[q.id].fixed)));
  }
  function pick(pool, count, used) {
    pool = pool.filter((q) => !used.has(q.id));
    const groups = {}; pool.forEach((q) => { const k = q.context || q.id; (groups[k] = groups[k] || []).push(q); });
    const out = [];
    for (const g of shuffle(Object.values(groups))) {
      if (out.length >= count) break;
      out.push(...g.slice(0, count - out.length));
    }
    out.forEach((q) => used.add(q.id));
    const order = (q) => (q.type === "qc" ? 0 : q.topic === "tc" || q.topic === "se" ? 0 : q.context ? 2 : 1);
    return out.sort((a, b) => order(a) - order(b) || String(a.context || "").localeCompare(String(b.context || "")));
  }
  function startPreset(key, task) {
    if (!GRE.PRESETS[key]) return; const p = JSON.parse(JSON.stringify(GRE.PRESETS[key])); if (task) p.task = task;
    if (p.weak) {
      const ts = topicStats(); const weak = Object.entries(ts).filter(([t, v]) => v.sec === "quant" && v.a >= 3).sort((a, b) => a[1].c / a[1].a - b[1].c / b[1].a).slice(0, 2).map(([t]) => t);
      if (weak.length) p.sections[0].topics = weak; else toast("Not enough history yet: using all Quant topics.");
    }
    startExam(p);
  }
  function startExam(cfg) {
    if (!D.questions.length) { toast("Question bank not loaded."); return; }
    if (S.active && !confirm("Discard the exam in progress and start a new one?")) return;
    const used = new Set();
    const sections = cfg.sections.map((s) => ({ section: s.section, minutes: s.minutes, ids: s.ids ? s.ids.slice() : pick(poolFor(s, cfg), s.count, used).map((q) => q.id) })).filter((s) => s.ids.length);
    if (!sections.length) { toast("No questions match. Widen the filters."); return; }
    S.active = { id: "e" + Date.now(), task: cfg.task || null, name: cfg.name || "Exam", sections, cur: 0, qi: 0, answers: {}, marks: {}, started: Date.now(), secStart: Date.now(), secUsed: [] };
    save(); location.hash = "#/run";
  }

  /* ---------- exam runner ---------- */
  let timerInt = null;
  pages.run = function () {
    clearInterval(timerInt);
    const E = S.active; if (!E) { location.hash = "#/exam"; return; }
    const sec = E.sections[E.cur]; const q = D.byId[sec.ids[E.qi]];
    if (!q) { finishExam(); return; }
    const limit = sec.minutes ? sec.minutes * 60 : 0;
    main.innerHTML = `<div class="exam-bar"><b>${esc(E.name)}</b><span class="pill">Section ${E.cur + 1} of ${E.sections.length} · ${SECTION_NAMES[sec.section] || "Mixed"}</span><span class="spacer"></span>
        <span class="timer" id="timer">--:--</span><button class="btn sm" id="markBtn">${E.marks[q.id] ? "★ Marked" : "☆ Mark"}</button><button class="btn sm" id="gridBtn">Review grid</button></div>
      <div class="q-card"><div class="q-head"><b>Question ${E.qi + 1} of ${sec.ids.length}</b><span class="lab">${esc(topicName(q.topic))}</span></div><div id="qbody">${questionHTML(q, { given: E.answers[q.id] })}</div></div>
      <div class="row"><button class="btn" id="prev" ${E.qi === 0 ? "disabled" : ""}>← Back</button><button class="btn primary" id="next">${E.qi === sec.ids.length - 1 ? "Review section" : "Next →"}</button><span class="spacer"></span><button class="btn" id="endSec">${E.cur === E.sections.length - 1 ? "Finish exam" : "End section"}</button><button class="btn sm" id="quit">Quit</button></div>
      <div id="grid" style="display:none" class="card"><h3>Section review</h3><div class="qgrid">${sec.ids.map((id, i) => `<button class="${E.answers[id] != null ? "ans" : ""} ${E.marks[id] ? "mark" : ""} ${i === E.qi ? "cur" : ""}" data-go="${i}">${i + 1}</button>`).join("")}</div><p class="small muted">Blue = answered · dot = marked. Unanswered questions count as wrong, so guess before time runs out.</p></div>`;
    const body = $("#qbody");
    wireQuestion(q, body, (g) => { E.answers[q.id] = g; save(); });
    $("#prev").onclick = () => { E.qi--; save(); pages.run(); };
    $("#next").onclick = () => { if (E.qi < sec.ids.length - 1) { E.qi++; save(); pages.run(); } else { $("#grid").style.display = ""; } };
    $("#gridBtn").onclick = () => { const g = $("#grid"); g.style.display = g.style.display ? "" : "none"; };
    $("#markBtn").onclick = () => { E.marks[q.id] = !E.marks[q.id]; save(); pages.run(); };
    $$("[data-go]").forEach((b) => (b.onclick = () => { E.qi = +b.dataset.go; save(); pages.run(); }));
    $("#endSec").onclick = () => { const un = sec.ids.filter((id) => E.answers[id] == null).length; if (!un || confirm(`${un} question(s) unanswered. End the section anyway?`)) endSection(); };
    $("#quit").onclick = () => { if (confirm("Quit and discard this exam?")) { S.active = null; save(); clearInterval(timerInt); location.hash = "#/exam"; } };
    const tick = () => {
      const used = (Date.now() - E.secStart) / 1000; const t = $("#timer"); if (!t) { clearInterval(timerInt); return; }
      if (limit) { const left = limit - used; t.textContent = fmtTime(left); t.classList.toggle("low", left < 120); if (left <= 0) { clearInterval(timerInt); toast("Time is up for this section."); endSection(); } }
      else t.textContent = fmtTime(used);
    };
    tick(); timerInt = setInterval(tick, 1000);
  };
  function endSection() {
    const E = S.active; clearInterval(timerInt);
    E.secUsed[E.cur] = (Date.now() - E.secStart) / 1000;
    if (E.cur < E.sections.length - 1) { E.cur++; E.qi = 0; E.secStart = Date.now(); save(); toast("Next section"); pages.run(); }
    else finishExam();
  }
  function finishExam() {
    const E = S.active; if (!E) return;
    const items = []; const byTopic = {};
    E.sections.forEach((s) => s.ids.forEach((id) => {
      const q = D.byId[id]; if (!q) return; const g = E.answers[id] ?? null; const ok = kind(q) === "self" ? g === "self-ok" : grade(q, g);
      record(q, ok); items.push({ id, given: g, ok, marked: !!E.marks[id] });
      const t = q.topic || "other"; byTopic[t] = byTopic[t] || { a: 0, c: 0 }; byTopic[t].a++; if (ok) byTopic[t].c++;
    }));
    if (E.task) S.done[E.task] = true;
    const res = { id: E.id, task: E.task || null, name: E.name, date: todayKey(), total: items.length, correct: items.filter((i) => i.ok).length, secs: E.secUsed.reduce((a, b) => a + (b || 0), 0), byTopic, items, sections: E.sections.map((s, i) => ({ section: s.section, n: s.ids.length, c: s.ids.filter((id) => (items.find((x) => x.id === id) || {}).ok).length, secs: E.secUsed[i] || 0 })) };
    S.exams.push(res); if (S.exams.length > 200) S.exams.shift(); S.active = null; save();
    location.hash = "#/result/" + res.id;
  }
  pages.result = function (id) {
    const r = S.exams.find((e) => e.id === id); if (!r) { main.innerHTML = `<div class="empty">Exam not found.</div>`; return; }
    main.innerHTML = `<div class="page-head"><div><h1>${esc(r.name)}</h1><p>${esc(r.date)} · ${fmtTime(r.secs)} used</p></div><div class="row">${r.task && findTask(r.task) ? `<a class="btn primary" href="#/today?day=${findTask(r.task).d.idx}">✓ Step done · back to plan</a>` : `<a class="btn primary" href="#/today">Back to today</a>`}<a class="btn" href="#/exam">New exam</a>${r.correct < r.total ? `<button class="btn" data-preset="missed">Redo my mistakes</button>` : ""}</div></div>
      <div class="grid g4"><div class="card"><div class="stat-label">Score</div><div class="stat">${r.correct}/${r.total}</div><div class="small muted">${pct(r.correct, r.total)}%</div></div>
        ${r.sections.map((s, i) => `<div class="card"><div class="stat-label">Section ${i + 1} · ${SECTION_NAMES[s.section] || "Mixed"}</div><div class="stat">${s.c}/${s.n}</div><div class="small muted">${fmtTime(s.secs)}</div></div>`).join("")}</div>
      <div class="card" style="margin-top:16px"><h2>By topic</h2><table class="data"><tr><th>Topic</th><th>Right</th><th>Accuracy</th></tr>${Object.entries(r.byTopic).sort((a, b) => a[1].c / a[1].a - b[1].c / b[1].a).map(([t, v]) => `<tr><td>${esc(topicName(t))}</td><td>${v.c}/${v.a}</td><td><div class="bar" style="width:140px"><i style="width:${pct(v.c, v.a)}%;background:${pct(v.c, v.a) >= 80 ? "var(--good)" : pct(v.c, v.a) >= 60 ? "var(--warn)" : "var(--bad)"}"></i></div></td></tr>`).join("")}</table></div>
      <div class="row" style="margin:20px 0 10px"><h2 style="margin:0">Review</h2><span class="spacer"></span><label class="chk"><input type="checkbox" id="onlyWrong" checked> Only wrong answers</label></div><div id="rev"></div>`;
    wirePresetButtons(main);
    const draw = () => {
      const only = $("#onlyWrong").checked;
      $("#rev").innerHTML = r.items.map((it, i) => ({ it, i })).filter(({ it }) => !only || !it.ok).map(({ it, i }) => { const q = D.byId[it.id]; if (!q) return ""; return `<div class="q-card"><div class="q-head"><b>Q${i + 1}</b><span class="pill ${it.ok ? "good" : "bad"}">${it.ok ? "Right" : it.given == null ? "Blank" : "Wrong"}</span>${it.marked ? `<span class="pill w">Marked</span>` : ""}<span class="pill">${esc(topicName(q.topic))}</span><span class="lab">${esc(q.label || q.id)}</span></div>${questionHTML(q, { given: it.given, reveal: true, name: "r" + i })}</div>`; }).join("") || `<div class="empty">No wrong answers. Well done.</div>`;
    };
    $("#onlyWrong").onchange = draw; draw();
  };

  /* ---------- mistakes ---------- */
  pages.mistakes = function () {
    const open = Object.entries(S.qstats).filter(([id, s]) => s.missed && !s.fixed && D.byId[id]);
    const fixed = Object.entries(S.qstats).filter(([id, s]) => s.fixed && D.byId[id]);
    main.innerHTML = `<div class="page-head"><div><h1>Mistakes log</h1><p>Every question you got wrong. A mistake is <b>fixed</b> after you answer it correctly on two different days. Add a one-line rule for each so it doesn't happen again.</p></div><button class="btn primary" data-preset="missed" ${open.length ? "" : "disabled"}>Redo open mistakes (${open.length})</button></div>
      <div class="grid g3"><div class="card"><div class="stat-label">Open</div><div class="stat">${open.length}</div></div><div class="card"><div class="stat-label">Fixed</div><div class="stat">${fixed.length}</div></div><div class="card"><div class="stat-label">Most missed topic</div><div class="stat" style="font-size:1.2rem">${esc(topicName(Object.entries(open.reduce((a, [id]) => { const t = D.byId[id].topic; a[t] = (a[t] || 0) + 1; return a; }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"))}</div></div></div>
      <div style="margin-top:16px">${open.length ? open.map(([id, s]) => { const q = D.byId[id]; return `<details class="q-card"><summary class="q-head" style="cursor:pointer">${secPill(q.section)}<span class="pill">${esc(topicName(q.topic))}</span><span class="pill bad">${s.c}/${s.a} right · ${(s.redo || []).length}/2 redos</span><span class="lab">${esc(q.label || id)}</span></summary>${questionHTML(q, { reveal: true })}<label class="f small" style="display:block;margin-top:10px"><b>My rule for next time</b></label><textarea data-note="${esc(id)}" placeholder="e.g. Test 0 and negatives before choosing A in QC.">${esc(S.notes[id] || "")}</textarea></details>`; }).join("") : `<div class="empty">No open mistakes. Answer questions in the bank or take an exam.</div>`}</div>`;
    $$("[data-note]", main).forEach((t) => t.addEventListener("change", () => { S.notes[t.dataset.note] = t.value; save(); toast("Saved"); }));
    wirePresetButtons(main);
  };

  /* ---------- vocab ---------- */
  pages.vocab = function (_, params) {
    if (!D.vocab.length) { main.innerHTML = `<h1>Vocab cards</h1><div class="empty">Vocabulary file not available yet.</div>`; return; }
    const day = params.day || "1"; const mode = params.mode || "learn";
    const days = [...new Set(D.vocab.map((w) => w.day))].sort((a, b) => a - b);
    let words = day === "all" ? D.vocab : day.startsWith("w") ? D.vocab.filter((w) => w.week == day.slice(1)) : D.vocab.filter((w) => w.day == day);
    if (mode === "due") words = words.filter((w) => (S.vocab[w.word] || 0) < 2);
    words = mode === "learn" ? words : shuffle(words);
    const known = (list) => list.filter((w) => S.vocab[w.word] === 2).length;
    main.innerHTML = `<div class="page-head"><div><h1>Vocab cards</h1><p>Look at the word, say its meaning out loud, then click the card to check. Rate yourself honestly: words you mark <b>Again</b> or <b>Hard</b> come back. ${known(D.vocab)} of ${D.vocab.length} words known.</p></div>
        <div class="row"><select id="vDay"><option value="all" ${day === "all" ? "selected" : ""}>All words</option>${[1, 2, 3, 4, 5, 6].map((w) => `<option value="w${w}" ${day === "w" + w ? "selected" : ""}>Week ${w}</option>`).join("")}${days.map((d) => { const t = (D.vocab.find((w) => w.day === d) || {}).theme; return `<option value="${d}" ${day == d ? "selected" : ""}>Day ${d}${t ? " · " + esc(t) : ""}</option>`; }).join("")}</select>
        <select id="vMode"><option value="learn" ${mode === "learn" ? "selected" : ""}>In order</option><option value="shuffle" ${mode === "shuffle" ? "selected" : ""}>Shuffled</option><option value="due" ${mode === "due" ? "selected" : ""}>Not yet known</option></select>
        <button class="btn" data-preset="vocab-20">Vocab quiz</button></div></div>
      <div id="flash"></div>
      <details class="card" style="margin-top:20px"><summary><b>See the full word list (${words.length})</b></summary><table class="data"><tr><th>Word</th><th>Meaning</th><th>Status</th></tr>${words.slice().sort((a, b) => a.day - b.day).map((w) => `<tr><td><b>${esc(w.word)}</b> <span class="muted small">${esc(w.pos || "")}</span></td><td>${esc(w.meaning)}<div class="small muted"><i>${esc(w.example || "")}</i></div></td><td>${["New", "Learning", "Known"][S.vocab[w.word] || 0]}</td></tr>`).join("")}</table></details>`;
    const go = () => (location.hash = `#/vocab?day=${$("#vDay").value}&mode=${$("#vMode").value}`);
    $("#vDay").onchange = go; $("#vMode").onchange = go; wirePresetButtons(main);
    let i = 0, flipped = false;
    const draw = () => {
      const box = $("#flash"); if (!words.length) { box.innerHTML = `<div class="empty">All words in this group are known. Pick another group.</div>`; return; }
      const w = words[i % words.length];
      box.innerHTML = `<div class="flash"><div class="flash-inner" id="card">${flipped ? `<div class="flash-back"><div class="flash-word" style="font-size:1.5rem;margin-bottom:8px">${esc(w.word)}</div><div class="mean">${esc(w.pos ? "(" + w.pos + ") " : "")}${esc(w.meaning)}</div><div class="ex">${esc(w.example || "")}</div>${w.synonyms ? `<p class="small" style="margin-top:10px">Synonyms: ${esc(Array.isArray(w.synonyms) ? w.synonyms.join(", ") : w.synonyms)}</p>` : ""}</div>` : `<div class="flash-word">${esc(w.word)}</div><p class="muted small" style="margin-top:12px">Say the meaning out loud, then click to flip</p>`}</div>
        <div class="row" style="justify-content:center;margin-top:14px"><span class="small muted">${(i % words.length) + 1} / ${words.length} · Day ${w.day}${w.theme ? " · " + esc(w.theme) : ""}</span></div>
        <div class="row" style="justify-content:center;margin-top:10px"><button class="btn bad" data-r="0">Again</button><button class="btn" data-r="1">Hard</button><button class="btn good" data-r="2">I know it</button></div></div>`;
      $("#card").onclick = () => { flipped = !flipped; draw(); };
      $$("[data-r]", box).forEach((b) => (b.onclick = () => { S.vocab[w.word] = +b.dataset.r; save(); i++; flipped = false; draw(); }));
    };
    draw();
  };

  /* ---------- advice / interviews ---------- */
  const stagesHTML = (list) => list.map((s) => `<div class="stage"><h3>${esc(s.stage)}</h3><ul>${s.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>`).join("");
  pages.advice = function () {
    main.innerHTML = `<div class="page-head"><div><h1>Advice by stage</h1><p>The advice that comes up again and again from high scorers, test-prep teachers and ETS itself, organised by where you are in your prep.</p></div></div>
      <div class="card">${stagesHTML(GRE.ADVICE)}</div>
      <p class="small muted" style="margin-top:12px">Sources: <a href="https://www.ets.org/gre/test-takers/general-test/prepare.html" target="_blank" rel="noopener">ETS official prep</a> · <a href="https://www.ets.org/gre/test-takers/general-test/test-day.html" target="_blank" rel="noopener">ETS test day</a> · <a href="https://magoosh.com/gre/gre-test-day/" target="_blank" rel="noopener">Magoosh: test day</a> · <a href="https://www.prepscholar.com/gre/blog/gre-test-day" target="_blank" rel="noopener">PrepScholar: test day</a> · <a href="https://www.joinleland.com/library/a/last-minute-gre-tips" target="_blank" rel="noopener">Leland: last-minute tips</a></p>`;
  };
  pages.interviews = function () {
    main.innerHTML = `<div class="page-head"><div><h1>Admission interviews</h1><p>After the GRE comes the application, and many MBA and some Master's and PhD programmes interview shortlisted applicants. Key points for every stage.</p></div></div>
      <div class="card">${stagesHTML(GRE.INTERVIEW)}</div>
      <div class="card"><h2>A simple story template (STAR)</h2><table class="data"><tr><td><b>Situation</b></td><td>One or two sentences of context: where, when, what was at stake.</td></tr><tr><td><b>Task</b></td><td>What you were responsible for.</td></tr><tr><td><b>Action</b></td><td>What <i>you</i> did, step by step. This should be the longest part.</td></tr><tr><td><b>Result</b></td><td>The outcome in numbers if possible, and what you learned.</td></tr></table></div>
      <p class="small muted" style="margin-top:12px">Sources: <a href="https://capd.mit.edu/resources/graduate-school-interviews/" target="_blank" rel="noopener">MIT CAPD</a> · <a href="https://www.mba.com/how-to-apply/admissions-interviews/commonly-asked-business-school-interview-questions" target="_blank" rel="noopener">mba.com</a> · <a href="https://www.ets.org/content/ets-org/ca/en/grad-school-journey/ace-your-interview.html" target="_blank" rel="noopener">ETS: ace your interview</a> · <a href="https://www.uc.edu/news/articles/2025/05/grad-school-interview-questions.html" target="_blank" rel="noopener">University of Cincinnati</a> · <a href="https://www.timeshighereducation.com/student/advice/how-prepare-mba-interview-according-admissions-experts" target="_blank" rel="noopener">THE: MBA interviews</a></p>`;
  };

  /* ---------- resources ---------- */
  pages.resources = function () {
    const card = (r) => `<div class="card"><h3>${esc(r.name)}</h3><p class="small muted">${esc(r.note)}</p><a class="btn sm ${r.dl ? "primary" : ""}" href="${esc(r.url)}" target="_blank" rel="noopener">${r.dl ? "↓ Download from ETS" : "Open"}</a></div>`;
    main.innerHTML = `<div class="page-head"><div><h1>Official resources</h1><p>Free official ETS downloads and tools, and the paid official books worth buying. Downloads open from ETS's own site, so you always get the current version.</p></div></div>
      <h2>Free official downloads and tools</h2><div class="grid g3">${GRE.RESOURCES.free.map(card).join("")}</div>
      <h2 style="margin-top:24px">Official books and tests (paid)</h2>
      <p class="muted small">These are copyrighted ETS products, so they are not stored in this repository. Buy the eBook or print edition from ETS, Amazon or the publisher.</p>
      <div class="grid g3">${GRE.RESOURCES.paid.map(card).join("")}</div>
      <h2 style="margin-top:24px">Optional extras</h2><div class="grid g3">${GRE.RESOURCES.optional.map(card).join("")}</div>
      <h2 style="margin-top:24px">This course as files</h2><div class="card"><p>Everything in this site is plain Markdown in the repository, so you can read it offline or in any editor.</p><div class="row"><a class="btn" href="04-Vocab/anki-import.tsv" download>↓ Anki vocab file (600 words)</a><a class="btn" href="site/data/questions.json" download>↓ Question bank (JSON)</a><a class="btn" href="#/lessons">All lessons</a></div></div>`;
  };

  /* ---------- progress ---------- */
  pages.progress = async function () {
    try { await loadPlan(); } catch (e) { /* plan optional here */ }
    const items = syllabusItems(); const sc = stateCounts(items);
    const att = Object.values(S.qstats); const attempts = att.reduce((a, s) => a + s.a, 0), correct = att.reduce((a, s) => a + s.c, 0);
    const openMiss = att.filter((s) => s.missed && !s.fixed).length;
    const known = Object.values(S.vocab).filter((v) => v === 2).length;
    const daysDone = PLAN ? PLAN.days.filter(dayDone).length : 0;
    const ts = topicStats(); const weak = Object.entries(ts).filter(([, v]) => v.a >= 3).sort((a, b) => a[1].c / a[1].a - b[1].c / b[1].a).slice(0, 5);
    main.innerHTML = `<div class="page-head"><div><h1>Progress</h1><p>How you're doing, where you're weak, and your settings. Everything is saved in this browser only.</p></div></div>
      <div class="grid g4">
        <div class="card"><div class="stat-label">Plan days done</div><div class="stat">${daysDone}<small>/${planLen()}</small></div></div>
        <div class="card"><div class="stat-label">Question accuracy</div><div class="stat">${attempts ? pct(correct, attempts) + "%" : "—"}</div><div class="small muted">${attempts} answered · ${S.exams.length} exams</div></div>
        <div class="card"><div class="stat-label">Open mistakes</div><div class="stat">${openMiss}</div><div class="small muted"><a href="#/mistakes">Open the log</a></div></div>
        <div class="card"><div class="stat-label">Words known</div><div class="stat">${known}<small>/${D.vocab.length || 600}</small></div></div>
      </div>
      <div class="grid g2" style="margin-top:16px">
        <div class="card"><h2>Weakest topics</h2>${weak.length ? `<table class="data">${weak.map(([t, v]) => `<tr><td>${esc(topicName(t))}</td><td>${pct(v.c, v.a)}%</td><td style="text-align:right"><button class="btn sm" data-topic-drill="${esc(t)}">Drill 12</button></td></tr>`).join("")}</table>` : `<p class="muted small">Answer at least 3 questions in a topic and your weakest topics will show here.</p>`}</div>
        <div class="card"><h2>Syllabus</h2>
          ${GRE.SYLLABUS.map((sec) => { const its = items.filter((i) => i.sec === sec.section); const c = stateCounts(its); return `<div style="margin:10px 0"><div class="row"><b>${sec.section}</b><span class="spacer"></span><span class="small muted">${c[3]}/${its.length} mastered</span></div>${stateBar(c)}</div>`; }).join("")}
          <div class="legend" style="margin-top:10px"><span style="--c:var(--s1)">Studied</span><span style="--c:var(--s2)">Revised</span><span style="--c:var(--s3)">Mastered</span></div>
          <p style="margin:12px 0 0"><a href="#/syllabus">Update the checklist →</a> <span class="small muted">(${pct(sc[3], items.length)}% mastered)</span></p></div>
      </div>
      <div class="card" style="margin-top:16px"><h2>Exams</h2>${examTable(S.exams.slice().reverse())}</div>
      <h2 style="margin-top:28px">Settings</h2>
      <div class="grid g2"><div class="card"><h3>Test date</h3><input type="date" id="tDate" value="${esc(S.settings.testDate)}"><p class="small muted" style="margin-top:8px">The ${planLen()}-day plan ends on this date, so changing it moves the whole plan.</p></div>
      <div class="card"><h3>Backup</h3><div class="row"><button class="btn primary" id="exp">↓ Download backup</button><label class="btn">↑ Import backup<input type="file" id="imp" accept="application/json" hidden></label></div><p class="small muted" style="margin-top:8px">Import replaces the progress in this browser.</p></div></div>
            <div class="card" style="margin-top:16px"><h3>Reset</h3><p class="small muted">Deletes all progress in this browser. Download a backup first.</p><button class="btn bad" id="reset">Reset all progress</button></div>`;
    $("#tDate").onchange = (e) => { if (!e.target.value) return; S.settings.testDate = e.target.value; save(); setCountdown(); toast("Saved. The plan now ends on this date."); };
    wirePresetButtons(main);
    $("#exp").onclick = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type: "application/json" })); a.download = `gre-progress-${todayKey()}.json`; a.click(); };
    $("#imp").onchange = async (e) => { try { const d = JSON.parse(await e.target.files[0].text()); S = Object.assign(blank(), d); save(); toast("Progress imported"); pages.progress(); setCountdown(); } catch (err) { toast("That file is not a valid backup."); } };
    $("#reset").onclick = () => { if (confirm("Delete all progress in this browser? This cannot be undone.")) { S = blank(); save(); pages.progress(); } };
  };

  /* ================= ROUTER ================= */
  function setCountdown() {
    const days = Math.ceil((new Date(S.settings.testDate + "T09:00:00") - new Date()) / 864e5);
    $("#countdown").innerHTML = days > 0 ? `<b>${days}</b> days to test` : "";
  }
  async function route() {
    clearInterval(timerInt);
    const h = location.hash.replace(/^#\/?/, "") || "today";
    const [pathPart, query] = h.split("?");
    const [name, ...rest] = pathPart.split("/");
    const params = Object.fromEntries(new URLSearchParams(query || ""));
    const navName = { dashboard: "today", schedule: "plan", lesson: "lessons", run: "exam", result: "exam" }[name] || name;
    $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === navName || (a.dataset.nav === "practice" && ["bank", "exam", "mistakes"].includes(navName) && !!a.closest(".bottomnav"))));
    $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("open");
    const fn = pages[{ dashboard: "today", schedule: "plan" }[name] || name] || pages.today;
    try { await fn(rest.join("/"), params); if (params.task && name !== "today") await showTaskBanner(params.task); } catch (e) { console.error(e); main.innerHTML = `<div class="empty">Something went wrong loading this page.</div>`; }
    window.scrollTo(0, 0);
  }

  /* theme + menu */
  const applyTheme = (t) => { if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; };
  applyTheme(S.settings.theme);
  $("#themeBtn").onclick = () => {
    const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    S.settings.theme = dark ? "light" : "dark"; applyTheme(S.settings.theme); save();
  };
  $("#menuBtn").onclick = () => { $("#sidebar").classList.toggle("open"); $("#scrim").classList.toggle("open"); };
  $("#scrim").onclick = () => { $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("open"); };

  window.addEventListener("hashchange", route);
  setCountdown();
  loadData().then(route);
})();
