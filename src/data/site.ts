import type { IconName } from '../lib/icons';

// Single source for business details and navigation.
// Facts come from rapidresponsefloodrestoration.com (pulled 2026-10-24); see CLIENT-NOTES.md.

/**
 * Lead forms
 * - FORMS_LIVE: true = the inspection form POSTs leads (JSON) to LEAD_WEBHOOK (a GHL Inbound Webhook).
 *   false = demo mode: the form validates and shows a "not connected yet" note but sends nothing.
 * TODO(client): create the GHL inbound webhook, paste its URL below, then set FORMS_LIVE = true.
 */
export const FORMS_LIVE = true;
export const LEAD_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/mCPAt01nhLYkOLgWnrhP/webhook-trigger/32e97898-b7cf-4607-b1a1-d7b4070e6d63';

export const business = {
  name: 'Rapid Response Plumbing & Restoration',
  phoneDisplay: '855-47-RAPID',
  phoneDigits: '855-477-2743',
  phoneHref: 'tel:+18554772743',
  reviewUrl: 'https://g.page/r/CZU8FEaOlw9ZEAI/review',
  // Google Business Profile (verified 2026-10-24: "Rapid Response Plumbing & Restoration", 5.0, service-area business)
  googleCid: '2658138234312743476',
  googleReviewsUrl: 'https://www.google.com/maps?cid=2658138234312743476',
  tagline: 'We Respond Fast. We Restore Right.',
};

/**
 * Nevada (Las Vegas + Henderson): false = those 22 pages are still built but noindexed, left out of the sitemap,
 * and removed from menus, town lists, schema and copy site-wide (Markdown copy via the remark filter in astro.config.mjs).
 * Set true on 2026-10-27 at launch (user decision). TODO(client): add the NV contractor license # to the Nevada pages.
 */
export const NEVADA_LIVE = true;

export type Region = 'High Desert' | 'Inland Empire' | 'Nevada';

export const regions: Region[] = (['High Desert', 'Inland Empire', 'Nevada'] as Region[]).filter((r) => NEVADA_LIVE || r !== 'Nevada');

/** Every service area, including Nevada. Use for page lookups; use `serviceAreas` for anything visitors see. */
export const allServiceAreas: { name: string; slug: string; region: Region; state: 'CA' | 'NV'; blurb: string }[] = [
  { name: 'Victorville', slug: 'victorville', region: 'High Desert', state: 'CA', blurb: 'Emergency water damage, flood cleanup, mold, sewage, fire damage and structural drying for homes and businesses.' },
  { name: 'Apple Valley', slug: 'apple-valley', region: 'High Desert', state: 'CA', blurb: 'Residential and commercial water losses, flood damage, drying, demolition and property recovery.' },
  { name: 'Hesperia', slug: 'hesperia', region: 'High Desert', state: 'CA', blurb: 'Plumbing failures, water intrusion, flooded properties, mold, sewage backups, smoke and fire losses.' },
  { name: 'Adelanto', slug: 'adelanto', region: 'High Desert', state: 'CA', blurb: 'Water damage, flooding, moisture problems, sewage losses, mold, smoke and fire damage.' },
  { name: 'Helendale', slug: 'helendale', region: 'High Desert', state: 'CA', blurb: '24/7 water damage, flooding, drying, mold, sewage, fire and smoke cleanup.' },
  { name: 'Barstow', slug: 'barstow', region: 'High Desert', state: 'CA', blurb: 'Water extraction, structural drying, flood cleanup, material removal and commercial restoration.' },
  { name: 'Yermo', slug: 'yermo', region: 'High Desert', state: 'CA', blurb: 'Water damage, flooding, drying, contaminated water cleanup and fire damage response.' },
  { name: 'Newberry Springs', slug: 'newberry-springs', region: 'High Desert', state: 'CA', blurb: 'Water losses, flooded properties, drying, cleanup, demolition, mold and fire damage.' },
  { name: 'Daggett', slug: 'daggett', region: 'High Desert', state: 'CA', blurb: 'Water damage, frozen pipes, well and supply line leaks, mold and fire damage for rural properties.' },
  { name: 'San Bernardino', slug: 'san-bernardino', region: 'Inland Empire', state: 'CA', blurb: 'Aging pipes, sewer line problems, water damage, mold and fire and smoke cleanup for homes and businesses.' },
  { name: 'Rialto', slug: 'rialto', region: 'Inland Empire', state: 'CA', blurb: 'Plumbing repairs, sewer and drain problems, water damage, flooding and mold for homes and rentals.' },
  { name: 'Fontana', slug: 'fontana', region: 'Inland Empire', state: 'CA', blurb: 'Residential and commercial water damage, slab leaks, sewer backups and warehouse restoration.' },
  { name: 'Rancho Cucamonga', slug: 'rancho-cucamonga', region: 'Inland Empire', state: 'CA', blurb: 'Leaks, slab leaks, water heaters, water damage, mold and wildfire smoke cleanup.' },
  { name: 'Las Vegas', slug: 'las-vegas', region: 'Nevada', state: 'NV', blurb: 'Plumbing, water damage, flooding, sewage, mold and fire restoration across the Las Vegas Valley.' },
  { name: 'Henderson', slug: 'henderson', region: 'Nevada', state: 'NV', blurb: 'Slab leaks, water heaters, AC condensate leaks, water damage, mold and fire restoration for homes and businesses.' },
];

