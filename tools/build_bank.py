#!/usr/bin/env python3
"""Build the GRE question bank JSON files from the course markdown.

Usage (from anywhere):
    python3 tools/build_bank.py            # build + per-file summary + validation
    python3 tools/build_bank.py --sample 3 # also print N random questions per file

Writes (paths relative to the course root):
    site/data/questions.json
    site/data/vocab.json
    site/data/manifest.json

Standard library only. The markdown files are read, never modified.
"""

import argparse
import datetime
import json
import os
import random
import re
import sys
from collections import Counter, OrderedDict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "site", "data")

QC_OPTIONS = [
    {"key": "A", "text": "Quantity A is greater."},
    {"key": "B", "text": "Quantity B is greater."},
    {"key": "C", "text": "The two quantities are equal."},
    {"key": "D", "text": "The relationship cannot be determined from the information given."},
]

QUANT_FILES = [
    ("01", "02-Quant/01-Arithmetic-and-Number-Properties.md", "arithmetic", "Arithmetic"),
    ("02", "02-Quant/02-Fractions-Percents-Ratios.md", "fractions-percents-ratios", "Fractions, Percents, Ratios"),
    ("03", "02-Quant/03-Exponents-and-Roots.md", "exponents-roots", "Exponents and Roots"),
    ("04", "02-Quant/04-Algebra.md", "algebra", "Algebra"),
    ("05", "02-Quant/05-Word-Problems.md", "word-problems", "Word Problems"),
    ("06", "02-Quant/06-Geometry.md", "geometry", "Geometry"),
    ("07", "02-Quant/07-Coordinate-Geometry.md", "coordinate-geometry", "Coordinate Geometry"),
    ("08", "02-Quant/08-Statistics.md", "statistics", "Statistics"),
    ("09", "02-Quant/09-Counting-and-Probability.md", "counting-probability", "Counting and Probability"),
    ("10", "02-Quant/10-Data-Interpretation.md", "data-interpretation", "Data Interpretation"),
]

# Bracketed topic names in 12-Mixed-Timed-Sets.md -> topic keys (first match wins).
TIMED_TOPIC_MAP = [
    ("coordinate geometry", "coordinate-geometry"),
    ("data interpretation", "data-interpretation"),
    ("number properties", "arithmetic"),
    ("arithmetic", "arithmetic"),
    ("percents", "fractions-percents-ratios"),
    ("ratios", "fractions-percents-ratios"),
    ("fractions", "fractions-percents-ratios"),
    ("exponents", "exponents-roots"),
    ("roots", "exponents-roots"),
    ("algebra", "algebra"),
    ("functions", "algebra"),
    ("inequalities", "algebra"),
    ("sequences", "algebra"),
    ("word problems", "word-problems"),
    ("geometry", "geometry"),
    ("statistics", "statistics"),
    ("counting", "counting-probability"),
    ("probability", "counting-probability"),
]

QUANT_TYPE_MAP = {
    "quantitative comparison": "qc",
    "qc": "qc",
    "multiple choice, one answer": "mc",
    "multiple choice": "mc",
    "numeric entry": "numeric",
    "select all that apply": "multi",
}

TYPES_DOC = OrderedDict([
    ("qc", "Quantitative Comparison: given info in stem, quantities in qa/qb, standard options A-D, one answer"),
    ("mc", "Multiple choice, exactly one answer"),
    ("multi", "Select all that apply; selectCount (if present) says exactly how many to pick"),
    ("numeric", "Numeric entry; answer is a single string (integer, decimal or fraction)"),
    ("tc1", "One-blank Text Completion, five options, one answer"),
    ("tcN", "Two- or three-blank Text Completion; options are in blanks[], answer has one key per blank"),
    ("passage", "Select-in-passage (RC); answer is the start of the correct sentence"),
    ("fill", "Vocabulary fill-the-blank, five options, one answer"),
])

problems = []  # (id, message) for anything that did not parse cleanly


def warn(qid, msg):
    problems.append((qid, msg))


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as fh:
        return fh.read()


def section(text, start_pat, end_pat=r"^## "):
    """Return the text after the heading matching start_pat up to the next end_pat."""
    m = re.search(start_pat, text, re.M)
    if not m:
        return ""
    rest = text[m.end():]
    e = re.search(end_pat, rest, re.M)
    return rest[: e.start()] if e else rest


def clean(md):
    """Trim blank lines and trailing spacer lines ('.', '---')."""
    lines = md.strip("\n").split("\n")
    while lines and lines[-1].strip() in ("", ".", "---"):
        lines.pop()
    while lines and lines[0].strip() == "":
        lines.pop(0)
    return "\n".join(lines).strip()


def letters(s):
    return re.findall(r"\b([A-J])\b", s)


def norm_numeric(s):
    s = s.strip().rstrip(".").strip()
    s = s.replace(",", "") if re.fullmatch(r"-?[\d,]+(\.\d+)?", s) else s
    return s


