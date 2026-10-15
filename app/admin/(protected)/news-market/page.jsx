'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function AdminNewsMarketPage() {
  const [news, setNews] = useState([]);
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/v1/admin/market-news');
      const json = await res.json();
      if (json.success) {
        setNews(json.data.news || []);
        setIndices(json.data.indices || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingNews({
      tab: 'market',
      title: '',
      summary: '',
      source: 'Finasset Research Desk',
      url: '/market-update',
      badge: 'Market Alert',
      isFeatured: false,
      order: news.length,
      isPublished: true,
    });
  };

  const handleOpenEdit = (item) => {
    setIsNew(false);
    setEditingNews(JSON.parse(JSON.stringify(item)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const method = isNew ? 'POST' : 'PUT';
      const payload = isNew ? editingNews : { id: editingNews._id, ...editingNews };

      const res = await fetch('/api/v1/admin/market-news', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('News item saved successfully');
        setEditingNews(null);
        fetchData();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete news item: "${title}"?`)) return;
    try {
      const res = await fetch(`/api/v1/admin/market-news?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchData();
    } catch {
      alert('Error deleting news item');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#10243A]">News & Market Indicators</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish research notes for Popular, IPO, and Market tabs, and review Sensex/Nifty indices.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-[#C7A76C]" />
          <span>Publish Market News</span>
        </button>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
          {msg}
        </div>
      )}

      {/* Indices Snapshot */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#10243A]">
          Benchmark Indices Snapshot
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {indices.map((idx) => (
            <div key={idx.symbol} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div className="font-bold text-[#10243A]">{idx.name}</div>
              <div className="text-xl font-extrabold text-[#10243A] mt-1">{formatINR(idx.currentValue)}</div>
              <div className={idx.change >= 0 ? 'text-emerald-600 font-semibold mt-0.5' : 'text-rose-600 font-semibold mt-0.5'}>
                {idx.change >= 0 ? '+' : ''}{idx.change} ({idx.percentChange}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News Items Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold">
                <th className="py-4 px-6">Tab</th>
                <th className="py-4 px-6">Headline Title</th>
                <th className="py-4 px-6">Badge / Source</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {news.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="bg-[#10243A] text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase">
                      {item.tab}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-[#10243A] text-sm max-w-sm truncate">
                    {item.title}
                  </td>
                  <td className="py-4 px-6 text-slate-500">
                    <div>{item.badge}</div>
                    <div className="text-[10px] text-slate-400">{item.source}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${item.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {item.isPublished ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 text-slate-600 hover:text-[#10243A] rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
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
      {editingNews && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-bold text-base text-[#10243A]">
                {isNew ? 'Publish Market News' : 'Edit Market News'}
              </h2>
              <button onClick={() => setEditingNews(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Target Tab</label>
                  <select
                    value={editingNews.tab}
                    onChange={(e) => setEditingNews({ ...editingNews, tab: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="popular">Popular News</option>
                    <option value="ipo">IPO Watch</option>
                    <option value="market">Market Desk</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Badge Pill</label>
                  <input
                    type="text"
                    value={editingNews.badge}
                    onChange={(e) => setEditingNews({ ...editingNews, badge: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={editingNews.summary}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Source / Attribution</label>
                  <input
                    type="text"
                    value={editingNews.source}
                    onChange={(e) => setEditingNews({ ...editingNews, source: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Status</label>
                  <select
                    value={editingNews.isPublished ? 'true' : 'false'}
                    onChange={(e) => setEditingNews({ ...editingNews, isPublished: e.target.value === 'true' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="true">Published</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingNews(null)}
                  className="px-4 py-2 border rounded-xl text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#10243A] text-white font-bold px-6 py-2 rounded-xl"
                >
                  {saving ? 'Saving...' : 'Save News Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
