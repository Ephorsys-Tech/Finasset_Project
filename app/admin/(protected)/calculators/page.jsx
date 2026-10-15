'use client';

import { useState, useEffect } from 'react';
import {
  Calculator,
  Save,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function AdminCalculatorsPage() {
  const [defaults, setDefaults] = useState({
    defaultSipAmount: 15000,
    defaultTenureYears: 15,
    defaultExpectedReturn: 12.5,
    defaultLumpsumAmount: 500000,
    disclaimer: 'Calculations are based on assumed rates of return compounded periodically and are for illustrative purposes only. They do not constitute guaranteed returns.',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/v1/admin/investor-corner')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.tools?.length) {
          const calcTool = json.data.tools.find((t) => t.key === 'calculator');
          if (calcTool?.calculatorDefaults) {
            setDefaults(calcTool.calculatorDefaults);
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch('/api/v1/admin/investor-corner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'tool',
          data: {
            id: 'calculator',
            calculatorDefaults: defaults,
          },
        }),
      });
      setMsg('Calculator default parameters and disclaimers saved successfully!');
    } catch {
      setMsg('Error saving parameters');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#10243A]">Calculator Configuration</h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize default slider amounts, return expectations, and regulatory disclaimers for public financial calculators.
        </p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-xs">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-[#10243A]">Default Initial Values</h2>
          <p className="text-xs text-slate-400">Values populated when visitors first land on the calculator.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-bold text-[#10243A] uppercase mb-1">
              Default Monthly SIP Amount (₹)
            </label>
            <input
              type="number"
              value={defaults.defaultSipAmount}
              onChange={(e) => setDefaults({ ...defaults, defaultSipAmount: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-[#10243A] uppercase mb-1">
              Default Lumpsum Investment (₹)
            </label>
            <input
              type="number"
              value={defaults.defaultLumpsumAmount}
              onChange={(e) => setDefaults({ ...defaults, defaultLumpsumAmount: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-[#10243A] uppercase mb-1">
              Default Expected Return (% p.a.)
            </label>
            <input
              type="number"
              step="0.1"
              value={defaults.defaultExpectedReturn}
              onChange={(e) => setDefaults({ ...defaults, defaultExpectedReturn: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-[#10243A] uppercase mb-1">
              Default Horizon (Years)
            </label>
            <input
              type="number"
              value={defaults.defaultTenureYears}
              onChange={(e) => setDefaults({ ...defaults, defaultTenureYears: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-[#10243A] uppercase mb-1">
            Statutory Calculator Assumption Disclaimer
          </label>
          <textarea
            rows={3}
            value={defaults.disclaimer}
            onChange={(e) => setDefaults({ ...defaults, disclaimer: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 leading-relaxed"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#10243A] hover:bg-[#1b3858] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#C7A76C]" />
            <span>{saving ? 'Saving...' : 'Save Calculator Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
