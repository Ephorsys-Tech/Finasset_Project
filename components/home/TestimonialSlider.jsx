'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTestimonialStore } from '@/store/useTestimonialStore';

/**
 * Default SVG Illustrated Avatar matching the user reference design
 */
function DefaultIllustratedAvatar() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="50" fill="#F59E0B" />
      {/* Hair */}
      <path
        d="M28 42C28 28 36 20 50 20C64 20 72 28 72 42C72 46 70 50 68 52C66 45 64 36 50 36C36 36 34 45 32 52C30 50 28 46 28 42Z"
        fill="#1E293B"
      />
      {/* Face */}
      <ellipse cx="50" cy="52" rx="18" ry="20" fill="#FDE68A" />
      {/* Ears */}
      <circle cx="31" cy="52" r="4" fill="#FDE68A" />
      <circle cx="69" cy="52" r="4" fill="#FDE68A" />
      {/* Hair sideburns */}
      <path d="M32 40C32 44 34 48 34 48" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <path d="M68 40C68 44 66 48 66 48" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      {/* Shirt */}
      <path
        d="M24 94C24 78 35 72 50 72C65 72 76 78 76 94V100H24V94Z"
        fill="#FFFFFF"
      />
      {/* Collar & Neck */}
      <path d="M44 68H56V74C56 77.3 53.3 80 50 80C46.7 80 44 77.3 44 74V68Z" fill="#FCD34D" />
      <polygon points="42,74 50,78 46,84" fill="#E2E8F0" />
      <polygon points="58,74 50,78 54,84" fill="#E2E8F0" />
      {/* Red Tie */}
      <polygon points="50,78 47,82 48,98 52,98 53,82" fill="#EF4444" />
    </svg>
  );
}

/**
 * Client Testimonials Carousel matching the exact layout pattern from reference image:
 * - "Client Testimonials" title with colored underline
 * - Centered quote text
 * - Client Name & Designation
 * - Centered circular avatar
 * - "prev" on left, "next" on right
 * - Pagination dots at bottom
 * - Automatic time interval movement with pause-on-hover
 */
export default function TestimonialSlider({ initialTestimonials = [] }) {
  const {
    testimonials,
    currentIndex,
    isAutoPlaying,
    fetchTestimonials,
    setCurrentIndex,
    nextSlide,
    prevSlide,
    pauseAutoPlay,
    resumeAutoPlay,
  } = useTestimonialStore();

  const [mounted, setMounted] = useState(false);

  // Initial fetch via Zustand + Axios
  useEffect(() => {
    setMounted(true);
    if (!testimonials || testimonials.length === 0) {
      if (initialTestimonials && initialTestimonials.length > 0) {
        useTestimonialStore.setState({ testimonials: initialTestimonials });
      } else {
        fetchTestimonials(false);
      }
    }
  }, [fetchTestimonials, initialTestimonials, testimonials]);

  // Automatic slide interval movement (every 5.5 seconds)
  useEffect(() => {
    if (!mounted || !isAutoPlaying || testimonials.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(timer);
  }, [mounted, isAutoPlaying, testimonials.length, nextSlide]);

  const displayList = testimonials && testimonials.length > 0 ? testimonials : initialTestimonials;
  const currentTestimonial = displayList[currentIndex] || displayList[0];

  if (!currentTestimonial) return null;

  return (
    <section
      id="client-testimonials"
      className="py-16 sm:py-24 bg-[#f8fafc] border-t border-slate-200/80 relative select-none overflow-hidden"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
      onTouchStart={pauseAutoPlay}
      onTouchEnd={resumeAutoPlay}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#2376b8] tracking-tight">
            Client Testimonials
          </h2>
          {/* Blue underline bar matching reference image */}
          <div className="w-12 h-1 bg-[#2376b8] mx-auto mt-2.5 rounded-full" />
        </div>

        {/* Carousel Slider Card Container */}
        <div className="relative min-h-[300px] sm:min-h-[320px] flex flex-col justify-between items-center px-8 sm:px-16">
          {/* Previous Button (Left side) */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2376b8] font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-0.5 p-2 rounded-xl hover:bg-slate-200/50 cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            {/* <span className="hidden sm:inline">prev</span> */}
          </button>

          {/* Testimonial Active Slide Content with smooth transition */}
          <div
            key={currentTestimonial._id || currentTestimonial.clientName || currentIndex}
            className="w-full max-w-3xl mx-auto flex flex-col items-center animate-in fade-in zoom-in-98 duration-500"
          >
            {/* Quote / Review Text */}
            <p className="text-slate-700 text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-2xl mx-auto font-normal text-center">
              {currentTestimonial.reviewText || currentTestimonial.quote}
            </p>

            {/* Client Name */}
            <h3 className="font-bold text-base sm:text-lg text-[#10243A] mt-6 tracking-tight">
              {currentTestimonial.clientName}
            </h3>

            {/* Designation / Role */}
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              {currentTestimonial.designation}
            </p>

            {/* Circular Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-md mx-auto mt-6 overflow-hidden bg-amber-100 flex items-center justify-center shrink-0">
              {currentTestimonial.avatarUrl ? (
                <img
                  src={currentTestimonial.avatarUrl}
                  alt={currentTestimonial.clientName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <DefaultIllustratedAvatar />
              )}
            </div>
          </div>

          {/* Next Button (Right side) */}
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2376b8] font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-0.5 p-2 rounded-xl hover:bg-slate-200/50 cursor-pointer"
            aria-label="Next testimonial"
          >
            {/* <span className="hidden sm:inline">next</span> */}
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Pagination Dots (Matching green/gold style from reference image) */}
        {displayList.length > 1 && (
          <div className="flex items-center justify-center gap-2.5 mt-8">
            {displayList.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isActive
                      ? 'w-6 h-2.5 bg-[#8ea83e] shadow-sm'
                      : 'w-2.5 h-2.5 bg-[#8ea83e]/40 hover:bg-[#8ea83e]/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
