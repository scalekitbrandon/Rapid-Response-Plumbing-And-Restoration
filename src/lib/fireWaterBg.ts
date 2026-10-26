// Shared fire/water brand background (the hero art), optimized once and reused by "pop" sections.
import { getImage } from 'astro:assets';
import heroBg from '../assets/hero-bg.png';

export async function fireWaterImages() {
  const desktop = await getImage({ src: heroBg, width: 1920, format: 'webp', quality: 72 });
  const mobile = await getImage({ src: heroBg, width: 900, format: 'webp', quality: 68 });
  return { desktop: desktop.src, mobile: mobile.src };
}

export async function fireWaterBg() {
  const { desktop, mobile } = await fireWaterImages();
  return `--fw-bg: url(${desktop}); --fw-bg-mobile: url(${mobile});`;
}
