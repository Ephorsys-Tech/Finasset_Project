import React from 'react';

export default function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  theme = 'light',
}) {
  return (
    <div className={`mb-12 ${centered ? 'text-center max-w-3xl mx-auto' : ''}`}>
      {badge && (
        <span
          className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
            theme === 'dark'
              ? 'bg-[#f87b1f]/20 text-[#fb994b] border border-[#f87b1f]/30'
              : 'bg-[#2376b8]/10 text-[#2376b8] border border-[#2376b8]/20'
          }`}
        >
          {badge}
        </span>
      )}
      {title && (
        <h2
          className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#0f2b44]'
          }`}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
