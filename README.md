# Career Workspace — Kunhee (Geoffrey) Kim

Personal career helper for resume tailoring, portfolio site, and cover letters.

## Structure

```
career-workspace/
├── assets/           # Resume PDFs, headshots, exports
├── cover-letters/    # Tailored cover letters (one file per role)
├── resume/           # Resume versions + keyword analysis
│   ├── profile.md    # Master profile (source of truth)
│   └── keyword_matcher.py
└── website/          # Portfolio HTML/CSS
```

## Tasks

| Task | What it does | How to use |
|------|--------------|------------|
| **1 — Resume builder** | Keyword match vs. JD (srbhr/Resume-Matcher logic) | Paste a job description; get missing keywords + bullet rewrites |
| **2 — Personal website** | Simple HTML/CSS portfolio | Edit `website/index.html` and `website/styles.css` |
| **3 — Cover letters** | Direct letters emphasizing data warehouse/lake experience | Paste a JD; get a tailored letter in `cover-letters/` |

## Target roles

- Data Engineer (primary)
- Data / Business Analyst (secondary)

## Quick start — Resume keyword match

```bash
python resume/keyword_matcher.py --jd path/to/job.txt --resume resume/profile.md
```
