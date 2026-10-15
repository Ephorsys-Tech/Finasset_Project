'use client';

import { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowUpDown,
  X,
  Save,
} from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/v1/admin/services');
      const json = await res.json();
      if (json.success) setServices(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingService({
      name: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      iconName: 'TrendingUp',
      displayOrder: services.length,
      isPublished: true,
      keyBenefits: [{ title: '', description: '' }],
      faqs: [{ question: '', answer: '' }],
    });
  };

  const handleOpenEdit = (s) => {
    setIsNew(false);
    setEditingService(JSON.parse(JSON.stringify(s)));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const method = isNew ? 'POST' : 'PUT';
      const payload = isNew ? editingService : { id: editingService._id, ...editingService };

      const res = await fetch('/api/v1/admin/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setMsg({ type: 'success', text: `Service '${editingService.name}' saved successfully!` });
        setEditingService(null);
        fetchServices();
      } else {
        setMsg({ type: 'error', text: data.message || 'Failed to save service' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error saving service' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete '${name}'? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/v1/admin/services?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchServices();
      } else {
        alert(data.message);
      }
    } catch {
      alert('Error deleting service');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#10243A]">Services Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, order, and publish financial advisory disciplines.
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

      {msg.text && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold">
                <th className="py-4 px-6">Order</th>
                <th className="py-4 px-6">Service Name</th>
                <th className="py-4 px-6">Slug (URL)</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">FAQs</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-400">
                    #{s.displayOrder}
                  </td>
                  <td className="py-4 px-6 font-bold text-[#10243A] text-sm">
                    {s.name}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-500">
                    /services/{s.slug}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        s.isPublished
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {s.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">
                    {s.faqs?.length || 0} questions
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-2 text-slate-600 hover:text-[#10243A] hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Service"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id, s.name)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#10243A]">
                  {isNew ? 'Create New Advisory Service' : `Edit: ${editingService.name}`}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update descriptions, benefits, and customer FAQs.
                </p>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = isNew
                        ? name.toLowerCase().replace(/[^a-z0-9]/g, '-')
                        : editingService.slug;
                      setEditingService({ ...editingService, name, slug });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#C7A76C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">
                    Slug (URL Key) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.slug}
                    onChange={(e) =>
                      setEditingService({ ...editingService, slug: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-mono focus:outline-none focus:border-[#C7A76C]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">
                  Short Summary (Homepage Card) *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.shortDescription}
                  onChange={(e) =>
                    setEditingService({ ...editingService, shortDescription: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-[#C7A76C]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#10243A] uppercase mb-1">
                  Full Detailed Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingService.fullDescription}
                  onChange={(e) =>
                    setEditingService({ ...editingService, fullDescription: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-[#C7A76C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingService.displayOrder}
                    onChange={(e) =>
                      setEditingService({ ...editingService, displayOrder: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-[#C7A76C]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">
                    Icon Style
                  </label>
                  <select
                    value={editingService.iconName}
                    onChange={(e) =>
                      setEditingService({ ...editingService, iconName: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-[#C7A76C]"
                  >
                    <option value="TrendingUp">TrendingUp (Growth)</option>
                    <option value="Compass">Compass (Planning)</option>
                    <option value="ShieldCheck">ShieldCheck (Insurance)</option>
                    <option value="Building">Building (Real Estate)</option>
                    <option value="Landmark">Landmark (Bonds/FDs)</option>
                    <option value="PieChart">PieChart (PMS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">
                    Publication Status
                  </label>
                  <select
                    value={editingService.isPublished ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        isPublished: e.target.value === 'true',
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-[#C7A76C]"
                  >
                    <option value="true">Published (Visible to Public)</option>
                    <option value="false">Draft (Admin Only)</option>
                  </select>
                </div>
              </div>

              {/* FAQs Manager */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#10243A] uppercase">
                    Service FAQs ({editingService.faqs?.length || 0})
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

                {editingService.faqs?.map((faq, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
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
                        updated[i].question = e.target.value;
                        setEditingService({ ...editingService, faqs: updated });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                    />
                    <textarea
                      rows={2}
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => {
                        const updated = [...editingService.faqs];
                        updated[i].answer = e.target.value;
                        setEditingService({ ...editingService, faqs: updated });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#10243A] hover:bg-[#1b3858] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-[#C7A76C]" />
                  <span>{saving ? 'Saving...' : 'Save Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
