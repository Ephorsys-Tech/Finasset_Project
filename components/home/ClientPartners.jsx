'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePartnerStore } from '@/store/usePartnerStore';
import { Building2 } from 'lucide-react';

/** Minimum cards per group so one group is always wider than the viewport */
const MIN_CARDS_PER_GROUP = 12;
/** Scroll speed in pixels per second */
const SPEED_PX_PER_SEC = 40;

function PartnerCard({ partner }) {
  const [imgFailed, setImgFailed] = useState(false);
  const logoSrc = partner.imageUrl || partner.logoUrl;
  const showLogo = Boolean(logoSrc) && !imgFailed;

  const card = (
    <div className="group mx-2.5 sm:mx-3.5 flex h-20 sm:h-24 min-w-[170px] sm:min-w-[210px] shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 sm:px-7 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2376b8]/40 hover:shadow-[0_10px_30px_-10px_rgba(35,118,184,0.35)]">
      {showLogo ? (
        <img
          src={logoSrc}
          alt={partner.name || 'Client Partner'}
          loading="lazy"
          draggable={false}
          onError={() => setImgFailed(true)}
          className="max-h-12 sm:max-h-14 w-auto max-w-[180px] sm:max-w-[200px] object-contain transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="text-center">
          <div className="whitespace-nowrap text-xs sm:text-sm font-bold text-[#0f2b44] transition-colors group-hover:text-[#2376b8]">
            {partner.name}
          </div>
          <div className="text-[10px] sm:text-[11px] font-medium text-slate-400">
            {partner.category || 'Mutual Fund AMC'}
          </div>
        </div>
      )}
    </div>
  );

  return partner.websiteUrl ? (
    <a
      href={partner.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`Visit ${partner.name}`}
      className="inline-block shrink-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2376b8]/50"
    >
      {card}
    </a>
  ) : (
    <div className="inline-block shrink-0">{card}</div>
  );
}

/**
 * Client Partners Component
 * Fetches dynamic partner institutions uploaded by Admin via Zustand & Axios.
 * Seamless infinite marquee – no gap between the end of one loop and the start of the next.
 */
export default function ClientPartners({ initialPartners = [] }) {
  const { partners, fetchPartners } = usePartnerStore();
  const groupRef = useRef(null);
  const [duration, setDuration] = useState(40);

  useEffect(() => {
    fetchPartners(false);
  }, [fetchPartners]);

  // Live partners if available, otherwise SSR partners
  const rawList = partners && partners.length > 0 ? partners : initialPartners;
  const displayPartners = useMemo(
    () =>
      Array.isArray(rawList)
        ? rawList.filter((p) => p && p.isPublished !== false)
        : [],
    [rawList]
  );

  // Repeat the list so ONE group is always wider than the screen
  const groupItems = useMemo(() => {
    if (displayPartners.length === 0) return [];
    const repeats = Math.max(1, Math.ceil(MIN_CARDS_PER_GROUP / displayPartners.length));
    return Array.from({ length: repeats }).flatMap((_, r) =>
      displayPartners.map((p, i) => ({ p, key: `${r}-${p._id || p.name || i}-${i}` }))
    );
  }, [displayPartners]);

  // Keep a constant speed regardless of how many partners exist
  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    const update = () => {
      const width = el.scrollWidth;
      if (width > 0) setDuration(Math.max(10, width / SPEED_PX_PER_SEC));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [groupItems]);

  return (
    <section
      id="client-partners"
      className="relative select-none overflow-hidden border-t border-slate-200/80 bg-gradient-to-b from-white to-slate-50/60 py-14 sm:py-20"
    >
      <style>{`
        @keyframes cp-scroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        .cp-track {
          display: flex;
          width: max-content;
          animation: cp-scroll var(--cp-duration, 40s) linear infinite;
          will-change: transform;
        }
        .cp-viewport:hover .cp-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .cp-track { animation: none; }
        }
      `}</style>

      <div className="mx-auto mb-8 max-w-7xl px-4 text-center sm:mb-12 sm:px-6 lg:px-8">
        <span className="inline-block rounded-full bg-[#2376b8]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#2376b8]">
          Trusted By
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#2376b8] sm:text-3xl lg:text-[34px]">
          Client Partners
        </h2>
        <div className="mx-auto mt-2.5 h-1 w-12 rounded-full bg-[#2376b8]" />
      </div>

      {displayPartners.length === 0 ? (
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2376b8]/10 text-[#2376b8]">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-[#10243A] sm:text-base">
              Institutional Partners Not Available
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
              Partner affiliations and AMC tie-ups are currently being updated. Please check back shortly.
            </p>
          </div>
        </div>
      ) : (
        <div className="cp-viewport relative w-full overflow-hidden">
          {/* Soft fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-white via-white/80 to-transparent sm:w-40" />

          {/* Track = 2 identical groups, translated by exactly -50% => seamless loop */}
          <div
            className="cp-track py-3"
            style={{ '--cp-duration': `${duration}s` }}
          >
            <div ref={groupRef} className="flex shrink-0 items-center">
              {groupItems.map(({ p, key }) => (
                <PartnerCard key={`a-${key}`} partner={p} />
              ))}
            </div>
            <div className="flex shrink-0 items-center" aria-hidden="true">
              {groupItems.map(({ p, key }) => (
                <PartnerCard key={`b-${key}`} partner={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}