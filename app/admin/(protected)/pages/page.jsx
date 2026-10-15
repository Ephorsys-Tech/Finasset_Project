'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Edit2,
  Save,
  X,
  CheckCircle2,
  ExternalLink,
  Plus,
} from 'lucide-react';

export default function AdminPagesManager() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/v1/admin/pages');
      const json = await res.json();
      if (json.success) setPages(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleOpenEdit = (p) => {
    setEditingPage(JSON.parse(JSON.stringify(p)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch('/api/v1/admin/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingPage._id, ...editingPage }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Page "${editingPage.title}" updated successfully!`);
        setEditingPage(null);
        fetchPages();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#10243A]">Content Pages Manager</h1>
        <p className="text-xs text-slate-500 mt-1">
          Edit textual content, banner headings, and sections for dynamic public pages.
        </p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Pages Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pages.map((p) => (
          <div key={p._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">/{p.slug}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                  Published
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#10243A]">{p.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{p.bannerTitle}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-6">
              <a
                href={`/${p.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-[#10243A] flex items-center gap-1 font-semibold"
              >
                <span>View Live</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => handleOpenEdit(p)}
                className="bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#C7A76C]" />
                <span>Edit Content</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPage && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="font-bold text-base text-[#10243A]">Edit Page: {editingPage.title}</h2>
                <span className="font-mono text-[11px] text-slate-400">URL: /{editingPage.slug}</span>
              </div>
              <button onClick={() => setEditingPage(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Banner Main Title</label>
                <input
                  type="text"
                  value={editingPage.bannerTitle}
                  onChange={(e) => setEditingPage({ ...editingPage, bannerTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Banner Subtitle</label>
                <input
                  type="text"
                  value={editingPage.bannerSubtitle || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, bannerSubtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Main Body Text</label>
                <textarea
                  rows={4}
                  value={editingPage.mainContent || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, mainContent: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">SEO Meta Title</label>
                <input
                  type="text"
                  value={editingPage.metaTitle || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={editingPage.metaDescription || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setEditingPage(null)} className="px-4 py-2 border rounded-xl">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="bg-[#10243A] text-white font-bold px-6 py-2 rounded-xl">
                  {saving ? 'Saving...' : 'Save Page Content'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
