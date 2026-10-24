'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Building } from 'lucide-react';
import { useServiceStore } from '@/store/useServiceStore';

const INITIAL_VISIBLE = 3;

export default function OurServices({ initialServices = [] }) {
  const [showAll, setShowAll] = useState(false);
  const { services: storeServices, fetchServices, setServices } = useServiceStore();

  useEffect(() => {
    if (Array.isArray(initialServices) && initialServices.length > 0) {
      setServices(initialServices);
    } else {
      fetchServices(false);
    }
  }, [initialServices, setServices, fetchServices]);

  const services =
    Array.isArray(storeServices) && storeServices.length > 0
      ? storeServices
      : Array.isArray(initialServices) && initialServices.length > 0
      ? initialServices
      : [];

  // No services available -> hide the whole section
  if (services.length === 0) return null;

  const visibleServices = showAll ? services : services.slice(0, INITIAL_VISIBLE);

  return (
    <section id="services" className="py-10 sm:py-14 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (same pattern as News Feed) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#89b441] bg-[#89b441]/10 px-3.5 py-1 rounded-full border border-[#89b441]/25 inline-block mb-2.5">
              What We Offer
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-900 tracking-tight">
              Our Services
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md text-left sm:text-right leading-relaxed">
            Data-driven wealth creation and advisory solutions built for your long-term financial security.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {visibleServices.map((service, index) => {
            const title = service.title || service.name;
            const desc = service.shortDescription || service.description;
            const href = `/services/${service.slug}`;
            const img = service.imageUrl || service.image;

            return (
              <Link
                key={service.slug || index}
                href={href}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2376b8]/30 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                  {img ? (
                    <img
                      src={img}
                      alt={title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/70 text-slate-400">
                        <Building className="h-7 w-7" />
                      </div>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight transition-colors group-hover:text-[#2376b8]">
                    {title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs sm:text-sm leading-relaxed text-slate-500">
                    {desc}
                  </p>

                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold text-[#2376b8]">
                    Learn more
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Toggle */}
        {services.length > INITIAL_VISIBLE && (
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="group inline-flex items-center gap-2.5 rounded-full bg-slate-900 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#2376b8] hover:shadow-md"
            >
              <span>{showAll ? 'Show Less Services' : 'Explore all services'}</span>
              <ArrowRight
                className={`h-4 w-4 transition-transform duration-300 ${
                  showAll ? '-rotate-90' : 'group-hover:translate-x-1'
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}