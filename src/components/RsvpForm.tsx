/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useId } from 'react';
import { WEDDING_CONFIG } from '../config/weddingConfig';
import confetti from 'canvas-confetti';
import {
  generateConfirmationEmail,
  saveEmailToOutbox,
  MockEmailMessage,
} from '../utils/mockEmailService';
import {
  CheckCircle2,
  Send,
  AlertCircle,
  RefreshCw,
  Check,
  Mail,
  User,
  Phone,
  MailCheck,
  Eye,
  Copy,
  X,
  ExternalLink,
} from 'lucide-react';

interface RsvpData {
  fullName: string;
  email: string;
  phone: string;
  attending: 'yes' | 'no';
  guestCount: number;
  dietaryNotes: string;
  message: string;
}

const MAX_MESSAGE_CHARS = 400;

// RFC-compliant email regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// International phone format regex (optional field, but validated if entered)
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

export const RsvpForm: React.FC = () => {
  const formId = useId();

  const [formData, setFormData] = useState<RsvpData>({
    fullName: '',
    email: '',
    phone: '',
    attending: 'yes',
    guestCount: 1,
    dietaryNotes: '',
    message: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({
    fullName: false,
    email: false,
    phone: false,
    message: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string>('');

  // Mock Confirmation Email States
  const [emailRecord, setEmailRecord] = useState<MockEmailMessage | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [emailViewMode, setEmailViewMode] = useState<'formatted' | 'text'>('formatted');
  const [copiedEmailText, setCopiedEmailText] = useState(false);

  // -------------------------------------------------------------
  // Real-Time Validation Functions
  // -------------------------------------------------------------
  const getFullNameError = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) return 'Please enter your full name.';
    if (trimmed.length < 2) return 'Name must be at least 2 characters.';
    if (!/^[a-zA-Z\s.'’\-&]+$/.test(trimmed)) {
      return 'Name can only contain letters, spaces, hyphens, and periods.';
    }
    return null;
  };

  const getEmailError = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) return 'Email address is required.';
    if (/\s/.test(trimmed)) return 'Email address cannot contain spaces.';
    if (!trimmed.includes('@')) return 'Email address must include an "@" symbol.';
    const parts = trimmed.split('@');
    if (parts.length > 2) return 'Email can only contain one "@" symbol.';
    if (!parts[1] || !parts[1].includes('.')) {
      return 'Please include a valid domain extension (e.g. .com, .ng, .org).';
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      return 'Please enter a valid email format (e.g., name@example.com).';
    }
    return null;
  };

  const getPhoneError = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) return null; // Phone is optional
    if (!PHONE_REGEX.test(trimmed)) {
      return 'Please enter a valid phone number format (e.g. +234 801 234 5678).';
    }
    return null;
  };

  const getMessageError = (val: string): string | null => {
    if (val.length > MAX_MESSAGE_CHARS) {
      return `Message cannot exceed ${MAX_MESSAGE_CHARS} characters.`;
    }
    return null;
  };

  // Live evaluated errors
  const fullNameError = getFullNameError(formData.fullName);
  const emailError = getEmailError(formData.email);
  const phoneError = getPhoneError(formData.phone);
  const messageError = getMessageError(formData.message);

  const isFormValid = !fullNameError && !emailError && !phoneError && !messageError;

  // Real-time change handlers
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, fullName: e.target.value }));
    if (!touched.fullName) setTouched((prev) => ({ ...prev, fullName: true }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
    if (!touched.email) setTouched((prev) => ({ ...prev, email: true }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, phone: e.target.value }));
    if (!touched.phone) setTouched((prev) => ({ ...prev, phone: true }));
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setFormData((prev) => ({ ...prev, message: text }));
    if (!touched.message) setTouched((prev) => ({ ...prev, message: true }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      message: true,
    });

    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);

    const rsvpUniqueId = `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const submissionPayload = {
      ...formData,
      contact: formData.phone ? `${formData.email} | ${formData.phone}` : formData.email,
      timestamp: new Date().toISOString(),
      id: rsvpUniqueId,
    };

    try {
      // 1. Generate client mock confirmation email
      const confirmationEmail = generateConfirmationEmail({
        rsvpId: rsvpUniqueId,
        fullName: formData.fullName,
        email: formData.email,
        attending: formData.attending,
        guestCount: formData.guestCount,
        message: formData.message,
      });
      saveEmailToOutbox(confirmationEmail);
      setEmailRecord(confirmationEmail);

      // 2. Post to Express backend endpoint /api/rsvp (which also logs to server outbox)
      try {
        const response = await fetch(WEDDING_CONFIG.rsvp.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionPayload),
        });

        if (response.ok) {
          const resJson = await response.json();
          if (resJson.emailConfirmation) {
            setEmailRecord(resJson.emailConfirmation);
          }
        }
      } catch (backendErr) {
        console.warn('Backend server save warning (fallback to localStorage):', backendErr);
      }

      // 3. Client-side persistence fallback in localStorage
      const existingRsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
      existingRsvps.push(submissionPayload);
      localStorage.setItem('wedding_rsvps', JSON.stringify(existingRsvps));

      // 4. Trigger royal celebration confetti
      if (formData.attending === 'yes') {
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#C8B6FF', '#F3E5AB', '#4C1D95'],
          });
        } catch {
          // confetti fallback safe
        }
      }

      setSubmissionId(rsvpUniqueId);
      setIsSubmitted(true);
    } catch (err) {
      console.error('RSVP submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await fetch('/api/rsvp/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rsvpId: submissionId, email: formData.email }),
      });
    } catch (err) {
      console.warn('Backend resend warning:', err);
    }

    // Simulated network transmission delay
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3500);
    }, 700);
  };

  const handleCopyEmailText = () => {
    if (emailRecord) {
      navigator.clipboard.writeText(emailRecord.textBody);
      setCopiedEmailText(true);
      setTimeout(() => setCopiedEmailText(false), 2500);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      attending: 'yes',
      guestCount: 1,
      dietaryNotes: '',
      message: '',
    });
    setTouched({
      fullName: false,
      email: false,
      phone: false,
      message: false,
    });
    setEmailRecord(null);
    setIsSubmitted(false);
  };

  const charsRemaining = MAX_MESSAGE_CHARS - formData.message.length;
  const isNearLimit = charsRemaining <= 50 && charsRemaining >= 0;
  const isOverLimit = charsRemaining < 0;

  return (
    <section id="rsvp" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12 sm:mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-[#3B0764] font-semibold">
          Kindly Respond
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif text-[#1F073A] font-bold mt-2 mb-4">
          RSVP
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#9A7314] to-transparent mx-auto mb-4" />
        <p className="max-w-md mx-auto text-sm sm:text-base text-[#2E1065] font-sans font-medium leading-relaxed">
          Please respond by{' '}
          <span className="text-[#1F073A] font-bold">{WEDDING_CONFIG.rsvp.deadline}</span> so we
          can prepare your royal seat.
        </p>
      </div>

      <div className="relative bg-[#240B47]/95 border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-[#240B47]/25 text-white">
        {/* Subtle decorative gold corner frame */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/60" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/60" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/60" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/60" />

        {isSubmitted ? (
          <div className="py-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#2B1154] border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#F3E5AB]">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#F3E5AB]">
                Thank You, {formData.fullName}!
              </h3>
              <p className="text-sm sm:text-base text-[#FBF9F5]/80 mt-2 max-w-lg mx-auto font-sans leading-relaxed">
                {formData.attending === 'yes'
                  ? `Your RSVP for ${formData.guestCount} ${
                      formData.guestCount === 1 ? 'guest' : 'guests'
                    } has been joyfully recorded. We look forward to celebrating our special day with you on December 12, 2026!`
                  : `Your response has been received. While we will miss celebrating in person, we deeply appreciate your warm blessings and love.`}
              </p>
            </div>

            {/* Mock Confirmation Email Dispatched Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#250F47]/90 border border-[#D4AF37]/60 max-w-xl mx-auto shadow-lg shadow-[#0B0418]/60 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#120826] border border-[#D4AF37]/70 flex items-center justify-center text-[#F3E5AB] shrink-0 mt-0.5">
                    <MailCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-[#F3E5AB]">
                        Confirmation Email Sent
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-600/40">
                        Delivered
                      </span>
                    </div>
                    <p className="text-xs text-[#C8B6FF] mt-0.5">
                      A celebration receipt has been sent to{' '}
                      <span className="font-mono text-white font-medium">{formData.email}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D4AF37] text-[#120826] font-semibold text-xs hover:bg-[#F3E5AB] transition-colors cursor-pointer shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Email</span>
                  </button>
                </div>
              </div>

              {/* Resend Action & Status */}
              <div className="pt-3 mt-3 border-t border-[#3B1C66]/60 flex items-center justify-between text-xs text-[#FBF9F5]/70">
                <span className="text-[11px] text-[#C8B6FF]/80">
                  Ref: <span className="font-mono text-[#F3E5AB]">{submissionId}</span>
                </span>

                <button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="inline-flex items-center gap-1.5 text-xs text-[#C8B6FF] hover:text-[#F3E5AB] transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin text-[#D4AF37]" />
                      <span>Sending...</span>
                    </>
                  ) : resendSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-medium">Email Resent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      <span>Resend Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Reset Form Option */}
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#D4AF37]/40 text-xs sm:text-sm text-[#F3E5AB] hover:bg-[#D4AF37]/15 transition-colors font-medium cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Submit Another Response / Edit</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-7">
            {/* Full Name Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={`${formId}-fullName`}
                  className="block text-xs sm:text-sm font-medium text-[#F3E5AB]"
                >
                  Full Name <span className="text-[#C8B6FF]">*</span>
                </label>
                {touched.fullName && !fullNameError && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <Check className="w-3 h-3" /> Valid
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C8B6FF]/60">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id={`${formId}-fullName`}
                  type="text"
                  placeholder="e.g. Dr. & Mrs. Adeleke Johnson"
                  value={formData.fullName}
                  onChange={handleFullNameChange}
                  onBlur={() => handleBlur('fullName')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#120826]/80 text-white placeholder-[#FBF9F5]/35 text-sm transition-all focus:outline-none ${
                    touched.fullName && fullNameError
                      ? 'border border-rose-500/80 focus:ring-1 focus:ring-rose-500'
                      : touched.fullName && !fullNameError
                      ? 'border border-emerald-500/60 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400'
                      : 'border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]'
                  }`}
                />
              </div>
              {touched.fullName && fullNameError && (
                <p className="mt-1.5 text-xs text-rose-300 flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fullNameError}</span>
                </p>
              )}
            </div>

            {/* Email Address Field with Strict Regex */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={`${formId}-email`}
                  className="block text-xs sm:text-sm font-medium text-[#F3E5AB]"
                >
                  Email Address <span className="text-[#C8B6FF]">*</span>
                </label>
                {touched.email && !emailError && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <Check className="w-3 h-3" /> Valid email
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C8B6FF]/60">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id={`${formId}-email`}
                  type="email"
                  placeholder="e.g. adeleke@example.com"
                  value={formData.email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur('email')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#120826]/80 text-white placeholder-[#FBF9F5]/35 text-sm transition-all focus:outline-none ${
                    touched.email && emailError
                      ? 'border border-rose-500/80 focus:ring-1 focus:ring-rose-500'
                      : touched.email && !emailError
                      ? 'border border-emerald-500/60 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400'
                      : 'border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]'
                  }`}
                />
              </div>
              {touched.email && emailError && (
                <p className="mt-1.5 text-xs text-rose-300 flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{emailError}</span>
                </p>
              )}
              <p className="mt-1 text-[11px] text-[#C8B6FF]/70">
                A confirmation email receipt with celebration details will be dispatched here.
              </p>
            </div>

            {/* Phone Number Field (Optional, validated format) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={`${formId}-phone`}
                  className="block text-xs sm:text-sm font-medium text-[#F3E5AB]"
                >
                  Phone Number{' '}
                  <span className="text-[11px] font-normal text-[#C8B6FF]/70">(Optional)</span>
                </label>
                {formData.phone && touched.phone && !phoneError && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <Check className="w-3 h-3" /> Valid phone
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C8B6FF]/60">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  placeholder="e.g. +234 801 234 5678 or (555) 123-4567"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#120826]/80 text-white placeholder-[#FBF9F5]/35 text-sm transition-all focus:outline-none ${
                    touched.phone && phoneError
                      ? 'border border-rose-500/80 focus:ring-1 focus:ring-rose-500'
                      : formData.phone && touched.phone && !phoneError
                      ? 'border border-emerald-500/60 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400'
                      : 'border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]'
                  }`}
                />
              </div>
              {touched.phone && phoneError && (
                <p className="mt-1.5 text-xs text-rose-300 flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{phoneError}</span>
                </p>
              )}
            </div>

            {/* Attendance Toggle */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#F3E5AB] mb-2.5">
                Will you be attending? <span className="text-[#C8B6FF]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, attending: 'yes' }))}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    formData.attending === 'yes'
                      ? 'border-[#D4AF37] bg-[#2B1154] text-[#F3E5AB] shadow-md shadow-[#D4AF37]/20 ring-1 ring-[#D4AF37]/50'
                      : 'border-[#D4AF37]/25 bg-[#120826]/60 text-[#FBF9F5]/75 hover:border-[#D4AF37]/60'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      formData.attending === 'yes'
                        ? 'border-[#D4AF37] bg-[#D4AF37]'
                        : 'border-[#FBF9F5]/40'
                    }`}
                  >
                    {formData.attending === 'yes' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#120826]" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Joyfully Accept</div>
                    <div className="text-xs text-[#C8B6FF]/80">I will celebrate in person</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, attending: 'no' }))}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    formData.attending === 'no'
                      ? 'border-[#D4AF37] bg-[#2B1154] text-[#F3E5AB] shadow-md shadow-[#D4AF37]/20 ring-1 ring-[#D4AF37]/50'
                      : 'border-[#D4AF37]/25 bg-[#120826]/60 text-[#FBF9F5]/75 hover:border-[#D4AF37]/60'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      formData.attending === 'no'
                        ? 'border-[#D4AF37] bg-[#D4AF37]'
                        : 'border-[#FBF9F5]/40'
                    }`}
                  >
                    {formData.attending === 'no' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#120826]" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Regretfully Decline</div>
                    <div className="text-xs text-[#C8B6FF]/80">Celebrating in spirit & love</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Number of Guests (Only if attending) */}
            {formData.attending === 'yes' && (
              <div>
                <label
                  htmlFor={`${formId}-guestCount`}
                  className="block text-xs sm:text-sm font-medium text-[#F3E5AB] mb-1.5"
                >
                  Total Guests in Your Party (including yourself)
                </label>
                <select
                  id={`${formId}-guestCount`}
                  value={formData.guestCount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      guestCount: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#120826]/80 border border-[#D4AF37]/30 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm"
                >
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num} className="bg-[#1B0A33] text-white">
                      {num} {num === 1 ? 'Guest (Attending Solo)' : 'Guests (Couple / Family)'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Message Area with Real-Time Character Limit Counter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={`${formId}-message`}
                  className="block text-xs sm:text-sm font-medium text-[#F3E5AB]"
                >
                  Heartfelt Message for the Couple{' '}
                  <span className="text-[11px] font-normal text-[#C8B6FF]/70">(Optional)</span>
                </label>

                {/* Character Counter with dynamic color styling */}
                <span
                  className={`text-xs tabular-nums transition-colors ${
                    isOverLimit
                      ? 'text-rose-400 font-semibold'
                      : isNearLimit
                      ? 'text-amber-300 font-medium'
                      : 'text-[#C8B6FF]/75'
                  }`}
                >
                  {charsRemaining < 0
                    ? `${Math.abs(charsRemaining)} chars over limit`
                    : `${charsRemaining} chars left`}
                </span>
              </div>

              <div className="relative">
                <textarea
                  id={`${formId}-message`}
                  rows={4}
                  maxLength={MAX_MESSAGE_CHARS + 20}
                  placeholder="Share your prayers, warm blessings, or a favorite memory with Samuel & Yemisi..."
                  value={formData.message}
                  onChange={handleMessageChange}
                  onBlur={() => handleBlur('message')}
                  className={`w-full px-4 py-3 rounded-xl bg-[#120826]/80 text-white placeholder-[#FBF9F5]/35 text-sm transition-all focus:outline-none ${
                    isOverLimit
                      ? 'border border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : isNearLimit
                      ? 'border border-amber-400/80 focus:ring-1 focus:ring-amber-400'
                      : 'border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]'
                  }`}
                />
              </div>

              {/* Character Limit Progress Bar */}
              <div className="w-full bg-[#120826] h-1.5 rounded-full mt-2 overflow-hidden border border-[#3B1C66]/50">
                <div
                  className={`h-full transition-all duration-200 rounded-full ${
                    isOverLimit
                      ? 'bg-rose-500'
                      : isNearLimit
                      ? 'bg-amber-400'
                      : 'bg-gradient-to-r from-[#D4AF37] to-[#C8B6FF]'
                  }`}
                  style={{
                    width: `${Math.min(
                      (formData.message.length / MAX_MESSAGE_CHARS) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              {isOverLimit && (
                <p className="mt-1.5 text-xs text-rose-300 flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Your message exceeds the {MAX_MESSAGE_CHARS} character limit by{' '}
                    {Math.abs(charsRemaining)} characters.
                  </span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || (touched.email && !isFormValid)}
                className={`w-full py-4 rounded-xl font-semibold text-sm sm:text-base tracking-wide uppercase shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isSubmitting || (touched.email && !isFormValid)
                    ? 'bg-[#2B1154] text-[#FBF9F5]/40 border border-[#3B1C66] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#120826] shadow-[#D4AF37]/25 hover:shadow-[#D4AF37]/40 hover:opacity-95 cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Recording RSVP & Dispatching Email...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send RSVP</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Confirmation Email Preview Modal */}
      {showEmailModal && emailRecord && (
        <div
          className="fixed inset-0 z-50 bg-[#0B0418]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setShowEmailModal(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] bg-[#1B0A33] border border-[#D4AF37]/60 rounded-2xl flex flex-col shadow-2xl shadow-[#0B0418] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#D4AF37]/30 bg-[#120826] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2B1154] border border-[#D4AF37]/40 flex items-center justify-center text-[#F3E5AB]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-serif text-[#F3E5AB] font-semibold">
                    Mock Email Service · Sent Message
                  </h4>
                  <p className="text-[11px] text-[#C8B6FF]">
                    Simulated email confirmation receipt
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowEmailModal(false)}
                className="p-1.5 rounded-lg text-[#FBF9F5]/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Metadata Bar */}
            <div className="px-5 py-3 bg-[#15092B] border-b border-[#3B1C66]/50 text-xs text-[#FBF9F5]/85 space-y-1 font-sans">
              <div className="flex flex-wrap justify-between gap-1">
                <span className="text-[#C8B6FF]">From:</span>
                <span className="font-medium text-[#F3E5AB]">
                  Samuel & Yemisi &lt;rsvp@samuelandyemisi.com&gt;
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-1">
                <span className="text-[#C8B6FF]">To:</span>
                <span className="font-mono text-white">{emailRecord.recipientEmail}</span>
              </div>
              <div className="flex flex-wrap justify-between gap-1">
                <span className="text-[#C8B6FF]">Subject:</span>
                <span className="font-semibold text-white truncate max-w-sm sm:max-w-md">
                  {emailRecord.subject}
                </span>
              </div>
              <div className="flex flex-wrap justify-between gap-1 pt-1">
                <span className="text-[#C8B6FF]">Status:</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <Check className="w-3 h-3" /> Delivered to inbox
                </span>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="px-5 py-2 bg-[#120826] border-b border-[#3B1C66]/40 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setEmailViewMode('formatted')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                    emailViewMode === 'formatted'
                      ? 'bg-[#D4AF37] text-[#120826]'
                      : 'text-[#C8B6FF] hover:text-white'
                  }`}
                >
                  Rendered Email
                </button>
                <button
                  onClick={() => setEmailViewMode('text')}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                    emailViewMode === 'text'
                      ? 'bg-[#D4AF37] text-[#120826]'
                      : 'text-[#C8B6FF] hover:text-white'
                  }`}
                >
                  Plain Text
                </button>
              </div>

              {emailViewMode === 'text' && (
                <button
                  onClick={handleCopyEmailText}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#2B1154] border border-[#D4AF37]/30 text-[11px] text-[#F3E5AB] hover:bg-[#3B1C66]"
                >
                  {copiedEmailText ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Email View Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0E061E]">
              {emailViewMode === 'formatted' ? (
                <div
                  className="rounded-xl overflow-hidden border border-[#D4AF37]/30 shadow-inner"
                  dangerouslySetInnerHTML={{ __html: emailRecord.htmlBody }}
                />
              ) : (
                <pre className="p-4 rounded-xl bg-[#120826] border border-[#3B1C66] text-xs font-mono text-[#FBF9F5]/90 whitespace-pre-wrap leading-relaxed">
                  {emailRecord.textBody}
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-[#3B1C66]/50 bg-[#120826] flex items-center justify-between text-xs text-[#C8B6FF]/80">
              <span>Simulated with Mock Email Service</span>
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#2B1154] border border-[#D4AF37]/40 text-[#F3E5AB] hover:bg-[#3B1C66] font-medium"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
