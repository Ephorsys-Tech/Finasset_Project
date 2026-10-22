import Link from 'next/link';
import {
  Sparkles,
} from 'lucide-react';
import { ServiceCard } from '@/components/ui/service-card';

export const metadata = {
  title: 'Financial Calculators & MF Tools | Finasset Wealth',
  description: 'Explore our comprehensive suite of financial planning calculators and mutual fund analytical tools to plan, calculate, and achieve your financial goals.',
};

// ==========================================
// 1. FINANCIAL CALCULATORS (14 Tools)
// ==========================================
const FINANCIAL_CALCULATORS = [
  {
    title: 'SIP Calculator',
    slug: 'sip-calculator',
    desc: 'Calculate future wealth generated through disciplined monthly systematic investments.',
    tag: 'Popular',
    variant: 'blue',
    imgSrc: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'SIP systematic investment illustration',
  },
  {
    title: 'Lumpsum Calculator',
    slug: 'lumpsum-calculator',
    desc: 'Project compound returns on one-time surplus capital investments over your chosen horizon.',
    tag: 'One-Time',
    variant: 'orange',
    imgSrc: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'Lumpsum investment growth illustration',
  },
  {
    title: 'STP Calculator',
    slug: 'stp-calculator',
    desc: 'Simulate systematic transfers from debt to equity funds for rupee cost averaging.',
    tag: 'Transfer',
    variant: 'green',
    imgSrc: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'STP systematic transfer illustration',
  },
  {
    title: 'SWP Calculator',
    slug: 'swp-calculator',
    desc: 'Plan regular monthly income cashflows from your accumulated mutual fund corpus.',
    tag: 'Income',
    variant: 'navy',
    imgSrc: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'SWP regular income illustration',
  },
  {
    title: 'Retirement Corpus Calculator',
    slug: 'retirement-corpus-calculator',
    desc: 'Determine your required retirement nest egg adjusted for post-retirement inflation.',
    tag: 'Milestone',
    variant: 'blue',
    imgSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'Retirement nest egg planning',
  },
  {
    title: 'Investment Delay Calculator',
    slug: 'investment-delay-calculator',
    desc: 'Measure the staggering cost and opportunity loss of postponing investments.',
    tag: 'Opportunity',
    variant: 'red',
    imgSrc: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'Cost of investment delay illustration',
  },
  {
    title: 'Life Insurance Calculator',
    slug: 'life-insurance-calculator',
    desc: 'Calculate optimal term insurance coverage required to safeguard your dependents.',
    tag: 'Protection',
    variant: 'green',
    imgSrc: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'Family life insurance protection',
  },
  {
    title: 'EMI Calculator',
    slug: 'emi-calculator',
    desc: 'Calculate monthly EMIs, principal breakup, and total interest across any loan.',
    tag: 'Debt',
    variant: 'gray',
    imgSrc: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'Loan EMI calculation and figures',
  },
  {
    title: 'TAX Calculator',
    slug: 'tax-calculator',
    desc: 'Estimate tax liability under Old vs New Income Tax regimes and optimize deductions.',
    tag: 'Tax Planning',
    variant: 'default',
    imgSrc: 'https://images.unsplash.com/photo-1586486855514-8c633cc6fd38?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'Tax planning and calculations',
  },
  {
    title: 'Marriage Expense Calculator',
    slug: 'marriage-expense-calculator',
    desc: 'Estimate wedding costs accounting for inflation and calculate monthly savings required.',
    tag: 'Life Goal',
    variant: 'red',
    imgSrc: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'Marriage expense planning',
  },
  {
    title: 'Education Cost Calculator',
    slug: 'education-cost-calculator',
    desc: 'Forecast higher education tuition costs adjusted for education inflation.',
    tag: 'Education',
    variant: 'blue',
    imgSrc: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'Higher education tuition planning',
  },
  {
    title: 'Home Loan Calculator',
    slug: 'home-loan-calculator',
    desc: 'Evaluate home loan eligibility, monthly repayments, and total interest outgo.',
    tag: 'Property',
    variant: 'navy',
    imgSrc: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'Home loan property financing',
  },
  {
    title: 'Car Purchase Calculator',
    slug: 'car-purchase-calculator',
    desc: 'Plan auto loan financing, down payment amounts, and monthly auto EMI affordability.',
    tag: 'Auto',
    variant: 'orange',
    imgSrc: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'Automobile vehicle purchase financing',
  },
  {
    title: 'Vacation Budget Calculator',
    slug: 'vacation-budget-calculator',
    desc: 'Set travel targets and compute monthly savings needed for your dream family vacation.',
    tag: 'Lifestyle',
    variant: 'green',
    imgSrc: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'Vacation holiday budget planner',
  },
];

