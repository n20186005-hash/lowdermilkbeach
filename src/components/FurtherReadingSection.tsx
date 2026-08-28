'use client';

import { useTranslations, useMessages } from 'next-intl';

type Source = { id: string };

export default function FurtherReadingSection() {
  const t = useTranslations('furtherReading');
  const messages = useMessages() as any;
  const sources: Source[] = messages?.furtherReading?.sources || [];

  return (
    <section id="reading" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto">
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

        <ol className="space-y-4 list-decimal pl-5 sm:pl-6">
          {sources.map((s) => (
            <li key={s.id} className="marker:font-semibold" style={{ color: 'var(--accent)' }}>
              <div className="pl-2 text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--text-primary)' }}>{t(`${s.id}.citation`)}</span>
                <div className="mt-1">
                  <a
                    href={t(`${s.id}.url`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm hover:underline break-all"
                    style={{ color: 'var(--accent)' }}
                  >
                    {t(`${s.id}.url`)}
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
