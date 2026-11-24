/* Static content for the GRE Practice web app: syllabus, study combos, advice, resources.
   Lesson paths are relative to the repository root. */

window.GRE = window.GRE || {};

GRE.TEST_DATE_DEFAULT = "2027-01-23";

/* ---------- Syllabus checklist ---------- */
/* Each item: id, label, lesson (md path), topic (question-bank filter, optional) */
GRE.SYLLABUS = [
  {
    section: "Quant", color: "q", groups: [
      { name: "Arithmetic and number properties", lesson: "02-Quant/01-Arithmetic-and-Number-Properties.md", topic: "arithmetic", items: [
        "Integers, odd/even and sign rules",
        "Primes, prime factorisation, factors and multiples",
        "GCD and LCM",
        "Divisibility rules and remainders",
        "Units-digit cycles and remainder patterns",
        "Absolute value and the number line",
        "Decimals, place value and rounding",
      ]},
      { name: "Fractions, percents and ratios", lesson: "02-Quant/02-Fractions-Percents-Ratios.md", topic: "fractions-percents-ratios", items: [
        "Fraction operations and comparing fractions",
        "Fraction / decimal / percent conversions",
        "Percent of, percent change, percent greater than",
        "Successive percent changes",
        "Simple and compound interest",
        "Ratios, combined ratios and proportions",
      ]},
      { name: "Exponents and roots", lesson: "02-Quant/03-Exponents-and-Roots.md", topic: "exponents-roots", items: [
        "Exponent rules",
        "Negative and fractional exponents",
        "Same-base equations and comparing powers",
        "Roots, simplifying and rationalising radicals",
        "Numbers between 0 and 1 and negatives under powers",
        "Scientific notation and factorials",
      ]},
      { name: "Algebra", lesson: "02-Quant/04-Algebra.md", topic: "algebra", items: [
        "Simplifying and factoring",
        "Linear equations and systems",
        "Quadratics, discriminant, sum and product of roots",
        "Special identities (difference of squares etc.)",
        "Inequalities, including compound and quadratic",
        "Absolute value equations and inequalities",
        "Functions, function notation and symbol operators",
        "Arithmetic, geometric and recursive sequences",
      ]},
      { name: "Word problems", lesson: "02-Quant/05-Word-Problems.md", topic: "word-problems", items: [
        "Translating words to equations; age and consecutive numbers",
        "Rate, time, distance and average speed",
        "Work and combined rates",
        "Mixtures and weighted averages",
        "Profit, discount and markup",
        "Overlapping sets (2 and 3 sets)",
        "Unit conversions",
      ]},
      { name: "Geometry", lesson: "02-Quant/06-Geometry.md", topic: "geometry", items: [
        "Lines and angles, parallel lines",
        "Triangles, Pythagoras, 30-60-90 and 45-45-90",
        "Similar triangles and the triangle inequality",
        "Quadrilaterals and polygons",
        "Circles: arcs, sectors, chords, tangents, inscribed angles",
        "3D solids: volume, surface area, diagonal",
      ]},
      { name: "Coordinate geometry", lesson: "02-Quant/07-Coordinate-Geometry.md", topic: "coordinate-geometry", items: [
        "Slope, line equations, intercepts",
        "Parallel and perpendicular lines",
        "Distance and midpoint",
        "Parabolas and circles in the plane",
        "Regions, shifts and reflections",
      ]},
      { name: "Statistics", lesson: "02-Quant/08-Statistics.md", topic: "statistics", items: [
        "Mean, median, mode, range, weighted mean",
        "Standard deviation (concept and transformations)",
        "Quartiles, IQR, boxplots, percentiles",
        "Normal distribution (68-95-99.7)",
      ]},
      { name: "Counting and probability", lesson: "02-Quant/09-Counting-and-Probability.md", topic: "counting-probability", items: [
        "Multiplication principle and factorials",
        "Permutations, including restrictions",
        "Combinations and 'at least' counting",
        "Probability rules: and, or, complement",
        "With/without replacement, conditional probability, expected value",
      ]},
      { name: "Data interpretation", lesson: "02-Quant/10-Data-Interpretation.md", topic: "data-interpretation", items: [
        "Tables, bar, line and pie charts",
        "Percent vs percentage point; percent change from graphs",
        "Estimation and calculator strategy",
      ]},
      { name: "Quant strategy", lesson: "02-Quant/11-Quantitative-Comparison.md", topic: "", items: [
        "Quantitative Comparison method (special numbers)",
        "Quant pacing, two-pass rule and calculator rules",
        "Formula sheet memorised",
      ]},
    ]
  },
  {
    section: "Verbal", color: "v", groups: [
      { name: "Text Completion", lesson: "03-Verbal/01-Text-Completion.md", topic: "tc", items: [
        "Predict-first method",
        "Signal words and double negatives",
        "Two- and three-blank questions",
      ]},
      { name: "Sentence Equivalence", lesson: "03-Verbal/02-Sentence-Equivalence.md", topic: "se", items: [
        "Find the pair that fits",
        "Secondary meanings (qualify, table, check...)",
      ]},
      { name: "Reading Comprehension", lesson: "03-Verbal/03-Reading-Comprehension.md", topic: "rc", items: [
        "Reading for structure and the author's view",
        "Question types: main idea, inference, detail, function",
        "Select-all and select-in-passage formats",
        "The five wrong-answer types",
      ]},
      { name: "Critical reasoning", lesson: "03-Verbal/03-Reading-Comprehension.md", topic: "cr", items: [
        "Conclusion, evidence and assumption",
        "Strengthen, weaken, paradox, bold-face roles",
      ]},
      { name: "Verbal strategy", lesson: "03-Verbal/04-Verbal-Pacing.md", topic: "", items: [
        "Verbal pacing and section order",
        "Elimination when two choices remain",
        "Daily reading habit (one long article)",
      ]},
    ]
  },
  {
    section: "Vocabulary", color: "w", groups: [
      { name: "600-word course", lesson: "04-Vocab/README.md", topic: "", items: [
        "Week 1 words (days 1-5)", "Week 2 words (days 6-10)", "Week 3 words (days 11-15)",
        "Week 4 words (days 16-20)", "Week 5 words (days 21-25)", "Week 6 words (days 26-30)",
        "Roots and prefixes table",
      ]},
    ]
  },
  {
    section: "Writing", color: "a", groups: [
      { name: "Issue essay", lesson: "05-Writing/01-Issue-Essay-Guide.md", topic: "", items: [
        "The 30-minute plan and 5-paragraph template",
        "The six instruction types",
        "Prepared example bank (8-10 examples)",
        "Read the sample essays",
        "Essay 1 written and graded", "Essay 2 written and graded",
        "Essay 3 written and graded", "Essay 4 written and graded",
      ]},
    ]
  },
  {
    section: "Official tests", color: "t", groups: [
      { name: "ETS practice tests", lesson: "06-Practice-Tests/Mock-Test-Guide.md", topic: "", items: [
        "POWERPREP 1 taken and reviewed",
        "POWERPREP PLUS 1 taken and reviewed",
        "POWERPREP 2 taken and reviewed",
        "POWERPREP PLUS 2 taken and reviewed",
        "Test-day checklist done",
      ]},
    ]
  },
];