OPT_SPLIT = re.compile(r"(?:^|(?<=\s))\(([A-J])\)\s+")


def split_options(md):
    """Separate a question body into (stem_md, options) where options come from
    '(A) ... (B) ...' lines (inline or one per line). Ignores code fences."""
    lines = md.split("\n")
    in_code = False
    start = None
    for i, ln in enumerate(lines):
        if ln.strip().startswith("```"):
            in_code = not in_code
            continue
        if not in_code and re.match(r"^\s*\(A\)\s", ln):
            start = i
            break
    if start is None:
        return clean(md), []
    stem = clean("\n".join(lines[:start]))
    opt_text = " ".join(l.strip() for l in lines[start:] if l.strip())
    parts = OPT_SPLIT.split(opt_text)
    opts = []
    for k in range(1, len(parts) - 1, 2):
        opts.append({"key": parts[k], "text": parts[k + 1].strip()})
    return stem, opts


def split_qc(md):
    """Pull 'Quantity A:' / 'Quantity B:' lines (or inline) out of a QC body."""
    qa = qb = None
    m = re.search(r"Quantity A:\s*(.*?)\s*(?=Quantity B:)", md, re.S)
    m2 = re.search(r"Quantity B:\s*(.*?)\s*$", md, re.S)
    if m and m2:
        qa = m.group(1).strip()
        qb = m2.group(1).strip()
        given = md[: md.find("Quantity A:")]
        return clean(given), qa, qb
    return clean(md), qa, qb


def qc_inline_cleanup(qa, qb):
    # In the inline QC drill, quantities end with '.' that belongs to the sentence.
    return qa.rstrip(".").strip(), qb.rstrip(".").strip()


def quant_difficulty(n):
    return 1 if n <= 10 else (2 if n <= 20 else 3)


def make_q(**kw):
    q = OrderedDict()
    for k in ["id", "source", "label", "section", "topic", "type", "difficulty", "context",
              "stem", "qa", "qb", "options", "blanks", "selectCount", "answer", "explanation", "isExample"]:
        if k in kw and kw[k] is not None:
            q[k] = kw[k]
    return q


def build_quant_body(qid, qtype, body):
    """Return dict(stem, qa, qb, options) for a quant question body."""
    res = {"stem": "", "qa": None, "qb": None, "options": None}
    if qtype == "qc":
        given, qa, qb = split_qc(body)
        if qa is None:
            warn(qid, "QC without Quantity A/B")
        res.update(stem=given, qa=qa, qb=qb, options=QC_OPTIONS)
    elif qtype in ("mc", "multi"):
        stem, opts = split_options(body)
        if not opts:
            warn(qid, "no options found")
        res.update(stem=stem, options=opts)
    else:
        res["stem"] = clean(body)
    return res


def parse_answer_value(qtype, raw):
    raw = raw.strip()
    if qtype == "numeric":
        return [norm_numeric(raw)]
    head = raw.split("(")[0]
    return letters(head)


# --------------------------------------------------------------------------
# Quant lesson files 01-10
# --------------------------------------------------------------------------

def parse_contexts_and_blocks(sec_text, header_re, ctx_prefix, contexts, ctx_title_fmt):
    """Walk a section; '### ' headings start a shared context. Yields
    (header_match, body, context_id)."""
    lines = sec_text.split("\n")
    out = []
    ctx_id = None
    ctx_lines = None
    ctx_title = None
    cur = None  # [match, body_lines, ctx]
    ctx_n = 0

    def flush():
        if cur is not None:
            out.append((cur[0], "\n".join(cur[1]), cur[2]))

    for ln in lines:
        h3 = re.match(r"^###\s+(.*)$", ln)
        hq = re.match(header_re, ln)
        if h3:
            flush()
            cur = None
            ctx_n += 1
            ctx_title = h3.group(1).strip()
            ctx_id = None
            ctx_lines = []
            continue
        if hq:
            if ctx_lines is not None:
                md = clean("\n".join(ctx_lines))
                if md:
                    slug = re.sub(r"[^a-z0-9]+", "-", ctx_title.lower().split("(")[0]).strip("-")
                    ctx_id = "%s-%s" % (ctx_prefix, slug)
                    contexts[ctx_id] = {"title": ctx_title, "markdown": md}
                ctx_lines = None
            flush()
            cur = [hq, [], ctx_id]
            continue
        if cur is not None:
            cur[1].append(ln)
        elif ctx_lines is not None:
            ctx_lines.append(ln)
    flush()
    return out


