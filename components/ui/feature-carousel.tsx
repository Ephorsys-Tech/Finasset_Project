// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { motion, AnimatePresence } from "motion/react";
// import {
//   Calculator,
//   TrendingUp,
//   Activity,
//   CreditCard,
//   Smartphone,
//   ArrowUpRight,
//   type LucideIcon,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// export interface FeatureItem {
//   id: string;
//   label: string;
//   icon: LucideIcon;
//   url: string;
//   image: string;
//   description: string;
// }

// export const DEFAULT_INVESTOR_FEATURES: FeatureItem[] = [
//   {
//     id: "calculator",
//     label: "Financial Calculator",
//     icon: Calculator,
//     url: "/investor/financial-calculator",
//     image:
//       "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
//     description:
//       "A calculative online financial calculator launched with the advance feature.",
//   },
//   {
//     id: "risk-profile",
//     label: "Know Your Risk Profile",
//     icon: TrendingUp,
//     url: "/investor/risk-profile",
//     image:
//       "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
//     description:
//       "It's time to become advance and pay some attention towards your risk profile.",
//   },
//   {
//     id: "financial-fitness",
//     label: "Check Your Financial Fitness",
//     icon: Activity,
//     url: "/investor/financial-fitness",
//     image:
//       "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
//     description:
//       "How is your financial condition?,healthy or not? Here's the way to check",
//   },
//   {
//     id: "pay-premium",
//     label: "Pay Premium Online",
//     icon: CreditCard,
//     url: "/investor/pay-premium",
//     image:
//       "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
//     description:
//       "Build your investment with paying the little amount of money",
//   },
//   {
//     id: "buy-mf",
//     label: "Buy Mutual Fund Online",
//     icon: Smartphone,
//     url: "/investor/buy-mf-online",
//     image:
//       "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
//     description:
//       "Buy your Mutual fund software here and now, with this, user",
//   },
// ];

// const AUTO_PLAY_INTERVAL = 3500;
// const ITEM_HEIGHT = 68;

// const wrap = (min: number, max: number, v: number) => {
//   const rangeSize = max - min;
//   return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
// };

// export interface FeatureCarouselProps {
//   features?: FeatureItem[];
// }

// export function FeatureCarousel({ features = DEFAULT_INVESTOR_FEATURES }: FeatureCarouselProps) {
//   const router = useRouter();
//   const [step, setStep] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);

//   const currentIndex =
//     ((step % features.length) + features.length) % features.length;

//   const nextStep = useCallback(() => {
//     setStep((prev) => prev + 1);
//   }, []);

//   const handleChipClick = (index: number, feature: FeatureItem) => {
//     if (index === currentIndex) {
//       router.push(feature.url);
//     } else {
//       const diff = (index - currentIndex + features.length) % features.length;
//       if (diff > 0) setStep((s) => s + diff);
//     }
//   };

//   useEffect(() => {
//     if (isPaused) return;
//     const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
//     return () => clearInterval(interval);
//   }, [nextStep, isPaused]);

//   const getCardStatus = (index: number) => {
//     const diff = index - currentIndex;
//     const len = features.length;

//     let normalizedDiff = diff;
//     if (diff > len / 2) normalizedDiff -= len;
//     if (diff < -len / 2) normalizedDiff += len;

//     if (normalizedDiff === 0) return "active";
//     if (normalizedDiff === -1) return "prev";
//     if (normalizedDiff === 1) return "next";
//     return "hidden";
//   };

//   return (
//     <div className="w-full max-w-7xl mx-auto md:p-8">
//       <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3.5rem] flex flex-col lg:flex-row min-h-[580px] lg:aspect-video border border-slate-200/90 bg-white shadow-xl">
//         {/* Left Column / Interactive Chips Carousel Strip */}
//         <div className="w-full lg:w-[42%] min-h-[340px] md:min-h-[420px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-6 sm:px-10 lg:pl-14 bg-[#2376b8]">
//           <div className="absolute inset-x-0 top-0 h-12 md:h-16 bg-gradient-to-b from-[#2376b8] via-[#2376b8]/80 to-transparent z-40 pointer-events-none" />
//           <div className="absolute inset-x-0 bottom-0 h-12 md:h-16 bg-gradient-to-t from-[#2376b8] via-[#2376b8]/80 to-transparent z-40 pointer-events-none" />

