'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  ImagePlus,
  Loader2,
  Eye,
  EyeOff,
  Link2,
} from 'lucide-react';

import { useServiceStore } from '@/store/useServiceStore';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

const ICON_OPTIONS = [
  { value: 'TrendingUp', label: 'TrendingUp (Growth)' },
  { value: 'Compass', label: 'Compass (Planning)' },
  { value: 'ShieldCheck', label: 'ShieldCheck (Insurance)' },
  { value: 'Building', label: 'Building (Real Estate)' },
  { value: 'Landmark', label: 'Landmark (Bonds/FDs)' },
  { value: 'PieChart', label: 'PieChart (PMS)' },
];

const emptyService = (order = 0) => ({
  name: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  iconName: 'TrendingUp',
  image: '',
  bannerImage: '',
  displayOrder: order,
  isPublished: true,
  metaTitle: '',
  metaDescription: '',
  keyBenefits: [{ title: '', description: '' }],
  contentSections: [{ title: '', content: '', order: 0 }],
  faqs: [{ question: '', answer: '' }],
});

function autoSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminServicesPage() {
  const {
    adminServices: services,
    isLoading: loading,
    isSaving: saving,
    fetchServices,
    createService,
    updateService,
    deleteService,
    uploadMediaImage,
  } = useServiceStore();

  const [editingService, setEditingService] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('basic');
  const [imageUploading, setImageUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeletingTarget, setIsDeletingTarget] = useState(false);
  const imageInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    fetchServices(true);
  }, [fetchServices]);

  const handleOpenNew = () => {
    setIsNew(true);
    setActiveTab('basic');
    setMsg({ type: '', text: '' });
    setEditingService(emptyService(services.length));
  };

  const handleOpenEdit = (s) => {
    setIsNew(false);
    setActiveTab('basic');
    setMsg({ type: '', text: '' });
    setEditingService(JSON.parse(JSON.stringify(s)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    try {
      if (isNew) {
        await createService(editingService);
        setMsg({ type: 'success', text: `Service "${editingService.name}" saved successfully!` });
      } else {
        await updateService(editingService._id, editingService);
        setMsg({ type: 'success', text: `Service "${editingService.name}" updated successfully!` });
      }
      setEditingService(null);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to save service' });
    }
  };

  const handleDelete = (id, name) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeletingTarget(true);
    try {
      await deleteService(deleteTarget.id);
      setMsg({ type: 'success', text: `Service "${deleteTarget.name}" deleted successfully.` });
      setDeleteTarget(null);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Delete failed' });
    } finally {
      setIsDeletingTarget(false);
    }
  };

  // Upload image to media library API using Axios via store
  const uploadImage = async (file, field) => {
    const setUploading = field === 'image' ? setImageUploading : setBannerUploading;
    setUploading(true);
    try {
      const url = await uploadMediaImage(file);
      setEditingService((prev) => ({ ...prev, [field]: url }));
    } catch {
      setMsg({ type: 'error', text: 'Error uploading image' });
    } finally {
      setUploading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'content', label: 'Content Sections' },
    { id: 'benefits', label: 'Key Benefits' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'seo', label: 'SEO' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#10243A] flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#C7A76C]" />
            Services Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, and publish financial advisory disciplines. Each service has a dedicated
            URL at <span className="font-mono text-[#2376b8]">/services/[slug]</span>
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4 text-[#C7A76C]" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Message Banner */}
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
          <button onClick={() => setMsg({ type: '', text: '' })} className="ml-auto">
            <X className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
          </button>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#2376b8]" />
            <p className="text-xs font-semibold">Loading services…</p>
          </div>
        ) : services.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-semibold">No services yet</p>
            <p className="text-xs mt-1">Click "Add New Service" to create your first one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold">
                  <th className="py-4 px-4">Order</th>
                  <th className="py-4 px-4">Image</th>
                  <th className="py-4 px-4">Service Name</th>
                  <th className="py-4 px-4">Slug (URL)</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">FAQs</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">
                      #{s.displayOrder}
                    </td>
                    <td className="py-3 px-4">
                      {s.image ? (
                        <img
                          src={s.image}
                          alt={s.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                          <ImagePlus className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#10243A] text-sm">
                      {s.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      <a
                        href={`/services/${s.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-[#2376b8]"
                      >
                        /services/{s.slug}
                        <Link2 className="w-3 h-3 opacity-60" />
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          s.isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {s.isPublished ? (
                          <Eye className="w-2.5 h-2.5" />
                        ) : (
                          <EyeOff className="w-2.5 h-2.5" />
                        )}
                        {s.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{s.faqs?.length || 0} Q&amp;As</td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-2 text-slate-600 hover:text-[#10243A] hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id, s.name)}
                        className="p-2 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full my-6 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-[#10243A]">
                  {isNew ? 'Create New Service' : `Edit: ${editingService.name}`}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  URL: <span className="font-mono text-[#2376b8]">/services/{editingService.slug || '…'}</span>
                </p>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Bar */}
            <div className="flex border-b border-slate-100 px-6 gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-[#C7A76C] text-[#10243A]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSave} className="flex flex-col flex-1">
              <div className="p-6 space-y-5 text-xs overflow-y-auto max-h-[60vh]">

                {/* ─── BASIC INFO TAB ─── */}
                {activeTab === 'basic' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Service Name */}
                      <div>
                        <label className="block font-bold text-[#10243A] uppercase mb-1.5">
                          Service Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mutual Funds"
                          value={editingService.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            const slug = isNew ? autoSlug(name) : editingService.slug;
                            setEditingService({ ...editingService, name, slug });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-none focus:border-[#C7A76C] focus:bg-white"
                        />
                      </div>

                      {/* Slug */}
                      <div>
                        <label className="block font-bold text-[#10243A] uppercase mb-1.5">
                          Slug (URL Key) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. mutual-funds"
                          value={editingService.slug}
                          onChange={(e) =>
                            setEditingService({ ...editingService, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono focus:outline-none focus:border-[#C7A76C] focus:bg-white"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          Public URL: <span className="font-mono">/services/{editingService.slug || '…'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Short Description */}
                    <div>
                      <label className="block font-bold text-[#10243A] uppercase mb-1.5">
                        Short Description * <span className="text-slate-400 normal-case font-normal">(shown on cards &amp; listing)</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="One-line summary of this service"
                        value={editingService.shortDescription}
                        onChange={(e) =>
                          setEditingService({ ...editingService, shortDescription: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#C7A76C] focus:bg-white"
                      />
                    </div>

                    {/* Full Description */}
                    <div>
                      <label className="block font-bold text-[#10243A] uppercase mb-1.5">
                        Full Description * <span className="text-slate-400 normal-case font-normal">(overview section on detail page)</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Detailed overview of this service…"
                        value={editingService.fullDescription}
                        onChange={(e) =>
                          setEditingService({ ...editingService, fullDescription: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#C7A76C] focus:bg-white resize-none"
                      />
                    </div>

                    {/* Images Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Card Image */}
                      <div>
                        <label className="block font-bold text-[#10243A] uppercase mb-1.5">
                          Card / Thumbnail Image
                        </label>
                        <div className="relative">
                          {editingService.image ? (
                            <div className="relative rounded-xl overflow-hidden border border-slate-200 h-32">
                              <img
                                src={editingService.image}
                                alt="Service card"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => setEditingService({ ...editingService, image: '' })}
                                className="absolute top-2 right-2 bg-black/60 text-white rounded-lg p-1 hover:bg-rose-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => imageInputRef.current?.click()}
                              className="h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#C7A76C] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50 hover:bg-[#fdf8f0]"
                            >
                              {imageUploading ? (
                                <Loader2 className="w-6 h-6 text-[#C7A76C] animate-spin" />
                              ) : (
                                <>
                                  <ImagePlus className="w-6 h-6 text-slate-400" />
                                  <span className="text-[10px] text-slate-500 font-semibold">Click to upload image</span>
                                </>
                              )}
                            </div>
                          )}
                          <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) uploadImage(e.target.files[0], 'image');
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Or paste URL:</p>
                        <input
                          type="text"
                          placeholder="https://…"
                          value={editingService.image}
                          onChange={(e) =>
                            setEditingService({ ...editingService, image: e.target.value })
                          }
                          className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-mono text-[10px] focus:outline-none focus:border-[#C7A76C]"
                        />
                      </div>

                      {/* Banner Image */}
                      <div>
                        <label className="block font-bold text-[#10243A] uppercase mb-1.5">
                          Banner / Hero Image
                        </label>
                        <div className="relative">
                          {editingService.bannerImage ? (
                            <div className="relative rounded-xl overflow-hidden border border-slate-200 h-32">
                              <img
                                src={editingService.bannerImage}
                                alt="Banner"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => setEditingService({ ...editingService, bannerImage: '' })}
                                className="absolute top-2 right-2 bg-black/60 text-white rounded-lg p-1 hover:bg-rose-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => bannerInputRef.current?.click()}
                              className="h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#C7A76C] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50 hover:bg-[#fdf8f0]"
                            >
                              {bannerUploading ? (
                                <Loader2 className="w-6 h-6 text-[#C7A76C] animate-spin" />
                              ) : (
                                <>
                                  <ImagePlus className="w-6 h-6 text-slate-400" />
                                  <span className="text-[10px] text-slate-500 font-semibold">Click to upload banner</span>
                                </>
                              )}
                            </div>
                          )}
                          <input
                            ref={bannerInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) uploadImage(e.target.files[0], 'bannerImage');
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Or paste URL:</p>
                        <input
                          type="text"
                          placeholder="https://…"
                          value={editingService.bannerImage}
                          onChange={(e) =>
                            setEditingService({ ...editingService, bannerImage: e.target.value })
                          }
                          className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-mono text-[10px] focus:outline-none focus:border-[#C7A76C]"
                        />
                      </div>
                    </div>

                    {/* Order / Icon / Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-[#10243A] uppercase mb-1.5">
                          Display Order
                        </label>
                        <input
                          type="number"
                          value={editingService.displayOrder}
                          onChange={(e) =>
                            setEditingService({ ...editingService, displayOrder: Number(e.target.value) })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#C7A76C]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#10243A] uppercase mb-1.5">
                          Icon Style
                        </label>
                        <select
                          value={editingService.iconName}
                          onChange={(e) =>
                            setEditingService({ ...editingService, iconName: e.target.value })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#C7A76C]"
                        >
                          {ICON_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-[#10243A] uppercase mb-1.5">
                          Status
                        </label>
                        <select
                          value={editingService.isPublished ? 'true' : 'false'}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              isPublished: e.target.value === 'true',
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#C7A76C]"
                        >
                          <option value="true">Published (Public)</option>
                          <option value="false">Draft (Hidden)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── CONTENT SECTIONS TAB ─── */}
                {activeTab === 'content' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#10243A] uppercase">
                        Content Sections ({editingService.contentSections?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingService({
                            ...editingService,
                            contentSections: [
                              ...(editingService.contentSections || []),
                              { title: '', content: '', order: editingService.contentSections?.length || 0 },
                            ],
                          })
                        }
                        className="text-xs font-bold text-[#C7A76C] hover:underline"
                      >
                        + Add Section
                      </button>
                    </div>
                    {(editingService.contentSections || []).map((sec, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400">Section #{i + 1}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingService({
                                ...editingService,
                                contentSections: editingService.contentSections.filter((_, idx) => idx !== i),
                              })
                            }
                            className="text-rose-500 text-[10px] hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Section Title"
                          value={sec.title}
                          onChange={(e) => {
                            const updated = [...editingService.contentSections];
                            updated[i] = { ...updated[i], title: e.target.value };
                            setEditingService({ ...editingService, contentSections: updated });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
                        />
                        <textarea
                          rows={4}
                          placeholder="Section Content…"
                          value={sec.content}
                          onChange={(e) => {
                            const updated = [...editingService.contentSections];
                            updated[i] = { ...updated[i], content: e.target.value };
                            setEditingService({ ...editingService, contentSections: updated });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C] resize-none"
                        />
                      </div>
                    ))}
                    {(!editingService.contentSections || editingService.contentSections.length === 0) && (
                      <p className="text-xs text-slate-400 text-center py-6">No sections yet. Click "+ Add Section" to get started.</p>
                    )}
                  </div>
                )}

                {/* ─── KEY BENEFITS TAB ─── */}
                {activeTab === 'benefits' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#10243A] uppercase">
                        Key Benefits ({editingService.keyBenefits?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingService({
                            ...editingService,
                            keyBenefits: [
                              ...(editingService.keyBenefits || []),
                              { title: '', description: '' },
                            ],
                          })
                        }
                        className="text-xs font-bold text-[#C7A76C] hover:underline"
                      >
                        + Add Benefit
                      </button>
                    </div>
                    {(editingService.keyBenefits || []).map((b, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400">Benefit #{i + 1}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingService({
                                ...editingService,
                                keyBenefits: editingService.keyBenefits.filter((_, idx) => idx !== i),
                              })
                            }
                            className="text-rose-500 text-[10px] hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Benefit title"
                          value={b.title}
                          onChange={(e) => {
                            const updated = [...editingService.keyBenefits];
                            updated[i] = { ...updated[i], title: e.target.value };
                            setEditingService({ ...editingService, keyBenefits: updated });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
                        />
                        <textarea
                          rows={2}
                          placeholder="Benefit description…"
                          value={b.description}
                          onChange={(e) => {
                            const updated = [...editingService.keyBenefits];
                            updated[i] = { ...updated[i], description: e.target.value };
                            setEditingService({ ...editingService, keyBenefits: updated });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C] resize-none"
                        />
                      </div>
                    ))}
                    {(!editingService.keyBenefits || editingService.keyBenefits.length === 0) && (
                      <p className="text-xs text-slate-400 text-center py-6">No benefits yet. Click "+ Add Benefit".</p>
                    )}
                  </div>
                )}

                {/* ─── FAQs TAB ─── */}
                {activeTab === 'faqs' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#10243A] uppercase">
                        FAQs ({editingService.faqs?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingService({
                            ...editingService,
                            faqs: [...(editingService.faqs || []), { question: '', answer: '' }],
                          })
                        }
                        className="text-xs font-bold text-[#C7A76C] hover:underline"
                      >
                        + Add Question
                      </button>
                    </div>
                    {(editingService.faqs || []).map((faq, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400">FAQ #{i + 1}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingService({
                                ...editingService,
                                faqs: editingService.faqs.filter((_, idx) => idx !== i),
                              })
                            }
                            className="text-rose-500 text-[10px] hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Question"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = [...editingService.faqs];
                            updated[i] = { ...updated[i], question: e.target.value };
                            setEditingService({ ...editingService, faqs: updated });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C]"
                        />
                        <textarea
                          rows={3}
                          placeholder="Answer…"
                          value={faq.answer}
                          onChange={(e) => {
                            const updated = [...editingService.faqs];
                            updated[i] = { ...updated[i], answer: e.target.value };
                            setEditingService({ ...editingService, faqs: updated });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#C7A76C] resize-none"
                        />
                      </div>
                    ))}
                    {(!editingService.faqs || editingService.faqs.length === 0) && (
                      <p className="text-xs text-slate-400 text-center py-6">No FAQs yet. Click "+ Add Question".</p>
                    )}
                  </div>
                )}

                {/* ─── SEO TAB ─── */}
                {activeTab === 'seo' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-bold text-[#10243A] uppercase mb-1.5">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        placeholder="SEO page title (60 chars recommended)"
                        value={editingService.metaTitle}
                        onChange={(e) =>
                          setEditingService({ ...editingService, metaTitle: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#C7A76C]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#10243A] uppercase mb-1.5">
                        Meta Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="SEO description (160 chars recommended)"
                        value={editingService.metaDescription}
                        onChange={(e) =>
                          setEditingService({ ...editingService, metaDescription: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#C7A76C] resize-none"
                      />
                    </div>
                    <div className="p-4 bg-[#f0f6fb] rounded-xl border border-[#2376b8]/20">
                      <p className="text-[10px] font-bold text-[#2376b8] uppercase mb-2">Google Preview</p>
                      <p className="text-sm font-semibold text-[#1a0dab] truncate">
                        {editingService.metaTitle || editingService.name || 'Service Name'}
                      </p>
                      <p className="text-xs text-[#006621] mt-0.5">
                        https://finassetwealth.com/services/{editingService.slug || '…'}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {editingService.metaDescription || editingService.shortDescription || 'No description set.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 flex justify-between items-center gap-3">
                <div className="flex gap-2">
                  {tabs.map((tab, i) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        activeTab === tab.id ? 'bg-[#C7A76C]' : 'bg-slate-200 hover:bg-slate-300'
                      }`}
                      title={tab.label}
                    />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#10243A] hover:bg-[#1b3858] disabled:opacity-60 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#C7A76C]" />
                    ) : (
                      <Save className="w-4 h-4 text-[#C7A76C]" />
                    )}
                    <span>{saving ? 'Saving…' : 'Save Service'}</span>
                  </button>
                </div>
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
        title="Delete Service"
        itemName={deleteTarget?.name}
        warningDetails="This will permanently delete this service discipline from the database and remove its public URL."
        isDeleting={isDeletingTarget}
      />
    </div>
  );
}
