import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import GuideSubpage from '@/components/GuideSubpage';
import {
  buildBreadcrumbLd,
  buildFaqPageLd,
  buildSubpageMetadata,
  buildWebPageLd,
} from '@/lib/subpage-meta';
import { relatedTopics } from '@/lib/topics';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return buildSubpageMetadata({
    locale,
    path: '/parking',
    title: messages.parkingPage.metaTitle,
    description: messages.parkingPage.metaDescription,
  });
}

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'en' }];
}

export default async function ParkingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const page = messages.parkingPage;
  const prefix = locale === 'zh' ? '/zh' : '/en';
  const related = relatedTopics('parking').map((t) => ({
    path: `/${t.slug}`,
    label: messages[t.namespace]?.title || t.slug,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbLd(locale, '/parking', page.title)
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqPageLd(page.faq)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildWebPageLd(locale, '/parking', page.title, page.metaDescription)
          ),
        }}
      />
      <GuideSubpage
        namespace="parkingPage"
        partner={{ path: '/hours', label: page.ctaLabel }}
        related={related.map((r) => ({ ...r, label: r.label }))}
      />
    </>
  );
}
