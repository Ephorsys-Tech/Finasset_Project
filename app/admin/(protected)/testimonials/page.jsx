'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquareQuote,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Star,
  CheckCircle2,
} from 'lucide-react';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/v1/admin/testimonials');
      const json = await res.json();
      if (json.success) setTestimonials(json.data || []);
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
      clientName: '',
      designation: 'Client, Bhubaneswar',
      location: 'Bhubaneswar, Odisha',
      reviewText: '',
      rating: 5,
      serviceUsed: 'Mutual Funds & Financial Planning',
      order: testimonials.length,
      isPublished: true,
    });
  };

  const handleOpenEdit = (t) => {
    setIsNew(false);
    setEditingItem(JSON.parse(JSON.stringify(t)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = isNew ? 'POST' : 'PUT';
      const payload = isNew ? editingItem : { id: editingItem._id, ...editingItem };
      const res = await fetch('/api/v1/admin/testimonials', {
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
      await fetch(`/api/v1/admin/testimonials?id=${deleteTarget.id}`, { method: 'DELETE' });
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
          <h1 className="text-2xl font-extrabold text-[#10243A]">Client Testimonials</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage authenticated investor reviews, ratings, and display order.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-[#C7A76C]" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {t.isPublished ? 'Published' : 'Hidden'}
                </span>
              </div>
              <p className="text-xs text-slate-600 italic line-clamp-4">&quot;{t.reviewText}&quot;</p>
              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-bold text-sm text-[#10243A]">{t.clientName}</h4>
                <p className="text-[11px] text-slate-400">{t.designation} • {t.location}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 mt-4">
              <button onClick={() => handleOpenEdit(t)} className="p-1.5 text-slate-600 hover:text-[#10243A]">
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteTarget({ id: t._id, name: t.clientName })}
                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Testimonial"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-bold text-base text-[#10243A]">
                {isNew ? 'New Testimonial' : 'Edit Testimonial'}
              </h2>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={editingItem.clientName}
                  onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Designation</label>
                  <input
                    type="text"
                    value={editingItem.designation}
                    onChange={(e) => setEditingItem({ ...editingItem, designation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Review Text *</label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.reviewText}
                  onChange={(e) => setEditingItem({ ...editingItem, reviewText: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Star Rating (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editingItem.rating}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Status</label>
                  <select
                    value={editingItem.isPublished ? 'true' : 'false'}
                    onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.value === 'true' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
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
                  {saving ? 'Saving...' : 'Save Testimonial'}
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
        title="Delete Testimonial"
        itemName={deleteTarget?.name}
        message="Are you sure you want to delete this investor testimonial? This action cannot be undone."
        confirmText="Yes, Delete Review"
        isDeleting={isDeleting}
      />
    </div>
  );
}
