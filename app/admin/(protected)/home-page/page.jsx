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
  Image as ImageIcon,
  Layers,
} from 'lucide-react';

// Preset high-res financial advisory photos
const SAMPLE_PRESETS = [
  {
    name: 'Boardroom Advisory (Screenshot Match)',
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: 'Stock Market Analytics',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: 'Retirement & Life Planning',
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1920&q=80',
  },
  {
    name: 'Wealth & Office Architecture',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
  },
];

function renderLivePreview(title = '') {
  if (!title) return null;

  const regex = /(Grow Your Wealth|Retirement Planning|\bSmart\b|\bSecure\b)/gi;
  if (regex.test(title)) {
    const parts = title.split(regex);
    return parts.map((part, i) => {
      if (!part) return null;
      const lower = part.toLowerCase();
      if (lower === 'grow your wealth' || lower === 'retirement planning') {
        return (
          <span key={i} className="text-[#f87b1f] font-extrabold">
            {part}
          </span>
        );
      }
      if (lower === 'smart') {
        return (
          <span key={i} className="text-[#2376b8] font-extrabold">
            {part}
          </span>
        );
      }
      if (lower === 'secure') {
        return (
          <span key={i} className="text-[#89b441] font-extrabold">
            {part}
          </span>
        );
      }
      return <span key={i} className="text-white">{part}</span>;
    });
  }

  const words = title.split(' ');
  if (words.length > 3) {
    return (
      <>
        <span className="text-[#f87b1f] font-extrabold">{words.slice(0, 3).join(' ')}</span>
        <span className="text-white"> {words.slice(3).join(' ')}</span>
      </>
    );
  }

  return <span className="text-[#f87b1f] font-extrabold">{title}</span>;
}

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
      if (json.success) {
        const list = json.data?.heroSlides || (Array.isArray(json.data) ? json.data : []);
        setSlides(list);
      }
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
      title: 'Grow Your Wealth With Smart Financial Planning',
      subtitle:
        'Personalized portfolio management and mutual fund strategies designed to secure your long-term goals.',
      bgImageUrl:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1920&q=80',
      order: slides.length + 1,
      isActive: true,
      cta1Text: 'Our Services',
      cta1Url: '#services',
      cta2Text: 'Contact Us',
      cta2Url: '#contact',
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
      let updatedSlides = [];
      const currentPayload = {
        ...editingSlide,
        cta1Text: 'Our Services',
        cta1Url: '#services',
        cta2Text: 'Contact Us',
        cta2Url: '#contact',
      };

      if (isNew) {
        updatedSlides = [...slides, currentPayload];
      } else {
        updatedSlides = slides.map((s) => {
          const isMatch =
            (currentPayload._id && s._id === currentPayload._id) ||
            (currentPayload.id && s.id === currentPayload.id);
          return isMatch ? { ...s, ...currentPayload } : s;
        });
      }

      const res = await fetch('/api/v1/admin/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroSlides: updatedSlides }),
      });
      const data = await res.json();

      if (data.success) {
        setMsg({ type: 'success', text: 'Hero slides updated successfully!' });
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
      const updatedSlides = slides.filter((s) => s._id !== id && s.id !== id);
      const res = await fetch('/api/v1/admin/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroSlides: updatedSlides }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Slide deleted successfully' });
        fetchSlides();
      } else {
        alert(data.message || 'Error deleting slide');
      }
    } catch {
      alert('Error deleting slide');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#10243A]">Hero Section Slider Manager</h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize Homepage Hero Section: Heading Title, Sub-title, and Background Image with Bottom-to-Top transitions.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-[#2376b8] hover:bg-[#1a5b8f] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-[#2376b8]/20"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Hero Slide</span>
        </button>
      </div>

      {msg.text && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-[#f0f6fb] border border-[#2376b8]/20 rounded-2xl p-4 text-xs text-[#2376b8] flex items-center gap-3">
        <Layers className="w-5 h-5 shrink-0" />
        <span>
          <strong>Design Structure:</strong> Slides automatically animate using smooth <strong>Bottom-to-Top</strong> vertical transitions. Call-to-action buttons are permanently fixed to <strong>&quot;Our Services&quot;</strong> and <strong>&quot;Contact Us&quot;</strong>.
        </span>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((s, index) => {
          const imgUrl = s.bgImageUrl || s.imageUrl || s.bgImage;
          return (
            <div
              key={s._id || s.id || index}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              {imgUrl && (
                <div className="h-48 bg-slate-900 relative overflow-hidden group">
                  <img src={imgUrl} alt={s.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <span className="absolute top-3 left-3 bg-[#080c10]/85 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded backdrop-blur-sm border border-white/10">
                    Order #{s.order ?? index + 1}
                  </span>
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded ${
                      s.isActive !== false
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-600 text-slate-200'
                    }`}
                  >
                    {s.isActive !== false ? 'Active' : 'Disabled'}
                  </span>
                </div>
              )}

              <div className="p-6 space-y-3">
                <div className="bg-slate-950 p-4 rounded-xl">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Frontend Header Look:
                  </div>
                  <div className="text-base font-extrabold leading-snug">
                    {renderLivePreview(s.title)}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Sub-title Description:
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{s.subtitle || s.description}</p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#2376b8]/10 text-[#2376b8] font-bold">
                    Our Services
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#89b441]/10 text-[#89b441] font-bold">
                    Contact Us
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-2 text-slate-600 hover:text-[#2376b8] rounded-lg transition-colors"
                    title="Edit Slide"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s._id || s.id, s.title)}
                    className="p-2 text-rose-500 hover:text-rose-700 rounded-lg transition-colors"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Create Modal */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-lg text-[#10243A]">
                  {isNew ? 'Create New Hero Slide' : 'Edit Hero Slide'}
                </h2>
                <p className="text-xs text-slate-400">
                  Update Title, Sub-title, and Background Image
                </p>
              </div>
              <button
                onClick={() => setEditingSlide(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              {/* 1. TITLE */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#10243A] uppercase tracking-wider">
                    Title *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    &apos;Grow Your Wealth&apos; (#f87b1f), &apos;Smart&apos; (#2376b8), &apos;Secure&apos; (#89b441)
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={editingSlide.title || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#2376b8]"
                  placeholder="e.g. Grow Your Wealth With Smart Financial Planning"
                />

                {/* Live Color Highlight Preview */}
                <div className="mt-2.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Live Highlight Preview:
                  </div>
                  <div className="text-base font-extrabold">
                    {renderLivePreview(editingSlide.title)}
                  </div>
                </div>
              </div>

              {/* 2. SUB-TITLE */}
              <div>
                <label className="block font-bold text-[#10243A] uppercase tracking-wider mb-1.5">
                  Sub-title *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingSlide.subtitle || editingSlide.description || ''}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      subtitle: e.target.value,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm focus:outline-none focus:border-[#2376b8]"
                  placeholder="e.g. Personalized portfolio management and mutual fund strategies designed to secure your long-term goals."
                />
              </div>

              {/* 3. BG-IMAGE */}
              <div>
                <label className="block font-bold text-[#10243A] uppercase tracking-wider mb-1.5">
                  Background Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={editingSlide.bgImageUrl || editingSlide.imageUrl || ''}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      bgImageUrl: e.target.value,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-xs font-mono focus:outline-none focus:border-[#2376b8] mb-2.5"
                  placeholder="https://images.unsplash.com/..."
                />

                {/* Quick Presets */}
                <div className="text-[11px] font-bold text-slate-500 mb-1.5">
                  Quick Photo Presets:
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {SAMPLE_PRESETS.map((p, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() =>
                        setEditingSlide({
                          ...editingSlide,
                          bgImageUrl: p.url,
                          imageUrl: p.url,
                        })
                      }
                      className="text-[11px] p-2 rounded-lg bg-slate-50 hover:bg-[#f0f6fb] text-slate-700 border border-slate-200 text-left truncate transition-colors"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                {/* Image Preview */}
                {(editingSlide.bgImageUrl || editingSlide.imageUrl) && (
                  <div className="h-32 rounded-xl overflow-hidden border border-slate-200 relative">
                    <img
                      src={editingSlide.bgImageUrl || editingSlide.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-4">
                      <span className="text-white text-xs font-bold drop-shadow">
                        Live Image Preview
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingSlide.order ?? 1}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, order: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm focus:outline-none focus:border-[#2376b8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10243A] uppercase tracking-wider mb-1.5">
                    Visibility Status
                  </label>
                  <select
                    value={editingSlide.isActive !== false ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, isActive: e.target.value === 'true' })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm focus:outline-none focus:border-[#2376b8]"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Disabled (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Fixed Buttons Info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[11px] flex items-center justify-between">
                <span>Fixed CTAs: <strong>Our Services</strong> (#services) &amp; <strong>Contact Us</strong> (#contact)</span>
                <span className="text-[#89b441] font-bold">✓ Configured</span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#2376b8] hover:bg-[#1a5b8f] text-white font-bold px-7 py-2.5 rounded-xl shadow transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving to Database...' : 'Save Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
