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
      <GuideSubpage namespace="parkingPage" partner={{ ns: 'hoursPage', path: '/hours' }} />
    </>
  );
}
