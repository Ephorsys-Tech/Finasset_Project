'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Search,
  Building2,
  Link as LinkIcon,
} from 'lucide-react';
import { usePayPremiumStore } from '@/store/usePayPremiumStore';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function AdminPayPremiumPage() {
  const {
    adminItems: items,
    isLoading: loading,
    isSaving: saving,
    fetchItems,
    createItem,
    updateItem,
    togglePublish,
    swapOrder,
    deleteItem,
  } = usePayPremiumStore();

  const [editingItem, setEditingItem] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeletingTarget, setIsDeletingTarget] = useState(false);

  useEffect(() => {
    fetchItems(true);
  }, [fetchItems]);

  const handleOpenNew = () => {
    setIsNew(true);
    setMsg({ type: '', text: '' });
    setEditingItem({
      title: '',
      shortTitle: '',
      description: '',
      link: '',
      order: items.length + 1,
      isPublished: true,
    });
  };

  const handleOpenEdit = (item) => {
    setIsNew(false);
    setMsg({ type: '', text: '' });
    setEditingItem(JSON.parse(JSON.stringify(item)));
  };

  const handleCloseModal = () => {
    if (saving) return;
    setEditingItem(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingItem.title?.trim()) {
      setMsg({ type: 'error', text: 'Title is required.' });
      return;
    }
    if (!editingItem.shortTitle?.trim()) {
      setMsg({ type: 'error', text: 'Short Title / Code is required.' });
      return;
    }
    if (!editingItem.description?.trim()) {
      setMsg({ type: 'error', text: 'Description is required.' });
      return;
    }
    if (!editingItem.link?.trim()) {
      setMsg({ type: 'error', text: 'Payment portal link is required.' });
      return;
    }

    setMsg({ type: '', text: '' });

    try {
      if (isNew) {
        await createItem(editingItem);
        setMsg({
          type: 'success',
          text: 'New Pay Premium item added successfully!',
        });
      } else {
        await updateItem(editingItem._id, editingItem);
        setMsg({
          type: 'success',
          text: 'Pay Premium item updated successfully!',
        });
      }
      setEditingItem(null);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Operation failed' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeletingTarget(true);

    try {
      await deleteItem(deleteTarget.id);
      setMsg({
        type: 'success',
        text: `Pay Premium item "${deleteTarget.title}" deleted successfully.`,
      });
      setDeleteTarget(null);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to delete item.' });
    } finally {
      setIsDeletingTarget(false);
    }
  };

  const handleTogglePublish = async (item) => {
    try {
      await togglePublish(item);
    } catch {
      setMsg({ type: 'error', text: 'Failed to toggle status.' });
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredItems.length) return;

    const current = filteredItems[index];
    const target = filteredItems[targetIndex];

    const currentOrder = current.order || index + 1;
    const targetOrder = target.order || targetIndex + 1;

    try {
      await swapOrder(
        { _id: current._id, order: targetOrder },
        { _id: target._id, order: currentOrder }
      );
    } catch {
      setMsg({ type: 'error', text: 'Failed to reorder items.' });
    }
  };

  // Filter items based on search and publish status
  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.shortTitle || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.link || '').toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'published'
          ? item.isPublished !== false
          : item.isPublished === false;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#0f2b44]/10 text-[#0f2b44] rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0f2b44]">
              Pay Premium Gateways
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage life insurance renewal payment links, short titles, and direct portals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/investor/pay-premium"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>View Live Page</span>
          </a>
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0f2b44] hover:bg-[#2376b8] text-white text-xs font-semibold rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Insurer</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {msg.text && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm font-medium border ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {msg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{msg.text}</span>
          </div>
          <button
            onClick={() => setMsg({ type: '', text: '' })}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Insurers
            </div>
            <div className="text-2xl font-bold text-[#0f2b44] mt-1">
              {items.length}
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-[#2376b8] rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Published & Live
            </div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {items.filter((i) => i.isPublished !== false).length}
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Draft / Hidden
            </div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {items.filter((i) => i.isPublished === false).length}
            </div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Controls: Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search insurer name, code, link..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2376b8] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#2376b8]"
          >
            <option value="all">All Statuses ({items.length})</option>
            <option value="published">
              Published ({items.filter((i) => i.isPublished !== false).length})
            </option>
            <option value="draft">
              Draft ({items.filter((i) => i.isPublished === false).length})
            </option>
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && items.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs sm:text-sm">
            <div className="animate-spin w-8 h-8 border-3 border-[#2376b8] border-t-transparent rounded-full mx-auto mb-3" />
            Loading Pay Premium items...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-700">No items found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search || statusFilter !== 'all'
                ? 'No items match your filter criteria.'
                : 'No insurer payment gateways have been created yet. Click "Add New Insurer" above to add one manually.'}
            </p>
            {!search && statusFilter === 'all' && (
              <button
                onClick={handleOpenNew}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#0f2b44] hover:bg-[#2376b8] text-white text-xs font-semibold rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Insurer</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-16 text-center">Order</th>
                  <th className="py-3.5 px-4">Insurer Details</th>
                  <th className="py-3.5 px-4">Direct Payment Portal</th>
                  <th className="py-3.5 px-4 w-28 text-center">Status</th>
                  <th className="py-3.5 px-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredItems.map((item, index) => {
                  const avatarCode =
                    item.shortTitle?.slice(0, 3).toUpperCase() ||
                    item.title?.slice(0, 2).toUpperCase() ||
                    'IN';

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Order and Move Buttons */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="font-bold text-slate-800 text-xs">
                            #{item.order || index + 1}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleMove(index, 'up')}
                              disabled={index === 0}
                              className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:hover:bg-transparent"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMove(index, 'down')}
                              disabled={index === filteredItems.length - 1}
                              className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:hover:bg-transparent"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Insurer Info (Card Elements) */}
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#0f2b44]/5 text-[#0f2b44] font-black text-xs flex items-center justify-center border border-[#0f2b44]/10 shrink-0">
                            {avatarCode}
                          </div>
                          <div className="space-y-1 max-w-md">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0f2b44] text-sm">
                                {item.title}
                              </span>
                              <span className="text-[10px] font-semibold text-[#2376b8] bg-[#f0f6fb] border border-[#2376b8]/20 px-2 py-0.5 rounded-full">
                                {item.shortTitle}
                              </span>
                            </div>
                            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Direct Link */}
                      <td className="py-4 px-4">
                        <div className="max-w-xs">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-[#2376b8] hover:underline font-medium break-all group-hover:text-[#0f2b44] transition-colors"
                          >
                            <LinkIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            <span className="truncate max-w-[220px]">{item.link}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                          </a>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                            item.isPublished !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {item.isPublished !== false ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" />
                              <span>Live</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-slate-400" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0f2b44] hover:bg-slate-100 transition-colors"
                            title="Edit Insurer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget({
                                id: item._id,
                                title: item.title,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Insurer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Create Modal: Strictly Title, Short Title, Description, Link */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#0f2b44]/10 text-[#0f2b44] rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                    {isNew ? 'Add New Insurer Gateway' : 'Edit Insurer Gateway'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Enter the card details: Title, Short Title, Description, and Link.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Field 1: Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Title (Insurer Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC Life Insurance"
                  value={editingItem.title || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2376b8] focus:bg-white transition-all"
                />
              </div>

              {/* Field 2: Short Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Short Title / Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC Life or HD"
                  value={editingItem.shortTitle || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, shortTitle: e.target.value })
                  }
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2376b8] focus:bg-white transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Used as the badge alias and the avatar monogram on the card.
                </p>
              </div>

              {/* Field 3: Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Official instant online payments gateway for all HDFC Life policy renewals."
                  value={editingItem.description || ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2376b8] focus:bg-white transition-all resize-y"
                />
              </div>

              {/* Field 4: Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Direct Payment Link <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://onlinepayments.hdfclife.com/"
                  value={editingItem.link || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, link: e.target.value })
                  }
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2376b8] focus:bg-white transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  The official URL opened when an investor clicks &quot;Pay Premium Online&quot;.
                </p>
              </div>

              {/* Order & Publish Settings */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.order || 1}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        order: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#2376b8] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Publish Status
                  </label>
                  <div className="flex items-center gap-2 pt-1.5">
                    <input
                      type="checkbox"
                      id="isPublishedCheck"
                      checked={editingItem.isPublished !== false}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          isPublished: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-[#2376b8] rounded border-slate-300 focus:ring-[#2376b8]"
                    />
                    <label
                      htmlFor="isPublishedCheck"
                      className="text-xs font-medium text-slate-700 cursor-pointer"
                    >
                      {editingItem.isPublished !== false ? 'Live on Website' : 'Draft / Hidden'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#0f2b44] hover:bg-[#2376b8] text-white rounded-xl text-xs font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{isNew ? 'Create Insurer' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Insurer Gateway"
        itemName={deleteTarget?.title}
        message="Are you sure you want to delete this payment gateway? This action cannot be undone."
        confirmText="Delete Gateway"
        cancelText="Cancel"
        isDeleting={isDeletingTarget}
      />
    </div>
  );
}
