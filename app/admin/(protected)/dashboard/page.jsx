'use client';

import { useState, useEffect } from 'react';
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
  ShieldAlert,
  Settings,
  Plus,
  Eye,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/v1/admin/dashboard');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setStatusUpdating(id);
    try {
      const res = await fetch('/api/v1/admin/enquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        fetchDashboard();
      }
    } finally {
      setStatusUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-[#10243A] border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs uppercase tracking-wider font-bold">Loading Dashboard Metrics...</p>
      </div>
    );
  }

  const enquiries = data?.enquiries || { total: 0, new: 0, contacted: 0, closed: 0 };
  const kpis = data?.kpis || { services: 0, publishedBlogs: 0, activePartners: 0 };
  const recentEnquiries = data?.recentEnquiries || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#10243A]">Administrative Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time inquiries, service metrics, and audit log for Finasset Wealth.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Enquiries */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Enquiries
            </span>
            <div className="text-3xl font-extrabold text-[#10243A]">{enquiries.total}</div>
            <div className="text-[11px] text-slate-500 mt-1">Callbacks, contacts & careers</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#10243A] flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        {/* New Enquiries */}
        <div className="bg-white p-6 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
              New Enquiries
            </span>
            <div className="text-3xl font-extrabold text-amber-700">{enquiries.new}</div>
            <div className="text-[11px] text-amber-600/80 mt-1 font-medium">Requires advisor callback</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Core Services */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Active Services
            </span>
            <div className="text-3xl font-extrabold text-[#10243A]">{kpis.services}</div>
            <div className="text-[11px] text-slate-500 mt-1">Disciplines published</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#C7A76C] flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Published Blogs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Research Articles
            </span>
            <div className="text-3xl font-extrabold text-[#10243A]">{kpis.publishedBlogs}</div>
            <div className="text-[11px] text-slate-500 mt-1">Articles published</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-emerald-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Quick Actions:
        </span>
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
            <span>Write Blog Post</span>
          </Link>
          <Link
            href="/admin/home-page"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-[#10243A] px-3.5 py-2 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <span>Hero Slides</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#C7A76C] text-[#10243A] px-3.5 py-2 rounded-xl hover:bg-[#dfc593] transition-colors"
          >
            <span>View All Enquiries</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Recent Enquiries (8 cols) & Activity Log (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Enquiries Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#10243A]">Recent Enquiries & Callbacks</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Submissions from the public website forms.
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-[#C7A76C] hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No enquiry submissions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Client</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Service</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Quick Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentEnquiries.map((enq) => (
                    <tr key={enq._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {formatDate(enq.createdAt)}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#10243A]">
                        {enq.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono">
                        {enq.phone}
                      </td>
                      <td className="py-3 px-3 text-slate-600 truncate max-w-[140px]">
                        {enq.serviceOfInterest}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                      <td className="py-3 px-3 text-right">
                        <select
                          disabled={statusUpdating === enq._id}
                          value={enq.status}
                          onChange={(e) => handleUpdateStatus(enq._id, e.target.value)}
                          className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg px-2 py-1 focus:outline-none"
                        >
                          <option value="NEW">Mark NEW</option>
                          <option value="CONTACTED">Mark CONTACTED</option>
                          <option value="CLOSED">Mark CLOSED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audit Trail Activity Stream (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#10243A] flex items-center gap-2">
              <History className="w-4 h-4 text-[#C7A76C]" />
              <span>Administrative Audit Trail</span>
            </h2>
            <Link
              href="/admin/activity-log"
              className="text-xs font-bold text-[#C7A76C] hover:underline"
            >
              All
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No administrative logs recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <span className="w-2 h-2 rounded-full bg-[#C7A76C] shrink-0 mt-1.5" />
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-800">{log.summary}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span className="font-bold text-[#10243A]">{log.action}</span>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
