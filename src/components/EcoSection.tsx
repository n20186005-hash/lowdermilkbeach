'use client';

import { useTranslations, useMessages } from 'next-intl';

type Topic = { id: string; };

export default function EcoSection() {
  const t = useTranslations('ecoSection');
  const messages = useMessages() as any;
  const topics: Topic[] = messages?.ecoSection?.topics || [];

  return (
    <section id="ecology" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
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

        <div className="grid md:grid-cols-2 gap-6">
          {topics.map((topic, i) => (
            <article
              key={topic.id}
              className="rounded-xl border p-6 transition-colors hover:bg-white/5"
              style={{
                borderColor: 'var(--border-color)',
                background: 'var(--bg-tertiary)',
              }}
            >
              <div
                className="inline-flex items-center px-3 py-1 mb-4 text-xs font-medium rounded-full border"
                style={{
                  borderColor: 'var(--accent)',
                  color: 'var(--accent)',
                  background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                }}
              >
                {String.fromCharCode(65 + i)}. {t(`topics.${topic.id}.tag`)}
              </div>
              <h3
                className="font-display text-xl font-semibold mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                {t(`topics.${topic.id}.name`)}
              </h3>
              <div
                className="text-base leading-relaxed space-y-3"
                style={{ color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{
                  __html: String(t(`topics.${topic.id}.content`))
                    .split('\n\n')
                    .map((p) => `<p class="mb-2 last:mb-0">${p}</p>`)
                    .join(''),
                }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
