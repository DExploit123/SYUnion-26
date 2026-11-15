/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WEDDING_CONFIG, ScheduleEvent } from '../config/weddingConfig';
import { MapPin, Clock, Calendar, ExternalLink, Download, Check } from 'lucide-react';

export const WeddingSchedule: React.FC = () => {
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (event: ScheduleEvent) => {
    // Format YYYYMMDDTHHMMSSZ
    const formatTime = (iso: string) => iso.replace(/[-:]/g, '') + 'Z';
    const start = formatTime(event.startTime);
    const end = formatTime(event.endTime);

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.calendarTitle,
      details: `${event.description}\n\nVenue: ${event.venue}\nAddress: ${event.address}`,
      location: `${event.venue}, ${event.address}`,
      dates: `${start}/${end}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Generate and download .ics iCalendar file for Apple Calendar / Outlook
  const downloadIcsFile = (event: ScheduleEvent) => {
    const formatIcsTime = (iso: string) => iso.replace(/[-:]/g, '') + 'Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Samuel and Yemisi Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}-${Date.now()}@samuelyemisiwedding.com`,
      `DTSTAMP:${formatIcsTime(new Date().toISOString().slice(0, 19))}`,
      `DTSTART:${formatIcsTime(event.startTime)}`,
      `DTEND:${formatIcsTime(event.endTime)}`,
      `SUMMARY:${event.calendarTitle}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.venue}, ${event.address}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.id}-invite.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccessId(event.id);
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  return (
    <section id="schedule" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16 sm:mb-20">
        <span className="text-xs uppercase tracking-[0.25em] text-[#3B0764] font-semibold">
          Order of the Day
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif text-[#1F073A] font-bold mt-2 mb-4">
          Wedding Schedule & Details
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#9A7314] to-transparent mx-auto mb-4" />
        <p className="max-w-xl mx-auto text-sm sm:text-base text-[#2E1065] font-sans font-medium leading-relaxed">
          {WEDDING_CONFIG.date.dayOfWeek}, {WEDDING_CONFIG.date.displayDate}
        </p>
      </div>

      {/* Schedule Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
        {WEDDING_CONFIG.schedule.map((event) => (
          <div
            key={event.id}
            className="group relative bg-[#240B47]/95 border-2 border-[#D4AF37]/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-[#240B47]/25 hover:border-[#D4AF37] transition-all duration-300"
          >
            {/* Top gold bar */}
            <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C8A2C8] uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>{event.time}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif text-[#F3E5AB] font-bold mb-4">
                {event.name}
              </h3>

              <div className="space-y-3 mb-6 text-sm text-[#FBF9F5]/90">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C8A2C8] mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">{event.venue}</p>
                    <p className="text-xs sm:text-sm text-[#FBF9F5]/75 mt-0.5">{event.address}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#FBF9F5]/80 font-sans leading-relaxed pt-2 border-t border-[#3B1C66]">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row gap-3">
              {/* Google Maps Button */}
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-lg border border-[#D4AF37]/60 text-[#F3E5AB] hover:bg-[#D4AF37]/15 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              {/* Add to Calendar (Google + iCal) */}
              <div className="flex-1 flex gap-2">
                <a
                  href={getGoogleCalendarUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-[#D4AF37] text-[#120826] hover:bg-[#F3E5AB] transition-colors"
                  title="Add to Google Calendar"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Google Cal</span>
                </a>

                <button
                  onClick={() => downloadIcsFile(event)}
                  className="inline-flex items-center justify-center px-3 py-2.5 text-xs sm:text-sm font-medium rounded-lg bg-[#180630] border border-[#D4AF37]/40 text-[#C8A2C8] hover:text-white hover:bg-[#2B1154] transition-colors cursor-pointer"
                  title="Download .ics event file (Apple / Outlook)"
                >
                  {downloadSuccessId === event.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dress Code Section */}
      <div className="relative bg-[#240B47]/95 border-2 border-[#D4AF37]/50 rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto text-center shadow-2xl shadow-[#240B47]/25 text-white">
        <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
          Celebration Attire
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif text-[#FBF9F5] font-bold mt-1 mb-2">
          Dress Code
        </h3>
        <p className="text-sm font-serif italic text-[#C8A2C8] mb-6 font-medium">
          {WEDDING_CONFIG.dressCode.theme} — {WEDDING_CONFIG.dressCode.coloursText}
        </p>

        {/* Color Palette Swatches */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
          {WEDDING_CONFIG.dressCode.swatches.map((swatch) => (
            <div key={swatch.name} className="flex flex-col items-center gap-1.5">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/30 shadow-md transition-transform hover:scale-110"
                style={{ backgroundColor: swatch.hex }}
                title={`${swatch.name} (${swatch.hex})`}
              />
              <span className="text-[11px] sm:text-xs text-[#FBF9F5]/90 font-sans font-medium">
                {swatch.name}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs sm:text-sm text-[#FBF9F5]/90 max-w-2xl mx-auto font-sans leading-relaxed">
          {WEDDING_CONFIG.dressCode.note}
        </p>
      </div>
    </section>
  );
};
