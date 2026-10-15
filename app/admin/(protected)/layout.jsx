'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Settings,
  Menu as MenuIcon,
  Home,
  Briefcase,
  Calculator,
  CreditCard,
  TrendingUp,
  MessageSquareQuote,
  Handshake,
  FileText,
  BookOpen,
  Inbox,
  Image,
  History,
  LogOut,
  ExternalLink,
  Shield,
  ChevronRight,
  X,
  User,
} from 'lucide-react';

export default function AdminProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/v1/auth/me');
        const json = await res.json();
        if (json.success && json.data) {
          setAdmin(json.data);
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Site Settings', href: '/admin/site-settings', icon: Settings },
    { label: 'Menu Manager', href: '/admin/menus', icon: MenuIcon },
    { label: 'Home Page', href: '/admin/home-page', icon: Home },
    { label: 'Services', href: '/admin/services', icon: Briefcase },
    { label: "Investor's Corner", href: '/admin/investor-corner', icon: Calculator },
    { label: 'Pay Premium', href: '/admin/pay-premium', icon: CreditCard },
    { label: 'News & Market', href: '/admin/news-market', icon: TrendingUp },
    { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Partners', href: '/admin/partners', icon: Handshake },
    { label: 'Pages Content', href: '/admin/pages', icon: FileText },
    { label: 'Blog Manager', href: '/admin/blog', icon: BookOpen },
    { label: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
    { label: 'Media Library', href: '/admin/media', icon: Image },
    { label: 'Activity Log', href: '/admin/activity-log', icon: History },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10243A] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-[#C7A76C] border-t-transparent rounded-full mx-auto" />
          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#10243A] text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#C7A76C] text-[#10243A] flex items-center justify-center font-black">
                <TrendingUp className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-base font-extrabold text-white block leading-none">
                  FINASSET<span className="text-[#C7A76C] ml-0.5">ADMIN</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-0.5">
                  CMS Control Center
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#C7A76C] text-[#10243A] shadow-sm font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#10243A]' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-[#C7A76C] flex items-center justify-center text-xs font-bold shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{admin?.name || 'Administrator'}</div>
              <div className="text-[10px] text-slate-400 truncate">{admin?.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-300 text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
              Finasset Wealth Admin Platform
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#10243A] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="h-4 w-px bg-slate-200" />

            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-[#10243A]">Role: Single Admin</div>
              <div className="text-[10px] text-emerald-600 font-semibold">● Fiduciary Control</div>
            </div>
          </div>
        </header>

        {/* Page Children */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
