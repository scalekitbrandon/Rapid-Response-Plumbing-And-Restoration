// Shared fire/water brand background (the hero art), optimized once and reused by "pop" sections.
import { getImage } from 'astro:assets';
import heroBg from '../assets/hero-bg.png';

export async function fireWaterBg() {
  const desktop = await getImage({ src: heroBg, width: 1920, format: 'webp', quality: 72 });
  const mobile = await getImage({ src: heroBg, width: 900, format: 'webp', quality: 68 });
  return `--fw-bg: url(${desktop.src}); --fw-bg-mobile: url(${mobile.src});`;
}
