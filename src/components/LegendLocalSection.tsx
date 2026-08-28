'use client';

import { useTranslations, useMessages } from 'next-intl';

type Entry = { id: string };

export default function LegendLocalSection() {
  const t = useTranslations('legendSection');
  const messages = useMessages() as any;
  const entries: Entry[] = messages?.legendSection?.entries || [];

  return (
    <section id="legend" className="section-padding">
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

        <div className="space-y-6">
          {entries.map((e, i) => (
            <article
              key={e.id}
              className="rounded-xl border p-6 sm:p-7 transition-colors hover:bg-white/5"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className="text-xs px-2.5 py-1 rounded-full border font-medium"
                  style={{
                    borderColor: 'var(--accent)',
                    color: 'var(--accent)',
                    background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                  }}
                >
                  {String.fromCharCode(65 + i)}. {t(`${e.id}.tag`)}
                </span>
                <h3
                  className="font-display text-xl sm:text-2xl font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {t(`${e.id}.name`)}
                </h3>
              </div>
              <div
                className="text-base leading-relaxed space-y-4"
                style={{ color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{
                  __html: String(t(`${e.id}.content`))
                    .split('\n\n')
                    .map((p) => `<p class="mb-3 last:mb-0">${p}</p>`)
                    .join(''),
                }}
              />
              <p
                className="mt-4 text-xs italic"
                style={{ color: 'var(--text-muted)' }}
                dangerouslySetInnerHTML={{ __html: String(t(`${e.id}.note`)) }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