//           <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
//             {features.map((feature, index) => {
//               const isActive = index === currentIndex;
//               const distance = index - currentIndex;
//               const wrappedDistance = wrap(
//                 -(features.length / 2),
//                 features.length / 2,
//                 distance
//               );
//               const IconComponent = feature.icon;

//               return (
//                 <motion.div
//                   key={feature.id}
//                   style={{
//                     height: ITEM_HEIGHT,
//                     width: "fit-content",
//                   }}
//                   animate={{
//                     y: wrappedDistance * ITEM_HEIGHT,
//                     opacity: 1 - Math.abs(wrappedDistance) * 0.28,
//                   }}
//                   transition={{
//                     type: "spring",
//                     stiffness: 90,
//                     damping: 22,
//                     mass: 1,
//                   }}
//                   className="absolute flex items-center justify-start"
//                 >
//                   <button
//                     onClick={() => handleChipClick(index, feature)}
//                     onMouseEnter={() => setIsPaused(true)}
//                     onMouseLeave={() => setIsPaused(false)}
//                     title={isActive ? `Open ${feature.label}` : `View ${feature.label}`}
//                     className={cn(
//                       "relative flex items-center gap-3 sm:gap-4 px-5 sm:px-7 lg:px-6 py-3.5 sm:py-4 rounded-full transition-all duration-500 text-left group border cursor-pointer",
//                       isActive
//                         ? "bg-white text-[#2376b8] border-white z-10 shadow-lg scale-105"
//                         : "bg-transparent text-white/70 border-white/20 hover:border-white/50 hover:text-white hover:bg-white/5"
//                     )}
//                   >
//                     <div
//                       className={cn(
//                         "flex items-center justify-center transition-colors duration-500",
//                         isActive ? "text-[#2376b8]" : "text-white/60"
//                       )}
//                     >
//                       {IconComponent && (
//                         <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
//                       )}
//                     </div>

//                     <span className="font-semibold text-xs sm:text-sm tracking-tight whitespace-nowrap">
//                       {feature.label}
//                     </span>

//                     {isActive && (
//                       <ArrowUpRight className="w-3.5 h-3.5 text-[#2376b8] ml-1 shrink-0 animate-pulse" />
//                     )}
//                   </button>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Right Column / Interactive Stack Card Showcase */}
//         <div className="flex-1 min-h-[460px] md:min-h-[540px] lg:h-full relative bg-slate-50/70 flex items-center justify-center py-12 md:py-20 lg:py-16 px-4 sm:px-8 lg:px-10 overflow-hidden border-t lg:border-t-0 lg:border-l border-slate-200/80">
//           <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
//             {features.map((feature, index) => {
//               const status = getCardStatus(index);
//               const isActive = status === "active";
//               const isPrev = status === "prev";
//               const isNext = status === "next";

//               return (
//                 <motion.div
//                   key={feature.id}
//                   initial={false}
//                   animate={{
//                     x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
//                     scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
//                     opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
//                     rotate: isPrev ? -3 : isNext ? 3 : 0,
//                     zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
//                     pointerEvents: isActive ? "auto" : "none",
//                   }}
//                   transition={{
//                     type: "spring",
//                     stiffness: 260,
//                     damping: 25,
//                     mass: 0.8,
//                   }}
//                   className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-4 md:border-6 border-white bg-white shadow-2xl origin-center group"
//                 >
//                   <Link
//                     href={feature.url}
//                     className="block w-full h-full relative cursor-pointer"
//                     title={`Open ${feature.label}`}
//                   >
//                     <img
//                       src={feature.image}
//                       alt={feature.label}
//                       className={cn(
//                         "w-full h-full object-cover transition-all duration-700",
//                         isActive
//                           ? "grayscale-0 blur-0 group-hover:scale-105"
//                           : "grayscale blur-[2px] brightness-75"
//                       )}
//                     />

