'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, FileText, TrendingUp } from 'lucide-react';
import { useNewsStore } from '@/store/useNewsStore';

function formatNewsDate(item) {
  if (item?.date) return item.date;
  if (item?.publishedAt) {
    return typeof item.publishedAt === 'string'
      ? item.publishedAt
      : new Date(item.publishedAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
  }
  return '11 Jan, 2025';
}

/**
 * News Feed Component
 * Fetches news via the Zustand store (Axios) and falls back to `initialNews`
 * (from the home API) when the store has nothing yet.
 * Usage: <NewsFeed initialNews={newsItems} />
 */
export default function NewsFeed({ initialNews = [] }) {
  const {
    newsItems: storeNews,
    activeNews: storeActive,
    selectedNewsIndex,
    selectNews,
    fetchNews,
  } = useNewsStore();

  useEffect(() => {
    fetchNews(false);
  }, [fetchNews]);

  const displayNews =
    Array.isArray(storeNews) && storeNews.length > 0
      ? storeNews
      : Array.isArray(initialNews) && initialNews.length > 0
      ? initialNews
      : [];

  const activeNews =
    storeActive || (displayNews.length > 0 ? displayNews[selectedNewsIndex] || displayNews[0] : null);

  const handleSelectNews = (idx) => {
    selectNews(idx);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const el = document.getElementById('featured-news-card');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <section id="news-feed" className="py-10 sm:py-14 bg-white scroll-mt-20 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#2376b8]/10 px-3.5 py-1 rounded-full border border-[#2376b8]/20 inline-block mb-2.5">
              Market Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-900 tracking-tight">
              News Feed
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md text-left sm:text-right leading-relaxed">
            Curated market reports, macroeconomic shifts, and fiduciary advisory commentary updated regularly.
          </p>
        </div>

        {displayNews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-10 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto text-[#2376b8]">
              <FileText className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">No News Available</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto mt-1.5">
                There are currently no published market stories or editorial feeds available. Please check back soon for our latest financial insights and advisory commentary.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            {/* Left: Featured news */}
            <div id="featured-news-card" className="lg:col-span-7 xl:col-span-8 scroll-mt-24">
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 h-[340px] sm:h-[380px] lg:h-[420px] flex flex-col justify-between p-5 sm:p-7 group">
                {activeNews?.imageUrl ? (
                  <div
                    key={activeNews?._id || activeNews?.title || selectedNewsIndex}
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105 animate-in fade-in duration-500"
                    style={{ backgroundImage: `url('${activeNews.imageUrl}')` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#10243A] via-[#163352] to-[#0a1827] flex items-center justify-center">
                    <div className="text-center p-6 opacity-25">
                      <TrendingUp className="w-14 h-14 text-[#C7A76C] mx-auto mb-2" />
                      <span className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
                        Finasset Market Intelligence
                      </span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/20 z-10" />

                <div className="relative z-20 self-start">
                  <span className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 font-extrabold text-xs shadow-lg tracking-wide border border-white/80">
                    {activeNews?.tag || activeNews?.badge || 'Tax Alert'}
                  </span>
                </div>

                <div className="relative z-20 flex flex-col justify-end text-left">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-300 mb-2">
                    <span>{formatNewsDate(activeNews)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
                    <span>{activeNews?.readTime || '3 min Read'}</span>
                    {(activeNews?.subTag || activeNews?.source) && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-400" />
                        <span className="text-[#89b441] font-bold">
                          {activeNews?.subTag || activeNews?.source}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-white leading-tight tracking-tight mb-2 line-clamp-2 group-hover:text-blue-100 transition-colors">
                    {activeNews?.title}
                  </h3>

                  <p className="text-slate-200 text-xs sm:text-sm sm:leading-relaxed line-clamp-2 mb-4 max-w-2xl">
                    {activeNews?.description || activeNews?.summary}
                  </p>

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

            {/* Right: Story list */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col lg:h-[420px]">
              <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-100 mb-2 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2376b8] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Latest Stories{' '}
                    <span className="text-slate-400 font-semibold">({displayNews.length})</span>
                  </span>
                </div>
                {displayNews.length > 3 && (
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <span>Scroll for more</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#2376b8] animate-bounce" />
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto pr-1.5 sm:pr-2 space-y-2.5 news-feed-scroll max-h-[360px] lg:max-h-none overscroll-contain">
                {displayNews.map((item, idx) => {
                  const isSelected = idx === selectedNewsIndex;
                  const dateStr = formatNewsDate(item);
                  const readTimeStr = item?.readTime || '3 min Read';

                  return (
                    <button
                      key={item?._id || item?.title || idx}
                      type="button"
                      onClick={() => handleSelectNews(idx)}
                      className={`w-full text-left flex items-center gap-3 p-2.5 rounded-2xl border transition-all duration-300 cursor-pointer group relative ${
                        isSelected
                          ? 'border-[#2376b8] ring-2 ring-[#2376b8]/15 bg-[#f0f6fb]/80 shadow-md'
                          : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      <div className="w-20 sm:w-24 h-16 sm:h-[4.5rem] rounded-xl overflow-hidden shrink-0 relative bg-slate-100 border border-slate-200/60 flex items-center justify-center">
                        {item?.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item?.title || 'News'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <FileText className="w-6 h-6 stroke-[1.5]" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
                          <span>{dateStr}</span>
                          <span className="flex items-center gap-1.5">
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#2376b8]" />}
                            {readTimeStr}
                          </span>
                        </div>

                        <h4
                          className={`font-bold text-xs sm:text-[13px] line-clamp-2 leading-snug transition-colors ${
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
        )}
      </div>
    </section>
  );
}