'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  ShieldCheck,
  Search,
  CheckCircle2,
  Info,
  Building2,
  CreditCard,
  Lock,
  ArrowUpRight,
  X,
} from 'lucide-react';
import PageHero from '@/components/common/PageHero';

// Verified Life Insurance Companies - Direct Official Payment URLs
const LIFE_INSURERS = [
  {
    id: 1,
    name: 'Aegon Life Insurance',
    alias: 'Now Bandhan Life',
    code: 'BL',
    url: 'https://www.bandhanlife.com/pay-premium',
    description: 'Direct renewal payment portal for individual protection and life savings plans.',
  },
  {
    id: 2,
    name: 'Aviva Life Insurance',
    alias: 'Aviva India',
    code: 'AV',
    url: 'https://online.avivaindia.com/online/paypremium',
    description: 'Instant online premium payment gateway with immediate digital receipt acknowledgment.',
  },
  {
    id: 3,
    name: 'Bajaj Allianz Life Insurance',
    alias: 'Bajaj Allianz Life',
    code: 'BA',
    url: 'https://www.bajajallianzlife.com/pay-premium-online.html',
    description: 'Pay renewal premium seamlessly for savings, term, retirement, and ULIP policies.',
  },
  {
    id: 4,
    name: 'Birla Sun Life Insurance',
    alias: 'Aditya Birla Sun Life Insurance',
    code: 'AB',
    url: 'https://lifeinsurance.adityabirlacapital.com/quick-pay',
    description: 'Aditya Birla Capital Quick Pay gateway for fast, secure policy renewal.',
  },
  {
    id: 5,
    name: 'Bharti AXA Life Insurance',
    alias: 'Bharti AXA Life',
    code: 'BX',
    url: 'https://www.bhartiaxalife.com/pay-premium',
    description: 'Instant renewal portal for traditional, term, and investment-linked life plans.',
  },
  {
    id: 6,
    name: 'Canara HSBC OBC Life Insurance',
    alias: 'Canara HSBC Life',
    code: 'CH',
    url: 'https://online.canarahsbclife.com/pay-premium.html',
    description: 'Direct online payment gateway for Canara HSBC life insurance policies.',
  },
  {
    id: 7,
    name: 'DHFL Pramerica Life Insurance',
    alias: 'Pramerica Life',
    code: 'PL',
    url: 'https://www.pramericalife.in/quick-pay',
    description: 'Quick-Pay renewal gateway for individual protection and child education plans.',
  },
  {
    id: 8,
    name: 'Future Generali India Life Insurance',
    alias: 'Future Generali Life',
    code: 'FG',
    url: 'https://life.futuregenerali.in/pay-premium',
    description: 'Fast digital renewal premium payment via UPI, net banking, or debit card.',
  },
  {
    id: 9,
    name: 'HDFC Life Insurance',
    alias: 'HDFC Life Quick Pay',
    code: 'HD',
    url: 'https://onlinepayments.hdfclife.com/',
    description: 'Official instant online payments gateway for all HDFC Life policy renewals.',
  },
  {
    id: 10,
    name: 'ICICI Prudential Life Insurance',
    alias: 'ICICI Pru Life',
    code: 'IP',
    url: 'https://pay.iciciprulife.com/portal/',
    description: 'Direct renewal payment portal for ICICI Pru iProtect, term, and savings plans.',
  },
  {
    id: 11,
    name: 'IDBI Federal Life Insurance',
    alias: 'Ageas Federal Life',
    code: 'AF',
    url: 'https://www.ageasfederal.com/pay-premium',
    description: 'Official online payment portal for policy renewals and revival premiums.',
  },
  {
    id: 12,
    name: 'Tata AIA Life Insurance',
    alias: 'Tata AIA QuickPay',
    code: 'TA',
    url: 'https://payment.tataaia.com/quickpay/',
    description: 'Direct QuickPay portal for Sampoorna Raksha, term, and wealth plans.',
  },
  {
    id: 13,
    name: 'Kotak Mahindra Life Insurance',
    alias: 'Kotak Life',
    code: 'KM',
    url: 'https://www.kotaklife.com/pay-premium-online',
    description: 'Pay premium online directly using policy number and date of birth.',
  },
  {
    id: 14,
    name: 'LIC (Life Insurance Corporation of India)',
    alias: 'LIC of India',
    code: 'LIC',
    url: 'https://licindia.in/payment-through-alternate-channels',
    description: 'Official direct payment gateway for all individual and group LIC life policies.',
  },
  {
    id: 15,
    name: 'Max Life Insurance',
    alias: 'Max Life Quick Pay',
    code: 'ML',
    url: 'https://www.maxlifeinsurance.com/pay-premium-online',
    description: 'Online premium payment portal for Max Life Smart Secure Plus and savings plans.',
  },
  {
    id: 16,
    name: 'PNB MetLife India Insurance',
    alias: 'PNB MetLife QuickPay',
    code: 'PM',
    url: 'https://online.pnbmetlife.com/quickpay',
    description: 'QuickPay renewal portal for PNB MetLife protection and retirement policies.',
  },
  {
    id: 17,
    name: 'Reliance Nippon Life Insurance',
    alias: 'Reliance Nippon Life',
    code: 'RN',
    url: 'https://www.reliancenipponlife.com/pay-premium-online',
    description: 'Pay renewal premium online securely with instant digital payment receipt.',
  },
  {
    id: 18,
    name: 'SBI Life Insurance',
    alias: 'SBI Life Quick Pay',
    code: 'SB',
    url: 'https://www.sbilife.co.in/pay-premium-online',
    description: 'Official direct payment gateway for SBI Life eShield, Smart Shield, and pension plans.',
  },
];

