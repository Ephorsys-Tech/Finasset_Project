import React from 'react';
import Link from 'next/link';
import { Compass, Home, PhoneCall, ChevronRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-brand-cream/30 px-4 py-16">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-2xl bg-brand-navy/5 text-brand-gold flex items-center justify-center mx-auto mb-6 border border-brand-gold/20 shadow-sm">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>

        <div className="text-sm font-semibold uppercase tracking-widest text-brand-gold mb-2">
          Error 404
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-navy mb-4 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-gray-600 text-base mb-8 max-w-md mx-auto leading-relaxed">
          The wealth management destination or resource you are looking for does not exist or has been relocated.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand-gold text-brand-navy font-semibold hover:bg-brand-goldHover transition-colors shadow-md shadow-brand-gold/15"
          >
            <Home className="w-4 h-4" /> Return to Home
          </Link>
          <Link
            href="/contact-us"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-brand-navy/15 text-brand-navy font-medium hover:bg-brand-navy hover:text-white transition-colors"
          >
            <PhoneCall className="w-4 h-4" /> Contact Us <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-500">
          <Link href="/services" className="hover:text-brand-navy transition-colors">Our Services</Link>
          <Link href="/investor/financial-calculator" className="hover:text-brand-navy transition-colors">SIP Calculator</Link>
          <Link href="/investor/risk-profile" className="hover:text-brand-navy transition-colors">Risk Assessment</Link>
        </div>
      </div>
    </div>
  );
}
