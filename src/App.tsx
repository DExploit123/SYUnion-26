/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { LoveStory } from './components/LoveStory';
import { WeddingSchedule } from './components/WeddingSchedule';
import { Registry } from './components/Registry';
import { MarqueeGallery } from './components/MarqueeGallery';
import { RsvpForm } from './components/RsvpForm';
import { Footer } from './components/Footer';
import { CoupleDashboard } from './components/CoupleDashboard';

const checkCoupleUrl = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  return (
    path === '/couple' ||
    path === '/couple/' ||
    hash === '#couple' ||
    params.get('couple') === '1'
  );
};

export default function App() {
  const [isCoupleRoute, setIsCoupleRoute] = useState<boolean>(checkCoupleUrl);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);

  useEffect(() => {
    const syncFromUrl = () => {
      setIsCoupleRoute(checkCoupleUrl());
    };
    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('hashchange', syncFromUrl);
    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('hashchange', syncFromUrl);
    };
  }, []);

  const handleCloseCouplePortal = () => {
    setIsPortalModalOpen(false);
    if (isCoupleRoute) {
      window.history.pushState({}, '', '/');
      setIsCoupleRoute(false);
    }
  };

  if (isCoupleRoute) {
    return (
      <CoupleDashboard
        isOpen={true}
        isStandalonePage={true}
        onClose={handleCloseCouplePortal}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#C8A2C8] text-[#1F073A] selection:bg-[#240B47]/20 selection:text-[#1F073A]">
      {/* Subtle Fixed Luminous Lilac Silk Sheen Layer */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 55% at 20% 25%, rgba(246, 226, 248, 0.42) 0%, transparent 65%), radial-gradient(ellipse 75% 55% at 82% 70%, rgba(122, 75, 133, 0.34) 0%, transparent 65%), radial-gradient(ellipse 90% 60% at 50% 50%, rgba(235, 206, 238, 0.28) 0%, transparent 72%)',
        }}
        aria-hidden="true"
      />

      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Hero with 3D Interlocking Rings */}
      <main className="relative z-10">
        <Hero />

        {/* 3. Live Countdown */}
        <Countdown />

        {/* 4. Our Love Story */}
        <LoveStory />

        {/* 5. Wedding Details & Schedule */}
        <WeddingSchedule />

        {/* 6. Gift Registry & Cash Blessings */}
        <Registry />

        {/* 7. Photo Gallery (3-Row Marquee) */}
        <MarqueeGallery />

        {/* 8. RSVP Form */}
        <RsvpForm />
      </main>

      {/* 9. Footer with discreet Couple Portal access */}
      <Footer onOpenCouplePortal={() => setIsPortalModalOpen(true)} />

      {/* Private Passcode-Protected Couple RSVP Portal */}
      <CoupleDashboard
        isOpen={isPortalModalOpen}
        isStandalonePage={false}
        onClose={handleCloseCouplePortal}
      />
    </div>
  );
}
