'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Layers,
  UploadCloud,
  Loader2,
  RefreshCw,
  Sparkles,
  Check,
} from 'lucide-react';
import { useHeroStore } from '@/store/useHeroStore';

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
  const {
    slides,
    isLoading,
    isUploading,
    isSaving,
    isDeleting,
    error: storeError,
    success: storeSuccess,
    fetchSlides,
    uploadImage,
    deleteUploadedImage,
    createSlide,
    updateSlide,
    deleteSlide,
    clearMessages,
  } = useHeroStore();

  const [editingSlide, setEditingSlide] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localMsg, setLocalMsg] = useState({ type: '', text: '' });
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  // Sync store feedback messages
  useEffect(() => {
    if (storeSuccess) {
      setLocalMsg({ type: 'success', text: storeSuccess });
      const timer = setTimeout(() => {
        setLocalMsg({ type: '', text: '' });
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (storeError) {
      setLocalMsg({ type: 'error', text: storeError });
    }
  }, [storeSuccess, storeError, clearMessages]);

  const handleOpenNew = () => {
    setIsNew(true);
    setLocalMsg({ type: '', text: '' });
    setEditingSlide({
      title: 'Grow Your Wealth With Smart Financial Planning',
      subtitle:
        'Personalized portfolio management and mutual fund strategies designed to secure your long-term goals.',
      bgImageUrl: '',
      publicId: '',
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
    setLocalMsg({ type: '', text: '' });
    setEditingSlide({
      ...slide,
      bgImageUrl: slide.bgImageUrl || slide.imageUrl || slide.bgImage || '',
      publicId: slide.publicId || '',
    });
  };

  // Upload image to Cloudinary via Zustand store
  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      setLocalMsg({
        type: 'error',
        text: 'Please select a valid image file (PNG, JPG, JPEG, WEBP, SVG).',
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setLocalMsg({
        type: 'error',
        text: 'Image file size must be less than 10MB.',
      });
      return;
    }

    setLocalMsg({ type: '', text: '' });
    try {
      const result = await uploadImage(file);
      setEditingSlide((prev) => ({
        ...prev,
        bgImageUrl: result.imageUrl,
        imageUrl: result.imageUrl,
        publicId: result.publicId || '',
      }));
      setLocalMsg({
        type: 'success',
        text: 'New banner image uploaded to Cloudinary successfully!',
      });
    } catch (err) {
      setLocalMsg({
        type: 'error',
        text: err.message || 'Failed to upload image to Cloudinary.',
      });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDropFile = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveImage = async () => {
    if (isUploading) return;
    if (editingSlide?.publicId) {
      try {
        await deleteUploadedImage(editingSlide.publicId);
      } catch (err) {
        console.warn('Failed to delete temp Cloudinary image:', err);
      }
    }
    setEditingSlide((prev) => ({
      ...prev,
      bgImageUrl: '',
      imageUrl: '',
      publicId: '',
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isUploading || isSaving) return;
    setLocalMsg({ type: '', text: '' });

    const bannerImage = (editingSlide.bgImageUrl || editingSlide.imageUrl || '').trim();
    if (!bannerImage) {
      setLocalMsg({
        type: 'error',
        text: 'Please upload a background banner image for this hero slide.',
      });
      return;
    }

    try {
      const payload = {
        title: editingSlide.title.trim(),
        subtitle: (editingSlide.subtitle || editingSlide.description || '').trim(),
        bgImageUrl: bannerImage,
        imageUrl: bannerImage,
        publicId: editingSlide.publicId || '',
        order: Number(editingSlide.order) || 1,
        isActive: editingSlide.isActive !== false,
        cta1Text: 'Our Services',
        cta1Url: '#services',
        cta2Text: 'Contact Us',
        cta2Url: '#contact',
        badge: 'Finasset Wealth Management',
      };

      if (isNew) {
        await createSlide(payload);
        setLocalMsg({ type: 'success', text: 'Hero banner created successfully!' });
      } else {
        const id = editingSlide._id || editingSlide.id;
        await updateSlide(id, payload);
        setLocalMsg({ type: 'success', text: 'Hero banner updated successfully!' });
      }

      setEditingSlide(null);
      await fetchSlides();
    } catch (err) {
      setLocalMsg({ type: 'error', text: err.message || 'Error saving hero slide' });
    }
  };

  // Delete hero slide by ID and destroy associated Cloudinary image
  const handleDelete = async (slide) => {
    const id = slide._id || slide.id;
    const title = slide.title || 'Untitled Slide';

    if (!id) {
      setLocalMsg({ type: 'error', text: 'Missing slide ID for deletion.' });
      return;
    }

    const confirmDelete = confirm(
      `Delete hero banner: "${title}"?\n\nThis will permanently delete this slide from the database and automatically remove its background image from Cloudinary.`
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await deleteSlide(id);
      setLocalMsg({
        type: 'success',
        text: `Slide "${title}" and associated Cloudinary image deleted successfully.`,
      });
      await fetchSlides();
    } catch (err) {
      setLocalMsg({ type: 'error', text: err.message || 'Error deleting slide.' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10243A]">
            Hero Section Slider Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your homepage hero banners: Upload background images, customize headings, and control live slide ordering.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchSlides()}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            title="Refresh Slides"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#2376b8]' : ''}`} />
          </button>
          <button
            onClick={handleOpenNew}
            className="bg-[#2376b8] hover:bg-[#1a5b8f] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-[#2376b8]/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Hero Slide</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {localMsg.text && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 transition-all shadow-sm ${
            localMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {localMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{localMsg.text}</span>
          </div>
          <button
            onClick={() => setLocalMsg({ type: '', text: '' })}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-[#f0f6fb] border border-[#2376b8]/20 rounded-2xl p-4 text-xs text-[#2376b8] flex items-center gap-3">
        <Layers className="w-5 h-5 shrink-0" />
        <span>
          <strong>Admin Hero Slider Management:</strong> All hero slides displayed on your homepage are provided and managed directly by you. Upload high-res images directly (PNG, JPG, WEBP, SVG). When a slide is deleted, its image on Cloudinary is automatically destroyed by ID.
        </span>
      </div>

      {/* Loading Skeleton */}
      {isLoading && slides.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4">
              <div className="h-52 bg-slate-200 rounded-2xl" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && slides.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#2376b8]/10 text-[#2376b8] flex items-center justify-center">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#10243A]">No Hero Slides Configured</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Your homepage hero slider currently has no active slides. Upload your first high-resolution banner image and configure custom titles.
          </p>
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 bg-[#2376b8] hover:bg-[#1a5b8f] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Upload First Hero Banner</span>
          </button>
        </div>
      )}

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((s, index) => {
          const imgUrl = s.bgImageUrl || s.imageUrl || s.bgImage;
          const isCloudinary = imgUrl && (imgUrl.includes('cloudinary') || Boolean(s.publicId));
          const isThisDeleting = deletingId === (s._id || s.id);

          return (
            <div
              key={s._id || s.id || index}
              className={`bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all ${
                isThisDeleting ? 'opacity-40 pointer-events-none' : ''
              }`}
            >
              {imgUrl ? (
                <div className="h-56 bg-slate-900 relative overflow-hidden group">
                  <img src={imgUrl} alt={s.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-[#080c10]/85 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded backdrop-blur-sm border border-white/10">
                      Order #{s.order ?? index + 1}
                    </span>
                    {isCloudinary && (
                      <span className="bg-[#2376b8]/90 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-white" />
                        Cloudinary
                      </span>
                    )}
                  </div>
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
              ) : (
                <div className="h-44 bg-slate-100 flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center">
                  <ImageIcon className="w-8 h-8 stroke-1 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500">No banner image uploaded</span>
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="text-[11px] text-[#2376b8] hover:underline font-bold"
                  >
                    Upload image now
                  </button>
                </div>
              )}

              <div className="p-6 space-y-3.5">
                <div className="bg-slate-950 p-4 rounded-2xl">
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
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {s.subtitle || s.description || 'No description provided'}
                  </p>
                </div>

                {s.publicId && (
                  <div className="text-[10px] text-slate-400 font-mono truncate bg-slate-50 p-2 rounded-lg border border-slate-100">
                    Cloudinary Public ID: <span className="text-slate-700 font-semibold">{s.publicId}</span>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/70">
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#2376b8]/10 text-[#2376b8] font-bold text-[10px]">
                    Our Services
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#89b441]/10 text-[#89b441] font-bold text-[10px]">
                    Contact Us
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-2 text-slate-600 hover:text-[#2376b8] hover:bg-[#2376b8]/10 rounded-xl transition-colors"
                    title="Edit Slide"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s)}
                    disabled={isDeleting || isThisDeleting}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"
                    title="Delete Slide & Cloudinary Image"
                  >
                    {isThisDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Create Modal */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto border border-slate-100 relative my-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-extrabold text-xl text-[#10243A]">
                  {isNew ? 'Create New Hero Banner Slide' : 'Edit Hero Banner Slide'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload background image directly to Cloudinary, set title highlights and display order
                </p>
              </div>
              <button
                type="button"
                disabled={isUploading || isSaving}
                onClick={() => setEditingSlide(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              {/* 1. TITLE */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#10243A] uppercase tracking-wider">
                    Title Heading *
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#2376b8] transition-colors"
                  placeholder="e.g. Grow Your Wealth With Smart Financial Planning"
                />

                {/* Live Color Highlight Preview */}
                <div className="mt-2.5 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Live Highlight Preview:
                  </div>
                  <div className="text-base sm:text-lg font-extrabold">
                    {renderLivePreview(editingSlide.title)}
                  </div>
                </div>
              </div>

              {/* 2. SUB-TITLE */}
              <div>
                <label className="block font-bold text-[#10243A] uppercase tracking-wider mb-1.5">
                  Sub-title Description *
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#2376b8] transition-colors leading-relaxed"
                  placeholder="e.g. Personalized portfolio management and mutual fund strategies designed to secure your long-term goals."
                />
              </div>

              {/* 3. BANNER IMAGE FILE UPLOAD WITH PROPER LOADER & DISAPPEARING REPLACE BUTTON */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#10243A] uppercase tracking-wider flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-[#2376b8]" />
                    <span>Background Banner Image (Upload) *</span>
                  </label>
                  {isUploading && (
                    <span className="text-[11px] text-[#2376b8] font-bold flex items-center gap-1.5 animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading to Cloudinary...
                    </span>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/jpg"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* If an image is selected/uploaded, show preview container */}
                {editingSlide.bgImageUrl || editingSlide.imageUrl ? (
                  <div className="space-y-3">
                    <div className="h-52 sm:h-60 rounded-2xl overflow-hidden border border-slate-200 relative group bg-slate-950 shadow-inner">
                      <img
                        src={editingSlide.bgImageUrl || editingSlide.imageUrl}
                        alt="Hero Banner Preview"
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          isUploading ? 'opacity-20 filter blur-sm scale-105' : 'opacity-100'
                        }`}
                      />

                      {/* LOADER OVERLAY: Shown prominently when isUploading is true */}
                      {isUploading ? (
                        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 transition-all">
                          <div className="w-14 h-14 rounded-2xl bg-[#2376b8]/20 border border-[#2376b8]/40 flex items-center justify-center mb-3 shadow-lg shadow-[#2376b8]/20 animate-pulse">
                            <Loader2 className="w-7 h-7 text-[#2376b8] animate-spin" />
                          </div>
                          <div className="text-white text-sm font-bold flex items-center gap-2">
                            <span>Uploading Replacement Image...</span>
                          </div>
                          <p className="text-slate-300 text-[11px] mt-1 max-w-xs leading-relaxed">
                            Uploading directly to Cloudinary and optimizing resolution. Please wait...
                          </p>
                          <div className="w-52 h-1.5 bg-slate-800 rounded-full mt-3.5 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#2376b8] via-[#89b441] to-[#f87b1f] animate-pulse rounded-full w-full" />
                          </div>
                        </div>
                      ) : (
                        /* NORMAL ACTIONS OVERLAY: Shown only when NOT uploading */
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20 flex flex-col justify-between p-4 z-10">
                          <div className="flex items-center justify-between gap-2">
                            <span className="bg-emerald-500/95 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md backdrop-blur-sm flex items-center gap-1 shadow-sm">
                              <CheckCircle2 className="w-3 h-3" />
                              {editingSlide.publicId ? 'Hosted on Cloudinary' : 'Banner Selected'}
                            </span>
                            {editingSlide.publicId && (
                              <span className="text-[10px] text-slate-200 font-mono truncate max-w-[200px] bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                                ID: {editingSlide.publicId.split('/').pop()}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-white/95 hover:bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-xl shadow-md backdrop-blur transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <UploadCloud className="w-3.5 h-3.5 text-[#2376b8]" />
                              <span>Replace Image</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="bg-rose-500/90 hover:bg-rose-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md backdrop-blur transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Upload Dropzone when no image yet */
                  <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (!isUploading) setIsDragOver(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                    }}
                    onDrop={handleDropFile}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                      isUploading
                        ? 'border-[#2376b8] bg-[#2376b8]/5 cursor-wait'
                        : isDragOver
                        ? 'border-[#2376b8] bg-[#2376b8]/10 scale-[0.99] cursor-pointer'
                        : 'border-slate-300 hover:border-[#2376b8] bg-slate-50 hover:bg-slate-100/70 cursor-pointer'
                    }`}
                  >
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#2376b8]/10 text-[#2376b8] flex items-center justify-center">
                      {isUploading ? (
                        <Loader2 className="w-7 h-7 animate-spin text-[#2376b8]" />
                      ) : (
                        <UploadCloud className="w-7 h-7" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      {isUploading
                        ? 'Uploading to Cloudinary...'
                        : 'Click or drag image file here to upload'}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                      PNG, JPG, JPEG, WEBP, or SVG up to 10MB. Stored and optimized automatically on Cloudinary.
                    </p>
                  </div>
                )}
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#2376b8] transition-colors"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:border-[#2376b8] transition-colors"
                  >
                    <option value="true">Active (Visible on Homepage)</option>
                    <option value="false">Disabled (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Fixed Buttons Info */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-[11px] flex items-center justify-between">
                <span>
                  Fixed CTAs: <strong>Our Services</strong> (#services) &amp; <strong>Contact Us</strong> (#contact)
                </span>
                <span className="text-[#89b441] font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Configured
                </span>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={isSaving || isUploading}
                  onClick={() => setEditingSlide(null)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold disabled:opacity-40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="bg-[#2376b8] hover:bg-[#1a5b8f] text-white font-bold px-7 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Slide...</span>
                    </>
                  ) : isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading Image...</span>
                    </>
                  ) : (
                    <span>Save Slide</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
