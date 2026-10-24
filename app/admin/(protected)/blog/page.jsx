'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ExternalLink,
  Calendar,
  UploadCloud,
  Check,
  Copy,
  AlertCircle,
  Clock,
  Search,
  Sparkles,
  RefreshCw,
  Eye,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Filter,
} from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import { useBlogStore } from '@/store/useBlogStore';

export default function AdminBlogManagerPage() {
  const {
    adminPosts: posts,
    isLoading: loading,
    isSaving: saving,
    isUploading: uploadingImage,
    fetchAdminPosts,
    createPost,
    updatePost,
    deletePost,
    uploadImage,
    deleteImage,
  } = useBlogStore();

  const [editingPost, setEditingPost] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Cloudinary image upload states
  const [deletingImage, setDeletingImage] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [imageError, setImageError] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    fetchAdminPosts();
  }, [fetchAdminPosts]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const calculateReadingTime = (text) => {
    if (!text) return '2 min read';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 180));
    return `${minutes} min read`;
  };

  const toLocalDatetimeInput = (dateInput) => {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getCurrentLocalDatetime = () => {
    return toLocalDatetimeInput(new Date());
  };

  const handleOpenNew = () => {
    setIsNew(true);
    setImageError('');
    setEditingPost({
      title: '',
      slug: '',
      description: '',
      content: '',
      excerpt: '',
      category: 'Financial Planning',
      author: 'Finasset Research Desk',
      featuredImage: '',
      featuredImagePublicId: '',
      tags: ['Wealth', 'Investing'],
      readingTime: '5 min read',
      isPublished: true,
      publishedAt: getCurrentLocalDatetime(),
    });
  };

  const handleOpenEdit = (p) => {
    setIsNew(false);
    setImageError('');
    setEditingPost({
      ...p,
      description: p.description || p.content || '',
      featuredImagePublicId: p.featuredImagePublicId || '',
      publishedAt: toLocalDatetimeInput(p.publishedAt || p.createdAt || new Date()),
    });
  };

  const handleTitleChange = (val) => {
    if (!editingPost) return;
    const updated = { ...editingPost, title: val };
    // Auto generate slug if creating new or if slug hasn't been custom modified
    if (isNew || !editingPost.slug || editingPost.slug === generateSlug(editingPost.title)) {
      updated.slug = generateSlug(val);
    }
    setEditingPost(updated);
  };

  const handleDescriptionChange = (val) => {
    if (!editingPost) return;
    setEditingPost({
      ...editingPost,
      description: val,
      content: val,
      readingTime: calculateReadingTime(val),
    });
  };

  // Upload image to Cloudinary via Zustand store and Axios
  const handleImageFile = async (file) => {
    if (!file) return;

    // Strict validation: Only images allowed
    if (!file.type || !file.type.startsWith('image/')) {
      setImageError('Invalid file type! Only image files (PNG, JPG, JPEG, WEBP, SVG, GIF) are allowed.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageError('Image size exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    setImageError('');

    try {
      const uploadData = await uploadImage(file);
      const { imageUrl, publicId } = uploadData;

      // If there was an old image uploaded in this session that is different, delete old one
      if (editingPost.featuredImagePublicId && editingPost.featuredImagePublicId !== publicId) {
        try {
          await deleteImage(editingPost.featuredImagePublicId);
        } catch (cleanupErr) {
          console.warn('Failed to delete previous Cloudinary asset:', cleanupErr);
        }
      }

      setEditingPost((prev) => ({
        ...prev,
        featuredImage: imageUrl,
        featuredImagePublicId: publicId,
      }));

      showToast('Image uploaded directly to Cloudinary!');
    } catch (err) {
      console.error('Image upload failed:', err);
      setImageError(err.message || 'Could not upload image to Cloudinary. Please try again.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Delete image directly from Cloudinary
  const handleDeleteImage = async () => {
    if (!editingPost.featuredImage && !editingPost.featuredImagePublicId) return;

    setDeletingImage(true);
    try {
      if (editingPost.featuredImagePublicId) {
        await deleteImage(editingPost.featuredImagePublicId);
      }

      setEditingPost((prev) => ({
        ...prev,
        featuredImage: '',
        featuredImagePublicId: '',
      }));

      showToast('Image deleted from Cloudinary successfully');
    } catch (err) {
      console.error('Failed to delete image:', err);
      showToast('Could not delete image from Cloudinary', 'error');
    } finally {
      setDeletingImage(false);
    }
  };

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    showToast(`Copied ${fieldName} to clipboard!`);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageFile(files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingPost.title?.trim()) {
      showToast('Article title is required', 'error');
      return;
    }
    if (!editingPost.slug?.trim()) {
      showToast('URL slug is required', 'error');
      return;
    }

    try {
      const payload = {
        ...editingPost,
        publishedAt: editingPost.publishedAt
          ? new Date(editingPost.publishedAt).toISOString()
          : new Date().toISOString(),
        content: editingPost.description || editingPost.content || '',
        description: editingPost.description || editingPost.content || '',
        excerpt:
          editingPost.excerpt ||
          (editingPost.description ? editingPost.description.substring(0, 160).replace(/[#*`]/g, '') : ''),
      };

      if (!isNew && editingPost._id) {
        payload.id = editingPost._id;
      }

      if (isNew) {
        await createPost(payload);
        showToast('Blog article published successfully!');
      } else {
        await updatePost(editingPost._id, payload);
        showToast('Blog article updated successfully!');
      }

      setEditingPost(null);
    } catch (err) {
      console.error('Save error:', err);
      showToast(err.message || 'Error saving article', 'error');
    }
  };

  const handleConfirmDeletePost = async () => {
    if (!deletingPost) return;
    setIsDeletingPost(true);

    try {
      await deletePost(deletingPost._id);
      showToast('Article and associated Cloudinary image deleted successfully');
      setDeletingPost(null);
    } catch (err) {
      console.error('Delete error:', err);
      showToast(err.message || 'Failed to delete article', 'error');
    } finally {
      setIsDeletingPost(false);
    }
  };

  // Filter and search logic
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PUBLISHED' && post.isPublished) ||
      (statusFilter === 'DRAFT' && !post.isPublished);

    const matchesCategory = categoryFilter === 'ALL' || post.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-semibold transition-all animate-in slide-in-from-bottom-5 ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-[#10243A] border-[#C7A76C]/30 text-white shadow-xl shadow-[#10243A]/20'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#C7A76C] shrink-0" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Header section with Stats & Action */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#10243A]/5 text-[#10243A] rounded-xl">
                <BookOpen className="w-5 h-5 text-[#C7A76C]" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#10243A] tracking-tight">
                Blog & Articles Manager
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 pl-1">
              Manage articles with direct Cloudinary storage, automated slug creation, and instant publishing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenNew}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#10243A] hover:bg-[#1b3b5e] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-lg shadow-[#10243A]/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 text-[#C7A76C]" />
              <span>Write New Blog</span>
            </button>
          </div>
        </div>

        {/* Quick summary metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100">
          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Articles</p>
            <p className="text-xl font-black text-[#10243A] mt-0.5">{posts.length}</p>
          </div>
          <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100/80">
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Published</p>
            <p className="text-xl font-black text-emerald-700 mt-0.5">
              {posts.filter((p) => p.isPublished).length}
            </p>
          </div>
          <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100/80">
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Drafts</p>
            <p className="text-xl font-black text-amber-700 mt-0.5">
              {posts.filter((p) => !p.isPublished).length}
            </p>
          </div>
          <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100/80">
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">With Cover Img</p>
            <p className="text-xl font-black text-blue-700 mt-0.5">
              {posts.filter((p) => p.featuredImage).length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, slug, or author..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10243A]/20 focus:border-[#10243A]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-initial text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#10243A]/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Drafts Only</option>
          </select>

          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 md:flex-initial text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#10243A]/20"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Content List: Responsive Table (Desktop) & Cards (Mobile/Tablet) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#C7A76C] animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Loading articles...
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-4">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400 border border-slate-100">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#10243A]">No articles found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
                  ? 'No posts matched your current search and filter criteria.'
                  : 'Start writing your first insightful financial article now!'}
              </p>
            </div>
            <button
              onClick={handleOpenNew}
              className="inline-flex items-center gap-2 bg-[#10243A] text-white text-xs font-bold px-4 py-2.5 rounded-xl"
            >
              <Plus className="w-4 h-4 text-[#C7A76C]" />
              <span>Create First Blog</span>
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View (Hidden on mobile / tablet < lg) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 uppercase font-black text-[10px] tracking-wider">
                    <th className="py-4 px-6">Article</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Author</th>
                    <th className="py-4 px-6">Published Date</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPosts.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3 max-w-md">
                          {p.featuredImage ? (
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 relative group/img">
                              <img
                                src={p.featuredImage}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                              {p.featuredImagePublicId && (
                                <span
                                  title="Stored on Cloudinary"
                                  className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-tl border border-white"
                                />
                              )}
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-extrabold text-[#10243A] text-sm truncate group-hover:text-[#2376b8] transition-colors">
                              {p.title}
                            </p>
                            <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                              /blog/{p.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="bg-slate-100/90 text-slate-700 px-2.5 py-1 rounded-lg font-semibold text-[11px] border border-slate-200/50">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium whitespace-nowrap">
                        {p.author || 'Finasset Team'}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-slate-500 font-medium">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">
                            {formatDate(p.publishedAt || p.createdAt)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(p.publishedAt || p.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                            p.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.isPublished ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {p.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap space-x-1">
                        <Link
                          href={`/blog/${p.slug}`}
                          target="_blank"
                          title="View Live Article"
                          className="p-2 text-slate-400 hover:text-[#10243A] hover:bg-slate-100 rounded-xl inline-flex transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          title="Edit Article"
                          className="p-2 text-slate-600 hover:text-[#10243A] hover:bg-slate-100 rounded-xl inline-flex transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingPost(p)}
                          title="Delete Article (Removes Cloudinary Image)"
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl inline-flex transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet Card View (< lg) */}
            <div className="block lg:hidden divide-y divide-slate-100">
              {filteredPosts.map((p) => (
                <div key={p._id} className="p-4 sm:p-5 space-y-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-3.5">
                    {p.featuredImage ? (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 relative">
                        <img src={p.featuredImage} alt={p.title} className="w-full h-full object-cover" />
                        {p.featuredImagePublicId && (
                          <span
                            title="Cloudinary Hosted"
                            className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-tl border border-white"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 shrink-0 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                            p.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              p.isPublished ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {p.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                          {p.category}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-[#10243A] leading-snug line-clamp-2">
                        {p.title}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                        /blog/{p.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100/80">
                    <div className="flex items-center gap-3">
                      <span>{formatDateTime(p.publishedAt || p.createdAt)}</span>
                      <span>•</span>
                      <span>{p.author || 'Finasset'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-[#10243A] rounded-lg"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-slate-600 hover:text-[#10243A] rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingPost(p)}
                        title="Delete Article"
                        className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Write New Blog / Edit Blog Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#10243A] text-white flex items-center justify-center shadow">
                  <BookOpen className="w-5 h-5 text-[#C7A76C]" />
                </div>
                <div>
                  <h2 className="font-black text-base sm:text-lg text-[#10243A]">
                    {isNew ? 'Write New Blog Article' : 'Edit Blog Article'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Direct Cloudinary image upload, live slug preview, and publication control.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm">
                {/* 1. Title & Auto Slug */}
                <div className="space-y-4">
                  <div>
                    <label className="block font-black text-[#10243A] uppercase tracking-wider text-[11px] mb-1.5">
                      Blog Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Master Mutual Fund SIPs: A Complete Wealth Creation Guide for 2026"
                      value={editingPost.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-2xl px-4 py-3 font-bold text-sm text-[#10243A] focus:outline-none focus:ring-2 focus:ring-[#10243A]/20 transition-all placeholder:font-normal placeholder:text-slate-400"
                    />
                  </div>

                  {/* 2. Slug */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-black text-[#10243A] uppercase tracking-wider text-[11px]">
                        URL Slug <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingPost({ ...editingPost, slug: generateSlug(editingPost.title || '') })
                        }
                        className="text-[11px] font-bold text-[#2376b8] hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Sync with Title</span>
                      </button>
                    </div>

                    <div className="flex rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#10243A]/20 focus-within:bg-white transition-all">
                      <span className="bg-slate-100 text-slate-400 px-3.5 py-2.5 font-mono text-xs select-none border-r border-slate-200 flex items-center">
                        /blog/
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="master-mutual-fund-sips-guide-2026"
                        value={editingPost.slug}
                        onChange={(e) =>
                          setEditingPost({ ...editingPost, slug: generateSlug(e.target.value) })
                        }
                        className="w-full bg-transparent px-3.5 py-2.5 font-mono text-xs text-[#10243A] focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 pl-1">
                      Unique URL path for this article (lowercase letters, numbers, and dashes only).
                    </p>
                  </div>
                </div>

                {/* 3. Direct Cloudinary Image Upload (Allowed Image Only) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-[#10243A] uppercase tracking-wider text-[11px]">
                      Cover Image (Direct Cloudinary Upload)
                    </label>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Allowed: PNG, JPG, WEBP, SVG, GIF
                    </span>
                  </div>

                  {/* Error Banner */}
                  {imageError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{imageError}</span>
                    </div>
                  )}

                  {/* Hidden File Input strictly accepting images */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/gif"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  {/* Uploaded state vs Dropzone */}
                  {editingPost.featuredImage ? (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Image Thumbnail with zoom/link */}
                        <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative group shrink-0">
                          <img
                            src={editingPost.featuredImage}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                          />
                          <a
                            href={editingPost.featuredImage}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                          >
                            <Eye className="w-5 h-5" />
                          </a>
                        </div>

                        {/* Image Details */}
                        <div className="flex-1 min-w-0 space-y-2 w-full">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Uploaded on Cloudinary</span>
                            </span>
                          </div>

                          {/* Image URL with Copy */}
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Cloudinary Image URL:</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <input
                                type="text"
                                readOnly
                                value={editingPost.featuredImage}
                                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-[11px] font-mono text-slate-600 w-full truncate"
                              />
                              <button
                                type="button"
                                onClick={() => handleCopy(editingPost.featuredImage, 'imageUrl')}
                                className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 shrink-0"
                                title="Copy Image URL"
                              >
                                {copiedField === 'imageUrl' ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Cloudinary Public ID with Copy */}
                          {editingPost.featuredImagePublicId && (
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">
                                Cloudinary Public ID (For Asset Management):
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <input
                                  type="text"
                                  readOnly
                                  value={editingPost.featuredImagePublicId}
                                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-[11px] font-mono text-slate-600 w-full truncate"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleCopy(editingPost.featuredImagePublicId, 'publicId')}
                                  className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 shrink-0"
                                  title="Copy Public ID"
                                >
                                  {copiedField === 'publicId' ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Image Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200/80">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage || deletingImage}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#10243A] bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-all"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Replace Image</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDeleteImage}
                          disabled={uploadingImage || deletingImage}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 px-3 py-1.5 rounded-xl transition-all"
                        >
                          {deletingImage ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          <span>{deletingImage ? 'Deleting from Cloudinary...' : 'Delete Image from Cloudinary'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Dropzone for Image Selection */
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2.5 ${
                        isDragging
                          ? 'border-[#C7A76C] bg-amber-50/50 scale-[1.01]'
                          : 'border-slate-300 hover:border-[#10243A] bg-slate-50/60 hover:bg-slate-50'
                      }`}
                    >
                      {uploadingImage ? (
                        <div className="py-4 space-y-2">
                          <Loader2 className="w-8 h-8 text-[#C7A76C] animate-spin mx-auto" />
                          <p className="text-xs font-bold text-[#10243A]">Uploading image directly to Cloudinary...</p>
                          <p className="text-[11px] text-slate-400">Storing cloud asset and generating public URLs</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[#10243A]">
                            <UploadCloud className="w-6 h-6 text-[#C7A76C]" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-[#10243A]">
                              Click to upload or drag & drop cover image
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Strictly image files only (PNG, JPG, JPEG, WEBP, SVG, GIF up to 10MB)
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#10243A] bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-xl">
                            <ImageIcon className="w-3.5 h-3.5 text-[#C7A76C]" />
                            <span>Browse Image File</span>
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* 4. Description / Article Content */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-black text-[#10243A] uppercase tracking-wider text-[11px]">
                      Description / Article Content <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {editingPost.description ? editingPost.description.length : 0} characters • ~
                      {editingPost.readingTime || '5 min read'}
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    required
                    placeholder="Write the full comprehensive article description and body content here. Markdown headings (##), lists, and formatting are supported..."
                    value={editingPost.description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-2xl p-4 text-xs sm:text-sm text-[#10243A] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#10243A]/20 transition-all placeholder:text-slate-400 min-h-[160px]"
                  />
                </div>

                {/* 5. Publication Status & Metadata Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
                  {/* isPublished Toggle */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between">
                    <label className="block font-black text-[#10243A] uppercase tracking-wider text-[11px] mb-2">
                      Publication Status
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingPost({ ...editingPost, isPublished: !editingPost.isPublished })
                      }
                      className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        editingPost.isPublished
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          editingPost.isPublished ? 'bg-white' : 'bg-slate-400'
                        }`}
                      />
                      <span>{editingPost.isPublished ? 'Published (Live)' : 'Draft (Hidden)'}</span>
                    </button>
                    <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                      {editingPost.isPublished ? 'Visible on public blog page' : 'Only admins can view'}
                    </p>
                  </div>

                  {/* Dynamic Published Date & Time */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-black text-[#10243A] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C7A76C]" />
                        <span>Publish Date & Time</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingPost({ ...editingPost, publishedAt: getCurrentLocalDatetime() })
                        }
                        className="text-[10px] font-bold text-[#2376b8] hover:underline flex items-center gap-1"
                        title="Set to Current Date & Time"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Now</span>
                      </button>
                    </div>
                    <input
                      type="datetime-local"
                      required
                      value={editingPost.publishedAt || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, publishedAt: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 font-mono text-xs text-[#10243A] focus:outline-none focus:ring-2 focus:ring-[#10243A]/20"
                    />
                    <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                      Dynamic date shown to visitors
                    </p>
                  </div>

                  {/* Category */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between">
                    <label className="block font-black text-[#10243A] uppercase tracking-wider text-[11px] mb-2">
                      Category
                    </label>
                    <select
                      value={editingPost.category}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-xs text-[#10243A] focus:outline-none focus:ring-2 focus:ring-[#10243A]/20"
                    >
                      <option value="Financial Planning">Financial Planning</option>
                      <option value="Mutual Funds">Mutual Funds</option>
                      <option value="Tax Planning">Tax Planning</option>
                      <option value="NRI Corner">NRI Corner</option>
                      <option value="Market Analysis">Market Analysis</option>
                      <option value="Retirement">Retirement Planning</option>
                      <option value="Wealth Advisory">Wealth Advisory</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                      Article topic classification
                    </p>
                  </div>

                  {/* Author */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between">
                    <label className="block font-black text-[#10243A] uppercase tracking-wider text-[11px] mb-2">
                      Author Byline
                    </label>
                    <input
                      type="text"
                      value={editingPost.author}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                      placeholder="Finasset Research Desk"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-xs text-[#10243A] focus:outline-none focus:ring-2 focus:ring-[#10243A]/20"
                    />
                    <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                      Author / Research desk name
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Actions Pinned Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50/70 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#10243A] hover:bg-[#1b3b5e] text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-[#10243A]/20 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C7A76C]" />
                      <span>Saving Article...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-[#C7A76C]" />
                      <span>{isNew ? 'Publish Article' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Article In-App Confirmation Modal */}
      {deletingPost && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-black text-[#10243A]">
                Delete Article?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete:
              </p>
              <p className="text-xs font-bold text-[#10243A] bg-slate-50 p-2.5 rounded-xl border border-slate-200 break-words">
                &ldquo;{deletingPost.title}&rdquo;
              </p>
            </div>

            {deletingPost.featuredImagePublicId ? (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-left flex items-start gap-2.5 text-[11px] text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Cloudinary Asset Cleanup:</strong> The associated cover image (
                  <code className="font-mono text-[10px] bg-amber-100/80 px-1 py-0.5 rounded">
                    {deletingPost.featuredImagePublicId}
                  </code>
                  ) will also be permanently deleted from Cloudinary.
                </span>
              </div>
            ) : deletingPost.featuredImage ? (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-left flex items-start gap-2.5 text-[11px] text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> Associated cloud image assets will also be wiped from Cloudinary.
                </span>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPost(null)}
                disabled={isDeletingPost}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePost}
                disabled={isDeletingPost}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
              >
                {isDeletingPost ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
