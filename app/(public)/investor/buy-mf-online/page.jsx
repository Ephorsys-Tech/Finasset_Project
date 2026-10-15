'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  FileCheck,
  CreditCard,
  Lock,
} from 'lucide-react';

export default function BuyMfOnlinePage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch('/api/v1/public/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setSettings(json.data);
      })
      .catch(console.error);
  }, []);

  const externalBuyUrl = settings?.externalBuyMfUrl || 'https://invest.finassetwealth.com';

  return (
    <div className="w-full bg-[#F8F7F3]">
      {/* Banner */}
      <section className="bg-[#10243A] text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C7A76C]/20 border border-[#C7A76C]/30 text-[#dfc593] text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5 text-[#C7A76C]" />
            <span>Direct Digital Execution</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Buy Mutual Funds Online
          </h1>
          <p className="text-slate-300 mt-4 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
            Execute fresh SIPs, switch funds, invest lumpsum, or automate withdrawals directly through our secure AMFI-registered mutual fund transacting portal.
          </p>
        </div>
      </section>

      {/* Main Guidance & Portal Card */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main Action Box */}
          <div className="bg-gradient-to-r from-[#10243A] to-[#1b3858] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#dfc593]">
                Instant Execution Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Connect Directly to the Finasset Wealth Transacting Platform
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Seamless digital transactions across 35+ AMCs. Instant portfolio confirmation, zero paperwork, and bank-grade 256-bit encryption.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <a
                href={externalBuyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#C7A76C] hover:bg-[#dfc593] text-[#10243A] font-extrabold text-sm px-8 py-4 rounded-xl shadow-lg transition-all"
              >
                <span>Launch Mutual Fund Platform</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <span className="text-[11px] text-slate-400 block text-center mt-2">
                AMFI ARN-189204 Verified Gateway
              </span>
            </div>
          </div>

          {/* 3-Step Process for New Investors */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C7A76C]">
                Simple Onboarding
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#10243A] mt-1">
                How to Start in 3 Easy Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#F8F7F3] p-6 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#10243A] text-[#C7A76C] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-[#10243A] text-base">Digital KYC Verification</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete your PAN and Aadhaar paperless digital KYC in under 5 minutes without visiting any physical branch.
                </p>
              </div>

              <div className="bg-[#F8F7F3] p-6 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#10243A] text-[#C7A76C] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-[#10243A] text-base">Bank Mandate Automation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Set up an e-Mandate or Net Banking auto-debit so your monthly SIP investments are never missed or delayed.
                </p>
              </div>

              <div className="bg-[#F8F7F3] p-6 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#10243A] text-[#C7A76C] flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="font-bold text-[#10243A] text-base">Select Portfolio & Execute</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pick from our certified research-backed scheme recommendations or consult our advisors for bespoke allocation.
                </p>
              </div>
            </div>
          </div>

          {/* Need Assistance Callout */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#10243A]">Need assistance with KYC or fund selection?</h3>
              <p className="text-xs text-slate-600">
                Our team at Bhubaneswar is available on phone or in-person to guide you step-by-step.
              </p>
            </div>
            <Link
              href="/contact-us#callback"
              className="bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shrink-0"
            >
              Request Onboarding Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