//                     <AnimatePresence>
//                       {isActive && (
//                         <motion.div
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: 10 }}
//                           className="absolute inset-x-0 bottom-0 p-6 sm:p-8 pt-28 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent flex flex-col justify-end"
//                         >
//                           <div className="bg-white text-[#0f2b44] px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider w-fit shadow-md mb-2.5 flex items-center gap-1.5">
//                             <span>{index + 1} • {feature.label}</span>
//                             <ArrowUpRight className="w-3.5 h-3.5 text-[#2376b8]" />
//                           </div>

//                           <p className="text-white font-medium text-base sm:text-lg leading-snug drop-shadow-md tracking-tight mb-4">
//                             {feature.description}
//                           </p>

//                           <div className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#f87b1f] hover:bg-[#d9620b] px-4 py-2 rounded-xl transition-all w-fit shadow-md">
//                             <span>Open Utility</span>
//                             <ArrowUpRight className="w-3.5 h-3.5" />
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>

//                     <div
//                       className={cn(
//                         "absolute top-6 left-6 flex items-center gap-2 bg-slate-950/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 transition-opacity duration-300",
//                         isActive ? "opacity-100" : "opacity-0"
//                       )}
//                     >
//                       <div className="w-2 h-2 rounded-full bg-[#89b441] shadow-[0_0_8px_#89b441]" />
//                       <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">
//                         Investor Tool
//                       </span>
//                     </div>
//                   </Link>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FeatureCarousel;






"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Calculator,
  TrendingUp,
  Activity,
  CreditCard,
  Smartphone,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureItem {
  id: string;
  label: string;
  icon: LucideIcon;
  url: string;
  image: string;
  description: string;
}

export const DEFAULT_INVESTOR_FEATURES: FeatureItem[] = [
  {
    id: "calculator",
    label: "Financial Calculator",
    icon: Calculator,
    url: "/investor/financial-calculator",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    description:
      "A calculative online financial calculator launched with the advance feature.",
  },
  {
    id: "risk-profile",
    label: "Know Your Risk Profile",
    icon: TrendingUp,
    url: "/investor/risk-profile",
    image:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
    description:
      "It's time to become advance and pay some attention towards your risk profile.",
  },
  {
    id: "financial-fitness",
    label: "Check Your Financial Fitness",
    icon: Activity,
    url: "/investor/financial-fitness",
    image:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    description:
      "How is your financial condition?,healthy or not? Here's the way to check",
  },
  {
    id: "pay-premium",
    label: "Pay Premium Online",
    icon: CreditCard,
    url: "/investor/pay-premium",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
    description:
      "Build your investment with paying the little amount of money",
  },
  {
    id: "buy-mf",
    label: "Buy Mutual Fund Online",
    icon: Smartphone,
    url: "/investor/buy-mf-online",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    description:
      "Buy your Mutual fund software here and now, with this, user",
  },
];

const AUTO_PLAY_INTERVAL = 3500;
const ITEM_HEIGHT = 56;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export interface FeatureCarouselProps {
  features?: FeatureItem[];
}

