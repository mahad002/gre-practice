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
  const blank = () => ({ syllabus: {}, checks: {}, qstats: {}, exams: [], vocab: {}, notes: {}, settings: { testDate: GRE.TEST_DATE_DEFAULT }, active: null });
  let S;
  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { S = blank(); }
  S.settings = Object.assign({ testDate: GRE.TEST_DATE_DEFAULT }, S.settings || {});
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

  pages.dashboard = async function () {
    const items = syllabusItems();
    const days = Math.ceil((new Date(S.settings.testDate + "T09:00:00") - new Date()) / 864e5);
    const att = Object.values(S.qstats); const attempts = att.reduce((a, s) => a + s.a, 0), correct = att.reduce((a, s) => a + s.c, 0);
    const openMiss = Object.entries(S.qstats).filter(([, s]) => s.missed && !s.fixed).length;
    const known = Object.values(S.vocab).filter((v) => v === 2).length;
    const ts = topicStats(); const weak = Object.entries(ts).filter(([, v]) => v.a >= 3).sort((a, b) => a[1].c / a[1].a - b[1].c / b[1].a).slice(0, 4);
    let today = "";
    try { today = todayScheduleHTML(await loadMd("01-Plan/Study-Schedule.md")); } catch (e) { today = ""; }
    main.innerHTML = `
      <div class="page-head"><div><h1>Dashboard</h1><p>Your GRE prep in one place. Progress is saved in this browser; back it up from <a href="#/progress">Progress &amp; backup</a>.</p></div>
        <div class="row"><a class="btn primary" href="#/schedule">Today's plan</a><a class="btn" href="#/exam">Create exam</a></div></div>
      <div class="grid g4">
        <div class="card"><div class="stat-label">Days to test</div><div class="stat">${days > 0 ? days : "—"}</div><div class="small muted">${esc(new Date(S.settings.testDate).toDateString())}</div></div>
        <div class="card"><div class="stat-label">Syllabus mastered</div><div class="stat">${pct(stateCounts(items)[3], items.length)}%</div>${stateBar(stateCounts(items))}</div>
        <div class="card"><div class="stat-label">Question accuracy</div><div class="stat">${attempts ? pct(correct, attempts) + "%" : "—"}</div><div class="small muted">${attempts} answered · ${S.exams.length} exams</div></div>
        <div class="card"><div class="stat-label">Open mistakes</div><div class="stat">${openMiss}</div><div class="small muted">${known} / ${D.vocab.length || 600} words known</div></div>
      </div>
      ${today ? `<div class="card" style="margin-top:16px">${today}</div>` : ""}
      <div class="grid g2" style="margin-top:16px">
        <div class="card"><h2>Syllabus by section</h2>
          ${GRE.SYLLABUS.map((sec) => { const its = items.filter((i) => i.sec === sec.section); const c = stateCounts(its); return `<div style="margin:10px 0"><div class="row"><b>${sec.section}</b><span class="spacer"></span><span class="small muted">${c[3]} mastered · ${c[2]} revised · ${c[1]} studied / ${its.length}</span></div>${stateBar(c)}</div>`; }).join("")}
          <div class="legend" style="margin-top:10px"><span style="--c:var(--s1)">Studied</span><span style="--c:var(--s2)">Revised</span><span style="--c:var(--s3)">Mastered</span></div>
          <p style="margin-top:12px"><a href="#/syllabus">Open checklist →</a></p></div>
        <div class="card"><h2>Quick exams</h2>
          <div class="grid" style="gap:8px">${["quant-s1", "verbal-s1", "mini-mock", "daily-16", "missed"].map((p) => `<button class="btn" data-preset="${p}" style="justify-content:flex-start">⏱ ${esc(GRE.PRESETS[p].name)}</button>`).join("")}</div>
          <h3 style="margin-top:16px">Weakest topics</h3>
          ${weak.length ? `<table class="data">${weak.map(([t, v]) => `<tr><td>${esc(topicName(t))}</td><td>${pct(v.c, v.a)}%</td><td><button class="btn sm" data-topic-drill="${esc(t)}">Drill</button></td></tr>`).join("")}</table>` : `<p class="muted small">Answer a few questions to see your weak topics here.</p>`}
        </div>
      </div>
      <div class="card" style="margin-top:16px"><h2>Recent exams</h2>${examTable(S.exams.slice(-5).reverse())}</div>`;
    wirePresetButtons(main);
  };

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

  /* ---------- schedule ---------- */
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function todayLabel() { const d = new Date(); return `${DOW[d.getDay()]} ${d.getDate()}`; }
  function todayScheduleHTML(text) {
    const lab = todayLabel(); const lines = text.split("\n");
    let header = null, row = null, week = "";
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (l.startsWith("## ")) week = l.slice(3);
      if (/^\|\s*Day\s*\|/.test(l)) header = l;
      const m = l.match(/^\|\s*\**([A-Z][a-z]{2} \d{1,2})\**\s*\|/);
      if (m && m[1] === lab) { row = l; break; }
    }
    if (!row || !header) return `<h2>Today</h2><p class="muted">No schedule row for ${esc(lab)}. Open the <a href="#/schedule">full schedule</a>.</p>`;
    return `<div class="row"><h2 style="margin:0">Today · ${esc(lab)}</h2><span class="pill">${esc(week)}</span><span class="spacer"></span><a href="#/schedule">Full schedule →</a></div><div class="md">${linkify(md(header + "\n" + header.replace(/[^|]+/g, "---") + "\n" + row), "01-Plan/Study-Schedule.md")}</div>`;
  }
  pages.schedule = async function () {
    const path = "01-Plan/Study-Schedule.md";
    main.innerHTML = `<div class="page-head"><div><h1>Daily schedule</h1><p>Tick each row when it's done. Today's row is highlighted.</p></div><a class="btn" href="#/lesson/${encodeURIComponent(path)}">Open as lesson</a></div><div class="card md" id="sched">Loading…</div>`;
    const el = $("#sched");
    try { el.innerHTML = linkify(md(await loadMd(path)), path); } catch (e) { el.innerHTML = `<p>Could not load the schedule.</p>`; return; }
    enhanceChecks(el, path);
    const lab = todayLabel();
    $$("tr", el).forEach((tr) => { const td = tr.querySelector("td"); if (td && td.textContent.replace(/\*/g, "").trim() === lab) { tr.style.background = "var(--accent-soft)"; tr.classList.add("today-row"); setTimeout(() => tr.scrollIntoView({ block: "center" }), 50); } });
  };

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
    main.innerHTML = `<div class="lesson-layout"><aside class="lesson-nav card">${lessonNav(path)}</aside><article class="card md" id="lesson">Loading…</article></div>`;
    const el = $("#lesson");
    try {
      const text = await loadMd(path);
      el.innerHTML = `<p class="small muted">${esc(path)}</p>` + linkify(md(text), path);
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
    return html.replace(/<code>([^<]+?\.md)<\/code>/g, (m, p) => { const r = resolve(p.replace(/^\.\//, "")); return r ? `<a class="mdlink" href="#/lesson/${encodeURIComponent(r)}"><code>${esc(p)}</code></a>` : m; });
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
    const f = Object.assign({ section: "", topic: "", diff: "", status: "", q: "", source: "", ex: "0" }, params);
    const topics = [...new Set(D.questions.filter((q) => !f.section || q.section === f.section).map((q) => q.topic))];
    const sources = [...new Set(D.questions.map((q) => q.source))].sort();
    main.innerHTML = `<div class="page-head"><div><h1>Question bank</h1><p>${D.questions.length} original questions with explanations. Answer, check, and your result is saved. Wrong answers go to the <a href="#/mistakes">mistakes log</a>.</p></div><a class="btn primary" href="#/exam">Create exam from bank</a></div>
      <div class="card filters">
        <select id="fSec"><option value="">All sections</option>${["quant", "verbal", "vocab"].map((s) => `<option value="${s}" ${f.section === s ? "selected" : ""}>${SECTION_NAMES[s]}</option>`).join("")}</select>
        <select id="fTop"><option value="">All topics</option>${topics.map((t) => `<option value="${esc(t)}" ${f.topic === t ? "selected" : ""}>${esc(topicName(t))}</option>`).join("")}</select>
        <select id="fDiff"><option value="">Any difficulty</option>${[1, 2, 3].map((d) => `<option value="${d}" ${f.diff == d ? "selected" : ""}>${diffName(d)}</option>`).join("")}</select>
        <select id="fStat"><option value="">Any status</option><option value="new" ${f.status === "new" ? "selected" : ""}>Not tried</option><option value="wrong" ${f.status === "wrong" ? "selected" : ""}>Open mistakes</option><option value="right" ${f.status === "right" ? "selected" : ""}>Last answer right</option></select>
        <select id="fSrc"><option value="">All files</option>${sources.map((s) => `<option value="${esc(s)}" ${f.source === s ? "selected" : ""}>${esc(s.split("/").pop().replace(".md", ""))}</option>`).join("")}</select>
        <label class="chk"><input type="checkbox" id="fEx" ${f.ex === "1" ? "checked" : ""}> Include worked examples</label>
        <input type="text" id="fQ" placeholder="Search text" value="${esc(f.q)}" style="flex:1;min-width:140px">
      </div><div id="bankList"></div>`;
    const apply = () => {
      const p = { section: $("#fSec").value, topic: $("#fTop").value, diff: $("#fDiff").value, status: $("#fStat").value, source: $("#fSrc").value, q: $("#fQ").value, ex: $("#fEx").checked ? "1" : "0" };
      if (p.section !== f.section) p.topic = "";
      location.hash = "#/bank?" + new URLSearchParams(Object.fromEntries(Object.entries(p).filter(([, v]) => v && v !== "0"))).toString();
    };
    $$(".filters select, #fEx", main).forEach((s) => s.addEventListener("change", apply));
    $("#fQ").addEventListener("keydown", (e) => { if (e.key === "Enter") apply(); });
    const list = D.questions.filter((q) => (f.ex === "1" || !q.isExample) && (!f.section || q.section === f.section) && (!f.topic || q.topic === f.topic) && (!f.diff || q.difficulty == f.diff) && (!f.source || q.source === f.source)
      && (!f.status || (f.status === "new" ? !S.qstats[q.id] : f.status === "wrong" ? S.qstats[q.id] && S.qstats[q.id].missed && !S.qstats[q.id].fixed : S.qstats[q.id] && S.qstats[q.id].lastOk))
      && (!f.q || (q.stem + " " + (q.label || "")).toLowerCase().includes(f.q.toLowerCase())));
    renderBankList(list, 0);
  };
  function renderBankList(list, page) {
    const per = 15; const box = $("#bankList");
    const slice = list.slice(page * per, page * per + per);
    box.innerHTML = `<p class="small muted">${list.length} questions</p>` + (list.length ? "" : `<div class="empty">No questions match these filters.</div>`) +
      slice.map((q) => { const st = S.qstats[q.id]; return `<div class="q-card" data-id="${esc(q.id)}"><div class="q-head">${secPill(q.section)}<span class="pill">${esc(topicName(q.topic))}</span><span class="pill">${diffName(q.difficulty)}</span>${st ? `<span class="pill ${st.lastOk ? "good" : "bad"}">${st.lastOk ? "Last: right" : "Last: wrong"} · ${st.c}/${st.a}</span>` : ""}<span class="lab">${esc(q.label || q.id)}</span></div><div class="qbody">${questionHTML(q)}</div><div class="row" style="margin-top:12px"><button class="btn sm primary" data-check>Check answer</button><button class="btn sm" data-show>Show answer</button></div></div>`; }).join("") +
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
  function startPreset(key) {
    const p = JSON.parse(JSON.stringify(GRE.PRESETS[key])); if (!p) return;
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
    const sections = cfg.sections.map((s) => ({ section: s.section, minutes: s.minutes, ids: pick(poolFor(s, cfg), s.count, used).map((q) => q.id) })).filter((s) => s.ids.length);
    if (!sections.length) { toast("No questions match. Widen the filters."); return; }
    S.active = { id: "e" + Date.now(), name: cfg.name || "Exam", sections, cur: 0, qi: 0, answers: {}, marks: {}, started: Date.now(), secStart: Date.now(), secUsed: [] };
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
    const res = { id: E.id, name: E.name, date: todayKey(), total: items.length, correct: items.filter((i) => i.ok).length, secs: E.secUsed.reduce((a, b) => a + (b || 0), 0), byTopic, items, sections: E.sections.map((s, i) => ({ section: s.section, n: s.ids.length, c: s.ids.filter((id) => (items.find((x) => x.id === id) || {}).ok).length, secs: E.secUsed[i] || 0 })) };
    S.exams.push(res); if (S.exams.length > 200) S.exams.shift(); S.active = null; save();
    location.hash = "#/result/" + res.id;
  }
  pages.result = function (id) {
    const r = S.exams.find((e) => e.id === id); if (!r) { main.innerHTML = `<div class="empty">Exam not found.</div>`; return; }
    main.innerHTML = `<div class="page-head"><div><h1>${esc(r.name)}</h1><p>${esc(r.date)} · ${fmtTime(r.secs)} used</p></div><div class="row"><a class="btn" href="#/exam">New exam</a><button class="btn primary" data-preset="missed">Redo my mistakes</button></div></div>
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
    main.innerHTML = `<div class="page-head"><div><h1>Vocab cards</h1><p>600 GRE words in 30 daily groups. Learn 20 a day. Click a card to flip it, then rate yourself. ${known(D.vocab)} of ${D.vocab.length} known.</p></div>
        <div class="row"><select id="vDay"><option value="all" ${day === "all" ? "selected" : ""}>All words</option>${[1, 2, 3, 4, 5, 6].map((w) => `<option value="w${w}" ${day === "w" + w ? "selected" : ""}>Week ${w}</option>`).join("")}${days.map((d) => { const t = (D.vocab.find((w) => w.day === d) || {}).theme; return `<option value="${d}" ${day == d ? "selected" : ""}>Day ${d}${t ? " · " + esc(t) : ""}</option>`; }).join("")}</select>
        <select id="vMode"><option value="learn" ${mode === "learn" ? "selected" : ""}>In order</option><option value="shuffle" ${mode === "shuffle" ? "selected" : ""}>Shuffled</option><option value="due" ${mode === "due" ? "selected" : ""}>Not yet known</option></select>
        <button class="btn" data-preset="vocab-20">Vocab quiz</button></div></div>
      <div id="flash"></div>
      <div class="card" style="margin-top:20px"><h2>Word list</h2><table class="data"><tr><th>Word</th><th>Meaning</th><th>Status</th></tr>${words.slice().sort((a, b) => a.day - b.day).map((w) => `<tr><td><b>${esc(w.word)}</b> <span class="muted small">${esc(w.pos || "")}</span></td><td>${esc(w.meaning)}<div class="small muted"><i>${esc(w.example || "")}</i></div></td><td>${["New", "Learning", "Known"][S.vocab[w.word] || 0]}</td></tr>`).join("")}</table></div>`;
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
  pages.progress = function () {
    main.innerHTML = `<div class="page-head"><div><h1>Progress &amp; backup</h1><p>Your checklist, answers, exams and vocab ratings are saved in this browser only. Download a backup now and then, and import it on another device to continue there.</p></div></div>
      <div class="grid g2"><div class="card"><h2>Test date</h2><input type="date" id="tDate" value="${esc(S.settings.testDate)}"><p class="small muted" style="margin-top:8px">Used for the countdown.</p></div>
      <div class="card"><h2>Backup</h2><div class="row"><button class="btn primary" id="exp">↓ Download backup</button><label class="btn">↑ Import backup<input type="file" id="imp" accept="application/json" hidden></label></div><p class="small muted" style="margin-top:8px">Import replaces the progress in this browser.</p></div></div>
      <div class="card" style="margin-top:16px"><h2>All exams</h2>${examTable(S.exams.slice().reverse())}</div>
      <div class="card" style="margin-top:16px"><h2>Reset</h2><p class="small muted">Deletes all progress in this browser. Download a backup first.</p><button class="btn bad" id="reset">Reset all progress</button></div>`;
    $("#tDate").onchange = (e) => { S.settings.testDate = e.target.value; save(); setCountdown(); toast("Saved"); };
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
    const h = location.hash.replace(/^#\/?/, "") || "dashboard";
    const [pathPart, query] = h.split("?");
    const [name, ...rest] = pathPart.split("/");
    const params = Object.fromEntries(new URLSearchParams(query || ""));
    $$(".sidebar a").forEach((a) => a.classList.toggle("active", a.dataset.nav === name || (name === "lesson" && a.dataset.nav === "lessons") || ((name === "run" || name === "result") && a.dataset.nav === "exam")));
    $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("open");
    const fn = pages[name] || pages.dashboard;
    try { await fn(rest.join("/"), params); } catch (e) { console.error(e); main.innerHTML = `<div class="empty">Something went wrong loading this page.</div>`; }
    if (name !== "lesson" && name !== "schedule") window.scrollTo(0, 0);
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
