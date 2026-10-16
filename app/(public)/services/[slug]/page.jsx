'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Compass,
  ShieldCheck,
  Building,
  Landmark,
  PieChart,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Phone,
  Mail,
  Calendar,
  Lock,
} from 'lucide-react';

export default function ServiceDetailPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/public/services/${slug}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setServiceData(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    setInquirySubmitting(true);
    try {
      const res = await fetch('/api/v1/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inquiryName,
          phone: inquiryPhone,
          serviceOfInterest: serviceData?.service?.name || 'Service Consultation',
          sourcePage: `Service Page: ${slug}`,
          type: 'consultation',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInquirySubmitted(true);
        setInquiryName('');
        setInquiryPhone('');
      }
    } catch {
      alert('Failed to submit consultation request. Please call our Bhubaneswar office.');
    } finally {
      setInquirySubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-[#2376b8] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm font-semibold">Loading service details...</p>
      </div>
    );
  }

  const service = serviceData?.service;
  const otherServices = serviceData?.otherServices || [];

  if (!service) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-[#0f2b44]">Service Not Found</h1>
        <p className="text-slate-500 text-sm mt-2">
          The requested financial discipline does not exist or has been modified.
        </p>
        <Link
          href="/services"
          className="mt-6 inline-block bg-[#0f2b44] text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
        >
          View All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Banner */}
      <section className="bg-[#0f2b44] text-white py-16 sm:py-20 relative overflow-hidden">
        {service.bannerImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: `url(${service.bannerImage})` }}
          />
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-blue-200 uppercase tracking-wider mb-4 font-semibold">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:underline">Services</Link>
            <span>/</span>
            <span className="text-white">{service.name}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            {service.name}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
            {service.shortDescription}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content (8 Cols) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Detailed Overview */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] block mb-2">
                  Comprehensive Overview
                </span>
                <h2 className="text-2xl font-bold text-[#0f2b44] mb-4">
                  The Strategic Role of {service.name}
                </h2>
                <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                  {service.fullDescription}
                </p>
              </div>

              {/* Key Benefits */}
              {service.keyBenefits && service.keyBenefits.length > 0 && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#f87b1f] block mb-2">
                    Why Finasset Wealth
                  </span>
                  <h2 className="text-2xl font-bold text-[#0f2b44] mb-6">
                    Core Benefits & Capabilities
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {service.keyBenefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-3 bg-[#f8fafc] p-4 rounded-xl border border-slate-200/60">
                        <CheckCircle2 className="w-5 h-5 text-[#89b441] shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-bold text-sm text-[#0f2b44]">{b.title}</h3>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{b.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Sections */}
              {service.contentSections && service.contentSections.length > 0 && (
                <div className="space-y-8">
                  {service.contentSections.map((sec, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm">
                      <h2 className="text-2xl font-bold text-[#0f2b44] mb-4">{sec.title}</h2>
                      <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* FAQs Accordion */}
              {service.faqs && service.faqs.length > 0 && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <HelpCircle className="w-5 h-5 text-[#2376b8]" />
                    <h2 className="text-2xl font-bold text-[#0f2b44]">Frequently Asked Questions</h2>
                  </div>
                  <div className="space-y-4">
                    {service.faqs.map((faq, i) => (
                      <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full text-left p-4 font-bold text-sm sm:text-base text-[#0f2b44] flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-500 transition-transform ${
                              openFaq === i ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {openFaq === i && (
                          <div className="p-4 bg-white text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar (4 Cols) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Consultation Quick Box */}
              <div className="bg-[#0f2b44] text-white rounded-2xl p-6 shadow-xl border border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#f87b1f] block mb-1">
                  Connect With Advisor
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  Discuss Your Portfolio
                </h3>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                  Speak directly with a senior fiduciary consultant in Bhubaneswar regarding {service.name}.
                </p>

                {inquirySubmitted ? (
                  <div className="bg-emerald-950/60 border border-emerald-500/50 p-4 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#89b441] mx-auto" />
                    <h4 className="text-sm font-bold text-white">Consultation Requested</h4>
                    <p className="text-xs text-slate-300">
                      Our advisory desk will contact you within business hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInquiry} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#f87b1f]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="10-Digit Mobile Number"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#f87b1f]"
                    />
                    <button
                      type="submit"
                      disabled={inquirySubmitting}
                      className="w-full bg-[#f87b1f] hover:bg-[#d9620b] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-all shadow-md shadow-[#f87b1f]/20"
                    >
                      {inquirySubmitting ? 'Submitting...' : 'Request Consultation'}
                    </button>
                  </form>
                )}

                <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#89b441]" />
                    <span>+91 94370 12345 / +91 674 2548900</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#2376b8]" />
                    <span>contact@finassetwealth.com</span>
                  </div>
                </div>
              </div>

              {/* Other Services Navigation */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0f2b44] mb-4 pb-2 border-b border-slate-100">
                  Other Wealth Disciplines
                </h3>
                <div className="space-y-2">
                  {otherServices.map((os) => (
                    <Link
                      key={os.slug}
                      href={`/services/${os.slug}`}
                      className="block p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="text-sm font-semibold text-[#0f2b44] group-hover:text-[#2376b8] transition-colors flex items-center justify-between">
                        <span>{os.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2376b8] transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Risk Profile CTA */}
              <div className="bg-[#2376b8]/10 border border-[#2376b8]/20 rounded-2xl p-6 text-center space-y-3">
                <h4 className="font-bold text-sm text-[#0f2b44]">
                  Know Your Asset Allocation
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Take our 2-minute psychometric test to discover how much equity and debt is right for you.
                </p>
                <Link
                  href="/investor/risk-profile"
                  className="inline-block bg-[#0f2b44] hover:bg-[#2376b8] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
                >
                  Start Risk Profile Test
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
