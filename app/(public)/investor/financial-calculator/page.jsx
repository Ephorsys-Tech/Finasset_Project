import Link from 'next/link';
import {
  Calculator,
  Coins,
  ArrowRightLeft,
  ArrowDownCircle,
  Umbrella,
  Clock,
  ShieldCheck,
  Percent,
  Receipt,
  Heart,
  GraduationCap,
  Home,
  Car,
  Plane,
  TrendingUp,
  BarChart3,
  LineChart,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

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
    desc: 'Calculate the future wealth generated through disciplined monthly systematic investments.',
    icon: Calculator,
    tag: 'Popular',
    color: 'text-[#2376b8] bg-[#2376b8]/10',
  },
  {
    title: 'Lumpsum Calculator',
    slug: 'lumpsum-calculator',
    desc: 'Project compound returns on one-time surplus capital investments over your chosen horizon.',
    icon: Coins,
    tag: 'One-Time',
    color: 'text-[#f87b1f] bg-[#f87b1f]/10',
  },
  {
    title: 'STP Calculator',
    slug: 'stp-calculator',
    desc: 'Simulate systematic transfers from liquid/debt funds to equity funds for rupee cost averaging.',
    icon: ArrowRightLeft,
    tag: 'Transfer',
    color: 'text-[#89b441] bg-[#89b441]/10',
  },
  {
    title: 'SWP Calculator',
    slug: 'swp-calculator',
    desc: 'Plan regular monthly income cashflows from your accumulated mutual fund corpus.',
    icon: ArrowDownCircle,
    tag: 'Income',
    color: 'text-[#0f2b44] bg-[#0f2b44]/10',
  },
  {
    title: 'Retirement Corpus Calculator',
    slug: 'retirement-corpus-calculator',
    desc: 'Determine your required retirement nest egg adjusted for post-retirement living costs and inflation.',
    icon: Umbrella,
    tag: 'Milestone',
    color: 'text-[#2376b8] bg-[#2376b8]/10',
  },
  {
    title: 'Investment Delay Calculator',
    slug: 'investment-delay-calculator',
    desc: 'Measure the staggering cost and opportunity loss of postponing your investments by a few years.',
    icon: Clock,
    tag: 'Opportunity',
    color: 'text-[#f87b1f] bg-[#f87b1f]/10',
  },
  {
    title: 'Life Insurance Calculator',
    slug: 'life-insurance-calculator',
    desc: 'Calculate the optimal term insurance coverage required to safeguard your family dependents.',
    icon: ShieldCheck,
    tag: 'Protection',
    color: 'text-[#89b441] bg-[#89b441]/10',
  },
  {
    title: 'EMI Calculator',
    slug: 'emi-calculator',
    desc: 'Calculate accurate monthly EMIs, principal breakup, and total interest across any loan amount.',
    icon: Percent,
    tag: 'Debt',
    color: 'text-[#0f2b44] bg-[#0f2b44]/10',
  },
  {
    title: 'TAX Calculator',
    slug: 'tax-calculator',
    desc: 'Estimate tax liability under Old vs New Income Tax regimes and optimize deductions.',
    icon: Receipt,
    tag: 'Tax Planning',
    color: 'text-[#2376b8] bg-[#2376b8]/10',
  },
  {
    title: 'Marriage Expense Calculator',
    slug: 'marriage-expense-calculator',
    desc: 'Estimate future wedding costs accounting for inflation and calculate monthly savings required.',
    icon: Heart,
    tag: 'Life Goal',
    color: 'text-[#f87b1f] bg-[#f87b1f]/10',
  },
  {
    title: 'Education Cost Calculator',
    slug: 'education-cost-calculator',
    desc: 'Forecast higher education tuition costs adjusted for education inflation to build a child fund.',
    icon: GraduationCap,
    tag: 'Education',
    color: 'text-[#89b441] bg-[#89b441]/10',
  },
  {
    title: 'Home Loan Calculator',
    slug: 'home-loan-calculator',
    desc: 'Evaluate home loan eligibility, monthly repayments, and total interest outgo over loan tenure.',
    icon: Home,
    tag: 'Property',
    color: 'text-[#0f2b44] bg-[#0f2b44]/10',
  },
  {
    title: 'Car Purchase Calculator',
    slug: 'car-purchase-calculator',
    desc: 'Plan auto loan financing, down payment amounts, and monthly auto EMI affordability.',
    icon: Car,
    tag: 'Auto',
    color: 'text-[#2376b8] bg-[#2376b8]/10',
  },
  {
    title: 'Vacation Budget Calculator',
    slug: 'vacation-budget-calculator',
    desc: 'Set travel targets and compute monthly savings needed to fund your dream family vacation.',
    icon: Plane,
    tag: 'Lifestyle',
    color: 'text-[#f87b1f] bg-[#f87b1f]/10',
  },
];

