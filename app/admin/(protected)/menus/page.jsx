'use client';

import { useState, useEffect } from 'react';
import {
  Menu as MenuIcon,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  ArrowUpDown,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function AdminMenuManagerPage() {
  const [location, setLocation] = useState('header');
  const [menus, setMenus] = useState([]);
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchMenus = async () => {
    try {
      const res = await fetch('/api/v1/admin/menus');
      const json = await res.json();
      if (json.success && json.data) {
        setMenus(json.data);
        const current = json.data.find((m) => m.location === location);
        if (current) setItems(current.items || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    const current = menus.find((m) => m.location === location);
    setItems(current?.items ? JSON.parse(JSON.stringify(current.items)) : []);
  }, [location, menus]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { label: 'New Link', url: '/', order: items.length, isVisible: true, isExternal: false },
    ]);
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/v1/admin/menus', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, items }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Saved ${location} navigation successfully!`);
        fetchMenus();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#10243A]">Menu Manager</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure header and footer navigation links, labels, and order.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocation('header')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              location === 'header' ? 'bg-[#10243A] text-white' : 'bg-white border text-slate-600'
            }`}
          >
            Header Menu
          </button>
          <button
            onClick={() => setLocation('footer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              location === 'footer' ? 'bg-[#10243A] text-white' : 'bg-white border text-slate-600'
            }`}
          >
            Footer Menu
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <span className="text-xs font-bold uppercase text-slate-400">
            {location.toUpperCase()} Navigation Items ({items.length})
          </span>
          <button
            type="button"
            onClick={handleAddItem}
            className="text-xs font-bold text-[#C7A76C] hover:underline"
          >
            + Add Link
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3 text-xs"
            >
              <div className="w-8 font-mono text-slate-400 font-bold text-center">
                #{idx + 1}
              </div>
              <input
                type="text"
                placeholder="Label (e.g. Services)"
                value={item.label}
                onChange={(e) => {
                  const updated = [...items];
                  updated[idx].label = e.target.value;
                  setItems(updated);
                }}
                className="w-full sm:w-48 bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-[#10243A]"
              />
              <input
                type="text"
                placeholder="URL (e.g. /services)"
                value={item.url}
                onChange={(e) => {
                  const updated = [...items];
                  updated[idx].url = e.target.value;
                  setItems(updated);
                }}
                className="w-full sm:flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-slate-600"
              />
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...items];
                    updated[idx].isVisible = !updated[idx].isVisible;
                    setItems(updated);
                  }}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                    item.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.isVisible ? 'Visible' : 'Hidden'}
                </button>
                <button
                  type="button"
                  onClick={() => setItems(items.filter((_, i) => i !== idx))}
                  className="p-1.5 text-rose-500 hover:text-rose-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#10243A] hover:bg-[#1b3858] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-[#C7A76C]" />
            <span>{saving ? 'Saving...' : `Save ${location} Menu`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
