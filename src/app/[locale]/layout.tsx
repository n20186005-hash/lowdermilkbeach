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
      ? "佛罗里达州那不勒斯市 Lowdermilk Park（劳德米尔克公园 / Lowdermilk Beach 劳德米尔克海滩）的完整访客指南，含历史沿革、生态科普、无障碍设施、访客服务、季度策略与 LNT 原则。"
      : "Comprehensive visitor guide to Lowdermilk Park in Naples, Florida, United States. Includes history, ecology, accessibility, amenities, seasonal strategies, and LNT principles.",
    "url": "https://lowdermilkbeach.com",
    "image": [
      "https://lowdermilkbeach.com/gallery/lowdermilk-park-beachfront-hero.jpg"
    ],
    "isAccessibleForFree": true,
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

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": locale === 'zh' ? [
      {
        "@type": "Question",
        "name": "Lowdermilk Park 位于哪里？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lowdermilk Park（劳德米尔克公园）位于美国（United States）佛罗里达州（Florida）那不勒斯市（Naples），完整地址：1301 Gulf Shore Blvd N, Naples, FL 34102。地理层级：Lowdermilk Park（劳德米尔克公园）→ Naples（那不勒斯）→ Florida（佛罗里达州）→ United States（美国）。"
        }
      },
      {
        "@type": "Question",
        "name": "Lowdermilk Beach 是否免费？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "是，Lowdermilk Park 是全年免费公共空间。公园、海滩、草坪、游乐场、野餐区、栈道全部免费；收费部分为非居民按小时停车与团体凉亭的预约许可证（若预约）。"
        }
      },
      {
        "@type": "Question",
        "name": "Lowdermilk Park 的开放时间是什么？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lowdermilk Park 每日开放 08:00–23:00。命名热带风暴 / 飓风登陆时，城市应急中心（EOC）会临时关闭；请以那不勒斯公园与娱乐部官网为准。FWC 赤潮临时关闭以水质监测为依据。"
        }
      },
      {
        "@type": "Question",
        "name": "可以带狗去 Lowdermilk Beach 沙滩吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "那不勒斯市法典 Sec. 10.04.030：5 月 1 日至 10 月 31 日全面禁止犬只进入实际沙质岸线；全年牵绳（6 英尺）可在铺装草坪、人行道、野餐区、停车场、栈道通行；必须清理宠物粪便。不牵绳首次罚款 250 美元。替代方案：北那不勒斯 Clam Pass Park 沙滩在科利尔县条例下允许牵绳犬只。"
        }
      },
      {
        "@type": "Question",
        "name": "可以在园内饮酒吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "科利尔县公共海滩饮酒条例历次微调。当前执行：低度啤酒 / 葡萄酒可在非玻璃容器内于草坪区饮用；烈酒与玻璃容器禁止；公共场所醉酒依那不勒斯法典 Sec. 10.08 处理。请访问市法典 Ch.10 获取最新条款。科利尔县酒类管理（ABC）办公室官网更新法规。"
        }
      },
      {
        "@type": "Question",
        "name": "是否有值班救生员？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lowdermilk Park 目前未配永久岗亭式救生员塔；高峰时段由签约救生辅助巡逻队移动巡护；救生圈配备齐全。紧急情况拨 911；科利尔县 EMS 海难救援机动组响应。始终注意旗帜：双红旗 = 严禁下水。"
        }
      },
      {
        "@type": "Question",
        "name": "可以搭帐篷、沙滩遮阳棚或小屋吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "7 英尺以下遮阳伞与 100 平方英尺内小型弹出式遮阳棚白天全年允许；注意不遮挡其他游客观景视线。大型充气、帐篷、100 平方英尺以上小屋或 30+ 平方码结构依 Sec. 10.10 禁止。当日全部带走。"
        }
      },
      {
        "@type": "Question",
        "name": "飓风季（6 月 1 日至 11 月 30 日）公园安全吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "请核查 NOAA 国家飓风中心（NHC）5 天概率锥；科利尔县疏散分区：本公园位于 A 区（风暴潮区）。登陆期间发布强制疏散令时，科利尔应急中心 EOC 将关闭公园。低风暴活动日请同步查 NOAA 裂流预报日报与 FWC 赤潮状态。"
        }
      },
      {
        "@type": "Question",
        "name": "园内有沙滩椅与遮阳伞出租服务吗？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lowdermilk Park 园内不经营任何租赁服务，亦不向特许供应商发放园内许可；独立商业沙滩椅租赁不得在园内兜售或运营。可自带；折叠椅、遮阳棚合规；布置请勿阻挡无障碍通道。"
        }
      },
      {
        "@type": "Question",
        "name": "计划访问期间若赤潮预警生效怎么办？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "请查询 FWRI FWC 赤潮状态地图与 DOH-Collier Healthy Beaches 水质地图。若 K. brevis > 10 万细胞 / 升：哮喘或慢性呼吸疾病访客建议避免直接靠近海滩；切勿自行捕捞野生海贝烹饪；仅从授权渠道采购。官方地图每日更新，情况可能快速变化。"
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "Where is Lowdermilk Park located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lowdermilk Park is in Naples, Florida, United States, at 1301 Gulf Shore Blvd N, Naples, FL 34102. Geography: Lowdermilk Park → Naples → Florida → United States."
        }
      },
      {
        "@type": "Question",
        "name": "Is Lowdermilk Beach free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Lowdermilk Park is a public space free year-round. Access to the park, beach, lawns, playgrounds, picnic areas, and boardwalks are free; paid components are non-resident hourly metered parking and group-shelter permit reservations (if reserved)."
        }
      },
      {
        "@type": "Question",
        "name": "What are Lowdermilk Park's hours?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lowdermilk Park is open 8:00 AM – 11:00 PM, daily. Closures occur during named tropical storm / hurricane landfall events per City EOC; please consult the Naples Parks & Recreation official website. FWC red-tide temporary closures occur when the beach water quality monitoring warrants."
        }
      },
      {
        "@type": "Question",
        "name": "Can I bring my dog to Lowdermilk Beach?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "City of Naples Code Sec. 10.04.030: Dogs are prohibited on the actual sandy beach strand May 1 through October 31 inclusive; dogs on a 6 ft leash are permitted on the paved park lawns, sidewalks, picnic areas, parking lot and boardwalk year-round; always remove pet waste. Unleashed dogs subject to $250 first-offense fine. For dog-friendly alternatives, Clam Pass Park in north Naples permits dogs on the beach Collier-county-wide."
        }
      },
      {
        "@type": "Question",
        "name": "Is alcohol consumption allowed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Collier County alcohol ordinances on public beach consumption have varied over cycles. Current regulation: low-point beer/wine are permissible in non-glass containers on the lawns; spirituous liquors and glass containers are prohibited; disorderly intoxication in public is addressed under Naples Code Sec. 10.08. Before visiting, confirm the most current City Ordinance Ch. 10. The Collier County Alcohol Beverage (ABC) office updates ordinances on its website."
        }
      },
      {
        "@type": "Question",
        "name": "Are there lifeguards on duty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lowdermilk Park is not currently staffed with permanent stand lifeguard towers; roving beach-patrol lifeguard auxiliary presence of contracted lifeguard rovers are on patrol on peak days; life rings are present. In case of emergency dial 911; Collier County EMS beach-rescue marine unit responds. Always observe flags: double red = NO swim."
        }
      },
      {
        "@type": "Question",
        "name": "Can I erect tents, beach canopies, or cabanas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Umbrellas up to 7 feet and small shade pop-ups (under 100 sq ft) are permitted year-round during daytime; be considerate of beachgoer sight lines. Large tents, inflatables, and cabanas over 100 square feet or category-30+ structures are prohibited per Sec. 10.10; remove everything each day."
        }
      },
      {
        "@type": "Question",
        "name": "Is the park safe during hurricane season (Jun 1 – Nov 30)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Check NOAA NHC Atlantic 5-day cone; Collier County Evacuation Zone: this location is within Zone A (surge). Red during a named storm landfall-issued mandatory evacuation order, park closure occurs per Collier Emergency Management EOC operations. During low-storm conditions: check concurrent daily NOAA rip current product and FWC red-tide status."
        }
      },
      {
        "@type": "Question",
        "name": "Are beach chair and umbrella rentals available on-site?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lowdermilk Park does not operate a rental service on the property and does not license concession vendors inside the park; independent commercial beach chair rentals are not permitted to solicit or operate within the park's boundaries. You may bring your own; folding chairs and pop-ups are permitted; ensure setup remains ADA-path compliant."
        }
      },
      {
        "@type": "Question",
        "name": "What if a red tide advisory is active when I plan to visit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Check FWRI FWC Red Tide Status map and DOH-Collier Healthy Beaches water-quality map. If K. brevis cells exceed 100,000 cells per liter: visitors with asthma or chronic respiratory conditions should avoid immediate beach proximity. DO NOT harvest wild coastal shellfish for cooking; source only from approved vendors. Re-check the official maps daily as conditions can shift rapidly."
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
