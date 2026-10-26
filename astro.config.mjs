import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// astro-deploy sets `site` to the real production domain and adds
// an adapter (@astrojs/vercel, @astrojs/netlify, @astrojs/cloudflare)
// when the hosting target is chosen. Defaults to static output.
export default defineConfig({
  // TODO(launch): switch to the final domain if the business moves to a new one for the rebrand.
  site: 'https://rapidresponsefloodrestoration.com',
  trailingSlash: 'always',
  // Inline page CSS to avoid render-blocking stylesheet requests (Lighthouse).
  build: { inlineStylesheets: 'always' },
  integrations: [sitemap({ filter: (page) => !page.includes('/thank-you/') }), mdx()],
  output: 'static',
});
