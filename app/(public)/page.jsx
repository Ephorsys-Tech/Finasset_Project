'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Building, CheckCircle2, ExternalLink, Smartphone } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import HeroSlider from '@/components/home/HeroSlider';
import { fallbackMarketIndices, fallbackFinancialVideo } from '@/lib/fallbackData';


import TestimonialSlider from '@/components/home/TestimonialSlider';
import ClientPartners from '@/components/home/ClientPartners';
import InvestorsCorner from '@/components/home/InvestorsCorner';
import NewsFeed from '@/components/home/NewsFeed';
import CallbackForm from '@/components/home/CallbackForm';
import OurServices from '@/components/home/OurServices';
import VideoShowcase from '@/components/home/VideoShowcase';


// function getEmbedUrl(url) {
//   if (!url) return 'https://www.youtube.com/embed/1-S_q_kUeYw';
//   if (url.includes('embed')) return url;
//   const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
//   if (match && match[1]) {
//     return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
//   }
//   return url;
// }


export default function HomePage() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [showAllServices, setShowAllServices] = useState(false);
  const [callbackForm, setCallbackForm] = useState({
    name: '',
    phone: '',
    serviceOfInterest: 'Mutual Funds & SIP',
    preferredTime: 'Anytime',
    message: '',
  });

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const res = await fetch('/api/v1/public/home');
        const json = await res.json();
        if (json.success) {
          setHomeData(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  const slides = homeData?.heroSlides || [];
  const services = homeData?.services || [];
  const marketIndices = homeData?.marketIndices || [];
  const displayIndices = marketIndices && marketIndices.length > 0 ? marketIndices : fallbackMarketIndices;
  const tickerItems = [...displayIndices, ...displayIndices];
  const testimonials = homeData?.testimonials || [];
  const partners = homeData?.partners || [];
  // const financialVideo = homeData?.financialVideo || fallbackFinancialVideo;

  const financialVideos =
  homeData?.financialVideos || (homeData?.financialVideo ? [homeData.financialVideo] : []);


  const homeNews = homeData?.newsItems || [];

  return (
    <div className="w-full">
      {/* 1. HERO BANNER CAROUSEL */}
      <HeroSlider slides={slides} />

      <style jsx>{`
        @keyframes marketTickerScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: marketTickerScroll 32s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 2. MARKET WATCH STRIP */}
      <section className="my-6 sm:my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow py-3 px-4 sm:px-6 flex items-center justify-between gap-4 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0 z-10 bg-white pr-2">
              <span className="w-1.5 h-3.5 bg-[#2376b8] rounded-full inline-block" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0f2b44] whitespace-nowrap">
                Market Watch
              </span>
            </div>

            <div className="relative flex-1 overflow-hidden mx-1 sm:mx-3 py-1">
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

              <div className="ticker-track">
                {tickerItems.map((idx, index) => {
                  const changeVal = Number(idx?.change ?? 0);
                  const percentVal = Number(idx?.percentChange ?? idx?.changePercent ?? 0);
                  const isPositive = idx?.isPositive !== undefined ? Boolean(idx.isPositive) : changeVal >= 0;
                  const displayVal = idx?.currentValue ?? idx?.currentPrice ?? 0;
                  return (
                    <div
                      key={`${idx?.symbol || idx?.name || 'idx'}-${index}`}
                      className="flex items-center gap-2.5 whitespace-nowrap bg-slate-50 hover:bg-slate-100/90 px-3.5 py-1.5 rounded-xl border border-slate-200/60 transition-colors mx-2 cursor-pointer"
                    >
                      <span className="font-bold text-slate-700">{idx?.name || idx?.symbol || 'Index'}</span>
                      <span className="font-extrabold text-slate-900 tracking-tight">{formatINR(displayVal)}</span>
                      <span
                        className={`font-bold text-[11px] px-2 py-0.5 rounded-lg flex items-center gap-1 ${isPositive ? 'bg-[#89b441]/15 text-[#5e8424]' : 'bg-rose-50 text-rose-600'
                          }`}
                      >
                        <span>{isPositive ? '▲' : '▼'}</span>
                        <span>
                          {isPositive ? '+' : ''}
                          {changeVal.toFixed(2)} ({isPositive ? '+' : ''}
                          {percentVal.toFixed(2)}%)
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link
              href="/market-update"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2376b8] hover:text-[#1b5d92] bg-[#2376b8]/5 hover:bg-[#2376b8]/10 px-3.5 py-1.5 rounded-xl transition-all group shrink-0 whitespace-nowrap z-10"
            >
              <span>Full Indices &amp; IPOs</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. OUR SERVICES */}
      <OurServices initialServices={services} />

      {/* 4. INVESTOR'S CORNER */}
      <InvestorsCorner />

      {/* 5. NEWS FEED */}
      <NewsFeed initialNews={homeNews} />

     {/* 6. FINANCIAL VIDEOS */}
<VideoShowcase initialVideos={financialVideos} />

      {/* 7. MOBILE APP PROMO SECTION */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0f2b44] to-[#164366] rounded-3xl p-8 sm:p-14 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#89b441] text-xs font-bold uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5 text-[#89b441]" />
                <span>Wealth Anywhere</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Track, Analyze & Rebalance Your Wealth on the Go
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Access your consolidated family investment portfolio across all AMCs in one secure dashboard. Real-time valuation, capital gains statements, automated SIP tracking, and instantaneous transaction execution.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#89b441]" />
                  <span>Consolidated Multi-AMC Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#89b441]" />
                  <span>One-Click Capital Gains (Tax) Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#89b441]" />
                  <span>Bank-Grade 256-Bit Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#89b441]" />
                  <span>Family Portfolio Aggregation</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/portfolio-login"
                  className="bg-[#f87b1f] hover:bg-[#d9620b] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-[#f87b1f]/20 transition-all flex items-center gap-2"
                >
                  <span>Launch Investor Web App</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <div className="text-xs text-slate-400">Compatible with iOS, Android & Desktop Browsers</div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-[440px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-700">
                <div className="w-full h-full bg-slate-950 rounded-[2.3rem] overflow-hidden p-4 flex flex-col justify-between border border-slate-800">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-4">
                      <span>Finasset Wealth</span>
                      <span className="text-[#89b441]">● LIVE</span>
                    </div>
                    <div className="text-xs text-slate-400 font-medium">Total Family Portfolio</div>
                    <div className="text-2xl font-extrabold text-white mt-1">₹1,42,85,920</div>
                    <div className="text-xs text-[#89b441] font-semibold mt-1">▲ +14.8% Annualized CAGR</div>

                    <div className="mt-6 space-y-2">
                      <div className="bg-slate-900 p-2.5 rounded-xl flex justify-between items-center text-xs">
                        <span className="text-slate-300">Equity Funds</span>
                        <span className="font-bold text-[#f87b1f]">65%</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl flex justify-between items-center text-xs">
                        <span className="text-slate-300">Debt & FDs</span>
                        <span className="font-bold text-[#2376b8]">25%</span>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl flex justify-between items-center text-xs">
                        <span className="text-slate-300">Gold & Sovereign</span>
                        <span className="font-bold text-[#89b441]">10%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0f2b44] p-3 rounded-xl text-center text-[11px] font-bold text-[#89b441] border border-[#2376b8]/30">
                    Next SIP Scheduled: 5th of Month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <TestimonialSlider initialTestimonials={testimonials} />

      {/* 8. CLIENT PARTNERS */}
      <ClientPartners initialPartners={partners} />

      {/* 11. REQUEST A CALL BACK FORM */}
      <CallbackForm initialServices={services} />
    </div>
  );
}