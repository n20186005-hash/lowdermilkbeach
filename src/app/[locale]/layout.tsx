import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const baseUrl = 'https://lowdermilkbeach.com';
  const heroImage = `${baseUrl}/gallery/lowdermilk-park-beachfront-hero.jpg`;

  const zhUrl = `${baseUrl}/`;
  const enUrl = `${baseUrl}/en`;
  const selfUrl = locale === 'zh' ? zhUrl : enUrl;

  return {
    title: messages.meta.title,
    description: messages.meta.description,
    alternates: {
      canonical: selfUrl,
      languages: {
        'zh': zhUrl,
        'en': enUrl,
        'x-default': zhUrl,
      },
    },
    openGraph: {
      title: messages.meta.ogTitle,
      description: messages.meta.ogDescription,
      url: selfUrl,
      siteName: "Lowdermilk Park",
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [
        {
          url: heroImage,
          alt: messages.meta.ogImageAlt,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const attractionLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "@id": "https://lowdermilkbeach.com/#attraction",
    "name": "Lowdermilk Park",
    "alternateName": [
      "Lowdermilk Beach",
      "Naples Lowdermilk Park"
    ],
    "description": locale === 'zh'
      ? "佛罗里达州那不勒斯市 Lowdermilk Park 的完整访客指南。"
      : "Comprehensive visitor guide to Lowdermilk Park in Naples, Florida, United States.",
    "url": "https://lowdermilkbeach.com",
    "image": [
      "https://lowdermilkbeach.com/gallery/lowdermilk-park-beachfront-hero.jpg"
    ],
    "isAccessibleForFree": true,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1301 Gulf Shore Blvd N",
      "addressLocality": "Naples",
      "addressRegion": "FL",
      "postalCode": "34102",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.162054,
      "longitude": -81.809978
    },
    "hasMap": "https://maps.app.goo.gl/7SscvaRAaJj3YuB19",
    "sameAs": [
      "https://maps.app.goo.gl/7SscvaRAaJj3YuB19",
      "https://www.naplesgov.com/parksrec/park/lowdermilk-park/"
    ]
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locale === 'zh' ? [
      {
        "@type": "Question",
        "name": "Lowdermilk Park 位于哪里？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lowdermilk Park 位于美国佛罗里达州那不勒斯市，地址为 1301 Gulf Shore Blvd N, Naples, FL 34102。"
        }
      },
      {
        "@type": "Question",
        "name": "Lowdermilk Beach 是否免费参观？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "是的，Lowdermilk Park 是公共空间，全年免费开放。"
        }
      },
      {
        "@type": "Question",
        "name": "Lowdermilk Park 的开放时间是什么？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lowdermilk Park 每日开放时间为上午 8:00 至晚上 11:00。"
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "Where is Lowdermilk Park located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lowdermilk Park is located in Naples, Florida, United States, at 1301 Gulf Shore Blvd N, Naples, FL 34102."
        }
      },
      {
        "@type": "Question",
        "name": "Is Lowdermilk Beach free to visit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Lowdermilk Park is a public space and is free to visit year-round."
        }
      },
      {
        "@type": "Question",
        "name": "What are the opening hours of Lowdermilk Park?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lowdermilk Park is open daily from 8:00 AM to 11:00 PM."
        }
      }
    ]
  };

  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'} suppressHydrationWarning>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossOrigin="anonymous" />
        <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXX" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
