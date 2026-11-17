/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WEDDING_CONFIG } from '../config/weddingConfig';
import { Heart } from 'lucide-react';

export const LoveStory: React.FC = () => {
  return (
    <section id="story" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16 sm:mb-20">
        <span className="text-xs uppercase tracking-[0.25em] text-[#3B0764] font-semibold">
          Our Journey Together
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif text-[#1F073A] font-bold mt-2 mb-4">
          Our Love Story
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#9A7314] to-transparent mx-auto mb-4" />
        <p className="max-w-xl mx-auto text-sm sm:text-base text-[#2E1065] font-sans font-medium leading-relaxed">
          From a serendipitous first greeting at FUTA to an eternal covenant, here are the chapters that led us to our royal beginning.
        </p>
      </div>

      {/* Alternating Timeline Layout */}
      <div className="relative">
        {/* Center Vertical Gold Cord (Desktop) */}
        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-gradient-to-b from-[#9A7314]/20 via-[#9A7314]/70 to-[#9A7314]/20" />

        <div className="space-y-16 sm:space-y-24">
          {WEDDING_CONFIG.loveStory.map((milestone, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={milestone.title}
                className={`relative flex flex-col md:flex-row items-center gap-8 lg:gap-12 ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Center Node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#240B47] border-2 border-[#D4AF37] items-center justify-center z-10 shadow-md shadow-[#240B47]/30">
                  <Heart className="w-3.5 h-3.5 text-[#F3E5AB] fill-[#D4AF37]/30" />
                </div>

                {/* Photo Column (or Royal Chapter Emblem if awaiting photo) */}
                <div className="w-full md:w-1/2">
                  {milestone.image ? (
                    <div className="relative group overflow-hidden rounded-2xl border-2 border-[#D4AF37]/55 shadow-xl shadow-[#240B47]/20">
                      <img
                        src={milestone.image}
                        alt={milestone.imageAlt}
                        className="w-full h-80 sm:h-96 md:h-[420px] object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#240B47]/85 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-4 text-xs font-serif text-[#F3E5AB] tracking-wide">
                        {milestone.year}
                      </div>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden rounded-2xl border-2 border-[#D4AF37]/55 shadow-xl shadow-[#240B47]/20 bg-gradient-to-br from-[#240B47] via-[#2D0E59] to-[#1A0733] h-56 sm:h-64 md:h-[320px] flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-12 h-12 rounded-full border border-[#D4AF37]/60 bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                        <Heart className="w-5 h-5 text-[#F3E5AB]" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                        Chapter {index + 1}
                      </span>
                      <div className="text-2xl sm:text-3xl font-serif text-[#F3E5AB] font-semibold mt-2">
                        {milestone.year}
                      </div>
                      <div className="w-12 h-px bg-[#D4AF37]/50 my-3" />
                      <span className="text-xs text-[#E4CEE4]/80 font-sans tracking-wide">
                        {WEDDING_CONFIG.couple.combinedShort}
                      </span>
                    </div>
                  )}
                </div>

                {/* Text Story Column (Soft Pearlescent Lilac Silk Panel) */}
                <div className={`w-full md:w-1/2 text-left ${isEven ? 'md:pl-6' : 'md:pr-6'}`}>
                  <div className="bg-[#F6E6F7]/45 backdrop-blur-sm border border-[#9A7314]/30 rounded-2xl p-6 sm:p-8 shadow-lg shadow-[#240B47]/10">
                    <div className="text-xs font-semibold uppercase tracking-widest text-[#5B21B6] mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#1F073A] font-bold mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#2E1065] font-sans leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
