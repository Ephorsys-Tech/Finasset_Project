'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="w-full bg-[#f8fafc] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2376b8]/10 text-[#2376b8] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-[#2376b8]" />
            <span>Legal Terms & Regulatory Disclaimers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f2b44]">
            Terms of Service & Disclaimers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Finasset Wealth • A Group of NLF Adhira Asset Services LLP, Bhubaneswar
          </p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <p>
            Welcome to the Finasset Wealth website. By accessing, browsing, or utilizing the services and tools available on this platform, you acknowledge and agree to be bound by the following statutory terms and conditions.
          </p>

          <h3 className="text-base font-bold text-[#0f2b44] pt-2">1. Regulatory Status & Role</h3>
          <p>
            Finasset Wealth operates as an AMFI-registered Mutual Fund Distributor (ARN-189204) and financial consultant. We do not offer guaranteed returns or contractual return assurances. Mutual Fund investments are subject to market risks; please read all scheme-related documents carefully before investing.
          </p>

          <h3 className="text-base font-bold text-[#0f2b44] pt-2">2. Illustrative Nature of Tools & Calculators</h3>
          <p>
            All financial calculators, SIP growth projections, risk profiling results, and financial fitness indicators provided on this website are strictly for educational and illustrative purposes. They are computed using mathematical compounding formulas based on user-supplied assumptions and do not constitute actual performance forecasts or binding investment contracts.
          </p>

          <h3 className="text-base font-bold text-[#0f2b44] pt-2">3. External Links & Insurer Portals</h3>
          <p>
            This website provides links to external transacting engines (such as BSE StAR MF, NSE NMF II) and insurance payment gateways (such as LIC, HDFC Life, ICICI Prudential, Star Health). Finasset Wealth is not responsible for any downtime, technical glitches, or payment processing errors occurring on third-party banking or insurer gateways.
          </p>

          <h3 className="text-base font-bold text-[#0f2b44] pt-2">4. Jurisdiction</h3>
          <p>
            All disputes, claims, and legal proceedings arising out of the use of this website or advisory services are subject to the exclusive jurisdiction of the competent courts in Bhubaneswar, Odisha, India.
          </p>
        </div>
      </div>
    </div>
  );
}
