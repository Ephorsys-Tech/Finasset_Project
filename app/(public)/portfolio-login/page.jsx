'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  HelpCircle,
  KeyRound,
} from 'lucide-react';
import PageHero from '@/components/common/PageHero';

export default function PortfolioLoginPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch('/api/v1/public/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setSettings(json.data);
      })
      .catch(console.error);
  }, []);

  const externalPortfolioUrl =
    settings?.externalPortfolioUrl || 'https://investor.finassetwealth.com/login';

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Banner */}
      <PageHero
        title="Client Portfolio Login"
        description="Access your 24/7 consolidated family wealth dashboard, holding statements, capital gains reports, and transaction history."
        imageSrc="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop"
        imageAlt="Client Portfolio Login"
      />

      {/* Main Login Card */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl space-y-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0f2b44] to-[#164366] text-[#f87b1f] flex items-center justify-center mx-auto shadow-md">
              <KeyRound className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2b44]">
                Finasset Wealth Investor Access
              </h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                You will be redirected to our secure back-office multi-AMC client valuation engine.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={externalPortfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#f87b1f] hover:bg-[#d9620b] text-white font-extrabold text-sm sm:text-base px-10 py-4 rounded-xl shadow-lg shadow-[#f87b1f]/25 transition-all"
              >
                <span>Launch Client Login Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <span className="text-xs text-slate-400 block mt-3">
                Protected by 256-bit SSL encryption & two-factor authentication (2FA)
              </span>
            </div>

            {/* Checklist */}
            <div className="pt-8 border-t border-slate-100 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#89b441] shrink-0 mt-0.5" />
                <span>Consolidated Net Asset Value (NAV) updated daily</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#89b441] shrink-0 mt-0.5" />
                <span>Instant Capital Gains Statement downloads for ITR</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#89b441] shrink-0 mt-0.5" />
                <span>Family grouping to view aggregate household wealth</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#89b441] shrink-0 mt-0.5" />
                <span>Track active and upcoming monthly SIP debits</span>
              </div>
            </div>
          </div>

          {/* Helpdesk Callout */}
          <div className="bg-[#0f2b44] text-white rounded-3xl p-8 border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">First-time login or forgot your password?</h3>
              <p className="text-xs text-slate-300">
                Contact our client operations desk in Bhubaneswar for immediate credential resets.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:+919437012345"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-[#89b441] hover:text-white px-4 py-2.5 rounded-lg border border-white/10 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Helpdesk</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
