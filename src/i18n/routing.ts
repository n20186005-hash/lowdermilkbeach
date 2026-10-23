import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { TOPICS } from '@/lib/topics';

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    // Visitor-intent subpages (one entry per registered topic).
    ...Object.fromEntries(
      TOPICS.map((t) => [`/${t.slug}` as const, `/${t.slug}` as const])
    ),
    '/privacy-policy': '/privacy-policy',
    '/terms-of-service': '/terms-of-service',
    '/cookie-settings': '/cookie-settings',
  },
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
