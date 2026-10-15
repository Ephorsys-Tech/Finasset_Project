'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminBlogManagerPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/v1/admin/blog');
      const json = await res.json();
      if (json.success) setPosts(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Financial Planning',
      author: 'Finasset Research Desk',
      featuredImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop',
      tags: ['Wealth', 'Investing'],
      readingTime: '5 min read',
      isPublished: true,
    });
  };

  const handleOpenEdit = (p) => {
    setIsNew(false);
    setEditingPost(JSON.parse(JSON.stringify(p)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = isNew ? 'POST' : 'PUT';
      const payload = isNew ? editingPost : { id: editingPost._id, ...editingPost };
      const res = await fetch('/api/v1/admin/blog', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setEditingPost(null);
        fetchPosts();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete article: "${title}"?`)) return;
    await fetch(`/api/v1/admin/blog?id=${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#10243A]">Blog & Articles Manager</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish educational articles, market insights, and tax guides.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-[#C7A76C]" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold">
                <th className="py-4 px-6">Published</th>
                <th className="py-4 px-6">Article Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Author</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap text-slate-500 font-medium">
                    {formatDate(p.publishedAt || p.createdAt)}
                  </td>
                  <td className="py-4 px-6 font-bold text-[#10243A] text-sm max-w-sm truncate">
                    {p.title}
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{p.author}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${p.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {p.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(p)} className="p-2 text-slate-600 hover:text-[#10243A]">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p._id, p.title)} className="p-2 text-rose-500 hover:text-rose-700">
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
      {editingPost && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-bold text-base text-[#10243A]">
                {isNew ? 'New Research Article' : 'Edit Article'}
              </h2>
              <button onClick={() => setEditingPost(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Category</label>
                  <select
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="Financial Planning">Financial Planning</option>
                    <option value="Mutual Funds">Mutual Funds</option>
                    <option value="Tax Planning">Tax Planning</option>
                    <option value="NRI Corner">NRI Corner</option>
                    <option value="Market Analysis">Market Analysis</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Author Name</label>
                  <input
                    type="text"
                    value={editingPost.author}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Excerpt / Brief Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">Article Body (Markdown Supported) *</label>
                <textarea
                  rows={8}
                  required
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Featured Image URL</label>
                  <input
                    type="url"
                    value={editingPost.featuredImage}
                    onChange={(e) => setEditingPost({ ...editingPost, featuredImage: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Publication Status</label>
                  <select
                    value={editingPost.isPublished ? 'true' : 'false'}
                    onChange={(e) => setEditingPost({ ...editingPost, isPublished: e.target.value === 'true' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setEditingPost(null)} className="px-4 py-2 border rounded-xl">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="bg-[#10243A] text-white font-bold px-6 py-2 rounded-xl">
                  {saving ? 'Saving...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
