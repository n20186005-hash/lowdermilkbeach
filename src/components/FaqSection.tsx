'use client';

import { useTranslations, useMessages } from 'next-intl';
import { useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqSection() {
  const t = useTranslations('faq');
  const messages = useMessages() as any;
  const items: FaqItem[] = messages?.faq?.items || [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2 text-center"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          {t('subtitle')}
        </p>
        <div className="w-12 h-0.5 mb-12 mx-auto" style={{ background: 'var(--accent)' }} />

        <div className="space-y-4">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-xl border overflow-hidden transition-all"
                style={{
                  borderColor: 'var(--border-color)',
                  background: 'var(--bg-tertiary)',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-white/5"
                  aria-expanded={isOpen}
                >
                  <h3
                    className="font-display text-lg sm:text-xl font-semibold flex-1"
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
                    className={`flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
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
                    <div
                      className="px-6 pb-6 pt-0 text-base leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                      dangerouslySetInnerHTML={{
                        __html: String(item.answer)
                          .split('\n\n')
                          .map((p) => `<p class="mb-3 last:mb-0">${p}</p>`)
                          .join(''),
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
