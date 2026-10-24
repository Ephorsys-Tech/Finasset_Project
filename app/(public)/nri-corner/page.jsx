'use client';

import { useState, useEffect } from 'react';
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
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import { useNriStore } from '@/store/useNriStore';
import { useEnquiryStore } from '@/store/useEnquiryStore';

export default function NriCornerPage() {
  const { items: nriItems, isLoading: loadingItems, fetchItems } = useNriStore();
  const { submitEnquiry } = useEnquiryStore();

  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Fetch dynamic NRI topics created by admin via Zustand store and Axios
  useEffect(() => {
    fetchItems(false);
  }, [fetchItems]);

  const validate = () => {
    const errors = {};

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      errors.name = 'Full name is required';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (/\d/.test(trimmedName)) {
      errors.name = 'Name cannot contain numbers';
    }

    const trimmedEmail = form.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    const trimmedPhone = form.phone.trim();
    const phoneValidChars = /^[+]?[\d\s\-()]+$/;
    const digitsOnly = trimmedPhone.replace(/\D/g, '');
    if (!trimmedPhone) {
      errors.phone = 'Phone number is required';
    } else if (!phoneValidChars.test(trimmedPhone) || digitsOnly.length < 7 || digitsOnly.length > 15) {
      errors.phone = 'Enter valid phone (7-15 digits, international e.g. +971 accepted)';
    }

    const trimmedCountry = form.country.trim();
    if (!trimmedCountry) {
      errors.country = 'Current country of residence is required';
    } else if (trimmedCountry.length < 2) {
      errors.country = 'Please enter a valid country name (e.g. UAE, USA, UK)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitEnquiry({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        country: form.country.trim(),
        message: form.message.trim(),
        type: 'nri',
        serviceOfInterest: `NRI Wealth Advisory (${form.country.trim() || 'Global'})`,
        sourcePage: 'NRI Corner',
      });

      if (result.success) {
        setSubmitted(true);
        setSubmittedData(result.data || {});
        setForm({ name: '', email: '', phone: '', country: '', message: '' });
        setFormErrors({});
      }
    } catch (err) {
      setSubmitError(err.message || 'Network error. Please call our office directly or try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = nriItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Banner */}
      <PageHero
        title="NRI Wealth & Investment Advisory"
        description="Harness the explosive growth of the Indian economy from wherever you live. 100% compliant investment avenues, FEMA guidance, and seamless repatriation back home to Odisha."
        imageSrc="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop"
        imageAlt="NRI Wealth & Investment Advisory"
      />

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Key Advisory Pillars for NRIs */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:border-[#2376b8]/50 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f2b44] to-[#164366] text-[#2376b8] flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f2b44]">NRE &amp; NRO Banking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear segregation between tax-free foreign currency deposits (NRE) and domestic Indian income streams like property rentals and dividends (NRO).
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:border-[#2376b8]/50 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f2b44] to-[#164366] text-[#89b441] flex items-center justify-center font-bold">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f2b44]">Real Estate &amp; Land Due Diligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                On-ground verification of title deeds, RERA certifications, and municipal approvals in Bhubaneswar, Cuttack, and prime Odisha growth corridors.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:border-[#2376b8]/50 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f2b44] to-[#164366] text-[#f87b1f] flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f2b44]">Repatriation &amp; Form 15CA/CB</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hassle-free repatriation of capital, maturity proceeds, and property sale funds abroad up to USD 1 Million per year in compliance with RBI guidelines.
              </p>
            </div>
          </div> */}

          {/* DYNAMIC NRI TOPICS & GUIDELINES (User & Admin Panel Integration) */}
          <div id="knowledge-base" className="space-y-8 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3.5 py-1 rounded-full border border-[#2376b8]/20 inline-flex items-center gap-1.5 mb-2.5">
                  {/* <Sparkles className="w-3.5 h-3.5 text-[#f87b1f]" /> */}
                  <span>NRI Knowledge Base &amp; Regulatory Guidelines</span>
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2b44]">
                  Essential NRI Investment &amp; Regulatory Insights
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
                  Comprehensive answers to NRI definitions, FEMA regulations, account structures (NRE/NRO/FCNR), and cross-border investment advisory.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search guidelines (e.g. NRE, PIO)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2376b8] shadow-sm"
                />
              </div>
            </div>

            {loadingItems ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                <div className="animate-spin w-8 h-8 border-4 border-[#2376b8] border-t-transparent rounded-full mx-auto" />
                <p className="text-xs text-slate-500 font-semibold">Loading NRI regulatory topics...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-2">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-[#0f2b44]">No topics found</h4>
                <p className="text-xs text-slate-500">
                  {searchQuery ? `No guidelines matching "${searchQuery}".` : 'No guidelines published yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item, idx) => {
                  const isExpanded = expandedId === item._id;
                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-[#2376b8]/40 hover:shadow-md transition-all overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item._id)}
                        className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex items-start gap-3.5">
                          <span className="w-7 h-7 rounded-lg bg-[#2376b8]/10 text-[#2376b8] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#2376b8]/15">
                            {idx + 1}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-[#0f2b44] leading-snug">
                            {item.title}
                          </h3>
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#2376b8]" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </button>

                      {/* Content Description (Visible or Expandable) */}
                      <div
                        className={`px-6 pb-6 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line border-t border-slate-100 ${
                          isExpanded ? 'block' : 'block'
                        }`}
                      >
                        <div className="pl-10 text-slate-700 font-normal">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Deep Dive Section & Consultation Form */}
          <div id="consultation" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start scroll-mt-24">
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
                    <h4 className="text-sm font-bold text-[#0f2b44]">FATCA &amp; CRS Compliant Mutual Funds</h4>
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
                <div className="bg-emerald-950/70 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-10 h-10 text-[#89b441] mx-auto" />
                  <h4 className="text-base font-bold text-white">Consultation Scheduled!</h4>
                  {submittedData?.trackingNumber && (
                    <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-[11px] font-mono text-[#89b441] border border-[#89b441]/30">
                      Ref: {submittedData.trackingNumber}
                    </div>
                  )}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Thank you! Your inquiry has been routed to our cross-border advisory desk in Bhubaneswar. Our senior advisor will reach out to you shortly via WhatsApp / Email.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setSubmittedData(null);
                    }}
                    className="text-xs text-[#f87b1f] hover:underline font-bold mt-2 block mx-auto"
                  >
                    Schedule Another Consultation
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {submitError && (
                    <div className="p-3 bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priyabrata Das"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                      }}
                      className={`w-full bg-slate-800 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors ${
                        formErrors.name
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-700 focus:border-[#2376b8]'
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-rose-400 text-[11px] font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. priyabrata@example.com"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                      }}
                      className={`w-full bg-slate-800 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors ${
                        formErrors.email
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-700 focus:border-[#2376b8]'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-rose-400 text-[11px] font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.email}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Phone Number (with Country Code) *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +971 50 1234567 or +91 94370 12345"
                      value={form.phone}
                      onChange={(e) => {
                        setForm({ ...form, phone: e.target.value });
                        if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                      }}
                      className={`w-full bg-slate-800 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors ${
                        formErrors.phone
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-700 focus:border-[#2376b8]'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-rose-400 text-[11px] font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Current Country of Residence *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UAE, USA, United Kingdom, Singapore, Canada"
                      value={form.country}
                      onChange={(e) => {
                        setForm({ ...form, country: e.target.value });
                        if (formErrors.country) setFormErrors({ ...formErrors, country: '' });
                      }}
                      className={`w-full bg-slate-800 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors ${
                        formErrors.country
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-700 focus:border-[#2376b8]'
                      }`}
                    />
                    {formErrors.country && (
                      <p className="text-rose-400 text-[11px] font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.country}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Specific Inquiries / Questions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Questions regarding mutual funds, NRE/NRO accounts, property, or repatriation..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#2376b8]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#f87b1f] hover:bg-[#d9620b] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md shadow-[#f87b1f]/20 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <span>Schedule NRI Consultation</span>
                    )}
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
