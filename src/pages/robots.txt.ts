import type { APIRoute } from 'astro';

// Dynamic so the Sitemap line always matches whatever domain is set as
// `site` in astro.config.mjs — never hand-edit a static robots.txt per
// project, since it's easy to forget and ship it still pointing at
// example.com or a staging domain.
export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site).toString();
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