GRE.STATES = [
  { key: 0, label: "Not started", short: "—" },
  { key: 1, label: "Studied", short: "S" },
  { key: 2, label: "Revised", short: "R" },
  { key: 3, label: "Mastered", short: "M" },
];

/* ---------- Study combos ---------- */
/* preset: exam builder settings. sections: [{section, topics, count, minutes, difficulty}] */
GRE.COMBOS = [
  {
    id: "recommended",
    name: "Recommended combo",
    tag: "Default · 8 weeks",
    who: "Start here. Balanced plan for a 325+ target with about 2 hours on weekdays.",
    split: [["Vocab", 25], ["Quant", 60], ["Verbal", 35], ["Error log", 10], ["Update", 5]],
    week: [
      ["Mon–Fri", "One Quant lesson every 2 days (sections 1–3 + Q1–10, then Q11–25). One Verbal practice set a day. 20 new words."],
      ["Saturday", "Timed mixed set or full mock. One essay every other week."],
      ["Sunday", "Weekly vocab quiz. Redo every open error-log question. Tick the syllabus."],
    ],
    rules: [
      "Follow the dated schedule row by row; this combo is what it is built on.",
      "Quant before Verbal on weekdays: it improves fastest and matters most for CS and MBA programmes.",
      "Never skip the 25-minute vocab block, even on a light day.",
    ],
    link: "01-Plan/Study-Schedule.md",
    presets: ["quant-s1", "verbal-s1", "mini-mock"],
  },
  {
    id: "quant",
    name: "Maths strength combo",
    tag: "Quant boost · 2–3 weeks",
    who: "Use when Quant is below 163 on a mock, or when the error log is mostly Quant concept errors.",
    split: [["Vocab", 15], ["Quant lesson", 45], ["Quant timed drill", 40], ["Verbal upkeep", 20], ["Error log", 15]],
    week: [
      ["Mon", "Weakest topic #1: re-read section 1, redo Q11–25 without notes."],
      ["Tue", "Weakest topic #1: 20-question exam (bank, difficulty 2–3), then review."],
      ["Wed", "Weakest topic #2: re-read, redo Q11–25."],
      ["Thu", "Weakest topic #2: 20-question exam, then review."],
      ["Fri", "Quantitative Comparison: 15 QC questions, special-numbers drill."],
      ["Sat", "Two timed Quant sections (12 in 21 min + 15 in 26 min)."],
      ["Sun", "Redo every Quant miss twice. Formula sheet from memory on paper."],
    ],
    rules: [
      "Accuracy before speed: get a topic to 80% untimed, then time it.",
      "After every miss, write the one-line rule that would have prevented it.",
      "Keep 20 minutes of Verbal a day so it does not fade.",
    ],
    link: "02-Quant/13-Quant-Pacing.md",
    presets: ["quant-weak", "quant-hard", "quant-qc"],
  },
  {
    id: "verbal",
    name: "English strength combo",
    tag: "Verbal boost · 2–3 weeks",
    who: "Use when Verbal is below 157, or misses are mostly vocab and reading.",
    split: [["Vocab (new + Anki)", 30], ["TC/SE drill", 30], ["Reading + RC", 40], ["Quant upkeep", 20], ["Error log", 15]],
    week: [
      ["Mon", "20 TC/SE questions, timed. Learn every unknown word from the options."],
      ["Tue", "Two RC passages untimed: write the main point and author's view before the questions."],
      ["Wed", "Vocab quiz for the last two weeks of words. 15 SE questions."],
      ["Thu", "Critical reasoning: 6 arguments, name conclusion and gap before answering."],
      ["Fri", "One timed Verbal section (12 in 18 min)."],
      ["Sat", "One timed Verbal section (15 in 23 min) + one long article, summarised in two sentences."],
      ["Sun", "Redo every Verbal miss. Add missed words to Anki with their sentence."],
    ],
    rules: [
      "Predict a word for every blank before looking at the options.",
      "For RC, you must point to the line that proves the answer.",
      "Read one dense article a day (Aeon, The Economist, Scientific American).",
    ],
    link: "03-Verbal/04-Verbal-Pacing.md",
    presets: ["verbal-s1", "verbal-sentences", "vocab-20"],
  },
  {
    id: "writing",
    name: "Writing booster",
    tag: "AWA 4.5+ · 1 week",
    who: "Use if a graded essay scores under 4.5 or you have not written one yet.",
    split: [["Plan 3 prompts", 15], ["Write 1 timed essay", 30], ["Self-score + rewrite", 20]],
    week: [
      ["Mon", "Read the guide and both sample essays. Build your example bank."],
      ["Tue", "Plan 5 prompts in 3 minutes each (thesis + 2 examples + counter)."],
      ["Wed", "Timed essay. Score it with the scorecard."],
      ["Thu", "Rewrite the weakest paragraph. Plan 5 more prompts."],
      ["Fri", "Timed essay on a different instruction type."],
    ],
    rules: [
      "Answer the specific instruction under the prompt.",
      "Specific, named examples beat general claims.",
      "Keep 3 minutes to proofread; the editor has no spell-check.",
    ],
    link: "05-Writing/01-Issue-Essay-Guide.md",
    presets: [],
  },
  {
    id: "fast",
    name: "4-week fast track",
    tag: "Short runway",
    who: "Only if the test is about 4 weeks away and the diagnostic is already 315+.",
    split: [["Vocab", 20], ["Quant", 70], ["Verbal", 40], ["Error log", 10]],
    week: [
      ["Week 1", "Formula sheet, QC strategy, arithmetic, algebra, word problems (Q11–25 only). TC and SE lessons."],
      ["Week 2", "Geometry, statistics, counting and probability (Q11–25). RC lesson + practice. Essay 1."],
      ["Week 3", "Timed sets 1–4, data interpretation. Official Verbal questions. POWERPREP 2."],
      ["Week 4", "Weak topics only, timed sets 5–6, POWERPREP PLUS, taper in the last 3 days."],
    ],
    rules: [
      "Skip easy practice problems; start each lesson at Q11.",
      "Two full mocks minimum, each fully reviewed.",
    ],
    link: "01-Plan/GRE-Plan.md",
    presets: ["mini-mock", "quant-hard", "verbal-s2"],
  },
  {
    id: "busy",
    name: "Busy-week combo",
    tag: "45–60 min a day",
    who: "For weeks when work takes over. Keeps progress alive without guilt.",
    split: [["Vocab (Anki)", 15], ["10 Quant questions", 20], ["6 Verbal questions", 15], ["Log", 5]],
    week: [
      ["Mon–Fri", "One 16-question mixed exam from the bank, then log misses."],
      ["Weekend", "Catch up on the schedule's Saturday block only."],
    ],
    rules: [
      "Do not double up the next day. Resume the schedule where you are.",
      "Vocab every day is the one thing you never drop.",
    ],
    link: "01-Plan/Study-Schedule.md",
    presets: ["daily-16"],
  },
  {
    id: "final",
    name: "Final 7 days",
    tag: "Taper",
    who: "The last week before the test.",
    split: [["Anki", 15], ["One timed section", 25], ["Review", 30]],
    week: [
      ["7–5 days out", "One timed Quant and one timed Verbal section a day. Review every miss."],
      ["4–3 days out", "Error-log rules, formula sheet, plan 10 essay prompts. No new topics."],
      ["2 days out", "45 minutes light review. Check ID and test-centre route."],
      ["1 day out", "30 minutes only. Pack the bag. Sleep early."],
    ],
    rules: [
      "No new material after the third day before the test.",
      "Same wake-up time as test day from day 4.",
    ],
    link: "01-Plan/Test-Day.md",
    presets: ["quant-s1", "verbal-s1"],
  },
];

