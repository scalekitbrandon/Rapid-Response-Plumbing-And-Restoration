# Rapid Response: Launch Checklist

Site build is complete (80 pages as of 2026-10-27: 14 town pages plus 40 local service pages under /<town>/<service>/). Lighthouse (mobile): Accessibility 100, Best Practices 100, SEO 100,
Performance 86–99 on all audited pages. 0 broken internal links, 0 duplicate titles, one H1 per page.

## Blockers: needed from the client
- [ ] **Lead form webhook**: create the GHL Inbound Webhook, paste its URL into `LEAD_WEBHOOK` in `src/data/site.ts`, set `FORMS_LIVE = true`, then send a test lead
- [ ] **Plumbing services list**: confirm the 6 plumbing pages match what they actually offer (methods, tankless, sewer lines, reroutes, whole-house repipes)
- [ ] **Reviews**: confirm the 8 Google reviews are from real customers (FTC fake-review rule)
- [x] **"1 hour or less"**: client confirmed (2026-10-27) the promise applies to every page and every service area, including the Inland Empire and Las Vegas/Henderson. All town and local pages now promise it.
- [ ] **"A real person answers"**: confirm (trust strip and FAQ copy)
- [ ] **Privacy Policy**: client or attorney review, add a contact email
- [ ] **Domain**: confirm the final domain (`site` in `astro.config.mjs` is currently rapidresponsefloodrestoration.com)

- [ ] **Inland Empire + Daggett on the Google Business Profile**: add San Bernardino, Rialto, Fontana and Rancho Cucamonga to the GBP service areas so the profile matches the new town pages
- [ ] **New page claims**: confirm sewer line repair methods (section repair vs. replacement, camera inspection), septic backup cleanup, and warehouse/sprinkler losses in Fontana

- [ ] **Las Vegas: Nevada contractor license**. Plumbing and most restoration work in Nevada requires a Nevada State Contractors Board license. Confirm the license before the /las-vegas/ pages go live, and add the NV license # to those pages.
- [ ] **Las Vegas: separate Google Business Profile**. The California profile cannot rank in Las Vegas Maps (it is ~3 hours away). The Las Vegas Valley needs its own GBP (real address or service-area setup, ideally a local 702 number) linked to /las-vegas/.
- [ ] **Henderson** is covered by the same Nevada license + Las Vegas GBP items above (add Henderson as a GBP service area)
- [ ] **Las Vegas: claims to confirm**: Henderson / North Las Vegas / Summerlin coverage, condo/HOA work, tankless service, and polybutylene repiping

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
