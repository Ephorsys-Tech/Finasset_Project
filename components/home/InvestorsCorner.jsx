'use client';

import FeatureCarousel from '@/components/ui/feature-carousel';

/**
 * Investor's Corner Component
 * Compact section header + interactive feature carousel.
 * Usage: <InvestorsCorner />
 */
export default function InvestorsCorner() {
  return (
    <section
      id="investors-corner"
      className="py-10 sm:py-14 bg-[#f8fafc] scroll-mt-20 border-t border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            {/* <span className="text-xs font-bold uppercase tracking-wider text-[#f87b1f] bg-[#f87b1f]/10 px-3.5 py-1 rounded-full border border-[#f87b1f]/20 inline-block mb-2.5">
              Investor Empowerment
            </span> */}
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-900 tracking-tight">
              Investor&apos;s Corner
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md text-left sm:text-right leading-relaxed">
            Calculate compounding wealth, test your risk tolerance, and explore personalized advisory tools.
          </p>
        </div>
      </div>

      <FeatureCarousel />
    </section>
  );
}