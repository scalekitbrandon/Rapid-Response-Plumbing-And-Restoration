import { defineCollection, z } from 'astro:content';

// Service pages. Each entry is one keyword-targeted page rendered by src/layouts/ServicePageLayout.astro.
// Frontmatter holds the structured sections. The Markdown body is the long-form "about this service" copy.
// `plumbing` renders at /plumbing/<slug>/. `restoration` renders at /<slug>/.

const faq = z.object({ q: z.string(), a: z.string() });

const serviceSchema = ({ image }: { image: () => z.ZodTypeAny }) =>
  z.object({
    // SEO
    keyword: z.string(), // primary target keyword, e.g. "emergency plumber Victorville"
    title: z.string().max(65), // <title>, keyword first, brand last
    description: z.string().min(120).max(165), // meta description with CTA + phone
    navLabel: z.string(), // short label for menus, breadcrumbs and related cards
    order: z.number().default(99),

    // Hero
    eyebrow: z.string(),
    h1: z.string(),
    h1Accent: z.string(), // part of the H1 shown in the accent color (must appear inside h1)
    heroSub: z.string(),
    heroBullets: z.array(z.string()).length(3),

    // "Problems we fix" grid
    issuesHeading: z.string(),
    issuesIntro: z.string(),
    issues: z.array(z.object({ title: z.string(), text: z.string(), icon: z.enum(['pipe', 'drop', 'heater', 'slab', 'drain', 'toilet', 'freeze', 'valve', 'fire', 'mold', 'building', 'fan', 'home', 'flood']) })).min(4),

    // "Do this right now" emergency callout (optional)
    urgent: z
      .object({ heading: z.string(), intro: z.string(), steps: z.array(z.string()).min(3) })
      .optional(),

    // Split section: plumbing + restoration under one roof
    split: z.object({
      heading: z.string(),
      accent: z.string(),
      text: z.string(),
      points: z.array(z.string()).min(3),
      image: image(),
      imageAlt: z.string(),
      link: z.object({ label: z.string(), href: z.string() }).optional(), // cross-link under the checklist
    }),

    // Process steps
    processHeading: z.string(),
    processAccent: z.string(),
    process: z.array(z.object({ title: z.string(), text: z.string() })).length(4),

    // Long-form body heading (body comes from the Markdown)
    bodyHeading: z.string(),

    // Proof + links
    reviewTags: z.array(z.string()).default([]),
    areasHeading: z.string(),
    related: z.array(z.string()).default([]), // hrefs of related service pages

    // FAQ
    faqs: z.array(faq).min(5),

    // Bottom form
    formHeading: z.string(),
    formAccent: z.string(),
    formDamageType: z.string().optional(), // preselects "What happened?"
  });

const plumbing = defineCollection({ type: 'content', schema: serviceSchema });
// Restoration pages render at the site root (/water-damage-restoration/ etc.) to keep the old site's URLs.
const restoration = defineCollection({ type: 'content', schema: serviceSchema });

// Town pages render at /<slug>/ (slug must match serviceAreas in src/data/site.ts).
// Unique local copy lives in the Markdown body. Frontmatter holds the structured, town-specific sections.
const towns = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    state: z.enum(['CA', 'NV']).default('CA'),
    title: z.string().max(65),
    description: z.string().min(120).max(165),
    heroSub: z.string(),
    zips: z.array(z.string()).min(1),
    mapQuery: z.string(), // Google Maps embed query, e.g. "Victorville, CA"
    bodyHeading: z.string(),
    issuesHeading: z.string(),
    issuesIntro: z.string(),
    issues: z.array(z.object({ title: z.string(), text: z.string(), icon: z.enum(['pipe', 'drop', 'heater', 'slab', 'drain', 'toilet', 'freeze', 'valve', 'fire', 'mold', 'building', 'fan', 'home', 'flood']) })).length(4),
    faqs: z.array(faq).min(2), // town-specific FAQs, merged with shared ones in the layout
    nearby: z.array(z.string()).default([]), // slugs of nearby towns (pages)
    communities: z.array(z.string()).default([]), // nearby communities without their own page (shown as text)
  }),
});

// Local service pages ("service in town"): src/content/local/<town-slug>/<service-slug>.md renders at
// /<town-slug>/<service-slug>/. Each entry adds town-specific hero, problems, FAQs and body copy. The layout
// reuses the base service's generic sections only when they contain nothing specific to another place.
const local = defineCollection({
  type: 'content',
  schema: z.object({
    service: z.string(), // base California service href, e.g. /plumbing/drain-cleaning/
    keyword: z.string(),
    title: z.string().max(65),
    description: z.string().min(120).max(165),
    h1: z.string(),
    h1Accent: z.string(),
    heroSub: z.string(),
    issuesHeading: z.string(),
    issuesIntro: z.string(),
    issues: z.array(z.object({ title: z.string(), text: z.string(), icon: z.enum(['pipe', 'drop', 'heater', 'slab', 'drain', 'toilet', 'freeze', 'valve', 'fire', 'mold', 'building', 'fan', 'home', 'flood']) })).length(4),
    faqs: z.array(faq).min(3),
  }),
});

export const collections = { plumbing, restoration, towns, local };
