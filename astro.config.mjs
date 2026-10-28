import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { NEVADA_LIVE } from './src/data/site.ts';

// Nevada pages stay out of the sitemap until NEVADA_LIVE (see src/data/site.ts).
const nevadaPath = /\/(las-vegas|henderson)\//;

// While Nevada is hidden, drop "and Las Vegas, Nevada" from the town list in Markdown copy.
function hideNevadaCopy() {
  const walk = (node) => {
    if (node.type === 'text') node.value = node.value.replace('Fontana, Rancho Cucamonga and Las Vegas, Nevada', 'Fontana and Rancho Cucamonga');
    node.children?.forEach(walk);
  };
  return (tree) => walk(tree);
}

// astro-deploy sets `site` to the real production domain and adds
// an adapter (@astrojs/vercel, @astrojs/netlify, @astrojs/cloudflare)
// when the hosting target is chosen. Defaults to static output.
export default defineConfig({
  // New domain (2026-10-27). The old domain rapidresponsefloodrestoration.com 301s here page-for-page (see DEPLOY.md).
  site: 'https://rapidresponseplumbingandrestoration.com',
  trailingSlash: 'always',
  // Inline page CSS to avoid render-blocking stylesheet requests (Lighthouse).
  build: { inlineStylesheets: 'always' },
  integrations: [
    sitemap({ filter: (page) => !page.includes('/thank-you/') && (NEVADA_LIVE || !nevadaPath.test(page)) }),
    mdx(),
  ],
  markdown: { remarkPlugins: NEVADA_LIVE ? [] : [hideNevadaCopy] },
  output: 'static',
});
