'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, ArrowRight, Info } from 'lucide-react'
import { formatINR } from '@/lib/utils'

export default function MarketUpdatePage () {
  const [marketData, setMarketData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('popular')
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchMarketData () {
      try {
        setLoading(true)
        setError('')

        const res = await fetch('/api/v1/public/market-data')

        if (!res.ok) {
          throw new Error('Failed to fetch market data.')
        }

        const json = await res.json()

        if (!isMounted) return

        if (json.success) {
          setMarketData(json.data || {})
        } else {
          setError(json.message || 'Unable to load market data.')
        }
      } catch (err) {
        console.error('Failed to fetch market data:', err)

        if (isMounted) {
          setError('Unable to load market data. Please try again later.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchMarketData()

    return () => {
      isMounted = false
    }
  }, [])

  const indices = Array.isArray(marketData?.indices) ? marketData.indices : []

  const news = marketData?.news || {
    popular: [],
    ipo: [],
    market: []
  }

  const currentNews = Array.isArray(news[activeTab]) ? news[activeTab] : []

  // Safely convert values received from the API to numbers.
  const getNumericValue = value => {
    if (value === null || value === undefined || value === '') {
      return null
    }

    const number = Number(value)

    return Number.isFinite(number) ? number : null
  }

  // Format market values without crashing on missing or invalid data.
  const formatMarketValue = value => {
    const number = getNumericValue(value)

    return number === null ? 'N/A' : formatINR(number)
  }

  const formatChange = value => {
    const number = getNumericValue(value)

    return number === null ? 'N/A' : number.toFixed(2)
  }

  const getNewsValue = (value, fallback = '') => {
    return typeof value === 'string' && value.trim() ? value : fallback
  }

  return (
    <div className='w-full bg-[#F8F7F3]'>
      {/* Banner */}
      <section className='bg-[#10243A] text-white py-16 text-center'>
        <div className='max-w-4xl mx-auto px-4'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A76C]/20 border border-[#C7A76C]/30 text-[#dfc593] text-xs font-bold uppercase tracking-wider mb-4'>
            <TrendingUp className='w-3.5 h-3.5 text-[#C7A76C]' />
            <span>Market Intelligence Desk</span>
          </div>

          <h1 className='text-3xl sm:text-5xl font-extrabold tracking-tight'>
            Indian Market Update &amp; Indices
          </h1>

          <p className='text-slate-300 mt-4 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto'>
            Comprehensive market snapshot of benchmark indices, upcoming IPO
            pipelines, and macroeconomic commentaries for disciplined investors.
          </p>
        </div>
      </section>

      {/* Market Indices Cards */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12'>
          {loading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[1, 2, 3, 4].map(item => (
                <div
                  key={item}
                  className='bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm animate-pulse'
                >
                  <div className='h-3 w-20 bg-slate-200 rounded mb-4' />
                  <div className='h-5 w-36 bg-slate-200 rounded mb-4' />
                  <div className='h-8 w-28 bg-slate-200 rounded mb-3' />
                  <div className='h-3 w-24 bg-slate-200 rounded' />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className='bg-white rounded-2xl p-8 border border-rose-200 text-center'>
              <p className='text-rose-600 font-semibold'>{error}</p>

              <button
                type='button'
                onClick={() => window.location.reload()}
                className='mt-4 px-5 py-2.5 rounded-lg bg-[#10243A] text-white text-sm font-semibold hover:bg-[#1b3858] transition-colors'
              >
                Retry
              </button>
            </div>
          ) : indices.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {indices.map((idx, index) => {
                const change = getNumericValue(idx?.change)
                const percentChange = getNumericValue(idx?.percentChange)

                const isPositive =
                  change !== null
                    ? change >= 0
                    : percentChange !== null
                    ? percentChange >= 0
                    : true

                return (
                  <div
                    key={idx?.symbol || `${idx?.name || 'index'}-${index}`}
                    className='bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between'
                  >
                    <div>
                      <div className='flex items-center justify-between text-xs text-slate-400 font-bold uppercase mb-2'>
                        <span>{idx?.symbol || 'N/A'}</span>

                        <span className='text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded'>
                          Market Index
                        </span>
                      </div>

                      <h3 className='text-lg font-bold text-[#10243A]'>
                        {idx?.name || 'Unnamed Index'}
                      </h3>

                      <div className='text-2xl font-extrabold text-[#10243A] mt-2'>
                        {formatMarketValue(idx?.currentValue)}
                      </div>

                      <div
                        className={`text-xs font-bold mt-1 flex items-center gap-1 ${
                          isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {change === null
                          ? 'N/A'
                          : `${change > 0 ? '+' : ''}${change.toFixed(2)}`}

                        <span>
                          (
                          {percentChange === null
                            ? 'N/A'
                            : `${
                                percentChange > 0 ? '+' : ''
                              }${percentChange.toFixed(2)}%`}
                          )
                        </span>
                      </div>
                    </div>

                    <div className='mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex flex-wrap justify-between gap-2'>
                      <span>52W High: {formatMarketValue(idx?.high52)}</span>

                      <span>52W Low: {formatMarketValue(idx?.low52)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className='bg-white rounded-2xl p-8 border border-slate-200 text-center'>
              <TrendingUp className='w-10 h-10 text-[#C7A76C] mx-auto mb-3' />

              <h2 className='text-lg font-bold text-[#10243A]'>
                No Market Indices Available
              </h2>

              <p className='text-sm text-slate-500 mt-2'>
                Market index data is currently unavailable. Please check again
                later.
              </p>
            </div>
          )}

          {/* Market Intelligence News */}
          <div className='bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8'>
            <div className='flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6'>
              <div>
                <h2 className='text-2xl font-bold text-[#10243A]'>
                  Market Intelligence Briefings
                </h2>

                <p className='text-xs text-slate-500 mt-1'>
                  Curated briefings from the Finasset Wealth Research Desk.
                </p>
              </div>

              <div className='flex flex-wrap items-center justify-center bg-[#F8F7F3] p-1 rounded-xl border border-slate-200'>
                <button
                  type='button'
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
                  type='button'
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
                  type='button'
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

            {loading ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[1, 2, 3].map(item => (
                  <div
                    key={item}
                    className='bg-[#F8F7F3] rounded-2xl p-6 border border-slate-200/80 animate-pulse'
                  >
                    <div className='h-4 w-24 bg-slate-200 rounded mb-4' />
                    <div className='h-5 w-full bg-slate-200 rounded mb-3' />
                    <div className='h-3 w-full bg-slate-200 rounded mb-2' />
                    <div className='h-3 w-2/3 bg-slate-200 rounded' />
                  </div>
                ))}
              </div>
            ) : currentNews.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {currentNews.map((item, i) => (
                  <div
                    key={item?._id || item?.id || `${activeTab}-${i}`}
                    className='bg-[#F8F7F3] rounded-2xl p-6 border border-slate-200/80 hover:shadow-md transition-shadow flex flex-col justify-between'
                  >
                    <div>
                      <div className='flex items-center justify-between gap-3 text-xs text-slate-400 mb-3'>
                        <span className='font-semibold text-[#10243A] bg-white px-2.5 py-1 rounded border border-slate-200'>
                          {getNewsValue(item?.badge, 'Market Update')}
                        </span>

                        <span>
                          {getNewsValue(item?.source, 'Finasset Wealth')}
                        </span>
                      </div>

                      <h3 className='text-base font-bold text-[#10243A] mb-2 leading-snug'>
                        {getNewsValue(item?.title, 'Market briefing')}
                      </h3>

                      <p className='text-xs text-slate-600 leading-relaxed mb-4'>
                        {getNewsValue(
                          item?.summary,
                          'Details will be available soon.'
                        )}
                      </p>
                    </div>

                    <Link
                      href={
                        typeof item?.url === 'string' && item.url.trim()
                          ? item.url
                          : '/blog'
                      }
                      className='text-xs font-bold text-[#C7A76C] hover:text-[#a88547] flex items-center gap-1'
                    >
                      <span>Read Analysis</span>
                      <ArrowRight className='w-3 h-3' />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-10'>
                <p className='text-sm text-slate-500'>
                  No briefings are available in this category right now.
                </p>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className='bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-500 leading-relaxed flex items-start gap-3'>
            <Info className='w-4 h-4 text-[#C7A76C] shrink-0 mt-0.5' />

            <span>
              <strong>Market Data Notice:</strong> Indices and news feeds shown
              here are curated periodically for illustrative educational review.
              Finasset Wealth does not engage in intraday stock tips or
              speculative trading recommendations.
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
