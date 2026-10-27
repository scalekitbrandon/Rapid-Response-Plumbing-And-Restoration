# Rapid Response: Deploy Notes

General playbook: `~/Scale Kit - Visual Studio Code/SOP-astro-cloudflare-deploy.md`. Below are only the facts specific to this client.

## Hosting
- **Repo:** https://github.com/scalekitbrandon/Rapid-Response-Plumbing-And-Restoration (branch `main`; every push auto-deploys)
- **Cloudflare:** Brandon's (ScaleKit) account for now; transfer to the client later. Worker name `rapid-response`. Static assets deployed via `wrangler.jsonc` (no adapter)
- **Build:** `npm run build` → `dist/`. `public/_redirects` handles the old WordPress URLs `/property-restoration-apple-valley/` and `/property-restoration-adelanto/`

## Domain: rapidresponsefloodrestoration.com (as found 2026-10-27)
- **Registrar:** GoDaddy (expires 2027-07-04)
- **Nameservers:** Hostinger (`aurora.dns-parking.com`, `nebula.dns-parking.com`)
- **Old site:** WordPress on Hostinger (root A `195.35.60.252`, `212.1.212.6`; `www` CNAME `www.rapidresponsefloodrestoration.com.cdn.hstgr.net`)
- **Email: live on Hostinger Mail.** Every record below must exist in Cloudflare DNS (set to **DNS only**, grey cloud) before the nameservers change:

| Type | Name | Value |
|---|---|---|
| MX | @ | `mx1.hostinger.com` (priority 5) |
| MX | @ | `mx2.hostinger.com` (priority 10) |
| TXT | @ | `v=spf1 include:_spf.mail.hostinger.com ~all` |
| TXT | @ | `google-site-verification=g_ALM2HcMYCZ6cycocm4H8Zg12tjQJd2fEcwbzc34OM` (Search Console) |
| TXT | @ | `apple-domain-verification=bCm24lEaawPBZtIc` |
| TXT | _dmarc | `v=DMARC1; p=none` |
| CNAME | hostingermail-a._domainkey | `hostingermail-a.dkim.mail.hostinger.com` |
| CNAME | hostingermail-b._domainkey | `hostingermail-b.dkim.mail.hostinger.com` |
| CNAME | hostingermail-c._domainkey | `hostingermail-c.dkim.mail.hostinger.com` |
| CNAME | autodiscover | `autodiscover.mail.hostinger.com` |
| CNAME | autoconfig | `autoconfig.mail.hostinger.com` |

- **Delete only** the root `A` records and the `www` CNAME that point at Hostinger. The Worker's custom domains replace them.

## After cutover
- Check that email still sends and receives (Hostinger webmail or the client's phone)
- Run `python3 ~/.claude/skills/indexing-health/scripts/index_check.py --live https://rapidresponsefloodrestoration.com`
- In Search Console (already verified via the TXT record above), submit `sitemap-index.xml`
- Cancel Hostinger **website** hosting only after the new site is confirmed live. Keep the **Hostinger email** plan
