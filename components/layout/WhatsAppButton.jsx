'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { BRAND } from '@/lib/constants';
import { X, Send, MessageCircle, Sparkles, CheckCheck, ChevronRight } from 'lucide-react';

// Official WhatsApp Vector Icon
function WhatsAppIcon({ className = 'w-7 h-7 text-white' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.9C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.68C7.02 10.88 7.89 12.04 8.01 12.2C8.13 12.37 9.74 14.85 12.21 15.91C12.8 16.16 13.25 16.31 13.61 16.42C14.2 16.61 14.74 16.58 15.16 16.52C15.63 16.45 16.62 15.92 16.82 15.35C17.03 14.78 17.03 14.29 16.97 14.19C16.91 14.09 16.76 14.03 16.51 13.91C16.26 13.78 15.05 13.19 14.83 13.1C14.6 13.02 14.44 12.98 14.27 13.23C14.11 13.48 13.63 14.03 13.49 14.19C13.34 14.36 13.2 14.38 12.95 14.26C12.7 14.13 11.89 13.87 10.94 13.02C10.2 12.35 9.7 11.53 9.55 11.28C9.4 11.03 9.53 10.9 9.66 10.77C9.77 10.66 9.91 10.47 10.04 10.33C10.17 10.18 10.21 10.08 10.3 9.91C10.38 9.75 10.34 9.6 10.28 9.48C10.22 9.35 9.73 8.15 9.53 7.65C9.33 7.17 9.13 7.23 8.97 7.22C8.83 7.22 8.67 7.22 8.53 7.33Z" />
    </svg>
  );
}

