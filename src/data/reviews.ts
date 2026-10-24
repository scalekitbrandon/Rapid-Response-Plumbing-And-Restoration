// Real Google reviews only, copied word for word from the client's Google Business Profile.
// Never invent, edit or paraphrase reviews. Leave this empty until the client's reviews are pulled.
// While it is empty, the Reviews section shows a "Read our reviews on Google" panel.

export interface Review {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  when?: string; // e.g. "2 weeks ago", as shown on Google
  service?: string; // optional tag, e.g. "Water Damage"
}

export const reviewSummary: { rating: number | null; count: number | null } = {
  rating: 5.0, // Google profile rating as of 2026-10-24
  count: null, // TODO(client): total Google review count (not shown on the public listing)
};

// Pulled word for word from the review links the client provided (2026-10-24). All 5 stars.
// Relative dates ("2 weeks ago") are left off on purpose because they go stale on a static site.
export const reviews: Review[] = [
  { name: 'Liam Anderson', rating: 5, service: 'Burst Pipe', text: 'We had water damage in our home after a pipe burst unexpectedly. The crew responded quickly, removed the standing water, and started the drying process right away. They explained the work clearly and helped us understand what needed to happen next.' },
  { name: 'Jordan Ellis', rating: 5, service: 'Mold', text: 'We discovered moisture and mold growth in an area that had previously experienced water damage. The team inspected the affected space, contained the area, removed the affected material, and cleaned the area afterward. They took the issue seriously and explained the process along the way.' },
  { name: 'Margaret Lawson', rating: 5, service: 'Fire & Smoke', text: 'After a small fire, our property had soot and smoke residue that needed professional cleaning. The restoration crew worked through the affected areas, cleaned the residue, and helped with the recovery process. They were careful with the property while completing the cleanup.' },
  { name: 'Jack Richardson', rating: 5, service: 'Water Damage', text: 'A sudden water leak left several rooms in our house soaked. We called for emergency assistance and the crew came out quickly. They removed the standing water and set up dehumidification and drying equipment to help prevent additional moisture problems.' },
  { name: 'Md. Joynal Abedin', rating: 5, service: 'Flood', text: 'After heavy rain, water entered our property and affected the flooring and lower sections of the walls. The restoration team arrived promptly, extracted the water, and used drying equipment to address the moisture. Their quick response helped us get the situation under control.' },
  { name: 'Milon Chandra Ray', rating: 5, service: 'Flood', text: 'Our property was affected by storm-related flooding, and we needed help immediately. The team assessed the damage, removed water and debris, and worked carefully around belongings that could be salvaged. Having a response team available when we needed them made the cleanup much more manageable.' },
  { name: 'Edwin Mosley', rating: 5, service: 'Water Damage', text: 'Really appreciated the professionalism during our water damage cleanup. Everyone was courteous, explained the process in simple terms, and treated our property with care.' },
  { name: 'Sessions Rebecca', rating: 5, service: 'Water Damage', text: 'The team did a good job with the water damage cleanup at our home. They were polite, explained what needed attention, and kept us updated throughout the process.' },
];