def parse_quant_lesson(num, rel, topic, topic_label, contexts, questions):
    text = read(rel)
    stats = Counter()

    # ---- worked examples
    ex_sec = section(text, r"^## 2\. Worked examples")
    ex_blocks = parse_contexts_and_blocks(
        ex_sec, r"^\*\*Example (\d+) \(([^)]+)\)\*\*\s*$", "q%s-ex" % num, contexts, None)
    for m, body, ctx in ex_blocks:
        n = int(m.group(1))
        qtype = QUANT_TYPE_MAP.get(m.group(2).strip().lower())
        qid = "q%s-ex%d" % (num, n)
        if qtype is None:
            warn(qid, "unknown type %r" % m.group(2))
            continue
        parts = re.split(r"^Solution:?\s*", body, maxsplit=1, flags=re.M)
        q_body = parts[0]
        sol = clean(parts[1]) if len(parts) > 1 else ""
        if not sol:
            warn(qid, "no solution")
        ans_m = list(re.finditer(r"Answer:\s*(.+?)\.?\s*$", sol, re.M))
        ans_raw = ans_m[-1].group(1) if ans_m else ""
        answer = parse_answer_value(qtype, ans_raw)
        b = build_quant_body(qid, qtype, q_body)
        questions.append(make_q(
            id=qid, source=rel, label="%s · Example %d" % (topic_label, n), section="quant",
            topic=topic, type=qtype, difficulty=1, context=ctx, stem=b["stem"], qa=b["qa"], qb=b["qb"],
            options=b["options"], answer=answer, explanation=sol, isExample=True))
        stats["examples"] += 1

    # ---- solutions
    ans_sec = section(text, r"^## 5\. Answers and solutions")
    sols = {}
    cur = None
    for ln in ans_sec.split("\n"):
        m = re.match(r"^\*\*(\d+)\.\s+(.+?)\.\*\*\s*(.*)$", ln)
        if m:
            cur = int(m.group(1))
            sols[cur] = [m.group(2), [m.group(3)]]
            continue
        if re.match(r"^\*\*", ln) or ln.startswith("#"):
            cur = None
            continue
        if cur is not None:
            sols[cur][1].append(ln)

    # ---- practice
    pr_sec = section(text, r"^## 4\. Practice")
    cut = re.search(r"^(\.\s*$|---\s*$|\(?Answers are below)", pr_sec, re.M)
    if cut:
        pr_sec = pr_sec[: cut.start()]
    blocks = parse_contexts_and_blocks(
        pr_sec, r"^\*\*(\d+)\. \(([^)]+)\)\*\*\s*$", "q%s" % num, contexts, None)
    for m, body, ctx in blocks:
        n = int(m.group(1))
        qid = "q%s-p%02d" % (num, n)
        qtype = QUANT_TYPE_MAP.get(m.group(2).strip().lower())
        if qtype is None:
            warn(qid, "unknown type %r" % m.group(2))
            continue
        b = build_quant_body(qid, qtype, body)
        if n in sols:
            answer = parse_answer_value(qtype, sols[n][0])
            expl = clean("\n".join(sols[n][1]))
        else:
            answer, expl = [], ""
        questions.append(make_q(
            id=qid, source=rel, label="%s · Practice %d" % (topic_label, n), section="quant",
            topic=topic, type=qtype, difficulty=quant_difficulty(n), context=ctx, stem=b["stem"],
            qa=b["qa"], qb=b["qb"], options=b["options"], answer=answer, explanation=expl,
            isExample=False))
        stats["practice"] += 1
    return stats


# --------------------------------------------------------------------------
# 11 QC drill
# --------------------------------------------------------------------------

def parse_qc_drill(contexts, questions):
    rel = "02-Quant/11-Quantitative-Comparison.md"
    text = read(rel)
    sec = section(text, r"^## 5\. Mini drill")
    qpart, apart = re.split(r"^\*\*Answers\*\*\s*$", sec, maxsplit=1, flags=re.M)
    sols = {}
    for m in re.finditer(r"^(\d+)\.\s+\*\*([A-D])\.\*\*\s*(.*)$", apart, re.M):
        sols[int(m.group(1))] = (m.group(2), m.group(3).strip())
    stats = Counter()
    for m in re.finditer(r"^(\d+)\.\s+(.*)$", qpart, re.M):
        n = int(m.group(1))
        qid = "q11-qc%02d" % n
        given, qa, qb = split_qc(m.group(2))
        if qa is None:
            warn(qid, "QC drill without quantities")
            continue
        qa, qb = qc_inline_cleanup(qa, qb)
        ans, expl = sols.get(n, ("", ""))
        questions.append(make_q(
            id=qid, source=rel, label="QC Drill · %d" % n, section="quant", topic="mixed",
            type="qc", difficulty=2, stem=given, qa=qa, qb=qb, options=QC_OPTIONS,
            answer=[ans] if ans else [], explanation=expl, isExample=False))
        stats["practice"] += 1
    return stats


# --------------------------------------------------------------------------
# 12 Mixed timed sets
# --------------------------------------------------------------------------

