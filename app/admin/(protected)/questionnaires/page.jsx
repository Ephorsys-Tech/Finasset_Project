'use client';

import { useState, useEffect } from 'react';
import {
  Target,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Activity,
  Layers,
} from 'lucide-react';

export default function AdminQuestionnairesPage() {
  const [selectedCode, setSelectedCode] = useState('risk-profile');
  const [questionnaire, setQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchQuestionnaire = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/public/questionnaires/${selectedCode}`);
      const json = await res.json();
      if (json.success) {
        setQuestionnaire(json.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionnaire();
  }, [selectedCode]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch('/api/v1/admin/investor-corner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'questionnaire',
          data: questionnaire,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Questionnaire '${selectedCode}' updated successfully!`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#10243A]">Questionnaires & Scoring Manager</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure psychometric questions, options, point weights, and resulting risk bands.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCode('risk-profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCode === 'risk-profile'
                ? 'bg-[#10243A] text-white shadow-sm'
                : 'bg-white border text-slate-600'
            }`}
          >
            Risk Profiler
          </button>
          <button
            onClick={() => setSelectedCode('financial-fitness')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCode === 'financial-fitness'
                ? 'bg-[#10243A] text-white shadow-sm'
                : 'bg-white border text-slate-600'
            }`}
          >
            Financial Fitness
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading questionnaire...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          {/* Header Info */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#10243A] uppercase mb-1">
                Questionnaire Title
              </label>
              <input
                type="text"
                value={questionnaire?.title || ''}
                onChange={(e) => setQuestionnaire({ ...questionnaire, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-[#10243A] uppercase mb-1">
                Description / Purpose
              </label>
              <textarea
                rows={2}
                value={questionnaire?.description || ''}
                onChange={(e) => setQuestionnaire({ ...questionnaire, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700"
              />
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-[#10243A]">
              Questions & Answer Options ({questionnaire?.questions?.length || 0})
            </h2>

            <div className="space-y-6">
              {questionnaire?.questions?.map((q, qIdx) => (
                <div key={q.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#10243A]">
                      Question #{qIdx + 1} ({q.category})
                    </span>
                  </div>

                  <input
                    type="text"
                    value={q.title}
                    onChange={(e) => {
                      const updated = { ...questionnaire };
                      updated.questions[qIdx].title = e.target.value;
                      setQuestionnaire(updated);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 font-bold text-slate-800"
                  />

                  {/* Options */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Options & Points</span>
                    {q.options?.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const updated = { ...questionnaire };
                            updated.questions[qIdx].options[optIdx].text = e.target.value;
                            setQuestionnaire(updated);
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5"
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-slate-400">Pts:</span>
                          <input
                            type="number"
                            value={opt.score}
                            onChange={(e) => {
                              const updated = { ...questionnaire };
                              updated.questions[qIdx].options[optIdx].score = Number(e.target.value);
                              setQuestionnaire(updated);
                            }}
                            className="w-14 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-center font-bold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Result Bands */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-[#10243A]">
              Scoring Result Bands ({questionnaire?.resultBands?.length || 0})
            </h2>

            <div className="space-y-4">
              {questionnaire?.resultBands?.map((band, bIdx) => (
                <div key={bIdx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-[#10243A] uppercase mb-1">Band Title</label>
                      <input
                        type="text"
                        value={band.title}
                        onChange={(e) => {
                          const updated = { ...questionnaire };
                          updated.resultBands[bIdx].title = e.target.value;
                          setQuestionnaire(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#10243A] uppercase mb-1">Score Range</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={band.minScore}
                          onChange={(e) => {
                            const updated = { ...questionnaire };
                            updated.resultBands[bIdx].minScore = Number(e.target.value);
                            setQuestionnaire(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-center"
                        />
                        <span>to</span>
                        <input
                          type="number"
                          value={band.maxScore}
                          onChange={(e) => {
                            const updated = { ...questionnaire };
                            updated.resultBands[bIdx].maxScore = Number(e.target.value);
                            setQuestionnaire(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-center"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#10243A] uppercase mb-1">Recommendation</label>
                    <textarea
                      rows={2}
                      value={band.recommendation}
                      onChange={(e) => {
                        const updated = { ...questionnaire };
                        updated.resultBands[bIdx].recommendation = e.target.value;
                        setQuestionnaire(updated);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#10243A] hover:bg-[#1b3858] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl shadow transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#C7A76C]" />
              <span>{saving ? 'Saving...' : 'Save Questionnaire & Scoring'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
