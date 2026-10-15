'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Phone,
} from 'lucide-react';

export default function AdminPayPremiumPage() {
  const [insurers, setInsurers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingInsurer, setEditingInsurer] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchInsurers = async () => {
    try {
      const res = await fetch('/api/v1/admin/insurers');
      const json = await res.json();
      if (json.success) setInsurers(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsurers();
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingInsurer({
      name: '',
      category: 'Life Insurance',
      logoUrl: '',
      paymentPortalUrl: '',
      helpline: '1800-XXX-XXXX',
      description: 'Instant online premium payment gateway for active policy holders.',
      order: insurers.length,
      isPublished: true,
    });
  };

  const handleOpenEdit = (ins) => {
    setIsNew(false);
    setEditingInsurer(JSON.parse(JSON.stringify(ins)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const method = isNew ? 'POST' : 'PUT';
      const payload = isNew ? editingInsurer : { id: editingInsurer._id, ...editingInsurer };

      const res = await fetch('/api/v1/admin/insurers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setMsg({ type: 'success', text: `Insurer '${editingInsurer.name}' saved!` });
        setEditingInsurer(null);
        fetchInsurers();
      } else {
        setMsg({ type: 'error', text: data.message || 'Error saving insurer' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error saving insurer' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete insurer: "${name}"?`)) return;
    try {
      const res = await fetch(`/api/v1/admin/insurers?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchInsurers();
    } catch {
      alert('Error deleting insurer');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#10243A]">Pay Premium Insurers</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage official renewal portals for Life, Health, and General Insurance partners.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-[#C7A76C]" />
          <span>Add New Insurer</span>
        </button>
      </div>

      {msg.text && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold ${
            msg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Insurers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold">
                <th className="py-4 px-6">Order</th>
                <th className="py-4 px-6">Insurer Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Helpline</th>
                <th className="py-4 px-6">Payment Portal Link</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {insurers.map((ins) => (
                <tr key={ins._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-mono text-slate-400 font-bold">#{ins.order}</td>
                  <td className="py-4 px-6 font-bold text-[#10243A] text-sm">{ins.name}</td>
                  <td className="py-4 px-6">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                      {ins.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-600">{ins.helpline}</td>
                  <td className="py-4 px-6 max-w-[200px] truncate">
                    <a
                      href={ins.paymentPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C7A76C] hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span className="truncate">{ins.paymentPortalUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ins.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ins.isPublished ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(ins)}
                      className="p-2 text-slate-600 hover:text-[#10243A] rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ins._id, ins.name)}
                      className="p-2 text-rose-500 hover:text-rose-700 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {editingInsurer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-[#10243A]">
                {isNew ? 'Add Insurer Portal' : 'Edit Insurer Portal'}
              </h2>
              <button onClick={() => setEditingInsurer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Insurer Name *</label>
                <input
                  type="text"
                  required
                  value={editingInsurer.name}
                  onChange={(e) => setEditingInsurer({ ...editingInsurer, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Category</label>
                  <select
                    value={editingInsurer.category}
                    onChange={(e) => setEditingInsurer({ ...editingInsurer, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="Life Insurance">Life Insurance</option>
                    <option value="Health Insurance">Health Insurance</option>
                    <option value="General Insurance">General Insurance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Toll-Free Helpline</label>
                  <input
                    type="text"
                    value={editingInsurer.helpline}
                    onChange={(e) => setEditingInsurer({ ...editingInsurer, helpline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Payment Portal URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={editingInsurer.paymentPortalUrl}
                  onChange={(e) => setEditingInsurer({ ...editingInsurer, paymentPortalUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Short Description</label>
                <input
                  type="text"
                  value={editingInsurer.description}
                  onChange={(e) => setEditingInsurer({ ...editingInsurer, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingInsurer.order}
                    onChange={(e) => setEditingInsurer({ ...editingInsurer, order: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Visibility</label>
                  <select
                    value={editingInsurer.isPublished ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditingInsurer({ ...editingInsurer, isPublished: e.target.value === 'true' })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                  >
                    <option value="true">Published</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingInsurer(null)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#10243A] text-white font-bold px-6 py-2 rounded-xl"
                >
                  {saving ? 'Saving...' : 'Save Insurer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
