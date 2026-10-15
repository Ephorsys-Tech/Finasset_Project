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
  Shield,
  TrendingUp,
  Calculator,
  Compass,
  ArrowRight,
  ExternalLink,
  Lock,
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [investorDropdown, setInvestorDropdown] = useState(false);
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
    setInvestorDropdown(false);
  }, [pathname]);

  // Don't render public navbar inside /admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const servicesList = [
    { name: 'Financial Planning', href: '/services/financial-planning', desc: 'Holistic wealth blueprints & retirement freedom' },
    { name: 'Mutual Funds', href: '/services/mutual-funds', desc: 'Disciplined SIPs & top-tier AMC portfolios' },
    { name: 'Insurance Planning', href: '/services/insurance', desc: 'Pure term cover & family health protection' },
    { name: 'Real Estate Advisory', href: '/services/real-estate', desc: 'RERA-compliant property & commercial yields' },
    { name: 'Fixed Deposits & Bonds', href: '/services/fixed-deposits-bonds', desc: 'AAA corporate FDs & sovereign gold bonds' },
    { name: 'Portfolio Management (PMS)', href: '/services/portfolio-management-service', desc: 'Bespoke direct-equity portfolios for HNIs' },
  ];

  const investorToolsList = [
    { name: 'Financial Calculator', href: '/investor/financial-calculator', desc: 'Interactive SIP & Lumpsum compounding projections' },
    { name: 'Know Your Risk Profile', href: '/investor/risk-profile', desc: 'Psychometric asset allocation assessment' },
    { name: 'Check Financial Fitness', href: '/investor/financial-fitness', desc: '360° financial wellness diagnostic' },
    { name: 'Pay Premium Online', href: '/investor/pay-premium', desc: 'Instant gateway to official insurer payment portals' },
    { name: 'Buy MF Online', href: '/investor/buy-mf-online', desc: 'Seamless digital mutual fund execution platform' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white transition-all duration-200">
      {/* Top Bar for Trust & Quick Contacts */}
      <div className="bg-[#10243A] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-slate-200 font-medium">
              <Shield className="w-3.5 h-3.5 text-[#C7A76C]" />
              <span>NLF Adhira Asset Services LLP • Bhubaneswar</span>
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:inline-block text-slate-300">
              AMFI Reg. Mutual Fund Distributor
            </span>
          </div>

          <div className="flex items-center gap-5 flex-wrap justify-center sm:justify-end">
            <a
              href="tel:+919437012345"
              className="flex items-center gap-1.5 hover:text-[#C7A76C] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C7A76C]" />
              <span>+91 94370 12345</span>
            </a>
            <a
              href="mailto:contact@finassetwealth.com"
              className="hidden lg:flex items-center gap-1.5 hover:text-[#C7A76C] transition-colors"
            >
              <Mail className="w-3 h-3 text-[#C7A76C]" />
              <span>contact@finassetwealth.com</span>
            </a>
            <Link
              href="/portfolio-login"
              className="inline-flex items-center gap-1 text-[#C7A76C] hover:text-[#dfc593] font-semibold transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Client Portfolio Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-200 border-b border-slate-100 ${
          scrolled ? 'shadow-md py-3' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#10243A] flex items-center justify-center text-[#C7A76C] shadow-md group-hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#10243A] block leading-none">
                FINASSET<span className="text-[#C7A76C] ml-1">WEALTH</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-700 font-semibold block mt-0.5">
                NLF Adhira Asset Services LLP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-[#10243A] font-bold' : 'text-slate-700 hover:text-[#10243A]'
              }`}
            >
              Home
            </Link>

            <Link
              href="/about-us"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/about-us' ? 'text-[#10243A] font-bold' : 'text-slate-700 hover:text-[#10243A]'
              }`}
            >
              About Us
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <Link
                href="/services"
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/services') ? 'text-[#10243A] font-bold' : 'text-slate-700 hover:text-[#10243A]'
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </Link>

              {servicesDropdown && (
                <div className="absolute top-full left-0 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Our Services</span>
                    <Link href="/services" className="text-xs text-[#C7A76C] hover:underline font-semibold flex items-center gap-1">
                      View All <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {servicesList.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="block p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="text-sm font-semibold text-[#10243A] group-hover:text-[#C7A76C] transition-colors">
                        {s.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{s.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Investor's Corner Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setInvestorDropdown(true)}
              onMouseLeave={() => setInvestorDropdown(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/investor') ? 'text-[#10243A] font-bold' : 'text-slate-700 hover:text-[#10243A]'
                }`}
              >
                <span>Investor&apos;s Corner</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {investorDropdown && (
                <div className="absolute top-full left-0 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Interactive Investor Tools</span>
                  </div>
                  {investorToolsList.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="block p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="text-sm font-semibold text-[#10243A] group-hover:text-[#C7A76C] transition-colors">
                        {tool.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{tool.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/nri-corner"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/nri-corner' ? 'text-[#10243A] font-bold' : 'text-slate-700 hover:text-[#10243A]'
              }`}
            >
              NRI Corner
            </Link>

            <Link
              href="/taxation"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/taxation' ? 'text-[#10243A] font-bold' : 'text-slate-700 hover:text-[#10243A]'
              }`}
            >
              Taxation
            </Link>

            <Link
              href="/market-update"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/market-update' ? 'text-[#10243A] font-bold' : 'text-slate-700 hover:text-[#10243A]'
              }`}
            >
              Market
            </Link>

            <Link
              href="/blog"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/blog' ? 'text-[#10243A] font-bold' : 'text-slate-700 hover:text-[#10243A]'
              }`}
            >
              Blog
            </Link>

            <Link
              href="/contact-us"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/contact-us' ? 'text-[#10243A] font-bold' : 'text-slate-700 hover:text-[#10243A]'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Desktop Right CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact-us#callback"
              className="bg-[#10243A] hover:bg-[#1b3858] text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 border border-[#10243A]"
            >
              <span>Request Callback</span>
              <ArrowRight className="w-4 h-4 text-[#C7A76C]" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-[#10243A] hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-out Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-200">
            <Link
              href="/"
              className="block py-2 px-3 rounded-md text-base font-medium text-[#10243A] hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              href="/about-us"
              className="block py-2 px-3 rounded-md text-base font-medium text-[#10243A] hover:bg-slate-50"
            >
              About Us
            </Link>

            {/* Mobile Services Accordion */}
            <div className="py-2 px-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Our Services
              </span>
              <div className="pl-2 space-y-1 mt-1 border-l-2 border-[#C7A76C]">
                {servicesList.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block py-1.5 text-sm font-medium text-slate-700 hover:text-[#10243A]"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Investor Corner Accordion */}
            <div className="py-2 px-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Investor&apos;s Corner
              </span>
              <div className="pl-2 space-y-1 mt-1 border-l-2 border-[#10243A]">
                {investorToolsList.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="block py-1.5 text-sm font-medium text-slate-700 hover:text-[#10243A]"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/nri-corner"
              className="block py-2 px-3 rounded-md text-base font-medium text-[#10243A] hover:bg-slate-50"
            >
              NRI Corner
            </Link>
            <Link
              href="/taxation"
              className="block py-2 px-3 rounded-md text-base font-medium text-[#10243A] hover:bg-slate-50"
            >
              Taxation
            </Link>
            <Link
              href="/market-update"
              className="block py-2 px-3 rounded-md text-base font-medium text-[#10243A] hover:bg-slate-50"
            >
              Market Update
            </Link>
            <Link
              href="/blog"
              className="block py-2 px-3 rounded-md text-base font-medium text-[#10243A] hover:bg-slate-50"
            >
              Blog
            </Link>
            <Link
              href="/contact-us"
              className="block py-2 px-3 rounded-md text-base font-medium text-[#10243A] hover:bg-slate-50"
            >
              Contact Us
            </Link>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/contact-us#callback"
                className="w-full text-center bg-[#10243A] text-white py-2.5 rounded-lg font-semibold text-sm shadow"
              >
                Request Callback
              </Link>
              <Link
                href="/portfolio-login"
                className="w-full text-center border border-[#10243A] text-[#10243A] py-2.5 rounded-lg font-semibold text-sm"
              >
                Client Portfolio Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
