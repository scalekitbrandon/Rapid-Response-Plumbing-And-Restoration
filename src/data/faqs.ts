import { areaList } from './site';

// FAQ lists shared by the FAQ component (what's shown) and the page schema
// (FAQPage JSON-LD via BaseLayout's `schema.faqs`), so the two always match.

export interface QA {
  q: string;
  a: string;
}

/** FAQ.astro item shape → schema.ts Faq shape. */
export const toSchemaFaqs = (items: QA[]) => items.map((i) => ({ question: i.q, answer: i.a }));

export const homeFaqs: QA[] = [
  { q: 'Do you provide 24/7 emergency service?', a: 'Yes. Rapid Response provides 24/7 emergency response for urgent water, flood, plumbing, mold, fire and smoke damage, when waiting would let the damage keep spreading.' },
  // TODO(client): confirm the 1-hour response time holds across the full service area.
  { q: 'How fast can you get to my property?', a: 'We respond in 1 hour or less across our entire service area, day or night. Call 855-47-RAPID and a crew gets moving right away.' },
  // TODO(client): confirm they repair the source plumbing issue, not only the resulting damage.
  { q: 'Can you fix the leak and the water damage it caused?', a: 'Yes. As a plumbing and restoration company, we can stop the leak at its source and handle the water extraction, drying and cleanup it caused, so you are not coordinating two different companies.' },
  { q: 'What areas do you serve?', a: `We serve ${areaList}. If you are near one of these cities, call and ask.` },
  { q: 'Do you work with my insurance company?', a: 'We work with all major insurance carriers. We document the damage with photos and moisture readings, keep you updated as mitigation progresses, and keep the restoration side of your claim organized.' },
  { q: 'Do I need to know exactly what service I need?', a: 'No. Tell us what happened and what you can see. You do not need to diagnose the property or pick a restoration category before calling.' },
  { q: 'Should I wait if the damage looks small?', a: 'Damage often extends farther than what you can see. Water travels behind walls and under flooring, and moisture can lead to mold. If you are unsure how serious it is, calling early helps you understand what needs attention.' },
  { q: 'Do you handle commercial properties?', a: 'Yes. We work with homes and commercial properties, including offices, retail spaces, warehouses, rentals and managed multi-unit buildings.' },
];
