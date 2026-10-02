import type { MetadataRoute } from 'next';

const BASE_URL = 'https://lowdermilkbeach.com';
const LAST_MODIFIED = new Date('2026-10-01');

const routes = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/parking', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/hours', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages: {
        zh: `${BASE_URL}/zh${route.path}`,
        en: `${BASE_URL}/en${route.path}`,
      },
    },
  }));
}
