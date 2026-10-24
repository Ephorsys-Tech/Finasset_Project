'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Receipt,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Building,
  GraduationCap,
  HeartPulse,
  Home,
  HelpCircle,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import { useTaxationStore } from '@/store/useTaxationStore';
import { useEnquiryStore } from '@/store/useEnquiryStore';

export default function TaxationPage() {
  const { items: dynamicItems, isLoading: loading, fetchItems } = useTaxationStore();
  const { submitEnquiry, isSubmitting } = useEnquiryStore();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    taxBracket: 'Salaried Individual (30% Slab)',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

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
    if (trimmedEmail && !emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    const trimmedPhone = form.phone.trim();
    const phoneValidChars = /^[+]?[\d\s\-()]+$/;
    const digitsOnly = trimmedPhone.replace(/\D/g, '');
    if (!trimmedPhone) {
      errors.phone = 'Phone number is required';
    } else if (!phoneValidChars.test(trimmedPhone) || digitsOnly.length < 7 || digitsOnly.length > 15) {
      errors.phone = 'Enter valid phone (7-15 digits, e.g. +91 94370 12345)';
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

    try {
      const result = await submitEnquiry({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        type: 'taxation',
        serviceOfInterest: `Tax Planning Advisory (${form.taxBracket})`,
        sourcePage: 'Taxation Page',
        message: form.message.trim(),
      });

      if (result.success) {
        setSubmitted(true);
        setSubmittedData(result.data || {});
        setForm({
          name: '',
          email: '',
          phone: '',
          taxBracket: 'Salaried Individual (30% Slab)',
          message: '',
        });
        setFormErrors({});
      } else {
        setSubmitError(result.error || 'Failed to submit enquiry. Please check your inputs.');
      }
    } catch (err) {
      setSubmitError(err.message || 'Network error. Please call our office directly or try again later.');
    }
  };

  const filteredItems = (dynamicItems || []).filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(q) ||
      (item.section && item.section.toLowerCase().includes(q)) ||
      item.description?.toLowerCase().includes(q) ||
      (item.risk && item.risk.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Banner matching NRI Corner format */}
      <PageHero
        title="Taxation & Strategic Tax Planning"
        description="Planning is the key to successfully and legally reducing your tax liability. We go beyond tax compliance and proactively recommend tax saving strategies to maximize your after-tax income."
        imageSrc="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop"
        imageAlt="Taxation & Strategic Tax Planning"
      />

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

          {/* DYNAMIC TAX KNOWLEDGE BASE & GUIDELINES (Exact NRI Corner Layout) */}
          <div id="knowledge-base" className="space-y-8 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f2b44]">
                  Best Tax Saving Investments &amp; Expense Deductions
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
                  Comprehensive provisions under the Income Tax Act to legally reduce your taxable income through eligible investments and essential expenses.
                </p>
              </div>

              {/* Search Box matching NRI Corner */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search guidelines (e.g. ELSS, PPF, 80D)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2376b8] shadow-sm"
                />
              </div>
            </div>

            {loading && (!dynamicItems || dynamicItems.length === 0) ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#2376b8] animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-semibold">Loading live taxation guidelines...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-2">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-[#0f2b44]">No tax topics found</h4>
                <p className="text-xs text-slate-500">
                  {searchQuery ? `No guidelines matching "${searchQuery}".` : 'No taxation topics published yet. Add topics via the Admin Panel.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item, idx) => {
                  const itemId = item._id || item.id || `tax-${idx}`;
                  const isOpen = expandedId === itemId || hoveredId === itemId;
                  return (
                    <div
                      key={itemId}
                      onMouseEnter={() => setHoveredId(itemId)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? 'border-[#2376b8]/50 shadow-md ring-1 ring-[#2376b8]/15'
                          : 'border-slate-200/90 shadow-sm hover:border-[#2376b8]/40 hover:shadow-md'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedId(expandedId === itemId ? null : itemId)}
                        className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-start gap-3.5">
                          <span
                            className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border transition-colors duration-300 ${
                              isOpen
                                ? 'bg-[#2376b8] text-white border-[#2376b8]'
                                : 'bg-[#2376b8]/10 text-[#2376b8] border-[#2376b8]/15 group-hover:bg-[#2376b8]/20'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <h3
                            className={`text-base sm:text-lg font-bold leading-snug transition-colors duration-300 ${
                              isOpen ? 'text-[#2376b8]' : 'text-[#0f2b44] group-hover:text-[#2376b8]'
                            }`}
                          >
                            {item.title}
                          </h3>
                        </div>
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
                            isOpen
                              ? 'bg-[#2376b8]/10 text-[#2376b8]'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                          }`}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ease-out ${
                              isOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                          />
                        </div>
                      </button>

                      {/* Smooth Transition Answer Container */}
                      <div
                        className={`grid transition-all duration-300 ease-out ${
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                        style={{
                          gridTemplateRows: isOpen ? '1fr' : '0fr',
                          transition: 'grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease-out',
                        }}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 sm:px-6 pb-6 pt-2 text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line border-t border-slate-100">
                            <div className="pl-0 sm:pl-10 text-slate-700 font-normal">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Deep Dive Section & Consultation Form (Exact NRI Corner Layout) */}
          <div id="consultation" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start scroll-mt-24">
            {/* Left Column: Why Choose Finasset for Tax Planning */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3.5 py-1 rounded-full border border-[#2376b8]/20 inline-block">
                Tax Planning Strategy
              </span>
              <h2 className="text-2xl font-bold text-[#0f2b44]">
                Proactive Tax Planning Beyond Compliance
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Planning is the key to successfully and legally reducing your tax liability. We go beyond tax compliance and proactively recommend tax saving strategies to maximize your after-tax income.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our consultants make it a priority to enhance their mastery of the current tax law, complex tax code, and new tax regulations by attending frequent tax seminars. Businesses and individuals pay the lowest amount of taxes allowable by law because we continually look for ways to minimize your taxes throughout the year, not just at the end of the year.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                With the growing complexity &amp; diversity of available options for tax planning purposes, it is important that we critically examine and bring across to you the new generation options available for investors in the present investment market. There are various provisions in the Income Tax Act to save tax. The saving schemes one should opt for would depend on the person’s income and the tax bracket he / she is in.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#89b441] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2b44]">Customized Tax Saving Strategy</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Investing in Equity Linked Savings Scheme (ELSS) may result in greater savings for one person while investing in PPF may result in better tax saving for another. The tax saving strategy should be finalized on an individual basis after discussion.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#89b441] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2b44]">Suitability Based on Income Slabs</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      For tax saving point of view, the suitability of a scheme depends directly on which income tax slab one is in.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#89b441] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0f2b44]">Net Taxable Income Optimization</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      After deducting all eligible investments and expenses from your total gross income, you are left with your &lsquo;Net Taxable Income&rsquo;. We calculate tax liabilities for male salaried individuals, women, and senior citizens to determine the ideal path.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dark Consultation Form matching NRI Corner */}
            <div className="lg:col-span-5 bg-[#0f2b44] text-white rounded-3xl p-8 shadow-xl border border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f87b1f] bg-[#f87b1f]/15 px-3 py-1 rounded-full border border-[#f87b1f]/30 inline-block mb-3">
                Tax Consultation Desk
              </span>
              <h3 className="text-2xl font-bold text-white mb-2">
                Connect With Our Tax &amp; Investment Advisor
              </h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Schedule a confidential consultation to finalize your individual tax saving strategy and optimize your Net Taxable Income.
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
                    Thank you! Your tax inquiry has been routed to our advisory team. Our senior consultant will reach out to you shortly via Phone / Email.
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
                      Email Address
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
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 94370 12345"
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
                      Taxpayer Category / Slab
                    </label>
                    <select
                      value={form.taxBracket}
                      onChange={(e) => setForm({ ...form, taxBracket: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#2376b8]"
                    >
                      <option value="Salaried Individual">Salaried Individual</option>
                      <option value="Self-Employed / Business Owner">Self-Employed / Business Owner</option>
                      <option value="Senior Citizen (60+ Years)">Senior Citizen (60+ Years)</option>
                      <option value="Non-Resident Indian (NRI)">Non-Resident Indian (NRI)</option>
                      <option value="HUF / Family Entity">HUF / Family Entity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Specific Tax Planning Inquiries
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Inquiries regarding ELSS vs PPF, Home loan principal vs interest deduction, 80D mediclaim limits..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#2376b8]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#f87b1f] hover:bg-[#d9620b] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md shadow-[#f87b1f]/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <span>Schedule Tax Consultation</span>
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
