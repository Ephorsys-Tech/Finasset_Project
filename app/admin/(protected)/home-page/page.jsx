'use client';

import { useState, useEffect } from 'react';
import {
  Home,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function AdminHomePageManager() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/v1/admin/home');
      const json = await res.json();
      if (json.success) setSlides(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingSlide({
      title: '',
      subtitle: '',
      badge: 'Finasset Wealth Management',
      cta1Text: 'Explore Our Services',
      cta1Url: '/services',
      cta2Text: 'Calculate Your Wealth',
      cta2Url: '/investor/financial-calculator',
      bgImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
      statsHighlight: { label: 'Client Trust & Assets', value: '15+ Years in Odisha' },
      order: slides.length,
      isActive: true,
    });
  };

  const handleOpenEdit = (slide) => {
    setIsNew(false);
    setEditingSlide(JSON.parse(JSON.stringify(slide)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const method = isNew ? 'POST' : 'PUT';
      const payload = isNew ? editingSlide : { id: editingSlide._id, ...editingSlide };

      const res = await fetch('/api/v1/admin/home', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setMsg({ type: 'success', text: 'Slide saved successfully' });
        setEditingSlide(null);
        fetchSlides();
      } else {
        setMsg({ type: 'error', text: data.message || 'Error saving slide' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error saving slide' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete slide: "${title}"?`)) return;
    try {
      const res = await fetch(`/api/v1/admin/home?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchSlides();
    } catch {
      alert('Error deleting slide');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#10243A]">Home Page Carousel Manager</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure hero carousel slides, call-to-action buttons, and images.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-[#C7A76C]" />
          <span>Add Hero Slide</span>
        </button>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
          {msg.text}
        </div>
      )}

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((s) => (
          <div key={s._id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
            {s.bgImageUrl && (
              <div className="h-44 bg-slate-800 relative overflow-hidden">
                <img src={s.bgImageUrl} alt={s.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-[#10243A] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded">
                  Order #{s.order} • {s.badge}
                </span>
                <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded ${s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {s.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>
            )}
            <div className="p-6 space-y-3">
              <h3 className="font-bold text-base text-[#10243A] line-clamp-2">{s.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{s.subtitle}</p>
              <div className="text-[11px] text-slate-600 flex items-center gap-2">
                <span className="font-bold">Button 1:</span> {s.cta1Text} ({s.cta1Url})
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button
                onClick={() => handleOpenEdit(s)}
                className="p-2 text-slate-600 hover:text-[#10243A] rounded-lg"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(s._id, s.title)}
                className="p-2 text-rose-500 hover:text-rose-700 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-[#10243A]">
                {isNew ? 'Create Hero Slide' : 'Edit Hero Slide'}
              </h2>
              <button onClick={() => setEditingSlide(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Heading Title *</label>
                <input
                  type="text"
                  required
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Subtitle Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingSlide.subtitle}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={editingSlide.badge}
                    onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Background Image URL</label>
                  <input
                    type="url"
                    value={editingSlide.bgImageUrl}
                    onChange={(e) => setEditingSlide({ ...editingSlide, bgImageUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Button 1 Label</label>
                  <input
                    type="text"
                    value={editingSlide.cta1Text}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta1Text: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Button 1 URL</label>
                  <input
                    type="text"
                    value={editingSlide.cta1Url}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta1Url: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Button 2 Label</label>
                  <input
                    type="text"
                    value={editingSlide.cta2Text}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta2Text: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Button 2 URL</label>
                  <input
                    type="text"
                    value={editingSlide.cta2Url}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta2Url: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingSlide.order}
                    onChange={(e) => setEditingSlide({ ...editingSlide, order: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Status</label>
                  <select
                    value={editingSlide.isActive ? 'true' : 'false'}
                    onChange={(e) => setEditingSlide({ ...editingSlide, isActive: e.target.value === 'true' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                  >
                    <option value="true">Active</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#10243A] text-white font-bold px-6 py-2 rounded-xl"
                >
                  {saving ? 'Saving...' : 'Save Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
