# GRE Practice

A complete self-study course for the GRE General Test, with a web app to study from.

**Open the web app:** https://mahad002.github.io/gre-practice/

## What's inside

| In the app | What it does |
|---|---|
| Dashboard | Countdown, today's schedule row, progress, weakest topics, quick exams |
| Syllabus checklist | Every GRE topic with four states: Not started, Studied, Revised, Mastered |
| Study combos | Recommended plan, maths strength, English strength, writing booster, fast track, busy week, final 7 days |
| Daily schedule | The day-by-day plan to test day, with tick boxes |
| Lessons | 10 Quant topic lessons, QC strategy, pacing guides, 3 Verbal lessons, vocab lists, writing guide, test guides |
| Question bank | 674 original questions with explanations (420 Quant, 104 Verbal, 150 vocab), filterable |
| Create exam | Timed GRE-style sections, a 4-section mini mock, custom exams by topic and difficulty |
| Mistakes log | Every miss, fixed only after two correct redos on different days |
| Vocab cards | 600 words in 30 themed days, flashcards and quizzes |
| Advice by stage | What high scorers do from day one to test day and after |
| Interviews | Key points for graduate admission interviews |
| Official resources | Links to the free official ETS downloads and the official books to buy |

Progress is stored in your browser. Use **Progress & backup** to download it and move it to another device.

## Files

All content is plain Markdown in the numbered folders (`01-Plan` to `06-Practice-Tests`). The web app reads those files directly, so editing a lesson updates the site.

After changing any practice file, rebuild the question bank:

```bash
python3 tools/build_bank.py
```

## About official ETS material

Official ETS books and tests are copyrighted and are not included here. The app links to ETS's own free downloads (Math Review, Math Conventions, Information Bulletin, POWERPREP) and to the official books.

All practice questions in this repository are original.