def timed_topic(name, qid):
    low = name.lower()
    for key, topic in TIMED_TOPIC_MAP:
        if low.startswith(key):
            return topic
    for key, topic in TIMED_TOPIC_MAP:
        if key in low:
            return topic
    warn(qid, "unmapped timed-set topic %r" % name)
    return "mixed"


def parse_timed_sets(contexts, questions):
    rel = "02-Quant/12-Mixed-Timed-Sets.md"
    text = read(rel)
    ans_text = section(text, r"^## Answers and solutions")
    sols = {}  # (set, n) -> (raw, bracket, expl)
    for sm in re.finditer(r"^### Set (\d+)\s*$(.*?)(?=^### |\Z)", ans_text, re.M | re.S):
        s = int(sm.group(1))
        for m in re.finditer(r"^(\d+)\.\s+(.+?)\s+\[([^\]]+)\]\.\s*(.*)$", sm.group(2), re.M):
            sols[(s, int(m.group(1)))] = (m.group(2), m.group(3), m.group(4).strip())

    stats = Counter()
    for sm in re.finditer(r"^## Set (\d+) \(([^)]*)\)\s*$", text, re.M):
        s = int(sm.group(1))
        level = sm.group(2).split(",")[-1].strip().lower()
        diff = 2 if level == "medium" else 3
        body = text[sm.end():]
        e = re.search(r"^(## |---\s*$|Stop here)", body, re.M)
        body = body[: e.start()] if e else body
        # split into chunks: context markers and question headers
        ctx_id = None
        ctx_range = None
        cur = None
        items = []
        lines = body.split("\n")
        ctx_lines = None
        for ln in lines:
            cm = re.match(r"^\*\*Questions (\d+) to (\d+) are based on the following (\w+)\.\*\*", ln)
            qm = re.match(r"^\*\*(\d+)\. \[([^\]]+)\]\*\*\s*(.*)$", ln)
            if cm:
                if cur:
                    items.append(cur)
                    cur = None
                ctx_range = (int(cm.group(1)), int(cm.group(2)))
                ctx_id = "q12-s%d-%s" % (s, cm.group(3).lower())
                ctx_lines = [ln.strip("*")]
                continue
            if qm:
                if ctx_lines is not None:
                    contexts[ctx_id] = {"title": "Timed Set %d · %s for questions %d to %d" % (
                        s, cm_word(ctx_id), ctx_range[0], ctx_range[1]),
                        "markdown": clean("\n".join(ctx_lines[1:]))}
                    ctx_lines = None
                if cur:
                    items.append(cur)
                cur = [qm, [qm.group(3)] if qm.group(3) else []]
                continue
            if ctx_lines is not None:
                ctx_lines.append(ln)
            elif cur:
                cur[1].append(ln)
        if cur:
            items.append(cur)

        for qm, blines in items:
            n = int(qm.group(1))
            qid = "q12-s%d-%02d" % (s, n)
            qtype = QUANT_TYPE_MAP.get(qm.group(2).strip().lower())
            if qtype is None:
                warn(qid, "unknown type %r" % qm.group(2))
                continue
            b = build_quant_body(qid, qtype, "\n".join(blines))
            ctx = None
            if ctx_range and ctx_range[0] <= n <= ctx_range[1]:
                ctx = ctx_id
            raw, bracket, expl = sols.get((s, n), ("", "", ""))
            if not raw:
                warn(qid, "no solution")
            topic = timed_topic(bracket, qid) if bracket else "mixed"
            questions.append(make_q(
                id=qid, source=rel, label="Timed Set %d · Q%d" % (s, n), section="quant", topic=topic,
                type=qtype, difficulty=diff, context=ctx, stem=b["stem"], qa=b["qa"], qb=b["qb"],
                options=b["options"], answer=parse_answer_value(qtype, raw) if raw else [],
                explanation=("*%s.* %s" % (bracket, expl)) if bracket else expl, isExample=False))
            stats["practice"] += 1
    return stats


def cm_word(ctx_id):
    return ctx_id.rsplit("-", 1)[-1].capitalize()


# --------------------------------------------------------------------------
# Verbal: TC and SE
# --------------------------------------------------------------------------

def parse_bold_answers(ans_text, key_re):
    """Lines like '**A1. B (muted).** Explanation'. Returns {key: (raw, full_md)}."""
    out = {}
    cur = None
    for ln in ans_text.split("\n"):
        m = re.match(key_re, ln)
        if m:
            cur = m.group(1)
            out[cur] = [m.group(2), ["**%s.** %s" % (m.group(2).rstrip("."), m.group(3))]]
            continue
        if ln.startswith("**") or ln.startswith("#") or ln.startswith("Quick key"):
            cur = None
            continue
        if cur:
            out[cur][1].append(ln)
    return {k: (v[0], clean("\n".join(v[1]))) for k, v in out.items()}


