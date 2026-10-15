'use client';

import Link from 'next/link';
import {
  FileText,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
  Calendar,
  Percent,
} from 'lucide-react';

export default function TaxationPage() {
  return (
    <div className="w-full bg-[#F8F7F3]">
      {/* Banner */}
      <section className="bg-[#10243A] text-white py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A76C]/20 border border-[#C7A76C]/30 text-[#dfc593] text-xs font-bold uppercase tracking-wider mb-4">
            <Percent className="w-3.5 h-3.5 text-[#C7A76C]" />
            <span>Tax-Efficient Wealth Creation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Taxation & Regulatory Planning
          </h1>
          <p className="text-slate-300 mt-4 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
            Maximize your net post-tax returns. Master the updated capital gains architecture, Section 80C/80D optimizations, and Section 54EC real estate tax shielding.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Key Tax Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C7A76C] block">
                Equity Mutual Funds
              </span>
              <h3 className="text-xl font-bold text-[#10243A]">LTCG & STCG Rules</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Equity funds held &gt;12 months are taxed at 12.5% on gains exceeding ₹1.25 Lakh per financial year. Short-term gains (&lt;12 months) are taxed at 20%.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C7A76C] block">
                Property & Capital Assets
              </span>
              <h3 className="text-xl font-bold text-[#10243A]">Section 54 & 54EC Bonds</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Save capital gains tax from real estate sales by investing up to ₹50 Lakhs in REC, PFC, or NHAI sovereign capital gains bonds or purchasing a residential property.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C7A76C] block">
                Health & Insurance Shield
              </span>
              <h3 className="text-xl font-bold text-[#10243A]">Section 80D & Term Cover</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deductions of up to ₹25,000 for self/family and up to ₹50,000 for senior citizen parents on health insurance premiums under the Old Tax Regime.
              </p>
            </div>
          </div>

          {/* Tax Harvesting In-Depth */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C7A76C]">
              Strategic Strategy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10243A]">
              The Power of Annual LTCG Tax-Gain Harvesting
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every financial year, the government allows ₹1.25 Lakh of long-term capital gains on equity mutual funds to be completely tax-free. If you don&apos;t harvest these gains each year, the allowance lapses.
            </p>

            <div className="bg-[#F8F7F3] p-6 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-sm font-bold text-[#10243A]">How Tax Harvesting Works:</h4>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-700 leading-relaxed">
                <li>Identify equity fund units with unrealized long-term capital gains approaching ₹1.25 Lakh.</li>
                <li>Redeem the units before March 31st of the current financial year.</li>
                <li>Immediately reinvest the proceeds back into the same or another diversified equity scheme.</li>
                <li>Your acquisition cost resets higher, legally slashing your future tax liability when you redeem at retirement.</li>
              </ol>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Finasset Wealth provides automated portfolio tax review reports for our clients.
              </div>
              <Link
                href="/contact-us#callback"
                className="bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all"
              >
                Schedule Portfolio Tax Audit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
