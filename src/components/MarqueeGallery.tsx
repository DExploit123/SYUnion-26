/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { WEDDING_CONFIG, GalleryImage } from '../config/weddingConfig';
import { X, ZoomIn, ChevronLeft, ChevronRight, LayoutGrid, Rows3, Image as ImageIcon } from 'lucide-react';

interface GalleryTileProps {
  img: GalleryImage;
  onSelect: () => void;
  variant: 'marquee' | 'grid';
}

const GalleryTile: React.FC<GalleryTileProps> = ({ img, onSelect, variant }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        variant === 'marquee'
          ? 'relative group shrink-0 w-36 h-44 sm:w-52 sm:h-64 lg:w-60 lg:h-72 rounded-xl sm:rounded-2xl overflow-hidden border border-[#D4AF37]/60 shadow-lg shadow-[#240B47]/20 cursor-pointer bg-[#240B47] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F073A]'
          : 'relative group w-full aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden border border-[#D4AF37]/60 shadow-lg shadow-[#240B47]/20 cursor-pointer bg-[#240B47] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F073A]'
      }
      aria-label={`View photo: ${img.caption}`}
    >
      {!hasError ? (
        <img
          src={img.src}
          alt={img.alt}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-[#240B47] to-[#3B126D] text-[#F3E5AB]">
          <ImageIcon className="w-6 h-6 mb-1.5 opacity-70" />
          <span className="text-[11px] font-serif leading-tight">{img.caption}</span>
        </div>
      )}

      {/* Measured contrast scrim for caption legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0733]/90 via-[#1A0733]/15 to-transparent opacity-85 group-hover:opacity-95 transition-opacity pointer-events-none" />

      {/* Caption & subtle zoom affordance */}
      <div className="absolute bottom-2 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between gap-1.5 text-[11px] sm:text-xs text-[#F3E5AB]">
        <span className="font-serif font-medium truncate">{img.caption}</span>
        <ZoomIn className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#F3E5AB]" />
      </div>
    </button>
  );
};

export const MarqueeGallery: React.FC = () => {
  const [viewMode, setViewMode] = useState<'flowing' | 'grid'>('flowing');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const allPhotos: GalleryImage[] = [
    ...WEDDING_CONFIG.gallery.row1,
    ...WEDDING_CONFIG.gallery.row2,
    ...WEDDING_CONFIG.gallery.row3,
  ];

  const selectedImage = selectedIndex !== null ? allPhotos[selectedIndex] : null;

  const openPhoto = (photo: GalleryImage) => {
    const idx = allPhotos.findIndex((p) => p.src === photo.src && p.caption === photo.caption);
    setSelectedIndex(idx >= 0 ? idx : 0);
  };

  const handlePrev = useCallback(() => {
    if (allPhotos.length === 0) return;
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + allPhotos.length) % allPhotos.length
    );
  }, [allPhotos.length]);

  const handleNext = useCallback(() => {
    if (allPhotos.length === 0) return;
    setSelectedIndex((prev) =>
      prev === null ? null : (prev + 1) % allPhotos.length
    );
  }, [allPhotos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  if (allPhotos.length === 0) {
    return null;
  }

  const renderMarqueeRow = (
    images: GalleryImage[],
    animationClass: string,
    rowKey: string
  ) => {
    if (images.length === 0) return null;
    const loopedImages = [...images, ...images, ...images];

    return (
      <div className="relative overflow-hidden w-full py-1">
        <div className={`${animationClass} pause-hover flex gap-3 sm:gap-4 lg:gap-5`}>
          {loopedImages.map((img, idx) => (
            <GalleryTile
              key={`${rowKey}-${idx}`}
              img={img}
              variant="marquee"
              onSelect={() => openPhoto(img)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="gallery" className="relative py-20 sm:py-24 overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14 px-4 max-w-4xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[#3B0764] font-semibold">
          Captured Moments
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif text-[#1F073A] font-bold mt-2 mb-4">
          Photo Gallery
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#9A7314] to-transparent mx-auto mb-4" />
        <p className="max-w-xl mx-auto text-xs sm:text-base text-[#2E1065] font-sans font-medium leading-relaxed">
          {allPhotos.length} moments · Tap any photograph to view in full resolution
        </p>

        {/* Functional View Switcher: Flowing Marquee vs Compact Grid */}
        <div className="inline-flex items-center gap-1 p-1 bg-[#240B47]/90 border border-[#D4AF37]/45 rounded-xl mt-6 shadow-md">
          <button
            type="button"
            onClick={() => setViewMode('flowing')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'flowing'
                ? 'bg-[#D4AF37] text-[#120826] font-semibold'
                : 'text-[#FBF9F5]/80 hover:text-[#F3E5AB]'
            }`}
          >
            <Rows3 className="w-3.5 h-3.5" />
            <span>Flowing Rows</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#D4AF37] text-[#120826] font-semibold'
                : 'text-[#FBF9F5]/80 hover:text-[#F3E5AB]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Photos ({allPhotos.length})</span>
          </button>
        </div>
      </div>

      {viewMode === 'flowing' ? (
        /* Compact 3-Row Flowing Gallery with Edge Fade Scrims */
        <div className="relative">
          {/* Smooth edge fades into #C8A2C8 lilac silk canvas */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-16 z-10 bg-gradient-to-r from-[#C8A2C8] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-16 z-10 bg-gradient-to-l from-[#C8A2C8] to-transparent" />

          <div className="space-y-3 sm:space-y-5">
            {renderMarqueeRow(WEDDING_CONFIG.gallery.row1, 'animate-marquee-left', 'row1')}
            {renderMarqueeRow(WEDDING_CONFIG.gallery.row2, 'animate-marquee-right', 'row2')}
            {renderMarqueeRow(WEDDING_CONFIG.gallery.row3, 'animate-marquee-left-fast', 'row3')}
          </div>
        </div>
      ) : (
        /* Compact Multi-Column Grid (3 columns on mobile phones, 4 on larger screens) */
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {allPhotos.map((img, idx) => (
              <GalleryTile
                key={`grid-${idx}`}
                img={img}
                variant="grid"
                onSelect={() => setSelectedIndex(idx)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal with Previous / Next Controls */}
      {selectedImage && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-[#0B0418]/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.caption}
        >
          <div
            className="relative w-full max-w-3xl max-h-[92vh] bg-[#1F0E3D] border border-[#D4AF37]/50 rounded-2xl overflow-hidden shadow-2xl p-2 sm:p-3 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button (44px touch target) */}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-3 right-3 z-20 w-11 h-11 rounded-full bg-[#120826]/85 border border-[#D4AF37]/40 text-[#F3E5AB] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#120826] transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo stage with Prev / Next */}
            <div className="relative flex items-center justify-center bg-[#120826]/70 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-3 z-10 w-11 h-11 rounded-full bg-[#120826]/80 border border-[#D4AF37]/40 text-[#F3E5AB] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#120826] transition-colors cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-h-[70vh] w-auto mx-auto object-contain rounded-lg"
                referrerPolicy="no-referrer"
                decoding="async"
              />

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-3 z-10 w-11 h-11 rounded-full bg-[#120826]/80 border border-[#D4AF37]/40 text-[#F3E5AB] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#120826] transition-colors cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Clean unboxed editorial caption footer */}
            <div className="px-3 py-3 sm:py-4 text-center">
              <h4 className="text-base sm:text-xl font-serif text-[#F3E5AB] font-semibold">
                {selectedImage.caption}
              </h4>
              <p className="text-xs text-[#C8A2C8] mt-1 font-sans">
                {selectedIndex + 1} of {allPhotos.length} · {selectedImage.alt}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
