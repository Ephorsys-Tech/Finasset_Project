'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageSquareQuote,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  Upload,
  RefreshCw,
  Eye,
  User,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useTestimonialStore } from '@/store/useTestimonialStore';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import apiClient from '@/lib/axios';

/**
 * Default SVG Illustrated Avatar matching reference design
 */
function DefaultIllustratedAvatar() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#F59E0B" />
      <path
        d="M28 42C28 28 36 20 50 20C64 20 72 28 72 42C72 46 70 50 68 52C66 45 64 36 50 36C36 36 34 45 32 52C30 50 28 46 28 42Z"
        fill="#1E293B"
      />
      <ellipse cx="50" cy="52" rx="18" ry="20" fill="#FDE68A" />
      <circle cx="31" cy="52" r="4" fill="#FDE68A" />
      <circle cx="69" cy="52" r="4" fill="#FDE68A" />
      <path d="M32 40C32 44 34 48 34 48" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <path d="M68 40C68 44 66 48 66 48" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 94C24 78 35 72 50 72C65 72 76 78 76 94V100H24V94Z" fill="#FFFFFF" />
      <path d="M44 68H56V74C56 77.3 53.3 80 50 80C46.7 80 44 77.3 44 74V68Z" fill="#FCD34D" />
      <polygon points="42,74 50,78 46,84" fill="#E2E8F0" />
      <polygon points="58,74 50,78 54,84" fill="#E2E8F0" />
      <polygon points="50,78 47,82 48,98 52,98 53,82" fill="#EF4444" />
    </svg>
  );
}

