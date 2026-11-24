/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Lock,
  Unlock,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  RefreshCw,
  Trash2,
  MessageSquareHeart,
  Mail,
  X,
  Eye,
  EyeOff,
  ArrowLeft,
  CalendarClock,
} from 'lucide-react';

export interface GuestSummaryRecord {
  id: string;
  fullName: string;
  contact: string;
  attending: 'yes' | 'no';
  guestCount: number;
  message?: string;
  timestamp: string;
}

export interface SentEmailRecord {
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

interface CoupleDashboardProps {
  isOpen: boolean;
  isStandalonePage?: boolean;
  onClose: () => void;
}

const SESSION_KEY = 'syunion_couple_passcode';

export const CoupleDashboard: React.FC<CoupleDashboardProps> = ({
  isOpen,
  isStandalonePage = false,
  onClose,
}) => {
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [activePasscode, setActivePasscode] = useState<string>(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) || '';
    } catch {
      return '';
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'guests' | 'wishes' | 'emails'>('guests');
  const [filterMode, setFilterMode] = useState<'all' | 'yes' | 'no' | 'wishes'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [guestList, setGuestList] = useState<GuestSummaryRecord[]>([]);
  const [sentEmailsList, setSentEmailsList] = useState<SentEmailRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchResponses = useCallback(async (code: string) => {
    if (!code) return false;
    setIsLoadingData(true);
    try {
      const headers = { 'x-couple-passcode': code };
      const [rsvpRes, emailRes] = await Promise.all([
        fetch('/api/rsvp', { headers }),
        fetch('/api/emails', { headers }),
      ]);

      if (rsvpRes.status === 401) {
        setIsAuthenticated(false);
        setActivePasscode('');
        try {
          sessionStorage.removeItem(SESSION_KEY);
        } catch {
          // ignore
        }
        return false;
      }

      if (rsvpRes.ok) {
        const data = await rsvpRes.json();
        setGuestList(data.records || []);
        setIsAuthenticated(true);
      }

      if (emailRes.ok) {
        const emailData = await emailRes.json();
        setSentEmailsList(emailData.emails || []);
      }

      return true;
    } catch {
      // Offline / static fallback if server is unreachable
      try {
        const localData: GuestSummaryRecord[] = JSON.parse(
          localStorage.getItem('wedding_rsvps') || '[]'
        );
        const localEmails: SentEmailRecord[] = JSON.parse(
          localStorage.getItem('wedding_mock_emails') || '[]'
        );
        setGuestList(localData);
        setSentEmailsList(localEmails);
      } catch {
        setGuestList([]);
      }
      return true;
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (activePasscode) {
      fetchResponses(activePasscode);
    }
  }, [isOpen, activePasscode, fetchResponses]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = passcodeInput.trim();
    if (!trimmed) {
      setAuthError('Please enter your couple passcode.');
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/couple/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: trimmed }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setAuthError(errData.error || 'Incorrect passcode. Please try again.');
        setIsVerifying(false);
        return;
      }

      try {
        sessionStorage.setItem(SESSION_KEY, trimmed);
      } catch {
        // ignore
      }
      setActivePasscode(trimmed);
      setPasscodeInput('');
      setIsAuthenticated(true);
      await fetchResponses(trimmed);
    } catch {
      setAuthError('Unable to reach server. Please check your connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLock = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    setActivePasscode('');
    setIsAuthenticated(false);
    setGuestList([]);
    setSentEmailsList([]);
    setAuthError(null);
  };

  const handleDeleteRecord = async (id: string) => {
    if (!activePasscode) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/rsvp/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'x-couple-passcode': activePasscode },
      });
      if (res.ok) {
        setGuestList((prev) => prev.filter((item) => item.id !== id));
        setSentEmailsList((prev) => prev.filter((item) => item.rsvpId !== id));
      }
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Full Name',
      'Contact',
      'Attending',
      'Party Size',
      'Blessing / Message',
      'Submitted At',
    ];
    const rows = guestList.map((r) => [
      `"${r.id}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.contact.replace(/"/g, '""')}"`,
      `"${r.attending === 'yes' ? 'Attending' : 'Declined'}"`,
      `"${r.attending === 'yes' ? r.guestCount : 0}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${r.timestamp}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wedding_rsvps_oluwasegun_yemisi.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const attendingRecords = guestList.filter((r) => r.attending === 'yes');
    const declinedRecords = guestList.filter((r) => r.attending === 'no');
    const attendingGuests = attendingRecords.reduce((sum, r) => sum + (Number(r.guestCount) || 1), 0);
    const wishesCount = guestList.filter((r) => r.message && r.message.trim().length > 0).length;
    return {
      totalResponses: guestList.length,
      attendingResponses: attendingRecords.length,
      attendingGuests,
      declinedCount: declinedRecords.length,
      wishesCount,
    };
  }, [guestList]);

  const filteredGuests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return guestList.filter((guest) => {
      if (filterMode === 'yes' && guest.attending !== 'yes') return false;
      if (filterMode === 'no' && guest.attending !== 'no') return false;
      if (filterMode === 'wishes' && !(guest.message && guest.message.trim())) return false;

      if (!query) return true;
      return (
        guest.fullName.toLowerCase().includes(query) ||
        guest.contact.toLowerCase().includes(query) ||
        (guest.message || '').toLowerCase().includes(query)
      );
    });
  }, [guestList, filterMode, searchQuery]);

  const wishesList = useMemo(
    () => guestList.filter((g) => g.message && g.message.trim().length > 0),
    [guestList]
  );

  if (!isOpen) return null;

  return (
    <div
      className={
        isStandalonePage
          ? 'min-h-screen w-full bg-[#140729] text-[#FBF9F5] p-4 sm:p-8 flex flex-col'
          : 'fixed inset-0 z-50 bg-[#0B0418]/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6'
      }
      onClick={!isStandalonePage ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Couple RSVP Response Portal"
    >
      <div
        className={
          isStandalonePage
            ? 'w-full max-w-6xl mx-auto flex-1 bg-[#1B0A33] border border-[#D4AF37]/45 rounded-3xl p-5 sm:p-8 flex flex-col shadow-2xl shadow-black/50'
            : 'relative w-full max-w-5xl max-h-[90vh] bg-[#1B0A33] border border-[#D4AF37]/50 rounded-3xl p-5 sm:p-8 flex flex-col shadow-2xl shadow-[#0B0418]'
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/30">
          <div>
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#C8B6FF] font-semibold">
              Private Couple Portal
            </span>
            <h2 className="text-xl sm:text-3xl font-serif text-[#F3E5AB] font-bold">
              Oluwasegun &amp; Yemisi — Guest Responses
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  type="button"
                  onClick={() => fetchResponses(activePasscode)}
                  disabled={isLoadingData}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D4AF37]/35 bg-[#120826] text-xs font-medium text-[#F3E5AB] hover:border-[#D4AF37] transition-colors cursor-pointer disabled:opacity-50"
                  title="Refresh responses"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={handleLock}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#C8B6FF]/30 bg-[#120826] text-xs font-medium text-[#C8B6FF] hover:text-white hover:border-[#C8B6FF]/60 transition-colors cursor-pointer"
                  title="Lock Couple Portal"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lock</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[#FBF9F5]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Return to wedding website"
            >
              {isStandalonePage ? (
                <>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Wedding Site</span>
                </>
              ) : (
                <X className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Gate vs Dashboard */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center py-10 sm:py-16">
            <form
              onSubmit={handleLoginSubmit}
              className="w-full max-w-md bg-[#120826]/95 border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#240B47] border border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#F3E5AB]">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif text-[#F3E5AB] font-semibold">
                  Couple Access Required
                </h3>
                <p className="text-xs sm:text-sm text-[#C8B6FF]/85 leading-relaxed">
                  Enter your private passcode to view guest RSVPs, party sizes, and wedding wishes.
                </p>
              </div>

              <div>
                <label
                  htmlFor="couple-passcode-input"
                  className="block text-xs font-medium text-[#F3E5AB] mb-1.5"
                >
                  Passcode
                </label>
                <div className="relative">
                  <input
                    id="couple-passcode-input"
                    type={showPasscode ? 'text' : 'password'}
                    value={passcodeInput}
                    onChange={(e) => {
                      setPasscodeInput(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Enter couple passcode"
                    autoFocus
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-[#1B0A33] border border-[#D4AF37]/40 text-sm text-white placeholder:text-[#C8B6FF]/40 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C8B6FF]/70 hover:text-[#F3E5AB] cursor-pointer"
                    aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {authError && (
                  <p className="mt-2 text-xs text-rose-300 font-medium">{authError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#120826] font-semibold text-sm hover:brightness-105 transition-all shadow-lg cursor-pointer disabled:opacity-60"
              >
                <Unlock className="w-4 h-4" />
                <span>{isVerifying ? 'Verifying...' : 'Unlock Guest Responses'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 pt-5">
            {/* Summary Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#120826] border border-[#D4AF37]/25">
                <div className="flex items-center justify-between text-xs text-[#C8B6FF]">
                  <span>Total Responses</span>
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-serif text-[#F3E5AB] mt-1 tabular-nums font-bold">
                  {stats.totalResponses}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#120826] border border-emerald-500/30">
                <div className="flex items-center justify-between text-xs text-emerald-300">
                  <span>Confirmed Guests</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-serif text-emerald-400 mt-1 tabular-nums font-bold">
                  {stats.attendingGuests}
                  <span className="text-xs font-sans font-normal text-[#C8B6FF] ml-1.5">
                    ({stats.attendingResponses} RSVPs)
                  </span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#120826] border border-rose-500/25">
                <div className="flex items-center justify-between text-xs text-rose-200">
                  <span>Declined With Love</span>
                  <XCircle className="w-4 h-4 text-rose-300" />
                </div>
                <div className="text-2xl font-serif text-rose-200 mt-1 tabular-nums font-bold">
                  {stats.declinedCount}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#120826] border border-[#D4AF37]/25">
                <div className="flex items-center justify-between text-xs text-[#C8B6FF]">
                  <span>Wishes &amp; Prayers</span>
                  <MessageSquareHeart className="w-4 h-4 text-[#F3E5AB]" />
                </div>
                <div className="text-2xl font-serif text-[#F3E5AB] mt-1 tabular-nums font-bold">
                  {stats.wishesCount}
                </div>
              </div>
            </div>

            {/* Tabs & Export Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-1 p-1 bg-[#120826] border border-[#D4AF37]/30 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('guests')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'guests'
                      ? 'bg-[#D4AF37] text-[#120826] font-semibold'
                      : 'text-[#C8B6FF] hover:text-white'
                  }`}
                >
                  Guest List ({guestList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('wishes')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'wishes'
                      ? 'bg-[#D4AF37] text-[#120826] font-semibold'
                      : 'text-[#C8B6FF] hover:text-white'
                  }`}
                >
                  <MessageSquareHeart className="w-3.5 h-3.5" />
                  <span>Wishes ({stats.wishesCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('emails')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'emails'
                      ? 'bg-[#D4AF37] text-[#120826] font-semibold'
                      : 'text-[#C8B6FF] hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Emails ({sentEmailsList.length})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleExportCsv}
                disabled={guestList.length === 0}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D4AF37] text-[#120826] font-semibold text-xs hover:bg-[#F3E5AB] transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Guest List (CSV)</span>
              </button>
            </div>

            {/* Search & Filter Row for Guest List */}
            {activeTab === 'guests' && (
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#C8B6FF]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, phone, or message..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#120826] border border-[#3B1C66] text-xs sm:text-sm text-white placeholder:text-[#C8B6FF]/45 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { key: 'all', label: 'All' },
                      { key: 'yes', label: 'Attending' },
                      { key: 'no', label: 'Declined' },
                      { key: 'wishes', label: 'With Wishes' },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setFilterMode(f.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        filterMode === f.key
                          ? 'bg-[#2B1154] border-[#D4AF37] text-[#F3E5AB]'
                          : 'bg-[#120826] border-[#3B1C66] text-[#C8B6FF]/80 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto border border-[#3B1C66] rounded-2xl bg-[#120826]/70">
              {activeTab === 'guests' ? (
                filteredGuests.length === 0 ? (
                  <div className="py-14 px-4 text-center text-sm text-[#FBF9F5]/65">
                    {guestList.length === 0
                      ? 'No RSVP submissions recorded yet. As guests respond on the website, their answers will appear here.'
                      : 'No guest responses match your current search or filter.'}
                  </div>
                ) : (
                  <div className="divide-y divide-[#2B1154]/80">
                    {filteredGuests.map((guest) => (
                      <div
                        key={guest.id}
                        className="p-4 sm:p-5 hover:bg-[#1E0C3A]/70 transition-colors flex flex-col gap-2.5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-base font-serif font-bold text-white">
                                {guest.fullName}
                              </h4>
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                  guest.attending === 'yes'
                                    ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-600/40'
                                    : 'bg-rose-950/90 text-rose-300 border border-rose-600/40'
                                }`}
                              >
                                {guest.attending === 'yes'
                                  ? `Attending · ${guest.guestCount} ${
                                      guest.guestCount === 1 ? 'Guest' : 'Guests'
                                    }`
                                  : 'Declined With Love'}
                              </span>
                            </div>
                            <p className="text-xs font-mono text-[#C8B6FF] mt-1 break-all">
                              {guest.contact}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] text-[#C8B6FF]/75 font-mono">
                              <CalendarClock className="w-3 h-3" />
                              {new Date(guest.timestamp).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>

                            {confirmDeleteId === guest.id ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRecord(guest.id)}
                                  disabled={deletingId === guest.id}
                                  className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                                >
                                  {deletingId === guest.id ? 'Removing...' : 'Confirm'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2 py-1 rounded bg-[#2B1154] text-[#C8B6FF] text-[11px] cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(guest.id)}
                                className="p-1.5 rounded-lg text-[#C8B6FF]/60 hover:text-rose-300 hover:bg-rose-950/50 transition-colors cursor-pointer"
                                title="Remove RSVP entry"
                                aria-label={`Remove RSVP from ${guest.fullName}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {guest.message && (
                          <div className="pt-1">
                            <div className="px-3 py-2 rounded-xl bg-[#180730] border border-[#3B1C66] text-xs">
                              <span className="text-[#C8B6FF] font-semibold block mb-0.5">
                                Blessing / Message:
                              </span>
                              <span className="text-[#FBF9F5]/90 italic">
                                &ldquo;{guest.message}&rdquo;
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              ) : activeTab === 'wishes' ? (
                wishesList.length === 0 ? (
                  <div className="py-14 px-4 text-center text-sm text-[#FBF9F5]/65">
                    No wedding wishes or prayer notes submitted yet.
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishesList.map((item) => (
                      <div
                        key={`wish-${item.id}`}
                        className="p-4 rounded-2xl bg-[#1B0A33] border border-[#D4AF37]/35 flex flex-col justify-between gap-3"
                      >
                        <p className="text-sm font-serif italic text-[#FBF9F5]/95 leading-relaxed">
                          &ldquo;{item.message}&rdquo;
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-[#3B1C66] text-xs">
                          <span className="font-semibold text-[#F3E5AB]">{item.fullName}</span>
                          <span className="text-[#C8B6FF]/80">
                            {item.attending === 'yes' ? 'Attending' : 'Sending Love'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : sentEmailsList.length === 0 ? (
                <div className="py-14 px-4 text-center text-sm text-[#FBF9F5]/65">
                  No confirmation emails logged yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
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
                    <tbody className="divide-y divide-[#2B1154]/60">
                      {sentEmailsList.map((email) => (
                        <tr key={email.id} className="hover:bg-[#1E0C3A]/60">
                          <td className="p-3 font-medium text-white">{email.recipientName}</td>
                          <td className="p-3 font-mono text-[#FBF9F5]/75">{email.recipientEmail}</td>
                          <td className="p-3 text-[#F3E5AB] max-w-xs truncate">{email.subject}</td>
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
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
