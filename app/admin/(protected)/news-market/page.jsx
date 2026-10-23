'use client';

import { useState, useEffect, useRef } from 'react';
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
  Upload,
  Image as ImageIcon,
  Eye,
  Calendar,
  Tag as TagIcon,
  FileText,
  Bookmark,
  RefreshCw,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useNewsStore } from '@/store/useNewsStore';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

// Common Tag Recommendations
const TAG_SUGGESTIONS = [
  // 'Tax Alert',
  // 'Market Alert',
  // 'IPO Alert',
  // 'Macro Economy',
  // 'Mutual Funds',
  // 'Wealth Advisory',
  // 'Fixed Income',
];

// Common Sub-Tag Recommendations
const SUB_TAG_SUGGESTIONS = [
  // 'Tax & Compliance Desk',
  // 'Finasset Research Desk',
  // 'AMFI Monthly Bulletin',
  // 'Equity Advisory Desk',
  // 'Primary Markets Desk',
  // 'Commodities Advisory',
];

// Helper to format ISO date (YYYY-MM-DD) to "11 Jan, 2025" (Date with year, not time)
function formatDateToDisplay(isoString) {
  if (!isoString) return '';
  try {
    const parts = isoString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    const d = new Date(isoString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  } catch {
    // fallback
  }
  return isoString;
}

// Convert "11 Jan, 2025" or Date string to "YYYY-MM-DD" for HTML date input
function toDateInputValue(str) {
  if (!str) {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  try {
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
  } catch {
    // fallback
  }
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export default function AdminNewsMarketPage() {
  const {
    newsItems,
    indices,
    isLoading,
    isSaving,
    isUploading,
    fetchNews,
    createNews,
    updateNews,
    deleteNews,
    uploadImage,
    deleteImage,
  } = useNewsStore();

  const [editingNews, setEditingNews] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeletingTarget, setIsDeletingTarget] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch data on initial mount using Zustand + Axios
  useEffect(() => {
    fetchNews(true);
  }, [fetchNews]);

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleOpenNew = () => {
    setIsNew(true);
    setFormErrors({});
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    setImagePreview('');
    setEditingNews({
      title: '',
      description: '',
      tag: 'Tax Alert',
      subTag: 'Tax & Compliance Desk',
      date: formattedDate,
      rawDate: today.toISOString().split('T')[0],
      readTime: '3 min Read',
      imageUrl: '',
      imagePublicId: '',
      tab: 'market',
      isPublished: true,
      isFeatured: false,
      order: newsItems.length,
    });
  };

  const handleOpenEdit = (item) => {
    setIsNew(false);
    setFormErrors({});
    const displayDate = item.date || formatDateToDisplay(item.publishedAt) || '11 Jan, 2025';
    setImagePreview(item.imageUrl || '');
    setEditingNews({
      ...item,
      title: item.title || '',
      description: item.description || item.summary || '',
      tag: item.tag || item.badge || 'Tax Alert',
      subTag: item.subTag || item.source || 'Tax & Compliance Desk',
      date: displayDate,
      rawDate: toDateInputValue(item.date || item.publishedAt),
      readTime: item.readTime || '3 min Read',
      imageUrl: item.imageUrl || '',
      imagePublicId: item.imagePublicId || '',
      tab: item.tab || 'market',
      isPublished: item.isPublished !== undefined ? item.isPublished : true,
      isFeatured: Boolean(item.isFeatured),
    });
  };

  // Image Upload Handler using Cloudinary through Axios
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormErrors((prev) => ({ ...prev, image: 'Please select a valid image file (PNG, JPG, WEBP)' }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormErrors((prev) => ({ ...prev, image: 'Image size exceeds 10MB limit' }));
      return;
    }

    // Set temporary local preview
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setFormErrors((prev) => ({ ...prev, image: null }));

    try {
      const result = await uploadImage(file);
      if (result?.imageUrl) {
        setEditingNews((prev) => ({
          ...prev,
          imageUrl: result.imageUrl,
          imagePublicId: result.publicId || '',
          publicUrl: result.publicUrl || result.imageUrl,
        }));
        setImagePreview(result.imageUrl);
        showToast('success', 'Image successfully uploaded to Cloudinary');
      }
    } catch (err) {
      showToast('error', `Cloudinary upload failed: ${err.message}`);
      setImagePreview(editingNews?.imageUrl || '');
    }
  };

  // Remove current image
  const handleRemoveImage = async () => {
    if (editingNews?.imagePublicId && isNew) {
      // If we just uploaded it in a new draft, clean it up from Cloudinary
      await deleteImage(editingNews.imagePublicId);
    }
    setImagePreview('');
    setEditingNews((prev) => ({
      ...prev,
      imageUrl: '',
      imagePublicId: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Date Change Handler: syncs rawDate and formatted date with year, no time
  const handleDateChange = (isoVal) => {
    const formatted = formatDateToDisplay(isoVal);
    setEditingNews((prev) => ({
      ...prev,
      rawDate: isoVal,
      date: formatted,
    }));
  };

  // Read Time Change Handler
  const handleReadTimeChange = (val) => {
    let clean = val;
    // If user enters just digits, append "min Read"
    if (/^\d+$/.test(val.trim())) {
      clean = `${val.trim()} min Read`;
    }
    setEditingNews((prev) => ({
      ...prev,
      readTime: clean,
    }));
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!editingNews.title?.trim()) {
      errors.title = 'Headline title is required';
    } else if (editingNews.title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }

    if (!editingNews.description?.trim()) {
      errors.description = 'Description / summary is required';
    } else if (editingNews.description.trim().length < 15) {
      errors.description = 'Description should be at least 15 characters';
    }

    if (!editingNews.tag?.trim()) {
      errors.tag = 'Tag is required (e.g., "Tax Alert")';
    }

    if (!editingNews.subTag?.trim()) {
      errors.subTag = 'Sub-tag is required (e.g., "Tax & Compliance Desk")';
    }

    if (!editingNews.date?.trim()) {
      errors.date = 'Date with year is required';
    }

    if (!editingNews.readTime?.trim()) {
      errors.readTime = 'Read time is required (e.g., "3 min Read")';
    }

    if (!editingNews.imageUrl?.trim()) {
      errors.image = 'An image is required. Please upload to Cloudinary.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save / Submit
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('error', 'Please resolve all required fields before saving.');
      return;
    }

    const payload = {
      title: editingNews.title.trim(),
      description: editingNews.description.trim(),
      summary: editingNews.description.trim(),
      tag: editingNews.tag.trim(),
      badge: editingNews.tag.trim(),
      subTag: editingNews.subTag.trim(),
      source: editingNews.subTag.trim(),
      date: editingNews.date.trim(),
      readTime: editingNews.readTime.trim(),
      imageUrl: editingNews.imageUrl.trim(),
      imagePublicId: editingNews.imagePublicId || '',
      tab: editingNews.tab || 'market',
      isPublished: Boolean(editingNews.isPublished),
      isFeatured: Boolean(editingNews.isFeatured),
      order: Number(editingNews.order || 0),
    };

    try {
      if (isNew) {
        await createNews(payload);
        showToast('success', 'News story successfully published to website!');
      } else {
        await updateNews(editingNews._id || editingNews.id, payload);
        showToast('success', 'News story updated successfully!');
      }
      setEditingNews(null);
    } catch (err) {
      showToast('error', `Failed to save news: ${err.message}`);
    }
  };

  // Delete Item Confirmation Handler
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeletingTarget(true);
    try {
      await deleteNews(deleteTarget.id);
      showToast('success', 'News item and its Cloudinary remote asset deleted successfully');
      setDeleteTarget(null);
    } catch (err) {
      showToast('error', `Error deleting item: ${err.message}`);
    } finally {
      setIsDeletingTarget(false);
    }
  };

  // Filtered news items
  const filteredNews = newsItems.filter((item) => {
    if (activeTabFilter === 'all') return true;
    return item.tab === activeTabFilter;
  });

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
              Editorial & Market Feed Management
            </span>
            <span className="text-slate-400 text-xs">• Cloudinary Synchronized</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            News Feed & Market Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Create, curate, and optimize headline stories with high-resolution Cloudinary imagery, category tags, reading times, and financial advisory commentary.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
          <button
            onClick={() => fetchNews(true)}
            disabled={isLoading}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-3 rounded-2xl transition-all flex items-center gap-2 border border-white/15"
            title="Refresh news from database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleOpenNew}
            className="bg-gradient-to-r from-[#C7A76C] to-[#b39257] hover:brightness-110 text-[#10243A] text-xs font-extrabold uppercase tracking-wider px-5 py-3 rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-black/20"
          >
            <Plus className="w-4 h-4 text-[#10243A] stroke-[3]" />
            <span>Create News Story</span>
          </button>
        </div>
      </div>

  
      {/* News Items Table / Card Listing */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filteredNews.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No news articles found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by clicking &quot;Create News Story&quot; to publish your first headline story with image, tag, and date.
            </p>
            <button
              onClick={handleOpenNew}
              className="bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#C7A76C]" />
              <span>Create News Story</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                  <th className="py-4 px-6">Story / Image</th>
                  <th className="py-4 px-6">Headline Title & Description</th>
                  <th className="py-4 px-6">Tag & Sub-Tag</th>
                  <th className="py-4 px-6">Date & Read Time</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNews.map((item) => {
                  const displayDate = item.date || formatDateToDisplay(item.publishedAt) || '11 Jan, 2025';
                  const displayTag = item.tag || item.badge || 'Tax Alert';
                  const displaySubTag = item.subTag || item.source || 'Tax & Compliance Desk';
                  const displayReadTime = item.readTime || '3 min Read';
                  const displayImg = item.imageUrl || '';

                  return (
                    <tr key={item._id || item.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Image Thumbnail */}
                      <td className="py-4 px-6">
                        <div className="w-20 h-14 rounded-xl overflow-hidden relative bg-slate-100 border border-slate-200/80 shadow-sm shrink-0 flex items-center justify-center">
                          {displayImg ? (
                            <img
                              src={displayImg}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 p-1">
                              <ImageIcon className="w-4 h-4 text-slate-300" />
                              <span className="text-[9px] font-bold text-slate-400 mt-0.5">No image</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="py-4 px-6 max-w-md">
                        <div className="font-extrabold text-[#10243A] text-sm line-clamp-1 group-hover:text-[#2376b8] transition-colors">
                          {item.title}
                        </div>
                        <p className="text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed">
                          {item.description || item.summary}
                        </p>
                      </td>

                      {/* Tag & Sub-Tag */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-slate-900 text-white font-extrabold text-[10px] tracking-wide shadow-sm">
                            {displayTag}
                          </span>
                          <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{displaySubTag}</span>
                          </div>
                        </div>
                      </td>

                      {/* Date & Read Time */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-bold text-slate-700 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{displayDate}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{displayReadTime}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            item.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.isPublished ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {item.isPublished ? 'Published' : 'Hidden'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 text-slate-600 hover:text-[#10243A] hover:bg-slate-100 rounded-xl transition-all"
                          title="Edit News Article"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: item._id || item.id, title: item.title })}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete from DB & Cloudinary"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {editingNews && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#10243A] to-[#1a385a] px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15">
                  <Bookmark className="w-5 h-5 text-[#C7A76C]" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base sm:text-lg">
                    {isNew ? 'Create News & Market Story' : 'Edit News & Market Story'}
                  </h2>
                  <p className="text-xs text-slate-300">
                    Fields are synchronized with Cloudinary and rendered live on homepage News Feed.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowLivePreview(!showLivePreview)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                    showLivePreview
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{showLivePreview ? 'Hide Preview' : 'Show Preview'}</span>
                </button>
                <button
                  onClick={() => setEditingNews(null)}
                  className="text-slate-300 hover:text-white p-1 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body: Split into Form on Left, Live Preview on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 max-h-[80vh] overflow-y-auto">
              {/* Form Side */}
              <form
                onSubmit={handleSave}
                className={`p-6 sm:p-8 space-y-5 text-xs ${
                  showLivePreview ? 'lg:col-span-7' : 'lg:col-span-12'
                }`}
              >
                {/* 1. Image Upload & Cloudinary Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-[#10243A] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#2376b8]" />
                      <span>Article Cover Image * (Cloudinary Upload)</span>
                    </label>
                    {editingNews.imagePublicId && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Cloudinary Synced</span>
                      </span>
                    )}
                  </div>

                  {/* Image Preview Box & Drag/Drop Area */}
                  <div
                    className={`relative rounded-2xl border-2 border-dashed p-4 transition-all text-center ${
                      formErrors.image
                        ? 'border-rose-300 bg-rose-50/50'
                        : imagePreview
                        ? 'border-emerald-300 bg-slate-50/70'
                        : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-[#2376b8]'
                    }`}
                  >
                    {imagePreview ? (
                      <div className="space-y-3">
                        <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 shadow-sm max-w-md mx-auto group">
                          <img
                            src={imagePreview}
                            alt="News Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow hover:bg-slate-100 transition-all flex items-center gap-1.5"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Replace</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow hover:bg-rose-700 transition-all flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500">
                          {isUploading ? (
                            <span className="flex items-center gap-1.5 text-[#2376b8] font-bold">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading to Cloudinary...</span>
                            </span>
                          ) : (
                            <span>High-resolution cover image uploaded</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="py-6 cursor-pointer space-y-2"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-[#2376b8]/10 text-[#2376b8] flex items-center justify-center mx-auto">
                          {isUploading ? (
                            <RefreshCw className="w-6 h-6 animate-spin" />
                          ) : (
                            <Upload className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs">
                            {isUploading ? 'Uploading to Cloudinary...' : 'Click to upload image or drag & drop'}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            PNG, JPG, WEBP or GIF (Up to 10MB)
                          </p>
                        </div>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Direct Image URL input / display */}
                    <div className="pt-2 text-left">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-600">Image URL / Cloudinary Link:</span>
                        {editingNews.imageUrl && (
                          <span className="text-[10px] text-emerald-600 font-bold">Synced</span>
                        )}
                      </div>
                      <input
                        type="url"
                        placeholder="https://res.cloudinary.com/... or paste image URL"
                        value={editingNews.imageUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingNews((prev) => ({ ...prev, imageUrl: val, publicUrl: val }));
                          setImagePreview(val);
                          if (val.trim()) {
                            setFormErrors((prev) => ({ ...prev, image: null }));
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2376b8]/20"
                      />
                    </div>
                  </div>
                  {formErrors.image && (
                    <p className="text-rose-600 text-[11px] font-bold">{formErrors.image}</p>
                  )}
                </div>

                {/* 2. Tag & Sub-Tag Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tag (Badge Pill) */}
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-[#10243A] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <TagIcon className="w-3.5 h-3.5 text-[#2376b8]" />
                      <span>Tag (Top Badge Pill) *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tax Alert, Market Alert"
                      value={editingNews.tag}
                      onChange={(e) => setEditingNews({ ...editingNews, tag: e.target.value })}
                      className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 font-bold text-slate-800 transition-all focus:bg-white focus:ring-2 focus:ring-[#2376b8]/20 ${
                        formErrors.tag ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {/* Tag Quick Suggestions */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {TAG_SUGGESTIONS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setEditingNews({ ...editingNews, tag: t })}
                          className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all ${
                            editingNews.tag === t
                              ? 'bg-[#10243A] text-white border-[#10243A] font-bold'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    {formErrors.tag && (
                      <p className="text-rose-600 text-[11px] font-bold">{formErrors.tag}</p>
                    )}
                  </div>

                  {/* Sub-Tag */}
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-[#10243A] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sub Tag (Advisory Desk) *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tax & Compliance Desk"
                      value={editingNews.subTag}
                      onChange={(e) => setEditingNews({ ...editingNews, subTag: e.target.value })}
                      className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 font-bold text-slate-800 transition-all focus:bg-white focus:ring-2 focus:ring-[#2376b8]/20 ${
                        formErrors.subTag ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {/* Sub-Tag Suggestions */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {SUB_TAG_SUGGESTIONS.map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setEditingNews({ ...editingNews, subTag: st })}
                          className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all ${
                            editingNews.subTag === st
                              ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                    {formErrors.subTag && (
                      <p className="text-rose-600 text-[11px] font-bold">{formErrors.subTag}</p>
                    )}
                  </div>
                </div>

                {/* 3. Date with Year & Mins of Read */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date with Year, not time */}
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-[#10243A] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#2376b8]" />
                      <span>Date with Year (No Time) *</span>
                    </label>
                    <div className="space-y-1.5">
                      <input
                        type="date"
                        value={editingNews.rawDate || ''}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 font-bold text-slate-800 transition-all focus:bg-white focus:ring-2 focus:ring-[#2376b8]/20 ${
                          formErrors.date ? 'border-rose-400' : 'border-slate-200'
                        }`}
                      />
                      <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between px-1">
                        <span>Display Format:</span>
                        <span className="text-[#10243A] bg-slate-100 px-2 py-0.5 rounded-md font-extrabold">
                          {editingNews.date || 'e.g. 11 Jan, 2025'}
                        </span>
                      </div>
                    </div>
                    {formErrors.date && (
                      <p className="text-rose-600 text-[11px] font-bold">{formErrors.date}</p>
                    )}
                  </div>

                  {/* Mins of Read */}
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-[#10243A] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#2376b8]" />
                      <span>Mins of Read *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3 min Read or 3"
                      value={editingNews.readTime}
                      onChange={(e) => handleReadTimeChange(e.target.value)}
                      className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 font-bold text-slate-800 transition-all focus:bg-white focus:ring-2 focus:ring-[#2376b8]/20 ${
                        formErrors.readTime ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    <div className="flex gap-1.5 pt-1">
                      {['2 min Read', '3 min Read', '4 min Read', '5 min Read'].map((rt) => (
                        <button
                          key={rt}
                          type="button"
                          onClick={() => setEditingNews({ ...editingNews, readTime: rt })}
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                            editingNews.readTime === rt
                              ? 'bg-slate-900 text-white font-bold'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {rt}
                        </button>
                      ))}
                    </div>
                    {formErrors.readTime && (
                      <p className="text-rose-600 text-[11px] font-bold">{formErrors.readTime}</p>
                    )}
                  </div>
                </div>

                {/* 4. Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-[#10243A] uppercase tracking-wider text-[11px]">
                      Headline Title *
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {editingNews.title?.length || 0} characters
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Budget Insights: Capital Gains Tax Structure and Portfolio Optimization"
                    value={editingNews.title}
                    onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                    className={`w-full bg-slate-50 border rounded-2xl px-4 py-3 font-extrabold text-sm text-slate-900 transition-all focus:bg-white focus:ring-2 focus:ring-[#2376b8]/20 ${
                      formErrors.title ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.title && (
                    <p className="text-rose-600 text-[11px] font-bold">{formErrors.title}</p>
                  )}
                </div>

                {/* 5. Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-[#10243A] uppercase tracking-wider text-[11px]">
                      Description / Editorial Breakdown *
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {editingNews.description?.length || 0} characters
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide the comprehensive summary and key takeaways for investors..."
                    value={editingNews.description}
                    onChange={(e) => setEditingNews({ ...editingNews, description: e.target.value })}
                    className={`w-full bg-slate-50 border rounded-2xl p-4 font-normal text-xs text-slate-800 leading-relaxed transition-all focus:bg-white focus:ring-2 focus:ring-[#2376b8]/20 ${
                      formErrors.description ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.description && (
                    <p className="text-rose-600 text-[11px] font-bold">{formErrors.description}</p>
                  )}
                </div>

                {/* 6. Category Tab & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block font-extrabold text-[#10243A] uppercase mb-1 text-[11px]">
                      Category Tab
                    </label>
                    <select
                      value={editingNews.tab}
                      onChange={(e) => setEditingNews({ ...editingNews, tab: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-bold text-slate-800"
                    >
                      <option value="market">Market Desk</option>
                      <option value="popular">Popular News</option>
                      <option value="ipo">IPO Watch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-extrabold text-[#10243A] uppercase mb-1 text-[11px]">
                      Visibility Status
                    </label>
                    <select
                      value={editingNews.isPublished ? 'true' : 'false'}
                      onChange={(e) =>
                        setEditingNews({ ...editingNews, isPublished: e.target.value === 'true' })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-bold text-slate-800"
                    >
                      <option value="true">Published (Live)</option>
                      <option value="false">Hidden (Draft)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-extrabold text-[#10243A] uppercase mb-1 text-[11px]">
                      Feature Priority
                    </label>
                    <select
                      value={editingNews.isFeatured ? 'true' : 'false'}
                      onChange={(e) =>
                        setEditingNews({ ...editingNews, isFeatured: e.target.value === 'true' })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-bold text-slate-800"
                    >
                      <option value="false">Standard Item</option>
                      <option value="true">Featured Story</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingNews(null)}
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
                    <span>{isSaving ? 'Saving Article...' : isNew ? 'Publish Article' : 'Update Article'}</span>
                  </button>
                </div>
              </form>

              {/* Right Side: Live Visual Preview Matching Homepage Reference Screenshot */}
              {showLivePreview && (
                <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50/70 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#2376b8]" />
                      <span>Live Homepage Card Preview</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      Real-Time Rendering
                    </span>
                  </div>

                  {/* Card mockup replicating user reference image */}
                  {(() => {
                    const currentImg = imagePreview || editingNews.imageUrl;
                    return (
                      <>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-300/80 h-[380px] sm:h-[420px] flex flex-col justify-between p-6 sm:p-8 group bg-slate-900">
                          {/* Background image or neutral placeholder */}
                          {currentImg ? (
                            <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                              style={{
                                backgroundImage: `url('${currentImg}')`,
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#10243A] via-[#163352] to-[#0a1827] flex items-center justify-center">
                              <div className="text-center p-6 space-y-2">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-[#C7A76C] flex items-center justify-center mx-auto">
                                  <ImageIcon className="w-6 h-6" />
                                </div>
                                <p className="text-xs font-bold text-slate-300">Upload or paste an image to see live preview</p>
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20 z-10" />

                          {/* Top-Left Badge: Tag */}
                          <div className="relative z-20 self-start">
                            <span className="px-4 py-1.5 rounded-full bg-white text-slate-900 font-extrabold text-xs shadow-lg tracking-wide border border-white/80 inline-block">
                              {editingNews.tag || 'Tax Alert'}
                            </span>
                          </div>

                          {/* Bottom Metadata, Title, Description */}
                          <div className="relative z-20 flex flex-col justify-end text-left space-y-2">
                            {/* Meta line: Date • Mins of Read • Sub Tag */}
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
                              <span>{editingNews.date || '11 Jan, 2025'}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-400" />
                              <span>{editingNews.readTime || '3 min Read'}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-400" />
                              <span className="text-[#89b441] font-bold">
                                {editingNews.subTag || 'Tax & Compliance Desk'}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight tracking-tight">
                              {editingNews.title || 'Budget Insights: Capital Gains Tax Structure and Portfolio Optimization'}
                            </h3>

                            {/* Description */}
                            <p className="text-slate-200 text-xs leading-relaxed line-clamp-3">
                              {editingNews.description ||
                                'A strategic breakdown of revised LTCG and STCG tax rules and how high-net-worth investors can harvest gains efficiently through disciplined asset allocation.'}
                            </p>
                          </div>
                        </div>

                        {/* Micro list mockup preview */}
                        <div className="space-y-2 pt-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Right List Sidebar Preview:
                          </span>
                          <div className="p-2.5 rounded-2xl border border-slate-200 bg-white flex items-center gap-3 shadow-sm">
                            <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center border border-slate-200">
                              {currentImg ? (
                                <img
                                  src={currentImg}
                                  alt="thumb"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                                <span>{editingNews.date || '11 Jan, 2025'}</span>
                                <span>{editingNews.readTime || '3 min Read'}</span>
                              </div>
                              <h4 className="font-bold text-xs text-slate-900 truncate">
                                {editingNews.title || 'Budget Insights: Capital Gains Tax Structure...'}
                              </h4>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !isDeletingTarget && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete News Article"
        itemName={deleteTarget?.title}
        message="Are you sure you want to delete this news article? This action is permanent and cannot be undone."
        warningDetails="This will permanently delete this story from the database and remove its remote image asset from Cloudinary."
        confirmText="Yes, Delete Story"
        isDeleting={isDeletingTarget}
      />
    </div>
  );
}
