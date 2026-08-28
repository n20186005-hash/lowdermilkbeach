'use client';

import { useTranslations, useMessages } from 'next-intl';

type Season = { id: string; key: string };

export default function SeasonalSection() {
  const t = useTranslations('seasonalSection');
  const messages = useMessages() as any;
  const seasons: Season[] = messages?.seasonalSection?.seasons || [];

  return (
    <section id="seasonal" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-6xl mx-auto">
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

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr
                className="text-left uppercase text-xs tracking-wider"
                style={{
                  color: 'var(--text-muted)',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <th className="py-3 px-4 font-medium">{t('headers.season')}</th>
                <th className="py-3 px-4 font-medium">{t('headers.airTemp')}</th>
                <th className="py-3 px-4 font-medium">{t('headers.waterTemp')}</th>
                <th className="py-3 px-4 font-medium">{t('headers.notes')}</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map((s, i) => (
                <tr
                  key={s.id}
                  className="align-top"
                  style={{
                    borderBottom: '1px dashed var(--border-color)',
                    background: i % 2 === 1 ? 'color-mix(in srgb, var(--bg-tertiary) 50%, transparent)' : 'transparent',
                  }}
                >
                  <td
                    className="py-4 px-4 font-semibold whitespace-nowrap"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t(`${s.key}.name`)}
                  </td>
                  <td className="py-4 px-4" style={{ color: 'var(--text-secondary)' }}>
                    {t(`${s.key}.airTemp`)}
                  </td>
                  <td className="py-4 px-4" style={{ color: 'var(--text-secondary)' }}>
                    {t(`${s.key}.waterTemp`)}
                  </td>
                  <td
                    className="py-4 px-4 leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                    dangerouslySetInnerHTML={{
                      __html: String(t(`${s.key}.notes`))
                        .split('\n\n')
                        .map((p) => `<p class="mb-2 last:mb-0">${p}</p>`)
                        .join(''),
                    }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
