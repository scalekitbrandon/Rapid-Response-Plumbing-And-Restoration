# Rapid Response: Deploy Notes

General playbook: `~/Scale Kit - Visual Studio Code/SOP-astro-cloudflare-deploy.md`. Below are only the facts specific to this client.

## Hosting
- **Repo:** https://github.com/scalekitbrandon/Rapid-Response-Plumbing-And-Restoration (branch `main`; every push auto-deploys)
- **Cloudflare:** Brandon's (ScaleKit) account for now; transfer to the client later. Worker `rapid-response-plumbing-and-restoration` → https://rapid-response-plumbing-and-restoration.brandon-8f2.workers.dev. Static assets deployed via `wrangler.jsonc` (no adapter)
- **Build:** `npm run build` → `dist/`

## New domain: rapidresponseplumbingandrestoration.com
- Bought on Hostinger 2026-10-27. On that date it had no DNS records and no email.
- `site` in `astro.config.mjs` is set to it, so canonicals, the sitemap, robots and schema all use it.
- **Live 2026-10-28.** Nameservers are `buck.ns.cloudflare.com` and `sara.ns.cloudflare.com` (set in Hostinger).
- **Root domain:** a custom domain on the Worker.
- **www:** not a Worker custom domain. Adding it through the Worker silently failed twice. Instead, a proxied `CNAME www → rapidresponseplumbingandrestoration.com` plus the Redirect Rule "www to root" (hostname equals www…, 301 to `concat("https://rapidresponseplumbingandrestoration.com", http.request.uri.path)`, query string preserved).
- **Always Use HTTPS:** on. http and www each reach the https root in one 301.
- If the client later wants email on this domain, add those records in Cloudflare DNS.

## Old domain: rapidresponsefloodrestoration.com (keep renewing it, never let it lapse)
- **Registrar:** GoDaddy (expires 2027-07-04)
- **DNS:** Hostinger (`aurora.dns-parking.com` / `nebula.dns-parking.com`)
- **Hosting:** WordPress on Hostinger
- **Email:** live on Hostinger Mail and stays there. Don't change its DNS or nameservers.
- **Redirect:** every URL 301s page-for-page to the new domain via `old-domain.htaccess` (in this repo). Paste its rules at the **top** of `public_html/.htaccess` in Hostinger File Manager for the old domain, above the `# BEGIN WordPress` block.
  - This sends the old `/property-restoration-apple-valley/` and `/property-restoration-adelanto/` URLs straight to the new town pages, one hop.
  - It also shuts off wp-admin, which is expected because the WordPress site is retired.
- **Keep:** keep the Hostinger hosting plan active; it serves the redirects and the email. Canceling it breaks both.
- **Email records on the old domain** (for reference; leave them as they are):
  - MX: `mx1.hostinger.com` (5) and `mx2.hostinger.com` (10)
  - SPF: `v=spf1 include:_spf.mail.hostinger.com ~all`
  - DMARC: `v=DMARC1; p=none`
  - DKIM: `hostingermail-a/b/c._domainkey` CNAMEs
  - `autodiscover` and `autoconfig` CNAMEs
  - TXT: `google-site-verification=g_ALM2…` and `apple-domain-verification`

## After cutover
1. Check that the new domain and `www` load, and that http goes to https:
   ```
   python3 ~/.claude/skills/indexing-health/scripts/index_check.py --live https://rapidresponseplumbingandrestoration.com
   ```
2. Check that the old domain's URLs 301 to the matching new pages.
3. **Google Search Console:**
   1. Add and verify the new domain.
   2. Submit `sitemap-index.xml`.
   3. In the **old** property (already verified), run **Settings → Change of address** to point it at the new domain.
4. **Google Business Profile:** change the website link to the new domain.
5. **Citations:** update the website link on Yelp, BBB, Facebook and other directories over time.
