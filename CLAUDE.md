# Rapid Response Plumbing & Restoration (Astro)

## Content standard: town pages must be at least 70% original
- Every `/<town>/` and `/<town>/<service>/` page must be at least 70% original: 5-word phrases in `<main>`, compared with the most similar page on the site, after removing site-wide boilerplate.
- `npm run build` runs `scripts/check-uniqueness.mjs` as a postbuild step and fails the build (which blocks the Cloudflare deploy) if a page misses the bar. Run `npm run check:unique` after editing, or use `--page /hesperia/` for a single page.
- `scripts/uniqueness-baseline.json` is the backlog of pages that were already under the bar on 2026-11-18. Those pages can't get worse, and they drop off the list once they pass. **Never add a page to the baseline to get a build through.** Rewrite the page instead.
- Before writing a new town page or town-plus-service page, check that it is a town that actually brings calls. If it doesn't, put the content in the town page instead (see the Henderson merge in `public/_redirects`).
- Local detail has to be true: neighborhoods, housing and pipe types from public sources. Use the `job` and `review` frontmatter only for real client jobs and word-for-word Google reviews. Never invent them, never use them as "examples", and never use the City Photo Package folder names as job locations.
- Only claim equipment or services the client has confirmed. The site already names moisture meters, containment, dehumidifiers and air movers. Thermal imaging, HEPA, camera inspection and hydro-jetting are not confirmed.
