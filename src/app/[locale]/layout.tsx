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

  const zhUrl = `${baseUrl}/zh`;
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
        // Most queries for this attraction are English, so x-default resolves to /en
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
      ? "佛罗里达州那不勒斯市 Lowdermilk Park（劳德米尔克公园 / Lowdermilk Beach 劳德米尔克海滩）的完整访客指南，含历史沿革、生态科普、无障碍设施、访客服务、季度策略与 LNT 原则。"
      : "Comprehensive visitor guide to Lowdermilk Park in Naples, Florida, United States. Includes history, ecology, accessibility, amenities, seasonal strategies, and LNT principles.",
    "url": "https://lowdermilkbeach.com",
    "image": [
      "https://lowdermilkbeach.com/gallery/lowdermilk-park-beachfront-hero.jpg"
    ],
    "isAccessibleForFree": true,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "6304",
      "bestRating": "5"
    },
    "accessibilityFeature": [
      "parking: van-accessible",
      "restroom: wheelchairAccessible",
      "elevator: none; boardwalk ramp access",
      "beachAccess: ADA rubberized transition panel",
      "playground: ASTM F1487 accessible apparatus",
      "drinkingFountain: ADA height with pet bowl tier",
      "sensory: no dedicated quiet room; wide asphalt paths",
      "serviceAnimal: permitted per ADA Title II"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": locale === 'zh' ? "Lowdermilk Park 可选付费项目" : "Lowdermilk Park Optional Paid Offerings",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": locale === 'zh' ? "非居民按时段停车场" : "Non-resident hourly metered parking"
          },
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": locale === 'zh' ? "大型团体野餐亭预约许可" : "Large group picnic shelter reservation permit"
          },
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": locale === 'zh' ? "园内 Level-2 电动汽车充电" : "On-site Level-2 electric vehicle charging"
          },
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      ]
    },
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

  const faqItems = (messages as any)?.faq?.items || [];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item: any) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
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
