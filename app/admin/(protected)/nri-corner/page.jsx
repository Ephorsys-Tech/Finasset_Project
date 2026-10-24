'use client';

import { useState, useEffect } from 'react';
import {
  Globe,
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
  BookOpen,
} from 'lucide-react';
import { useNriStore } from '@/store/useNriStore';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function AdminNriCornerPage() {
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
  } = useNriStore();

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
      description: '',
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
    if (!editingItem.title?.trim() || !editingItem.description?.trim()) {
      setMsg({ type: 'error', text: 'Title and description are required.' });
      return;
    }

    setMsg({ type: '', text: '' });

    try {
      if (isNew) {
        await createItem(editingItem);
        setMsg({
          type: 'success',
          text: 'New NRI topic added successfully!',
        });
      } else {
        await updateItem(editingItem._id, editingItem);
        setMsg({
          type: 'success',
          text: 'NRI topic updated successfully!',
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
      setMsg({ type: 'success', text: `Topic "${deleteTarget.title}" deleted successfully.` });
      setDeleteTarget(null);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Failed to delete topic.' });
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

  const handleMoveOrder = async (item, direction) => {
    const currentIndex = items.findIndex((i) => i._id === item._id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const targetItem = items[targetIndex];
    const currentOrder = item.order || currentIndex + 1;
    const targetOrder = targetItem.order || targetIndex + 1;

    try {
      await swapOrder(
        { _id: item._id, order: targetOrder },
        { _id: targetItem._id, order: currentOrder }
      );
    } catch {
      setMsg({ type: 'error', text: 'Failed to update topic order.' });
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'published'
        ? item.isPublished
        : !item.isPublished;
    return matchesSearch && matchesStatus;
  });

  const publishedCount = items.filter((i) => i.isPublished).length;
  const draftCount = items.length - publishedCount;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0f2b44] to-[#1e4870] flex items-center justify-center text-white shadow-md shrink-0">
            <Globe className="w-6 h-6 text-[#f87b1f]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#0f2b44]">NRI Corner Content</h1>
            <p className="text-xs text-slate-500 mt-1">
              Add and manage topics, FAQs, definitions, and advisory descriptions displayed on the public NRI Corner page.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/nri-corner"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>View Live</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2376b8] hover:bg-[#1b5d92] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#2376b8]/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Topic</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {msg.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 border ${
            msg.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {msg.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{msg.text}</span>
          <button
            onClick={() => setMsg({ type: '', text: '' })}
            className="ml-auto text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats and Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Topics</span>
            <div className="text-2xl font-black text-[#0f2b44] mt-0.5">{items.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2376b8] flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Published</span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{publishedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Drafts / Hidden</span>
            <div className="text-2xl font-black text-slate-500 mt-0.5">{draftCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topic title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2376b8]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'published', 'draft'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                statusFilter === filter
                  ? 'bg-[#0f2b44] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
            <div className="animate-spin w-8 h-8 border-4 border-[#2376b8] border-t-transparent rounded-full mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">Loading NRI Corner topics...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
            <Globe className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#0f2b44]">No NRI topics found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search ? 'No topics matched your search filter.' : 'Click "Add Topic" above to create your first NRI Corner topic.'}
            </p>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:border-[#2376b8]/40 hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0f2b44]/5 text-[#0f2b44] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                    #{item.order ?? idx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0f2b44] leading-snug">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          item.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {item.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleMoveOrder(item, 'up')}
                    disabled={idx === 0}
                    title="Move Up"
                    className="p-2 rounded-xl text-slate-400 hover:text-[#0f2b44] hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveOrder(item, 'down')}
                    disabled={idx === filteredItems.length - 1}
                    title="Move Down"
                    className="p-2 rounded-xl text-slate-400 hover:text-[#0f2b44] hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl text-slate-600 hover:text-[#2376b8] hover:bg-[#f0f6fb] transition-colors"
                    title="Edit Topic"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: item._id, title: item.title })}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Topic"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description Preview */}
              <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-100 text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                {item.description}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2376b8]/10 text-[#2376b8] flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0f2b44]">
                    {isNew ? 'Add New NRI Topic' : 'Edit NRI Topic'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Heading and descriptive content for the public NRI Corner page.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                disabled={saving}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0f2b44] mb-1.5 uppercase tracking-wider">
                  Topic Title / Question Heading *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Who is a Non-Resident Indian (NRI)?"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2376b8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f2b44] mb-1.5 uppercase tracking-wider">
                  Detailed Description / Answer *
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Enter the detailed regulatory explanation, rules, guidelines, or points..."
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2376b8] leading-relaxed font-sans"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Tip: Line breaks, numbered lists, and paragraphs will be preserved cleanly on the public page.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0f2b44] mb-1.5 uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.order}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, order: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#2376b8]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingItem.isPublished}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, isPublished: e.target.checked })
                      }
                      className="w-4 h-4 text-[#2376b8] rounded border-slate-300 focus:ring-[#2376b8]"
                    />
                    <span className="text-xs font-bold text-[#0f2b44]">
                      Publish immediately on public website
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2376b8] hover:bg-[#1b5d92] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#2376b8]/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : isNew ? 'Create Topic' : 'Save Changes'}</span>
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
        title="Delete NRI Topic"
        itemName={deleteTarget?.title}
        message="Are you sure you want to delete this NRI Corner topic? This action cannot be undone."
        warningDetails="This topic will be permanently removed from the public NRI Corner page."
        confirmText="Yes, Delete Topic"
        isDeleting={isDeletingTarget}
      />
    </div>
  );
}