/* ---------- Exam presets ---------- */
GRE.PRESETS = {
  "quant-s1": { name: "Quant section 1 (GRE style)", sections: [{ section: "quant", count: 12, minutes: 21, difficulty: [1, 2, 3] }] },
  "quant-hard": { name: "Quant section 2, hard", sections: [{ section: "quant", count: 15, minutes: 26, difficulty: [2, 3] }] },
  "quant-qc": { name: "QC sprint", sections: [{ section: "quant", types: ["qc"], count: 15, minutes: 20, difficulty: [1, 2, 3] }] },
  "quant-weak": { name: "Weak-topic Quant drill", weak: true, sections: [{ section: "quant", count: 20, minutes: 35, difficulty: [2, 3] }] },
  "verbal-s1": { name: "Verbal section 1 (GRE style)", sections: [{ section: "verbal", count: 12, minutes: 18, difficulty: [1, 2, 3] }] },
  "verbal-s2": { name: "Verbal section 2, hard", sections: [{ section: "verbal", count: 15, minutes: 23, difficulty: [2, 3] }] },
  "verbal-sentences": { name: "TC + SE sprint", sections: [{ section: "verbal", topics: ["tc", "se"], count: 20, minutes: 25, difficulty: [1, 2, 3] }] },
  "vocab-20": { name: "Vocab quiz (20)", sections: [{ section: "vocab", count: 20, minutes: 12, difficulty: [1, 2, 3] }] },
  "mini-mock": { name: "Mini mock (4 sections, 54 questions)", sections: [
    { section: "verbal", count: 12, minutes: 18, difficulty: [1, 2, 3] },
    { section: "quant", count: 12, minutes: 21, difficulty: [1, 2, 3] },
    { section: "verbal", count: 15, minutes: 23, difficulty: [2, 3] },
    { section: "quant", count: 15, minutes: 26, difficulty: [2, 3] },
  ]},
  "daily-16": { name: "Daily 16 (10 Q + 6 V)", sections: [
    { section: "quant", count: 10, minutes: 18, difficulty: [1, 2, 3] },
    { section: "verbal", count: 6, minutes: 9, difficulty: [1, 2, 3] },
  ]},
  "missed": { name: "Redo my missed questions", missed: true, sections: [{ section: "any", count: 20, minutes: 30, difficulty: [1, 2, 3] }] },
};

