'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  ChevronDown,
  Menu as MenuIcon,
  X,
  TrendingUp,
  ArrowRight,
  User,
  Briefcase,
  Compass,
  Shield,
  Building,
  Landmark,
  PieChart,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdown(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  // Don't render public navbar inside /admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const servicesList = [
    {
      name: 'Financial Planning',
      href: '/services/financial-planning',
      desc: 'Holistic wealth blueprints & retirement freedom',
      icon: Compass,
    },
    {
      name: 'Mutual Funds',
      href: '/services/mutual-funds',
      desc: 'Disciplined SIPs & top-tier AMC portfolios',
      icon: TrendingUp,
    },
    {
      name: 'Insurance Planning',
      href: '/services/insurance',
      desc: 'Pure term cover & family health protection',
      icon: Shield,
    },
    {
      name: 'Real Estate Advisory',
      href: '/services/real-estate',
      desc: 'RERA-compliant property & commercial yields',
      icon: Building,
    },
    {
      name: 'Fixed Deposits & Bonds',
      href: '/services/fixed-deposits-bonds',
      desc: 'AAA corporate FDs & sovereign gold bonds',
      icon: Landmark,
    },
    {
      name: 'Portfolio Management (PMS)',
      href: '/services/portfolio-management-service',
      desc: 'Bespoke direct-equity portfolios for HNIs',
      icon: PieChart,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white transition-all duration-300">
      {/* Top Bar for Client & Employee Login (Left) & Quick Contacts (Right) */}
      <div className="bg-[#0f2b44] text-slate-300 text-xs py-2 px-4 border-b border-[#1b5d92]/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Top Left: Client Login & Employee Login */}
          <div className="flex items-center gap-3 sm:gap-4 justify-center sm:justify-start w-full sm:w-auto">
            <Link
              href="/portfolio-login"
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-[#f87b1f] font-semibold transition-all duration-200 group px-2 py-0.5 rounded hover:bg-white/5"
            >
              <User className="w-3.5 h-3.5 text-[#f87b1f] group-hover:scale-110 transition-transform duration-200" />
              <span>Client Login</span>
            </Link>

            <span className="text-slate-600 select-none">|</span>

            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#89b441] font-semibold transition-all duration-200 group px-2 py-0.5 rounded hover:bg-white/5"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#89b441] group-hover:scale-110 transition-transform duration-200" />
              <span>Employee Login</span>
            </Link>
          </div>

          {/* Top Right: Phone & Email Details */}
          <div className="flex items-center gap-4 sm:gap-5 justify-center sm:justify-end w-full sm:w-auto border-t sm:border-t-0 border-slate-700/50 pt-1.5 sm:pt-0">
            <a
              href="tel:+919437012345"
              className="flex items-center gap-1.5 text-slate-300 hover:text-[#f87b1f] transition-colors duration-200 whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#2376b8]" />
              <span className="font-medium">+91 94370 12345</span>
            </a>

            <span className="text-slate-600 select-none">|</span>

            <a
              href="mailto:contact@finassetwealth.com"
              className="flex items-center gap-1.5 text-slate-300 hover:text-[#f87b1f] transition-colors duration-200 whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5 text-[#2376b8]" />
              <span className="font-medium">contact@finassetwealth.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 border-b border-slate-100 backdrop-blur-md bg-white/95 ${
          scrolled ? 'shadow-md py-3' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2376b8] to-[#165688] flex items-center justify-center text-white shadow-md shadow-[#2376b8]/20 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#2376b8]/30 transition-all duration-300">
              <TrendingUp className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f2b44] block leading-none">
                FINASSET<span className="text-[#2376b8] ml-1">WEALTH</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f87b1f] inline-block ml-1"></span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mt-0.5">
                NLF Adhira Asset Services LLP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links: Home, Services, NRI Corner, Taxation, Blog, About Us */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* 1. Home */}
            <Link
              href="/"
              className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 group ${
                pathname === '/'
                  ? 'text-[#2376b8] font-bold'
                  : 'text-slate-600 hover:text-[#2376b8] hover:bg-[#f0f6fb]/70'
              }`}
            >
              <span>Home</span>
              <span
                className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full transition-all duration-300 ${
                  pathname === '/'
                    ? 'bg-[#2376b8] opacity-100 scale-x-100'
                    : 'bg-[#2376b8] opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`}
              />
            </Link>

            {/* 2. Services (with Luxury Dropdown) */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <Link
                href="/services"
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 group ${
                  pathname.startsWith('/services')
                    ? 'text-[#2376b8] font-bold'
                    : 'text-slate-600 hover:text-[#2376b8] hover:bg-[#f0f6fb]/70'
                }`}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    servicesDropdown
                      ? 'rotate-180 text-[#2376b8]'
                      : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full transition-all duration-300 ${
                    pathname.startsWith('/services')
                      ? 'bg-[#2376b8] opacity-100 scale-x-100'
                      : 'bg-[#2376b8] opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                  }`}
                />
              </Link>

              {/* Dropdown Menu with Smooth Transition */}
              <div
                className={`absolute top-full left-0 w-96 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 py-3.5 px-3 z-50 transition-all duration-300 transform origin-top ${
                  servicesDropdown
                    ? 'opacity-100 translate-y-2 scale-100 pointer-events-auto visible'
                    : 'opacity-0 translate-y-4 scale-95 pointer-events-none invisible'
                }`}
              >
                <div className="px-3 pb-2.5 mb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2376b8] flex items-center gap-1.5 bg-[#f0f6fb] px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3 h-3 text-[#f87b1f]" />
                    <span>Wealth Disciplines</span>
                  </span>
                  <Link
                    href="/services"
                    className="text-xs text-[#2376b8] hover:text-[#f87b1f] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  {servicesList.map((s) => {
                    const IconComponent = s.icon;
                    return (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f0f6fb] transition-all duration-200 group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#2376b8]/10 group-hover/item:bg-[#2376b8] text-[#2376b8] group-hover/item:text-white flex items-center justify-center shrink-0 transition-colors duration-200 mt-0.5">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-[#0f2b44] group-hover/item:text-[#2376b8] transition-colors duration-200 flex items-center justify-between">
                            <span>{s.name}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200 text-[#f87b1f]" />
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {s.desc}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. NRI Corner */}
            <Link
              href="/nri-corner"
              className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 group ${
                pathname === '/nri-corner'
                  ? 'text-[#2376b8] font-bold'
                  : 'text-slate-600 hover:text-[#2376b8] hover:bg-[#f0f6fb]/70'
              }`}
            >
              <span>NRI Corner</span>
              <span
                className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full transition-all duration-300 ${
                  pathname === '/nri-corner'
                    ? 'bg-[#2376b8] opacity-100 scale-x-100'
                    : 'bg-[#2376b8] opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`}
              />
            </Link>

            {/* 4. Taxation */}
            <Link
              href="/taxation"
              className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 group ${
                pathname === '/taxation'
                  ? 'text-[#2376b8] font-bold'
                  : 'text-slate-600 hover:text-[#2376b8] hover:bg-[#f0f6fb]/70'
              }`}
            >
              <span>Taxation</span>
              <span
                className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full transition-all duration-300 ${
                  pathname === '/taxation'
                    ? 'bg-[#2376b8] opacity-100 scale-x-100'
                    : 'bg-[#2376b8] opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`}
              />
            </Link>

            {/* 5. Blog */}
            <Link
              href="/blog"
              className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 group ${
                pathname === '/blog'
                  ? 'text-[#2376b8] font-bold'
                  : 'text-slate-600 hover:text-[#2376b8] hover:bg-[#f0f6fb]/70'
              }`}
            >
              <span>Blog</span>
              <span
                className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full transition-all duration-300 ${
                  pathname === '/blog'
                    ? 'bg-[#2376b8] opacity-100 scale-x-100'
                    : 'bg-[#2376b8] opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`}
              />
            </Link>

            {/* 6. About Us */}
            <Link
              href="/about-us"
              className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 group ${
                pathname === '/about-us'
                  ? 'text-[#2376b8] font-bold'
                  : 'text-slate-600 hover:text-[#2376b8] hover:bg-[#f0f6fb]/70'
              }`}
            >
              <span>About Us</span>
              <span
                className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full transition-all duration-300 ${
                  pathname === '/about-us'
                    ? 'bg-[#2376b8] opacity-100 scale-x-100'
                    : 'bg-[#2376b8] opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                }`}
              />
            </Link>
          </div>

          {/* Desktop Right CTA Button (Eye-catching Vibrant Orange) */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact-us#callback"
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#f87b1f] to-[#e66a10] hover:from-[#e66a10] hover:to-[#cf5c0a] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-[#f87b1f]/25 hover:shadow-xl hover:shadow-[#f87b1f]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 border border-[#f87b1f] overflow-hidden"
            >
              <span className="relative z-10">Request Callback</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-[#2376b8] hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-out Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* 1. Home */}
            <Link
              href="/"
              className={`block py-2.5 px-3 rounded-xl text-base font-semibold transition-colors ${
                pathname === '/'
                  ? 'bg-[#2376b8] text-white font-bold'
                  : 'text-[#0f2b44] hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {/* 2. Services (Accordion) */}
            <div className="py-1 px-1">
              <div className="flex items-center justify-between">
                <Link
                  href="/services"
                  className={`flex-1 py-2 px-2 rounded-xl text-base font-semibold transition-colors ${
                    pathname.startsWith('/services')
                      ? 'text-[#2376b8] font-bold'
                      : 'text-[#0f2b44] hover:bg-slate-50'
                  }`}
                >
                  Services
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="p-2 text-slate-500 hover:text-[#2376b8]"
                  aria-label="Toggle Services submenu"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileServicesOpen ? 'rotate-180 text-[#2376b8]' : ''
                    }`}
                  />
                </button>
              </div>

              {mobileServicesOpen && (
                <div className="pl-4 pr-2 space-y-1 mt-1 border-l-2 border-[#2376b8] animate-in fade-in duration-200">
                  {servicesList.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="block py-2 px-2 text-sm font-medium text-slate-700 hover:text-[#2376b8] hover:bg-[#f0f6fb] rounded-lg transition-colors"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 3. NRI Corner */}
            <Link
              href="/nri-corner"
              className={`block py-2.5 px-3 rounded-xl text-base font-semibold transition-colors ${
                pathname === '/nri-corner'
                  ? 'bg-[#2376b8] text-white font-bold'
                  : 'text-[#0f2b44] hover:bg-slate-50'
              }`}
            >
              NRI Corner
            </Link>

            {/* 4. Taxation */}
            <Link
              href="/taxation"
              className={`block py-2.5 px-3 rounded-xl text-base font-semibold transition-colors ${
                pathname === '/taxation'
                  ? 'bg-[#2376b8] text-white font-bold'
                  : 'text-[#0f2b44] hover:bg-slate-50'
              }`}
            >
              Taxation
            </Link>

            {/* 5. Blog */}
            <Link
              href="/blog"
              className={`block py-2.5 px-3 rounded-xl text-base font-semibold transition-colors ${
                pathname === '/blog'
                  ? 'bg-[#2376b8] text-white font-bold'
                  : 'text-[#0f2b44] hover:bg-slate-50'
              }`}
            >
              Blog
            </Link>

            {/* 6. About Us */}
            <Link
              href="/about-us"
              className={`block py-2.5 px-3 rounded-xl text-base font-semibold transition-colors ${
                pathname === '/about-us'
                  ? 'bg-[#2376b8] text-white font-bold'
                  : 'text-[#0f2b44] hover:bg-slate-50'
              }`}
            >
              About Us
            </Link>

            {/* Mobile Actions: Callback & Logins */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <Link
                href="/contact-us#callback"
                className="w-full text-center bg-gradient-to-r from-[#f87b1f] to-[#e66a10] hover:from-[#e66a10] hover:to-[#cf5c0a] text-white py-2.5 rounded-xl font-bold text-sm shadow-md shadow-[#f87b1f]/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>Request Callback</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/portfolio-login"
                  className="w-full text-center border border-[#2376b8] text-[#2376b8] bg-[#f0f6fb]/50 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#f0f6fb] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#f87b1f]" />
                  <span>Client Login</span>
                </Link>
                <Link
                  href="/admin/login"
                  className="w-full text-center border border-[#89b441] text-[#6e9331] bg-[#f4f8ee]/50 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#f4f8ee] transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#89b441]" />
                  <span>Employee Login</span>
                </Link>
              </div>

              <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-600">
                <a
                  href="tel:+919437012345"
                  className="flex items-center gap-2 hover:text-[#2376b8] font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#2376b8]" />
                  <span>+91 94370 12345</span>
                </a>
                <a
                  href="mailto:contact@finassetwealth.com"
                  className="flex items-center gap-2 hover:text-[#2376b8] font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#2376b8]" />
                  <span>contact@finassetwealth.com</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

