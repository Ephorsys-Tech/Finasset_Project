'use client';

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLMotionProps, type Variants, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

// CVA for card variants
const cardVariants = cva(
  "relative flex flex-col justify-between w-full p-6 overflow-hidden rounded-2xl shadow-sm transition-all duration-300 ease-in-out group hover:shadow-xl border border-transparent",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-slate-200/80 shadow-slate-200/50",
        red: "bg-red-500/90 text-primary-foreground shadow-red-500/20",
        blue: "bg-[#2376b8] text-primary-foreground shadow-[#2376b8]/20",
        gray: "bg-secondary text-secondary-foreground border-slate-200/80",
        orange: "bg-[#f87b1f] text-primary-foreground shadow-[#f87b1f]/20",
        green: "bg-[#89b441] text-primary-foreground shadow-[#89b441]/20",
        navy: "bg-[#0f2b44] text-primary-foreground shadow-[#0f2b44]/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ServiceCardProps
  extends Omit<HTMLMotionProps<"div">, "children">,
    VariantProps<typeof cardVariants> {
  /**
   * The main title of the card.
   */
  title: string;
  /**
   * The URL the card's link should point to.
   */
  href: string;
  /**
   * The source URL for the decorative image.
   */
  imgSrc: string;
  /**
   * The alt text for the decorative image, for accessibility.
   */
  imgAlt: string;
  /**
   * Optional short description for the calculator or service.
   */
  description?: string;
  /**
   * Optional category or status badge tag.
   */
  tag?: string;
  /**
   * Optional custom call-to-action text (defaults to 'LEARN MORE').
   */
  ctaText?: string;
  /**
   * Optional extra classes for the decorative image.
   */
  imageClassName?: string;
}

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  (
    {
      className,
      variant,
      title,
      href,
      imgSrc,
      imgAlt,
      description,
      tag,
      ctaText = "LEARN MORE",
      imageClassName,
      ...props
    },
    ref
  ) => {
    
    // Animation variants for Framer Motion
    const cardAnimation: Variants = {
      hover: {
        scale: 1.02,
        y: -4,
        transition: { duration: 0.3 },
      },
    };

    const imageAnimation: Variants = {
      hover: {
        scale: 1.12,
        rotate: 4,
        x: 8,
        y: -4,
        transition: { duration: 0.4, ease: "easeInOut" },
      },
    };
    
    const arrowAnimation: Variants = {
      hover: {
        x: 6,
        transition: { duration: 0.3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" as const },
      }
    };

    const isLightVariant = variant === "default" || variant === "gray";

    return (
      <motion.div
        className={cn(cardVariants({ variant, className }))}
        ref={ref}
        variants={cardAnimation}
        whileHover="hover"
        {...props}
      >
        <div className="relative z-10 flex flex-col h-full min-h-[160px]">
          {tag && (
            <div className="mb-3">
              <span
                className={cn(
                  "text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm",
                  isLightVariant
                    ? "bg-slate-100 text-slate-700 border border-slate-200"
                    : "bg-white/20 text-white border border-white/20"
                )}
              >
                {tag}
              </span>
            </div>
          )}

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug pr-12">
            {title}
          </h3>

          {description && (
            <p
              className={cn(
                "text-xs sm:text-sm mt-2 line-clamp-2 pr-16 leading-relaxed",
                isLightVariant ? "text-slate-600" : "text-white/85"
              )}
            >
              {description}
            </p>
          )}

          <Link
            href={href}
            aria-label={`Learn more about ${title}`}
            className={cn(
              "mt-auto pt-6 flex items-center text-xs sm:text-sm font-bold tracking-wide uppercase group-hover:underline",
              isLightVariant ? "text-[#2376b8] hover:text-[#0f2b44]" : "text-white hover:text-white/90"
            )}
          >
            <span>{ctaText}</span>
            <motion.div variants={arrowAnimation}>
              <ArrowRight className="ml-2 h-4 w-4" />
            </motion.div>
          </Link>
        </div>
        
        <motion.img
          src={imgSrc}
          alt={imgAlt}
          loading="lazy"
          className={cn(
            "absolute -right-6 -bottom-6 w-36 h-36 sm:w-44 sm:h-44 object-contain opacity-90 group-hover:opacity-100 select-none pointer-events-none drop-shadow-md",
            imageClassName
          )}
          variants={imageAnimation}
        />
      </motion.div>
    );
  }
);

ServiceCard.displayName = "ServiceCard";

export { ServiceCard };
