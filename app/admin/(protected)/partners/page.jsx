'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Handshake,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Save,
  X,
  Upload,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Globe,
  Building2,
} from 'lucide-react';
import { usePartnerStore } from '@/store/usePartnerStore';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import apiClient from '@/lib/axios';

const CATEGORIES = [
  'Mutual Fund AMC',
  'Insurance Partner',
  'PMS & AIF Provider',
  'Banking & Depository',
  'Other Partner',
];

export default function AdminPartnersPage() {
  const {
    partners,
    isLoading,
    isSaving,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
  } = usePartnerStore();

  const [editingItem, setEditingItem] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [previewLogo, setPreviewLogo] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeletingTarget, setIsDeletingTarget] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const logoInputRef = useRef(null);

  // Initial fetch via Zustand + Axios
  useEffect(() => {
    fetchPartners(true);
  }, [fetchPartners]);

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleOpenNew = () => {
    setIsNew(true);
    setPreviewLogo('');
    setEditingItem({
      name: '',
      category: 'Mutual Fund AMC',
      logoUrl: '',
      imageUrl: '',
      logoPublicId: '',
      imagePublicId: '',
      websiteUrl: '',
      order: partners.length,
      isPublished: true,
    });
  };

  const handleOpenEdit = (p) => {
    setIsNew(false);
    const initialLogo = p.logoUrl || p.imageUrl || '';
    setPreviewLogo(initialLogo);
    setEditingItem({
      ...p,
      logoUrl: initialLogo,
      imageUrl: initialLogo,
      logoPublicId: p.logoPublicId || p.imagePublicId || '',
      imagePublicId: p.imagePublicId || p.logoPublicId || '',
      category: p.category || 'Mutual Fund AMC',
      isPublished: p.isPublished !== undefined ? p.isPublished : true,
    });
  };

  // Upload partner logo to Cloudinary
  const handleLogoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select a valid image or SVG file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Logo file size must be under 5MB');
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreviewLogo(localUrl);
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
          logoUrl: result.imageUrl,
          imageUrl: result.imageUrl,
          logoPublicId: result.publicId || '',
          imagePublicId: result.publicId || '',
        }));
        setPreviewLogo(result.imageUrl);
        showToast('success', 'Logo uploaded successfully');
      }
    } catch (err) {
      showToast('error', `Logo upload failed: ${err.message}`);
      setPreviewLogo(editingItem?.logoUrl || '');
    } finally {
      setIsUploading(false);
    }
  };

  // Save / Submit Partner
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingItem.name?.trim()) {
      showToast('error', 'Partner / Institution Name is required');
      return;
    }

    const payload = {
      name: editingItem.name.trim(),
      category: editingItem.category || 'Mutual Fund AMC',
      logoUrl: (editingItem.logoUrl || editingItem.imageUrl || '').trim(),
      imageUrl: (editingItem.logoUrl || editingItem.imageUrl || '').trim(),
      logoPublicId: editingItem.logoPublicId || editingItem.imagePublicId || '',
      imagePublicId: editingItem.imagePublicId || editingItem.logoPublicId || '',
      websiteUrl: (editingItem.websiteUrl || '').trim(),
      order: Number(editingItem.order || 0),
      isPublished: Boolean(editingItem.isPublished),
    };

    try {
      if (isNew) {
        await createPartner(payload);
        showToast('success', 'New partner added successfully!');
      } else {
        await updatePartner(editingItem._id || editingItem.id, payload);
        showToast('success', 'Partner tie-up updated successfully!');
      }
      setEditingItem(null);
    } catch (err) {
      showToast('error', `Failed to save partner: ${err.message}`);
    }
  };

  // Delete Partner
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeletingTarget(true);
    try {
      await deletePartner(deleteTarget.id);
      showToast('success', 'Partner institution removed successfully');
      setDeleteTarget(null);
    } catch (err) {
      showToast('error', `Error deleting partner: ${err.message}`);
    } finally {
      setIsDeletingTarget(false);
    }
  };

  // Filter partners
  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
              Institutional Alliances
            </span>
            <span className="text-slate-400 text-xs">• Infinite Marquee Connected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Client Partners &amp; AMC Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Manage Asset Management Companies (AMCs), Insurance tie-ups, and banking depository relationships displayed in the Client Partners marquee.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
          <button
            onClick={() => fetchPartners(true)}
            disabled={isLoading}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-3 rounded-2xl transition-all flex items-center gap-2 border border-white/15"
            title="Refresh partners list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleOpenNew}
            className="bg-gradient-to-r from-[#C7A76C] to-[#b39257] hover:brightness-110 text-[#10243A] text-xs font-extrabold uppercase tracking-wider px-5 py-3 rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-black/20"
          >
            <Plus className="w-4 h-4 text-[#10243A] stroke-[3]" />
            <span>Add Partner</span>
          </button>
        </div>
      </div>

      {/* Live Homepage "Client Partners" Section Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#2376b8]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#10243A]">
              Live Website Section Preview (Matching Reference Design)
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-400">
            {partners.filter((p) => p.isPublished).length} Active Logos
          </span>
        </div>

        {/* Live Scaled Preview Box replicating exact reference design */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/70 text-center relative overflow-hidden shadow-inner">
          <h3 className="text-xl sm:text-2xl font-bold text-[#2376b8] tracking-tight">
            Client Partners
          </h3>
          <div className="w-12 h-1 bg-[#2376b8] mx-auto mt-2 rounded-full" />

          {/* Scaled Preview Row */}
          {partners.length === 0 ? (
            <div className="py-6 text-slate-400 text-xs font-medium">
              No partner logos uploaded yet. Click &quot;Add Partner&quot; below to add your first institution.
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-8 overflow-x-auto py-2 px-4 no-scrollbar">
              {(partners.filter((p) => p.isPublished).slice(0, 6).length > 0
                ? partners.filter((p) => p.isPublished).slice(0, 6)
                : partners.slice(0, 6)
              ).map((p, idx) => (
                <div
                  key={p._id || idx}
                  className="bg-white border border-slate-200/80 shadow-xs rounded-xl px-4 py-2 flex items-center justify-center h-14 min-w-[140px] shrink-0"
                >
                  {p.logoUrl || p.imageUrl ? (
                    <img
                      src={p.logoUrl || p.imageUrl}
                      alt={p.name}
                      className="max-h-9 max-w-[130px] object-contain"
                    />
                  ) : (
                    <span className="font-bold text-xs text-[#0f2b44]">{p.name}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search partners by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2376b8]/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-[#10243A] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({partners.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = partners.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#10243A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Partners Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-[#10243A]">
              Institutions &amp; Partner Houses ({filteredPartners.length})
            </h3>
            <p className="text-xs text-slate-500">
              Manage logos, website URLs, and display order for homepage marquee rotation.
            </p>
          </div>
        </div>

        {filteredPartners.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No partner institutions found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'All'
                ? 'No partners matched your filter criteria.'
                : 'Get started by adding your first institutional partner.'}
            </p>
            <button
              onClick={handleOpenNew}
              className="bg-[#10243A] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#C7A76C]" />
              <span>Add Partner</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((p) => {
              const logoSrc = p.logoUrl || p.imageUrl;
              return (
                <div
                  key={p._id || p.name}
                  className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top status & category pill */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2376b8] bg-[#2376b8]/10 px-2.5 py-1 rounded-full border border-[#2376b8]/20">
                        {p.category || 'Mutual Fund AMC'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          p.isPublished
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {p.isPublished ? 'Active' : 'Hidden'}
                      </span>
                    </div>

                    {/* Logo display card */}
                    <div className="w-full h-24 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center p-3 overflow-hidden shadow-xs">
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={p.name}
                          className="max-h-16 max-w-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Handshake className="w-6 h-6" />
                          <span className="text-xs font-bold">No Logo Uploaded</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-[#10243A]">{p.name}</h4>
                      {p.websiteUrl ? (
                        <a
                          href={p.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#2376b8] hover:underline flex items-center gap-1 font-mono truncate mt-1"
                        >
                          <Globe className="w-3 h-3 shrink-0" />
                          <span className="truncate">{p.websiteUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                          No URL linked
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between mt-4">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Order: #{p.order ?? 0}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 text-slate-600 hover:text-[#10243A] hover:bg-slate-100 rounded-xl transition-colors"
                        title="Edit Partner"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ id: p._id || p.id, name: p.name })}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete Partner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit / Create Partner Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2376b8]/10 text-[#2376b8] flex items-center justify-center">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base sm:text-lg text-[#10243A]">
                    {isNew ? 'Add Partner Institution' : 'Edit Partner Details'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Will appear in the infinite scrolling Client Partners marquee.
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
              {/* Partner Name */}
              <div className="space-y-1.5">
                <label className="block font-extrabold text-[#10243A] uppercase tracking-wider text-[11px]">
                  Partner / AMC Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SBI Mutual Fund"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2376b8]/20"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block font-extrabold text-[#10243A] uppercase tracking-wider text-[11px]">
                  Category *
                </label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2376b8]/20"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Logo Upload Section */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <label className="block font-extrabold text-[#10243A] uppercase tracking-wider text-[11px]">
                  Partner Logo Image (Upload or SVG/Web URL)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Logo Preview */}
                  <div className="w-24 h-16 rounded-xl border border-slate-200 bg-white shadow-xs shrink-0 flex items-center justify-center p-2">
                    {previewLogo || editingItem.logoUrl ? (
                      <img
                        src={previewLogo || editingItem.logoUrl}
                        alt="Logo preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400 text-center font-bold">
                        No Logo
                      </span>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-1.5 shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? 'Uploading...' : 'Upload Logo'}</span>
                      </button>
                      {(previewLogo || editingItem.logoUrl) && (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewLogo('');
                            setEditingItem({
                              ...editingItem,
                              logoUrl: '',
                              imageUrl: '',
                              logoPublicId: '',
                              imagePublicId: '',
                            });
                          }}
                          className="px-3 py-2 rounded-xl text-rose-600 font-bold hover:bg-rose-50"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                      className="hidden"
                    />
                    <input
                      type="text"
                      placeholder="Or paste image/SVG URL (/partners/... or https://...)"
                      value={editingItem.logoUrl || ''}
                      onChange={(e) => {
                        setEditingItem({
                          ...editingItem,
                          logoUrl: e.target.value,
                          imageUrl: e.target.value,
                        });
                        setPreviewLogo(e.target.value);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Website URL */}
              <div className="space-y-1.5">
                <label className="block font-extrabold text-[#10243A] uppercase tracking-wider text-[11px]">
                  Official Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://www.sbimf.com"
                  value={editingItem.websiteUrl || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, websiteUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2376b8]/20"
                />
              </div>

              {/* Display Order and Visibility */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-extrabold text-[#10243A] uppercase tracking-wider text-[11px]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingItem.order ?? 0}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, order: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-extrabold text-[#10243A] uppercase tracking-wider text-[11px]">
                    Visibility
                  </label>
                  <select
                    value={editingItem.isPublished ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isPublished: e.target.value === 'true' })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 font-bold text-slate-800"
                  >
                    <option value="true">Published (Active)</option>
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
                      ? 'Add Partner'
                      : 'Update Partner'}
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
        title="Delete Partner Institution"
        itemName={deleteTarget?.name}
        message="Are you sure you want to remove this partner tie-up? This action cannot be undone."
        warningDetails="This institution logo will be permanently deleted from the website and the client partners marquee."
        confirmText="Yes, Delete Partner"
        isDeleting={isDeletingTarget}
      />
    </div>
  );
}
