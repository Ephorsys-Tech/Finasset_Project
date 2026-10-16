'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  DollarSign,
  Building,
  Phone,
} from 'lucide-react';

export default function NriCornerPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          type: 'consultation',
          serviceOfInterest: `NRI Advisory (${form.country || 'Global'})`,
          sourcePage: 'NRI Corner',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', country: '', message: '' });
      }
    } catch {
      alert('Failed to submit enquiry. Please email contact@finassetwealth.com directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Banner */}
      <section className="bg-[#0f2b44] text-white py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f87b1f]/20 border border-[#f87b1f]/30 text-[#f87b1f] text-xs font-bold uppercase tracking-wider mb-4">
            <Globe className="w-3.5 h-3.5 text-[#f87b1f]" />
            <span>Cross-Border Wealth Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            NRI Wealth & Investment Advisory
          </h1>
          <p className="text-slate-300 mt-4 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
            Harness the explosive growth of the Indian economy from wherever you live. 100% compliant investment avenues, FEMA guidance, and seamless repatriation back home to Odisha.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Key Advisory Pillars for NRIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:border-[#2376b8]/50 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f2b44] to-[#164366] text-[#2376b8] flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f2b44]">NRE & NRO Banking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear segregation between tax-free foreign currency deposits (NRE) and domestic Indian income streams like property rentals and dividends (NRO).
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:border-[#2376b8]/50 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f2b44] to-[#164366] text-[#89b441] flex items-center justify-center font-bold">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f2b44]">Real Estate & Land Due Diligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                On-ground verification of title deeds, RERA certifications, and municipal approvals in Bhubaneswar, Cuttack, and prime Odisha growth corridors.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:border-[#2376b8]/50 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f2b44] to-[#164366] text-[#f87b1f] flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f2b44]">Repatriation & Form 15CA/CB</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hassle-free repatriation of capital, maturity proceeds, and property sale funds abroad up to USD 1 Million per year in compliance with RBI guidelines.
              </p>
            </div>
          </div>

          {/* Deep Dive Section & Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#0f2b44]">
                Why Non-Resident Indians Choose Finasset Wealth
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Managing wealth from thousands of miles away requires unwavering trust. Finasset Wealth acts as your physical fiduciary in Odisha, overseeing your mutual fund allocations, tax filings, property documents, and succession planning.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#89b441] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2b44]">FATCA & CRS Compliant Mutual Funds</h4>
                    <p className="text-xs text-slate-500 mt-0.5">We guide investments across AMCs with seamless compliance for NRIs residing in the UAE, UK, Singapore, USA, and Canada.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#89b441] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2b44]">Double Taxation Avoidance Agreement (DTAA)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Ensure you do not pay taxes twice on the same income through proper utilization of Tax Residency Certificates (TRC).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#89b441] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2b44]">Complete Digital KYC</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Paperless onboarding from the comfort of your home abroad without needing to mail physical documents.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-5 bg-[#0f2b44] text-white rounded-3xl p-8 shadow-xl border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f87b1f] bg-[#f87b1f]/15 px-3 py-1 rounded-full border border-[#f87b1f]/30 inline-block mb-3">
                NRI Consultation Desk
              </span>
              <h3 className="text-2xl font-bold text-white mb-2">
                Connect With Our Cross-Border Advisor
              </h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Schedule a confidential Zoom or phone call tailored to your local time zone.
              </p>

              {submitted ? (
                <div className="bg-emerald-950/60 border border-emerald-500/50 p-4 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#89b441] mx-auto" />
                  <h4 className="text-sm font-bold text-white">Consultation Scheduled</h4>
                  <p className="text-xs text-slate-300">
                    Our cross-border desk will reach out via WhatsApp/Email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#2376b8]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#2376b8]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone (with Country Code e.g. +971...)"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#2376b8]"
                  />
                  <input
                    type="text"
                    placeholder="Current Country of Residence (e.g. UAE, USA, UK)"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#2376b8]"
                  />
                  <textarea
                    rows={2}
                    placeholder="Specific questions about mutual funds, NRE accounts, or property..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#2376b8]"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#f87b1f] hover:bg-[#d9620b] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md shadow-[#f87b1f]/20 transition-all"
                  >
                    {submitting ? 'Submitting...' : 'Schedule NRI Consultation'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
