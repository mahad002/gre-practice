# Question bank build

`build_bank.py` reads the course markdown (read only, never modified) and writes the JSON the web app uses:

| File | Contents |
|---|---|
| `site/data/questions.json` | every practice question, worked example and vocab-quiz item, plus shared passages/tables |
| `site/data/vocab.json` | the 600 words from `04-Vocab/Words-Week-*.md` |
| `site/data/manifest.json` | counts by section/topic/type/difficulty/source, the type list, and every lesson `.md` file |

## Re-running

Needs Python 3 with the standard library only. From the course root (`16-GRE-Prep`):

```
python3 tools/build_bank.py               # build, print per-file counts, validate
python3 tools/build_bank.py --sample 3    # also print 3 random parsed questions per source file
python3 tools/build_bank.py --sample 3 --seed 7   # same, repeatable sample
```

The script prints a per-file summary (with `OK` / `MISMATCH` against the expected counts), the total, and a list of validation problems. It exits with status 1 if any problem was found. Re-run it after editing any source file. The JSON is always regenerated from scratch, and the ids stay stable as long as question numbering in the markdown does not change.

Expected counts: quant lessons 01–09 give 25 practice + 8 examples each; 10 gives 24 + 8; `12-Mixed-Timed-Sets.md` gives 81; the QC drill in `11-Quantitative-Comparison.md` gives 10; TC 36, SE 36, RC 32; vocab quizzes 6 × 25 = 150; vocab words 600. Total: 674 questions (80 worked examples, 594 practice).

Validation checks: unique ids; non-empty answer and explanation; every answer key exists among the options (per blank for multi-blank TC); option keys run A, B, C… with no gaps; single-answer types have exactly one key; `selectCount` matches the answer length; stems do not contain another question's header, options or "Solution"; QC questions have `qa` and `qb`; no stray `---`/`**` in option text.

## questions.json

```
{
  "generated": "YYYY-MM-DD",
  "types":    { "<type>": "<description>", ... },
  "contexts": { "<contextId>": { "title": str, "markdown": str }, ... },
  "questions": [ Question, ... ]
}
```

`contexts` hold anything several questions share: Data Interpretation tables and chart descriptions (`q10-set-1`, `q10-ex-data-set-a`, `q12-s3-table`) and RC passages (`rc-p1` … `rc-p10`). Show the context next to the question.

### Question

| Field | Type | Notes |
|---|---|---|
| `id` | str | stable id, see below |
| `source` | str | markdown path relative to the course root |
| `label` | str | human label, e.g. `Geometry · Practice 14`, `Timed Set 4 · Q7`, `Text Completion · Set B · 3` |
| `section` | str | `quant`, `verbal` or `vocab` |
| `topic` | str | quant: `arithmetic`, `fractions-percents-ratios`, `exponents-roots`, `algebra`, `word-problems`, `geometry`, `coordinate-geometry`, `statistics`, `counting-probability`, `data-interpretation`, `mixed`. verbal: `tc`, `se`, `rc`, `cr`. vocab: `vocab-week-1` … `vocab-week-6` |
| `type` | str | see the type table |
| `difficulty` | int | 1 easy, 2 medium, 3 hard |
| `context` | str, optional | key into `contexts` |
| `stem` | str (markdown) | the question; for QC only the given information (may be empty) |
| `qa`, `qb` | str | QC only: Quantity A and Quantity B |
| `options` | list of `{key, text}` | every type except `numeric`, `tcN` and `passage`; QC questions carry the four standard options A–D |
| `blanks` | list of `{label, options:[{key,text}]}` | `tcN` only; labels `(i)`, `(ii)`, `(iii)`; keys A–C, D–F, G–I |
| `selectCount` | int, optional | present when an exact number must be picked (SE and vocab Part B: 2) |
| `answer` | list of str, or str | option keys (`["B"]`, `["A","C"]`); for `tcN` one key per blank (`["B","D","H"]`); for `numeric` one string (`["10.9"]`, `["12/67"]`, thousands commas removed); for `passage` a string, the start of the correct sentence |
| `explanation` | str (markdown) | solution text from the answers section (for worked examples, the full solution that follows the example) |
| `isExample` | bool | true for the worked examples in quant lessons |

### Types

| Type | Meaning |
|---|---|
| `qc` | Quantitative Comparison, one answer from the fixed A–D |
| `mc` | multiple choice, exactly one answer (also RC/CR single answer and vocab "does not belong") |
| `multi` | select all that apply; when `selectCount` is set, pick exactly that many (SE, vocab synonyms) |
| `numeric` | numeric entry; compare as numbers, and accept equivalent fractions |
| `tc1` | one-blank Text Completion, five options |
| `tcN` | two- or three-blank Text Completion; all blanks must be right |
| `passage` | RC select-in-passage; the answer is the start of the sentence |
| `fill` | vocab fill-the-blank, five options, one answer |

### Ids

| Pattern | Source |
|---|---|
| `q06-p14` | quant lesson 06, practice 14 |
| `q04-ex5` | quant lesson 04, worked example 5 |
| `q11-qc03` | QC mini drill question 3 |
| `q12-s4-07` | timed set 4, question 7 |
| `tc-B-03`, `se-A-11` | TC / SE set B question 3, set A question 11 |
| `rc-q17` | RC question 17 (numbered 1–32 across the file) |
| `vq3-12` | vocab quiz week 3, question 12 |

### Difficulty rules

- Quant practice 1–10 → 1, 11–20 → 2, 21–25 → 3; worked examples → 1.
- Timed sets: set label `medium` → 2; `medium-hard`, `hard`, `very hard` → 3.
- QC mini drill → 2 (the source gives no level).
- TC/SE: Set A → 1, Set B → 2, Set C → 3.
- RC (long and medium passages) and CR → 2.
- Vocab quizzes → 1.

Timed-set topics come from the bracket at the start of each solution (e.g. `[Percents: markup and discount]` → `fractions-percents-ratios`, `[Number properties: …]` → `arithmetic`, `[Functions]`, `[Inequalities…]`, `[Sequences…]` → `algebra`). The bracket text is kept in italics at the start of the explanation.

## vocab.json

A list of `{ "word", "pos", "meaning", "example", "synonyms": [str], "day": int, "week": int, "theme" }`. `pos` is the text in the leading parentheses of the meaning (`v`, `n, v`, `adj` …), and `theme` is the day heading (e.g. `Praise and criticism`).

## manifest.json

```
{
  "generated": "YYYY-MM-DD",
  "counts": { "total", "examples", "nonExamples", "bySection", "byTopic": {section: {topic: n}},
              "byType", "byDifficulty", "bySource", "vocabWords", "contexts" },
  "types": { ... },
  "lessons": [ { "path", "title", "folder" }, ... ]
}
```

`lessons` lists every `.md` file in the course except those under `site/` and `tools/`. `title` is the first `# ` heading, and `folder` is the parent directory (`.` for the root).
