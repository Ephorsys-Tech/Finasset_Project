'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Shield,
  ArrowRight,
  Calculator,
  Compass,
  Building,
  Landmark,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Award,
  Users,
  Target,
  FileText,
  CreditCard,
  Zap,
  Play,
  Smartphone,
  Star,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import HeroSlider from '@/components/home/HeroSlider';
import FeatureCarousel from '@/components/ui/feature-carousel';
import { Marquee } from '@/components/ui/marquee';
import { fallbackMarketIndices, fallbackServices, fallbackNewsItems, fallbackFinancialVideo, fallbackPartners } from '@/lib/fallbackData';

function getEmbedUrl(url) {
  if (!url) return 'https://www.youtube.com/embed/1-S_q_kUeYw';
  if (url.includes('embed')) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
  }
  return url;
}

export default function HomePage() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllServices, setShowAllServices] = useState(false);
  const [selectedNewsIndex, setSelectedNewsIndex] = useState(0);
  const [newsTab, setNewsTab] = useState('popular');
  const [callbackForm, setCallbackForm] = useState({
    name: '',
    phone: '',
    serviceOfInterest: 'Mutual Funds & SIP',
    preferredTime: 'Anytime',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
  const displayServices = (services && services.length > 0) ? services : fallbackServices;
  const visibleServices = showAllServices ? displayServices : displayServices.slice(0, 3);
  const investorTools = homeData?.investorTools || [];
  const marketIndices = homeData?.marketIndices || [];
  const displayIndices = (marketIndices && marketIndices.length > 0) ? marketIndices : fallbackMarketIndices;
  const tickerItems = [...displayIndices, ...displayIndices];
  const newsItems = homeData?.newsItems || [];
  const displayNews = (newsItems && newsItems.length > 0) ? newsItems : fallbackNewsItems;
  const activeNews = displayNews[selectedNewsIndex] || displayNews[0];
  const testimonials = homeData?.testimonials || [];
  const partners = (homeData?.partners && homeData.partners.length > 0) ? homeData.partners : fallbackPartners;
  const financialVideo = homeData?.financialVideo || fallbackFinancialVideo;

  const handleSelectNews = (idx) => {
    setSelectedNewsIndex(idx);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const el = document.getElementById('featured-news-card');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const res = await fetch('/api/v1/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...callbackForm,
          type: 'callback',
          sourcePage: 'Homepage Call Back Form',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setCallbackForm({
          name: '',
          phone: '',
          serviceOfInterest: 'Mutual Funds & SIP',
          preferredTime: 'Anytime',
          message: '',
        });
      } else {
        setSubmitError(data.message || 'Failed to submit request');
      }
    } catch {
      setSubmitError('Network error. Please try again or call our office directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-6 h-6 text-[#2376b8]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-[#2376b8]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#89b441]" />;
      case 'Building':
        return <Building className="w-6 h-6 text-[#2376b8]" />;
      case 'Landmark':
        return <Landmark className="w-6 h-6 text-[#2376b8]" />;
      case 'PieChart':
        return <PieChart className="w-6 h-6 text-[#f87b1f]" />;
      default:
        return <TrendingUp className="w-6 h-6 text-[#2376b8]" />;
    }
  };

  const getToolIcon = (iconName) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-7 h-7 text-[#89b441]" />;
      case 'Target':
        return <Target className="w-7 h-7 text-[#f87b1f]" />;
      case 'Activity':
        return <TrendingUp className="w-7 h-7 text-[#2376b8]" />;
      case 'CreditCard':
        return <CreditCard className="w-7 h-7 text-[#89b441]" />;
      case 'Zap':
        return <Zap className="w-7 h-7 text-[#f87b1f]" />;
      default:
        return <Calculator className="w-7 h-7 text-[#89b441]" />;
    }
  };

  return (
    <div className="w-full">
      {/* 1. HERO BANNER CAROUSEL */}
      <HeroSlider slides={slides} />

      {/* Scoped Keyframes for Smooth Marquee Auto-Scroll & Hover-Pause */}
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

      {/* 2. MARKET WATCH STRIP (Sensex, Nifty, Bank Nifty, Gold) */}
      <section className="my-6 sm:my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow py-3 px-4 sm:px-6 flex items-center justify-between gap-4 overflow-hidden">
            {/* Label */}
            <div className="flex items-center gap-2 shrink-0 z-10 bg-white pr-2">
              <span className="w-1.5 h-3.5 bg-[#2376b8] rounded-full inline-block" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0f2b44] whitespace-nowrap">
                Market Watch
              </span>
            </div>

            {/* Seamless Auto-Scrolling Ticker (No Bottom Scrollbar, Pauses on Hover) */}
            <div className="relative flex-1 overflow-hidden mx-1 sm:mx-3 py-1">
              {/* Subtle edge fade overlays for ultra-modern look */}
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
                        className={`font-bold text-[11px] px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                          isPositive
                            ? 'bg-[#89b441]/15 text-[#5e8424]'
                            : 'bg-rose-50 text-rose-600'
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

            {/* Action Link */}
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

      {/* 3. OUR SERVICES (Minimalist Bento Layout Matching Shared Image) */}
      <section id="services" className="py-16 sm:py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header (Aligned to right side) */}
          <div className="max-w-3xl ml-auto text-right mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 tracking-tight mb-3">
              Our Services
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Comprehensive, data-driven wealth creation and advisory solutions customized to power your long-term financial security and portfolio growth.
            </p>
          </div>

          {/* Service Cards Grid (1st full-screen horizontal, 2nd & 3rd 1:1 side by side, repeating on expand) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {visibleServices.map((service, index) => {
              const title = service.title || service.name;
              const desc = service.shortDescription || service.description;
              const href = `/services/${service.slug}`;
              const img = service.imageUrl || service.image;
              const isFullSpan = index % 3 === 0; // 1st card (0) and 4th card (3) cover full screen width

              if (isFullSpan) {
                return (
                  <Link
                    key={service.slug || index}
                    href={href}
                    className="group flex flex-col md:flex-row bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 md:col-span-2"
                  >
                    {/* Left Image Area (Horizontal fill) */}
                    <div className="md:w-1/2 bg-[#f4f4f5] h-64 sm:h-72 md:h-auto min-h-[260px] overflow-hidden flex items-center justify-center relative">
                      {img ? (
                        <img
                          src={img}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-slate-200/60 flex items-center justify-center text-slate-400">
                          <Building className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Right Content Area */}
                    <div className="md:w-1/2 p-7 sm:p-10 bg-white flex flex-col justify-center text-left">
                      <h3 className="font-semibold text-xl sm:text-2xl text-slate-900 group-hover:text-[#2376b8] transition-colors">
                        {title}
                      </h3>
                      <p className="text-slate-500 text-sm sm:text-base leading-relaxed mt-3">
                        {desc}
                      </p>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={service.slug || index}
                  href={href}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 md:col-span-1"
                >
                  {/* Top Image Container (1:1 ratio style) */}
                  <div className="relative h-56 sm:h-64 bg-[#f4f4f5] overflow-hidden flex items-center justify-center">
                    {img ? (
                      <img
                        src={img}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-slate-200/60 flex items-center justify-center text-slate-400">
                        <Building className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Bottom Content Container */}
                  <div className="p-6 sm:p-7 bg-white flex flex-col justify-start flex-1 text-left">
                    <h3 className="font-semibold text-lg sm:text-xl text-slate-900 group-hover:text-[#2376b8] transition-colors">
                      {title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mt-2">
                      {desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Explore all services button */}
          {displayServices.length > 3 && (
            <div className="mt-10 sm:mt-12 flex justify-center">
              <button
                onClick={() => setShowAllServices(!showAllServices)}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-900 hover:bg-[#2376b8] text-white text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <span>{showAllServices ? 'Show Less Services' : 'Explore all services'}</span>
                <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${showAllServices ? '-rotate-90' : 'group-hover:translate-x-1'}`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. INVESTOR'S CORNER (Interactive Feature Carousel) */}
      <section id="investors-corner" className="py-16 sm:py-24 bg-[#f8fafc] scroll-mt-20 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f87b1f] bg-[#f87b1f]/10 px-3.5 py-1 rounded-full border border-[#f87b1f]/20 inline-block mb-3">
              Investor Empowerment
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 tracking-tight mb-3">
              Investor&apos;s Corner
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Equip yourself with institutional-grade financial utilities. Calculate compounding wealth, test your risk tolerance, and explore personalized advisory tools.
            </p>
          </div>
        </div>

        <FeatureCarousel />
      </section>

      {/* 5. NEWS FEED (Interactive Split Layout Matching Reference Image) */}
      <section id="news-feed" className="py-16 sm:py-24 bg-white scroll-mt-20 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#2376b8]/10 px-3.5 py-1 rounded-full border border-[#2376b8]/20 inline-block mb-3">
                Market Intelligence
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 tracking-tight">
                News Feed
              </h2>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md text-left sm:text-right leading-relaxed">
              Curated market reports, macroeconomic shifts, and fiduciary advisory commentary updated regularly.
            </p>
          </div>

          {/* News Feed Grid (Left: Active Featured Story, Right: Interactive List) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Side: Featured / Selected News in Detail */}
            <div id="featured-news-card" className="lg:col-span-7 xl:col-span-8 scroll-mt-24">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 h-[440px] sm:h-[500px] lg:h-[540px] flex flex-col justify-between p-6 sm:p-10 group">
                {/* Background Image with smooth transition */}
                <div
                  key={activeNews?._id || activeNews?.title || selectedNewsIndex}
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105 animate-in fade-in duration-500"
                  style={{
                    backgroundImage: `url('${activeNews?.imageUrl || 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80'}')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/20 z-10" />

                {/* Top-Left Badge: Matching Screenshot "Featured Post" pill */}
                <div className="relative z-20 self-start">
                  <span className="px-4 py-1.5 rounded-full bg-white text-slate-900 font-bold text-xs shadow-lg tracking-wide border border-white/80">
                    {activeNews?.badge || 'Featured Post'}
                  </span>
                </div>

                {/* Bottom News Details */}
                <div className="relative z-20 flex flex-col justify-end text-left">
                  {/* Publish Date & Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300 mb-2.5">
                    <span>
                      {activeNews?.publishedAt
                        ? (typeof activeNews.publishedAt === 'string'
                            ? activeNews.publishedAt
                            : new Date(activeNews.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }))
                        : 'Recent'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
                    <span>{activeNews?.readTime || '5 min Read'}</span>
                    {activeNews?.source && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-400" />
                        <span className="text-[#89b441]">{activeNews.source}</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white leading-tight tracking-tight mb-3 group-hover:text-blue-100 transition-colors">
                    {activeNews?.title}
                  </h3>

                  {/* Subtitle / Description */}
                  <p className="text-slate-200 text-xs sm:text-sm sm:leading-relaxed line-clamp-3 mb-5 max-w-2xl">
                    {activeNews?.summary || activeNews?.description}
                  </p>

                  {/* Action Link */}
                  {activeNews?.url && (
                    <Link
                      href={activeNews.url}
                      className="inline-flex items-center gap-2 text-xs font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl transition-all w-fit"
                    >
                      <span>Read Full Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Other News List (Scrollable when more feeds exist) */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col lg:h-[540px]">
              {/* Header / Feed indicator */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-100 mb-2 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2376b8] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Latest Stories <span className="text-slate-400 font-semibold">({displayNews.length})</span>
                  </span>
                </div>
                {displayNews.length > 3 && (
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <span>Scroll for more</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#2376b8] animate-bounce" />
                  </span>
                )}
              </div>

              {/* Scroll Container with smooth scroll effect and sleek styling */}
              <div className="flex-1 overflow-y-auto pr-1.5 sm:pr-2 space-y-3 sm:space-y-3.5 news-feed-scroll max-h-[440px] sm:max-h-[480px] lg:max-h-none overscroll-contain">
                {displayNews.map((item, idx) => {
                  const isSelected = idx === selectedNewsIndex;
                  const dateStr = item?.publishedAt
                    ? (typeof item.publishedAt === 'string'
                        ? item.publishedAt
                        : new Date(item.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }))
                    : 'Recent';

                  return (
                    <button
                      key={item?._id || item?.title || idx}
                      type="button"
                      onClick={() => handleSelectNews(idx)}
                      className={`w-full text-left flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer group relative ${
                        isSelected
                          ? 'border-[#2376b8] ring-2 ring-[#2376b8]/15 bg-[#f0f6fb]/80 shadow-md'
                          : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      {/* Thumbnail Image */}
                      <div className="w-20 sm:w-28 h-18 sm:h-20 rounded-xl overflow-hidden shrink-0 relative bg-slate-100 border border-slate-200/60">
                        <img
                          src={item?.imageUrl || 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80'}
                          alt={item?.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        {/* Top Row: Date & Read Time */}
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-medium mb-1">
                          <span>{dateStr}</span>
                          <span className="flex items-center gap-1.5">
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2376b8]" />
                            )}
                            {item?.readTime || '4 min Read'}
                          </span>
                        </div>

                        {/* Main Title */}
                        <h4
                          className={`font-bold text-xs sm:text-sm line-clamp-2 leading-snug transition-colors ${
                            isSelected ? 'text-[#2376b8]' : 'text-slate-900 group-hover:text-[#2376b8]'
                          }`}
                        >
                          {item?.title}
                        </h4>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* 6. FINANCIAL VIDEO (Cinematic Full-Width Showcase with In-Video Bottom-Right Title) */}
      <section id="financial-video" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-20 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Video Covering Page Length-Wise (Full Width & Responsive 16:9) */}
          <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-200/80">
            <iframe
              src={getEmbedUrl(financialVideo?.embedUrl || financialVideo?.videoUrl || 'https://www.youtube.com/embed/1-S_q_kUeYw')}
              title={financialVideo?.title || 'Financial Video'}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />

            {/* Title Inside Video (Bottom-Right Position, Right-Aligned Plain Text) */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-20 pointer-events-none text-right max-w-[85%] sm:max-w-md lg:max-w-xl">
              <h2 className="text-sm sm:text-base lg:text-xl font-extrabold text-white tracking-tight leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] text-right">
                {financialVideo?.title || 'The Power of Compounding & Wealth Creation: Practical Advisory Guide'}
              </h2>
            </div>
          </div>
        </div>
      </section>

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

                <div className="text-xs text-slate-400">
                  Compatible with iOS, Android & Desktop Browsers
                </div>
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
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3.5 py-1 rounded-full border border-[#2376b8]/20 inline-block mb-3">
              Client Trust & Voices
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2b44] tracking-tight">
              Trusted by Discerning Families Across Odisha
            </h2>
            <p className="text-slate-600 mt-4 leading-relaxed">
              Real stories of financial discipline, goal achievement, and transparent fiduciary stewardship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#f87b1f] mb-4">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                    &quot;{t.reviewText || t.quote || ''}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2376b8] to-[#0f2b44] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {t.clientName ? t.clientName.charAt(0) : 'C'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0f2b44]">{t.clientName || 'Client'}</h3>
                    <p className="text-xs text-slate-500">{t.designation || 'Investor'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PARTNERS LOGOS (Marquee Infinite Scroll) */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6 sm:mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#2376b8]/10 px-3.5 py-1 rounded-full border border-[#2376b8]/20 inline-block mb-3">
            Institutional Alliances
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2b44] tracking-tight">
            Partnering with India's Leading Asset Management Companies &amp; Insurers
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-2xl mx-auto">
            Direct fiduciary empanelment across India's foremost mutual fund houses, portfolio managers, and insurance underwriters.
          </p>
        </div>

        {/* Marquee with Soft Edge Gradients */}
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-20 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-20 bg-gradient-to-l from-white to-transparent" />

          <Marquee pauseOnHover={true} speed={30} className="mt-0 sm:mt-0">
            {partners.map((p, idx) => (
              <div
                key={idx}
                className="mx-2 sm:mx-3 flex items-center gap-3.5 bg-[#f8fafc] hover:bg-white px-5 py-3 rounded-2xl border border-slate-200/80 hover:border-[#2376b8]/40 hover:shadow-lg transition-all duration-300 cursor-pointer group shrink-0"
              >
                {/* Brand Logo Symbol */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-xs border transition-transform duration-300 group-hover:scale-105 shrink-0"
                  style={{
                    backgroundColor: `${p.badgeColor || '#004c8f'}12`,
                    borderColor: `${p.badgeColor || '#004c8f'}30`,
                    color: p.badgeColor || '#004c8f',
                  }}
                >
                  {p.shortName || (p.name ? p.name.substring(0, 3).toUpperCase() : 'AMC')}
                </div>

                {/* Brand Name & Category */}
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-bold text-[#0f2b44] group-hover:text-[#2376b8] transition-colors whitespace-nowrap">
                    {p.name}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                    {p.category}
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* 11. REQUEST A CALL BACK FORM (Working End-to-End) */}
      <section id="contact" className="py-20 bg-[#0f2b44] text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-slate-900/90 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl backdrop-blur-sm">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f87b1f] bg-[#f87b1f]/15 px-3 py-1 rounded-full border border-[#f87b1f]/30 inline-block mb-3">
                Personalized Consultation
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Request a Confidential Call Back
              </h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                Connect with our senior wealth advisors in Bhubaneswar to discuss your financial roadmap, portfolio health checkup, or retirement goals.
              </p>
            </div>

            {submitSuccess ? (
              <div className="bg-emerald-950/60 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#89b441] mx-auto" />
                <h3 className="text-lg font-bold text-white">Request Received Successfully</h3>
                <p className="text-sm text-slate-300">
                  Thank you! Our advisory team at Saheed Nagar / Jaydev Vihar will contact you at your preferred time.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-2 text-xs font-semibold text-[#f87b1f] underline"
                >
                  Submit another consultation request
                </button>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="space-y-5">
                {submitError && (
                  <div className="bg-rose-950/60 border border-rose-500/50 text-rose-200 text-sm p-4 rounded-xl">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Mohanty"
                      value={callbackForm.name}
                      onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#2376b8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 94370 12345"
                      value={callbackForm.phone}
                      onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#2376b8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Area of Interest
                    </label>
                    <select
                      value={callbackForm.serviceOfInterest}
                      onChange={(e) => setCallbackForm({ ...callbackForm, serviceOfInterest: e.target.value })}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2376b8]"
                    >
                      <option value="Mutual Funds & SIP">Mutual Funds & Systematic Investment Plan (SIP)</option>
                      <option value="Comprehensive Financial Planning">Comprehensive Financial Planning</option>
                      <option value="Life & Health Insurance">Life & Health Insurance Planning</option>
                      <option value="NRI Wealth Advisory">NRI Wealth & Repatriation Advisory</option>
                      <option value="Real Estate Advisory">Real Estate Property Advisory</option>
                      <option value="Fixed Deposits & Bonds">Fixed Deposits & Bonds</option>
                      <option value="Portfolio Management (PMS)">Portfolio Management Service (PMS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Preferred Callback Window
                    </label>
                    <select
                      value={callbackForm.preferredTime}
                      onChange={(e) => setCallbackForm({ ...callbackForm, preferredTime: e.target.value })}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#2376b8]"
                    >
                      <option value="Anytime">Anytime during business hours</option>
                      <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                      <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                      <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Brief Note or Question (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your investment horizon or specific financial question..."
                    value={callbackForm.message}
                    onChange={(e) => setCallbackForm({ ...callbackForm, message: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#2376b8]"
                  />
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto bg-[#f87b1f] hover:bg-[#d9620b] disabled:opacity-50 text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg shadow-[#f87b1f]/25 transition-all"
                  >
                    {submitting ? 'Submitting Request...' : 'Schedule Confidential Call Back'}
                  </button>
                  <p className="text-xs text-slate-400 mt-3">
                    We maintain strict confidentiality. Your details will never be shared with third parties.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
