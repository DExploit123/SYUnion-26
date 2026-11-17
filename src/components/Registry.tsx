/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WEDDING_CONFIG, CashDonationMethod } from '../config/weddingConfig';
import { HeartHandshake, Copy, Check, Tv, Armchair, SunMedium, Microwave, DoorClosed, Smartphone, Building2 } from 'lucide-react';

export const Registry: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const cashMethods: CashDonationMethod[] = WEDDING_CONFIG.registry.cashDonations.methods;
  const wishlistItems = WEDDING_CONFIG.registry.wishlistItems;

  return (
    <section id="registry" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-14 sm:mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-[#3B0764] font-semibold">
          Bless the Couple
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif text-[#1F073A] font-bold mt-2 mb-4">
          Wedding Gifts & Monetary Blessings
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#9A7314] to-transparent mx-auto mb-4" />
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#2E1065] font-sans font-medium leading-relaxed">
          {WEDDING_CONFIG.registry.subtitle}
        </p>
      </div>

      {/* Part 1: Primary Cash Donations (Palmpay) */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#240B47] border border-[#D4AF37]/50 flex items-center justify-center text-[#F3E5AB]">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-serif text-[#1F073A] font-bold">
              {WEDDING_CONFIG.registry.cashDonations.title}
            </h3>
            <p className="text-xs text-[#2E1065] font-medium">
              Direct monetary blessings via instant bank transfer
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {cashMethods.map((method) => {
            const copyTarget = method.accountNumber || method.handleOrEmail || '';
            const isCopied = copiedId === method.id;

            return (
              <div
                key={method.id}
                className="relative bg-[#240B47]/95 border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-[#240B47]/25 transition-all duration-300 md:col-span-2"
              >
                {/* Gold Top Accent Line */}
                <div className="absolute top-0 left-12 right-12 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#120826] border border-[#D4AF37]/40 flex items-center justify-center text-[#F3E5AB]">
                        {method.type === 'bank' ? (
                          <Building2 className="w-5 h-5" />
                        ) : (
                          <Smartphone className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-serif text-[#FBF9F5]">
                          {method.name}
                        </h4>
                        <span className="text-xs text-[#C8B6FF]">
                          {method.bankName} Digital Bank
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#D4AF37] px-3 py-1 rounded-full bg-[#120826] border border-[#D4AF37]/40">
                      {method.currency}
                    </span>
                  </div>

                  {/* Account Details Box */}
                  <div className="space-y-3.5 text-sm text-[#FBF9F5]/90 bg-[#120826]/90 p-5 rounded-xl border border-[#3B1C66]/70 mb-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[#C8B6FF] text-xs block mb-0.5">Bank Name</span>
                        <span className="font-semibold text-white text-base">{method.bankName}</span>
                      </div>

                      <div>
                        <span className="text-[#C8B6FF] text-xs block mb-0.5">Account Name</span>
                        <span className="font-semibold text-white text-base">{method.accountName}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#3B1C66]/60">
                      <span className="text-[#C8B6FF] text-xs block mb-1">Account Number</span>
                      <div className="flex items-center justify-between bg-[#1B0A33] px-4 py-3 rounded-lg border border-[#D4AF37]/30">
                        <span className="font-mono text-xl sm:text-2xl font-bold text-[#F3E5AB] tracking-widest">
                          {method.accountNumber}
                        </span>
                        <span className="text-[11px] text-[#C8B6FF] font-medium hidden sm:inline">
                          Tap below to copy
                        </span>
                      </div>
                    </div>

                    {method.notes && (
                      <p className="text-xs text-[#FBF9F5]/70 italic pt-1">
                        {method.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* 1-Click Copy Button */}
                {copyTarget && (
                  <button
                    onClick={() => copyToClipboard(copyTarget, method.id)}
                    className={`w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white shadow-emerald-900/50'
                        : 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#120826] hover:brightness-105 shadow-[#D4AF37]/20'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-5 h-5 text-white" />
                        <span>Account Number Copied (7053257418)!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Palmpay Account Number (7053257418)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 2: Couple's Home Wishlist (From Celebrant Questionnaire) */}
      <div className="pt-8 border-t border-[#9A7314]/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#240B47] border border-[#D4AF37]/50 flex items-center justify-center text-[#F3E5AB]">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-serif text-[#1F073A] font-bold">
              Couple’s Home Wishlist
            </h3>
            <p className="text-xs text-[#2E1065] font-medium">
              Household items Samuel & Yemisi are hoping to furnish their new home with
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] bg-[#240B47]/95 border-2 border-[#D4AF37]/45 rounded-2xl p-6 flex flex-col justify-between shadow-2xl shadow-[#240B47]/20 hover:border-[#D4AF37] transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#180630] border border-[#D4AF37]/40 flex items-center justify-center text-[#F3E5AB]">
                    {item.icon === 'tv' && <Tv className="w-5 h-5" />}
                    {item.icon === 'sofa' && <Armchair className="w-5 h-5" />}
                    {item.icon === 'fan' && <SunMedium className="w-5 h-5" />}
                    {item.icon === 'microwave' && <Microwave className="w-5 h-5" />}
                    {item.icon === 'wardrobe' && <DoorClosed className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-mono px-2.5 py-0.5 rounded-full bg-[#180630] text-[#C8A2C8] border border-[#D4AF37]/40 font-semibold">
                    {item.category}
                  </span>
                </div>

                <h4 className="text-xl font-serif text-[#FBF9F5] font-bold mb-2">
                  {item.name}
                </h4>
                <p className="text-xs sm:text-sm text-[#FBF9F5]/85 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#3B1C66] text-center">
                <span className="text-[11px] text-[#C8A2C8] italic font-medium">
                  To gift or sponsor this item, reference &ldquo;{item.name}&rdquo; with your transfer or reach out to the couple.
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gracious blessings footer note */}
      <div className="mt-14 text-center">
        <p className="text-xs sm:text-sm text-[#2E1065] font-serif italic font-medium">
          “Every good and perfect gift is from above, coming down from the Father of lights.” — James 1:17
        </p>
      </div>
    </section>
  );
};
