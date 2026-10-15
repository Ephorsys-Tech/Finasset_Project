'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  UploadCloud,
  Cloud,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';

export default function AdminMediaPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const fileInputRef = useRef(null);

  const [newItem, setNewItem] = useState({
    filename: '',
    url: '',
    file: '',
    altText: '',
    category: 'general',
  });

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/v1/admin/media');
      const json = await res.json();
      if (json.success) setMedia(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      setNewItem((prev) => ({
        ...prev,
        file: reader.result,
        filename: file.name.replace(/\.[^/.]+$/, ''),
        altText: file.name.replace(/\.[^/.]+$/, ''),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (uploadMode === 'file' && !newItem.file) {
      setErrorMsg('Please choose an image file to upload.');
      return;
    }

    if (uploadMode === 'url' && (!newItem.url || !newItem.filename)) {
      setErrorMsg('Please provide both the image URL and a label/filename.');
      return;
    }

    setUploading(true);

    try {
      const res = await fetch('/api/v1/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      const data = await res.json();
      if (data.success) {
        setShowAdd(false);
        setNewItem({ filename: '', url: '', file: '', altText: '', category: 'general' });
        setPreviewUrl('');
        fetchMedia();
      } else {
        setErrorMsg(data.message || 'Failed to upload media.');
      }
    } catch {
      setErrorMsg('Network error while communicating with upload server.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this media asset? This will also remove it from Cloudinary if hosted there.')) return;
    await fetch(`/api/v1/admin/media?id=${id}`, { method: 'DELETE' });
    fetchMedia();
  };

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#10243A]">Media Library</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              <Cloud className="w-3 h-3" /> Cloudinary Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload images directly to Cloudinary or reference curated Unsplash assets across services and slides.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAdd(!showAdd);
            setErrorMsg('');
          }}
          className="bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-[#C7A76C]" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Upload Modal / Drawer */}
      {showAdd && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="font-bold text-[#10243A] text-base flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#C7A76C]" />
              Upload Image Asset
            </h3>

            {/* Toggle Mode */}
            <div className="flex bg-slate-100 rounded-lg p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setUploadMode('file');
                  setErrorMsg('');
                }}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  uploadMode === 'file' ? 'bg-white shadow text-[#10243A]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                File Upload (Cloudinary)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadMode('url');
                  setErrorMsg('');
                }}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  uploadMode === 'url' ? 'bg-white shadow text-[#10243A]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                External URL (Unsplash)
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-5">
            {uploadMode === 'file' ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#C7A76C] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-[#C7A76C]/5"
                >
                  {previewUrl ? (
                    <div className="space-y-3">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-xl object-contain border border-slate-200 shadow-sm"
                      />
                      <p className="text-xs text-slate-500">Click to choose a different image file</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-[#10243A]/5 text-[#C7A76C] flex items-center justify-center mx-auto">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-[#10243A]">Click to select an image from your computer</p>
                      <p className="text-xs text-slate-400">Supports PNG, JPG, JPEG, WebP, SVG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Image Direct URL (e.g. Unsplash URL)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newItem.url}
                  onChange={(e) => {
                    setNewItem({ ...newItem, url: e.target.value });
                    setPreviewUrl(e.target.value);
                  }}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#C7A76C] outline-none"
                  required={uploadMode === 'url'}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Filename / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. wealth-growth-chart"
                  value={newItem.filename}
                  onChange={(e) => setNewItem({ ...newItem, filename: e.target.value })}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#C7A76C] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Alt Description
                </label>
                <input
                  type="text"
                  placeholder="Accessible descriptive text"
                  value={newItem.altText}
                  onChange={(e) => setNewItem({ ...newItem, altText: e.target.value })}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#C7A76C] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#C7A76C] outline-none bg-white"
                >
                  <option value="general">General</option>
                  <option value="hero">Hero Slides</option>
                  <option value="services">Services</option>
                  <option value="blog">Blog Articles</option>
                  <option value="partners">Partners & Insurers</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  setPreviewUrl('');
                }}
                className="px-4 py-2.5 text-xs text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="bg-[#C7A76C] hover:bg-[#dfc593] text-[#10243A] text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <UploadCloud className="w-4 h-4 animate-bounce" />
                    <span>Uploading to Cloudinary...</span>
                  </>
                ) : (
                  <span>Upload & Save Asset</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading media items...</div>
      ) : media.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#10243A]/5 text-[#C7A76C] flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#10243A]">No Media Uploaded Yet</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Upload images to Cloudinary or register external Unsplash URLs to use them throughout your site.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-6 bg-[#10243A] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-[#1b3858] transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#C7A76C]" />
            Upload First Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {media.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-slate-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.url}
                    alt={item.altText || item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span className="absolute top-2 left-2 bg-[#10243A]/80 backdrop-blur-sm text-[#C7A76C] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                    {item.category || 'general'}
                  </span>
                  {item.publicId && (
                    <span className="absolute top-2 right-2 bg-emerald-950/80 backdrop-blur-sm text-emerald-300 text-[9px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Cloud className="w-2.5 h-2.5" /> Cloudinary
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h4 className="text-xs font-bold text-[#10243A] truncate" title={item.filename}>
                    {item.filename}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 truncate" title={item.url}>
                    {item.url}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyToClipboard(item.url, item._id)}
                    className="p-1.5 hover:text-[#10243A] hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                    title="Copy Image URL"
                  >
                    {copiedId === item._id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:text-[#10243A] hover:bg-slate-100 rounded-lg transition-colors"
                    title="Open original"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
