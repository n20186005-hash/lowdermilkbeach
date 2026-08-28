'use client';

import { useTranslations, useMessages } from 'next-intl';

type Principle = { id: string };

export default function LntSection() {
  const t = useTranslations('lntSection');
  const messages = useMessages() as any;
  const principles: Principle[] = messages?.lntSection?.principles || [];

  return (
    <section id="lnt" className="section-padding">
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

        <div
          className="rounded-xl border p-6 sm:p-8 mb-10"
          style={{
            borderColor: 'var(--accent)',
            background: 'color-mix(in srgb, var(--accent) 8%, var(--bg-secondary))',
          }}
        >
          <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            {t('cbt.title')}
          </h3>
          <div
            className="text-base leading-relaxed space-y-3"
            style={{ color: 'var(--text-secondary)' }}
            dangerouslySetInnerHTML={{
              __html: String(t('cbt.content'))
                .split('\n\n')
                .map((p) => `<p class="mb-2 last:mb-0">${p}</p>`)
                .join(''),
            }}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {principles.map((p) => (
            <article
              key={p.id}
              className="relative pl-14 rounded-xl border p-5 transition-colors hover:bg-white/5"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}
            >
              <div
                className="absolute left-4 top-5 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border"
                style={{
                  borderColor: 'var(--accent)',
                  color: 'var(--accent)',
                  background: 'var(--bg-tertiary)',
                }}
                aria-hidden
              >
                {t(`principles.${p.id}.order`) || '·'}
              </div>
              <h4
                className="font-display text-lg font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {t(`principles.${p.id}.name`)}
              </h4>
              <div
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: String(t(`principles.${p.id}.content`)) }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
