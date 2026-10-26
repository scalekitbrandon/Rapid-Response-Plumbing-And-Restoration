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

export const collections = { plumbing, restoration };
