'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowRight,
  Clock,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function MarketUpdatePage() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('popular');

  useEffect(() => {
    fetch('/api/v1/public/market-data')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setMarketData(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const indices = marketData?.indices || [];
  const news = marketData?.news || { popular: [], ipo: [], market: [] };
  const currentNews = news[activeTab] || [];

  return (
    <div className="w-full bg-[#F8F7F3]">
      {/* Banner */}
      <section className="bg-[#10243A] text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A76C]/20 border border-[#C7A76C]/30 text-[#dfc593] text-xs font-bold uppercase tracking-wider mb-4">
            <TrendingUp className="w-3.5 h-3.5 text-[#C7A76C]" />
            <span>Market Intelligence Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Indian Market Update & Indices
          </h1>
          <p className="text-slate-300 mt-4 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
            Comprehensive market snapshot of benchmark indices, upcoming IPO pipelines, and macroeconomic commentaries for disciplined investors.
          </p>
        </div>
      </section>

      {/* Indices Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {indices.map((idx) => {
              const isPositive = idx.change >= 0;
              return (
                <div
                  key={idx.symbol}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase mb-2">
                      <span>{idx.symbol}</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#10243A]">{idx.name}</h3>
                    <div className="text-2xl font-extrabold text-[#10243A] mt-2">
                      {formatINR(idx.currentValue)}
                    </div>
                    <div
                      className={`text-xs font-bold mt-1 flex items-center ${
                        isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {idx.change.toFixed(2)} ({isPositive ? '+' : ''}
                      {idx.percentChange.toFixed(2)}%)
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
                    <span>52W High: {formatINR(idx.high52)}</span>
                    <span>52W Low: {formatINR(idx.low52)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* News Tabs */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#10243A]">
                  Market Intelligence Briefings
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Curated briefings from the Finasset Wealth Research Desk.
                </p>
              </div>

              <div className="flex items-center bg-[#F8F7F3] p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveTab('popular')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'popular'
                      ? 'bg-[#10243A] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#10243A]'
                  }`}
                >
                  Popular Trends
                </button>
                <button
                  onClick={() => setActiveTab('ipo')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'ipo'
                      ? 'bg-[#10243A] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#10243A]'
                  }`}
                >
                  Upcoming IPOs
                </button>
                <button
                  onClick={() => setActiveTab('market')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'market'
                      ? 'bg-[#10243A] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#10243A]'
                  }`}
                >
                  Technical Desk
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentNews.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#F8F7F3] rounded-2xl p-6 border border-slate-200/80 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span className="font-semibold text-[#10243A] bg-white px-2.5 py-1 rounded border border-slate-200">
                        {item.badge}
                      </span>
                      <span>{item.source}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#10243A] mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {item.summary}
                    </p>
                  </div>

                  <Link
                    href={item.url || '/blog'}
                    className="text-xs font-bold text-[#C7A76C] hover:text-[#a88547] flex items-center gap-1"
                  >
                    <span>Read Analysis</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer Note */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-500 leading-relaxed flex items-start gap-3">
            <Info className="w-4 h-4 text-[#C7A76C] shrink-0 mt-0.5" />
            <span>
              <strong>Market Data Notice:</strong> Indices and news feeds shown here are curated periodically for illustrative educational review. Finasset Wealth does not engage in intraday stock tips or speculative trading recommendations.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
