'use client';

import { useTranslations, useMessages, useLocale } from 'next-intl';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

type SubpageDatum = {
  facts: Array<{ label: string; value: string }>;
  sections: Array<{ heading: string; content: string }>;
  faq: Array<{ question: string; answer: string }>;
};

export default function GuideSubpage({
  namespace,
  partner,
}: {
  namespace: 'parkingPage' | 'hoursPage';
  /** Namespace of the sibling guide to cross-link to. */
  partner: { ns: 'parkingPage' | 'hoursPage'; path: string };
}) {
  const t = useTranslations(namespace);
  const messages = useMessages() as any;
  const locale = useLocale();
  const prefix = locale === 'zh' ? '/zh' : '/en';
  const data: SubpageDatum = messages?.[namespace] || { facts: [], sections: [], faq: [] };
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <Header />
      <main>
        <article className="section-padding">
          <div className="max-w-4xl mx-auto">
            <a
              href={`${prefix}#directory`}
              className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              {t('backLabel')}
            </a>

            <h1
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('title')}
            </h1>
            <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
              {t('lastUpdated')}
            </p>
            <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

            <p className="text-base sm:text-lg leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
              {t('intro')}
            </p>

            <h2
              className="font-display text-2xl sm:text-3xl font-semibold mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('factsTitle')}
            </h2>
            <div
              className="rounded-2xl border mb-12 overflow-hidden"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-tertiary)' }}
            >
              {data.facts.map((fact, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-5 py-4"
                  style={{ borderBottom: i === data.facts.length - 1 ? 'none' : '1px solid var(--border-color)' }}
                >
                  <span
                    className="sm:w-56 flex-shrink-0 text-xs uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {fact.label}
                  </span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-10 mb-14">
              {data.sections.map((section, i) => (
                <section key={i}>
                  <h2
                    className="font-display text-xl sm:text-2xl font-semibold mb-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {section.heading}
                  </h2>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {section.content}
                  </p>
                </section>
              ))}
            </div>

            <h2
              className="font-display text-2xl sm:text-3xl font-semibold mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('faqTitle')}
            </h2>
            <div className="space-y-4 mb-12">
              {data.faq.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={i}
                    className="rounded-xl border overflow-hidden"
                    style={{ borderColor: 'var(--border-color)', background: 'var(--bg-tertiary)' }}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <h3
                        className="font-display text-base sm:text-lg font-semibold flex-1"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {item.question}
                      </h3>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        style={{ color: 'var(--accent)' }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p
                          className="px-5 pb-5 text-base leading-relaxed"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href={`${prefix}${partner.path}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                {t('ctaLabel')}
              </a>
              <a
                href={`${prefix}#directory`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
                style={{ color: 'var(--accent)', border: '1px solid var(--accent)' }}
              >
                {t('backLabel')}
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
