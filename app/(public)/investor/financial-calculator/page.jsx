import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import MinimalCalculatorCard from '@/components/calculators/MinimalCalculatorCard';
import PageHero from '@/components/common/PageHero';

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
    icon: 'CalendarCheck',
  },
  {
    title: 'Lumpsum Calculator',
    slug: 'lumpsum-calculator',
    desc: 'Project compound returns on one-time surplus capital investments over your chosen horizon.',
    tag: 'One-Time',
    icon: 'Coins',
  },
  {
    title: 'STP Calculator',
    slug: 'stp-calculator',
    desc: 'Simulate systematic transfers from debt to equity funds for rupee cost averaging.',
    tag: 'Transfer',
    icon: 'ArrowRightLeft',
  },
  {
    title: 'SWP Calculator',
    slug: 'swp-calculator',
    desc: 'Plan regular monthly income cashflows from your accumulated mutual fund corpus.',
    tag: 'Income',
    icon: 'HandCoins',
  },
  {
    title: 'Retirement Corpus Calculator',
    slug: 'retirement-corpus-calculator',
    desc: 'Determine your required retirement nest egg adjusted for post-retirement inflation.',
    tag: 'Milestone',
    icon: 'Flame',
  },
  {
    title: 'Investment Delay Calculator',
    slug: 'investment-delay-calculator',
    desc: 'Measure the staggering cost and opportunity loss of postponing investments.',
    tag: 'Opportunity',
    icon: 'Clock',
  },
  {
    title: 'Life Insurance Calculator',
    slug: 'life-insurance-calculator',
    desc: 'Calculate optimal term insurance coverage required to safeguard your dependents.',
    tag: 'Protection',
    icon: 'ShieldCheck',
  },
  {
    title: 'EMI Calculator',
    slug: 'emi-calculator',
    desc: 'Calculate monthly EMIs, principal breakup, and total interest across any loan.',
    tag: 'Debt',
    icon: 'Calculator',
  },
  {
    title: 'TAX Calculator',
    slug: 'tax-calculator',
    desc: 'Estimate tax liability under Old vs New Income Tax regimes and optimize deductions.',
    tag: 'Tax Planning',
    icon: 'Percent',
  },
  {
    title: 'Marriage Expense Calculator',
    slug: 'marriage-expense-calculator',
    desc: 'Estimate wedding costs accounting for inflation and calculate monthly savings required.',
    tag: 'Life Goal',
    icon: 'Heart',
  },
  {
    title: 'Education Cost Calculator',
    slug: 'education-cost-calculator',
    desc: 'Forecast higher education tuition costs adjusted for education inflation.',
    tag: 'Education',
    icon: 'GraduationCap',
  },
  {
    title: 'Home Loan Calculator',
    slug: 'home-loan-calculator',
    desc: 'Evaluate home loan eligibility, monthly repayments, and total interest outgo.',
    tag: 'Property',
    icon: 'Home',
  },
  {
    title: 'Car Purchase Calculator',
    slug: 'car-purchase-calculator',
    desc: 'Plan auto loan financing, down payment amounts, and monthly auto EMI affordability.',
    tag: 'Auto',
    icon: 'Car',
  },
  {
    title: 'Vacation Budget Calculator',
    slug: 'vacation-budget-calculator',
    desc: 'Set travel targets and compute monthly savings needed for your dream family vacation.',
    tag: 'Lifestyle',
    icon: 'Plane',
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
    icon: 'TrendingUp',
  },
  {
    title: 'STP Performance',
    slug: 'stp-performance',
    desc: 'Track historical performance and capital gains yield across STP routes.',
    tag: 'STP Track',
    icon: 'ArrowRightLeft',
  },
  {
    title: 'SWP Performance',
    slug: 'swp-performance',
    desc: 'Evaluate past cashflow consistency and residual capital sustainability.',
    tag: 'SWP Track',
    icon: 'Wallet',
  },
  {
    title: 'Scheme Performance',
    slug: 'scheme-performance',
    desc: 'Review scheme returns, benchmark alpha, rolling yields, and risk ratios.',
    tag: 'Analytics',
    icon: 'PieChart',
  },
  {
    title: 'Fund Performance',
    slug: 'fund-performance',
    desc: 'Deep-dive into mutual fund house track records and fund manager performance.',
    tag: 'AMC Audit',
    icon: 'Briefcase',
  },
  {
    title: 'NAV Finder Calculator',
    slug: 'nav-finder-calculator',
    desc: 'Lookup historical and latest Net Asset Values (NAV) across all mutual fund schemes.',
    tag: 'NAV Lookup',
    icon: 'Search',
  },
];

export default function FinancialCalculatorPage() {
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      {/* Hero Section */}
      <PageHero
        title="Financial & MF Tools Calculators"
        description="Select any financial calculator or mutual fund tool below to simulate outcomes, evaluate historical returns, and plan your life goals."
        imageSrc="https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=1200&auto=format&fit=crop"
        imageAlt="Financial & Mutual Fund Tools Calculators"
      />

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
            {/* <span className="text-xs font-bold text-slate-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm self-start sm:self-auto">
              {FINANCIAL_CALCULATORS.length} Calculators
            </span> */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {FINANCIAL_CALCULATORS.map((calc) => (
              <MinimalCalculatorCard
                key={calc.slug}
                title={calc.title}
                href={`/investor/financial-calculator/${calc.slug}`}
                tag={calc.tag}
                description={calc.desc}
                icon={calc.icon}
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
            {/* <span className="text-xs font-bold text-slate-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm self-start sm:self-auto">
              {MF_TOOLS_CALCULATORS.length} Tools
            </span> */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {MF_TOOLS_CALCULATORS.map((tool) => (
              <MinimalCalculatorCard
                key={tool.slug}
                title={tool.title}
                href={`/investor/financial-calculator/${tool.slug}`}
                tag={tool.tag}
                description={tool.desc}
                icon={tool.icon}
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
