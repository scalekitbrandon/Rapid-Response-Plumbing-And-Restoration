// Single source for business details and navigation.
// Facts come from rapidresponsefloodrestoration.com (pulled 2026-10-24); see CLIENT-NOTES.md.

export const business = {
  name: 'Rapid Response Plumbing & Restoration',
  phoneDisplay: '855-47-RAPID',
  phoneDigits: '855-477-2743',
  phoneHref: 'tel:+18554772743',
  reviewUrl: 'https://g.page/r/CZU8FEaOlw9ZEAI/review',
  tagline: 'We Respond Fast. We Restore Right.',
};

export const serviceAreas = [
  { name: 'Victorville', slug: 'victorville' },
  { name: 'Apple Valley', slug: 'apple-valley' },
  { name: 'Hesperia', slug: 'hesperia' },
  { name: 'Barstow', slug: 'barstow' },
  { name: 'Adelanto', slug: 'adelanto' },
  { name: 'Yermo', slug: 'yermo' },
  { name: 'Newberry Springs', slug: 'newberry-springs' },
  { name: 'Helendale', slug: 'helendale' },
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
  { label: '24/7 Emergency Service' },
  { label: 'Free Inspections', href: '/contact-us/' },
  { label: 'Leave a Review', href: business.reviewUrl },
];
