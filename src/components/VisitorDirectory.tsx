'use client';

import { useTranslations, useLocale, useMessages } from 'next-intl';

type DirectoryItem = {
  id: string;
  label: string;
  href: string;
};

type SummaryRow = {
  label: string;
  value: string;
};

function DirectoryIcon({ href }: { href: string }) {
  if (href === '#hours' || href === '#open-today') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 14" />
      </svg>
    );
  }
  if (href === '#parking' || href === '/parking') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
      </svg>
    );
  }
  if (href === '#getting-here' || href === '#map') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  }
  if (href === '#amenities') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M3 21h18M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-6h6v6" />
      </svg>
    );
  }
  if (href === '#beach-weather') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
      </svg>
    );
  }
  if (href === '#gallery' || href === '#photography') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.5" />
        <path d="M21 16l-5-5-9 9" />
      </svg>
    );
  }
  if (href === '#faq') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7v.5" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

export default function VisitorDirectory() {
  const t = useTranslations('visitorDirectory');
  const messages = useMessages() as any;
  const locale = useLocale();
  const prefix = locale === 'zh' ? '/zh' : '/en';
  const items: DirectoryItem[] = messages?.visitorDirectory?.items || [];
  const summary: SummaryRow[] = messages?.visitorDirectory?.summary || [];

  return (
    <section id="directory" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-6xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
          {t('subtitle')}
        </p>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <nav aria-label={String(t('title'))}>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {items.map((item) => {
              const href = item.href.startsWith('/') ? `${prefix}${item.href}` : item.href;
              return (
                <li key={item.id}>
                  <a
                    href={href}
                    className="flex items-center gap-3 rounded-xl p-4 transition-all hover:-translate-y-0.5"
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <span
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        color: 'var(--accent)',
                        background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                      }}
                      aria-hidden
                    >
                      <DirectoryIcon href={item.href} />
                    </span>
                    <span className="text-sm font-medium leading-snug">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {summary.length > 0 && (
          <div
            className="mt-12 rounded-2xl border overflow-hidden"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-tertiary)' }}
          >
            <h3
              className="px-5 py-4 text-sm font-semibold"
              style={{
                color: 'var(--text-primary)',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              {t('summaryTitle')}
            </h3>
            <table className="w-full text-left border-collapse">
              <tbody>
                {summary.map((row) => (
                  <tr key={row.label} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th
                      scope="row"
                      className="w-2/5 sm:w-56 px-5 py-3 align-top text-xs sm:text-sm font-normal uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {row.label}
                    </th>
                    <td className="px-5 py-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
