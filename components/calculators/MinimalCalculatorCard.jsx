import Link from 'next/link';
import {
  CalendarCheck,
  Coins,
  ArrowRightLeft,
  ArrowDownCircle,
  HandCoins,
  Flame,
  Clock,
  ShieldCheck,
  Calculator,
  Percent,
  Receipt,
  Heart,
  GraduationCap,
  Home,
  Car,
  Plane,
  TrendingUp,
  Wallet,
  PieChart,
  Briefcase,
  Search,
  RotateCw,
  Umbrella,
  BarChart3,
  LineChart,
} from 'lucide-react';

const ICON_MAP = {
  CalendarCheck,
  Coins,
  ArrowRightLeft,
  ArrowDownCircle,
  HandCoins,
  Flame,
  Clock,
  ShieldCheck,
  Calculator,
  Percent,
  Receipt,
  Heart,
  GraduationCap,
  Home,
  Car,
  Plane,
  TrendingUp,
  Wallet,
  PieChart,
  Briefcase,
  Search,
  RotateCw,
  Umbrella,
  BarChart3,
  LineChart,
};

// Tag color palette matching the minimal pastel tags from the reference design
export function getTagColorClass(tag) {
  if (!tag) return 'bg-[#EBF3FE] text-[#2563EB]';
  const t = tag.toLowerCase().trim();

  // Retirement / Milestone / Opportunity / Life Goal / One-Time -> Peach
  if (
    t.includes('retire') ||
    t.includes('milestone') ||
    t.includes('life goal') ||
    t.includes('opportunity') ||
    t.includes('one-time')
  ) {
    return 'bg-[#FFF3E8] text-[#E07A2E]';
  }

  // Tax / Debt / Property / Auto -> Amber / Gold
  if (
    t.includes('tax') ||
    t.includes('debt') ||
    t.includes('property') ||
    t.includes('auto')
  ) {
    return 'bg-[#FEF8E7] text-[#D97706]';
  }

  // Savings / Protection / Lifestyle / Income / SWP -> Mint / Green
  if (
    t.includes('saving') ||
    t.includes('protection') ||
    t.includes('lifestyle') ||
    t.includes('income') ||
    t.includes('swp') ||
    t.includes('nav')
  ) {
    return 'bg-[#EAF8F0] text-[#16A34A]';
  }

  // Default / Investments / Popular / Transfer / Analytics / Track -> Soft Blue
  return 'bg-[#EBF3FE] text-[#2563EB]';
}

export default function MinimalCalculatorCard({
  title,
  href,
  description,
  tag,
  icon,
  className = '',
}) {
  const badgeClass = getTagColorClass(tag);

  let IconComponent = null;
  if (icon && (typeof icon === 'function' || typeof icon === 'object')) {
    IconComponent = icon;
  } else if (typeof icon === 'string' && ICON_MAP[icon]) {
    IconComponent = ICON_MAP[icon];
  } else {
    IconComponent = Calculator;
  }

  return (
    <Link
      href={href}
      className={`group flex flex-col justify-between bg-white rounded-xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 text-left ${className}`}
    >
      <div>
        {/* Top row: Outline Icon on left, Pastel Tag on right */}
        <div className="flex items-start justify-between gap-3">
          <div className="text-[#2563EB] group-hover:text-[#1d4ed8] transition-colors">
            <IconComponent className="w-6 h-6 stroke-[1.8]" />
          </div>
          {tag && (
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-md tracking-normal ${badgeClass}`}
            >
              {tag}
            </span>
          )}
        </div>

        {/* Content: Title & Description */}
        <div className="mt-7">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-[#2376b8] transition-colors leading-snug">
            {title}
          </h3>
          {description && (
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
