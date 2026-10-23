'use client';

import Link from 'next/link';
import PageHero from '@/components/common/PageHero';
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
    <div className="w-full bg-[#f8fafc]">
      {/* Banner */}
      <PageHero
        title="Taxation & Regulatory Planning"
        description="Maximize your net post-tax returns. Master the updated capital gains architecture, Section 80C/80D optimizations, and Section 54EC real estate tax shielding."
        imageSrc="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop"
        imageAlt="Taxation & Regulatory Planning"
      />

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Key Tax Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:border-[#2376b8]/50 hover:shadow-md transition-all space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3 py-1 rounded-full border border-[#2376b8]/20 inline-block">
                Equity Mutual Funds
              </span>
              <h3 className="text-xl font-bold text-[#0f2b44]">LTCG & STCG Rules</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Equity funds held &gt;12 months are taxed at 12.5% on gains exceeding ₹1.25 Lakh per financial year. Short-term gains (&lt;12 months) are taxed at 20%.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:border-[#2376b8]/50 hover:shadow-md transition-all space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3 py-1 rounded-full border border-[#2376b8]/20 inline-block">
                Property & Capital Assets
              </span>
              <h3 className="text-xl font-bold text-[#0f2b44]">Section 54 & 54EC Bonds</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Save capital gains tax from real estate sales by investing up to ₹50 Lakhs in REC, PFC, or NHAI sovereign capital gains bonds or purchasing a residential property.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:border-[#2376b8]/50 hover:shadow-md transition-all space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3 py-1 rounded-full border border-[#2376b8]/20 inline-block">
                Health & Insurance Shield
              </span>
              <h3 className="text-xl font-bold text-[#0f2b44]">Section 80D & Term Cover</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deductions of up to ₹25,000 for self/family and up to ₹50,000 for senior citizen parents on health insurance premiums under the Old Tax Regime.
              </p>
            </div>
          </div>

          {/* Tax Harvesting In-Depth */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3.5 py-1 rounded-full border border-[#2376b8]/20 inline-block">
              Strategic Strategy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2b44]">
              The Power of Annual LTCG Tax-Gain Harvesting
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every financial year, the government allows ₹1.25 Lakh of long-term capital gains on equity mutual funds to be completely tax-free. If you don&apos;t harvest these gains each year, the allowance lapses.
            </p>

            <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-sm font-bold text-[#0f2b44]">How Tax Harvesting Works:</h4>
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
                className="bg-[#f87b1f] hover:bg-[#d9620b] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md shadow-[#f87b1f]/20 transition-all"
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
