/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { WEDDING_CONFIG } from '../config/weddingConfig';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft());

  function calculateTimeLeft(): TimeLeft {
    const target = new Date(WEDDING_CONFIG.date.targetIso).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" className="relative py-16 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-[0.25em] text-[#3B0764] font-semibold">
          Counting Down to Forever
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif text-[#1F073A] font-bold mt-1">
          Until We Say &ldquo;I Do&rdquo;
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="group relative bg-[#240B47]/95 border-2 border-[#D4AF37]/55 hover:border-[#D4AF37] rounded-xl p-5 sm:p-7 text-center transition-all duration-300 shadow-xl shadow-[#240B47]/20 hover:shadow-[#D4AF37]/20"
          >
            {/* Top delicate gold corner accents */}
            <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#D4AF37]/60" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#D4AF37]/60" />
            <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#D4AF37]/60" />
            <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#D4AF37]/60" />

            <div className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#F3E5AB] tabular-nums tracking-tight">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs font-sans tracking-[0.2em] text-[#C8A2C8] mt-2 font-medium">
              {unit.label}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6 text-sm text-[#2E1065] italic font-serif font-medium">
        {WEDDING_CONFIG.couple.bibleVerse}
      </div>
    </section>
  );
};
