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
              ? 'bg-[#C7A76C]/20 text-[#C7A76C] border border-[#C7A76C]/30'
              : 'bg-[#10243A]/5 text-[#C7A76C] border border-[#C7A76C]/20'
          }`}
        >
          {badge}
        </span>
      )}
      {title && (
        <h2
          className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#10243A]'
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
