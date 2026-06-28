# Portfolio Website — Kunhee (Geoffrey) Kim

Interactive single-page portfolio. Centerpiece is a **live force-directed knowledge graph**
of my career (companies, projects, skills). Bilingual EN/KR toggle, animated stats, and
data-architecture pipeline diagrams.

## Stack

- Plain **HTML / CSS / JavaScript** — no build step, no dependencies to maintain
- [`force-graph`](https://github.com/vasturiano/force-graph) **self-hosted** in `vendor/` (no CDN, works offline / behind ad blockers)
- Google Fonts: Inter + JetBrains Mono

```
website/
├── index.html   # structure + content
├── styles.css   # dark "engineer" theme, responsive
├── app.js        # graph data, interactions, i18n, counters
└── vendor/
    └── force-graph.min.js   # self-hosted graph library (v1.43.5)
```

> Asset references in `index.html` carry a `?v=` cache-busting suffix. After editing
> `app.js` / `styles.css`, bump that suffix so browsers fetch the matching files together.

## Run locally

No build needed. Either open `index.html` directly, or serve it (recommended, so fonts/CDN load cleanly):

```bash
cd website
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy to Cloudflare Pages (free, unlimited bandwidth)

**Option A — connect the Git repo (auto-deploys on every push):**
1. Push this repo to GitHub.
2. Go to Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repo. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `website`
4. Deploy. You get a free `*.pages.dev` URL with SSL. Every `git push` redeploys.

**Option B — direct upload (no Git):**
1. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Upload assets**.
2. Drag the `website/` folder. Done.

### Custom domain (optional)
Pages project → **Custom domains → Set up a domain** → add your domain (e.g. `geoffreykim.com`).
SSL is automatic and free.

## Editing content

- **Graph nodes/links:** edit the `NODES` and `LINKS` arrays at the top of `app.js`.
- **Translations:** edit the `I18N` map in `app.js` (each entry is `[english, korean]`).
- **Sections/text:** edit `index.html` (English defaults live in the markup; Korean lives in `I18N`).

## Add AI later (deferred)

To add an "Ask my AI" assistant at $0:
- **Browser-only:** load a small model with [WebLLM](https://github.com/mlc-ai/web-llm) or
  `transformers.js` — no backend, no API keys.
- **Serverless:** add a Cloudflare Pages Function (`/functions/ask.js`) that proxies a
  free-tier LLM API so the key stays server-side.