export default function AdminTestimonialsPage() {
  const {
    testimonials,
    isLoading,
    isSaving,
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
  } = useTestimonialStore();

  const [editingItem, setEditingItem] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeletingTarget, setIsDeletingTarget] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const avatarInputRef = useRef(null);

  // Fetch testimonials via Zustand + Axios on initial mount
  useEffect(() => {
    fetchTestimonials(true);
  }, [fetchTestimonials]);

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleOpenNew = () => {
    setIsNew(true);
    setPreviewAvatar('');
    setEditingItem({
      clientName: '',
      designation: 'Software Engineer',
      location: 'Bhubaneswar, Odisha',
      reviewText: '',
      rating: 5,
      avatarUrl: '',
      avatarPublicId: '',
      serviceUsed: 'Wealth Advisory & Financial Planning',
      order: testimonials.length,
      isPublished: true,
    });
  };

  const handleOpenEdit = (t) => {
    setIsNew(false);
    setPreviewAvatar(t.avatarUrl || '');
    setEditingItem({
      ...t,
      reviewText: t.reviewText || t.quote || '',
      avatarUrl: t.avatarUrl || '',
      avatarPublicId: t.avatarPublicId || '',
      rating: t.rating || 5,
      isPublished: t.isPublished !== undefined ? t.isPublished : true,
    });
  };

  // Avatar Upload via Cloudinary using Axios
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Avatar size should be under 5MB');
      return;
    }

    // Temporary local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewAvatar(localUrl);
    setIsUploading(true);

    try {
      const dataUri = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await apiClient.post('/api/v1/admin/market-news/upload', {
        file: dataUri,
        filename: file.name,
      });

      const result = response.data?.data;
      if (result?.imageUrl) {
        setEditingItem((prev) => ({
          ...prev,
          avatarUrl: result.imageUrl,
          avatarPublicId: result.publicId || '',
        }));
        setPreviewAvatar(result.imageUrl);
        showToast('success', 'Avatar uploaded successfully');
      }
    } catch (err) {
      showToast('error', `Avatar upload failed: ${err.message}`);
      setPreviewAvatar(editingItem?.avatarUrl || '');
    } finally {
      setIsUploading(false);
    }
  };

  // Save / Submit Testimonial using Zustand + Axios
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingItem.clientName?.trim()) {
      showToast('error', 'Client Name is required');
      return;
    }
    if (!editingItem.reviewText?.trim()) {
      showToast('error', 'Review text is required');
      return;
    }

    const payload = {
      clientName: editingItem.clientName.trim(),
      designation: (editingItem.designation || 'Valued Client').trim(),
      location: (editingItem.location || 'Bhubaneswar, Odisha').trim(),
      reviewText: editingItem.reviewText.trim(),
      quote: editingItem.reviewText.trim(),
      rating: Number(editingItem.rating || 5),
      avatarUrl: (editingItem.avatarUrl || '').trim(),
      avatarPublicId: editingItem.avatarPublicId || '',
      serviceUsed: (editingItem.serviceUsed || 'Wealth Advisory').trim(),
      order: Number(editingItem.order || 0),
      isPublished: Boolean(editingItem.isPublished),
    };

    try {
      if (isNew) {
        await createTestimonial(payload);
        showToast('success', 'New testimonial added successfully!');
      } else {
        await updateTestimonial(editingItem._id || editingItem.id, payload);
        showToast('success', 'Testimonial updated successfully!');
      }
      setEditingItem(null);
    } catch (err) {
      showToast('error', `Failed to save testimonial: ${err.message}`);
    }
  };

  // Delete Testimonial
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeletingTarget(true);
    try {
      await deleteTestimonial(deleteTarget.id);
      showToast('success', 'Testimonial deleted successfully');
      setDeleteTarget(null);
    } catch (err) {
      showToast('error', `Error deleting testimonial: ${err.message}`);
    } finally {
      setIsDeletingTarget(false);
    }
  };

  const previewItem = testimonials[activePreviewIndex] || testimonials[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-xs font-bold transition-all transform animate-in fade-in slide-in-from-top-4 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900/95 text-emerald-100 border-emerald-500/50 backdrop-blur-md'
              : 'bg-rose-900/95 text-rose-100 border-rose-500/50 backdrop-blur-md'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:opacity-75 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#10243A] via-[#163352] to-[#10243A] p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-700/50">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-[#C7A76C]/20 border border-[#C7A76C]/30 text-[#E4CB95] text-[11px] font-bold uppercase tracking-wider">
              Client Trust & Social Proof
            </span>
            <span className="text-slate-400 text-xs">• Auto-Moving Slider Connected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Client Testimonials Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Curate authenticated investor reviews, designations, and profile avatars. Stories automatically rotate in intervals on the public website.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
          <button
            onClick={() => fetchTestimonials(true)}
            disabled={isLoading}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-3 rounded-2xl transition-all flex items-center gap-2 border border-white/15"
            title="Refresh testimonials"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleOpenNew}
            className="bg-gradient-to-r from-[#C7A76C] to-[#b39257] hover:brightness-110 text-[#10243A] text-xs font-extrabold uppercase tracking-wider px-5 py-3 rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-black/20"
          >
            <Plus className="w-4 h-4 text-[#10243A] stroke-[3]" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Interactive Live Homepage Slider Card Preview */}
      {previewItem && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#2376b8]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#10243A]">
                Live Website Pattern Preview (Slide {activePreviewIndex + 1} of {testimonials.length})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setActivePreviewIndex(
                    (activePreviewIndex - 1 + testimonials.length) % testimonials.length
                  )
                }
                className="p-1.5 rounded-lg border hover:bg-slate-50 text-slate-600"
                title="Previous slide preview"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActivePreviewIndex((activePreviewIndex + 1) % testimonials.length)
                }
                className="p-1.5 rounded-lg border hover:bg-slate-50 text-slate-600"
                title="Next slide preview"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scaled Preview Box Replicating Exact Reference Layout */}
          <div className="bg-[#f8fafc] rounded-2xl p-6 sm:p-10 border border-slate-200/70 text-center relative max-w-3xl mx-auto shadow-inner">
            <h3 className="text-xl sm:text-2xl font-bold text-[#2376b8] tracking-tight">
              Client Testimonials
            </h3>
            <div className="w-12 h-1 bg-[#2376b8] mx-auto mt-2 rounded-full" />

            <div className="mt-6 space-y-4">
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
                &quot;{previewItem.reviewText || previewItem.quote}&quot;
              </p>

              <div>
                <h4 className="font-bold text-base text-[#10243A] tracking-tight">
                  {previewItem.clientName}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {previewItem.designation}
                </p>
              </div>

              <div className="w-20 h-20 rounded-full border-4 border-white shadow-md mx-auto mt-4 overflow-hidden bg-amber-100 flex items-center justify-center">
                {previewItem.avatarUrl ? (
                  <img
                    src={previewItem.avatarUrl}
                    alt={previewItem.clientName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <DefaultIllustratedAvatar />
                )}
              </div>

              {/* Dots indicator */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePreviewIndex(idx)}
                    className={`transition-all rounded-full ${
                      idx === activePreviewIndex
                        ? 'w-5 h-2 bg-[#8ea83e]'
                        : 'w-2 h-2 bg-[#8ea83e]/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Listing Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-[#10243A]">
              All Published Reviews ({testimonials.length})
            </h3>
            <p className="text-xs text-slate-500">
              Click edit to modify testimonial content, client role, and avatar.
            </p>
          </div>
          <span className="text-xs font-bold text-[#2376b8] bg-[#2376b8]/10 px-3 py-1 rounded-full border border-[#2376b8]/20">
            Auto-Rotation Active
          </span>
        </div>

        {testimonials.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No testimonials found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by adding your first authenticated investor testimonial.
            </p>
            <button
              onClick={handleOpenNew}
              className="bg-[#10243A] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#C7A76C]" />
              <span>Add Testimonial</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={t._id || idx}
                className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                        t.isPublished
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {t.isPublished ? 'Published' : 'Hidden'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed line-clamp-4">
                    &quot;{t.reviewText || t.quote}&quot;
                  </p>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-200/60">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-amber-100 shrink-0 flex items-center justify-center">
                      {t.avatarUrl ? (
                        <img
                          src={t.avatarUrl}
                          alt={t.clientName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <DefaultIllustratedAvatar />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#10243A] truncate">
                        {t.clientName}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {t.designation || 'Client'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {t.location || 'Bhubaneswar'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setActivePreviewIndex(idx)}
                    className="text-[11px] font-bold text-[#2376b8] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Preview in Slider</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(t)}
                      className="p-2 text-slate-600 hover:text-[#10243A] hover:bg-slate-100 rounded-xl transition-colors"
                      title="Edit Testimonial"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ id: t._id || t.id, name: t.clientName })}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2376b8]/10 text-[#2376b8] flex items-center justify-center">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base sm:text-lg text-[#10243A]">
                    {isNew ? 'Create New Testimonial' : 'Edit Client Testimonial'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Will display in the animated client slider with name, role, and avatar.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-4 text-xs">
              {/* Client Name & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-extrabold text-[#10243A] uppercase tracking-wider text-[11px]">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Singhal"
                    value={editingItem.clientName}
                    onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2376b8]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-extrabold text-[#10243A] uppercase tracking-wider text-[11px]">
                    Designation / Occupation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer"
                    value={editingItem.designation}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, designation: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2376b8]/20"
                  />
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-1.5">
                <label className="block font-extrabold text-[#10243A] uppercase tracking-wider text-[11px]">
                  Review Text / Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="It was a great experience to be associated with Finasset Wealth..."
                  value={editingItem.reviewText}
                  onChange={(e) => setEditingItem({ ...editingItem, reviewText: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-slate-800 leading-relaxed focus:bg-white focus:ring-2 focus:ring-[#2376b8]/20"
                />
              </div>

              {/* Avatar Section */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <label className="block font-extrabold text-[#10243A] uppercase tracking-wider text-[11px]">
                  Client Avatar Image (Upload or Direct URL)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Avatar Preview */}
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-amber-100 shrink-0 flex items-center justify-center">
                    {previewAvatar || editingItem.avatarUrl ? (
                      <img
                        src={previewAvatar || editingItem.avatarUrl}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <DefaultIllustratedAvatar />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-1.5 shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? 'Uploading...' : 'Upload Avatar'}</span>
                      </button>
                      {(previewAvatar || editingItem.avatarUrl) && (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewAvatar('');
                            setEditingItem({ ...editingItem, avatarUrl: '', avatarPublicId: '' });
                          }}
                          className="px-3 py-2 rounded-xl text-rose-600 font-bold hover:bg-rose-50"
                        >
                          Use Default
                        </button>
                      )}
                    </div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      className="hidden"
                    />
                    <input
                      type="url"
                      placeholder="Or paste avatar image URL (https://...)"
                      value={editingItem.avatarUrl || ''}
                      onChange={(e) => {
                        setEditingItem({ ...editingItem, avatarUrl: e.target.value });
                        setPreviewAvatar(e.target.value);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Star Rating, Location, Published Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-extrabold text-[#10243A] uppercase mb-1 text-[11px]">
                    Rating (Stars)
                  </label>
                  <select
                    value={editingItem.rating || 5}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, rating: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-bold text-slate-800"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-[#10243A] uppercase mb-1 text-[11px]">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingItem.location || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-bold text-slate-800"
                    placeholder="Bhubaneswar, Odisha"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-[#10243A] uppercase mb-1 text-[11px]">
                    Status
                  </label>
                  <select
                    value={editingItem.isPublished ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isPublished: e.target.value === 'true' })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-bold text-slate-800"
                  >
                    <option value="true">Published (Live)</option>
                    <option value="false">Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-100 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="bg-gradient-to-r from-[#10243A] to-[#1c3c5f] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider px-7 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-[#C7A76C]" />
                  <span>
                    {isSaving
                      ? 'Saving...'
                      : isNew
                      ? 'Add Testimonial'
                      : 'Update Testimonial'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !isDeletingTarget && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Testimonial"
        itemName={deleteTarget?.name}
        message="Are you sure you want to delete this investor testimonial? This action cannot be undone."
        warningDetails="This review will be permanently removed from the website and the automated testimonial carousel."
        confirmText="Yes, Delete Testimonial"
        isDeleting={isDeletingTarget}
      />
    </div>
  );
}
