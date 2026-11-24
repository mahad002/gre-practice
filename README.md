# GRE Practice

A complete self-study course for the GRE General Test, with a web app to study from.

**Open the web app:** https://mahad002.github.io/gre-practice/

## How it works

Open the site and press **Today**. It shows the steps for the day from a 62-day plan that ends on test day. Each step has a **Start** button that opens the right lesson, practice set, timed set or flashcards, and a **Mark done** button. The plan is read from `01-Plan/Study-Schedule.md`, so editing that file changes the site.

## What's inside

| In the app | What it does |
|---|---|
| Today | The day's steps, in order, with Start and Mark done buttons |
| Your plan | All 9 weeks at a glance; open any day |
| Practice | Question bank (674 original questions with explanations), timed exams and a mini mock, mistakes log, 600 vocab cards |
| Lessons | 10 Quant topic lessons, QC strategy, pacing guides, 3 Verbal lessons, vocab lists, writing guide, test guides |
| Syllabus checklist | Every GRE topic, marked Not started, Studied, Revised or Mastered |
| Help | How the site works, study combos (maths strength, English strength and more), advice by stage, official resources, admission interviews |
| Progress & settings | Scores, weakest topics, test date and backup |

Progress is stored in your browser. Use **Progress & settings** to download a backup and import it on another device.

## Files

All content is plain Markdown in the numbered folders (`01-Plan` to `06-Practice-Tests`). The web app reads those files directly, so editing a lesson updates the site.

After changing any practice file, rebuild the question bank:

```bash
python3 tools/build_bank.py
```

## About official ETS material

Official ETS books and tests are copyrighted and are not included here. The app links to ETS's own free downloads (Math Review, Math Conventions, Information Bulletin, POWERPREP) and to the official books.

All practice questions in this repository are original.
