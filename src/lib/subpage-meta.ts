import type { Metadata } from 'next';

export const BASE_URL = 'https://lowdermilkbeach.com';
export const HERO_IMAGE = `${BASE_URL}/gallery/lowdermilk-park-beachfront-hero.jpg`;

type SubpageMetaInput = {
  locale: string;
  path: string;
  title: string;
  description: string;
};

/**
 * Builds canonical / hreflang / robots metadata for the visitor-intent subpages.
 * x-default resolves to English because the overwhelming majority of queries
 * for this attraction are English.
 */
export function buildSubpageMetadata({
  locale,
  path,
  title,
  description,
}: SubpageMetaInput): Metadata {
  const zhUrl = `${BASE_URL}/zh${path}`;
  const enUrl = `${BASE_URL}/en${path}`;
  const selfUrl = locale === 'zh' ? zhUrl : enUrl;

  return {
    title,
    description,
    alternates: {
      canonical: selfUrl,
      languages: {
        zh: zhUrl,
        en: enUrl,
        'x-default': enUrl,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: selfUrl,
      siteName: 'Lowdermilk Park',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
      images: [{ url: HERO_IMAGE, width: 1200, height: 630 }],
    },
  };
}

export function buildBreadcrumbLd(locale: string, path: string, name: string) {
  const homeUrl = locale === 'zh' ? `${BASE_URL}/zh` : `${BASE_URL}/en`;
  const selfUrl = locale === 'zh' ? `${BASE_URL}/zh${path}` : `${BASE_URL}/en${path}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Lowdermilk Park Visitor Guide',
        item: homeUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name,
        item: selfUrl,
      },
    ],
  };
}

export function buildFaqPageLd(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * A WebPage JSON-LD node that points `about` back to the canonical attraction
 * entity, keeping every visitor-intent subpage part of the same entity graph.
 */
export function buildWebPageLd(locale: string, path: string, name: string, description: string) {
  const homeUrl = locale === 'zh' ? `${BASE_URL}/zh` : `${BASE_URL}/en`;
  const selfUrl = locale === 'zh' ? `${BASE_URL}/zh${path}` : `${BASE_URL}/en${path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: selfUrl,
    isPartOf: { '@type': 'WebSite', name: 'Lowdermilk Park Visitor Guide', url: homeUrl },
    about: { '@type': 'TouristAttraction', '@id': `${BASE_URL}/#attraction` },
  };
}