/* ---------- Advice by stage ---------- */
GRE.ADVICE = [
  { stage: "1. Before you start", points: [
    "Take an official diagnostic first. Plan from evidence, not from how you feel about math or English.",
    "Book the test early. A fixed date changes how seriously every study day gets treated, and good slots fill up.",
    "Decide your target from your programmes, not from the internet. Most CS and MBA programmes look hardest at Quant; most humanities programmes at Verbal and Writing.",
    "Buy official ETS material first. It is the only content that matches the real test's logic.",
    "Budget 2–3 months part-time. People with full-time jobs who score highly usually report steady daily study rather than weekend marathons.",
  ]},
  { stage: "2. Building foundations (weeks 1–4)", points: [
    "Learn one topic until you can solve its medium questions untimed with about 80% accuracy before moving on.",
    "Write down every formula and rule by hand once. Writing it beats re-reading it.",
    "Start vocabulary on day one, in small daily doses, with spaced repetition (Anki). Cramming words in the last two weeks rarely sticks.",
    "Learn words in context and in meaning groups, because Sentence Equivalence rewards knowing near-synonyms.",
    "Keep an error log from the first question. The log, not the volume of questions, is what high scorers credit most.",
  ]},
  { stage: "3. Practice phase (weeks 4–7)", points: [
    "Move from topic drills to mixed timed sets. The real test never tells you which topic a question is from.",
    "Time every set from now on. Knowing the method is half the job; doing it in under two minutes is the other half.",
    "Review is where the points are. Spend as long reviewing a set as solving it, including the ones you guessed right.",
    "For Quant, learn two methods for common question types: the algebra and a shortcut (plugging in numbers, back-solving, estimation).",
    "For Verbal, prove every answer from words in the sentence or passage. If you cannot point to it, it is a trap.",
    "Read one dense article a day in a field you do not enjoy. It builds the stamina long passages need.",
  ]},
  { stage: "4. Mock-test phase (weeks 5–8)", points: [
    "Take full tests under real conditions: same time of day, essay included, no pauses, scratch paper and the on-screen calculator only.",
    "Use official ETS tests to predict your score. Treat third-party Verbal scores as rough at best.",
    "Section 1 decides how hard section 2 is. Practise being most careful in the first Verbal and first Quant section.",
    "After each mock, list your top three point leaks and fix only those the next week.",
    "If two official mocks in a row sit well below target, move the test date rather than spend an attempt.",
  ]},
  { stage: "5. Final week", points: [
    "Stop new material three days before the test. Review your error-log rules and the formula sheet.",
    "Do short timed sections, not full mocks, in the last four days.",
    "Fix your sleep: wake at test-day time from midweek.",
    "Check your ID matches your ETS account name exactly, and check the route to the centre.",
  ]},
  { stage: "6. Test day", points: [
    "Arrive about 30 minutes early. Check-in includes ID checks, a photo and a security check.",
    "Scratch paper is provided at the centre. Phones and watches stay in the locker.",
    "Use Mark and Review: guess, mark, move on after about two minutes, and come back if time allows.",
    "Never leave a question blank. There is no penalty for wrong answers.",
    "Do Sentence Equivalence and Text Completion first in Verbal; they are the fastest points.",
    "Re-read the last line of every Quant question before confirming. Many misses answer a different question than the one asked.",
    "If a section feels hard, that is often a good sign: a harder second section means a stronger first one.",
  ]},
  { stage: "7. After the test", points: [
    "You see unofficial Verbal and Quant scores straight away; official scores with Writing follow in about 8–10 days.",
    "ScoreSelect lets you choose which test dates to send, so a retake rarely hurts.",
    "If you retake, rebuild the plan from that test's weak areas instead of repeating the same plan.",
    "You can retest after 21 days, up to five times in any 12 months.",
  ]},
];