// ==========================================
// 2. MF TOOLS CALCULATORS (6 Tools)
// ==========================================
const MF_TOOLS_CALCULATORS = [
  {
    title: 'SIP Performance',
    slug: 'sip-performance',
    desc: 'Analyze historical returns and point-to-point compounding delivered by systematic investment plans.',
    icon: TrendingUp,
    tag: 'SIP Track',
    color: 'text-[#2376b8] bg-[#2376b8]/10',
  },
  {
    title: 'STP Performance',
    slug: 'stp-performance',
    desc: 'Track historical performance and capital gains yield across debt-to-equity systematic transfer routes.',
    icon: ArrowRightLeft,
    tag: 'STP Track',
    color: 'text-[#f87b1f] bg-[#f87b1f]/10',
  },
  {
    title: 'SWP Performance',
    slug: 'swp-performance',
    desc: 'Evaluate past cashflow consistency and residual capital sustainability under systematic withdrawal plans.',
    icon: ArrowDownCircle,
    tag: 'SWP Track',
    color: 'text-[#89b441] bg-[#89b441]/10',
  },
  {
    title: 'Scheme Performance',
    slug: 'scheme-performance',
    desc: 'Review scheme returns, benchmark alpha, rolling yields, and risk ratios across mutual fund schemes.',
    icon: BarChart3,
    tag: 'Analytics',
    color: 'text-[#0f2b44] bg-[#0f2b44]/10',
  },
  {
    title: 'Fund Performance',
    slug: 'fund-performance',
    desc: 'Deep-dive into mutual fund house track records, fund manager performance, and AUM growth metrics.',
    icon: LineChart,
    tag: 'AMC Audit',
    color: 'text-[#2376b8] bg-[#2376b8]/10',
  },
  {
    title: 'NAV Finder Calculator',
    slug: 'nav-finder-calculator',
    desc: 'Lookup historical and latest Net Asset Values (NAV) across all mutual fund schemes and dividend histories.',
    icon: Search,
    tag: 'NAV Lookup',
    color: 'text-[#f87b1f] bg-[#f87b1f]/10',
  },
];

export default function FinancialCalculatorPage() {
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0a1e30] via-[#0f2b44] to-[#123657] text-white py-14 sm:py-18 relative">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2376b8]/20 border border-[#2376b8]/40 text-blue-200 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#f87b1f]" />
            <span>Financial Planning & MF Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Financial & MF Tools Calculators
          </h1>
          <p className="text-slate-300 mt-3 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
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
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 self-start sm:self-auto">
              {FINANCIAL_CALCULATORS.length} Calculators
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {FINANCIAL_CALCULATORS.map((calc) => {
              const Icon = calc.icon;
              return (
                <Link
                  key={calc.slug}
                  href={`/investor/financial-calculator/${calc.slug}`}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-[#2376b8] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Icon & Tag */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${calc.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#2376b8]/10 group-hover:text-[#2376b8] transition-colors">
                        {calc.tag}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-base font-bold text-[#0f2b44] group-hover:text-[#2376b8] transition-colors">
                      {calc.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                      {calc.desc}
                    </p>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2376b8]">
                    <span>Open Calculator</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
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
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 self-start sm:self-auto">
              {MF_TOOLS_CALCULATORS.length} Tools
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MF_TOOLS_CALCULATORS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={`/investor/financial-calculator/${tool.slug}`}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-[#89b441] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Icon & Tag */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${tool.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#89b441]/10 group-hover:text-[#89b441] transition-colors">
                        {tool.tag}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-base font-bold text-[#0f2b44] group-hover:text-[#2376b8] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                      {tool.desc}
                    </p>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#89b441] group-hover:text-[#0f2b44] transition-colors">
                    <span>Open Tool</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Regulatory Disclaimer */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs text-slate-500 leading-relaxed shadow-sm">
          <strong className="text-slate-700">Regulatory Disclaimer:</strong> Financial calculators and analytical tools provided on this platform are for educational and illustrative purposes only. Calculations are based on mathematical formulas and user assumptions and do not guarantee future returns. Mutual Fund investments are subject to market risks; please read all scheme-related documents carefully.
        </div>
      </div>
    </div>
  );
}
