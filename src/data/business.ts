import { business as site, serviceAreas, plumbingServices, restorationServices } from './site';
import { reviews } from './reviews';

// Single source of truth for the business. Every page's JSON-LD, plus the
// footer NAP, should read from here so name/phone/address/hours can never
// disagree between pages.
//
// Rules (ScaleKit schema standard):
// - Never fabricate. A field that isn't confirmed by the client stays
//   undefined — the schema builder drops empty fields automatically.
// - `address` only for a real public storefront/office. Service-area
//   businesses with no public address leave it out and rely on `areaServed`.
// - `geo` comes from the Google Business Profile pin, never a guess.
// - `reviews` / `aggregateRating` only from real reviews that are SHOWN on
//   the page that sets `showReviews: true` (check-schema enforces this).
// - `type` is the most specific schema.org LocalBusiness subtype
//   (MovingCompany, Plumber, Psychologist, HomeAndConstructionBusiness,
//   ProfessionalService, ...) and is the same on every page.

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export const EVERY_DAY: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export interface Place {
  /** Defaults to City. */
  type?: 'City' | 'State' | 'AdministrativeArea' | 'Country';
  name: string;
  /** State the city sits in, e.g. "NJ" or "New Jersey". */
  containedIn?: string;
}

export interface Hours {
  days: DayOfWeek[];
  /** 24h "HH:MM". 24/7 = opens "00:00", closes "23:59". */
  opens: string;
  closes: string;
}

export interface ContactPointInfo {
  telephone?: string;
  email?: string;
  /** e.g. "customer service", "sales", "emergency". */
  contactType: string;
  availableLanguage?: string[];
  areaServed?: string[];
}

export interface ServiceInfo {
  name: string;
  /** Path of the service's own page, e.g. "/water-damage-restoration/". */
  path: string;
  description?: string;
  serviceType?: string;
  /** Only if the client publishes a price. */
  price?: string;
  priceCurrency?: string;
}

export interface PersonInfo {
  /** Used for the @id: /#person-<slug>. */
  slug: string;
  name: string;
  jobTitle?: string;
  honorificSuffix?: string;
  description?: string;
  image?: string;
  /** Path of the person's bio page, if any. */
  path?: string;
  sameAs?: string[];
  alumniOf?: string[];
  knowsAbout?: string[];
  founder?: boolean;
}

export interface ReviewInfo {
  author: string;
  rating: number;
  body: string;
  /** YYYY-MM-DD */
  datePublished?: string;
  /** e.g. "Google". */
  source?: string;
}

export interface Business {
  type: string;
  name: string;
  legalName?: string;
  alternateName?: string[];
  description?: string;
  telephone?: string;
  email?: string;
  /** Absolute or root-relative path. */
  logo?: string;
  image?: string[];
  priceRange?: string;
  foundingDate?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: { latitude: number; longitude: number };
  /** Google Maps link for the GBP listing. */
  hasMap?: string;
  hours?: Hours[];
  areaServed?: Place[];
  /** GBP, Facebook, Yelp, BBB, Instagram, LinkedIn, industry directories. */
  sameAs?: string[];
  contactPoints?: ContactPointInfo[];
  /** License numbers, DOT/MC numbers, etc. */
  identifiers?: { name: string; value: string }[];
  knowsAbout?: string[];
  parentOrganization?: { name: string; url?: string };
  services?: ServiceInfo[];
  people?: PersonInfo[];
  reviews?: ReviewInfo[];
  /** Overall rating as displayed on the site (e.g. GBP totals). */
  aggregateRating?: { ratingValue: number; reviewCount: number; source?: string };
}

export const business: Business = {
  // Plumbing + restoration under one type on every page. Plumber is a
  // HomeAndConstructionBusiness subtype; restoration is covered by the services list.
  type: 'Plumber',
  name: site.name,
  description:
    '24/7 emergency plumbing, water damage, flood, sewage, mold and fire restoration for homes and businesses across the High Desert, the Inland Empire and Las Vegas.',
  telephone: '+1-855-477-2743',
  logo: '/icon-192.png',
  image: ['/og-image.jpg'],
  // Service-area business: no public street address or map pin on the Google profile, so
  // no PostalAddress or GeoCoordinates. Add them only if the client publishes an address.
  hours: [{ days: EVERY_DAY, opens: '00:00', closes: '23:59' }],
  areaServed: serviceAreas.map((a) => ({ name: a.name, containedIn: a.state })),
  // TODO(client): add confirmed Facebook, Yelp, BBB, Instagram and other profile URLs.
  sameAs: [site.googleReviewsUrl],
  contactPoints: [{ telephone: '+1-855-477-2743', contactType: 'customer service', availableLanguage: ['English'] }],
  services: [...plumbingServices, ...restorationServices].map((s) => ({
    name: s.label,
    path: s.href,
    description: s.blurb,
  })),
  people: [],
  // Real Google reviews, word for word (src/data/reviews.ts). Marked up only on pages that render them.
  reviews: reviews.map((r) => ({ author: r.name, rating: r.rating, body: r.text, source: 'Google' })),
  // No AggregateRating until the client confirms the total Google review count.
  aggregateRating: undefined,
};
