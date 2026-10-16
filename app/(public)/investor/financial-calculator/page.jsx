'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { formatINR, calculateSipProjection, calculateLumpsumProjection } from '@/lib/utils';

export default function FinancialCalculatorPage() {
  const [mode, setMode] = useState('sip'); // 'sip' | 'lumpsum'

  // SIP states
  const [sipMonthly, setSipMonthly] = useState(15000);
  const [sipRate, setSipRate] = useState(12.5);
  const [sipYears, setSipYears] = useState(15);

  // Lumpsum states
  const [lumpsumPrincipal, setLumpsumPrincipal] = useState(500000);
  const [lumpsumRate, setLumpsumRate] = useState(12.0);
  const [lumpsumYears, setLumpsumYears] = useState(10);

  const sipResult = calculateSipProjection(sipMonthly, sipRate, sipYears);
  const lumpsumResult = calculateLumpsumProjection(lumpsumPrincipal, lumpsumRate, lumpsumYears);

  const activeResult = mode === 'sip' ? sipResult : lumpsumResult;
  const investedPct = activeResult.totalValue > 0
    ? Math.round((activeResult.investedAmount / activeResult.totalValue) * 100)
    : 50;
  const returnsPct = 100 - investedPct;

  // Generate Year-by-Year Table Preview (for up to active years)
  const yearsArray = [];
  const activeYears = mode === 'sip' ? sipYears : lumpsumYears;
  const step = activeYears <= 10 ? 1 : activeYears <= 20 ? 2 : 5;

  for (let y = 1; y <= activeYears; y += step) {
    const res = mode === 'sip'
      ? calculateSipProjection(sipMonthly, sipRate, y)
      : calculateLumpsumProjection(lumpsumPrincipal, lumpsumRate, y);
    yearsArray.push({ year: y, ...res });
  }
  // Ensure final year is included
  if (yearsArray[yearsArray.length - 1]?.year !== activeYears) {
    const finalRes = mode === 'sip'
      ? calculateSipProjection(sipMonthly, sipRate, activeYears)
      : calculateLumpsumProjection(lumpsumPrincipal, lumpsumRate, activeYears);
    yearsArray.push({ year: activeYears, ...finalRes });
  }

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Banner */}
      <section className="bg-[#0f2b44] text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2376b8]/20 border border-[#2376b8]/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5 text-[#2376b8]" />
            <span>Interactive Compounding Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Financial Wealth Calculator
          </h1>
          <p className="text-slate-300 mt-4 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
            Experience the exponential compounding power of disciplined investing. Simulate Systematic Investment Plans (SIP) or lump sum wealth creation over your chosen horizon.
          </p>
        </div>
      </section>

      {/* Main Calculator */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mode Switcher */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center">
              <button
                onClick={() => setMode('sip')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                  mode === 'sip'
                    ? 'bg-[#0f2b44] text-white shadow-md'
                    : 'text-slate-600 hover:text-[#2376b8]'
                }`}
              >
                SIP (Monthly Investment)
              </button>
              <button
                onClick={() => setMode('lumpsum')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                  mode === 'lumpsum'
                    ? 'bg-[#0f2b44] text-white shadow-md'
                    : 'text-slate-600 hover:text-[#2376b8]'
                }`}
              >
                Lumpsum (One-Time Investment)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Inputs (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
              {mode === 'sip' ? (
                <>
                  {/* Monthly Investment */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-bold text-sm text-[#0f2b44]">
                        Monthly Investment Amount
                      </label>
                      <span className="text-lg font-extrabold text-[#0f2b44] bg-[#f8fafc] px-4 py-1.5 rounded-lg border border-slate-200">
                        {formatINR(sipMonthly)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={200000}
                      step={1000}
                      value={sipMonthly}
                      onChange={(e) => setSipMonthly(Number(e.target.value))}
                      className="w-full accent-[#f87b1f] h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹1,000</span>
                      <span>₹1,00,000</span>
                      <span>₹2,00,000</span>
                    </div>
                  </div>

                  {/* Return Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-bold text-sm text-[#0f2b44]">
                        Expected Annual Return Rate (% p.a.)
                      </label>
                      <span className="text-lg font-extrabold text-[#0f2b44] bg-[#f8fafc] px-4 py-1.5 rounded-lg border border-slate-200">
                        {sipRate}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={6}
                      max={24}
                      step={0.5}
                      value={sipRate}
                      onChange={(e) => setSipRate(Number(e.target.value))}
                      className="w-full accent-[#f87b1f] h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>6% (Conservative Debt)</span>
                      <span>12-14% (Equity Historical)</span>
                      <span>24% (Aggressive)</span>
                    </div>
                  </div>

                  {/* Time Horizon */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-bold text-sm text-[#0f2b44]">
                        Investment Time Period
                      </label>
                      <span className="text-lg font-extrabold text-[#0f2b44] bg-[#f8fafc] px-4 py-1.5 rounded-lg border border-slate-200">
                        {sipYears} {sipYears === 1 ? 'Year' : 'Years'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={35}
                      step={1}
                      value={sipYears}
                      onChange={(e) => setSipYears(Number(e.target.value))}
                      className="w-full accent-[#f87b1f] h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>1 Year</span>
                      <span>15 Years</span>
                      <span>35 Years</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Lumpsum Amount */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-bold text-sm text-[#0f2b44]">
                        Total Lumpsum Investment
                      </label>
                      <span className="text-lg font-extrabold text-[#0f2b44] bg-[#f8fafc] px-4 py-1.5 rounded-lg border border-slate-200">
                        {formatINR(lumpsumPrincipal)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={25000}
                      max={5000000}
                      step={25000}
                      value={lumpsumPrincipal}
                      onChange={(e) => setLumpsumPrincipal(Number(e.target.value))}
                      className="w-full accent-[#f87b1f] h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹25,000</span>
                      <span>₹25,00,000</span>
                      <span>₹50,00,000</span>
                    </div>
                  </div>

                  {/* Return Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-bold text-sm text-[#0f2b44]">
                        Expected Annual Return Rate (% p.a.)
                      </label>
                      <span className="text-lg font-extrabold text-[#0f2b44] bg-[#f8fafc] px-4 py-1.5 rounded-lg border border-slate-200">
                        {lumpsumRate}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={6}
                      max={24}
                      step={0.5}
                      value={lumpsumRate}
                      onChange={(e) => setLumpsumRate(Number(e.target.value))}
                      className="w-full accent-[#f87b1f] h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>6% (Debt/FD)</span>
                      <span>12% (Equity)</span>
                      <span>24% (PMS Alpha)</span>
                    </div>
                  </div>

                  {/* Time Horizon */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-bold text-sm text-[#0f2b44]">
                        Investment Time Period
                      </label>
                      <span className="text-lg font-extrabold text-[#0f2b44] bg-[#f8fafc] px-4 py-1.5 rounded-lg border border-slate-200">
                        {lumpsumYears} {lumpsumYears === 1 ? 'Year' : 'Years'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={30}
                      step={1}
                      value={lumpsumYears}
                      onChange={(e) => setLumpsumYears(Number(e.target.value))}
                      className="w-full accent-[#f87b1f] h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>1 Year</span>
                      <span>15 Years</span>
                      <span>30 Years</span>
                    </div>
                  </div>
                </>
              )}

              {/* Explanatory Note */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#2376b8] shrink-0 mt-0.5" />
                <span>
                  <strong>Did you know?</strong> An investment of ₹15,000/month compounding at 12.5% for 20 years yields approximately ₹1.48 Crore against an actual out-of-pocket investment of just ₹36 Lakhs. Time is your greatest wealth creator.
                </span>
              </div>
            </div>

            {/* Right Results & Visuals (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0f2b44] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-[#f87b1f] block mb-1">
                  Projected Wealth Outcome
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight">
                  {formatINR(activeResult.totalValue)}
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Expected value after {mode === 'sip' ? sipYears : lumpsumYears} years
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Total Invested Capital:</span>
                    <span className="font-bold text-white">{formatINR(activeResult.investedAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Estimated Wealth Gain:</span>
                    <span className="font-bold text-[#89b441]">
                      +{formatINR(activeResult.estimatedReturns)}
                    </span>
                  </div>

                  {/* Proportion Bar */}
                  <div className="pt-2">
                    <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${investedPct}%` }}
                        className="bg-[#2376b8] transition-all duration-500"
                        title={`Invested: ${investedPct}%`}
                      />
                      <div
                        style={{ width: `${returnsPct}%` }}
                        className="bg-[#89b441] transition-all duration-500"
                        title={`Returns: ${returnsPct}%`}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2376b8]" />
                        Invested ({investedPct}%)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#89b441]" />
                        Gains ({returnsPct}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800">
                  <Link
                    href="/contact-us#callback"
                    className="w-full bg-[#f87b1f] hover:bg-[#d9620b] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f87b1f]/20"
                  >
                    <span>Start This Investment Journey</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Regulatory Disclaimer */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-700">Important Assumption Disclaimer:</strong> Calculations are based on assumed rates of return compounded periodically and are meant strictly for illustrative purposes. Mutual Fund investments are subject to market risks; past performance does not assure or guarantee future returns.
              </div>
            </div>
          </div>

          {/* Year-by-Year Growth Table */}
          <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
            <h2 className="text-xl font-bold text-[#0f2b44] mb-4">
              Year-by-Year Compounding Progression
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4">Invested Capital</th>
                    <th className="py-3 px-4">Compounded Growth</th>
                    <th className="py-3 px-4">Total Portfolio Corpus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {yearsArray.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#0f2b44]">End of Year {row.year}</td>
                      <td className="py-3 px-4 text-slate-600">{formatINR(row.investedAmount)}</td>
                      <td className="py-3 px-4 text-[#89b441] font-semibold">+{formatINR(row.estimatedReturns)}</td>
                      <td className="py-3 px-4 font-bold text-[#0f2b44]">{formatINR(row.totalValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
