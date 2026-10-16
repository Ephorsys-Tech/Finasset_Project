'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronUp, ChevronDown } from 'lucide-react';

// Exact default fallback slide matching screenshot
const DEFAULT_SLIDES = [
  {
    id: 1,
    title: 'Grow Your Wealth With Smart Financial Planning',
    subtitle:
      'Personalized portfolio management and mutual fund strategies designed to secure your long-term goals.',
    bgImage:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1920&q=80',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    title: 'Retirement Planning Made Simple & Secure',
    subtitle:
      'Calculate your corpus and build sustainable passive income for your post-work life.',
    bgImage:
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1920&q=80',
    order: 2,
    isActive: true,
  },
];

/**
 * Parses dynamic title and highlights brand colors matching the exact design:
 * - "Grow Your Wealth" / "Retirement Planning" in #f87b1f (Orange)
 * - "Smart" in #2376b8 (Blue)
 * - "Secure" in #89b441 (Green)
 * - Other words in crisp white
 */
function renderHighlightedTitle(title = '') {
  if (!title) return null;

  // Exact 3-line format match for the primary title
  if (
    title.toLowerCase().trim() ===
    'grow your wealth with smart financial planning'.toLowerCase()
  ) {
    return (
      <>
        <span className="block text-[#f87b1f]">Grow Your Wealth</span>
        <span className="block">
          <span className="text-white">With </span>
          <span className="text-[#2376b8]">Smart</span>
          <span className="text-white"> Financial</span>
        </span>
        <span className="block text-white">Planning</span>
      </>
    );
  }

  // Exact format for Retirement planning
  if (
    title.toLowerCase().trim() ===
    'retirement planning made simple & secure'.toLowerCase()
  ) {
    return (
      <>
        <span className="block text-[#f87b1f]">Retirement Planning</span>
        <span className="block">
          <span className="text-white">Made Simple &amp; </span>
          <span className="text-[#89b441]">Secure</span>
        </span>
      </>
    );
  }

  // Dynamic parser for any custom title configured in Admin
  const regex = /(Grow Your Wealth|Retirement Planning|\bSmart\b|\bSecure\b)/gi;
  if (regex.test(title)) {
    const parts = title.split(regex);
    return parts.map((part, i) => {
      if (!part) return null;
      const lower = part.toLowerCase();
      if (lower === 'grow your wealth' || lower === 'retirement planning') {
        return (
          <span key={i} className="text-[#f87b1f]">
            {part}
          </span>
        );
      }
      if (lower === 'smart') {
        return (
          <span key={i} className="text-[#2376b8]">
            {part}
          </span>
        );
      }
      if (lower === 'secure') {
        return (
          <span key={i} className="text-[#89b441]">
            {part}
          </span>
        );
      }
      return (
        <span key={i} className="text-white">
          {part}
        </span>
      );
    });
  }

  // Fallback for custom title: first 3 words in orange
  const words = title.split(' ');
  if (words.length > 3) {
    const lead = words.slice(0, 3).join(' ');
    const rest = ' ' + words.slice(3).join(' ');
    return (
      <>
        <span className="text-[#f87b1f]">{lead}</span>
        <span className="text-white">{rest}</span>
      </>
    );
  }

  return <span className="text-[#f87b1f]">{title}</span>;
}

