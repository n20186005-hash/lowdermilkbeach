'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

// City-published hours used for the day-of-visit status check.
const OPEN_MINUTES = 5 * 60; // 05:00
const CLOSE_MINUTES = 23 * 60; // 23:00

type NaplesTime = {
  dateLine: string;
  timeLine: string;
  minutes: number;
};

function readNaplesTime(date: Date, tag: string): NaplesTime {
  const clock = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const get = (type: string) => clock.find((p) => p.type === type)?.value ?? '0';
  const hour = Number(get('hour'));
  const minute = Number(get('minute'));

  const dateLine = new Intl.DateTimeFormat(tag, {
    timeZone: 'America/New_York',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

  const timeLine = new Intl.DateTimeFormat(tag, {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    hourCycle: 'h23',
  }).format(date);

  return { dateLine, timeLine, minutes: hour * 60 + minute };
}

export default function OpenToday() {
  const t = useTranslations('openToday');
  const locale = useLocale();
  const prefix = locale === 'zh' ? '/zh' : '/en';
  const tag = locale === 'zh' ? 'zh-CN' : 'en-US';
  const [now, setNow] = useState<NaplesTime | null>(null);

  useEffect(() => {
    const tick = () => setNow(readNaplesTime(new Date(), tag));
    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, [tag]);

  const isOpen = now ? now.minutes >= OPEN_MINUTES && now.minutes < CLOSE_MINUTES : null;

  return (
    <section id="open-today" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <p className="text-base leading-relaxed mb-6 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('intro')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              {t('todayLabel')}
            </p>
            <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {now ? now.dateLine : '—'}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {now ? now.timeLine : t('checkingLabel')}
            </p>
          </div>

          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              {now ? (isOpen ? t('openLabel') : t('closedLabel')) : t('checkingLabel')}
            </p>
            <p className="text-lg font-semibold" style={{ color: isOpen ? 'var(--accent)' : 'var(--text-primary)' }}>
              {isOpen === null ? '—' : isOpen ? t('closesAt') : t('opensAt')}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t('likely')}
            </p>
          </div>

          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              {t('hoursLabel')}
            </p>
            <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {t('hoursValue')}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t('altLabel')}
            </p>
          </div>
        </div>

        <div
          className="rounded-xl p-5 mb-6 flex items-start gap-3"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--accent)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('verified')} {isOpen === null ? '' : isOpen ? t('openNote') : t('closedNote')}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.naplesgov.com/parksrec/park/lowdermilk-park/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            {t('officialLabel')}
          </a>
          <a
            href="#beach-weather"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
            style={{ color: 'var(--accent)', border: '1px solid var(--accent)' }}
          >
            {t('weatherLabel')}
          </a>
          <a
            href={`${prefix}/parking`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
            style={{ color: 'var(--accent)', border: '1px solid var(--accent)' }}
          >
            {t('parkingLabel')}
          </a>
        </div>
      </div>
    </section>
  );
}
