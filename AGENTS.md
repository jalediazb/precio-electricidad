# AGENTS.md

## Commands
- `npm run serve` — dev server with hot reload (Eleventy `--serve`)
- `npx @11ty/eleventy` — build to `_site/` (no `build` script exists)
- No test, lint, or typecheck scripts exist

## Purpose
- The site is monetized with **Google AdSense** and was rejected once for "low value content". Prioritize original, verified content over volume.
- **Never invent or hardcode volatile facts** (specific daily prices, dated news, foreign-market figures). Cite official Spanish sources with links.
- Electricity data must come from **Spanish sources** (REE/ESIOS, OMIE, CNMC, MITECO, IDAE, OCU). The Spanish market (PVPC, peajes, 2.0TD) is not comparable to other countries'.

## Architecture
- **Eleventy 3** static site, ES modules (`"type": "module"`)
- Non-standard dir layout: input `./src`, data `../_data`, includes `../_includes`
- Build-time data flow: `utils/ObtenerPreciosElectricidad.js` fetches ESIOS/REE API → writes `_data/precios.json` → consumed by Nunjucks templates. If tomorrow's price isn't published yet, the build logs "No se han encontrado datos" and still succeeds, keeping the previous `precios.json` — not an error.
- `.env` with `API_ESIOS` key required for price fetch (gitignored)
- `worker.js` is a standalone Cloudflare Worker for triggering deploys — not part of the site
- `/actualidad/` (blog) is generated from `src/actualidad.njk` (index) + `_includes/post.njk` (posts) + `src/actualidad-feed.njk` (RSS)
- Removed/merged URLs redirect via `src/_redirects.njk` (Cloudflare Pages format)

## Hard constraints
- Never modify the price pipeline or chart: `utils/ObtenerPreciosElectricidad.js`, `_data/precios.json` generation, `_includes/js/scripts.js`, and the chart/price-bar markup in `index.njk`/`footer.njk`.

## Content
- Guides: `src/*.md` with `layout: page`. Blog posts: `src/actualidad/*.md` with `layout: post` and `tags: actualidad` (auto-listed on `/actualidad/` and in the RSS feed). Homepage: `src/index.md` with `layout: index`
- Front matter: `title`, `meta_description`, `date`, `updated`, `author` (`ElectON`), `og_image`, `related_links`. `og_image` must exist in `src/img/`
- **Never rename a content file**: the filename defines the URL. Do not add `permalink`
- **Do not write an H1 in the body**: templates render it from `title`
- TOC: guides use a manual `<details>` TOC with `<h2 id="kebab-case">` (keep both in sync); posts and trust pages use plain `##`
- Internal links use root-absolute permalinks (`/slug/`)
- Date display: when `date` and `updated` match, only the update date is shown
- Removing/merging a page: add a 301 to `src/_redirects.njk` and update `header.njk`, `footer.njk` and `index.md`

## FAQs (required on guides and posts)
- Always at the END of the markdown body, using the exact schema.org markup from `src/ahorrar-factura-luz.md`.
- Structure: `<div id="faqs" itemscope="" itemtype="https://schema.org/FAQPage">` → `<h2>Preguntas frecuentes</h2>` → per question `<div itemscope="" itemprop="mainEntity" itemtype="https://schema.org/Question" class="block">` with `<h3 itemprop="name">…</h3>` and `<div itemscope="" itemprop="acceptedAnswer" itemtype="https://schema.org/Answer"><div itemprop="text"><p>…</p></div></div>`.
- 3-5 questions.
- Raw HTML only: markdown inside the block is not rendered (`**text**` won't work → use `<strong>`).
- Do not change the `faqs` id or the container markup.

## SEO & structured data
- `head.njk` emits `canonical` on every page and `Organization`/`WebSite` on the homepage; `page.njk`/`post.njk` emit `BlogPosting` + `BreadcrumbList`. Do not duplicate or hardcode these in content.
- FAQs use inline microdata (the `faqSchema` frontmatter is legacy).
- Legal pages (`aviso-legal`, `politica-*`) are `noindex` and excluded from the sitemap; `robots.txt` allows them.

## Cookies / consent
- Do not add a self-hosted cookie banner or Consent Mode. It was removed on purpose; Google's official CMP will be used when AdSense is integrated.

## Conventions
- Vanilla JS only. No frameworks. Ask before adding npm packages
- All visitor-facing text in Spanish (es-ES, peninsular)
- Bulma CSS exclusively for styling — use its classes; ask before custom CSS. Bulma sets `strong { color: #363636 }`: on dark backgrounds (article hero) add `color: inherit` so it stays visible.
- Templates are Nunjucks (`.njk`) in `_includes/`
- Domain: `electon.es`

## Skills
- `.agents/skills/seo-reescritura-electon/` — SEO research/rewrite pipeline. Uses MarkItDown + Brave Search with **Spanish sources only** (the Spanish electricity market is not comparable to others).
