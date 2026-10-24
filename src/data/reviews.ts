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
  rating: null, // TODO(client): average Google rating, e.g. 4.9
  count: null, // TODO(client): total Google review count
};

export const reviews: Review[] = [];
