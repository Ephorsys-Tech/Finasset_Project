'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Briefcase,
  BookOpen,
  Handshake,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  History,
  ShieldCheck,
  Settings,
  Plus,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  X,
  FileText,
  Image,
  AlertTriangle,
  ChevronRight,
  Database,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchDashboard = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch('/api/v1/admin/dashboard');
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setStatusUpdating(id);
    try {
      const res = await fetch(`/api/v1/admin/enquiries?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        // Optimistically update local data
        setData((prev) => {
          if (!prev) return prev;
          const updatedEnquiries = (prev.recentEnquiries || []).map((enq) =>
            enq._id === id ? { ...enq, status: newStatus } : enq
          );
          return { ...prev, recentEnquiries: updatedEnquiries };
        });
        // Silently refresh metrics
        fetchDashboard();
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setStatusUpdating(null);
    }
  };

  // Safe data extraction with fallbacks
  const enquiriesStats = data?.enquiries || {
    total: data?.metrics?.totalEnquiries || 0,
    new: data?.metrics?.newEnquiries || 0,
    contacted: data?.metrics?.inProgressEnquiries || 0,
    closed: data?.metrics?.resolvedEnquiries || 0,
  };

  const kpis = data?.kpis || {
    services: data?.metrics?.servicesCount || 0,
    publishedBlogs: data?.metrics?.blogCount || 0,
    activePartners: data?.metrics?.partnersCount || 0,
    testimonials: data?.metrics?.testimonialsCount || 0,
    mediaFiles: data?.metrics?.mediaCount || 0,
  };

  const recentEnquiries = data?.recentEnquiries || [];
  const recentActivities = data?.recentActivity || data?.recentActivities || [];

  // Filtered enquiries based on tab & search input
  const filteredEnquiries = useMemo(() => {
    return recentEnquiries.filter((enq) => {
      const matchesTab = activeTab === 'ALL' || enq.status === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        enq.name?.toLowerCase().includes(q) ||
        enq.phone?.toLowerCase().includes(q) ||
        enq.email?.toLowerCase().includes(q) ||
        enq.serviceOfInterest?.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [recentEnquiries, activeTab, searchQuery]);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500">
        <div className="animate-spin w-10 h-10 border-4 border-[#10243A] border-t-[#C7A76C] rounded-full mx-auto mb-4" />
        <p className="text-xs uppercase tracking-wider font-extrabold text-[#10243A]">
          Loading Administrative Intelligence...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Database Connected • Production Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10243A] tracking-tight">
            Executive Admin Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Real-time advisory inquiries, fiduciary performance metrics, published wealth content, and comprehensive activity audit log.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#10243A] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#C7A76C]' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Sync Data'}</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C7A76C]" />
          </Link>
        </div>
      </div>

      {/* 2. Key KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Inquiries */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Inquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#10243A] flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#10243A]">{enquiriesStats.total}</div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-2">
            <span className="font-semibold text-emerald-600">{enquiriesStats.closed} Closed</span>
            <span>•</span>
            <span className="font-semibold text-blue-600">{enquiriesStats.contacted} In Progress</span>
          </div>
        </div>

        {/* Action Needed: NEW Inquiries */}
        <div className={`p-6 rounded-3xl border shadow-xs hover:shadow-md transition-shadow ${
          enquiriesStats.new > 0
            ? 'bg-amber-50/40 border-amber-300'
            : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              enquiriesStats.new > 0 ? 'text-amber-800' : 'text-slate-400'
            }`}>
              Needs Callback
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              enquiriesStats.new > 0 ? 'bg-amber-200/70 text-amber-900' : 'bg-slate-100 text-slate-600'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-3xl font-extrabold ${enquiriesStats.new > 0 ? 'text-amber-900' : 'text-[#10243A]'}`}>
            {enquiriesStats.new}
          </div>
          <div className={`text-[11px] font-medium mt-2 flex items-center gap-1.5 ${
            enquiriesStats.new > 0 ? 'text-amber-700' : 'text-slate-500'
          }`}>
            {enquiriesStats.new > 0 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                <span>Pending client callbacks</span>
              </>
            ) : (
              <span>All submissions contacted</span>
            )}
          </div>
        </div>

        {/* Wealth Services */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Services
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#C7A76C] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#10243A]">{kpis.services}</div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>PMS, MF, Insurance, Retirement</span>
            <Link href="/admin/services" className="text-[#C7A76C] font-bold hover:underline">
              Manage →
            </Link>
          </div>
        </div>

        {/* Published Research Articles */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Research & Insights
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#10243A]">{kpis.publishedBlogs}</div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Published blog articles</span>
            <Link href="/admin/blog" className="text-[#C7A76C] font-bold hover:underline">
              Manage →
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Operations Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Settings className="w-4 h-4 text-[#C7A76C]" />
          <span>Quick Actions</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#10243A] text-white px-3.5 py-2 rounded-xl hover:bg-[#1b3858] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#C7A76C]" />
            <span>Manage Services</span>
          </Link>

          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-[#10243A] px-3.5 py-2 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Blog Article</span>
          </Link>

          <Link
            href="/admin/home-page"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-[#10243A] px-3.5 py-2 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <span>Hero Slider</span>
          </Link>

          <Link
            href="/admin/media"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-[#10243A] px-3.5 py-2 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <Image className="w-3.5 h-3.5 text-slate-500" />
            <span>Media Library</span>
          </Link>

          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#C7A76C] text-[#10243A] px-3.5 py-2 rounded-xl hover:bg-[#dfc593] transition-colors"
          >
            <span>All Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. Main Two-Column Layout: Inquiries Table & Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Enquiries & Leads Section (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-bold text-[#10243A] flex items-center gap-2">
                <Inbox className="w-5 h-5 text-[#C7A76C]" />
                <span>Recent Client Enquiries & Callbacks</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Prospective investor inquiries submitted across public portals.
              </p>
            </div>

            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-[#C7A76C] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View All Enquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Status Filter Tabs */}
            <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto">
              {['ALL', 'NEW', 'CONTACTED', 'CLOSED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all text-center ${
                    activeTab === tab
                      ? 'bg-white text-[#10243A] shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab === 'ALL' ? 'All Inquiries' : tab}
                </button>
              ))}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
              />
            </div>
          </div>

          {/* Enquiries Table */}
          {filteredEnquiries.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Inbox className="w-8 h-8 mx-auto stroke-1 text-slate-300" />
              <p className="text-xs font-medium">No client enquiries match your current filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Client</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Service Interest</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnquiries.map((enq) => (
                    <tr key={enq._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                        {formatDate(enq.createdAt)}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-[#10243A]">{enq.name}</div>
                        {enq.type && (
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                            {enq.type}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <a
                          href={`tel:${enq.phone}`}
                          className="font-mono text-slate-700 hover:text-[#C7A76C] font-semibold flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{enq.phone}</span>
                        </a>
                        {enq.email && (
                          <span className="text-[11px] text-slate-400 truncate max-w-[140px] block">
                            {enq.email}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 truncate max-w-[150px]">
                        {enq.serviceOfInterest || 'General Advisory'}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            enq.status === 'NEW'
                              ? 'bg-amber-100 text-amber-800'
                              : enq.status === 'CONTACTED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap space-x-1.5">
                        <select
                          disabled={statusUpdating === enq._id}
                          value={enq.status}
                          onChange={(e) => handleUpdateStatus(enq._id, e.target.value)}
                          className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg px-2 py-1 focus:outline-none transition-colors"
                        >
                          <option value="NEW">Mark NEW</option>
                          <option value="CONTACTED">Mark CONTACTED</option>
                          <option value="CLOSED">Mark CLOSED</option>
                        </select>

                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="p-1 rounded-lg text-slate-400 hover:text-[#10243A] hover:bg-slate-100 transition-colors inline-flex items-center"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Real-Time Activity Log Stream (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <h2 className="text-base font-bold text-[#10243A] flex items-center gap-2">
              <History className="w-4 h-4 text-[#C7A76C]" />
              <span>Administrative Audit Trail</span>
            </h2>
            <Link
              href="/admin/activity-log"
              className="text-xs font-bold text-[#C7A76C] hover:underline"
            >
              Full Trail
            </Link>
          </div>

          {recentActivities.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No recent administrative actions recorded yet.
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {recentActivities.map((log, idx) => (
                <div
                  key={log._id || idx}
                  className="flex items-start gap-3 text-xs border-b border-slate-100 pb-3.5 last:border-0 last:pb-0"
                >
                  <span className="w-2 h-2 rounded-full bg-[#C7A76C] shrink-0 mt-1.5" />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 leading-snug break-words">
                      {log.summary}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[#10243A] bg-slate-100 px-1.5 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span>•</span>
                      <span>{log.adminEmail || 'admin'}</span>
                      <span>•</span>
                      <span>
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Just now'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* System Health Card */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Platform Infrastructure Status
            </span>
            <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 border border-slate-200/60">
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>MongoDB Atlas</span>
                </span>
                <span className="font-bold text-emerald-600 text-[11px]">Connected</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C7A76C]" />
                  <span>Auth Tokens</span>
                </span>
                <span className="font-bold text-slate-700 text-[11px]">Dual Cookie + DB</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Last Sync</span>
                </span>
                <span className="text-slate-500 text-[10px]">
                  {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Detailed Enquiry Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C7A76C] block">
                  Enquiry Reference
                </span>
                <h3 className="text-lg font-extrabold text-[#10243A]">
                  {selectedEnquiry.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Phone</span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="font-bold text-[#10243A] hover:underline">
                    {selectedEnquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                  <span className="font-semibold text-slate-700">
                    {selectedEnquiry.email || 'Not provided'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Service of Interest</span>
                  <span className="font-semibold text-slate-700">
                    {selectedEnquiry.serviceOfInterest || 'General Advisory'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Preferred Time</span>
                  <span className="font-semibold text-slate-700">
                    {selectedEnquiry.preferredTime || 'Anytime'}
                  </span>
                </div>
              </div>

              {selectedEnquiry.message && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                    Client Message
                  </span>
                  <div className="p-3.5 bg-slate-50 rounded-xl text-slate-700 leading-relaxed border border-slate-100">
                    {selectedEnquiry.message}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 text-[11px] text-slate-400">
                <span>Received: {formatDate(selectedEnquiry.createdAt)}</span>
                <span>Source: {selectedEnquiry.sourcePage || 'Homepage'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Update Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => {
                    handleUpdateStatus(selectedEnquiry._id, e.target.value);
                    setSelectedEnquiry((prev) => ({ ...prev, status: e.target.value }));
                  }}
                  className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="bg-[#10243A] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#1b3858] transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