def dash_options(md):
    """Split body into stem and '- A. text' options."""
    lines = md.split("\n")
    opts, stem_lines = [], []
    for ln in lines:
        m = re.match(r"^- ([A-J])\.\s+(.*)$", ln)
        if m:
            opts.append({"key": m.group(1), "text": m.group(2).strip()})
        elif not opts:
            stem_lines.append(ln)
        elif ln.strip():
            # text after options: should not happen
            opts[-1]["text"] += " " + ln.strip()
    return clean("\n".join(stem_lines)), opts


def blank_table(md):
    """Split body into stem and a blanks table."""
    lines = md.split("\n")
    idx = next((i for i, l in enumerate(lines) if l.startswith("| Blank")), None)
    if idx is None:
        return clean(md), None
    header = [c.strip() for c in lines[idx].strip().strip("|").split("|")]
    blanks = [{"label": re.sub(r"^Blank\s*", "", h), "options": []} for h in header]
    for l in lines[idx + 2:]:
        if not l.startswith("|"):
            break
        cells = [c.strip() for c in l.strip().strip("|").split("|")]
        for j, c in enumerate(cells):
            m = re.match(r"^([A-J])\.\s+(.*)$", c)
            if m and j < len(blanks):
                blanks[j]["options"].append({"key": m.group(1), "text": m.group(2)})
    return clean("\n".join(lines[:idx])), blanks


def parse_tc_se(kind, contexts, questions):
    rel = "03-Verbal/Practice/%s-Practice.md" % kind.upper()
    text = read(rel)
    ans_text = section(text, r"^## Answers and explanations")
    sols = parse_bold_answers(ans_text, r"^\*\*([ABC]\d+)\.\s+(.+?\.)\*\*\s*(.*)$")
    stats = Counter()
    for sm in re.finditer(r"^## Set ([ABC]) \(([^)]*)\)\s*$", text, re.M):
        s = sm.group(1)
        diff = {"A": 1, "B": 2, "C": 3}[s]
        body = text[sm.end():]
        e = re.search(r"^## |^---\s*$", body, re.M)
        body = body[: e.start()] if e else body
        chunks = re.split(r"^\*\*(\d+)\.\*\*\s*", body, flags=re.M)
        for k in range(1, len(chunks), 2):
            n = int(chunks[k])
            qbody = re.split(r"^###", chunks[k + 1], flags=re.M)[0]
            qid = "%s-%s-%02d" % (kind, s, n)
            raw, expl = sols.get("%s%d" % (s, n), ("", ""))
            if not raw:
                warn(qid, "no explanation")
            answer = letters(raw.split("(")[0])
            q = dict(id=qid, source=rel, section="verbal", topic=kind, difficulty=diff,
                     answer=answer, explanation=expl, isExample=False)
            if kind == "tc":
                q["label"] = "Text Completion · Set %s · %d" % (s, n)
                if "| Blank" in qbody:
                    stem, blanks = blank_table(qbody)
                    q.update(type="tcN", stem=stem, blanks=blanks)
                    if len(answer) != len(blanks):
                        warn(qid, "answer count %d != blanks %d" % (len(answer), len(blanks)))
                else:
                    stem, opts = dash_options(qbody)
                    q.update(type="tc1", stem=stem, options=opts)
            else:
                q["label"] = "Sentence Equivalence · Set %s · %d" % (s, n)
                stem, opts = dash_options(qbody)
                q.update(type="multi", stem=stem, options=opts, selectCount=2)
            questions.append(make_q(**q))
            stats["practice"] += 1
    return stats


# --------------------------------------------------------------------------
# Verbal: RC
# --------------------------------------------------------------------------

