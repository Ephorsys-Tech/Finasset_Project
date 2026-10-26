'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Info,
  Building2,
  Lock,
  ArrowUpRight,
  X,
  CreditCard,
} from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import { usePayPremiumStore } from '@/store/usePayPremiumStore';

export default function PayPremiumPage() {
  const { items, isLoading, fetchItems } = usePayPremiumStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchItems(false);
  }, [fetchItems]);

  const filteredInsurers = items.filter((ins) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (ins.title || '').toLowerCase().includes(q) ||
      (ins.shortTitle || '').toLowerCase().includes(q) ||
      (ins.description || '').toLowerCase().includes(q) ||
      (ins.link || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Hero Banner */}
      <PageHero
        title="Pay Insurance Premium Online"
        description="Direct, verified one-click payment gateways for your ongoing policy renewals across leading life insurance companies in India."
        imageSrc="https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=1200&auto=format&fit=crop"
        imageAlt="Pay Insurance Premium Online"
      />

      {/* Main Content Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3.5 py-1 rounded-full border border-[#2376b8]/20 inline-flex items-center gap-1.5 mb-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2376b8]" />
                <span>Verified Direct Payment Gateways</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2b44]">
                Life Insurance Companies
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
                Select your insurer below to open their official, encrypted premium renewal payment portal in a secure window.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search insurer (e.g. HDFC, LIC, SBI)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2376b8] shadow-sm transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              Showing <span className="font-bold text-[#0f2b44]">{filteredInsurers.length}</span> of {items.length} life insurance companies
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 font-semibold text-[11px]">
              <Lock className="w-3 h-3 text-emerald-600" />
              100% Direct Official Portals
            </span>
          </div>

          {/* Loading State */}
          {isLoading && items.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center space-y-4">
              <div className="animate-spin w-10 h-10 border-4 border-[#2376b8] border-t-transparent rounded-full mx-auto" />
              <p className="text-xs font-semibold text-slate-500">
                Loading official insurance payment gateways...
              </p>
            </div>
          ) : filteredInsurers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-[#0f2b44]">
                {items.length === 0 ? 'No Insurance Gateways Available' : 'No insurer found'}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {items.length === 0
                  ? 'There are currently no insurer payment gateways published. Insurers added by the administrator will appear here.'
                  : `No insurance company matches "${search}". Try searching by name, short code, or description.`}
              </p>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-xs font-bold text-[#2376b8] hover:underline pt-2 block mx-auto"
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInsurers.map((ins) => {
                const avatarCode =
                  (ins.shortTitle || ins.title || 'IN')
                    .slice(0, 3)
                    .toUpperCase();

                return (
                  <div
                    key={ins._id || ins.id}
                    className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-[#2376b8]/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header inside Card */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-[#0f2b44]/5 text-[#0f2b44] font-black text-xs flex items-center justify-center border border-[#0f2b44]/10 group-hover:bg-[#2376b8] group-hover:text-white group-hover:border-[#2376b8] transition-colors duration-300 shrink-0">
                          {avatarCode}
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Direct Gateway</span>
                        </span>
                      </div>

                      {/* Company Details */}
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-[#0f2b44] group-hover:text-[#2376b8] transition-colors duration-300 leading-snug">
                          {ins.title}
                        </h3>
                        {ins.shortTitle && (
                          <p className="text-[11px] font-medium text-slate-500">
                            {ins.shortTitle}
                          </p>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100">
                        {ins.description}
                      </p>
                    </div>

                    {/* Direct Action Button */}
                    <div className="pt-5 mt-4">
                      <a
                        href={ins.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#0f2b44] hover:bg-[#2376b8] text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group/btn shadow-sm"
                      >
                        <span>Pay Premium Online</span>
                        <ArrowUpRight className="w-4 h-4 text-[#f87b1f] group-hover/btn:text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all duration-200" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Helpful Information Box */}
          <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0f2b44]">
              <Info className="w-4 h-4 text-[#2376b8]" />
              <span>Important Tips for Online Insurance Premium Payments</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#89b441] shrink-0 mt-0.5" />
                <span>
                  <strong>Keep Policy Details Ready:</strong> Ensure you have your exact Policy Number and Proposer Date of Birth handy before initiating payment.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#89b441] shrink-0 mt-0.5" />
                <span>
                  <strong>Instant Section 80C Tax Receipts:</strong> Always download and save the official digitally signed premium receipt immediately for tax filing.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#89b441] shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Surcharge Payment Modes:</strong> Payment through UPI, Net Banking, and Rupay Debit Cards typically carries zero gateway surcharge.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#89b441] shrink-0 mt-0.5" />
                <span>
                  <strong>Finasset Advisory Support:</strong> Contact our client support desk if you require assistance with policy renewal or revival.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