export function FeatureCarousel({
  features = DEFAULT_INVESTOR_FEATURES,
}: FeatureCarouselProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    features.length > 0
      ? ((step % features.length) + features.length) % features.length
      : 0;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number, feature: FeatureItem) => {
    if (index === currentIndex) {
      router.push(feature.url);
    } else {
      const diff =
        (index - currentIndex + features.length) % features.length;

      if (diff > 0) {
        setStep((s) => s + diff);
      }
    }
  };

  useEffect(() => {
    if (isPaused || features.length <= 1) return;

    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [nextStep, isPaused, features.length]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = features.length;

    let normalizedDiff = diff;

    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";

    return "hidden";
  };

  if (features.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl flex flex-col lg:flex-row lg:h-[420px] border border-slate-200/90 bg-white shadow-lg">
        {/* Left Column / Interactive Chips Carousel Strip */}
        <div className="w-full lg:w-[42%] h-[280px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-6 sm:px-10 lg:pl-12 bg-[#2376b8]">
          <div className="absolute inset-x-0 top-0 h-10 md:h-12 bg-gradient-to-b from-[#2376b8] via-[#2376b8]/80 to-transparent z-40 pointer-events-none" />

          <div className="absolute inset-x-0 bottom-0 h-10 md:h-12 bg-gradient-to-t from-[#2376b8] via-[#2376b8]/80 to-transparent z-40 pointer-events-none" />

          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
            {features.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;

              const wrappedDistance = wrap(
                -(features.length / 2),
                features.length / 2,
                distance
              );

              const IconComponent = feature.icon;

              return (
                <motion.div
                  key={feature.id}
                  className="absolute h-14 w-max flex items-center justify-start"
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.28,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 22,
                    mass: 1,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleChipClick(index, feature)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => setIsPaused(false)}
                    title={
                      isActive
                        ? `Open ${feature.label}`
                        : `View ${feature.label}`
                    }
                    className={cn(
                      "relative flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-500 text-left group border cursor-pointer",
                      isActive
                        ? "bg-white text-[#2376b8] border-white z-10 shadow-lg scale-105"
                        : "bg-transparent text-white/70 border-white/20 hover:border-white/50 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center transition-colors duration-500",
                        isActive ? "text-[#2376b8]" : "text-white/60"
                      )}
                    >
                      {IconComponent && (
                        <IconComponent className="w-4 h-4 shrink-0" />
                      )}
                    </div>

                    <span className="font-semibold text-xs sm:text-sm tracking-tight whitespace-nowrap">
                      {feature.label}
                    </span>

                    {isActive && (
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#2376b8] ml-1 shrink-0 animate-pulse" />
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column / Interactive Stack Card Showcase */}
        <div
          className="flex-1 h-[380px] sm:h-[400px] lg:h-full relative bg-slate-50/70 flex items-center justify-center py-6 px-4 sm:px-8 lg:px-10 overflow-hidden border-t lg:border-t-0 lg:border-l border-slate-200/80"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative h-[320px] w-[256px] sm:h-[340px] sm:w-[272px] lg:h-[360px] lg:w-[290px] flex items-center justify-center">
            {features.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -90 : isNext ? 90 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 rounded-3xl overflow-hidden border-4 border-white bg-white shadow-xl origin-center group"
                >
                  <Link
                    href={feature.url}
                    className="block w-full h-full relative cursor-pointer"
                    title={`Open ${feature.label}`}
                  >
                    <img
                      src={feature.image}
                      alt={feature.label}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-700",
                        isActive
                          ? "grayscale-0 blur-0 group-hover:scale-105"
                          : "grayscale blur-[2px] brightness-75"
                      )}
                    />

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute inset-x-0 bottom-0 p-4 sm:p-5 pt-20 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent flex flex-col justify-end"
                        >
                          <div className="bg-white text-[#0f2b44] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit shadow-md mb-2 flex items-center gap-1.5">
                            <span>
                              {index + 1} • {feature.label}
                            </span>
                            <ArrowUpRight className="w-3 h-3 text-[#2376b8]" />
                          </div>

                          <p className="text-white font-medium text-sm leading-snug drop-shadow-md tracking-tight mb-3 line-clamp-2">
                            {feature.description}
                          </p>

                          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#f87b1f] hover:bg-[#d9620b] px-3.5 py-1.5 rounded-lg transition-all w-fit shadow-md">
                            <span>Open Utility</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div
                      className={cn(
                        "absolute top-4 left-4 flex items-center gap-2 bg-slate-950/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#89b441] shadow-[0_0_8px_#89b441]" />

                      <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                        Investor Tool
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
