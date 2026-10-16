'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Award,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Users,
  Compass,
  ArrowRight,
} from 'lucide-react';

export default function AboutUsPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/public/pages/about-us')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setPageData(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Banner */}
      <section className="bg-[#0f2b44] text-white py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f87b1f]/20 border border-[#f87b1f]/30 text-[#f87b1f] text-xs font-bold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5 text-[#f87b1f]" />
            <span>Corporate Heritage</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            About Finasset Wealth
          </h1>
          <p className="text-slate-300 mt-4 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
            A premier financial planning and wealth management firm under NLF Adhira Asset Services LLP, dedicated to disciplined wealth architecture in Bhubaneswar, Odisha.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Institutional Heritage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3 py-1 rounded-full border border-[#2376b8]/20 inline-block">
                Corporate Umbrella
              </span>
              <h2 className="text-3xl font-extrabold text-[#0f2b44] tracking-tight">
                NLF Adhira Asset Services LLP
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Finasset Wealth was established with an uncompromising mandate: to eliminate the conflict of interest prevalent in retail financial distribution and replace it with disciplined, research-driven fiduciary stewardship.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Operating from our headquarters in Bhubaneswar, we advise families, medical practitioners, corporate leaders, and Non-Resident Indians across 12+ countries. We do not gamble on speculative fads; we construct resilient balance sheets designed to weather economic storms.
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="text-2xl font-extrabold text-[#0f2b44]">15+ Years</div>
                  <div className="text-xs text-slate-500 mt-0.5">Advisory Heritage in Odisha</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="text-2xl font-extrabold text-[#0f2b44]">35+ AMCs</div>
                  <div className="text-xs text-slate-500 mt-0.5">Direct Institutional Tie-ups</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
                  alt="Finasset Wealth Headquarters Bhubaneswar"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>

          {/* Pillars of Advisory */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8] bg-[#f0f6fb] px-3.5 py-1 rounded-full border border-[#2376b8]/20 inline-block">
                Our Guiding Principles
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0f2b44] mt-2">
                The Four Pillars of Finasset Wealth
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200/60 hover:border-[#2376b8]/40 transition-all space-y-2">
                <Shield className="w-8 h-8 text-[#89b441]" />
                <h3 className="font-bold text-[#0f2b44] text-base">Fiduciary Integrity</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Client suitability always precedes distributor commission. Every scheme recommendation must justify its role in your portfolio.
                </p>
              </div>

              <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200/60 hover:border-[#2376b8]/40 transition-all space-y-2">
                <Compass className="w-8 h-8 text-[#2376b8]" />
                <h3 className="font-bold text-[#0f2b44] text-base">Goal-Linked Allocation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We refuse to invest in a vacuum. Every rupee is designated for a purpose: retirement, education, or legacy preservation.
                </p>
              </div>

              <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200/60 hover:border-[#2376b8]/40 transition-all space-y-2">
                <TrendingUp className="w-8 h-8 text-[#89b441]" />
                <h3 className="font-bold text-[#0f2b44] text-base">Unwavering Discipline</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rupee-cost averaging during market declines is the engine of long-term alpha. We prevent emotional decisions during volatility.
                </p>
              </div>

              <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200/60 hover:border-[#2376b8]/40 transition-all space-y-2">
                <Users className="w-8 h-8 text-[#f87b1f]" />
                <h3 className="font-bold text-[#0f2b44] text-base">Generational Continuity</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We structure wills, nominations, and asset ownership so that wealth passes smoothly across generations without family strife.
                </p>
              </div>
            </div>
          </div>

          {/* Bhubaneswar Office & Meeting CTA */}
          <div className="bg-[#0f2b44] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#89b441] bg-[#89b441]/15 px-3 py-1 rounded-full border border-[#89b441]/30 inline-block">
                Bhubaneswar Advisory Presence
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Visit Us at Saheed Nagar / Jaydev Vihar
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We welcome investors for in-person portfolio reviews, coffee consultations, or retirement planning roadmaps at our office in Bhubaneswar.
              </p>
            </div>

            <Link
              href="/contact-us"
              className="bg-[#f87b1f] hover:bg-[#d9620b] text-white font-bold text-sm px-7 py-4 rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-[#f87b1f]/25"
            >
              <span>Schedule Office Meeting</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
