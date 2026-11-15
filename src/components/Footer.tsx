/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WEDDING_CONFIG } from '../config/weddingConfig';
import { Heart, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 bg-[#240B47] pt-0 pb-12 text-center text-[#FBF9F5]/80">
      {/* Draped Lilac Silk Wave Transition from #C8A2C8 Body into Royal Plum Footer */}
      <div className="w-full overflow-hidden leading-none bg-[#C8A2C8]">
        <svg
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          className="w-full h-14 sm:h-20 block"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="footerSilkSheen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9B5FA8" />
              <stop offset="35%" stopColor="#E4BEE8" />
              <stop offset="70%" stopColor="#D6A9DA" />
              <stop offset="100%" stopColor="#9A60A5" />
            </linearGradient>
          </defs>
          <path
            d="M0,45 C320,92 640,12 980,58 C1180,85 1340,34 1440,48 L1440,110 L0,110 Z"
            fill="url(#footerSilkSheen)"
            opacity="0.7"
          />
          <path
            d="M0,66 C360,24 720,98 1120,46 C1280,26 1380,54 1440,60 L1440,110 L0,110 Z"
            fill="#240B47"
          />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 pt-10">
        {/* Monogram / Brand mark */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#D4AF37] bg-[#1B0A33] text-[#F3E5AB] font-serif text-xl shadow-md">
          S&Y
        </div>

        {/* Names */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-serif text-[#F3E5AB] font-bold">
            {WEDDING_CONFIG.couple.groomFull} & {WEDDING_CONFIG.couple.brideFull}
          </h3>
          <p className="text-xs uppercase tracking-[0.25em] text-[#C8A2C8] mt-1 font-sans font-semibold">
            {WEDDING_CONFIG.date.displayDate}
          </p>
        </div>

        {/* Thank You Note */}
        <p className="max-w-md mx-auto text-sm font-serif italic text-[#FBF9F5]/90">
          &ldquo;{WEDDING_CONFIG.footer.note}&rdquo;
        </p>

        {/* Hashtags */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <span className="px-3.5 py-1 rounded-full border border-[#D4AF37]/60 bg-[#240B47] text-xs font-serif text-[#F3E5AB] font-medium shadow-sm">
            {WEDDING_CONFIG.couple.hashtag}
          </span>
          <span className="px-3.5 py-1 rounded-full border border-[#C8A2C8]/50 bg-[#240B47] text-xs font-serif text-[#C8A2C8] font-medium shadow-sm">
            {WEDDING_CONFIG.couple.secondaryHashtag}
          </span>
        </div>

        {/* Back to Top */}
        <div className="pt-6">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/50 text-xs text-[#F3E5AB] hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-[#FBF9F5]/60 pt-4 border-t border-[#3B1C66] flex items-center justify-center gap-1 font-sans">
          <span>With love & gratitude</span>
          <Heart className="w-3 h-3 text-[#C8A2C8] fill-[#C8A2C8]" />
          <span>© {WEDDING_CONFIG.footer.copyrightYear}</span>
        </div>
      </div>
    </footer>
  );
};
