'use client';

import React from 'react';
import Link from 'next/link';

export default function PageHero({
  title,
  description,
  imageSrc,
  imageAlt,
  breadcrumbs = null,
  children,
}) {
  return (
    <section className="relative overflow-hidden bg-[#0a1e30] text-white py-16 sm:py-24">
      {/* Background Image */}
      {imageSrc && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${imageSrc})` }}
          role="img"
          aria-label={imageAlt || (typeof title === 'string' ? title : 'Hero banner background')}
        />
      )}

      {/* Dark overlay & Finasset Brand Gradients for high contrast & legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1e30]/90 via-[#0f2b44]/85 to-[#0a1e30]/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0f2b44]/40 to-[#0a1e30]/75" />

      {/* Subtle brand glow highlights */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#f87b1f]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#2376b8]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Optional Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center justify-center gap-2 text-xs text-blue-200/80 uppercase tracking-wider mb-6 font-semibold">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white font-bold">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <span className="text-slate-400">/</span>}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Heading & Subtitle only */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#f87b1f] leading-tight drop-shadow-sm">
            {title}
          </h1>

          {description && (
            <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto drop-shadow">
              {description}
            </p>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
