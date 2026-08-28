'use client';

import { useTranslations, useMessages } from 'next-intl';
import { useState } from 'react';

type Audience = { id: string };

export default function AudienceRouteSection() {
  const t = useTranslations('audienceRoutes');
  const messages = useMessages() as any;
  const audiences: Audience[] = messages?.audienceRoutes?.audiences || [];
  const [active, setActive] = useState(audiences[0]?.id || '');

  const tabs = audiences.map((a) => ({
    id: a.id,
    label: t(`${a.id}.name`),
    tag: t(`${a.id}.tag`),
    hours: t(`${a.id}.duration`),
    steps: (messages?.audienceRoutes as any)?.[a.id]?.steps || [],
    intro: t(`${a.id}.intro`),
  }));
  const current = tabs.find((x) => x.id === active) || tabs[0];

  return (
    <section id="audience-routes" className="section-padding">
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

        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => {
            const isActive = tab.id === current.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-full border text-sm sm:text-base transition-all ${
                  isActive ? 'font-semibold shadow-sm' : 'hover:bg-white/5'
                }`}
                style={{
                  borderColor: isActive ? 'var(--accent)' : 'var(--border-color)',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive
                    ? 'color-mix(in srgb, var(--accent) 10%, transparent)'
                    : 'var(--bg-tertiary)',
                }}
                aria-pressed={isActive}
              >
                {tab.label} · <span className="text-xs opacity-80">{tab.hours}</span>
              </button>
            );
          })}
        </div>

        <div
          className="rounded-xl border p-6 sm:p-8 transition-colors"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3
              className="font-display text-2xl font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {current.label}
            </h3>
            <span
              className="text-xs px-2.5 py-1 rounded-full border"
              style={{
                borderColor: 'var(--accent)',
                color: 'var(--accent)',
                background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
              }}
            >
              {current.tag}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              ⏱ {current.hours}
            </span>
          </div>
          <p
            className="mb-6 text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {current.intro}
          </p>
          <ol className="relative pl-0 space-y-4">
            {current.steps.map((_: never, i: number) => (
              <li key={i} className="relative flex gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold"
                  style={{
                    borderColor: 'var(--accent)',
                    color: 'var(--accent)',
                    background: 'var(--bg-tertiary)',
                  }}
                >
                  {i + 1}
                </div>
                <div
                  className="flex-1 pt-1 text-base leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                  dangerouslySetInnerHTML={{
                    __html: String(t(`${current.id}.steps.${i}`)),
                  }}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