/** Service areas shown on the site (Nevada hidden until NEVADA_LIVE). */
export const serviceAreas = allServiceAreas.filter((a) => NEVADA_LIVE || a.state !== 'NV');

/** The town list used in body copy, e.g. "We serve {areaList}." */
export const areaList = `Victorville, Apple Valley, Hesperia, Adelanto, Helendale, Barstow, Yermo, Newberry Springs and Daggett, plus San Bernardino, Rialto, ${
  NEVADA_LIVE ? 'Fontana, Rancho Cucamonga and Las Vegas, Nevada' : 'Fontana and Rancho Cucamonga'
}`;
/** Short label for the whole footprint. */
export const footprint = NEVADA_LIVE ? 'Southern California & Las Vegas' : 'Southern California';

export const restorationServices: { label: string; href: string; icon: IconName; blurb: string }[] = [
  { label: 'Water Damage Restoration', href: '/water-damage-restoration/', icon: 'drop', blurb: 'Emergency water extraction, structural drying and cleanup after leaks, burst pipes and overflows.' },
  { label: 'Water Mitigation & Structural Drying', href: '/water-mitigation/', icon: 'fan', blurb: 'Fast extraction, moisture mapping and professional drying to stop water damage from spreading.' },
  { label: 'Flood Damage Restoration', href: '/flood-damage/', icon: 'flood', blurb: 'Fast flood cleanup and dry-out after storms, overflows and major water intrusion.' },
  { label: 'Sewage Cleanup', href: '/sewage-cleanup/', icon: 'toilet', blurb: 'Safe removal, cleaning and sanitizing after sewer backups and contaminated water.' },
  { label: 'Mold Remediation', href: '/mold-remediation/', icon: 'mold', blurb: 'Containment, removal and cleanup of mold, plus fixing the moisture problem that caused it.' },
  { label: 'Fire & Smoke Damage', href: '/fire-smoke-damage-restoration/', icon: 'fire', blurb: 'Soot and smoke cleanup, damaged material removal and cleanup of water left from firefighting.' },
  { label: 'Commercial Restoration', href: '/commercial-property-restoration/', icon: 'building', blurb: 'Water, flood, fire and mold restoration for offices, retail, warehouses and rentals.' },
];

// TODO(client): placeholder plumbing list. The current site has no plumbing services.
// Replace with the client's real list before launch.
export const plumbingServices: { label: string; href: string; icon: IconName; blurb: string }[] = [
  { label: 'Emergency Plumber', href: '/plumbing/emergency-plumber/', icon: 'valve', blurb: '24/7 response for burst pipes, major leaks, water heater failures and sewer backups. On the way fast.' },
  { label: 'Burst Pipe Repair', href: '/plumbing/burst-pipe-repair/', icon: 'freeze', blurb: 'Stop the water, repair split and frozen pipes, and dry out everything the burst soaked.' },
  { label: 'Plumbing Repairs', href: '/plumbing/plumbing-repairs/', icon: 'toilet', blurb: 'Toilets, faucets, supply lines, shut-off valves, fixtures and everyday plumbing problems.' },
  { label: 'Leak Detection', href: '/plumbing/leak-detection/', icon: 'drop', blurb: 'Track down hidden leaks in walls, ceilings and under floors before they cause bigger damage.' },
  { label: 'Slab Leak Repair', href: '/plumbing/slab-leak-repair/', icon: 'slab', blurb: 'Find and fix leaks under your foundation, then dry out any water that spread into the home.' },
  { label: 'Water Heaters', href: '/plumbing/water-heaters/', icon: 'heater', blurb: 'Repair and replacement for leaking, noisy or failed tank and tankless water heaters.' },
  { label: 'Drain Cleaning', href: '/plumbing/drain-cleaning/', icon: 'drain', blurb: 'Clear clogged sinks, tubs, toilets and main lines, and stop backups before they overflow.' },
  { label: 'Sewer Line Repair', href: '/plumbing/sewer-line-repair/', icon: 'pipe', blurb: 'Repair cracked, root-damaged and collapsed sewer lines, and clean up any backup they caused.' },
  { label: 'Repiping', href: '/plumbing/repiping/', icon: 'home', blurb: 'Replace old, corroded or leak-prone supply lines with new piping built to last.' },
];

export const primaryNav = [
  { label: 'Home', href: '/' },
  { label: 'Plumbing', href: '/plumbing/', children: plumbingServices },
  { label: 'Restoration', href: '/restoration/', children: restorationServices },
  {
    label: 'Locations',
    href: '/locations/',
    children: [
      { label: 'All Service Areas', href: '/locations/' },
      ...serviceAreas.map((a) => ({ label: a.name, href: `/${a.slug}/`, group: a.region })),
    ],
  },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Contact', href: '/contact-us/' },
];

export const utilityLinks = [
  { label: '24/7 Emergency Response – 1 Hour or Less' },
  { label: 'Free Inspections', href: '/#request-inspection' },
];

export const damageTypes = [
  'Water damage / leak',
  'Burst pipe / plumbing problem',
  'Flooding',
  'Sewage backup',
  'Mold',
  'Fire & smoke damage',
  'Commercial property',
  'Not sure / other',
];

/** Vegas service page URL for a California service href (e.g. /plumbing/drain-cleaning/ -> /las-vegas/drain-cleaning/). */
export const vegasHref = (serviceHref: string) => `/las-vegas/${serviceHref.split('/').filter(Boolean).pop()}/`;
