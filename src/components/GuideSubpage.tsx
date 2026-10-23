'use client';

import { useTranslations, useMessages, useLocale } from 'next-intl';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

type SubpageFact = { label: string; value: string };
type SubpageSection = { heading: string; content: string };
type SubpageTable = { title?: string; columns: string[]; rows: string[][] };
type SubpageSource = { label: string; href: string; note?: string };
type SubpageFaq = { question: string; answer: string };
type SubpageLink = { path: string; label: string };

type SubpageDatum = {
  metaTitle?: string;
  metaDescription?: string;
  title: string;
  intro: string;
  lastUpdated?: string;
  factsTitle?: string;
  facts?: SubpageFact[];
  sections?: SubpageSection[];
  tables?: SubpageTable[];
  faqTitle?: string;
  faq?: SubpageFaq[];
  sources?: SubpageSource[];
  backLabel: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function GuideSubpage({
  namespace,
  partner,
  related = [],
}: {
  namespace: string;
  partner?: SubpageLink;
  related?: SubpageLink[];
}) {
  const t = useTranslations(namespace);
  const tc = useTranslations('guideCommon');
  const messages = useMessages() as any;
  const locale = useLocale();
  const prefix = locale === 'zh' ? '/zh' : '/en';
  const data: SubpageDatum = messages?.[namespace] || {
    title: '',
    intro: '',
    backLabel: 'Back to the visitor guide',
  };
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <Header />
      <main>
        <article className="section-padding">
          <div className="max-w-4xl mx-auto">
            <a
              href={`${prefix}#directory`}
              className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              {data.backLabel}
            </a>

            <h1
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {data.title}
            </h1>
            {data.lastUpdated && (
              <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
                {data.lastUpdated}
              </p>
            )}
            <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

            <p className="text-base sm:text-lg leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
              {data.intro}
            </p>

            {data.facts && data.facts.length > 0 && (
              <>
                <h2
                  className="font-display text-2xl sm:text-3xl font-semibold mb-6"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {data.factsTitle || tc('factsTitle')}
                </h2>
                <div
                  className="rounded-2xl border mb-12 overflow-hidden"
                  style={{ borderColor: 'var(--border-color)', background: 'var(--bg-tertiary)' }}
                >
                  {data.facts.map((fact, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-5 py-4"
                      style={{ borderBottom: i === data.facts!.length - 1 ? 'none' : '1px solid var(--border-color)' }}
                    >
                      <span
                        className="sm:w-56 flex-shrink-0 text-xs uppercase tracking-wider"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {fact.label}
                      </span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {fact.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="space-y-10 mb-14">
              {(data.sections || []).map((section, i) => (
                <section key={i}>
                  <h2
                    className="font-display text-xl sm:text-2xl font-semibold mb-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {section.heading}
                  </h2>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {section.content}
                  </p>
                </section>
              ))}

              {(data.tables || []).map((table, ti) => (
                <section key={`table-${ti}`}>
                  {table.title && (
                    <h2
                      className="font-display text-xl sm:text-2xl font-semibold mb-3"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {table.title}
                    </h2>
                  )}
                  <div
                    className="rounded-2xl border overflow-x-auto"
                    style={{ borderColor: 'var(--border-color)', background: 'var(--bg-tertiary)' }}
                  >
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                          {table.columns.map((col, ci) => (
                            <th
                              key={ci}
                              className="px-4 py-3 font-semibold uppercase tracking-wider text-xs"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, ri) => (
                          <tr key={ri} style={{ borderBottom: ri === table.rows.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-4 py-3 align-top" style={{ color: 'var(--text-primary)' }}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>

            {data.faq && data.faq.length > 0 && (
              <>
                <h2
                  className="font-display text-2xl sm:text-3xl font-semibold mb-6"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {data.faqTitle || tc('faqTitle')}
                </h2>
                <div className="space-y-4 mb-12">
                  {data.faq.map((item, i) => {
                    const isOpen = openIndex === i;
                    return (
                      <div
                        key={i}
                        className="rounded-xl border overflow-hidden"
                        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-tertiary)' }}
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : i)}
                          className="w-full flex items-center justify-between gap-4 p-5 text-left"
                          aria-expanded={isOpen}
                        >
                          <h3
                            className="font-display text-base sm:text-lg font-semibold flex-1"
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
                            className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
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
                            <p
                              className="px-5 pb-5 text-base leading-relaxed"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {data.sources && data.sources.length > 0 && (
              <div
                className="rounded-2xl border p-5 mb-12"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}
              >
                <h2
                  className="font-display text-lg font-semibold mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {tc('sourcesTitle')}
                </h2>
                <ul className="space-y-2">
                  {data.sources.map((src, i) => (
                    <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <a
                        href={src.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline underline-offset-2"
                        style={{ color: 'var(--accent)' }}
                      >
                        {src.label}
                      </a>
                      {src.note && <span className="block text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{src.note}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {related.length > 0 && (
              <div className="mb-12">
                <h2
                  className="font-display text-xl sm:text-2xl font-semibold mb-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {tc('relatedTitle')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {related.map((link) => (
                    <a
                      key={link.path}
                      href={`${prefix}${link.path}`}
                      className="rounded-xl border p-4 text-sm font-medium transition-all hover:-translate-y-0.5"
                      style={{
                        borderColor: 'var(--border-color)',
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {partner && (
                <a
                  href={`${prefix}${partner.path}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  {partner.label}
                </a>
              )}
              <a
                href={`${prefix}#directory`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
                style={{ color: 'var(--accent)', border: '1px solid var(--accent)' }}
              >
                {data.backLabel}
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