export default function PayPremiumPage() {
  const [search, setSearch] = useState('');

  const filteredInsurers = LIFE_INSURERS.filter((ins) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      ins.name.toLowerCase().includes(q) ||
      ins.alias.toLowerCase().includes(q) ||
      ins.code.toLowerCase().includes(q) ||
      ins.description.toLowerCase().includes(q)
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
              Showing <span className="font-bold text-[#0f2b44]">{filteredInsurers.length}</span> of {LIFE_INSURERS.length} life insurance companies
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 font-semibold text-[11px]">
              <Lock className="w-3 h-3 text-emerald-600" />
              100% Direct Official Portals
            </span>
          </div>

          {/* Clean Minimal Insurers Grid */}
          {filteredInsurers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-[#0f2b44]">No insurer found</h4>
              <p className="text-xs text-slate-500">
                No insurance company matches &ldquo;{search}&rdquo;. Try searching by name, short code, or parent company.
              </p>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-xs font-bold text-[#2376b8] hover:underline pt-2 block mx-auto"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInsurers.map((ins, index) => (
                <div
                  key={ins.id}
                  className="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:border-[#2376b8]/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Header inside Card */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#0f2b44]/5 text-[#0f2b44] font-black text-xs flex items-center justify-center border border-[#0f2b44]/10 group-hover:bg-[#2376b8] group-hover:text-white group-hover:border-[#2376b8] transition-colors duration-300 shrink-0">
                        {ins.code}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Direct Gateway</span>
                      </span>
                    </div>

                    {/* Company Details */}
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-bold text-[#0f2b44] group-hover:text-[#2376b8] transition-colors duration-300 leading-snug">
                        {ins.name}
                      </h3>
                      {ins.alias && (
                        <p className="text-[11px] font-medium text-slate-500">
                          {ins.alias}
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
                      href={ins.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#0f2b44] hover:bg-[#2376b8] text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group/btn shadow-sm"
                    >
                      <span>Pay Premium Online</span>
                      <ArrowUpRight className="w-4 h-4 text-[#f87b1f] group-hover/btn:text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all duration-200" />
                    </a>
                  </div>
                </div>
              ))}
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
