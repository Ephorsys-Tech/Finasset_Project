'use client';

import { useEffect } from 'react';
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
} from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import { useServiceStore } from '@/store/useServiceStore';

export default function ServicesPage() {
  const { services, isLoading: loading, fetchServices } = useServiceStore();

  useEffect(() => {
    fetchServices(false);
  }, [fetchServices]);

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-8 h-8 text-[#2376b8]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-8 h-8 text-[#2376b8]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-8 h-8 text-[#89b441]" />;
      case 'Building':
        return <Building className="w-8 h-8 text-[#2376b8]" />;
      case 'Landmark':
        return <Landmark className="w-8 h-8 text-[#2376b8]" />;
      case 'PieChart':
        return <PieChart className="w-8 h-8 text-[#f87b1f]" />;
      default:
        return <TrendingUp className="w-8 h-8 text-[#2376b8]" />;
    }
  };

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Header Banner */}
      <PageHero
        title="Comprehensive Wealth & Financial Solutions"
        description="From strategic goal planning and multi-AMC mutual funds to high-yield bonds, insurance protection, and NRI advisory in Bhubaneswar, Odisha."
        imageSrc="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop"
        imageAlt="Comprehensive Wealth & Financial Solutions"
      />

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-[#2376b8] border-t-transparent rounded-full" />
            </div>
          )}

          {/* Empty state */}
          {!loading && services.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-[#0f2b44] mb-2">Services Coming Soon</h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Our advisory disciplines will be listed here shortly. In the meantime, feel free to
                reach out directly for a personalized consultation.
              </p>
              <Link
                href="/contact-us"
                className="mt-6 inline-flex items-center gap-2 bg-[#2376b8] hover:bg-[#1b5d92] text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Services grid */}
          {!loading && services.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((s) => (
                <div
                  key={s.slug}
                  className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#2376b8]/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Service image or icon */}
                    {s.image ? (
                      <div className="w-16 h-16 rounded-2xl mb-6 shadow-md overflow-hidden group-hover:scale-105 transition-transform">
                        <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0f2b44] to-[#164366] flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                        {getServiceIcon(s.iconName)}
                      </div>
                    )}

                    <h2 className="text-2xl font-bold text-[#0f2b44] mb-3 group-hover:text-[#2376b8] transition-colors">
                      {s.name}
                    </h2>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {s.shortDescription}
                    </p>

                    {s.keyBenefits && s.keyBenefits.length > 0 && (
                      <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                          Key Advantages
                        </span>
                        {s.keyBenefits.slice(0, 3).map((b, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#89b441] shrink-0 mt-0.5" />
                            <span>
                              <strong>{b.title}:</strong> {b.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      href={`/services/${s.slug}`}
                      className="w-full bg-[#2376b8] hover:bg-[#1b5d92] text-white text-sm font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:bg-[#f87b1f] group-hover:text-white shadow-sm"
                    >
                      <span>Explore Full Framework</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Consultation Banner */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2b44]">
            Uncertain which investment strategy fits your current life stage?
          </h2>
          <p className="text-slate-600 text-sm mt-3 max-w-2xl mx-auto">
            Schedule a personalized diagnostic consultation with our Bhubaneswar wealth advisory
            desk to analyze your current net worth, goals, and asset allocation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact-us#callback"
              className="bg-[#f87b1f] hover:bg-[#d9620b] text-white text-sm font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-[#f87b1f]/20 transition-all flex items-center gap-2"
            >
              <span>Schedule Advisor Meeting</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
            <Link
              href="/investor/financial-calculator"
              className="border border-[#2376b8] text-[#2376b8] hover:bg-[#f0f6fb] text-sm font-bold px-6 py-3.5 rounded-xl transition-all"
            >
              Try Financial Calculator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
