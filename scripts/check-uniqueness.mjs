#!/usr/bin/env node
// Content uniqueness gate: `npm run build` runs it automatically (postbuild).
//
// ScaleKit standard: every town page and town-plus-service page must be at least 70% original.
// "Original" = share of the page's 5-word phrases (inside <main>, scripts/styles/JSON-LD stripped)
// that do NOT appear on the single most similar other page on the site. Header and footer are
// outside <main> and don't count. Phrases found on half the site or more (site-wide template:
// trust strip, form, insurance FAQ) are left out first; see BOILER. Everything else inside <main>
// counts, including reused service sections, because Google sees them as part of the page.
//
// Gated pages: every /<town>/ and /<town>/<service>/ page. Service pages are reported with --all.
//
// Ratchet: scripts/uniqueness-baseline.json lists town pages that were already under the bar when
// this gate went in (2026-11-18), with their score then. The build fails (exit 1) when
//   - a gated page NOT in the baseline is under the bar (every new or rewritten page must pass), or
//   - a baseline page scores lower than its recorded score (backlog pages can't get worse).
// When a baseline page reaches the bar, it's dropped from the file automatically.
// Never add a page to the baseline to get a build through. Rewrite the page.
//
// Usage: node scripts/check-uniqueness.mjs [dist] [--min 70] [--all] [--page /hesperia/]

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : dflt;
};
const dist = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--')) ?? 'dist';
const MIN = Number(opt('--min', 70));
const ONLY = opt('--page');
const N = 5;

// Town slugs come from the town collection, so new towns are gated automatically.
const townSlugs = new Set(
  readdirSync('src/content/towns')
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, '')),
);

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? htmlFiles(p) : name === 'index.html' ? [p] : [];
  });
}

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', mdash: ' ', ndash: ' ', hellip: ' ', middot: ' ', rsaquo: ' ' };
function words(html) {
  const m = html.match(/<main[\s\S]*?<\/main>/i);
  const body = (m ? m[0] : html)
    .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (x, n) => ENT[n.toLowerCase()] ?? ' ')
    .toLowerCase()
    .replace(/[’‘]/g, "'");
  return body.match(/[a-z0-9']+/g) ?? [];
}
function shingles(w) {
  const s = new Set();
  for (let i = 0; i + N <= w.length; i++) s.add(w.slice(i, i + N).join(' '));
  return s;
}

const pages = htmlFiles(dist)
  .map((file) => {
    const rel = relative(dist, file).split(sep).slice(0, -1);
    const path = '/' + (rel.length ? rel.join('/') + '/' : '');
    const html = readFileSync(file, 'utf8');
    if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) return null;
    const w = words(html);
    return { path, rel, sh: shingles(w), count: w.length };
  })
  .filter(Boolean)
  .filter((p) => p.path !== '/404/' && p.path !== '/thank-you/');

// Site-wide boilerplate (trust strip, review cards, form, insurance FAQ...) sits on most pages and is
// discounted by every duplicate-content tool, Google included. Phrases on >= BOILER of pages are dropped
// before comparing, so the score reflects the page's own copy.
const BOILER = Number(opt('--boiler', 0.5));
const df = new Map();
for (const p of pages) for (const g of p.sh) df.set(g, (df.get(g) ?? 0) + 1);
const cutoff = Math.ceil(pages.length * BOILER);
for (const p of pages) p.sh = new Set([...p.sh].filter((g) => df.get(g) < cutoff));

const isGated = (p) => townSlugs.has(p.rel[0]) && p.rel.length <= 2;

const results = pages
  .filter((p) => (ONLY ? p.path === ONLY : flag('--all') || isGated(p)))
  .map((p) => {
    let worst = { path: '-', shared: 0 };
    for (const q of pages) {
      if (q === p) continue;
      let shared = 0;
      for (const g of p.sh) if (q.sh.has(g)) shared++;
      if (shared > worst.shared) worst = { path: q.path, shared };
    }
    const original = p.sh.size ? Math.round((100 * (p.sh.size - worst.shared)) / p.sh.size) : 0;
    return { path: p.path, words: p.count, original, vs: worst.path, gated: isGated(p) };
  })
  .sort((a, b) => a.original - b.original);

const BASELINE_FILE = 'scripts/uniqueness-baseline.json';
const baseline = existsSync(BASELINE_FILE) ? JSON.parse(readFileSync(BASELINE_FILE, 'utf8')) : { pages: {} };
const fixedBacklog = [];
const status = (r) => {
  if (!r.gated || r.original >= MIN) {
    if (r.gated && r.path in baseline.pages) fixedBacklog.push(r.path);
    return '';
  }
  const was = baseline.pages[r.path];
  if (was === undefined) return '  FAIL (new/rewritten page under bar)';
  if (r.original < was) return `  FAIL (backlog got worse: was ${was})`;
  return `  backlog (was ${was})`;
};

const pad = (s, n) => String(s).padEnd(n);
console.log(`\nUniqueness check (5-word phrases in <main>, bar ${MIN}% original for town pages)\n`);
console.log(pad('page', 48) + pad('words', 7) + pad('orig%', 7) + 'most similar page');
const failing = [];
for (const r of results) {
  const mark = status(r);
  if (mark.startsWith('  FAIL')) failing.push(r);
  console.log(pad(r.path, 48) + pad(r.words, 7) + pad(r.original, 7) + r.vs + mark);
}

// Drop backlog pages that now pass, and pages that no longer exist. Only on a full run.
if (!ONLY) {
  const live = new Set(results.map((r) => r.path));
  const keep = Object.fromEntries(
    Object.entries(baseline.pages).filter(([p]) => live.has(p) && !fixedBacklog.includes(p)),
  );
  if (Object.keys(keep).length !== Object.keys(baseline.pages).length) {
    writeFileSync(BASELINE_FILE, JSON.stringify({ ...baseline, pages: keep }, null, 2) + '\n');
    console.log(`\nBaseline updated: ${Object.keys(baseline.pages).length - Object.keys(keep).length} page(s) left the backlog.`);
  }
}

const backlog = results.filter((r) => r.gated && r.original < MIN && !failing.includes(r)).length;
if (failing.length) {
  console.error(`\n✗ ${failing.length} town page(s) fail the ${MIN}% originality standard. Rewrite them with real local detail before deploying.`);
  process.exit(1);
}
console.log(`\n✓ No town page fell below the standard. ${backlog} backlog page(s) still under ${MIN}% (see ${BASELINE_FILE}).`);