// Curated Wealth Advisory Inquiry Options
const QUICK_TOPICS = [
  {
    id: 'mutual-funds',
    label: 'Mutual Funds & SIP',
    emoji: '📈',
    message: 'Hello Finasset Wealth, I would like to inquire about starting or optimizing my Mutual Funds / SIP portfolio.',
  },
  {
    id: 'pms',
    label: 'PMS Advisory',
    emoji: '💼',
    message: 'Hello Finasset Wealth, I would like to consult on Portfolio Management Services (PMS) & bespoke strategies.',
  },
  {
    id: 'nri',
    label: 'NRI Investment Desk',
    emoji: '🌐',
    message: 'Hello Finasset Wealth, I am an NRI looking for cross-border wealth management and taxation guidance in India.',
  },
  {
    id: 'insurance',
    label: 'Insurance & Health',
    emoji: '🛡️',
    message: 'Hello Finasset Wealth, I want to review my comprehensive Life & Health Insurance portfolio.',
  },
];

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const containerRef = useRef(null);

  // Raw phone number sanitized from brand constants
  const rawPhone = BRAND?.contact?.primaryPhone || '+91 94370 12345';
  const cleanPhone = rawPhone.replace(/\D/g, ''); // e.g. "919437012345"

  // Mount effect & subtle teaser timer
  useEffect(() => {
    setMounted(true);

    // Gently show friendly greeting teaser after 2.5s on initial page load
    const timer = setTimeout(() => {
      setShowTeaser(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Handle outside click to close chat popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hide completely on /admin routes (matching public Navbar & Footer behavior)
  if (!mounted || (pathname && pathname.startsWith('/admin'))) {
    return null;
  }

  // Helper to open WhatsApp URL
  const openWhatsApp = (msg) => {
    const textToSend =
      msg ||
      customInput.trim() ||
      'Hello Finasset Wealth! I am interested in your wealth management and financial advisory services. Please guide me.';
    const encoded = encodeURIComponent(textToSend);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    openWhatsApp(customInput);
    setCustomInput('');
    setIsOpen(false);
  };

  const handleTopicClick = (msg) => {
    openWhatsApp(msg);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="fixed z-40 flex flex-col items-end pointer-events-none select-none right-4 sm:right-6 md:right-8 bottom-5 sm:bottom-6 md:bottom-8"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      aria-label="Finasset Wealth WhatsApp Support"
    >
      {/* 1. Quick Interactive Chat Card Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Finasset Wealth WhatsApp Chat"
          className="pointer-events-auto mb-3.5 w-[calc(100vw-2rem)] max-w-[340px] sm:max-w-[370px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200 origin-bottom-right"
        >
          {/* Card Header with WhatsApp Green Gradient */}
          <div className="bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#25D366] text-white p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Official Brand Mini Avatar with Online Status */}
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                    <WhatsAppIcon className="w-6 h-6 text-white" />
                  </div>
                  {/* Active Online Pulse Dot */}
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#128C7E] rounded-full">
                    <span className="absolute inset-0 rounded-full bg-emerald-300 animate-ping opacity-75" />
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                    Finasset Wealth Desk
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  </h3>
                  <p className="text-[11px] text-emerald-100/90 flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
                    Online • Typically replies in 5 mins
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
                aria-label="Close WhatsApp chat popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-header info badge */}
            <div className="mt-2.5 pt-2 border-t border-white/15 text-[10px] text-emerald-100 flex items-center justify-between">
              <span>Bhubaneswar Advisory Desk</span>
              <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-[9px] tracking-wider">
                ARN-189204
              </span>
            </div>
          </div>

          {/* Card Body: Chat Bubble + Quick Options */}
          <div className="p-4 bg-slate-50 space-y-3.5 max-h-[60vh] overflow-y-auto">
            {/* Incoming Advisor Chat Bubble */}
            <div className="flex items-start gap-2 max-w-[90%]">
              <div className="bg-white rounded-2xl rounded-tl-sm p-3.5 shadow-sm border border-slate-200/80 text-xs text-slate-700 leading-relaxed space-y-1">
                <p className="font-medium text-slate-800">
                  Hello! Welcome to <span className="text-[#0f2b44] font-semibold">Finasset Wealth</span> 👋
                </p>
                <p className="text-slate-600 text-[11.5px]">
                  How can our certified wealth advisors assist your investment journey today?
                </p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-0.5">
                  <span>Just now</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#25D366]" />
                </div>
              </div>
            </div>

            {/* Quick Topic Chips */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-1">
                Common Consultations:
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleTopicClick(topic.message)}
                    className="w-full text-left flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-300 text-xs text-slate-700 hover:text-emerald-900 transition-all duration-150 group shadow-xs active:scale-[0.99]"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-sm">{topic.emoji}</span>
                      <span className="font-medium">{topic.label}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Message Input Box */}
            <form onSubmit={handleCustomSubmit} className="pt-1">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Type your query..."
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl pl-3 pr-10 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
                />
                <button
                  type="submit"
                  aria-label="Send WhatsApp message"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#25D366] hover:bg-[#1ebd59] text-white rounded-lg transition-transform active:scale-95 disabled:opacity-40"
                  disabled={!customInput.trim()}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Direct Instant Chat Action Button */}
            <button
              type="button"
              onClick={() => handleTopicClick()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#22c55e] hover:to-[#0f766e] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>Start WhatsApp Conversation</span>
            </button>
          </div>

          {/* Footer security reassurance */}
          <div className="px-4 py-2 bg-slate-100 border-t border-slate-200/80 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <span>🔒 Official End-to-End Encrypted Advisory</span>
          </div>
        </div>
      )}

      {/* 2. Floating Greeting Teaser Pill (Shows automatically after delay or on hover) */}
      {!isOpen && showTeaser && !teaserDismissed && (
        <div className="pointer-events-auto mb-2.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-slate-800 px-3.5 py-2 rounded-full shadow-lg border border-slate-200/90 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[280px] sm:max-w-xs group cursor-pointer hover:border-emerald-300 hover:shadow-emerald-500/10 transition-all">
          <div
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 truncate"
            title="Click to open WhatsApp options"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="truncate">Need advice? Chat with us!</span>
            <span className="text-emerald-600 font-semibold text-[11px] hover:underline">
              Open
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTeaserDismissed(true);
            }}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-1"
            aria-label="Dismiss chat hint"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 3. Main WhatsApp Circular Floating Button */}
      <div className="relative pointer-events-auto group">
        {/* Soft Ambient Radar Ping Wave */}
        <span
          className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-50 animate-ping pointer-events-none"
          aria-hidden="true"
        />

        {/* Ambient Glow Aura */}
        <span
          className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />

        {/* Button Wrapper */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative flex items-center justify-center w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] text-white shadow-[0_10px_25px_-5px_rgba(37,211,102,0.45)] hover:shadow-[0_15px_35px_-5px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/50 ${
            isOpen ? 'rotate-90' : 'rotate-0'
          }`}
          aria-label={isOpen ? 'Close WhatsApp options' : 'Chat with Finasset Wealth on WhatsApp'}
          aria-expanded={isOpen}
          title={isOpen ? 'Close chat' : 'Chat with us on WhatsApp'}
        >
          {isOpen ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform duration-300" />
          ) : (
            <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md transition-transform duration-300 group-hover:scale-110" />
          )}

          {/* Active Status Badge Dot (Top-Right) */}
          {!isOpen && (
            <span
              className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs"
              aria-hidden="true"
            >
              <span className="sr-only">Advisors Online</span>
            </span>
          )}
        </button>

        {/* Desktop-only Hover Tooltip (Hidden on small touchscreens) */}
        {!isOpen && (
          <div className="hidden lg:block absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 whitespace-nowrap">
            <div className="bg-[#0f2b44] text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl border border-slate-700/60 flex items-center gap-1.5">
              <span>Chat on WhatsApp</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-[#0f2b44] rotate-45 border-t border-r border-slate-700/60" />
          </div>
        )}
      </div>
    </div>
  );
}
