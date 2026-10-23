'use client';

import { useEffect, useState } from 'react';
import { usePartnerStore } from '@/store/usePartnerStore';
import { Marquee } from '@/components/ui/marquee';
import { Building2 } from 'lucide-react';

/**
 * Client Partners Component
 * Fetches dynamic partner institutions uploaded by Admin via Zustand & Axios.
 * Displays "Not Available" notice if no partners are configured.
 */
export default function ClientPartners({ initialPartners = [] }) {
  const { partners, isLoading, fetchPartners } = usePartnerStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch live partners from backend API using Zustand & Axios
    fetchPartners(false);
  }, [fetchPartners]);

  // Use Zustand store partners once fetched, or initial SSR partners if provided
  const rawList = partners && partners.length > 0 ? partners : initialPartners;
  const displayPartners = Array.isArray(rawList)
    ? rawList.filter((p) => p && p.isPublished !== false)
    : [];

  return (
    <section
      id="client-partners"
      className="py-14 sm:py-20 bg-white border-t border-slate-200/80 overflow-hidden relative select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-10">
        {/* Section Title matching user reference image */}
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#2376b8] tracking-tight">
          Client Partners
        </h2>
        {/* Blue underline accent bar */}
        <div className="w-12 h-1 bg-[#2376b8] mx-auto mt-2.5 rounded-full" />
      </div>

      {displayPartners.length === 0 ? (
        /* Empty State: If no partners have been uploaded yet, show not available */
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#2376b8]/10 text-[#2376b8] flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#10243A]">
              Institutional Partners Not Available
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Partner affiliations and AMC tie-ups are currently being updated. Please check back shortly.
            </p>
          </div>
        </div>
      ) : (
        /* Marquee with soft gradient fade edges for uploaded partners */
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-20 bg-gradient-to-r from-white via-white/80 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-20 bg-gradient-to-l from-white via-white/80 to-transparent" />

          <Marquee pauseOnHover={true} speed={32} className="mt-0 sm:mt-0">
            {displayPartners.map((p, idx) => {
              const logoSrc = p.imageUrl || p.logoUrl;
              const CardContent = (
                <div className="mx-2.5 sm:mx-4 flex items-center justify-center bg-white hover:bg-slate-50/80 px-6 sm:px-7 py-3 rounded-2xl border border-slate-200/80 hover:border-[#2376b8]/40 hover:shadow-md transition-all duration-300 group shrink-0 h-20 sm:h-22 min-w-[170px] sm:min-w-[210px]">
                  {logoSrc ? (
                    <img
                      src={logoSrc}
                      alt={p.name || 'Client Partner'}
                      className="max-h-12 sm:max-h-14 w-auto max-w-[180px] sm:max-w-[200px] object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallbackEl = e.currentTarget.parentElement?.querySelector('.partner-text-fallback');
                        if (fallbackEl) fallbackEl.style.display = 'block';
                      }}
                    />
                  ) : null}

                  <div
                    className="partner-text-fallback text-center"
                    style={{ display: logoSrc ? 'none' : 'block' }}
                  >
                    <div className="text-xs sm:text-sm font-bold text-[#0f2b44] group-hover:text-[#2376b8] transition-colors whitespace-nowrap">
                      {p.name}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                      {p.category || 'Mutual Fund AMC'}
                    </div>
                  </div>
                </div>
              );

              return p.websiteUrl ? (
                <a
                  key={p._id || p.name || idx}
                  href={p.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                  title={`Visit ${p.name}`}
                >
                  {CardContent}
                </a>
              ) : (
                <div key={p._id || p.name || idx} className="inline-block">
                  {CardContent}
                </div>
              );
            })}
          </Marquee>
        </div>
      )}
    </section>
  );
}
