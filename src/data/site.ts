// Single source for business details and navigation.
// Facts come from rapidresponsefloodrestoration.com (pulled 2026-10-24); see CLIENT-NOTES.md.

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

export const serviceAreas = [
  { name: 'Victorville', slug: 'victorville', blurb: 'Emergency water damage, flood cleanup, mold, sewage, fire damage and structural drying for homes and businesses.' },
  { name: 'Apple Valley', slug: 'apple-valley', blurb: 'Residential and commercial water losses, flood damage, drying, demolition and property recovery.' },
  { name: 'Hesperia', slug: 'hesperia', blurb: 'Plumbing failures, water intrusion, flooded properties, mold, sewage backups, smoke and fire losses.' },
  { name: 'Barstow', slug: 'barstow', blurb: 'Water extraction, structural drying, flood cleanup, material removal and commercial restoration.' },
  { name: 'Adelanto', slug: 'adelanto', blurb: 'Water damage, flooding, moisture problems, sewage losses, mold, smoke and fire damage.' },
  { name: 'Yermo', slug: 'yermo', blurb: 'Water damage, flooding, drying, contaminated water cleanup and fire damage response.' },
  { name: 'Newberry Springs', slug: 'newberry-springs', blurb: 'Water losses, flooded properties, drying, cleanup, demolition, mold and fire damage.' },
  { name: 'Helendale', slug: 'helendale', blurb: '24/7 water damage, flooding, drying, mold, sewage, fire and smoke cleanup.' },
];

export const restorationServices = [
  { label: 'Water Damage Restoration', href: '/water-damage-restoration/' },
  { label: 'Flood Damage Restoration', href: '/flood-damage-restoration/' },
  { label: 'Mold Remediation', href: '/mold-remediation/' },
  { label: 'Fire & Smoke Damage', href: '/fire-smoke-damage-restoration/' },
  { label: 'Commercial Restoration', href: '/commercial-property-restoration/' },
];

// TODO(client): placeholder plumbing list. The current site has no plumbing services.
// Replace with the client's real list before launch.
export const plumbingServices = [
  { label: 'Emergency Plumbing', href: '/plumbing/emergency-plumbing/' },
  { label: 'Leak Detection', href: '/plumbing/leak-detection/' },
  { label: 'Slab Leak Repair', href: '/plumbing/slab-leak-repair/' },
  { label: 'Water Heaters', href: '/plumbing/water-heaters/' },
  { label: 'Drain Cleaning', href: '/plumbing/drain-cleaning/' },
  { label: 'Repiping', href: '/plumbing/repiping/' },
];

export const primaryNav = [
  { label: 'Home', href: '/' },
  {
    label: 'Locations',
    href: '/locations/',
    children: [
      { label: 'All Service Areas', href: '/locations/' },
      ...serviceAreas.map((a) => ({ label: a.name, href: `/${a.slug}/` })),
    ],
  },
  { label: 'Plumbing', href: '/plumbing/', children: plumbingServices },
  { label: 'Restoration', href: '/restoration/', children: restorationServices },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Contact', href: '/contact-us/' },
];

export const utilityLinks = [
  { label: '24/7 Emergency Response – 1 Hour or Less' },
  { label: 'Free Inspections', href: '/contact-us/' },
];
