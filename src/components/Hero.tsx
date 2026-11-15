/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { WEDDING_CONFIG } from '../config/weddingConfig';
import { ChevronDown, Sparkles } from 'lucide-react';

const ThreeRingsCanvas = lazy(() =>
  import('./ThreeRingsCanvas').then((mod) => ({ default: mod.ThreeRingsCanvas }))
);

export const Hero: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [is3DReady, setIs3DReady] = useState(false);

  const handle3DLoaded = useCallback(() => {
    setIs3DReady(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight || 800;
      const progress = Math.min(scrollY / (windowHeight * 1.2), 1.5);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStory = () => {
    const target = document.getElementById('countdown') || document.getElementById('story');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative w-full min-h-screen flex flex-col justify-between items-center overflow-hidden pt-24 pb-20 sm:pb-28"
      style={{
        background:
          'radial-gradient(ellipse 80% 68% at 50% 45%, #F0D9F2 0%, #D9B4DC 28%, #C8A2C8 56%, #9E72A6 84%, #7A4B85 100%)',
      }}
    >
      {/* Soft Pearlescent Center Aura behind Rings & Title */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[460px] sm:w-[680px] h-[460px] sm:h-[680px] rounded-full bg-gradient-to-tr from-[#F7E8F9]/60 via-[#FFF8E6]/35 to-[#D4AF37]/20 blur-3xl opacity-80" />
      </div>

      {/* Top-Left Botanical Lilac Roses & Baby's Breath Spray */}
      <svg
        viewBox="0 0 360 360"
        className="pointer-events-none absolute -top-4 -left-6 w-48 h-48 sm:w-72 sm:h-72 md:w-80 md:h-80 opacity-90 z-[1] drop-shadow-md"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="roseOuterTL" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#F5DCF7" />
            <stop offset="45%" stopColor="#C47AD0" />
            <stop offset="100%" stopColor="#7C3A8B" />
          </radialGradient>
          <radialGradient id="roseInnerTL" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FCEBFB" />
            <stop offset="60%" stopColor="#B864C4" />
            <stop offset="100%" stopColor="#6B2C7A" />
          </radialGradient>
        </defs>
        {/* Soft eucalyptus & fern stems */}
        <path d="M10,20 Q90,95 165,130" stroke="#7E9B7D" strokeWidth="2.5" fill="none" opacity="0.65" />
        <path d="M35,5 Q85,115 95,215" stroke="#6E8D6D" strokeWidth="2" fill="none" opacity="0.6" />
        <ellipse cx="145" cy="115" rx="14" ry="7" transform="rotate(-25 145 115)" fill="#89A888" opacity="0.7" />
        <ellipse cx="92" cy="185" rx="12" ry="6" transform="rotate(35 92 185)" fill="#7E9D7D" opacity="0.7" />
        <ellipse cx="122" cy="70" rx="11" ry="5" transform="rotate(-48 122 70)" fill="#96B595" opacity="0.65" />
        {/* Main lilac roses */}
        <circle cx="38" cy="48" r="38" fill="url(#roseOuterTL)" />
        <circle cx="34" cy="44" r="24" fill="url(#roseInnerTL)" opacity="0.9" />
        <circle cx="88" cy="36" r="28" fill="url(#roseOuterTL)" />
        <circle cx="84" cy="34" r="16" fill="url(#roseInnerTL)" opacity="0.9" />
        <circle cx="28" cy="112" r="30" fill="url(#roseOuterTL)" />
        <circle cx="25" cy="108" r="18" fill="url(#roseInnerTL)" opacity="0.9" />
        <circle cx="72" cy="88" r="22" fill="url(#roseOuterTL)" opacity="0.92" />
        {/* Baby's breath delicate white blossoms */}
        <g fill="#FFF9FE" opacity="0.92">
          <circle cx="125" cy="52" r="4.5" />
          <circle cx="138" cy="60" r="3.5" />
          <circle cx="148" cy="44" r="3" />
          <circle cx="110" cy="108" r="4" />
          <circle cx="122" cy="122" r="4.5" />
          <circle cx="134" cy="112" r="3" />
          <circle cx="78" cy="148" r="4" />
          <circle cx="92" cy="156" r="3.5" />
          <circle cx="52" cy="166" r="4" />
          <circle cx="64" cy="178" r="3" />
        </g>
      </svg>

      {/* Bottom-Left Botanical Lilac Floral Bouquet (Anchored above silk folds) */}
      <svg
        viewBox="0 0 360 320"
        className="pointer-events-none absolute bottom-4 sm:bottom-8 -left-6 w-52 h-44 sm:w-76 sm:h-68 md:w-88 md:h-76 opacity-95 z-[3] drop-shadow-xl"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="roseOuterBL" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#F6E2F8" />
            <stop offset="45%" stopColor="#BA6DC7" />
            <stop offset="100%" stopColor="#6D2F7D" />
          </radialGradient>
          <radialGradient id="roseInnerBL" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FDF2FD" />
            <stop offset="60%" stopColor="#A955B8" />
            <stop offset="100%" stopColor="#5B216B" />
          </radialGradient>
        </defs>
        {/* Foliage stems */}
        <path d="M10,290 Q95,210 175,180" stroke="#6E8E6E" strokeWidth="2.5" fill="none" opacity="0.7" />
        <path d="M25,300 Q70,185 75,115" stroke="#7E9E7D" strokeWidth="2.5" fill="none" opacity="0.65" />
        <ellipse cx="142" cy="195" rx="16" ry="7" transform="rotate(-22 142 195)" fill="#85A484" opacity="0.75" />
        <ellipse cx="105" cy="152" rx="13" ry="6" transform="rotate(-55 105 152)" fill="#789977" opacity="0.75" />
        {/* Layered Lilac Blooms */}
        <circle cx="48" cy="240" r="42" fill="url(#roseOuterBL)" />
        <circle cx="45" cy="236" r="25" fill="url(#roseInnerBL)" />
        <circle cx="105" cy="252" r="34" fill="url(#roseOuterBL)" />
        <circle cx="102" cy="249" r="20" fill="url(#roseInnerBL)" />
        <circle cx="38" cy="180" r="30" fill="url(#roseOuterBL)" />
        <circle cx="36" cy="177" r="18" fill="url(#roseInnerBL)" />
        <circle cx="88" cy="205" r="26" fill="url(#roseOuterBL)" opacity="0.95" />
        {/* Baby's breath delicate accents */}
        <g fill="#FFF9FE" opacity="0.95">
          <circle cx="72" cy="138" r="4.5" />
          <circle cx="88" cy="128" r="3.5" />
          <circle cx="62" cy="122" r="3" />
          <circle cx="132" cy="175" r="4.5" />
          <circle cx="148" cy="182" r="3.5" />
          <circle cx="122" cy="162" r="3" />
          <circle cx="152" cy="232" r="4.5" />
          <circle cx="164" cy="242" r="3.5" />
          <circle cx="138" cy="220" r="3" />
        </g>
      </svg>

      {/* 3D Interlocking Rings + Amethyst Gemstone + Orbital Halo + Drifting Petals */}
      <Suspense fallback={null}>
        <ThreeRingsCanvas
          scrollProgress={scrollProgress}
          onLoaded={handle3DLoaded}
        />
      </Suspense>

      {/* Graceful 3D Loading Indicator */}
      {!is3DReady && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="flex flex-col items-center gap-3 text-xs tracking-widest uppercase text-[#240B47]/80 font-medium">
            <Sparkles className="w-5 h-5 text-[#9A7314] animate-spin" />
            <span>Rendering Royal Rings...</span>
          </div>
        </div>
      )}

      {/* Top Tagline ("Are getting married" flanked by gold hairlines) */}
      <div className="relative z-10 text-center px-4 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-3 sm:gap-5">
          <span className="hidden xs:inline-block w-8 sm:w-14 h-px bg-gradient-to-r from-transparent to-[#9A7314]" />
          <span className="inline-block px-5 py-1.5 rounded-full border border-[#B88924]/75 bg-[#F8ECF8]/80 backdrop-blur-sm text-xs sm:text-sm font-serif italic text-[#240B47] font-medium tracking-wide shadow-sm">
            {WEDDING_CONFIG.hero.tagline}
          </span>
          <span className="hidden xs:inline-block w-8 sm:w-14 h-px bg-gradient-to-l from-transparent to-[#9A7314]" />
        </div>
      </div>

      {/* Central Hero Typography Overlay */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto my-auto select-none pointer-events-none">
        <h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif text-[#240B47] font-semibold tracking-tight leading-[1.06]"
          style={{
            textShadow: '0 2px 26px rgba(246, 232, 248, 0.92), 0 1px 4px rgba(255, 255, 255, 0.85)',
          }}
        >
          {WEDDING_CONFIG.hero.names}
        </h1>

        <div className="flex items-center justify-center gap-4 sm:gap-6 my-5 sm:my-7">
          <div className="w-14 sm:w-28 h-px bg-gradient-to-r from-transparent via-[#9A7314] to-[#9A7314]" />
          <span className="text-sm sm:text-xl font-sans text-[#240B47] tracking-[0.28em] uppercase font-semibold drop-shadow-[0_1px_8px_rgba(255,255,255,0.7)]">
            {WEDDING_CONFIG.hero.dateText}
          </span>
          <div className="w-14 sm:w-28 h-px bg-gradient-to-l from-transparent via-[#9A7314] to-[#9A7314]" />
        </div>

        <p className="max-w-lg mx-auto text-base sm:text-xl font-serif italic text-[#240B47]/95 tracking-wide leading-relaxed px-4 drop-shadow-[0_1px_6px_rgba(255,255,255,0.65)]">
          {WEDDING_CONFIG.hero.subtitle}
        </p>
      </div>

      {/* Scroll Indicator positioned cleanly above the silk folds */}
      <div className="relative z-10 text-center pb-2 sm:pb-4">
        <button
          onClick={scrollToStory}
          className="group inline-flex flex-col items-center gap-2 text-xs tracking-widest text-[#240B47] hover:text-[#5B21B6] transition-colors cursor-pointer font-semibold"
          aria-label={WEDDING_CONFIG.hero.scrollHint}
        >
          <span className="text-[11px] font-sans tracking-[0.22em] uppercase drop-shadow-[0_1px_4px_rgba(255,255,255,0.75)]">
            {WEDDING_CONFIG.hero.scrollHint}
          </span>
          <ChevronDown className="w-4 h-4 text-[#9A7314] group-hover:translate-y-1 transition-transform animate-bounce" />
        </button>
      </div>

      {/* Draped Glossy Lilac Silk Wave blending seamlessly into #C8A2C8 Lilac Body */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 170"
          preserveAspectRatio="none"
          className="w-full h-24 sm:h-32 md:h-40 block"
          aria-hidden="true"
        >
          <defs>
            {/* Upper silk fold highlight sheen */}
            <linearGradient id="silkHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9B5FA8" />
              <stop offset="30%" stopColor="#E4BEE8" />
              <stop offset="65%" stopColor="#F6DCF8" />
              <stop offset="88%" stopColor="#D6A9DA" />
              <stop offset="100%" stopColor="#9A60A5" />
            </linearGradient>
            {/* Mid silk fold drape */}
            <linearGradient id="silkMid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D9B4DC" />
              <stop offset="55%" stopColor="#A96EB1" />
              <stop offset="100%" stopColor="#B887BD" />
            </linearGradient>
            {/* Seamless transition into #C8A2C8 body canvas */}
            <linearGradient id="silkToLilacBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9E6EA7" />
              <stop offset="52%" stopColor="#B98EBD" />
              <stop offset="100%" stopColor="#C8A2C8" />
            </linearGradient>
          </defs>

          {/* Back silk ridge with luminous edge */}
          <path
            d="M0,78 C240,128 480,38 760,72 C1020,104 1240,12 1440,56 L1440,170 L0,170 Z"
            fill="url(#silkHighlight)"
            opacity="0.9"
          />
          {/* Secondary silk drape fold */}
          <path
            d="M0,104 C280,55 560,138 880,88 C1130,50 1300,98 1440,74 L1440,170 L0,170 Z"
            fill="url(#silkMid)"
            opacity="0.92"
          />
          {/* Foreground satin wave blending cleanly into #C8A2C8 */}
          <path
            d="M0,126 C320,158 640,94 980,130 C1190,152 1330,118 1440,126 L1440,170 L0,170 Z"
            fill="url(#silkToLilacBody)"
          />
        </svg>
      </div>
    </section>
  );
};