GRE.INTERVIEW = [
  { stage: "Before the interview", points: [
    "Re-read your own application: SOP, CV and essays. Interviewers often ask about something you wrote.",
    "Research the programme deeply: courses, labs or professors (for PhD), clubs and career outcomes (for MBA). Know why this school and not another.",
    "Prepare 6–8 stories from your work (leading a team, a failure, a conflict, a hard decision, an impact you measured). Use the situation, task, action, result structure, and end each with what you learned.",
    "Prepare a 90-second answer to 'Tell me about yourself' that runs from past to present to your goal and why this degree is the bridge.",
    "Practise out loud, ideally on video or with a friend. Mock interviews are the single most recommended preparation.",
    "Prepare two or three specific questions to ask the interviewer that show research, not ones the website already answers.",
  ]},
  { stage: "Common questions", points: [
    "Tell me about yourself.",
    "Why this degree, why now, and why this programme?",
    "What are your short-term and long-term goals?",
    "Tell me about a time you led a team / failed / handled conflict.",
    "What will you contribute to the class or the lab?",
    "(PhD) Walk me through a project you did. What would you do differently? What research would you like to do here, and with whom?",
    "(MBA) What is your biggest weakness as a leader? Which other schools are you applying to?",
    "Do you have any questions for us?",
  ]},
  { stage: "On the day", points: [
    "For video interviews: test camera, sound and lighting beforehand; look at the camera, not the screen.",
    "Answer the question asked, in about 1–2 minutes, then stop. Let the interviewer ask follow-ups.",
    "Use numbers where you have them (team size, money saved, users, growth).",
    "Be honest about gaps or weaknesses and say what you did about them.",
    "Send a short thank-you email within 24 hours, mentioning one specific point from the conversation.",
  ]},
];

