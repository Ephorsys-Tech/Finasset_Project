'use client';

import { useState, useEffect } from 'react';
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
  Phone,
} from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/public/services')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setServices(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-8 h-8 text-[#C7A76C]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-8 h-8 text-[#C7A76C]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-8 h-8 text-[#C7A76C]" />;
      case 'Building':
        return <Building className="w-8 h-8 text-[#C7A76C]" />;
      case 'Landmark':
        return <Landmark className="w-8 h-8 text-[#C7A76C]" />;
      case 'PieChart':
        return <PieChart className="w-8 h-8 text-[#C7A76C]" />;
      default:
        return <TrendingUp className="w-8 h-8 text-[#C7A76C]" />;
    }
  };

  return (
    <div className="w-full bg-[#F8F7F3]">
      {/* Header Banner */}
      <section className="bg-[#10243A] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C7A76C] block mb-2">
            Advisory Disciplines
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Comprehensive Wealth & Financial Solutions
          </h1>
          <p className="text-slate-300 mt-4 leading-relaxed text-sm sm:text-base">
            From strategic goal planning and multi-AMC mutual funds to high-yield bonds, insurance protection, and NRI advisory in Bhubaneswar, Odisha.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s) => (
              <div
                key={s.slug}
                className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#C7A76C]/60 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-[#10243A] flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                    {getServiceIcon(s.iconName)}
                  </div>

                  <h2 className="text-2xl font-bold text-[#10243A] mb-3 group-hover:text-[#C7A76C] transition-colors">
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
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C7A76C] shrink-0 mt-0.5" />
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
                    className="w-full bg-[#10243A] hover:bg-[#1b3858] text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:bg-[#C7A76C] group-hover:text-[#10243A]"
                  >
                    <span>Explore Full Framework</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Banner */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10243A]">
            Uncertain which investment strategy fits your current life stage?
          </h2>
          <p className="text-slate-600 text-sm mt-3 max-w-2xl mx-auto">
            Schedule a personalized diagnostic consultation with our Bhubaneswar wealth advisory desk to analyze your current net worth, goals, and asset allocation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact-us#callback"
              className="bg-[#10243A] hover:bg-[#1b3858] text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow transition-all flex items-center gap-2"
            >
              <span>Schedule Advisor Meeting</span>
              <ArrowRight className="w-4 h-4 text-[#C7A76C]" />
            </Link>
            <Link
              href="/investor/risk-profile"
              className="border border-[#10243A] text-[#10243A] text-sm font-bold px-6 py-3.5 rounded-xl hover:bg-slate-50 transition-all"
            >
              Take Risk Assessment First
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
