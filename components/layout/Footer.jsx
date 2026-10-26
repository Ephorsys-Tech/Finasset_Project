'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Lock,
  ArrowRight,
  ExternalLink,
  Calendar,
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide public footer on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#06121e] text-slate-300 relative border-t border-slate-800/80 overflow-hidden selection:bg-[#f87b1f] selection:text-white">
      {/* 3-Color Brand Gradient Accent Line (#2376b8, #89b441, #f87b1f) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#2376b8] via-[#89b441] to-[#f87b1f]" />

      {/* Subtle Ambient Brand Glow Backdrops */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#2376b8]/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-0 w-96 h-96 rounded-full bg-[#f87b1f]/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 rounded-full bg-[#89b441]/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-4 sm:pb-6 relative z-10">
        {/* Pre-Footer Action Bar */}
        <div className="pb-10 mb-12 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#89b441]">
              <span className="w-2 h-2 rounded-full bg-[#89b441] animate-pulse" />
              <span>Disciplined Wealth Management in Bhubaneswar</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5 font-['Inter',system-ui,sans-serif] tracking-tight">
              Ready to construct an all-weather financial portfolio?
            </h3>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2376b8] to-[#1a5b8e] hover:from-[#2a87d0] hover:to-[#2376b8] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#2376b8]/20 hover:shadow-[#2376b8]/30 transition-all duration-200"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Portfolio Consultation</span>
            </Link>
            <Link
              href="/portfolio-login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f87b1f] hover:bg-[#d9620b] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#f87b1f]/20 hover:shadow-[#f87b1f]/30 transition-all duration-200"
            >
              <Lock className="w-4 h-4" />
              <span>Client Login</span>
            </Link>
          </div>
        </div>

        {/* Upper Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 & 2: Brand Heritage & Core Contact */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group inline-block">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2376b8] to-[#165688] flex items-center justify-center text-white border border-white/10 shadow-md group-hover:scale-105 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white block leading-none font-['Inter',system-ui,sans-serif]">
                  FINASSET<span className="text-[#f87b1f] ml-1">WEALTH</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mt-1">
                  NLF Adhira Asset Services LLP
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              Finasset Wealth is a premier financial planning and wealth management advisory firm in Bhubaneswar. We deliver disciplined portfolio construction across mutual funds, insurance risk cover, real estate advisory, and portfolio management services (PMS) tailored to individuals, business owners, and global NRIs.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#2376b8] shrink-0 mt-0.5" />
                <span>Plot No. 124, Saheed Nagar / Jaydev Vihar Corridor, Bhubaneswar, Odisha – 751007, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#89b441] shrink-0" />
                <a href="tel:+919437012345" className="hover:text-white transition-colors">
                  +91 94370 12345 / +91 674 2548900
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#f87b1f] shrink-0" />
                <a href="mailto:contact@finassetwealth.com" className="hover:text-white transition-colors">
                  contact@finassetwealth.com
                </a>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700/60 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#89b441]" />
              <span>AMFI Reg. Mutual Fund Distributor: <strong className="text-white font-mono">ARN-189204</strong></span>
            </div>
          </div>

          {/* Col 3: Company & Advisory Links (Accent: #2376b8) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b-2 border-[#2376b8] pb-2 inline-block">
              Company &amp; Advisory
            </h4>
            <ul className="space-y-2 text-sm pt-1">
              <li>
                <Link href="/about-us" className="text-slate-400 hover:text-[#2376b8] transition-colors">
                  About Finasset Wealth
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-400 hover:text-[#2376b8] transition-colors">
                  Our Advisory Services
                </Link>
              </li>
              <li>
                <Link href="/nri-corner" className="text-slate-400 hover:text-[#2376b8] transition-colors">
                  NRI Investment Corner
                </Link>
              </li>
              <li>
                <Link href="/taxation" className="text-slate-400 hover:text-[#2376b8] transition-colors">
                  Taxation &amp; Regulatory
                </Link>
              </li>
              <li>
                <Link href="/market-update" className="text-slate-400 hover:text-[#2376b8] transition-colors">
                  Market Watch &amp; Indices
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-[#2376b8] transition-colors">
                  Financial Insights Blog
                </Link>
              </li>
              <li>
                <Link href="/career" className="text-slate-400 hover:text-[#2376b8] transition-colors">
                  Careers in Bhubaneswar
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-slate-400 hover:text-[#2376b8] transition-colors">
                  Contact Our Office
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Core Services (Accent: #89b441) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b-2 border-[#89b441] pb-2 inline-block">
              Advisory Solutions
            </h4>
            <ul className="space-y-2 text-sm pt-1">
              <li>
                <Link href="/services/financial-planning" className="text-slate-400 hover:text-[#89b441] transition-colors">
                  Financial Planning
                </Link>
              </li>
              <li>
                <Link href="/services/mutual-funds" className="text-slate-400 hover:text-[#89b441] transition-colors">
                  Mutual Funds &amp; SIPs
                </Link>
              </li>
              <li>
                <Link href="/services/insurance" className="text-slate-400 hover:text-[#89b441] transition-colors">
                  Term &amp; Health Insurance
                </Link>
              </li>
              <li>
                <Link href="/services/real-estate" className="text-slate-400 hover:text-[#89b441] transition-colors">
                  Real Estate Advisory
                </Link>
              </li>
              <li>
                <Link href="/services/fixed-deposits-bonds" className="text-slate-400 hover:text-[#89b441] transition-colors">
                  Fixed Deposits &amp; Bonds
                </Link>
              </li>
              <li>
                <Link href="/services/portfolio-management-service" className="text-slate-400 hover:text-[#89b441] transition-colors">
                  PMS Portfolio Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Investor's Corner & Portals (Accent: #f87b1f) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b-2 border-[#f87b1f] pb-2 inline-block">
              Investor Utilities
            </h4>
            <ul className="space-y-2.5 text-sm pt-1">
              <li>
                <Link href="/investor/financial-calculator" className="text-slate-400 hover:text-[#f87b1f] transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-[#f87b1f] group-hover:translate-x-1 transition-transform" />
                  <span>Financial Calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/investor/risk-profile" className="text-slate-400 hover:text-[#f87b1f] transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-[#f87b1f] group-hover:translate-x-1 transition-transform" />
                  <span>Know Your Risk Profile</span>
                </Link>
              </li>
              <li>
                <Link href="/investor/financial-fitness" className="text-slate-400 hover:text-[#f87b1f] transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-[#f87b1f] group-hover:translate-x-1 transition-transform" />
                  <span>Check Financial Fitness</span>
                </Link>
              </li>
              <li>
                <Link href="/investor/pay-premium" className="text-slate-400 hover:text-[#f87b1f] transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-[#f87b1f] group-hover:translate-x-1 transition-transform" />
                  <span>Pay Premium Online</span>
                </Link>
              </li>
              <li>
                <Link href="/investor/buy-mf-online" className="text-slate-400 hover:text-[#f87b1f] transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-[#f87b1f] group-hover:translate-x-1 transition-transform" />
                  <span>Buy MF Online</span>
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/portfolio-login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#f87b1f] hover:bg-[#d9620b] text-white px-4 py-2.5 rounded-xl shadow-md shadow-[#f87b1f]/20 hover:shadow-lg transition-all duration-200"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Client Portfolio Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower Showcase Section: Regulatory Disclaimers & Address with Giant FINASSET in the Background */}
        <div className="pt-12 pb-10 sm:pt-16 sm:pb-14 relative overflow-hidden group/legal">
          {/* Background Layer: Giant FINASSET Wordmark in Brand Tricolor (#2376b8, #89b441, #f87b1f) */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden transition-opacity duration-500 ease-out opacity-25 group-hover/legal:opacity-40"
            aria-hidden="true"
          >
            {/* Ambient Backlight Blooms in the 3 Brand Colors */}
            <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-80 h-32 rounded-full bg-[#2376b8]/20 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-80 h-32 rounded-full bg-[#89b441]/15 blur-3xl" />
            <div className="absolute right-1/4 top-1/2 -translate-y-1/2 translate-x-1/2 w-80 h-32 rounded-full bg-[#f87b1f]/20 blur-3xl" />

            <svg
              viewBox="0 0 1000 155"
              className="w-full h-auto max-h-[90%] block select-none pointer-events-none drop-shadow-md"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="finassetBackdropGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2376b8" />
                  <stop offset="48%" stopColor="#89b441" />
                  <stop offset="100%" stopColor="#f87b1f" />
                </linearGradient>
              </defs>
              <text
                x="500"
                y="132"
                textAnchor="middle"
                textLength="980"
                lengthAdjust="spacing"
                fill="url(#finassetBackdropGrad)"
                fillOpacity="0.85"
                stroke="url(#finassetBackdropGrad)"
                strokeWidth="1.5"
                style={{
                  fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 900,
                  fontSize: '150px',
                  letterSpacing: '-0.03em',
                }}
              >
                FINASSET
              </text>
            </svg>
          </div>

          {/* Foreground Layer (z-10): Regulatory Disclaimers, AMFI Credentials, Address & Copyright */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs text-slate-300 leading-relaxed">
            {/* Left Column: Quick Legal Links & AMFI Certification */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3 flex-wrap text-slate-300 font-medium drop-shadow-sm">
                <Link href="/privacy-policy" className="hover:text-[#2376b8] transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-slate-600">•</span>
                <Link href="/terms-of-service" className="hover:text-[#89b441] transition-colors">
                  Terms of Service
                </Link>
                <span className="text-slate-600">•</span>
                <Link href="/contact-us" className="hover:text-[#f87b1f] transition-colors">
                  Investor Grievances
                </Link>
                <span className="text-slate-600">•</span>
                <Link href="/admin/login" className="text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors">
                  <Lock className="w-3 h-3" />
                  <span>Admin</span>
                </Link>
              </div>

              {/* <div className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-lg space-y-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#89b441]" />
                  <p className="text-xs font-semibold text-white">
                    AMFI Registered Mutual Fund Distributor
                  </p>
                </div>
                <p className="text-[11px] font-mono text-slate-300">
                  ARN-189204 • Date of Initial Registration: 18-Oct-2021
                </p>
                <p className="text-[10px] text-slate-400">
                  Current Validity: Up to 17-Oct-2027 • NRF Adhira Asset Services LLP
                </p>
              </div> */}
            </div>

            {/* Right Column: Regulatory Disclaimer & Address (Matching Robinhood format) */}
            <div className="lg:col-span-7 space-y-3.5">
              <p className="text-slate-300 drop-shadow-sm">
                Mutual fund investments are subject to market risks, read all scheme related documents carefully before investing. Past performance is not indicative of future returns. Finasset Wealth, a group of NLF Adhira Asset Services LLP, acts strictly as an AMFI-registered mutual fund distributor and financial consultant. Options, derivatives, and portfolio strategies involve significant market risks and may not be suitable for all investors.
              </p>
              <p className="text-slate-400 drop-shadow-sm">
                All projections, financial calculators, and analytical tools available on this platform are intended solely for educational and illustrative purposes. They do not constitute contractual guarantees or individual investment advice.
              </p>

              {/* Registration Reference Number (matching 4784959 in the Robinhood reference layout) */}
              <div className="pt-2 space-y-1.5 border-t border-slate-700/60">
                <p className="font-mono text-white font-bold text-xs tracking-wider drop-shadow-sm">
                  ARN-189204 / 4784959
                </p>
                <p className="text-[11px] text-slate-300 drop-shadow-sm">
                  Finasset Wealth, Plot No. 124, Saheed Nagar, Bhubaneswar, Odisha 751007. © 2026 Finasset Wealth (NLF Adhira Asset Services LLP). All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

