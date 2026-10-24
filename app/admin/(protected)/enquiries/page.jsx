'use client';

import { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Download,
  Trash2,
  MessageSquare,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  X,
  Plus,
  Eye,
  Calendar,
  Compass,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [activeNotesEnquiry, setActiveNotesEnquiry] = useState(null);
  const [selectedDetailsEnquiry, setSelectedDetailsEnquiry] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeletingTarget, setIsDeletingTarget] = useState(false);

  const fetchEnquiries = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/api/v1/admin/enquiries?page=${page}&`;
      if (statusFilter !== 'ALL') url += `status=${statusFilter}&`;
      if (typeFilter !== 'ALL') url += `type=${typeFilter}&`;
      if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data.enquiries || []);
        setPagination(
          json.data.pagination || {
            page: json.data.page || 1,
            totalPages: json.data.totalPages || 1,
            total: json.data.total || 0,
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries(1);
  }, [statusFilter, typeFilter, search]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch('/api/v1/admin/enquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchEnquiries(pagination.page);
        if (selectedDetailsEnquiry && selectedDetailsEnquiry._id === id) {
          setSelectedDetailsEnquiry((prev) => ({ ...prev, status }));
        }
      }
    } catch {
      alert('Error updating status');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeNotesEnquiry) return;
    setSavingNote(true);

    try {
      const res = await fetch('/api/v1/admin/enquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeNotesEnquiry._id, newNote: newNoteText }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveNotesEnquiry(data.data);
        setNewNoteText('');
        fetchEnquiries(pagination.page);
      }
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = (id, name) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setIsDeletingTarget(true);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/v1/admin/enquiries?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (selectedDetailsEnquiry && selectedDetailsEnquiry._id === id) {
          setSelectedDetailsEnquiry(null);
        }
        if (activeNotesEnquiry && activeNotesEnquiry._id === id) {
          setActiveNotesEnquiry(null);
        }
        fetchEnquiries(pagination.page);
        setDeleteTarget(null);
      } else {
        alert(data.message || 'Error deleting enquiry');
      }
    } catch {
      alert('Network error while deleting enquiry');
    } finally {
      setIsDeletingTarget(false);
      setDeletingId(null);
    }
  };

  const getTypeBadgeClass = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('nri')) return 'bg-cyan-100 text-cyan-800 border-cyan-300 font-extrabold';
    if (t.includes('consult')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (t.includes('callback')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (t.includes('contact')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (t.includes('career')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#10243A]">Enquiry & Consultation Requests</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track, update status, view details, append internal notes, or delete client consultation and portfolio requests.
          </p>
        </div>
        <a
          href="/api/v1/admin/enquiries/export"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Enquiries to CSV</span>
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['ALL', 'NEW', 'CONTACTED', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-[#10243A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
          <span className="text-slate-300 mx-1 hidden sm:inline">|</span>
          <button
            onClick={() => setTypeFilter(typeFilter === 'nri' ? 'ALL' : 'nri')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              typeFilter === 'nri'
                ? 'bg-cyan-700 text-white shadow-xs'
                : 'bg-cyan-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-100'
            }`}
          >
            <span>NRI Corner Enquiries</span>
          </button>
        </div>

        {/* Type & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">All Sources & Types</option>
            <option value="nri">NRI Consultations</option>
            <option value="consultation">Consultation Requests</option>
            <option value="callback">Callback Requests</option>
            <option value="contact">Contact Messages</option>
            <option value="career">Career Applications</option>
          </select>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search name, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold">
            Loading enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No matching requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold">
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Client Name</th>
                  <th className="py-4 px-4">Phone & Email</th>
                  <th className="py-4 px-4">Service / Source</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Notes</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map((e) => (
                  <tr key={e._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap text-slate-500 font-medium">
                      {formatDate(e.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getTypeBadgeClass(
                          e.type
                        )}`}
                      >
                        {e.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#10243A]">
                      {e.name}
                    </td>
                    <td className="py-4 px-4">
                      <a href={`tel:${e.phone}`} className="font-mono text-slate-800 font-bold hover:underline block">
                        {e.phone}
                      </a>
                      {e.email ? (
                        <a href={`mailto:${e.email}`} className="text-[11px] text-blue-600 hover:underline block truncate max-w-[180px]">
                          {e.email}
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No email</span>
                      )}
                    </td>
                    <td className="py-4 px-4 max-w-[170px] truncate text-slate-600">
                      <div className="font-semibold text-slate-800 truncate">{e.serviceOfInterest}</div>
                      <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        {e.country && <span className="font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.2 rounded border border-cyan-200">[{e.country}]</span>}
                        <span>{e.sourcePage}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={e.status}
                        onChange={(evt) => handleUpdateStatus(e._id, evt.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                          e.status === 'NEW'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : e.status === 'CONTACTED'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setActiveNotesEnquiry(e)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-[#10243A] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <MessageSquare className="w-3 h-3 text-[#C7A76C]" />
                        <span>{e.notes?.length || 0} notes</span>
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setSelectedDetailsEnquiry(e)}
                          className="p-1.5 text-slate-500 hover:text-[#10243A] hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Full Request Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          disabled={deletingId === e._id}
                          onClick={() => handleDelete(e._id, e.name)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 disabled:opacity-40 rounded-lg transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {enquiries.length} of {pagination.total} enquiries
          </div>
          <div className="flex gap-1">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchEnquiries(pagination.page - 1)}
              className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-3 py-1 font-bold text-[#10243A]">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchEnquiries(pagination.page + 1)}
              className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Full Request Details Modal */}
      {selectedDetailsEnquiry && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Request Details ({selectedDetailsEnquiry.trackingNumber || 'Ref'})
                </span>
                <h3 className="font-extrabold text-base text-[#10243A]">
                  {selectedDetailsEnquiry.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDetailsEnquiry(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                <a href={`tel:${selectedDetailsEnquiry.phone}`} className="font-bold text-[#10243A] hover:underline flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-[#89b441]" />
                  <span>{selectedDetailsEnquiry.phone}</span>
                </a>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                {selectedDetailsEnquiry.email ? (
                  <a href={`mailto:${selectedDetailsEnquiry.email}`} className="font-bold text-blue-600 hover:underline flex items-center gap-1 mt-0.5 truncate">
                    <Mail className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="truncate">{selectedDetailsEnquiry.email}</span>
                  </a>
                ) : (
                  <span className="text-slate-400 italic">Not provided</span>
                )}
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Service / Topic</span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  {selectedDetailsEnquiry.serviceOfInterest || 'General Advisory'}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Request Type</span>
                <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getTypeBadgeClass(selectedDetailsEnquiry.type)}`}>
                  {selectedDetailsEnquiry.type}
                </span>
              </div>
              {selectedDetailsEnquiry.preferredTime && (
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/70 col-span-2">
                  <span className="text-amber-800 block text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Preferred Callback Time
                  </span>
                  <span className="font-bold text-amber-950 block mt-0.5 text-xs">
                    {selectedDetailsEnquiry.preferredTime}
                  </span>
                </div>
              )}
              {selectedDetailsEnquiry.country && (
                <div className="bg-cyan-50/70 p-3 rounded-xl border border-cyan-200/80 col-span-2">
                  <span className="text-cyan-800 block text-[10px] uppercase font-bold tracking-wider">
                    Country of Residence
                  </span>
                  <span className="font-extrabold text-cyan-950 block mt-0.5 text-sm">
                    {selectedDetailsEnquiry.country}
                  </span>
                </div>
              )}
            </div>

            {selectedDetailsEnquiry.message && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-[#10243A] block mb-1">Client Message:</span>
                <p className="whitespace-pre-line leading-relaxed">&quot;{selectedDetailsEnquiry.message}&quot;</p>
              </div>
            )}

            <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
              <span>Received: {formatDate(selectedDetailsEnquiry.createdAt)}</span>
              <span>Source: {selectedDetailsEnquiry.sourcePage || 'Website'}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Status:</span>
                <select
                  value={selectedDetailsEnquiry.status}
                  onChange={(e) => handleUpdateStatus(selectedDetailsEnquiry._id, e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
              <button
                onClick={() => handleDelete(selectedDetailsEnquiry._id, selectedDetailsEnquiry.name)}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal Notes Modal */}
      {activeNotesEnquiry && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#10243A]">
                  Internal Notes: {activeNotesEnquiry.name}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {activeNotesEnquiry.phone} • {activeNotesEnquiry.serviceOfInterest}
                </p>
              </div>
              <button
                onClick={() => setActiveNotesEnquiry(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Client Message */}
            {activeNotesEnquiry.message && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-[#10243A] block mb-0.5">Original Message:</span>
                &quot;{activeNotesEnquiry.message}&quot;
              </div>
            )}

            {/* Notes List */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto">
              {!activeNotesEnquiry.notes?.length ? (
                <div className="text-center py-4 text-xs text-slate-400">
                  No internal notes yet.
                </div>
              ) : (
                activeNotesEnquiry.notes.map((n, idx) => (
                  <div key={idx} className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-xs space-y-1">
                    <p className="text-slate-800">{n.note}</p>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span className="font-bold text-[#10243A]">{n.adminName}</span>
                      <span>{new Date(n.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Append Note Form */}
            <form onSubmit={handleAddNote} className="space-y-3 pt-2 border-t border-slate-100">
              <textarea
                rows={2}
                required
                placeholder="Type internal follow-up note (e.g. Called client, shared KYC link)..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
              />
              <button
                type="submit"
                disabled={savingNote}
                className="w-full bg-[#10243A] hover:bg-[#1b3858] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all"
              >
                {savingNote ? 'Appending...' : 'Append Internal Note'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !isDeletingTarget && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Enquiry Request"
        itemName={deleteTarget?.name}
        warningDetails="This will permanently delete this client enquiry and all its internal notes from the database."
        isDeleting={isDeletingTarget}
      />
    </div>
  );
}
