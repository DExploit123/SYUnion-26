/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WEDDING_CONFIG } from '../config/weddingConfig';
import { romanticAudio } from '../utils/romanticAudio';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    const nextState = romanticAudio.toggle();
    setIsAudioPlaying(nextState);
  };

  const hasGalleryPhotos =
    WEDDING_CONFIG.gallery.row1.length > 0 ||
    WEDDING_CONFIG.gallery.row2.length > 0 ||
    WEDDING_CONFIG.gallery.row3.length > 0;

  const navLinks = [
    { label: 'Story', href: '#story' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Registry', href: '#registry' },
    ...(hasGalleryPhotos ? [{ label: 'Gallery', href: '#gallery' }] : []),
    { label: 'RSVP', href: '#rsvp' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#DFBFDF]/90 backdrop-blur-md border-b border-[#9A7314]/35 shadow-md shadow-[#240B47]/10 py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="text-xl sm:text-2xl font-serif font-bold text-[#240B47] hover:text-[#5B21B6] transition-colors tracking-wide whitespace-nowrap shrink-0"
        >
          {WEDDING_CONFIG.couple.combinedShort}
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-sans font-medium text-[#240B47]/90">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#5B21B6] transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action & Audio Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Music Toggle */}
          <button
            onClick={toggleAudio}
            className={`w-10 h-10 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
              isAudioPlaying
                ? 'border-[#D4AF37] bg-[#240B47] text-[#F3E5AB] shadow-md shadow-[#D4AF37]/30 animate-pulse'
                : 'border-[#B88924]/45 bg-white/85 text-[#240B47] hover:bg-white shadow-sm'
            }`}
            title={isAudioPlaying ? 'Mute background music' : 'Play romantic background harp'}
            aria-label="Toggle background music"
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Primary RSVP CTA */}
          <a
            href="#rsvp"
            className="hidden sm:inline-flex items-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#240B47] text-[#F3E5AB] hover:bg-[#3B126D] transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            RSVP
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 cursor-pointer text-[#240B47] hover:text-[#5B21B6] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#EAD5EA]/96 backdrop-blur-md border-b border-[#9A7314]/35 px-6 py-5 space-y-4 shadow-xl">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#1F073A] hover:text-[#5B21B6] transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-[#9A7314]/25">
            <a
              href="#rsvp"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center text-sm font-semibold rounded-lg bg-[#240B47] text-[#F3E5AB]"
            >
              RSVP Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