def parse_rc(contexts, questions):
    rel = "03-Verbal/Practice/RC-Practice.md"
    text = read(rel)
    ans_text = section(text, r"^## Answers and explanations")
    sols = {}
    cur = None
    for ln in ans_text.split("\n"):
        m = re.match(r"^\*\*(\d+)\.\s+(.*?)\*\*\s*(.*)$", ln)
        if m:
            cur = int(m.group(1))
            sols[cur] = [m.group(2).strip(), ["**%s** %s" % (m.group(2).strip(), m.group(3))]]
            continue
        if ln.startswith("**") or ln.startswith("#") or ln.startswith("Quick key"):
            cur = None
            continue
        if cur:
            sols[cur][1].append(ln)

    q_text = text[: re.search(r"^## Answers and explanations", text, re.M).start()]
    stats = Counter()
    for sm in re.finditer(r"^## Set (\d+): ([^\n]*)$(.*?)(?=^## |\Z)", q_text, re.M | re.S):
        setno = int(sm.group(1))
        is_cr = "critical" in sm.group(2).lower()
        for pm in re.finditer(r"^### Passage (\d+) \(([^)]*)\)\s*$(.*?)(?=^### |\Z)", sm.group(3), re.M | re.S):
            p = int(pm.group(1))
            pbody = pm.group(3)
            pbody = re.split(r"^---\s*$", pbody, flags=re.M)[0]
            parts = re.split(r"^\*\*(\d+)\.\*\*\s*", pbody, flags=re.M)
            ctx_id = "rc-p%d" % p
            contexts[ctx_id] = {"title": "Passage %d" % p + (" (critical reasoning)" if is_cr else ""),
                                "markdown": clean(parts[0])}
            for k in range(1, len(parts), 2):
                n = int(parts[k])
                qbody = parts[k + 1]
                qid = "rc-q%02d" % n
                stem, opts = dash_options(qbody)
                raw, expl_lines = sols.get(n, ("", []))
                expl = clean("\n".join(expl_lines))
                if not raw:
                    warn(qid, "no explanation")
                if not opts and stem.lower().startswith("select the sentence"):
                    qtype = "passage"
                    qm = re.search(r'"(.*)"', raw)
                    ans = qm.group(1) if qm else raw
                    ans = re.sub(r"\s*(\.\.\.|…)\s*$", "", ans).strip()
                    answer = ans
                else:
                    qtype = "multi" if "select all that apply" in stem.lower() else "mc"
                    answer = letters(raw.split("(")[0])
                questions.append(make_q(
                    id=qid, source=rel,
                    label="%s · Passage %d · Q%d" % ("Critical Reasoning" if is_cr else "Reading Comprehension", p, n),
                    section="verbal", topic="cr" if is_cr else "rc", type=qtype, difficulty=2,
                    context=ctx_id, stem=stem, options=opts if opts else None, answer=answer,
                    explanation=expl, isExample=False))
                stats["practice"] += 1
    return stats


# --------------------------------------------------------------------------
# Vocab quizzes and word lists
# --------------------------------------------------------------------------

def parse_vocab_quiz(week, contexts, questions):
    rel = "04-Vocab/Quiz-Week-%d.md" % week
    text = read(rel)
    sols = {}
    for m in re.finditer(r"^(\d+)\.\s+(.*)$", section(text, r"^## Answers"), re.M):
        line = m.group(2).strip()
        am = re.match(r"^([A-F](?:(?:\s*,\s*|\s+and\s+)[A-F])*)\s*[,.]\s*(.*)$", line)
        sols[int(m.group(1))] = (letters(am.group(1)) if am else [], line)
    stats = Counter()
    parts = [("A", "fill"), ("B", "multi"), ("C", "mc")]
    for letter, qtype in parts:
        sec = section(text, r"^## Part %s:" % letter)
        for m in re.finditer(r"^(\d+)\.\s+(.*?)(?=^\d+\.\s|\Z)", sec, re.M | re.S):
            n = int(m.group(1))
            qid = "vq%d-%02d" % (week, n)
            body = m.group(2)
            stem, opts = split_options(body if letter != "C" else "\n" + body)
            if letter == "C":
                stem = "Four of the five words are close in meaning. Which word does not belong?"
            ans, expl = sols.get(n, ([], ""))
            if not expl:
                warn(qid, "no answer")
            questions.append(make_q(
                id=qid, source=rel, label="Vocab Quiz Week %d · %d" % (week, n), section="vocab",
                topic="vocab-week-%d" % week, type=qtype, difficulty=1, stem=stem, options=opts,
                selectCount=2 if letter == "B" else None, answer=ans, explanation=expl, isExample=False))
            stats["practice"] += 1
    return stats


def parse_words(week):
    rel = "04-Vocab/Words-Week-%d.md" % week
    text = read(rel)
    out = []
    for dm in re.finditer(r"^## Day (\d+): ([^\n]*)$(.*?)(?=^## |\Z)", text, re.M | re.S):
        day, theme = int(dm.group(1)), dm.group(2).strip()
        for ln in dm.group(3).split("\n"):
            if not ln.startswith("| ") or ln.startswith("| Word"):
                continue
            cells = [c.strip() for c in ln.strip().strip("|").split("|")]
            if len(cells) != 4:
                warn(rel, "bad word row: %s" % ln[:60])
                continue
            word, meaning, example, syn = cells
            pm = re.match(r"^\(([^)]*)\)\s*(.*)$", meaning)
            pos, meaning = (pm.group(1), pm.group(2)) if pm else ("", meaning)
            out.append(OrderedDict([
                ("word", word), ("pos", pos), ("meaning", meaning), ("example", example),
                ("synonyms", [s.strip() for s in syn.split(",") if s.strip()]),
                ("day", day), ("week", week), ("theme", theme)]))
    return out


# --------------------------------------------------------------------------
# Manifest, validation, output
# --------------------------------------------------------------------------

