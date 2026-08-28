'use client';

import { useTranslations, useMessages } from 'next-intl';

type Spot = {
  name: string;
  desc: string;
  time?: string;
  location?: string;
};

export default function PhotoSpotsSection() {
  const t = useTranslations('photoSpots');
  const messages = useMessages() as any;
  const spots = (messages?.photoSpots?.spots || []) as Spot[];

  return (
    <section id="photography" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
          {t('subtitle') || ''}
        </p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spots.map((spot, index) => (
            <PhotoSpotCard
              key={index}
              spot={spot}
              index={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PhotoSpotCard({ spot, index }: { spot: Spot; index: number }) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-colors hover:bg-white/5"
      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
    >
      <div
        className="aspect-video flex items-center justify-center relative"
        style={{ background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))' }}
      >
        <div className="text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" className="mx-auto mb-2 opacity-50">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span className="text-4xl font-bold opacity-20" style={{ color: 'var(--accent)' }}>
            {index}
          </span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
          {spot.name}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {spot.desc}
        </p>
        <div
          className="pt-3 space-y-2 border-t border-dashed"
          style={{ borderColor: 'var(--border-color)' }}
        >
          {spot.time && (
            <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 14" />
              </svg>
              <span>{spot.time}</span>
            </div>
          )}
          {spot.location && (
            <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{spot.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
