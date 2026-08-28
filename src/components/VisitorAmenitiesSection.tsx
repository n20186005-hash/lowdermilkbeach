'use client';

import { useTranslations, useMessages } from 'next-intl';
import { useState } from 'react';

type Amenity = {
  id: string;
  icon: 'wc' | 'parking' | 'food' | 'stay' | 'grocery' | 'fuel';
};

const iconPaths = {
  wc: (
    <>
      <circle cx="9" cy="5" r="2" />
      <path d="M9 7v4M9 11l-2 6M15 11h1l1 6M15 7h1" />
      <circle cx="16" cy="5" r="2" />
    </>
  ),
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </>
  ),
  food: (
    <>
      <path d="M6 3v8a4 4 0 0 0 8 0V3" />
      <path d="M7 8h6M17 3c-1.5 3-1.5 5 0 8v10" />
    </>
  ),
  stay: (
    <>
      <path d="M3 21V9l9-6 9 6v12" />
      <path d="M3 13h18M9 21v-6h6v6" />
    </>
  ),
  grocery: (
    <>
      <path d="M3 4h2l3 12h11l2-8H7" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </>
  ),
  fuel: (
    <>
      <path d="M3 21V5h6v16" />
      <rect x="3" y="9" width="6" height="4" />
      <path d="M14 14h3v-5l2-2V3h-5v11h2v-2M19 14a2 2 0 1 1 2 2" />
    </>
  ),
};

export default function VisitorAmenitiesSection() {
  const t = useTranslations('visitorAmenities');
  const messages = useMessages() as any;
  const categories: Amenity[] = messages?.visitorAmenities?.categories || [];
  const [openId, setOpenId] = useState<string>(categories[0]?.id || '');

  return (
    <section id="amenities" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
          {t('subtitle')}
        </p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="space-y-4">
          {categories.map((cat) => {
            const isOpen = openId === cat.id;
            return (
              <article
                key={cat.id}
                className="rounded-xl border overflow-hidden transition-colors"
                style={{
                  borderColor: 'var(--border-color)',
                  background: 'var(--bg-secondary)',
                }}
              >
                <button
                  className="w-full flex items-center gap-4 p-5 sm:p-6 text-left transition-colors hover:bg-white/5"
                  onClick={() => setOpenId(isOpen ? '' : cat.id)}
                  aria-expanded={isOpen}
                >
                  <div
                    className="w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 rounded-lg flex items-center justify-center border"
                    style={{
                      borderColor: 'var(--border-color)',
                      background: 'var(--bg-tertiary)',
                    }}
                    aria-hidden
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: 'var(--accent)' }}
                    >
                      {iconPaths[cat.icon]}
                    </svg>
                  </div>
                  <h3
                    className="font-display text-lg sm:text-xl font-semibold flex-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t(`${cat.id}.name`)}
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                      className="px-5 sm:px-6 pb-6 text-base leading-relaxed space-y-4"
                      style={{ color: 'var(--text-secondary)' }}
                      dangerouslySetInnerHTML={{
                        __html: String(t(`${cat.id}.content`))
                          .split('\n\n')
                          .map((p) => `<p class="mb-3 last:mb-0">${p}</p>`)
                          .join(''),
                      }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