def lesson_list():
    files = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        rel_dir = os.path.relpath(dirpath, ROOT)
        top = rel_dir.split(os.sep)[0]
        if top in ("site", "tools") or (top != "." and top.startswith(".")):
            dirnames[:] = []
            continue
        dirnames[:] = sorted(d for d in dirnames if not d.startswith("."))
        for f in sorted(filenames):
            if not f.endswith(".md"):
                continue
            rel = os.path.normpath(os.path.join(rel_dir, f)).replace(os.sep, "/")
            title = f[:-3]
            with open(os.path.join(dirpath, f), encoding="utf-8") as fh:
                for ln in fh:
                    if ln.startswith("# "):
                        title = ln[2:].strip()
                        break
            files.append(OrderedDict([("path", rel), ("title", title),
                                      ("folder", os.path.dirname(rel) or ".")]))
    return sorted(files, key=lambda x: x["path"])


def validate(questions):
    seen = set()
    for q in questions:
        qid = q["id"]
        if qid in seen:
            warn(qid, "duplicate id")
        seen.add(qid)
        ans = q.get("answer")
        if q["type"] == "passage":
            if not isinstance(ans, str) or not ans:
                warn(qid, "empty passage answer")
        elif q["type"] == "numeric":
            if not ans or not ans[0]:
                warn(qid, "empty numeric answer")
        elif q["type"] == "tcN":
            keys = [o["key"] for b in q["blanks"] for o in b["options"]]
            if not ans or any(a not in keys for a in ans):
                warn(qid, "answer %r not in blank options" % ans)
            for i, a in enumerate(ans):
                if i < len(q["blanks"]) and a not in [o["key"] for o in q["blanks"][i]["options"]]:
                    warn(qid, "answer %s not in blank %d" % (a, i + 1))
        else:
            keys = [o["key"] for o in q.get("options", [])]
            if not ans or any(a not in keys for a in ans):
                warn(qid, "answer %r not in options %r" % (ans, keys))
            expect = [chr(65 + i) for i in range(len(keys))]
            if keys != expect:
                warn(qid, "option keys not sequential: %r" % keys)
            if q["type"] in ("mc", "qc", "tc1", "fill") and len(ans) != 1:
                warn(qid, "single-answer type with %d answers" % len(ans))
            if q.get("selectCount") and len(ans) != q["selectCount"]:
                warn(qid, "selectCount %d but %d answers" % (q["selectCount"], len(ans)))
            if any(re.search(r"(---|\*\*|Stop here|Answers)", o["text"]) for o in q.get("options", [])):
                warn(qid, "option text contains stray markup")
            if any(not o["text"] for o in q.get("options", [])):
                warn(qid, "empty option text")
        if not q.get("explanation"):
            warn(qid, "empty explanation")
        if q["type"] != "qc" and not q.get("stem"):
            warn(qid, "empty stem")
        if q["type"] == "qc" and (not q.get("qa") or not q.get("qb")):
            warn(qid, "QC missing qa/qb")
        stem = q.get("stem", "")
        if re.search(r"^\*\*\d+\.", stem, re.M) or "Solution" in stem or re.search(r"^\s*\(A\)\s", stem, re.M):
            warn(qid, "stem may contain another question/options/solution")
        for f in ("qa", "qb"):
            if q.get(f) and ("Quantity" in q[f] or "\n\n" in q[f]):
                warn(qid, "%s looks swallowed: %r" % (f, q[f][:60]))