// ==========================================
// 2. MF TOOLS CALCULATORS (6 Tools)
// ==========================================
const MF_TOOLS_CALCULATORS = [
  {
    title: 'SIP Performance',
    slug: 'sip-performance',
    desc: 'Analyze historical returns and point-to-point compounding delivered by SIPs.',
    tag: 'SIP Track',
    variant: 'blue',
    imgSrc: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'SIP performance analytics',
  },
  {
    title: 'STP Performance',
    slug: 'stp-performance',
    desc: 'Track historical performance and capital gains yield across STP routes.',
    tag: 'STP Track',
    variant: 'orange',
    imgSrc: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'STP transfer performance analytics',
  },
  {
    title: 'SWP Performance',
    slug: 'swp-performance',
    desc: 'Evaluate past cashflow consistency and residual capital sustainability.',
    tag: 'SWP Track',
    variant: 'green',
    imgSrc: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'SWP cashflow sustainability',
  },
  {
    title: 'Scheme Performance',
    slug: 'scheme-performance',
    desc: 'Review scheme returns, benchmark alpha, rolling yields, and risk ratios.',
    tag: 'Analytics',
    variant: 'navy',
    imgSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'Scheme performance evaluation',
  },
  {
    title: 'Fund Performance',
    slug: 'fund-performance',
    desc: 'Deep-dive into mutual fund house track records and fund manager performance.',
    tag: 'AMC Audit',
    variant: 'default',
    imgSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'AMC fund house performance',
  },
  {
    title: 'NAV Finder Calculator',
    slug: 'nav-finder-calculator',
    desc: 'Lookup historical and latest Net Asset Values (NAV) across all mutual fund schemes.',
    tag: 'NAV Lookup',
    variant: 'gray',
    imgSrc: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=80',
    imgAlt: 'Historical mutual fund NAV lookup',
  },
];

export default function FinancialCalculatorPage() {
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0a1e30] via-[#0f2b44] to-[#123657] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#2376b8]/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2376b8]/20 border border-[#2376b8]/40 text-blue-200 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#f87b1f]" />
            <span>Financial Planning &amp; MF Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Financial &amp; MF Tools Calculators
          </h1>
          <p className="text-slate-300 mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Select any financial calculator or mutual fund tool below to simulate outcomes, evaluate historical returns, and plan your life goals.
          </p>
        </div>
      </section>

      {/* Main Content Area: 2 Distinct Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* ========================================================= */}
        {/* SECTION 1: FINANCIAL CALCULATORS                          */}
        {/* ========================================================= */}
        <section id="financial-calculators">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-5 mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#2376b8] block mb-1">
                Category 01
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2b44]">
                Financial Calculators
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Comprehensive calculators for goal planning, wealth accumulation, and debt management.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm self-start sm:self-auto">
              {FINANCIAL_CALCULATORS.length} Calculators
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FINANCIAL_CALCULATORS.map((calc) => (
              <ServiceCard
                key={calc.slug}
                title={calc.title}
                href={`/investor/financial-calculator/${calc.slug}`}
                tag={calc.tag}
                description={calc.desc}
                imgSrc={calc.imgSrc}
                imgAlt={calc.imgAlt}
                variant={calc.variant}
                ctaText="CALCULATE NOW"
                className="min-h-[200px]"
              />
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: MF TOOLS CALCULATORS                           */}
        {/* ========================================================= */}
        <section id="mf-tools-calculators">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-5 mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#89b441] block mb-1">
                Category 02
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2b44]">
                MF Tools Calculators
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Specialized analytical engines to evaluate mutual fund returns, performance consistency, and NAV trends.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm self-start sm:self-auto">
              {MF_TOOLS_CALCULATORS.length} Tools
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MF_TOOLS_CALCULATORS.map((tool) => (
              <ServiceCard
                key={tool.slug}
                title={tool.title}
                href={`/investor/financial-calculator/${tool.slug}`}
                tag={tool.tag}
                description={tool.desc}
                imgSrc={tool.imgSrc}
                imgAlt={tool.imgAlt}
                variant={tool.variant}
                ctaText="OPEN ANALYTICS"
                className="min-h-[200px]"
              />
            ))}
          </div>
        </section>

        {/* Regulatory Disclaimer */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 text-xs text-slate-500 leading-relaxed shadow-sm">
          <strong className="text-slate-700">Regulatory Disclaimer:</strong> Financial calculators and analytical tools provided on this platform are for educational and illustrative purposes only. Calculations are based on mathematical formulas and user assumptions and do not guarantee future returns. Mutual Fund investments are subject to market risks; please read all scheme-related documents carefully.
        </div>
      </div>
    </div>
  );
}
