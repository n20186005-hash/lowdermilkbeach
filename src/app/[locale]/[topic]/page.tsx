import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import GuideSubpage from '@/components/GuideSubpage';
import {
  buildBreadcrumbLd,
  buildFaqPageLd,
  buildSubpageMetadata,
  buildWebPageLd,
} from '@/lib/subpage-meta';
import {
  TOPICS,
  NAMESPACE_BY_SLUG,
  getTopic,
  relatedTopics,
} from '@/lib/topics';

export function generateStaticParams() {
  return TOPICS.flatMap((t) => [
    { locale: 'en', topic: t.slug },
    { locale: 'zh', topic: t.slug },
  ]);
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; topic: string }>;
}): Promise<Metadata> {
  const { locale, topic } = await params;
  const ns = NAMESPACE_BY_SLUG[topic];
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const page = messages[ns];

  return buildSubpageMetadata({
    locale,
    path: `/${topic}`,
    title: page.metaTitle,
    description: page.metaDescription,
  });
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ locale: string; topic: string }>;
}) {
  const { locale, topic } = await params;
  setRequestLocale(locale);
  const ns = NAMESPACE_BY_SLUG[topic];
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const page = messages[ns];
  const def = getTopic(topic)!;
  const prefix = locale === 'zh' ? '/zh' : '/en';

  const partner = def.partner
    ? {
        path: `/${def.partner}`,
        label:
          messages[NAMESPACE_BY_SLUG[def.partner]]?.ctaLabel ||
          messages[NAMESPACE_BY_SLUG[def.partner]]?.title ||
          '',
      }
    : undefined;

  const related = relatedTopics(topic).map((t) => ({
    path: `/${t.slug}`,
    label: messages[t.namespace]?.title || t.slug,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbLd(locale, `/${topic}`, page.title)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqPageLd(page.faq || [])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildWebPageLd(locale, `/${topic}`, page.title, page.metaDescription)
          ),
        }}
      />
      <GuideSubpage
        namespace={ns}
        partner={partner}
        related={related.map((r) => ({ ...r, label: r.label }))}
      />
    </>
  );
}
