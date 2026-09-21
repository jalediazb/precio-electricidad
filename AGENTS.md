# AGENTS.md

## Commands
- `npm run serve` — dev server with hot reload (Eleventy `--serve`)
- No test, lint, or typecheck scripts exist

## Architecture
- **Eleventy 3** static site, ES modules (`"type": "module"`)
- Non-standard dir layout: input `./src`, data `../_data`, includes `../_includes`
- Build-time data flow: `utils/ObtenerPreciosElectricidad.js` fetches ESIOS/REE API → writes `_data/precios.json` → consumed by Nunjucks templates
- `.env` with `API_ESIOS` key required for price fetch (gitignored)
- `worker.js` is a standalone Cloudflare Worker for triggering deploys — not part of the site

## Conventions
- Vanilla JS only. No frameworks. Ask before adding npm packages
- All visitor-facing text in Spanish
- Bulma CSS exclusively for styling — use its classes; ask before custom CSS
- Content files are Markdown in `src/` with front matter (`layout: page` for articles, `layout: index` for homepage)
- Templates are Nunjucks (`.njk`) in `_includes/`
- Domain: `electon.es`
