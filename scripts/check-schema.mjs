#!/usr/bin/env node
// Schema QA for a built Astro site: `npm run build && npm run check:schema`.
// Checks every indexable page in dist/ against the ScaleKit schema standard
// (see src/lib/schema.ts). FAIL exits 1 and blocks launch; WARN is a gap to
// fill or consciously skip (e.g. no geo until the GBP pin is confirmed).

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const fails = [];
const warns = [];
const fail = (page, msg) => fails.push(`${page}: ${msg}`);
const warn = (page, msg) => warns.push(`${page}: ${msg}`);

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? htmlFiles(p) : name.endsWith('.html') ? [p] : [];
  });
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', mdash: '—', ndash: '–', hellip: '…' };
function normalize(s) {
  return String(s)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
function visibleText(html) {
  return normalize(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  );
}
const typesOf = (n) => (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]).filter(Boolean);
const has = (n, t) => typesOf(n).includes(t);

function findEmpty(value, path, page) {
  if (Array.isArray(value)) {
    if (!value.length) fail(page, `empty array at ${path}`);
    value.forEach((v, i) => findEmpty(v, `${path}[${i}]`, page));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) findEmpty(v, `${path}.${k}`, page);
  } else if (value === '' || value === null) {
    fail(page, `empty value at ${path}`);
  } else if (typeof value === 'string' && /example\.com|\bclient name\b|lorem ipsum|\breplace[_ ]?me\b|\btodo\b|\btbd\b/i.test(value)) {
    fail(page, `placeholder text at ${path}: "${value}"`);
  }
}

const businessIds = new Set();
const businessTypes = new Set();
let checked = 0;

for (const file of htmlFiles(dist)) {
  const page = '/' + relative(dist, file).replace(/index\.html$/, '').replace(/\.html$/, '');
  const html = readFileSync(file, 'utf8');
  if (/http-equiv="refresh"/i.test(html)) continue;
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);

  if (noindex || page === '/404') {
    if (blocks.length) warn(page, 'noindex/404 page still ships JSON-LD');
    continue;
  }
  checked++;

  if (!blocks.length) {
    fail(page, 'no JSON-LD');
    continue;
  }
  if (blocks.length > 1) warn(page, `${blocks.length} JSON-LD blocks — expected one @graph`);

  const nodes = [];
  for (const b of blocks) {
    try {
      const data = JSON.parse(b);
      findEmpty(data, '$', page);
      nodes.push(...(data['@graph'] ?? [data]));
    } catch (e) {
      fail(page, `invalid JSON-LD: ${e.message}`);
    }
  }

  const byId = new Map(nodes.filter((n) => n['@id']).map((n) => [n['@id'], n]));
  const website = nodes.find((n) => has(n, 'WebSite'));
  const org = nodes.find((n) => has(n, 'Organization') && String(n['@id'] ?? '').endsWith('#organization'));
  const biz = nodes.find((n) => String(n['@id'] ?? '').endsWith('#business'));
  const webpage = nodes.find((n) => String(n['@id'] ?? '').endsWith('#webpage'));
  const text = visibleText(html);
  const isHome = page === '/';

  if (!website) fail(page, 'missing WebSite');
  if (!org) fail(page, 'missing Organization (#organization)');
  if (!webpage) fail(page, 'missing WebPage (#webpage)');
  if (!biz) {
    fail(page, 'missing LocalBusiness (#business)');
  } else {
    businessIds.add(biz['@id']);
    businessTypes.add(typesOf(biz).join('/'));
    if (has(biz, 'LocalBusiness')) warn(page, 'business type is generic LocalBusiness — use the most specific subtype');
    if (!biz.telephone && !biz.email) fail(page, 'business has no telephone or email');
    if (!biz.address && !biz.areaServed) fail(page, 'business has neither PostalAddress nor areaServed');
    if (isHome) {
      if (!biz.sameAs) warn(page, 'no sameAs profile links (GBP, Facebook, Yelp, BBB…)');
      if (!biz.geo) warn(page, 'no GeoCoordinates (use the GBP pin)');
      if (!biz.openingHoursSpecification) warn(page, 'no OpeningHoursSpecification');
      if (!biz.contactPoint) warn(page, 'no ContactPoint');
      if (!biz.hasOfferCatalog) warn(page, 'no OfferCatalog of services');
      if (!biz.logo) warn(page, 'no logo');
    }
    if (biz.aggregateRating && !text.includes(normalize(biz.aggregateRating.ratingValue))) {
      fail(page, `AggregateRating ${biz.aggregateRating.ratingValue} is not shown on the page`);
    }
    for (const r of biz.review ?? []) {
      const snippet = normalize(r.reviewBody ?? '').slice(0, 60);
      if (!snippet || !text.includes(snippet)) fail(page, `Review by ${r.author?.name} is not shown on the page`);
    }
  }

  if (!isHome) {
    const crumbs = nodes.find((n) => has(n, 'BreadcrumbList'));
    if (!crumbs) fail(page, 'missing BreadcrumbList');
    else {
      const last = crumbs.itemListElement?.at(-1)?.item;
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
      if (canonical && last && last !== canonical) warn(page, `last breadcrumb ${last} ≠ canonical ${canonical}`);
    }
  }

  for (const faq of nodes.filter((n) => has(n, 'FAQPage'))) {
    for (const q of faq.mainEntity ?? []) {
      if (!text.includes(normalize(q.name))) fail(page, `FAQ question not visible on page: "${q.name}"`);
      const ans = normalize(q.acceptedAnswer?.text ?? '').slice(0, 60);
      if (ans && !text.includes(ans)) fail(page, `FAQ answer not visible on page: "${q.name}"`);
    }
  }

  for (const svc of nodes.filter((n) => has(n, 'Service') && n.provider)) {
    if (!biz || svc.provider['@id'] !== biz['@id']) fail(page, `Service "${svc.name}" provider is not #business`);
  }

  // Every in-graph @id reference should resolve (external URLs excepted).
  const seen = new Set();
  (function refs(v) {
    if (Array.isArray(v)) return v.forEach(refs);
    if (v && typeof v === 'object') {
      const keys = Object.keys(v);
      if (keys.length === 1 && keys[0] === '@id') {
        if (!byId.has(v['@id']) && !seen.has(v['@id'])) {
          seen.add(v['@id']);
          if (!/#(service)$/.test(v['@id'])) warn(page, `reference ${v['@id']} not defined on this page`);
        }
        return;
      }
      Object.values(v).forEach(refs);
    }
  })(nodes);
}

if (businessIds.size > 1) fail('site', `more than one business @id: ${[...businessIds].join(', ')}`);
if (businessTypes.size > 1) fail('site', `business @type differs between pages: ${[...businessTypes].join(', ')}`);

const uniq = (a) => [...new Set(a)];
console.log(`Schema check: ${checked} indexable pages in ${dist}`);
for (const w of uniq(warns)) console.log(`  WARN  ${w}`);
for (const f of uniq(fails)) console.log(`  FAIL  ${f}`);
console.log(fails.length ? `\n${uniq(fails).length} failure(s) — fix before launch.` : '\nPASS');
process.exit(fails.length ? 1 : 0);