def short(q):
    lines = ["  [%s] %s | %s | diff %s | ctx %s" % (q["id"], q["type"], q["topic"], q["difficulty"], q.get("context"))]
    lines.append("    stem: " + q.get("stem", "").replace("\n", " / ")[:300])
    if q.get("qa"):
        lines.append("    A: %s | B: %s" % (q["qa"], q["qb"]))
    if q.get("options") and q["type"] != "qc":
        lines.append("    opts: " + " ; ".join("%s) %s" % (o["key"], o["text"]) for o in q["options"])[:300])
    if q.get("blanks"):
        for b in q["blanks"]:
            lines.append("    %s: %s" % (b["label"], ", ".join("%s) %s" % (o["key"], o["text"]) for o in b["options"])))
    lines.append("    answer: %r" % (q["answer"],))
    lines.append("    expl: " + q.get("explanation", "").replace("\n", " / ")[:160])
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--sample", type=int, default=0, help="print N random questions per source file")
    ap.add_argument("--seed", type=int, default=None)
    args = ap.parse_args()

    contexts = OrderedDict()
    questions = []
    per_file = OrderedDict()

    for num, rel, topic, label in QUANT_FILES:
        per_file[rel] = parse_quant_lesson(num, rel, topic, label, contexts, questions)
    per_file["02-Quant/11-Quantitative-Comparison.md"] = parse_qc_drill(contexts, questions)
    per_file["02-Quant/12-Mixed-Timed-Sets.md"] = parse_timed_sets(contexts, questions)
    per_file["03-Verbal/Practice/TC-Practice.md"] = parse_tc_se("tc", contexts, questions)
    per_file["03-Verbal/Practice/SE-Practice.md"] = parse_tc_se("se", contexts, questions)
    per_file["03-Verbal/Practice/RC-Practice.md"] = parse_rc(contexts, questions)
    for w in range(1, 7):
        per_file["04-Vocab/Quiz-Week-%d.md" % w] = parse_vocab_quiz(w, contexts, questions)

    words = []
    word_counts = OrderedDict()
    for w in range(1, 7):
        ws = parse_words(w)
        word_counts["04-Vocab/Words-Week-%d.md" % w] = len(ws)
        words.extend(ws)

    validate(questions)

    # expected counts
    expected = {rel: {"practice": 25, "examples": 8} for _, rel, _, _ in QUANT_FILES}
    expected["02-Quant/10-Data-Interpretation.md"] = {"practice": 24, "examples": 8}
    expected["02-Quant/11-Quantitative-Comparison.md"] = {"practice": 10}
    expected["02-Quant/12-Mixed-Timed-Sets.md"] = {"practice": 81}
    expected["03-Verbal/Practice/TC-Practice.md"] = {"practice": 36}
    expected["03-Verbal/Practice/SE-Practice.md"] = {"practice": 36}
    expected["03-Verbal/Practice/RC-Practice.md"] = {"practice": 32}
    for w in range(1, 7):
        expected["04-Vocab/Quiz-Week-%d.md" % w] = {"practice": 25}

    print("Per-file summary (practice + worked examples):")
    total = 0
    for rel, st in per_file.items():
        exp = expected.get(rel, {})
        ok = st["practice"] == exp.get("practice", st["practice"]) and st["examples"] == exp.get("examples", 0)
        total += st["practice"] + st["examples"]
        print("  %-48s practice %3d  examples %2d  %s" % (rel, st["practice"], st["examples"], "OK" if ok else "MISMATCH (expected %r)" % exp))
    vocab_total = sum(word_counts.values())
    for rel, c in word_counts.items():
        print("  %-48s words %3d  %s" % (rel, c, "OK" if c == 100 else "MISMATCH"))
    print("Total questions: %d (examples %d, non-example %d); vocab words: %d; contexts: %d" % (
        len(questions), sum(1 for q in questions if q["isExample"]),
        sum(1 for q in questions if not q["isExample"]), vocab_total, len(contexts)))

    # write
    os.makedirs(OUT_DIR, exist_ok=True)
    today = datetime.date.today().isoformat()
    with open(os.path.join(OUT_DIR, "questions.json"), "w", encoding="utf-8") as fh:
        json.dump(OrderedDict([("generated", today), ("types", TYPES_DOC), ("contexts", contexts),
                               ("questions", questions)]), fh, ensure_ascii=False, indent=1)
        fh.write("\n")
    with open(os.path.join(OUT_DIR, "vocab.json"), "w", encoding="utf-8") as fh:
        json.dump(words, fh, ensure_ascii=False, indent=1)
        fh.write("\n")

    def count(key, qs=questions):
        return OrderedDict(sorted(Counter(str(q[key]) for q in qs).items()))

    by_section_topic = OrderedDict()
    for sec in ("quant", "verbal", "vocab"):
        by_section_topic[sec] = count("topic", [q for q in questions if q["section"] == sec])
    manifest = OrderedDict([
        ("generated", today),
        ("counts", OrderedDict([
            ("total", len(questions)),
            ("examples", sum(1 for q in questions if q["isExample"])),
            ("nonExamples", sum(1 for q in questions if not q["isExample"])),
            ("bySection", count("section")),
            ("byTopic", by_section_topic),
            ("byType", count("type")),
            ("byDifficulty", count("difficulty")),
            ("bySource", OrderedDict((rel, st["practice"] + st["examples"]) for rel, st in per_file.items())),
            ("vocabWords", vocab_total),
            ("contexts", len(contexts)),
        ])),
        ("types", TYPES_DOC),
        ("lessons", lesson_list()),
    ])
    with open(os.path.join(OUT_DIR, "manifest.json"), "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=1)
        fh.write("\n")

    print("Types:", dict(Counter(q["type"] for q in questions)))
    print("Wrote:")
    for f in ("questions.json", "vocab.json", "manifest.json"):
        print("  " + os.path.relpath(os.path.join(OUT_DIR, f), ROOT))

    if problems:
        print("\nProblems (%d):" % len(problems))
        for qid, msg in problems:
            print("  %s: %s" % (qid, msg))
    else:
        print("\nValidation: no problems found.")

    if args.sample:
        rng = random.Random(args.seed)
        print("\nRandom samples:")
        for rel in per_file:
            qs = [q for q in questions if q["source"] == rel]
            print("== " + rel)
            for q in rng.sample(qs, min(args.sample, len(qs))):
                print(short(q))
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
