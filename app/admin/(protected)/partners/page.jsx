'use client';

import { useState, useEffect } from 'react';
import {
  Handshake,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Save,
  X,
} from 'lucide-react';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/v1/admin/partners');
      const json = await res.json();
      if (json.success) setPartners(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingItem({
      name: '',
      category: 'Mutual Fund AMC',
      logoUrl: '',
      websiteUrl: '',
      order: partners.length,
      isPublished: true,
    });
  };

  const handleOpenEdit = (p) => {
    setIsNew(false);
    setEditingItem(JSON.parse(JSON.stringify(p)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = isNew ? 'POST' : 'PUT';
      const payload = isNew ? editingItem : { id: editingItem._id, ...editingItem };
      const res = await fetch('/api/v1/admin/partners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setEditingItem(null);
        fetchItems();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/v1/admin/partners?id=${deleteTarget.id}`, { method: 'DELETE' });
      fetchItems();
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#10243A]">Partner Institutions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage AMC partners, Insurance tie-ups, and depository relationships.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-[#C7A76C]" />
          <span>Add New Partner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((p) => (
          <div key={p._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C7A76C] bg-[#C7A76C]/10 px-2.5 py-1 rounded-full">
                {p.category}
              </span>
              <h3 className="text-lg font-bold text-[#10243A] mt-2">{p.name}</h3>
              {p.websiteUrl && (
                <a
                  href={p.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-[#C7A76C] flex items-center gap-1 font-mono truncate"
                >
                  <span className="truncate">{p.websiteUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-6">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                {p.isPublished ? 'Active' : 'Hidden'}
              </span>
              <div className="flex gap-1">
                <button onClick={() => handleOpenEdit(p)} className="p-1.5 text-slate-600 hover:text-[#10243A]">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget({ id: p._id, name: p.name })}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Partner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-bold text-base text-[#10243A]">
                {isNew ? 'New Partner' : 'Edit Partner'}
              </h2>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Partner / AMC Name *</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Category</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="Mutual Fund AMC">Mutual Fund AMC</option>
                  <option value="Insurance Partner">Insurance Partner</option>
                  <option value="PMS & AIF Provider">PMS & AIF Provider</option>
                  <option value="Banking & Depository">Banking & Depository</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Official Website URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editingItem.websiteUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, websiteUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingItem.order}
                    onChange={(e) => setEditingItem({ ...editingItem, order: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Visibility</label>
                  <select
                    value={editingItem.isPublished ? 'true' : 'false'}
                    onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.value === 'true' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="true">Published</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 border rounded-xl">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="bg-[#10243A] text-white font-bold px-6 py-2 rounded-xl">
                  {saving ? 'Saving...' : 'Save Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Partner Institution"
        itemName={deleteTarget?.name}
        message="Are you sure you want to remove this partner tie-up? This action cannot be undone."
        confirmText="Yes, Delete Partner"
        isDeleting={isDeleting}
      />
    </div>
  );
}
