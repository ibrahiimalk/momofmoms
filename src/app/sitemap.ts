import { MetadataRoute } from 'next';

const BASE = 'https://momofmoms.vercel.app';
const locales = ['ar', 'en'];

const routes = [
  '',
  '/pregnancy-calculator',
  '/book-appointment',
  '/awake-windows',
  '/shop',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${BASE}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
      });
    }
  }

  return entries;
}
