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
import PageHero from '@/components/common/PageHero';
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
    <div className="w-full bg-[#f8fafc]">
      {/* Banner */}
      <PageHero
        title="Indian Market Update & Indices"
        description="Comprehensive market snapshot of benchmark indices, upcoming IPO pipelines, and macroeconomic commentaries for disciplined investors."
        imageSrc="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop"
        imageAlt="Indian Market Update & Indices"
      />

      {/* Indices Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {indices.map((idx, index) => {
              const changeVal = Number(idx?.change ?? 0);
              const percentVal = Number(idx?.percentChange ?? idx?.changePercent ?? 0);
              const isPositive = idx?.isPositive !== undefined ? Boolean(idx.isPositive) : changeVal >= 0;
              const displayVal = idx?.currentValue ?? idx?.currentPrice ?? 0;
              return (
                <div
                  key={idx?.symbol || idx?.name || index}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:border-[#2376b8]/50 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase mb-2">
                      <span>{idx?.symbol || 'INDEX'}</span>
                      <span className="text-[10px] text-[#89b441] bg-[#f4f8ee] px-2 py-0.5 rounded font-bold">
                        Active
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0f2b44]">{idx?.name || idx?.symbol}</h3>
                    <div className="text-2xl font-extrabold text-[#0f2b44] mt-2">
                      {formatINR(displayVal)}
                    </div>
                    <div
                      className={`text-xs font-bold mt-1 flex items-center ${
                        isPositive ? 'text-[#89b441]' : 'text-rose-600'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {changeVal.toFixed(2)} ({isPositive ? '+' : ''}
                      {percentVal.toFixed(2)}%)
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
                    <span>52W High: {formatINR(idx?.high52)}</span>
                    <span>52W Low: {formatINR(idx?.low52)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* News Tabs */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#0f2b44]">
                  Market Intelligence Briefings
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Curated briefings from the Finasset Wealth Research Desk.
                </p>
              </div>

              <div className="flex items-center bg-[#f8fafc] p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveTab('popular')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'popular'
                      ? 'bg-[#2376b8] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#2376b8]'
                  }`}
                >
                  Popular Trends
                </button>
                <button
                  onClick={() => setActiveTab('ipo')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'ipo'
                      ? 'bg-[#2376b8] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#2376b8]'
                  }`}
                >
                  Upcoming IPOs
                </button>
                <button
                  onClick={() => setActiveTab('market')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'market'
                      ? 'bg-[#2376b8] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#2376b8]'
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
                  className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-200/90 hover:border-[#2376b8]/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span className="font-semibold text-[#0f2b44] bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {item.badge}
                      </span>
                      <span>{item.source}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#0f2b44] mb-2 leading-snug hover:text-[#2376b8] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {item.summary}
                    </p>
                  </div>

                  <Link
                    href={item.url || '/blog'}
                    className="text-xs font-bold text-[#f87b1f] hover:text-[#d9620b] flex items-center gap-1 transition-colors"
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
            <Info className="w-4 h-4 text-[#2376b8] shrink-0 mt-0.5" />
            <span>
              <strong>Market Data Notice:</strong> Indices and news feeds shown here are curated periodically for illustrative educational review. Finasset Wealth does not engage in intraday stock tips or speculative trading recommendations.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
