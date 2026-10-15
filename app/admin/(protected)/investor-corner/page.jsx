'use client';

import { useState, useEffect } from 'react';
import {
  Calculator,
  Save,
  CheckCircle2,
  AlertCircle,
  Target,
  Edit2,
  Trash2,
  Plus,
} from 'lucide-react';

export default function AdminInvestorCornerPage() {
  const [tools, setTools] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tiles'); // 'tiles' | 'calculator' | 'questionnaires'
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/v1/admin/investor-corner');
      const json = await res.json();
      if (json.success) {
        setTools(json.data.tools || []);
        setQuestionnaires(json.data.questionnaires || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateTool = async (tool) => {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/v1/admin/investor-corner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'tool', data: tool }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Tool "${tool.title}" updated successfully!`);
        fetchData();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#10243A]">Investor&apos;s Corner & Tools</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure the 5 investor utility tiles, default calculator values, and risk profiler rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('tiles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tiles' ? 'bg-[#10243A] text-white' : 'bg-white border text-slate-600'
            }`}
          >
            Investor Tiles (5)
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'calculator' ? 'bg-[#10243A] text-white' : 'bg-white border text-slate-600'
            }`}
          >
            Calculator Defaults
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Tiles Tab */}
      {activeTab === 'tiles' && (
        <div className="space-y-6">
          {tools.map((tool, idx) => (
            <div
              key={tool._id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Tile #{idx + 1}: {tool.key}
                </span>
                <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {tool.isVisible ? 'Visible' : 'Hidden'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Title</label>
                  <input
                    type="text"
                    value={tool.title}
                    onChange={(e) => {
                      const updated = [...tools];
                      updated[idx].title = e.target.value;
                      setTools(updated);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={tool.badge}
                    onChange={(e) => {
                      const updated = [...tools];
                      updated[idx].badge = e.target.value;
                      setTools(updated);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={tool.shortDescription}
                    onChange={(e) => {
                      const updated = [...tools];
                      updated[idx].shortDescription = e.target.value;
                      setTools(updated);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Button CTA Text</label>
                  <input
                    type="text"
                    value={tool.actionText}
                    onChange={(e) => {
                      const updated = [...tools];
                      updated[idx].actionText = e.target.value;
                      setTools(updated);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#10243A] uppercase mb-1">Target URL</label>
                  <input
                    type="text"
                    value={tool.url}
                    onChange={(e) => {
                      const updated = [...tools];
                      updated[idx].url = e.target.value;
                      setTools(updated);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleUpdateTool(tools[idx])}
                  className="bg-[#10243A] hover:bg-[#1b3858] text-white font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-xl transition-all"
                >
                  Save Tile Changes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calculator Defaults Tab */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-[#10243A]">Calculator Default Assumptions</h2>
          <p className="text-xs text-slate-500">
            Customize initial slider values and disclaimers for the public SIP and Lumpsum calculator.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-[#10243A] uppercase mb-1">Default Monthly SIP (₹)</label>
              <input
                type="number"
                defaultValue={15000}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#10243A] uppercase mb-1">Default Tenure (Years)</label>
              <input
                type="number"
                defaultValue={15}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#10243A] uppercase mb-1">Default Expected Return (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                defaultValue={12.5}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-[#10243A] uppercase mb-1">Default Lumpsum Amount (₹)</label>
              <input
                type="number"
                defaultValue={500000}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert('Calculator defaults updated!')}
            className="bg-[#10243A] text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow"
          >
            Save Calculator Defaults
          </button>
        </div>
      )}
    </div>
  );
}
