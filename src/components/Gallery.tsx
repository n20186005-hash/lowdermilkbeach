'use client';

import { useTranslations, useMessages } from 'next-intl';
import { useState, useCallback } from 'react';

const photos = [
  {
    src: '/gallery/lowdermilk-park-beachfront-hero.jpg',
    alt: 'Lowdermilk Park (Lowdermilk Beach) - Main beachfront and lawn overview in Naples, United States',
  },
  {
    src: '/gallery/lowdermilk-park-gulf-sunset.jpg',
    alt: 'Lowdermilk Beach - Gulf of Mexico sunset with golden water near Naples Pier',
  },
  {
    src: '/gallery/lowdermilk-park-sandy-beach.jpg',
    alt: 'Lowdermilk Park - Pristine sandy beach looking toward the Gulf of Mexico',
  },
  {
    src: '/gallery/lowdermilk-park-picnic-lawn.jpg',
    alt: 'Lowdermilk Park - Picnic lawn area with palm trees near Third Street South',
  },
  {
    src: '/gallery/lowdermilk-park-playground.jpg',
    alt: 'Lowdermilk Park - Childrens playground facility in Naples beachfront',
  },
  {
    src: '/gallery/lowdermilk-park-volleyball-court.jpg',
    alt: 'Lowdermilk Beach - Sand volleyball court activity area in Lowdermilk Park',
  },
  {
    src: '/gallery/lowdermilk-park-pavilion.jpg',
    alt: 'Lowdermilk Park - Picnic pavilion and BBQ facilities by the beach',
  },
  {
    src: '/gallery/lowdermilk-park-naples-pier-distant.jpg',
    alt: 'Naples Pier distant view from Lowdermilk Beach along Gulf Shore Blvd',
  },
  {
    src: '/gallery/lowdermilk-park-gulf-sunrise.jpg',
    alt: 'Lowdermilk Beach - Gulf of Mexico sunrise panorama from Lowdermilk Park',
  },
  {
    src: '/gallery/lowdermilk-park-coastal-trail.jpg',
    alt: 'Lowdermilk Park - Coastal Trail walking path along Gulf Shore Boulevard',
  },
  {
    src: '/gallery/lowdermilk-park-seagull-wildlife.jpg',
    alt: 'Lowdermilk Beach - Seagull and shorebird wildlife on the sand',
  },
  {
    src: '/gallery/lowdermilk-park-dolphin-watch.jpg',
    alt: 'Lowdermilk Park - Dolphin watching spot on Gulf of Mexico horizon',
  },
  {
    src: '/gallery/lowdermilk-park-restroom-shower.jpg',
    alt: 'Lowdermilk Park - Public restroom and shower facilities entrance',
  },
  {
    src: '/gallery/lowdermilk-park-parking-area.jpg',
    alt: 'Lowdermilk Park - Main parking area near 1301 Gulf Shore Blvd N Naples',
  },
  {
    src: '/gallery/lowdermilk-park-third-street-south.jpg',
    alt: 'Lowdermilk Park - Walkable access toward Third Street South district',
  },
  {
    src: '/gallery/lowdermilk-park-family-picnic.jpg',
    alt: 'Lowdermilk Park - Family picnic gathering on the waterfront lawn',
  },
  {
    src: '/gallery/lowdermilk-park-beach-umbrellas.jpg',
    alt: 'Lowdermilk Beach - Beach umbrellas and summer visitors on the sand',
  },
  {
    src: '/gallery/lowdermilk-park-evening-breeze.jpg',
    alt: 'Lowdermilk Park - Evening sea breeze and coastal scenery in Naples Florida',
  },
];

export default function Gallery() {
  const t = useTranslations('gallery');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, []);

  const openLightbox = () => setIsLightboxOpen(true);
  const closeLightbox = () => setIsLightboxOpen(false);

  return (
    <>
      <section id="gallery" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('title')}
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
          <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {(showAll ? photos : photos.slice(0, 8)).map((photo, i) => (
                <div
                  key={photo.src}
                  className={`gallery-item relative group cursor-pointer ${i === 0 && !showAll ? 'col-span-2 row-span-2' : ''}`}
                  onClick={() => {
                    setCurrentIndex(i);
                    openLightbox();
                  }}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover rounded-lg"
                    style={{ minHeight: i === 0 ? '400px' : '180px' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg flex items-end">
                    <p className="text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {photo.alt}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-colors"
              aria-label="Previous photo"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-colors"
              aria-label="Next photo"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <div className="flex justify-center mt-6 gap-4 items-center">
              {!showAll && photos.length > 8 && (
                <button
                  onClick={() => setShowAll(true)}
                  className="text-sm hover:underline font-medium"
                  style={{ color: 'var(--accent)' }}
                >
                  {t('showAll') || `View All ${photos.length} Photos`}
                </button>
              )}
              {showAll && (
                <button
                  onClick={() => setShowAll(false)}
                  className="text-sm hover:underline font-medium"
                  style={{ color: 'var(--accent)' }}
                >
                  {t('showLess') || 'Show Less'}
                </button>
              )}
              <a
                href="https://maps.app.goo.gl/7SscvaRAaJj3YuB19"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                {t('viewAll')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Previous photo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <img
            src={photos[currentIndex].src}
            alt={photos[currentIndex].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Next photo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
