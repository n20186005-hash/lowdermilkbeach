import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import GuideSubpage from '@/components/GuideSubpage';
import {
  buildBreadcrumbLd,
  buildFaqPageLd,
  buildSubpageMetadata,
} from '@/lib/subpage-meta';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return buildSubpageMetadata({
    locale,
    path: '/hours',
    title: messages.hoursPage.metaTitle,
    description: messages.hoursPage.metaDescription,
  });
}

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'en' }];
}

export default async function HoursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const page = messages.hoursPage;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbLd(locale, '/hours', page.title)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqPageLd(page.faq)) }}
      />
      <GuideSubpage namespace="hoursPage" partner={{ ns: 'parkingPage', path: '/parking' }} />
    </>
  );
}
