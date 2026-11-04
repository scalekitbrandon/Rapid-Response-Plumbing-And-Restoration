// Builds one connected JSON-LD @graph per page from src/data/business.ts.
//
// Every page gets: WebSite (/#website), Organization (/#organization),
// the LocalBusiness subtype (/#business, with PostalAddress, GeoCoordinates,
// OpeningHoursSpecification, ContactPoint and OfferCatalog/Offer nested),
// and a WebPage node typed for the page. Then, by page kind:
//   service  → Service (provider = /#business)
//   town     → Service with areaServed = that City in its State
//   about    → Person nodes for the team
//   hub      → ItemList of child pages (CollectionPage)
//   blogPost → BlogPosting (+ Person author)
// plus BreadcrumbList on every non-home page, FAQPage wherever `faqs` is
// passed, and Review/AggregateRating only where `showReviews` is true.
// Run `npm run check:schema` after a build to verify the output.

import { business as defaultBusiness, type Business, type Place, type PersonInfo } from '../data/business';

export interface Crumb {
  label: string;
  path: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface ServiceInput {
  name: string;
  description?: string;
  serviceType?: string;
  price?: string;
  priceCurrency?: string;
  /** Defaults to business.areaServed. */
  areaServed?: Place[];
}

interface PageBase {
  /** Visible breadcrumb trail, Home first. Required on every non-home page. */
  breadcrumbs?: Crumb[];
  /** Only questions that are visible on the page, word for word. */
  faqs?: Faq[];
  /** True only on pages that render business.reviews / aggregateRating. */
  showReviews?: boolean;
  /** Primary image for the page. */
  image?: string;
}

export type PageSchema =
  | (PageBase & { kind: 'home' })
  | (PageBase & { kind: 'service'; service: ServiceInput })
  | (PageBase & { kind: 'town'; city: string; state: string; service: ServiceInput })
  | (PageBase & { kind: 'about'; /** Person slugs to include; default all. */ people?: string[] })
  | (PageBase & { kind: 'contact' })
  | (PageBase & { kind: 'hub'; items: { name: string; path: string }[] })
  | (PageBase & {
      kind: 'blogPost';
      post: {
        headline: string;
        description?: string;
        datePublished: string;
        dateModified?: string;
        image?: string;
        /** Person slug from business.people, or a plain name. */
        author?: string;
      };
    })
  | (PageBase & { kind: 'page' });

export interface GraphInput {
  site: URL;
  path: string;
  title: string;
  description?: string;
  page: PageSchema;
  business?: Business;
}

type Node = Record<string, unknown>;

const PAGE_TYPE: Record<PageSchema['kind'], string> = {
  home: 'WebPage',
  service: 'WebPage',
  town: 'WebPage',
  about: 'AboutPage',
  contact: 'ContactPage',
  hub: 'CollectionPage',
  blogPost: 'WebPage',
  page: 'WebPage',
};

/** Drops undefined, null, '' and empty arrays/objects so nothing ships empty. */
function clean<T>(value: T): T | undefined {
  if (Array.isArray(value)) {
    const arr = value.map(clean).filter((v) => v !== undefined);
    return (arr.length ? arr : undefined) as T | undefined;
  }
  if (value && typeof value === 'object') {
    const out: Node = {};
    for (const [k, v] of Object.entries(value as Node)) {
      const c = clean(v);
      if (c !== undefined) out[k] = c;
    }
    // Keep references ({ "@id": ... }) and anything with real properties;
    // drop shells that are only a "@type" left after their fields emptied.
    const keep = '@id' in out || Object.keys(out).some((k) => !k.startsWith('@'));
    return (keep ? out : undefined) as T | undefined;
  }
  if (value === undefined || value === null || value === '') return undefined;
  return value;
}

export function buildGraph({ site, path, title, description, page, business = defaultBusiness }: GraphInput) {
  const root = new URL('/', site).href;
  const abs = (p?: string) => (p ? new URL(p, site).href : undefined);
  const url = abs(path)!;
  const ref = (id: string) => ({ '@id': id });

  const ids = {
    website: `${root}#website`,
    org: `${root}#organization`,
    business: `${root}#business`,
    webpage: `${url}#webpage`,
    breadcrumb: `${url}#breadcrumb`,
    faq: `${url}#faq`,
    service: `${url}#service`,
    list: `${url}#itemlist`,
    post: `${url}#article`,
    person: (slug: string) => `${root}#person-${slug}`,
  };

  const place = (p: Place) => ({
    '@type': p.type ?? 'City',
    name: p.name,
    containedInPlace: p.containedIn ? { '@type': 'State', name: p.containedIn } : undefined,
  });

  const contactPoints = (business.contactPoints ?? []).map((c) => ({
    '@type': 'ContactPoint',
    telephone: c.telephone,
    email: c.email,
    contactType: c.contactType,
    availableLanguage: c.availableLanguage,
    areaServed: c.areaServed,
  }));

  const founders = (business.people ?? [])
    .filter((p) => p.founder)
    .map((p) => ({ '@type': 'Person', '@id': ids.person(p.slug), name: p.name }));

  const organization: Node = {
    '@type': 'Organization',
    '@id': ids.org,
    name: business.name,
    legalName: business.legalName,
    alternateName: business.alternateName,
    url: root,
    logo: business.logo ? { '@type': 'ImageObject', url: abs(business.logo) } : undefined,
    sameAs: business.sameAs,
    contactPoint: contactPoints,
    founder: founders,
    foundingDate: business.foundingDate,
    parentOrganization: business.parentOrganization
      ? { '@type': 'Organization', name: business.parentOrganization.name, url: business.parentOrganization.url }
      : undefined,
  };

  const offers = (business.services ?? []).map((s) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', '@id': `${abs(s.path)}#service`, name: s.name, url: abs(s.path) },
    price: s.price,
    priceCurrency: s.price ? (s.priceCurrency ?? 'USD') : undefined,
  }));

  const reviewsShown = page.showReviews === true;

  const localBusiness: Node = {
    '@type': business.type,
    '@id': ids.business,
    name: business.name,
    description: business.description,
    url: root,
    telephone: business.telephone,
    email: business.email,
    logo: abs(business.logo),
    image: (business.image ?? []).map(abs),
    priceRange: business.priceRange,
    address: business.address
      ? { '@type': 'PostalAddress', addressCountry: 'US', ...business.address }
      : undefined,
    geo: business.geo ? { '@type': 'GeoCoordinates', ...business.geo } : undefined,
    hasMap: business.hasMap,
    openingHoursSpecification: (business.hours ?? []).map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: (business.areaServed ?? []).map(place),
    sameAs: business.sameAs,
    contactPoint: contactPoints,
    identifier: (business.identifiers ?? []).map((i) => ({ '@type': 'PropertyValue', propertyID: i.name, value: i.value })),
    knowsAbout: business.knowsAbout,
    parentOrganization: ref(ids.org),
    hasOfferCatalog: offers.length
      ? { '@type': 'OfferCatalog', name: `${business.name} services`, itemListElement: offers }
      : undefined,
    aggregateRating:
      reviewsShown && business.aggregateRating
        ? {
            '@type': 'AggregateRating',
            ratingValue: business.aggregateRating.ratingValue,
            reviewCount: business.aggregateRating.reviewCount,
            bestRating: 5,
          }
        : undefined,
    review: reviewsShown
      ? (business.reviews ?? []).map((r) => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: r.author },
          reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
          reviewBody: r.body,
          datePublished: r.datePublished,
          publisher: r.source ? { '@type': 'Organization', name: r.source } : undefined,
        }))
      : undefined,
  };

  const website: Node = {
    '@type': 'WebSite',
    '@id': ids.website,
    url: root,
    name: business.name,
    publisher: ref(ids.org),
    inLanguage: 'en-US',
  };

  const isHome = page.kind === 'home';
  const crumbs = page.breadcrumbs ?? [];
  const graph: Node[] = [website, organization, localBusiness];

  const personNode = (p: PersonInfo): Node => ({
    '@type': 'Person',
    '@id': ids.person(p.slug),
    name: p.name,
    jobTitle: p.jobTitle,
    honorificSuffix: p.honorificSuffix,
    description: p.description,
    image: abs(p.image),
    url: abs(p.path),
    sameAs: p.sameAs,
    alumniOf: (p.alumniOf ?? []).map((name) => ({ '@type': 'EducationalOrganization', name })),
    knowsAbout: p.knowsAbout,
    worksFor: ref(ids.business),
  });

  let mainEntity: string | undefined;

  const serviceNode = (s: ServiceInput, areaServed: unknown[]): Node => ({
    '@type': 'Service',
    '@id': ids.service,
    name: s.name,
    description: s.description ?? description,
    serviceType: s.serviceType ?? s.name,
    url,
    provider: ref(ids.business),
    areaServed,
    offers: s.price
      ? { '@type': 'Offer', price: s.price, priceCurrency: s.priceCurrency ?? 'USD' }
      : undefined,
  });

  switch (page.kind) {
    case 'service':
      graph.push(serviceNode(page.service, (page.service.areaServed ?? business.areaServed ?? []).map(place)));
      mainEntity = ids.service;
      break;
    case 'town':
      graph.push(serviceNode(page.service, [place({ type: 'City', name: page.city, containedIn: page.state })]));
      mainEntity = ids.service;
      break;
    case 'about': {
      const people = (business.people ?? []).filter((p) => !page.people || page.people.includes(p.slug));
      graph.push(...people.map(personNode));
      mainEntity = ids.business;
      break;
    }
    case 'hub':
      graph.push({
        '@type': 'ItemList',
        '@id': ids.list,
        name: title,
        itemListElement: page.items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          url: abs(item.path),
        })),
      });
      mainEntity = ids.list;
      break;
    case 'blogPost': {
      const person = (business.people ?? []).find((p) => p.slug === page.post.author);
      if (person) graph.push(personNode(person));
      graph.push({
        '@type': 'BlogPosting',
        '@id': ids.post,
        headline: page.post.headline,
        description: page.post.description ?? description,
        datePublished: page.post.datePublished,
        dateModified: page.post.dateModified ?? page.post.datePublished,
        image: abs(page.post.image ?? page.image),
        author: person
          ? ref(ids.person(person.slug))
          : page.post.author
            ? { '@type': 'Person', name: page.post.author }
            : ref(ids.org),
        publisher: ref(ids.org),
        mainEntityOfPage: ref(ids.webpage),
        isPartOf: ref(ids.website),
      });
      mainEntity = ids.post;
      break;
    }
    case 'home':
    case 'contact':
      mainEntity = ids.business;
      break;
  }

  if (!isHome && crumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': ids.breadcrumb,
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.label,
        item: abs(c.path),
      })),
    });
  }

  if (page.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': ids.faq,
      url,
      isPartOf: ref(ids.website),
      mainEntity: page.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  graph.push({
    '@type': PAGE_TYPE[page.kind],
    '@id': ids.webpage,
    url,
    name: title,
    description,
    isPartOf: ref(ids.website),
    about: ref(ids.business),
    mainEntity: mainEntity ? ref(mainEntity) : undefined,
    breadcrumb: !isHome && crumbs.length ? ref(ids.breadcrumb) : undefined,
    primaryImageOfPage: page.image ? { '@type': 'ImageObject', url: abs(page.image) } : undefined,
    inLanguage: 'en-US',
  });

  return {
    '@context': 'https://schema.org',
    '@graph': graph.map((n) => clean(n)).filter(Boolean),
  };
}
