'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHero from '@/components/common/PageHero';
import {
  Receipt,
  FileText,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
  Search,
  Sparkles,
  Loader2,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { useTaxationStore } from '@/store/useTaxationStore';

export default function TaxationPage() {
  const { items: taxationItems, isLoading: loading, fetchItems } = useTaxationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchItems(false);
  }, [fetchItems]);

  // Extract unique categories
  const categories = [
    'all',
    ...Array.from(new Set(taxationItems.map((item) => item.category).filter(Boolean))),
  ];

  const filteredItems = taxationItems.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
          {/* Controls: Search & Category Filter */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3.5 py-1 rounded-full border border-[#2376b8]/20 inline-block mb-2">
                  Tax Advisory Knowledge Base
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2b44]">
                  Key Tax Pillars & Strategic Guidelines
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Browse real-time tax planning strategies, deduction rules, and compliance advisory updated by our certified experts.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tax rules, 80C, LTCG..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2376b8] focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            {categories.length > 2 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
                <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  Filter:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#0f2b44] text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Topics' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Content Grid */}
          {loading && taxationItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 border border-slate-200/80 shadow-sm text-center space-y-4">
              <Loader2 className="w-10 h-10 text-[#2376b8] animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-600">
                Loading live taxation guidelines & strategies...
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 border border-slate-200/80 shadow-sm text-center space-y-4">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-[#0f2b44]">No Taxation Topics Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {searchQuery
                  ? `No taxation topics matched your search "${searchQuery}". Try a different keyword.`
                  : 'Taxation topics will appear here once published from the admin panel.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:border-[#2376b8]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3.5 py-1 rounded-full border border-[#2376b8]/20 inline-block">
                        {item.category || 'Tax Advisory'}
                      </span>
                      <span className="text-[11px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        #{item.order ?? idx + 1}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#0f2b44] group-hover:text-[#2376b8] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Verified Compliance
                    </span>
                    <Link
                      href="/contact-us#callback"
                      className="text-[#f87b1f] hover:text-[#d9620b] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-all"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Strategic Action Callout */}
          <div className="bg-gradient-to-br from-[#0f2b44] to-[#1a3e61] rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
              <Receipt className="w-80 h-80" />
            </div>

            <div className="relative z-10 space-y-4 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f87b1f] bg-[#f87b1f]/10 px-3.5 py-1.5 rounded-full border border-[#f87b1f]/30 inline-block">
                Complimentary Consultation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Personalized Tax-Loss & Gain Harvesting Audit
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Whether you are an individual investor, HNI, or business owner, our financial advisory team conducts rigorous portfolio audits to identify tax-saving opportunities under Section 80C, 80D, 54EC, and annual capital gains exemption allowances.
              </p>
            </div>

            <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/contact-us#callback"
                className="bg-[#f87b1f] hover:bg-[#d9620b] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-7 py-4 rounded-2xl shadow-lg shadow-[#f87b1f]/30 transition-all text-center flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <span>Schedule Portfolio Tax Audit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-bold px-7 py-4 rounded-2xl transition-all text-center"
              >
                Explore Wealth Advisory Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
