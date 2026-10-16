'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Shield,
  ExternalLink,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide public footer on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#0f2b44] text-slate-300 relative border-t border-slate-800">
      {/* Tricolor Brand Top Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#2376b8] via-[#89b441] to-[#f87b1f]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 & 2: Brand & Corporate Heritage */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2376b8] to-[#165688] flex items-center justify-center text-white border border-white/10 shadow-md group-hover:scale-105 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white block leading-none">
                  FINASSET<span className="text-[#f87b1f] ml-1">WEALTH</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mt-1">
                  A Group of NLF Adhira Asset Services LLP
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
                <span>+91 94370 12345 / +91 674 2548900</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#f87b1f] shrink-0" />
                <span>contact@finassetwealth.com</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
              <Shield className="w-3.5 h-3.5 text-[#89b441]" />
              <span>AMFI Reg. Mutual Fund Distributor: ARN-189204</span>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-[#2376b8]/40 pb-2 flex items-center justify-between">
              <span>Company & Advisory</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about-us" className="text-slate-400 hover:text-[#f87b1f] transition-colors">
                  About Finasset Wealth
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-400 hover:text-[#f87b1f] transition-colors">
                  Our Advisory Services
                </Link>
              </li>
              <li>
                <Link href="/nri-corner" className="text-slate-400 hover:text-[#f87b1f] transition-colors">
                  NRI Investment Corner
                </Link>
              </li>
              <li>
                <Link href="/taxation" className="text-slate-400 hover:text-[#f87b1f] transition-colors">
                  Taxation & Regulatory
                </Link>
              </li>
              <li>
                <Link href="/market-update" className="text-slate-400 hover:text-[#f87b1f] transition-colors">
                  Market Watch & Indices
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-[#f87b1f] transition-colors">
                  Financial Insights Blog
                </Link>
              </li>
              <li>
                <Link href="/career" className="text-slate-400 hover:text-[#f87b1f] transition-colors">
                  Careers in Bhubaneswar
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-slate-400 hover:text-[#f87b1f] transition-colors">
                  Contact Our Office
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Core Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-[#2376b8]/40 pb-2 flex items-center justify-between">
              <span>Advisory Solutions</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/financial-planning" className="text-slate-400 hover:text-[#2376b8] transition-colors">
                  Financial Planning
                </Link>
              </li>
              <li>
                <Link href="/services/mutual-funds" className="text-slate-400 hover:text-[#2376b8] transition-colors">
                  Mutual Funds & SIPs
                </Link>
              </li>
              <li>
                <Link href="/services/insurance" className="text-slate-400 hover:text-[#2376b8] transition-colors">
                  Term & Health Insurance
                </Link>
              </li>
              <li>
                <Link href="/services/real-estate" className="text-slate-400 hover:text-[#2376b8] transition-colors">
                  Real Estate Advisory
                </Link>
              </li>
              <li>
                <Link href="/services/fixed-deposits-bonds" className="text-slate-400 hover:text-[#2376b8] transition-colors">
                  Fixed Deposits & Bonds
                </Link>
              </li>
              <li>
                <Link href="/services/portfolio-management-service" className="text-slate-400 hover:text-[#2376b8] transition-colors">
                  PMS Portfolio Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Investor's Corner & Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-[#2376b8]/40 pb-2 flex items-center justify-between">
              <span>Investor Utilities</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/investor/financial-calculator" className="text-slate-400 hover:text-[#89b441] transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-[#89b441] group-hover:translate-x-1 transition-transform" />
                  <span>Financial Calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/investor/risk-profile" className="text-slate-400 hover:text-[#89b441] transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-[#89b441] group-hover:translate-x-1 transition-transform" />
                  <span>Know Your Risk Profile</span>
                </Link>
              </li>
              <li>
                <Link href="/investor/financial-fitness" className="text-slate-400 hover:text-[#89b441] transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-[#89b441] group-hover:translate-x-1 transition-transform" />
                  <span>Check Financial Fitness</span>
                </Link>
              </li>
              <li>
                <Link href="/investor/pay-premium" className="text-slate-400 hover:text-[#89b441] transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-[#89b441] group-hover:translate-x-1 transition-transform" />
                  <span>Pay Premium Online</span>
                </Link>
              </li>
              <li>
                <Link href="/investor/buy-mf-online" className="text-slate-400 hover:text-[#89b441] transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-[#89b441] group-hover:translate-x-1 transition-transform" />
                  <span>Buy MF Online</span>
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/portfolio-login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#f87b1f] hover:bg-[#d9620b] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Client Portfolio Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & AMFI Disclaimer */}
        <div className="py-6 border-b border-slate-800/80 text-xs text-slate-400/90 space-y-2 leading-relaxed">
          <p>
            <strong className="text-slate-300">Regulatory Disclaimer:</strong> Mutual Fund investments are subject to market risks, read all scheme-related documents carefully. Past performance is not indicative of future returns. Finasset Wealth, a group of NLF Adhira Asset Services LLP, acts as an AMFI-registered mutual fund distributor and financial consultant.
          </p>
          <p>
            All financial calculators, risk profiling algorithms, and projections displayed on this platform are for educational and illustrative purposes only. They do not constitute guaranteed returns, personalized investment advice, or contractual assurances.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Finasset Wealth (NLF Adhira Asset Services LLP). All rights reserved.
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-of-service" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/admin/login" className="text-slate-500 hover:text-[#89b441] flex items-center gap-1 transition-colors">
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
