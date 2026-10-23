import type { MetadataRoute } from 'next';
import { TOPIC_SLUGS } from '@/lib/topics';

const BASE_URL = 'https://lowdermilkbeach.com';
const LAST_MODIFIED = new Date('2026-10-23');

const coreRoutes = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/parking', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/hours', priority: 0.9, changeFrequency: 'weekly' as const },
];

const topicRoutes = TOPIC_SLUGS.map((slug) => ({
  path: `/${slug}`,
  priority: 0.7,
  changeFrequency: 'monthly' as const,
}));

const legalRoutes = [
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/cookie-settings', priority: 0.3, changeFrequency: 'yearly' as const },
];

const routes = [...coreRoutes, ...topicRoutes, ...legalRoutes];

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
