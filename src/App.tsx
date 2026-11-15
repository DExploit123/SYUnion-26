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
import { Users, Download, X, FileText } from 'lucide-react';
import { WEDDING_CONFIG } from './config/weddingConfig';

interface GuestSummaryRecord {
  id: string;
  fullName: string;
  contact: string;
  attending: 'yes' | 'no';
  guestCount: number;
  dietaryNotes?: string;
  message?: string;
  timestamp: string;
}

interface SentEmailRecord {
  id: string;
  rsvpId: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  sentAt: string;
  status: 'sent' | 'delivered';
  attending: 'yes' | 'no';
  guestCount: number;
}

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'guests' | 'emails'>('guests');
  const [guestList, setGuestList] = useState<GuestSummaryRecord[]>([]);
  const [sentEmailsList, setSentEmailsList] = useState<SentEmailRecord[]>([]);
  const [guestStats, setGuestStats] = useState({ total: 0, attending: 0 });

  // Load RSVP records and sent emails from server or localStorage
  const loadGuestList = async () => {
    try {
      const res = await fetch('/api/rsvp');
      if (res.ok) {
        const data = await res.json();
        setGuestList(data.records || []);
        setGuestStats({
          total: data.totalSubmissions || 0,
          attending: data.totalAttendingGuests || 0,
        });
      }

      // Fetch dispatched mock emails from server
      const emailRes = await fetch('/api/emails');
      if (emailRes.ok) {
        const emailData = await emailRes.json();
        setSentEmailsList(emailData.emails || []);
      }
    } catch {
      // Fallback to localStorage
      const localData: GuestSummaryRecord[] = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
      setGuestList(localData);
      const attendingTotal = localData
        .filter((r) => r.attending === 'yes')
        .reduce((sum, r) => sum + r.guestCount, 0);
      setGuestStats({
        total: localData.length,
        attending: attendingTotal,
      });

      const localEmails: SentEmailRecord[] = JSON.parse(localStorage.getItem('wedding_mock_emails') || '[]');
      setSentEmailsList(localEmails);
    }
  };

  useEffect(() => {
    loadGuestList();
  }, []);

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

        {/* 7. RSVP Form */}
        <RsvpForm />
      </main>

      {/* 8. Footer */}
      <Footer />

      {/* Discreet Couple Admin Access / Guest List Portal Toggle */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={() => {
            loadGuestList();
            setIsAdminOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#240B47]/95 border border-[#D4AF37]/60 text-[#F3E5AB] hover:bg-[#3B126D] hover:border-[#D4AF37] transition-all text-xs shadow-xl shadow-[#240B47]/30 backdrop-blur-md cursor-pointer"
          title="Couple's RSVP Summary & Guest List"
        >
          <Users className="w-3.5 h-3.5 text-[#C8B6FF]" />
          <span className="font-medium hidden sm:inline">Guest List</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#D4AF37]/20 text-[10px] text-[#F3E5AB] font-mono">
            {guestStats.attending} Attending
          </span>
        </button>
      </div>

      {/* Couple's Guest List Modal */}
      {isAdminOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0B0418]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsAdminOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[85vh] bg-[#1B0A33] border border-[#D4AF37]/50 rounded-2xl p-6 sm:p-8 flex flex-col shadow-2xl shadow-[#0B0418]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C8B6FF]">
                  Host Dashboard
                </span>
                <h3 className="text-2xl font-serif text-[#F3E5AB]">
                  RSVP & Guest List Summary
                </h3>
              </div>
              <button
                onClick={() => setIsAdminOpen(false)}
                className="p-2 rounded-lg text-[#FBF9F5]/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-xl bg-[#120826] border border-[#D4AF37]/20">
                <div className="text-xs text-[#C8B6FF]">Total Responses</div>
                <div className="text-2xl font-serif text-[#F3E5AB] mt-1 tabular-nums font-semibold">
                  {guestList.length}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#120826] border border-[#D4AF37]/20">
                <div className="text-xs text-[#C8B6FF]">Attending Guests</div>
                <div className="text-2xl font-serif text-emerald-400 mt-1 tabular-nums font-semibold">
                  {guestStats.attending}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-[#120826] border border-[#D4AF37]/20">
                <div className="text-xs text-[#C8B6FF]">Declined With Love</div>
                <div className="text-2xl font-serif text-[#FBF9F5]/60 mt-1 tabular-nums font-semibold">
                  {guestList.filter((g) => g.attending === 'no').length}
                </div>
              </div>
            </div>

            {/* Dashboard Tabs & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-1 p-1 bg-[#120826] border border-[#D4AF37]/30 rounded-xl">
                <button
                  onClick={() => setAdminTab('guests')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    adminTab === 'guests'
                      ? 'bg-[#D4AF37] text-[#120826] font-semibold shadow-sm'
                      : 'text-[#C8B6FF] hover:text-white'
                  }`}
                >
                  Guest List ({guestList.length})
                </button>
                <button
                  onClick={() => setAdminTab('emails')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    adminTab === 'emails'
                      ? 'bg-[#D4AF37] text-[#120826] font-semibold shadow-sm'
                      : 'text-[#C8B6FF] hover:text-white'
                  }`}
                >
                  Sent Confirmation Emails ({sentEmailsList.length})
                </button>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <a
                  href="/celebrant_customization_checklist.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4AF37]/40 text-[#F3E5AB] font-medium text-xs hover:bg-[#D4AF37]/15 transition-colors"
                  title="Printable / Downloadable PDF questionnaire for the celebrant"
                >
                  <FileText className="w-3.5 h-3.5 text-[#C8B6FF]" />
                  <span>Celebrant Questionnaire</span>
                </a>

                {adminTab === 'guests' && (
                  <a
                    href="/api/rsvp/export-csv"
                    download="samuel_yemisi_wedding_guests.csv"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#120826] font-semibold text-xs hover:bg-[#F3E5AB] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </a>
                )}
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto border border-[#3B1C66] rounded-xl">
              {adminTab === 'guests' ? (
                guestList.length === 0 ? (
                  <div className="py-12 text-center text-sm text-[#FBF9F5]/60">
                    No RSVP submissions recorded yet. Submissions from the RSVP form will appear here in real-time.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#120826] text-[#C8B6FF] sticky top-0 border-b border-[#3B1C66]">
                      <tr>
                        <th className="p-3">Guest Name</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Party Size</th>
                        <th className="p-3">Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2B1154]/50">
                      {guestList.map((guest) => (
                        <tr key={guest.id} className="hover:bg-[#251042]/50">
                          <td className="p-3 font-medium text-white">{guest.fullName}</td>
                          <td className="p-3 font-mono text-[#FBF9F5]/70">{guest.contact}</td>
                          <td className="p-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                                guest.attending === 'yes'
                                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/40'
                                  : 'bg-rose-950/80 text-rose-300 border border-rose-700/40'
                              }`}
                            >
                              {guest.attending === 'yes' ? 'Attending' : 'Declined'}
                            </span>
                          </td>
                          <td className="p-3 text-center tabular-nums font-semibold text-[#F3E5AB]">
                            {guest.attending === 'yes' ? guest.guestCount : '—'}
                          </td>
                          <td className="p-3 text-[#FBF9F5]/80 italic max-w-xs truncate">
                            {guest.message || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              ) : sentEmailsList.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#FBF9F5]/60">
                  No confirmation emails sent yet. Dispatched confirmation emails will be tracked here.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#120826] text-[#C8B6FF] sticky top-0 border-b border-[#3B1C66]">
                    <tr>
                      <th className="p-3">Recipient</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Sent Timestamp</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2B1154]/50">
                    {sentEmailsList.map((email) => (
                      <tr key={email.id} className="hover:bg-[#251042]/50">
                        <td className="p-3 font-medium text-white">{email.recipientName}</td>
                        <td className="p-3 font-mono text-[#FBF9F5]/70">{email.recipientEmail}</td>
                        <td className="p-3 text-[#F3E5AB] truncate max-w-xs">{email.subject}</td>
                        <td className="p-3 text-[#C8B6FF] font-mono text-[11px]">
                          {new Date(email.sentAt).toLocaleString()}
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-600/40 uppercase">
                            {email.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
