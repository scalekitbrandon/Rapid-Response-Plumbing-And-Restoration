// Shared fire/water brand background (the hero art), optimized once and reused by the heroes and "pop" sections.
// Every user of this art pulls the same files, so the browser downloads it once per page.
import { getImage } from 'astro:assets';
import heroBg from '../assets/hero-bg.png';

// Source art is 1536px wide, so never ask for more (sharp would upscale).
const widths = [640, 900, 1200, 1536];

export async function fireWaterImages() {
  const avif = await Promise.all(widths.map((width) => getImage({ src: heroBg, width, format: 'avif', quality: 40 })));
  const webp = await Promise.all(widths.map((width) => getImage({ src: heroBg, width, format: 'webp', quality: 64 })));
  const srcset = (set: typeof avif) => set.map((img, i) => `${img.src} ${widths[i]}w`).join(', ');
  return {
    avifSrcset: srcset(avif),
    webpSrcset: srcset(webp),
    fallback: webp[1].src,
    width: heroBg.width,
    height: heroBg.height,
    // CSS backgrounds: full-size art on desktop, the 900px file on phones (the same one the hero picks there).
    css: { avif: avif[3].src, avifMobile: avif[1].src, webp: webp[3].src, webpMobile: webp[1].src },
  };
}

// Inline vars for a section's style attribute. BaseLayout maps them to --fw-bg / --fw-bg-mobile, picking AVIF where supported.
export async function fireWaterBg() {
  const { css } = await fireWaterImages();
  return `--fw-webp: url(${css.webp}); --fw-webp-m: url(${css.webpMobile}); --fw-avif: url(${css.avif}); --fw-avif-m: url(${css.avifMobile});`;
}
