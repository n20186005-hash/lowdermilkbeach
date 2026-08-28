'use client';

import { useTranslations, useMessages } from 'next-intl';
import type { ReactElement } from 'react';

type Fact = { id: string; icon: string };

const factIcons: Record<string, ReactElement> = {
  name: (
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  ),
  hours: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </>
  ),
  price: (
    <>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>
  ),
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </>
  ),
  accessibility: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v8M8 11h8M10 21l-2-8M14 13l2 8" />
    </>
  ),
  beach: (
    <>
      <path d="M2 20c2-2 4-3 10-3s8 1 10 3" />
      <path d="M2 17c2-2 4-3 10-3s8 1 10 3" />
      <path d="M6 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0z" />
    </>
  ),
  season: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
};

export default function QuickFactsCard() {
  const t = useTranslations('quickFacts');
  const messages = useMessages() as any;
  const facts: Fact[] = messages?.quickFacts?.facts || [];

  return (
    <section id="facts" className="relative -mt-20 z-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-2xl border p-5 sm:p-8 shadow-lg"
          style={{
            borderColor: 'var(--border-color)',
            background: 'var(--bg-primary)',
            backdropFilter: 'blur(14px)',
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {facts.map((fact) => (
              <div
                key={fact.id}
                className="flex flex-col gap-2 p-3 sm:p-4 rounded-xl border"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-tertiary)' }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center border"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--accent) 40%, transparent)',
                    background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                  }}
                  aria-hidden
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: 'var(--accent)' }}
                  >
                    {factIcons[fact.icon] || factIcons.name}
                  </svg>
                </div>
                <p
                  className="text-[11px] sm:text-xs uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {t(`${fact.id}.label`)}
                </p>
                <p
                  className="text-sm sm:text-base font-semibold leading-snug"
                  style={{ color: 'var(--text-primary)' }}
                  dangerouslySetInnerHTML={{ __html: String(t(`${fact.id}.value`)) }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