/* ---------- Resources ---------- */
GRE.RESOURCES = {
  free: [
    { name: "GRE Math Review (official PDF, about 100 pages)", url: "https://www.ets.org/content/dam/ets-org/pdfs/gre/gre-math-review.pdf", note: "ETS's own summary of every Quant topic. Free download from ETS.", dl: true },
    { name: "GRE Mathematical Conventions (official PDF)", url: "https://globalhighered.ets.org/gre-mathematical-conventions", note: "Notation and assumptions the test uses (figures, rounding, etc.). ETS asks for an email before the download.", dl: true },
    { name: "GRE Information Bulletin (official PDF)", url: "https://www.ets.org/content/dam/ets-org/pdfs/gre/gre-info-bulletin.pdf", note: "Rules, fees, ID, score reporting. Read the test-day and ID parts.", dl: true },
    { name: "POWERPREP practice tests", url: "https://www.ets.org/gre/test-takers/general-test/prepare/powerprep.html", note: "Two free official tests in your ETS account, plus paid POWERPREP PLUS tests." },
    { name: "Free mini quiz (ETS)", url: "https://www.ets.org/gre/gre-mini-quiz.html", note: "Short official warm-up." },
    { name: "Official GRE prep page", url: "https://www.ets.org/gre/test-takers/general-test/prepare.html", note: "Everything ETS offers for preparation." },
    { name: "Test content and sections", url: "https://www.ets.org/gre/test-takers/general-test/prepare/content.html", note: "Official description of each question type." },
    { name: "Fees", url: "https://www.ets.org/gre/test-takers/general-test/register/fees.html", note: "Check the current fee before booking." },
    { name: "ID requirements", url: "https://www.ets.org/gre/test-takers/general-test/register/id-requirements.html", note: "Check what ID your country requires." },
    { name: "Register / schedule", url: "https://www.ets.org/gre/test-takers/schedule.html", note: "Book the test." },
  ],
  paid: [
    { name: "The Official Guide to the GRE General Test", note: "Real questions, two practice tests in the book. Buy the print or eBook from ETS, Amazon or McGraw Hill.", url: "https://www.ets.org/gre/test-takers/general-test/prepare.html" },
    { name: "Official GRE Verbal Reasoning Practice Questions", note: "150 real Verbal questions. The most valuable book for Verbal.", url: "https://www.ets.org/gre/test-takers/general-test/prepare.html" },
    { name: "Official GRE Quantitative Reasoning Practice Questions", note: "150 real Quant questions.", url: "https://www.ets.org/gre/test-takers/general-test/prepare.html" },
    { name: "POWERPREP PLUS tests", note: "Paid official tests with explanations and a scored essay.", url: "https://www.ets.org/gre/test-takers/general-test/prepare/powerprep.html" },
  ],
  optional: [
    { name: "GregMat+", url: "https://www.gregmat.com", note: "Low-cost video course with a large question bank; widely recommended by test-takers." },
    { name: "Khan Academy", url: "https://www.khanacademy.org", note: "Free, slower explanations of basic math." },
    { name: "Anki", url: "https://apps.ankiweb.net", note: "Free spaced-repetition flashcards. Import 04-Vocab/anki-import.tsv." },
    { name: "Manhattan Prep free practice test", url: "https://www.manhattanprep.com/gre/", note: "Extra stamina practice; treat its score as rough." },
  ],
};
