# Rapid Response: Launch Checklist

Site build is complete (38 pages as of 2026-10-27). Lighthouse (mobile): Accessibility 100, Best Practices 100, SEO 100,
Performance 86–99 on all audited pages. 0 broken internal links, 0 duplicate titles, one H1 per page.

## Blockers: needed from the client
- [ ] **Lead form webhook**: create the GHL Inbound Webhook, paste its URL into `LEAD_WEBHOOK` in `src/data/site.ts`, set `FORMS_LIVE = true`, then send a test lead
- [ ] **Plumbing services list**: confirm the 6 plumbing pages match what they actually offer (methods, tankless, sewer lines, reroutes, whole-house repipes)
- [ ] **Reviews**: confirm the 8 Google reviews are from real customers (FTC fake-review rule)
- [ ] **"1 hour or less"**: confirm it holds for the Victor Valley (Barstow, Yermo and Newberry Springs already avoid the promise). The top bar still says it site-wide.
- [ ] **"A real person answers"**: confirm (trust strip and FAQ copy)
- [ ] **Privacy Policy**: client or attorney review, add a contact email
- [ ] **Domain**: confirm the final domain (`site` in `astro.config.mjs` is currently rapidresponsefloodrestoration.com)

- [ ] **Inland Empire + Daggett on the Google Business Profile**: add San Bernardino, Rialto, Fontana and Rancho Cucamonga to the GBP service areas so the profile matches the new town pages
- [ ] **New page claims**: confirm sewer line repair methods (section repair vs. replacement, camera inspection), septic backup cleanup, and warehouse/sprinkler losses in Fontana

## Nice to have
- [ ] CSLB license # (add to the footer), IICRC or other certifications, years in business, job count
- [ ] Transparent-background logo (the current one is cropped to a circle)
- [ ] Cut-out van photo, and indoor fire-cleanup photos
- [ ] Commercial-job reviews

## Deploy (astro-deploy)
- [ ] GitHub repo + Cloudflare deploy; `public/_redirects` handles the old Apple Valley/Adelanto URLs
- [ ] Analytics + GHL tracking code
- [ ] Google Search Console: verify, submit `sitemap-index.xml`, request indexing for the key pages
- [ ] Google Business Profile: set the website link to the new homepage
- [ ] Check map embeds and the mobile call bar on a real phone