export default function HeroSlider({ slides = [] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(null);
  const [direction, setDirection] = useState('bottom-to-top'); // 'bottom-to-top' | 'top-to-bottom'
  const [isAnimating, setIsAnimating] = useState(false);

  // Normalize data coming from backend
  const activeSlides = (slides && slides.length > 0 ? slides : DEFAULT_SLIDES)
    .filter((s) => s.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((s, idx) => ({
      id: s._id || s.id || idx,
      title: s.title || 'Grow Your Wealth With Smart Financial Planning',
      subtitle:
        s.subtitle ||
        s.description ||
        'Personalized portfolio management and mutual fund strategies designed to secure your long-term goals.',
      bgImage:
        s.bgImageUrl ||
        s.imageUrl ||
        s.bgImage ||
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1920&q=80',
    }));

  const slideCount = activeSlides.length;

  // Bottom-to-Top vertical navigation
  const handleNavigate = (dir = 'next', targetIdx = null) => {
    if (isAnimating || slideCount <= 1) return;

    let nextIndex;
    if (targetIdx !== null) {
      if (targetIdx === currentIdx) return;
      nextIndex = targetIdx;
      setDirection(targetIdx > currentIdx ? 'bottom-to-top' : 'top-to-bottom');
    } else if (dir === 'next') {
      nextIndex = (currentIdx + 1) % slideCount;
      setDirection('bottom-to-top');
    } else {
      nextIndex = (currentIdx - 1 + slideCount) % slideCount;
      setDirection('top-to-bottom');
    }

    setPrevIdx(currentIdx);
    setCurrentIdx(nextIndex);
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      setPrevIdx(null);
    }, 700);
  };

  // Auto-play timer (cycles bottom-to-top every 6s)
  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = setInterval(() => {
      handleNavigate('next');
    }, 6000);
    return () => clearInterval(timer);
  }, [slideCount, currentIdx, isAnimating]);

  const safeCurrentIdx = currentIdx >= slideCount ? 0 : currentIdx;

  return (
    <>
      {/* Scoped CSS Keyframes for Elegant Bottom-to-Top Vertical Transitions */}
      <style jsx>{`
        @keyframes slideInFromBottom {
          0% {
            transform: translateY(100%);
            opacity: 0.6;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideOutToTop {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0.35;
          }
        }
        @keyframes slideInFromTop {
          0% {
            transform: translateY(-100%);
            opacity: 0.6;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideOutToBottom {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0.35;
          }
        }
      `}</style>

      <section className="relative w-full min-h-[580px] lg:min-h-[660px] bg-[#080c10] text-white flex items-center overflow-hidden select-none">
        {/* TOP CENTER ARROW (Navigate to Previous Slide) */}
        {slideCount > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <button
              onClick={() => handleNavigate('prev')}
              disabled={isAnimating}
              aria-label="Previous slide"
              className="p-2 text-white/50 hover:text-white transition-all transform hover:scale-110 active:scale-90"
            >
              <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md" />
            </button>
          </div>
        )}

        {/* BOTTOM CENTER ARROW (Navigate to Next Slide) */}
        {slideCount > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <button
              onClick={() => handleNavigate('next')}
              disabled={isAnimating}
              aria-label="Next slide"
              className="p-2 text-white/50 hover:text-white transition-all transform hover:scale-110 active:scale-90"
            >
              <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md" />
            </button>
          </div>
        )}

        {/* RIGHT EDGE VERTICAL DOT INDICATORS */}
        {slideCount > 1 && (
          <div className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleNavigate('next', idx)}
                disabled={isAnimating}
                aria-label={`Go to slide ${idx + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  safeCurrentIdx === idx
                    ? 'w-2.5 h-2.5 bg-white shadow-lg shadow-white/80 scale-125'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* SLIDE CONTENT & BACKGROUND */}
        {activeSlides.map((slide, idx) => {
          const isCurrent = idx === safeCurrentIdx;
          const isPrev = idx === prevIdx;

          // Render only current and previous slide during transitions
          if (!isCurrent && !isPrev) return null;

          let animStyle = {};
          let zIndexClass = 'z-10';

          if (isAnimating) {
            if (isCurrent) {
              // Incoming slide
              zIndexClass = 'z-20';
              animStyle = {
                animation:
                  direction === 'bottom-to-top'
                    ? 'slideInFromBottom 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    : 'slideInFromTop 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
              };
            } else if (isPrev) {
              // Outgoing slide
              zIndexClass = 'z-10';
              animStyle = {
                animation:
                  direction === 'bottom-to-top'
                    ? 'slideOutToTop 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    : 'slideOutToBottom 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
              };
            }
          } else if (isCurrent) {
            zIndexClass = 'z-20';
            animStyle = { transform: 'translateY(0)', opacity: 1 };
          }

          return (
            <div
              key={slide.id || idx}
              style={animStyle}
              className={`absolute inset-0 w-full h-full flex items-center ${zIndexClass}`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-right sm:bg-center transition-transform duration-1000 scale-105"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              />

              {/* Dark Gradient Overlay for Pristine Readability (Matching Screenshot) */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#080c10] via-[#080c10]/85 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c10]/90 via-transparent to-[#080c10]/40 z-10" />

              {/* Slide Foreground Content */}
              <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                <div className="max-w-2xl">
                  {/* Dynamic Title with Brand Colors */}
                  <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight leading-[1.12] mb-6">
                    {renderHighlightedTitle(slide.title)}
                  </h1>

                  {/* Subtitle in text-slate-200 */}
                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-8 max-w-xl font-normal">
                    {slide.subtitle}
                  </p>

                  {/* Fixed CTA Buttons: "Our Services" & "Contact Us" */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {/* Fixed Primary Button: Our Services */}
                    <Link
                      href="#services"
                      className="inline-flex items-center justify-center bg-[#2376b8] hover:bg-[#1b5b8f] text-white font-semibold text-sm sm:text-base px-7 py-3 rounded-xl shadow-lg shadow-[#2376b8]/25 hover:shadow-xl hover:shadow-[#2376b8]/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
                    >
                      Our Services
                    </Link>

                    {/* Fixed Secondary Button: Contact Us */}
                    <Link
                      href="#contact"
                      className="inline-flex items-center justify-center bg-slate-900/40 hover:bg-[#89b441]/20 text-[#89b441] border border-[#89b441] backdrop-blur-md font-semibold text-sm sm:text-base px-7 py-3 rounded-xl shadow-md shadow-[#89b441]/10 hover:shadow-lg hover:shadow-[#89b441]/25 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
