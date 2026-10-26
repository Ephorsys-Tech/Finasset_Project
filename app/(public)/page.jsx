'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
  Sparkles,
  ExternalLink,
  Award,
  Target,
  CreditCard,
  Zap,
  Play,
  Smartphone,
  Star
} from 'lucide-react'
import { formatINR } from '@/lib/utils'

export default function HomePage () {
  const [homeData, setHomeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [newsTab, setNewsTab] = useState('popular')

  const [callbackForm, setCallbackForm] = useState({
    name: '',
    phone: '',
    serviceOfInterest: 'Mutual Funds & SIP',
    preferredTime: 'Anytime',
    message: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function fetchHomeData () {
      try {
        const res = await fetch('/api/v1/public/home')

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`)
        }

        const json = await res.json()

        if (!cancelled && json?.success) {
          setHomeData(json.data || {})
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch home data:', err)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchHomeData()

    return () => {
      cancelled = true
    }
  }, [])

  const slides = Array.isArray(homeData?.heroSlides) ? homeData.heroSlides : []

  const services = Array.isArray(homeData?.services) ? homeData.services : []

  const investorTools = Array.isArray(homeData?.investorTools)
    ? homeData.investorTools
    : []

  const marketIndices = Array.isArray(homeData?.marketIndices)
    ? homeData.marketIndices
    : []

  const newsItems = Array.isArray(homeData?.newsItems) ? homeData.newsItems : []

  const testimonials = Array.isArray(homeData?.testimonials)
    ? homeData.testimonials
    : []

  const partners = Array.isArray(homeData?.partners) ? homeData.partners : []

  useEffect(() => {
    if (slides.length <= 1) {
      setCurrentSlide(0)
      return
    }

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [slides.length])

  // Keep the selected slide within the valid range if API data changes.
  const activeSlide =
    slides.length > 0 ? slides[currentSlide % slides.length] : null

  const filteredNews = newsItems.filter(item => item?.tab === newsTab)

  const handleCallbackSubmit = async e => {
    e.preventDefault()

    if (submitting) return

    setSubmitting(true)
    setSubmitError('')
    setSubmitSuccess(false)

    try {
      const res = await fetch('/api/v1/public/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...callbackForm,
          type: 'callback',
          sourcePage: 'Homepage Call Back Form'
        })
      })

      const data = await res.json()

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to submit request')
      }

      setSubmitSuccess(true)

      setCallbackForm({
        name: '',
        phone: '',
        serviceOfInterest: 'Mutual Funds & SIP',
        preferredTime: 'Anytime',
        message: ''
      })
    } catch (err) {
      setSubmitError(
        err.message ||
          'Network error. Please try again or call our office directly.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const getServiceIcon = iconName => {
    const iconClass = 'w-6 h-6 text-[#C7A76C]'

    switch (iconName) {
      case 'Compass':
        return <Compass className={iconClass} />
      case 'TrendingUp':
        return <TrendingUp className={iconClass} />
      case 'ShieldCheck':
        return <ShieldCheck className={iconClass} />
      case 'Building':
        return <Building className={iconClass} />
      case 'Landmark':
        return <Landmark className={iconClass} />
      case 'PieChart':
        return <PieChart className={iconClass} />
      default:
        return <TrendingUp className={iconClass} />
    }
  }

  const getToolIcon = iconName => {
    const iconClass = 'w-7 h-7 text-[#C7A76C]'

    switch (iconName) {
      case 'Calculator':
        return <Calculator className={iconClass} />
      case 'Target':
        return <Target className={iconClass} />
      case 'Activity':
        return <TrendingUp className={iconClass} />
      case 'CreditCard':
        return <CreditCard className={iconClass} />
      case 'Zap':
        return <Zap className={iconClass} />
      default:
        return <Calculator className={iconClass} />
    }
  }

  return (
    <div className='w-full'>
      {/* 1. HERO BANNER CAROUSEL */}
      <section className='relative w-full min-h-[580px] lg:min-h-[640px] bg-[#10243A] text-white flex items-center overflow-hidden'>
        {activeSlide?.bgImageUrl || activeSlide?.imageUrl ? (
          <div
            className='absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105'
            style={{
              backgroundImage: `url("${
                activeSlide.bgImageUrl || activeSlide.imageUrl
              }")`
            }}
          />
        ) : null}

        <div className='absolute inset-0 bg-gradient-to-r from-[#10243A] via-[#10243A]/90 to-[#10243A]/60 z-10' />

        <div className='relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full'>
          <div className='max-w-3xl'>
            <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C7A76C]/20 border border-[#C7A76C]/40 text-[#dfc593] text-xs font-semibold uppercase tracking-wider mb-6'>
              <Sparkles className='w-3.5 h-3.5 text-[#C7A76C]' />
              <span>
                {activeSlide?.badge ||
                  activeSlide?.badgeText ||
                  'Finasset Wealth Management'}
              </span>
            </div>

            <h1 className='text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6'>
              {activeSlide?.title ||
                'Architecting Generational Wealth for Discerning Families'}
            </h1>

            <p className='text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl'>
              {activeSlide?.description ||
                activeSlide?.subtitle ||
                'Personalized wealth management, structured portfolio strategies, and bespoke financial solutions guided by seasoned advisors in Bhubaneswar.'}
            </p>

            <div className='flex flex-wrap items-center gap-4'>
              <Link
                href={activeSlide?.cta1Url || '/services'}
                className='bg-[#C7A76C] hover:bg-[#dfc593] text-[#10243A] font-bold text-sm sm:text-base px-6 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group'
              >
                <span>{activeSlide?.cta1Text || 'Explore Our Services'}</span>
                <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
              </Link>

              <Link
                href={activeSlide?.cta2Url || '/investor/financial-calculator'}
                className='bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-lg transition-all backdrop-blur-sm flex items-center gap-2'
              >
                <Calculator className='w-4 h-4 text-[#C7A76C]' />
                <span>{activeSlide?.cta2Text || 'Calculate Your Wealth'}</span>
              </Link>
            </div>

            {activeSlide?.statsHighlight && (
              <div className='mt-10 pt-6 border-t border-slate-700/60 inline-flex items-center gap-4 text-xs sm:text-sm text-slate-300'>
                <div className='flex items-center gap-1.5 text-[#C7A76C] font-semibold'>
                  <ShieldCheck className='w-4 h-4' />
                  <span>{activeSlide.statsHighlight.label}:</span>
                </div>
                <span className='text-white font-bold'>
                  {activeSlide.statsHighlight.value}
                </span>
              </div>
            )}
          </div>

          {slides.length > 1 && (
            <div className='flex items-center gap-4 mt-8'>
              <button
                type='button'
                onClick={() =>
                  setCurrentSlide(
                    prev => (prev - 1 + slides.length) % slides.length
                  )
                }
                className='p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10'
                aria-label='Previous slide'
              >
                <ChevronLeft className='w-5 h-5' />
              </button>

              <div className='flex gap-1.5'>
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type='button'
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === idx
                        ? 'w-8 bg-[#C7A76C]'
                        : 'w-2 bg-white/30'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type='button'
                onClick={() =>
                  setCurrentSlide(prev => (prev + 1) % slides.length)
                }
                className='p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10'
                aria-label='Next slide'
              >
                <ChevronRight className='w-5 h-5' />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. MARKET WATCH STRIP */}
      <section className='bg-white border-b border-slate-200 py-3 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10243A]'>
              <span className='w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse' />
              <span>Market Watch</span>
            </div>

            <div className='flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs'>
              {marketIndices.map((idx, index) => {
                const hasValue = value =>
                  value !== null &&
                  value !== undefined &&
                  value !== '' &&
                  Number.isFinite(Number(value))

                const hasChange = hasValue(idx?.change)
                const hasPercentChange = hasValue(idx?.percentChange)
                const hasCurrentValue = hasValue(idx?.currentValue)

                const changeValue = hasChange ? Number(idx.change) : 0

                const percentChangeValue = hasPercentChange
                  ? Number(idx.percentChange)
                  : 0

                const currentValue = hasCurrentValue
                  ? Number(idx.currentValue)
                  : 0

                const isPositive = changeValue >= 0

                return (
                  <div
                    key={idx?.symbol || idx?.name || index}
                    className='flex items-center gap-2 whitespace-nowrap'
                  >
                    <span className='font-bold text-slate-700'>
                      {idx?.name || 'Market Index'}
                    </span>

                    <span className='font-semibold text-slate-900'>
                      {hasCurrentValue ? formatINR(currentValue) : 'N/A'}
                    </span>

                    <span
                      className={`font-semibold flex items-center ${
                        !hasChange
                          ? 'text-slate-500'
                          : isPositive
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {hasChange ? (
                        <>
                          {isPositive ? '+' : ''}
                          {changeValue.toFixed(2)}
                        </>
                      ) : (
                        'N/A'
                      )}

                      {' ('}

                      {hasPercentChange ? (
                        <>
                          {percentChangeValue >= 0 ? '+' : ''}
                          {percentChangeValue.toFixed(2)}%
                        </>
                      ) : (
                        'N/A'
                      )}

                      {')'}
                    </span>
                  </div>
                )
              })}
            </div>

            <Link
              href='/market-update'
              className='text-xs font-semibold text-[#C7A76C] hover:text-[#a88547] flex items-center gap-1 shrink-0'
            >
              <span>Full Indices & IPOs</span>
              <ArrowRight className='w-3 h-3' />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. INTRODUCTION TO FINASSET WEALTH */}
      <section className='py-20 bg-[#F8F7F3]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10243A]/5 border border-[#10243A]/10 text-[#10243A] text-xs font-bold uppercase tracking-wider mb-4'>
                <Award className='w-3.5 h-3.5 text-[#C7A76C]' />
                <span>Bhubaneswar Wealth Advisory</span>
              </div>

              <h2 className='text-3xl sm:text-4xl font-extrabold text-[#10243A] tracking-tight leading-tight mb-6'>
                Disciplined Wealth Creation Grounded in Fiduciary Integrity
              </h2>

              <p className='text-slate-600 leading-relaxed mb-6'>
                <strong>Finasset Wealth</strong> is a dedicated wealth
                management advisory firm, a proud group of{' '}
                <strong>NLF Adhira Asset Services LLP</strong>, headquartered in
                Bhubaneswar, Odisha. We partner with families, professionals,
                doctors, and business leaders to navigate financial complexities
                and build resilient, multi-generational legacies.
              </p>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'>
                {[
                  {
                    title: 'Goal-Based Portfolios',
                    description:
                      'SIPs mapped to tangible retirement and education goals.'
                  },
                  {
                    title: '35+ Leading AMCs',
                    description:
                      'Unbiased fund selection across top mutual fund houses.'
                  },
                  {
                    title: 'Comprehensive Protection',
                    description:
                      'High-cover pure term and indemnity health insurance.'
                  },
                  {
                    title: 'Global NRI Solutions',
                    description:
                      'FEMA, NRE/NRO banking & repatriation assistance.'
                  }
                ].map(item => (
                  <div
                    key={item.title}
                    className='flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm'
                  >
                    <CheckCircle2 className='w-5 h-5 text-[#C7A76C] shrink-0 mt-0.5' />
                    <div>
                      <h3 className='font-bold text-sm text-[#10243A]'>
                        {item.title}
                      </h3>
                      <p className='text-xs text-slate-500 mt-0.5'>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='flex flex-wrap items-center gap-4'>
                <Link
                  href='/about-us'
                  className='bg-[#10243A] hover:bg-[#1b3858] text-white font-semibold text-sm px-5 py-3 rounded-lg transition-all flex items-center gap-2'
                >
                  <span>Learn Our Philosophy</span>
                  <ArrowRight className='w-4 h-4 text-[#C7A76C]' />
                </Link>

                <Link
                  href='/contact-us'
                  className='text-[#10243A] font-semibold text-sm hover:underline flex items-center gap-1.5'
                >
                  <span>Visit Our Bhubaneswar Office</span>
                  <ArrowRight className='w-4 h-4' />
                </Link>
              </div>
            </div>

            <div className='relative'>
              <div className='relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white'>
                <img
                  src='https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop'
                  alt='Finasset Wealth Financial Advisory'
                  className='w-full h-[440px] object-cover'
                />

                <div className='absolute inset-0 bg-gradient-to-t from-[#10243A] via-transparent to-transparent' />

                <div className='absolute bottom-6 left-6 right-6 text-white'>
                  <span className='text-xs font-bold text-[#C7A76C] uppercase tracking-wider block'>
                    Our Commitment
                  </span>

                  <p className='text-lg font-bold leading-snug mt-1'>
                    &quot;We don&apos;t just allocate funds; we engineer your
                    family&apos;s peace of mind.&quot;
                  </p>
                </div>
              </div>

              <div className='absolute -bottom-6 -right-4 sm:right-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 max-w-xs hidden sm:block'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 rounded-lg bg-[#10243A] flex items-center justify-center text-[#C7A76C]'>
                    <Shield className='w-6 h-6' />
                  </div>

                  <div>
                    <div className='text-xl font-extrabold text-[#10243A]'>
                      15+ Years
                    </div>
                    <div className='text-xs text-slate-500 font-medium'>
                      Trusted Advisory in Odisha
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR SERVICES */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center max-w-3xl mx-auto mb-16'>
            <span className='text-xs font-bold uppercase tracking-wider text-[#C7A76C] block mb-2'>
              Holistic Wealth Solutions
            </span>

            <h2 className='text-3xl sm:text-4xl font-extrabold text-[#10243A] tracking-tight'>
              Bespoke Advisory Built Around Your Life Goals
            </h2>

            <p className='text-slate-600 mt-4 leading-relaxed'>
              Every financial journey is distinct. Explore our six core wealth
              disciplines designed to grow, safeguard, and transition your
              assets seamlessly.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {services.map((service, index) => (
              <div
                key={service?.slug || index}
                className='bg-[#F8F7F3] rounded-2xl p-7 border border-slate-200/80 hover:border-[#C7A76C]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group'
              >
                <div>
                  <div className='w-14 h-14 rounded-xl bg-[#10243A] flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform'>
                    {getServiceIcon(service?.iconName)}
                  </div>

                  <h3 className='text-xl font-bold text-[#10243A] mb-3 group-hover:text-[#C7A76C] transition-colors'>
                    {service?.name || 'Financial Service'}
                  </h3>

                  <p className='text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3'>
                    {service?.shortDescription || ''}
                  </p>

                  {Array.isArray(service?.keyBenefits) &&
                    service.keyBenefits.length > 0 && (
                      <ul className='space-y-2 mb-6 border-t border-slate-200/60 pt-4'>
                        {service.keyBenefits.slice(0, 2).map((benefit, i) => (
                          <li
                            key={i}
                            className='text-xs text-slate-700 flex items-center gap-2'
                          >
                            <CheckCircle2 className='w-3.5 h-3.5 text-[#C7A76C] shrink-0' />
                            <span className='font-medium line-clamp-1'>
                              {benefit?.title || ''}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>

                <Link
                  href={`/services/${service?.slug || ''}`}
                  className='inline-flex items-center gap-2 text-sm font-bold text-[#10243A] group-hover:text-[#C7A76C] transition-colors mt-2'
                >
                  <span>Explore {service?.name || 'Service'}</span>
                  <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                </Link>
              </div>
            ))}
          </div>

          <div className='text-center mt-12'>
            <Link
              href='/services'
              className='inline-flex items-center gap-2 text-sm font-bold text-[#10243A] hover:text-[#C7A76C] transition-colors'
            >
              <span>View All Financial Advisory Disciplines</span>
              <ArrowRight className='w-4 h-4' />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. INVESTOR'S CORNER */}
      <section className='py-20 bg-[#10243A] text-white relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-[#C7A76C]/10 rounded-full blur-3xl pointer-events-none' />
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl pointer-events-none' />

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center max-w-3xl mx-auto mb-16'>
            <span className='text-xs font-bold uppercase tracking-wider text-[#C7A76C] block mb-2'>
              Investor Empowerment
            </span>

            <h2 className='text-3xl sm:text-4xl font-extrabold text-white tracking-tight'>
              Investor&apos;s Corner — Interactive Tools & Portals
            </h2>

            <p className='text-slate-300 mt-4 leading-relaxed'>
              Equip yourself with institutional-grade financial utilities.
              Calculate compounding wealth, test your risk tolerance, diagnose
              financial wellness, and transact seamlessly.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {investorTools.map((tool, index) => (
              <div
                key={tool?.key || index}
                className='bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#C7A76C]/60 transition-all duration-300 flex flex-col justify-between group backdrop-blur-sm'
              >
                <div>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center'>
                      {getToolIcon(tool?.iconName)}
                    </div>

                    <span className='text-[11px] font-bold uppercase tracking-wider text-[#dfc593] bg-[#C7A76C]/15 px-2.5 py-1 rounded-full border border-[#C7A76C]/30'>
                      {tool?.badge || 'Investor Tool'}
                    </span>
                  </div>

                  <h3 className='text-xl font-bold text-white mb-2 group-hover:text-[#C7A76C] transition-colors'>
                    {tool?.title || 'Financial Tool'}
                  </h3>

                  <p className='text-slate-300 text-sm leading-relaxed mb-6'>
                    {tool?.shortDescription || ''}
                  </p>
                </div>

                <Link
                  href={tool?.url || '/investor/financial-calculator'}
                  className='bg-[#C7A76C] hover:bg-[#dfc593] text-[#10243A] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 group-hover:shadow-md'
                >
                  <span>{tool?.actionText || 'Explore Tool'}</span>
                  <ArrowRight className='w-3.5 h-3.5' />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEWS TABS */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row items-center justify-between mb-12 gap-6'>
            <div>
              <span className='text-xs font-bold uppercase tracking-wider text-[#C7A76C] block mb-1'>
                Market Intelligence
              </span>

              <h2 className='text-3xl font-extrabold text-[#10243A] tracking-tight'>
                Latest Financial Insights & Market News
              </h2>
            </div>

            <div className='flex items-center bg-[#F8F7F3] p-1.5 rounded-xl border border-slate-200'>
              {[
                { value: 'popular', label: 'Popular' },
                { value: 'ipo', label: 'IPO Watch' },
                { value: 'market', label: 'Market Desk' }
              ].map(tab => (
                <button
                  key={tab.value}
                  type='button'
                  onClick={() => setNewsTab(tab.value)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    newsTab === tab.value
                      ? 'bg-[#10243A] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#10243A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredNews.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {filteredNews.map((item, index) => (
                <div
                  key={item?._id || item?.id || index}
                  className='bg-[#F8F7F3] rounded-2xl p-6 border border-slate-200/80 hover:shadow-md transition-shadow flex flex-col justify-between'
                >
                  <div>
                    <div className='flex items-center justify-between text-xs text-slate-400 mb-3 gap-2'>
                      <span className='font-semibold text-[#10243A] bg-white px-2.5 py-1 rounded border border-slate-200'>
                        {item?.badge || 'Market Update'}
                      </span>

                      <span>{item?.source || ''}</span>
                    </div>

                    <h3 className='text-lg font-bold text-[#10243A] mb-3 leading-snug hover:text-[#C7A76C] transition-colors'>
                      {item?.title || 'Financial Market Update'}
                    </h3>

                    <p className='text-sm text-slate-600 leading-relaxed mb-6'>
                      {item?.summary || ''}
                    </p>
                  </div>

                  <Link
                    href={item?.url || '/market-update'}
                    className='text-xs font-bold text-[#C7A76C] hover:text-[#a88547] flex items-center gap-1.5'
                  >
                    <span>Read Full Market Brief</span>
                    <ArrowRight className='w-3.5 h-3.5' />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-12 bg-[#F8F7F3] rounded-2xl border border-slate-200'>
              <p className='text-slate-600 text-sm'>
                No news available in this category right now.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 7. FINANCIAL VIDEO SECTION */}
      <section className='py-20 bg-[#F8F7F3] border-y border-slate-200/80'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-[#10243A] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 text-white'>
            <div className='lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center'>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A76C]/20 border border-[#C7A76C]/30 text-[#dfc593] text-xs font-bold uppercase tracking-wider mb-4 w-fit'>
                <Play className='w-3 h-3 text-[#C7A76C]' />
                <span>Financial Literacy Desk</span>
              </div>

              <h2 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-4'>
                The Science of Wealth: How SIP Compounding Beats Market Timing
              </h2>

              <p className='text-slate-300 text-sm leading-relaxed mb-6'>
                Understand why volatility is your best friend when investing for
                the long term. Learn how rupee-cost averaging systematically
                lowers your acquisition cost, multiplying your portfolio value
                over 10, 15, and 20 years.
              </p>

              <div className='space-y-3 mb-8'>
                {[
                  'Historical rolling returns of Nifty 50 over 15 years',
                  'The psychological trap of waiting for market corrections',
                  'Step-up SIP strategies for salaried and business clients'
                ].map(item => (
                  <div
                    key={item}
                    className='flex items-center gap-3 text-sm text-slate-200'
                  >
                    <CheckCircle2 className='w-4 h-4 text-[#C7A76C] shrink-0' />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href='/investor/financial-calculator'
                className='bg-[#C7A76C] hover:bg-[#dfc593] text-[#10243A] font-bold text-sm px-6 py-3 rounded-lg w-fit transition-all flex items-center gap-2'
              >
                <span>Simulate Your Compounding</span>
                <ArrowRight className='w-4 h-4' />
              </Link>
            </div>

            <div className='lg:col-span-6 relative bg-slate-900 flex items-center justify-center p-8 min-h-[320px]'>
              <div className='relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 group'>
                <img
                  src='https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop'
                  alt='Financial Planning Video'
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />

                <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                  <div className='w-16 h-16 rounded-full bg-[#C7A76C] text-[#10243A] flex items-center justify-center shadow-xl'>
                    <Play className='w-7 h-7 fill-current ml-1' />
                  </div>
                </div>

                <div className='absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg text-xs text-white'>
                  Finasset Wealth Masterclass: Disciplined Rupee Compounding
                  (Odisha Edition)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MOBILE APP PROMO SECTION */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-gradient-to-r from-[#10243A] to-[#1b3858] rounded-3xl p-8 sm:p-14 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl'>
            <div className='lg:col-span-7 space-y-6'>
              <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#dfc593] text-xs font-bold uppercase tracking-wider'>
                <Smartphone className='w-3.5 h-3.5 text-[#C7A76C]' />
                <span>Wealth Anywhere</span>
              </div>

              <h2 className='text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight'>
                Track, Analyze & Rebalance Your Wealth on the Go
              </h2>

              <p className='text-slate-300 text-sm sm:text-base leading-relaxed'>
                Access your consolidated family investment portfolio across all
                AMCs in one secure dashboard. Real-time valuation, capital gains
                statements, automated SIP tracking, and instantaneous
                transaction execution.
              </p>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-200'>
                {[
                  'Consolidated Multi-AMC Tracking',
                  'One-Click Capital Gains (Tax) Reports',
                  'Bank-Grade 256-Bit Security',
                  'Family Portfolio Aggregation'
                ].map(item => (
                  <div key={item} className='flex items-center gap-2'>
                    <CheckCircle2 className='w-4 h-4 text-[#C7A76C]' />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className='pt-4 flex flex-wrap items-center gap-4'>
                <Link
                  href='/portfolio-login'
                  className='bg-[#C7A76C] hover:bg-[#dfc593] text-[#10243A] font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2'
                >
                  <span>Launch Investor Web App</span>
                  <ExternalLink className='w-4 h-4' />
                </Link>

                <div className='text-xs text-slate-400'>
                  Compatible with iOS, Android & Desktop Browsers
                </div>
              </div>
            </div>

            <div className='lg:col-span-5 flex justify-center'>
              <div className='relative w-64 h-[440px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-700'>
                <div className='w-full h-full bg-slate-950 rounded-[2.3rem] overflow-hidden p-4 flex flex-col justify-between border border-slate-800'>
                  <div>
                    <div className='flex items-center justify-between text-[10px] text-slate-400 mb-4'>
                      <span>Finasset Wealth</span>
                      <span className='text-emerald-400'>● LIVE</span>
                    </div>

                    <div className='text-xs text-slate-400 font-medium'>
                      Total Family Portfolio
                    </div>

                    <div className='text-2xl font-extrabold text-white mt-1'>
                      ₹1,42,85,920
                    </div>

                    <div className='text-xs text-emerald-400 font-semibold mt-1'>
                      ▲ +14.8% Annualized CAGR
                    </div>

                    <div className='mt-6 space-y-2'>
                      <div className='bg-slate-900 p-2.5 rounded-xl flex justify-between items-center text-xs'>
                        <span className='text-slate-300'>Equity Funds</span>
                        <span className='font-bold text-[#C7A76C]'>65%</span>
                      </div>

                      <div className='bg-slate-900 p-2.5 rounded-xl flex justify-between items-center text-xs'>
                        <span className='text-slate-300'>Debt & FDs</span>
                        <span className='font-bold text-slate-300'>25%</span>
                      </div>

                      <div className='bg-slate-900 p-2.5 rounded-xl flex justify-between items-center text-xs'>
                        <span className='text-slate-300'>Gold & Sovereign</span>
                        <span className='font-bold text-amber-400'>10%</span>
                      </div>
                    </div>
                  </div>

                  <div className='bg-[#10243A] p-3 rounded-xl text-center text-[11px] font-bold text-[#C7A76C]'>
                    Next SIP Scheduled: 5th of Month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className='py-20 bg-[#F8F7F3]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center max-w-3xl mx-auto mb-16'>
            <span className='text-xs font-bold uppercase tracking-wider text-[#C7A76C] block mb-2'>
              Client Trust & Voices
            </span>

            <h2 className='text-3xl sm:text-4xl font-extrabold text-[#10243A] tracking-tight'>
              Trusted by Discerning Families Across Odisha
            </h2>

            <p className='text-slate-600 mt-4 leading-relaxed'>
              Real stories of financial discipline, goal achievement, and
              transparent fiduciary stewardship.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => {
              const rating = Math.max(
                0,
                Math.min(5, Number(testimonial?.rating) || 5)
              )

              const clientName = testimonial?.clientName || 'Client'

              return (
                <div
                  key={testimonial?._id || index}
                  className='bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between'
                >
                  <div>
                    <div className='flex items-center gap-1 text-amber-400 mb-4'>
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className='w-4 h-4 fill-current' />
                      ))}
                    </div>

                    <p className='text-slate-700 text-sm leading-relaxed mb-6 italic'>
                      &quot;{testimonial?.reviewText || ''}&quot;
                    </p>
                  </div>

                  <div className='flex items-center gap-3 pt-4 border-t border-slate-100'>
                    <div className='w-10 h-10 rounded-full bg-[#10243A] text-[#C7A76C] flex items-center justify-center font-bold text-sm'>
                      {clientName.charAt(0)}
                    </div>

                    <div>
                      <h3 className='font-bold text-sm text-[#10243A]'>
                        {clientName}
                      </h3>

                      <p className='text-xs text-slate-500'>
                        {testimonial?.designation || ''}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 10. PARTNERS LOGOS */}
      <section className='py-16 bg-white border-t border-slate-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-8'>
            <span className='text-xs font-bold uppercase tracking-wider text-slate-400 block'>
              Partnering with India&apos;s Leading Asset Management Companies &
              Insurers
            </span>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center'>
            {partners.map((partner, index) => (
              <div
                key={partner?._id || index}
                className='bg-[#F8F7F3] p-4 rounded-xl border border-slate-200/60 text-center hover:border-[#C7A76C] transition-colors'
              >
                <span className='text-xs font-bold text-[#10243A] block'>
                  {partner?.name || 'Partner'}
                </span>

                <span className='text-[10px] text-slate-400 block mt-0.5'>
                  {partner?.category || ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. REQUEST A CALL BACK FORM */}
      <section id='callback' className='py-20 bg-[#10243A] text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl'>
            <div className='text-center max-w-2xl mx-auto mb-10'>
              <span className='text-xs font-bold uppercase tracking-wider text-[#C7A76C] block mb-2'>
                Personalized Consultation
              </span>

              <h2 className='text-3xl font-extrabold text-white tracking-tight'>
                Request a Confidential Call Back
              </h2>

              <p className='text-slate-300 text-sm mt-3 leading-relaxed'>
                Connect with our senior wealth advisors in Bhubaneswar to
                discuss your financial roadmap, portfolio health checkup, or
                retirement goals.
              </p>
            </div>

            {submitSuccess ? (
              <div className='bg-emerald-950/60 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-3'>
                <CheckCircle2 className='w-12 h-12 text-emerald-400 mx-auto' />

                <h3 className='text-lg font-bold text-white'>
                  Request Received Successfully
                </h3>

                <p className='text-sm text-slate-300'>
                  Thank you! Our advisory team at Saheed Nagar / Jaydev Vihar
                  will contact you at your preferred time.
                </p>

                <button
                  type='button'
                  onClick={() => setSubmitSuccess(false)}
                  className='mt-2 text-xs font-semibold text-[#C7A76C] underline'
                >
                  Submit another consultation request
                </button>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className='space-y-5'>
                {submitError && (
                  <div
                    role='alert'
                    className='bg-rose-950/60 border border-rose-500/50 text-rose-200 text-sm p-4 rounded-xl'
                  >
                    {submitError}
                  </div>
                )}

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div>
                    <label
                      htmlFor='callback-name'
                      className='block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider'
                    >
                      Your Full Name *
                    </label>

                    <input
                      id='callback-name'
                      type='text'
                      required
                      autoComplete='name'
                      placeholder='e.g. Ramesh Mohanty'
                      value={callbackForm.name}
                      onChange={e =>
                        setCallbackForm(prev => ({
                          ...prev,
                          name: e.target.value
                        }))
                      }
                      className='w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#C7A76C]'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='callback-phone'
                      className='block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider'
                    >
                      Phone Number *
                    </label>

                    <input
                      id='callback-phone'
                      type='tel'
                      required
                      autoComplete='tel'
                      inputMode='tel'
                      placeholder='e.g. +91 94370 12345'
                      value={callbackForm.phone}
                      onChange={e =>
                        setCallbackForm(prev => ({
                          ...prev,
                          phone: e.target.value
                        }))
                      }
                      className='w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#C7A76C]'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div>
                    <label
                      htmlFor='callback-service'
                      className='block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider'
                    >
                      Area of Interest
                    </label>

                    <select
                      id='callback-service'
                      value={callbackForm.serviceOfInterest}
                      onChange={e =>
                        setCallbackForm(prev => ({
                          ...prev,
                          serviceOfInterest: e.target.value
                        }))
                      }
                      className='w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C7A76C]'
                    >
                      <option value='Mutual Funds & SIP'>
                        Mutual Funds & Systematic Investment Plan (SIP)
                      </option>

                      <option value='Comprehensive Financial Planning'>
                        Comprehensive Financial Planning
                      </option>

                      <option value='Life & Health Insurance'>
                        Life & Health Insurance Planning
                      </option>

                      <option value='NRI Wealth Advisory'>
                        NRI Wealth & Repatriation Advisory
                      </option>

                      <option value='Real Estate Advisory'>
                        Real Estate Property Advisory
                      </option>

                      <option value='Fixed Deposits & Bonds'>
                        Fixed Deposits & Bonds
                      </option>

                      <option value='Portfolio Management (PMS)'>
                        Portfolio Management Service (PMS)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor='callback-time'
                      className='block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider'
                    >
                      Preferred Callback Window
                    </label>

                    <select
                      id='callback-time'
                      value={callbackForm.preferredTime}
                      onChange={e =>
                        setCallbackForm(prev => ({
                          ...prev,
                          preferredTime: e.target.value
                        }))
                      }
                      className='w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C7A76C]'
                    >
                      <option value='Anytime'>
                        Anytime during business hours
                      </option>

                      <option value='Morning (10:00 AM - 1:00 PM)'>
                        Morning (10:00 AM - 1:00 PM)
                      </option>

                      <option value='Afternoon (1:00 PM - 4:00 PM)'>
                        Afternoon (1:00 PM - 4:00 PM)
                      </option>

                      <option value='Evening (4:00 PM - 7:00 PM)'>
                        Evening (4:00 PM - 7:00 PM)
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='callback-message'
                    className='block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider'
                  >
                    Brief Note or Question (Optional)
                  </label>

                  <textarea
                    id='callback-message'
                    rows={3}
                    placeholder='Tell us about your investment horizon or specific financial question...'
                    value={callbackForm.message}
                    onChange={e =>
                      setCallbackForm(prev => ({
                        ...prev,
                        message: e.target.value
                      }))
                    }
                    className='w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#C7A76C]'
                  />
                </div>

                <div className='pt-2 text-center'>
                  <button
                    type='submit'
                    disabled={submitting}
                    className='w-full sm:w-auto bg-[#C7A76C] hover:bg-[#dfc593] disabled:opacity-50 disabled:cursor-not-allowed text-[#10243A] font-extrabold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg transition-all'
                  >
                    {submitting
                      ? 'Submitting Request...'
                      : 'Schedule Confidential Call Back'}
                  </button>

                  <p className='text-xs text-slate-500 mt-3'>
                    We maintain strict confidentiality. Your details will never
                    be shared with third parties.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
