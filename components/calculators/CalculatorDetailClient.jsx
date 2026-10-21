'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Coins,
  ArrowRightLeft,
  ArrowDownCircle,
  Umbrella,
  Clock,
  ShieldCheck,
  Percent,
  Receipt,
  Heart,
  GraduationCap,
  Home,
  Car,
  Plane,
  TrendingUp,
  BarChart3,
  LineChart,
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { formatINR, calculateSipProjection, calculateLumpsumProjection } from '@/lib/utils';
import { ALL_CALCULATORS } from '@/lib/calculatorsData';

const ICONS_MAP = {
  Calculator,
  Coins,
  ArrowRightLeft,
  ArrowDownCircle,
  Umbrella,
  Clock,
  ShieldCheck,
  Percent,
  Receipt,
  Heart,
  GraduationCap,
  Home,
  Car,
  Plane,
  TrendingUp,
  BarChart3,
  LineChart,
  Search,
};

export default function CalculatorDetailClient({ slug, tool }) {
  const Icon = ICONS_MAP[tool.iconName] || Calculator;

  // 1. SIP Calculator States
  const [sipMonthly, setSipMonthly] = useState(tool.defaultInputs?.amount || 15000);
  const [sipRate, setSipRate] = useState(tool.defaultInputs?.rate || 12.5);
  const [sipYears, setSipYears] = useState(tool.defaultInputs?.years || 15);

  // 2. Lumpsum States
  const [lumpAmount, setLumpAmount] = useState(tool.defaultInputs?.amount || 500000);
  const [lumpRate, setLumpRate] = useState(tool.defaultInputs?.rate || 12.0);
  const [lumpYears, setLumpYears] = useState(tool.defaultInputs?.years || 10);

  // 3. STP States
  const [stpCorpus, setStpCorpus] = useState(tool.defaultInputs?.sourceCorpus || 1000000);
  const [stpMonthly, setStpMonthly] = useState(tool.defaultInputs?.transferMonthly || 25000);
  const [stpRate, setStpRate] = useState(tool.defaultInputs?.rate || 12.0);
  const [stpYears, setStpYears] = useState(tool.defaultInputs?.years || 3);

  // 4. SWP States
  const [swpCorpus, setSwpCorpus] = useState(tool.defaultInputs?.corpus || 2500000);
  const [swpWithdrawal, setSwpWithdrawal] = useState(tool.defaultInputs?.withdrawal || 20000);
  const [swpRate, setSwpRate] = useState(tool.defaultInputs?.rate || 9.0);
  const [swpYears, setSwpYears] = useState(tool.defaultInputs?.years || 10);

  // 5. Retirement States
  const [retCurrentAge, setRetCurrentAge] = useState(tool.defaultInputs?.currentAge || 30);
  const [retRetireAge, setRetRetireAge] = useState(tool.defaultInputs?.retirementAge || 60);
  const [retExpense, setRetExpense] = useState(tool.defaultInputs?.monthlyExpense || 50000);
  const [retInflation, setRetInflation] = useState(tool.defaultInputs?.inflation || 6);
  const [retReturn, setRetReturn] = useState(tool.defaultInputs?.returnRate || 11);

  // 6. Delay States
  const [delayMonthly, setDelayMonthly] = useState(tool.defaultInputs?.monthlySip || 10000);
  const [delayYears, setDelayYears] = useState(tool.defaultInputs?.delayYears || 2);
  const [delayTotalYears, setDelayTotalYears] = useState(tool.defaultInputs?.totalYears || 20);
  const [delayRate, setDelayRate] = useState(tool.defaultInputs?.rate || 12.5);

  // 7. Life Insurance States
  const [insIncome, setInsIncome] = useState(tool.defaultInputs?.annualIncome || 1200000);
  const [insExpense, setInsExpense] = useState(tool.defaultInputs?.annualExpense || 600000);
  const [insLoans, setInsLoans] = useState(tool.defaultInputs?.loans || 2500000);
  const [insSavings, setInsSavings] = useState(tool.defaultInputs?.savings || 500000);
  const [insYears, setInsYears] = useState(tool.defaultInputs?.workingYears || 25);

  // 8. EMI States
  const [emiPrincipal, setEmiPrincipal] = useState(tool.defaultInputs?.loanAmount || 3000000);
  const [emiRate, setEmiRate] = useState(tool.defaultInputs?.interestRate || 9.0);
  const [emiYears, setEmiYears] = useState(tool.defaultInputs?.tenureYears || 15);

  // 9. TAX States
  const [taxIncome, setTaxIncome] = useState(tool.defaultInputs?.income || 1500000);
  const [tax80C, setTax80C] = useState(tool.defaultInputs?.section80C || 150000);
  const [tax80D, setTax80D] = useState(tool.defaultInputs?.section80D || 25000);
  const [taxNps, setTaxNps] = useState(tool.defaultInputs?.nps80CCD || 50000);

  // 10. Marriage States
  const [marrCost, setMarrCost] = useState(tool.defaultInputs?.currentCost || 2000000);
  const [marrYears, setMarrYears] = useState(tool.defaultInputs?.yearsAway || 8);
  const [marrInflation, setMarrInflation] = useState(tool.defaultInputs?.inflation || 7);
  const [marrReturn, setMarrReturn] = useState(tool.defaultInputs?.expectedReturn || 12);

  // 11. Education States
  const [eduCost, setEduCost] = useState(tool.defaultInputs?.currentCost || 2500000);
  const [eduYears, setEduYears] = useState(tool.defaultInputs?.yearsToCollege || 10);
  const [eduInflation, setEduInflation] = useState(tool.defaultInputs?.inflation || 10);
  const [eduReturn, setEduReturn] = useState(tool.defaultInputs?.expectedReturn || 12);

  // 12. Home Loan States
  const [homeProperty, setHomeProperty] = useState(tool.defaultInputs?.propertyCost || 6000000);
  const [homeDown, setHomeDown] = useState(tool.defaultInputs?.downPayment || 1200000);
  const [homeRate, setHomeRate] = useState(tool.defaultInputs?.interestRate || 8.5);
  const [homeYears, setHomeYears] = useState(tool.defaultInputs?.tenureYears || 20);

  // 13. Car Loan States
  const [carPrice, setCarPrice] = useState(tool.defaultInputs?.onRoadPrice || 1500000);
  const [carDown, setCarDown] = useState(tool.defaultInputs?.downPayment || 300000);
  const [carRate, setCarRate] = useState(tool.defaultInputs?.interestRate || 9.5);
  const [carYears, setCarYears] = useState(tool.defaultInputs?.tenureYears || 5);

  // 14. Vacation States
  const [vacCost, setVacCost] = useState(tool.defaultInputs?.estimatedCost || 350000);
  const [vacMonths, setVacMonths] = useState(tool.defaultInputs?.monthsAway || 18);
  const [vacReturn, setVacReturn] = useState(tool.defaultInputs?.expectedReturn || 7);

  // MF Tools Mock Selection
  const [mfSchemeSearch, setMfSchemeSearch] = useState('HDFC Top 100 Fund - Growth');
  const [mfCategory, setMfCategory] = useState('Flexi Cap Fund');
  const [mfTimeframe, setMfTimeframe] = useState('5 Years');

  // ==========================================
  // CALCULATIONS
  // ==========================================
  const sipResult = useMemo(() => calculateSipProjection(sipMonthly, sipRate, sipYears), [sipMonthly, sipRate, sipYears]);
  const lumpResult = useMemo(() => calculateLumpsumProjection(lumpAmount, lumpRate, lumpYears), [lumpAmount, lumpRate, lumpYears]);

  // STP Calc
  const stpResult = useMemo(() => {
    const totalTransferred = Math.min(stpCorpus, stpMonthly * stpYears * 12);
    const equityProjection = calculateSipProjection(stpMonthly, stpRate, stpYears);
    const remainingDebt = Math.max(0, stpCorpus - totalTransferred);
    return {
      transferred: totalTransferred,
      equityCorpus: equityProjection.totalValue,
      remainingDebt,
    };
  }, [stpCorpus, stpMonthly, stpRate, stpYears]);

  // SWP Calc
  const swpResult = useMemo(() => {
    let balance = Number(swpCorpus);
    const monthlyRate = Number(swpRate) / 100 / 12;
    const months = Number(swpYears) * 12;
    const w = Number(swpWithdrawal);
    let totalWithdrawn = 0;

    for (let m = 0; m < months; m++) {
      balance = balance * (1 + monthlyRate) - w;
      totalWithdrawn += w;
      if (balance <= 0) {
        balance = 0;
        break;
      }
    }
    return {
      totalWithdrawn: Math.round(totalWithdrawn),
      finalBalance: Math.round(balance),
    };
  }, [swpCorpus, swpWithdrawal, swpRate, swpYears]);

  // Retirement Calc
  const retirementResult = useMemo(() => {
    const yearsToRetire = Math.max(1, retRetireAge - retCurrentAge);
    const futureMonthlyExpense = retExpense * Math.pow(1 + retInflation / 100, yearsToRetire);
    const annualFutureExpense = futureMonthlyExpense * 12;
    // Assuming 25 years post-retirement with inflation-adjusted safe withdrawal rate
    const requiredCorpus = annualFutureExpense * 22;
    // Monthly SIP to reach required corpus
    const r = retReturn / 100 / 12;
    const n = yearsToRetire * 12;
    const factor = ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const monthlySip = requiredCorpus / factor;

    return {
      yearsToRetire,
      futureMonthlyExpense: Math.round(futureMonthlyExpense),
      requiredCorpus: Math.round(requiredCorpus),
      monthlySip: Math.round(monthlySip),
    };
  }, [retCurrentAge, retRetireAge, retExpense, retInflation, retReturn]);

  // Delay Calc
  const delayResult = useMemo(() => {
    const withoutDelay = calculateSipProjection(delayMonthly, delayRate, delayTotalYears);
    const activeYearsWithDelay = Math.max(1, delayTotalYears - delayYears);
    const withDelay = calculateSipProjection(delayMonthly, delayRate, activeYearsWithDelay);
    const wealthLoss = withoutDelay.totalValue - withDelay.totalValue;

    return {
      withoutDelay: withoutDelay.totalValue,
      withDelay: withDelay.totalValue,
      wealthLoss: Math.max(0, wealthLoss),
    };
  }, [delayMonthly, delayYears, delayTotalYears, delayRate]);

  // Life Insurance Calc
  const insuranceResult = useMemo(() => {
    const incomeReplacement = insIncome * Math.min(20, insYears) * 0.7;
    const recommendedCover = incomeReplacement + Number(insLoans) - Number(insSavings);
    return {
      recommendedCover: Math.max(2500000, Math.round(recommendedCover)),
      debtObligations: Number(insLoans),
    };
  }, [insIncome, insYears, insLoans, insSavings]);

  // EMI Calc
  const emiResult = useMemo(() => {
    const P = Number(emiPrincipal);
    const r = Number(emiRate) / 100 / 12;
    const n = Number(emiYears) * 12;
    if (r === 0 || n === 0) return { emi: 0, totalInterest: 0, totalPayment: P };
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalPayment - P),
      totalPayment: Math.round(totalPayment),
    };
  }, [emiPrincipal, emiRate, emiYears]);

  // Goal Helper (Marriage, Education, Vacation)
  const computeGoalSIP = (cost, years, inf, ret) => {
    const futureCost = cost * Math.pow(1 + inf / 100, years);
    const r = ret / 100 / 12;
    const n = Math.max(1, years * 12);
    const factor = ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const monthly = factor > 0 ? futureCost / factor : futureCost / n;
    return {
      futureCost: Math.round(futureCost),
      monthlySip: Math.round(monthly),
    };
  };

  const marriageResult = useMemo(() => computeGoalSIP(marrCost, marrYears, marrInflation, marrReturn), [marrCost, marrYears, marrInflation, marrReturn]);
  const educationResult = useMemo(() => computeGoalSIP(eduCost, eduYears, eduInflation, eduReturn), [eduCost, eduYears, eduInflation, eduReturn]);

  // Home Loan Calc
  const homeLoanResult = useMemo(() => {
    const P = Math.max(100000, homeProperty - homeDown);
    const r = Number(homeRate) / 100 / 12;
    const n = Number(homeYears) * 12;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    return {
      loanAmount: P,
      emi: Math.round(emi),
      totalInterest: Math.round(totalPayment - P),
      totalCost: Math.round(totalPayment + Number(homeDown)),
    };
  }, [homeProperty, homeDown, homeRate, homeYears]);

  // Car Loan Calc
  const carLoanResult = useMemo(() => {
    const P = Math.max(50000, carPrice - carDown);
    const r = Number(carRate) / 100 / 12;
    const n = Number(carYears) * 12;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    return {
      loanAmount: P,
      emi: Math.round(emi),
      totalInterest: Math.round(totalPayment - P),
    };
  }, [carPrice, carDown, carRate, carYears]);

  // Vacation Budget Calc
  const vacationResult = useMemo(() => {
    const months = Math.max(1, vacMonths);
    const r = vacReturn / 100 / 12;
    const factor = ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    const monthly = factor > 0 ? vacCost / factor : vacCost / months;
    return {
      target: vacCost,
      monthlyRequired: Math.round(monthly),
    };
  }, [vacCost, vacMonths, vacReturn]);

  // Tax Comparison (Rough estimate for comparison)
  const taxResult = useMemo(() => {
    const gross = Number(taxIncome);
    // New Regime (FY 2024-25 standard slab)
    let taxNew = 0;
    const taxableNew = Math.max(0, gross - 75000); // Standard deduction 75k
    if (taxableNew <= 700000) {
      taxNew = 0; // Rebate
    } else {
      if (taxableNew > 300000) taxNew += Math.min(300000, taxableNew - 300000) * 0.05;
      if (taxableNew > 600000) taxNew += Math.min(300000, taxableNew - 600000) * 0.10;
      if (taxableNew > 900000) taxNew += Math.min(300000, taxableNew - 900000) * 0.15;
      if (taxableNew > 1200000) taxNew += Math.min(300000, taxableNew - 1200000) * 0.20;
      if (taxableNew > 1500000) taxNew += (taxableNew - 1500000) * 0.30;
      taxNew = taxNew * 1.04; // Cess
    }

    // Old Regime
    const deductions = 50000 + Math.min(150000, Number(tax80C)) + Math.min(50000, Number(tax80D)) + Math.min(50000, Number(taxNps));
    const taxableOld = Math.max(0, gross - deductions);
    let taxOld = 0;
    if (taxableOld > 250000) taxOld += Math.min(250000, taxableOld - 250000) * 0.05;
    if (taxableOld > 500000) taxOld += Math.min(500000, taxableOld - 500000) * 0.20;
    if (taxableOld > 1000000) taxOld += (taxableOld - 1000000) * 0.30;
    taxOld = taxOld * 1.04;

    return {
      taxNew: Math.round(taxNew),
      taxOld: Math.round(taxOld),
      bestRegime: taxNew <= taxOld ? 'New Tax Regime' : 'Old Tax Regime',
      savings: Math.abs(Math.round(taxNew - taxOld)),
    };
  }, [taxIncome, tax80C, tax80D, taxNps]);

  // Other related calculators for bottom grid
  const otherCalculators = useMemo(() => {
    return Object.values(ALL_CALCULATORS)
      .filter((c) => c.slug !== slug && c.section === tool.section)
      .slice(0, 4);
  }, [slug, tool.section]);

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      {/* Top Breadcrumb Header */}
      <div className="bg-[#0f2b44] text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link
            href="/investor/financial-calculator"
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Calculators</span>
          </Link>
          <div className="flex items-center gap-2 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/investor/financial-calculator" className="hover:text-white transition-colors">
              {tool.category}
            </Link>
            <span>/</span>
            <span className="text-[#f87b1f] font-semibold">{tool.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Banner for Calculator */}
      <section className="bg-gradient-to-b from-[#0f2b44] to-[#123657] text-white py-10 sm:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider mb-3">
            <Icon className="w-4 h-4 text-[#f87b1f]" />
            <span>{tool.category} • {tool.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {tool.title}
          </h1>
          <p className="text-slate-300 mt-2.5 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {tool.desc}
          </p>
        </div>
      </section>

      {/* Main Interactive Tool Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT: INPUTS & CONTROLS (7 COLS)                          */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-base sm:text-lg font-extrabold text-[#0f2b44] border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2376b8]" />
              <span>Input Parameters</span>
            </h2>

            {/* 1. SIP */}
            {slug === 'sip-calculator' && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Monthly SIP Amount</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
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
                    className="w-full accent-[#2376b8] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>₹1,000</span>
                    <span>₹1,00,000</span>
                    <span>₹2,00,000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Expected Annual Return Rate (% p.a.)</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
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
                    className="w-full accent-[#2376b8] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>6% (Conservative)</span>
                    <span>12.5% (Historical Equity)</span>
                    <span>24% (Aggressive)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Investment Tenure</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {sipYears} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={35}
                    step={1}
                    value={sipYears}
                    onChange={(e) => setSipYears(Number(e.target.value))}
                    className="w-full accent-[#2376b8] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>1 Year</span>
                    <span>15 Years</span>
                    <span>35 Years</span>
                  </div>
                </div>
              </>
            )}

            {/* 2. LUMPSUM */}
            {slug === 'lumpsum-calculator' && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">One-Time Capital Investment</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {formatINR(lumpAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={25000}
                    max={5000000}
                    step={25000}
                    value={lumpAmount}
                    onChange={(e) => setLumpAmount(Number(e.target.value))}
                    className="w-full accent-[#f87b1f] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Expected Annual Return Rate (% p.a.)</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {lumpRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={24}
                    step={0.5}
                    value={lumpRate}
                    onChange={(e) => setLumpRate(Number(e.target.value))}
                    className="w-full accent-[#f87b1f] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Holding Tenure</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {lumpYears} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={lumpYears}
                    onChange={(e) => setLumpYears(Number(e.target.value))}
                    className="w-full accent-[#f87b1f] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </>
            )}

            {/* 3. STP */}
            {slug === 'stp-calculator' && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Source Liquid/Debt Corpus</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {formatINR(stpCorpus)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={200000}
                    max={10000000}
                    step={100000}
                    value={stpCorpus}
                    onChange={(e) => setStpCorpus(Number(e.target.value))}
                    className="w-full accent-[#89b441] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Monthly Transfer Amount</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {formatINR(stpMonthly)} / month
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={200000}
                    step={5000}
                    value={stpMonthly}
                    onChange={(e) => setStpMonthly(Number(e.target.value))}
                    className="w-full accent-[#89b441] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Target Equity Fund Expected Return</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {stpRate}% for {stpYears} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={20}
                    step={0.5}
                    value={stpRate}
                    onChange={(e) => setStpRate(Number(e.target.value))}
                    className="w-full accent-[#89b441] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </>
            )}

            {/* 4. SWP */}
            {slug === 'swp-calculator' && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Total Mutual Fund Corpus</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {formatINR(swpCorpus)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={20000000}
                    step={100000}
                    value={swpCorpus}
                    onChange={(e) => setSwpCorpus(Number(e.target.value))}
                    className="w-full accent-[#0f2b44] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Monthly Desired Payout</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {formatINR(swpWithdrawal)} / month
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={150000}
                    step={2500}
                    value={swpWithdrawal}
                    onChange={(e) => setSwpWithdrawal(Number(e.target.value))}
                    className="w-full accent-[#0f2b44] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Annual Return Expectation</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {swpRate}% for {swpYears} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={18}
                    step={0.5}
                    value={swpRate}
                    onChange={(e) => setSwpRate(Number(e.target.value))}
                    className="w-full accent-[#0f2b44] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </>
            )}

            {/* 5. RETIREMENT */}
            {slug === 'retirement-corpus-calculator' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Current Age</label>
                    <input
                      type="number"
                      value={retCurrentAge}
                      onChange={(e) => setRetCurrentAge(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Retirement Age</label>
                    <input
                      type="number"
                      value={retRetireAge}
                      onChange={(e) => setRetRetireAge(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Monthly Expense Today</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {formatINR(retExpense)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20000}
                    max={300000}
                    step={5000}
                    value={retExpense}
                    onChange={(e) => setRetExpense(Number(e.target.value))}
                    className="w-full accent-[#2376b8] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Expected Inflation (%)</label>
                    <input
                      type="number"
                      step={0.5}
                      value={retInflation}
                      onChange={(e) => setRetInflation(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Pre-Retirement Return (%)</label>
                    <input
                      type="number"
                      step={0.5}
                      value={retReturn}
                      onChange={(e) => setRetReturn(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 6. DELAY CALCULATOR */}
            {slug === 'investment-delay-calculator' && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Planned Monthly Investment</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {formatINR(delayMonthly)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={100000}
                    step={1000}
                    value={delayMonthly}
                    onChange={(e) => setDelayMonthly(Number(e.target.value))}
                    className="w-full accent-[#f87b1f] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Delay In Starting (Years)</label>
                    <span className="text-sm font-extrabold text-[#f87b1f] bg-orange-50 px-3 py-1 rounded-lg">
                      {delayYears} Years Delay
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={delayYears}
                    onChange={(e) => setDelayYears(Number(e.target.value))}
                    className="w-full accent-[#f87b1f] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Total Investment Horizon</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {delayTotalYears} Years ({delayRate}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={30}
                    step={1}
                    value={delayTotalYears}
                    onChange={(e) => setDelayTotalYears(Number(e.target.value))}
                    className="w-full accent-[#f87b1f] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </>
            )}

            {/* 7. LIFE INSURANCE */}
            {slug === 'life-insurance-calculator' && (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Annual Take-Home Income (₹)</label>
                  <input
                    type="number"
                    value={insIncome}
                    onChange={(e) => setInsIncome(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Total Outstanding Loans (₹)</label>
                    <input
                      type="number"
                      value={insLoans}
                      onChange={(e) => setInsLoans(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Current Liquid Savings (₹)</label>
                    <input
                      type="number"
                      value={insSavings}
                      onChange={(e) => setInsSavings(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 8. EMI */}
            {slug === 'emi-calculator' && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Loan Amount</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {formatINR(emiPrincipal)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={20000000}
                    step={100000}
                    value={emiPrincipal}
                    onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                    className="w-full accent-[#0f2b44] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Annual Interest Rate (% p.a.)</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {emiRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={18}
                    step={0.25}
                    value={emiRate}
                    onChange={(e) => setEmiRate(Number(e.target.value))}
                    className="w-full accent-[#0f2b44] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Loan Tenure</label>
                    <span className="text-sm font-extrabold text-[#0f2b44] bg-slate-100 px-3 py-1 rounded-lg">
                      {emiYears} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={emiYears}
                    onChange={(e) => setEmiYears(Number(e.target.value))}
                    className="w-full accent-[#0f2b44] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </>
            )}

            {/* 9. TAX */}
            {slug === 'tax-calculator' && (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Gross Annual Income (₹)</label>
                  <input
                    type="number"
                    value={taxIncome}
                    onChange={(e) => setTaxIncome(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Section 80C</label>
                    <input
                      type="number"
                      value={tax80C}
                      onChange={(e) => setTax80C(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Section 80D</label>
                    <input
                      type="number"
                      value={tax80D}
                      onChange={(e) => setTax80D(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">NPS 80CCD</label>
                    <input
                      type="number"
                      value={taxNps}
                      onChange={(e) => setTaxNps(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 10. MARRIAGE / 11. EDUCATION */}
            {(slug === 'marriage-expense-calculator' || slug === 'education-cost-calculator') && (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Estimated Cost In Today's Value (₹)</label>
                  <input
                    type="number"
                    value={slug === 'marriage-expense-calculator' ? marrCost : eduCost}
                    onChange={(e) =>
                      slug === 'marriage-expense-calculator'
                        ? setMarrCost(Number(e.target.value))
                        : setEduCost(Number(e.target.value))
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Years to Goal</label>
                    <input
                      type="number"
                      value={slug === 'marriage-expense-calculator' ? marrYears : eduYears}
                      onChange={(e) =>
                        slug === 'marriage-expense-calculator'
                          ? setMarrYears(Number(e.target.value))
                          : setEduYears(Number(e.target.value))
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Inflation (%)</label>
                    <input
                      type="number"
                      value={slug === 'marriage-expense-calculator' ? marrInflation : eduInflation}
                      onChange={(e) =>
                        slug === 'marriage-expense-calculator'
                          ? setMarrInflation(Number(e.target.value))
                          : setEduInflation(Number(e.target.value))
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Return (%)</label>
                    <input
                      type="number"
                      value={slug === 'marriage-expense-calculator' ? marrReturn : eduReturn}
                      onChange={(e) =>
                        slug === 'marriage-expense-calculator'
                          ? setMarrReturn(Number(e.target.value))
                          : setEduReturn(Number(e.target.value))
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 12. HOME LOAN */}
            {slug === 'home-loan-calculator' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Property Value (₹)</label>
                    <input
                      type="number"
                      value={homeProperty}
                      onChange={(e) => setHomeProperty(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Down Payment (₹)</label>
                    <input
                      type="number"
                      value={homeDown}
                      onChange={(e) => setHomeDown(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Interest Rate (% p.a.)</label>
                    <input
                      type="number"
                      step={0.1}
                      value={homeRate}
                      onChange={(e) => setHomeRate(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Tenure (Years)</label>
                    <input
                      type="number"
                      value={homeYears}
                      onChange={(e) => setHomeYears(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 13. CAR PURCHASE */}
            {slug === 'car-purchase-calculator' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">On-Road Car Price (₹)</label>
                    <input
                      type="number"
                      value={carPrice}
                      onChange={(e) => setCarPrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Down Payment (₹)</label>
                    <input
                      type="number"
                      value={carDown}
                      onChange={(e) => setCarDown(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Loan Interest (%)</label>
                    <input
                      type="number"
                      step={0.25}
                      value={carRate}
                      onChange={(e) => setCarRate(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Tenure (Years)</label>
                    <input
                      type="number"
                      value={carYears}
                      onChange={(e) => setCarYears(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 14. VACATION */}
            {slug === 'vacation-budget-calculator' && (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Estimated Vacation Budget (₹)</label>
                  <input
                    type="number"
                    value={vacCost}
                    onChange={(e) => setVacCost(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Months Until Trip</label>
                    <input
                      type="number"
                      value={vacMonths}
                      onChange={(e) => setVacMonths(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Liquid Fund Yield (%)</label>
                    <input
                      type="number"
                      step={0.5}
                      value={vacReturn}
                      onChange={(e) => setVacReturn(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {/* MF TOOLS (15-20) */}
            {tool.section === 'mf-tools' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mutual Fund Scheme / Name</label>
                  <input
                    type="text"
                    value={mfSchemeSearch}
                    onChange={(e) => setMfSchemeSearch(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Fund Category</label>
                    <select
                      value={mfCategory}
                      onChange={(e) => setMfCategory(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                    >
                      <option>Flexi Cap Fund</option>
                      <option>Large & Mid Cap</option>
                      <option>Small Cap Fund</option>
                      <option>Arbitrage Fund</option>
                      <option>Liquid Debt Fund</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Evaluation Horizon</label>
                    <select
                      value={mfTimeframe}
                      onChange={(e) => setMfTimeframe(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                    >
                      <option>1 Year</option>
                      <option>3 Years</option>
                      <option>5 Years</option>
                      <option>Since Inception</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* RIGHT: PROJECTION OUTCOME CARD (5 COLS)                   */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0f2b44] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#f87b1f] block mb-1">
                Projected Output
              </span>

              {/* 1. SIP */}
              {slug === 'sip-calculator' && (
                <>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
                    {formatINR(sipResult.totalValue)}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Expected wealth after {sipYears} years</div>
                  <div className="mt-6 pt-5 border-t border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Invested:</span>
                      <span className="font-bold text-white">{formatINR(sipResult.investedAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Estimated Gains:</span>
                      <span className="font-bold text-[#89b441]">+{formatINR(sipResult.estimatedReturns)}</span>
                    </div>
                  </div>
                </>
              )}

              {/* 2. LUMPSUM */}
              {slug === 'lumpsum-calculator' && (
                <>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
                    {formatINR(lumpResult.totalValue)}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Expected wealth after {lumpYears} years</div>
                  <div className="mt-6 pt-5 border-t border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Initial Capital:</span>
                      <span className="font-bold text-white">{formatINR(lumpResult.investedAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Wealth Multiplier:</span>
                      <span className="font-bold text-[#89b441]">+{formatINR(lumpResult.estimatedReturns)}</span>
                    </div>
                  </div>
                </>
              )}

              {/* 3. STP */}
              {slug === 'stp-calculator' && (
                <>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-[#89b441]">
                    {formatINR(stpResult.equityCorpus)}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Projected Equity Corpus after {stpYears} years</div>
                  <div className="mt-6 pt-5 border-t border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Transferred:</span>
                      <span className="font-bold text-white">{formatINR(stpResult.transferred)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Remaining Debt Balance:</span>
                      <span className="font-bold text-slate-300">{formatINR(stpResult.remainingDebt)}</span>
                    </div>
                  </div>
                </>
              )}

              {/* 4. SWP */}
              {slug === 'swp-calculator' && (
                <>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-[#89b441]">
                    {formatINR(swpResult.totalWithdrawn)}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Total cash withdrawn over {swpYears} years</div>
                  <div className="mt-6 pt-5 border-t border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Initial Corpus:</span>
                      <span className="font-bold text-white">{formatINR(swpCorpus)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Remaining Capital:</span>
                      <span className="font-bold text-white">{formatINR(swpResult.finalBalance)}</span>
                    </div>
                  </div>
                </>
              )}

              {/* 5. RETIREMENT */}
              {slug === 'retirement-corpus-calculator' && (
                <>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
                    {formatINR(retirementResult.requiredCorpus)}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Target Retirement Corpus at Age {retRetireAge}</div>
                  <div className="mt-6 pt-5 border-t border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Future Monthly Expense:</span>
                      <span className="font-bold text-[#f87b1f]">{formatINR(retirementResult.futureMonthlyExpense)} / mo</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Required Monthly SIP:</span>
                      <span className="font-bold text-[#89b441]">{formatINR(retirementResult.monthlySip)} / mo</span>
                    </div>
                  </div>
                </>
              )}

              {/* 6. DELAY */}
              {slug === 'investment-delay-calculator' && (
                <>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-rose-400">
                    -{formatINR(delayResult.wealthLoss)}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Estimated compounding loss caused by {delayYears} years delay</div>
                  <div className="mt-6 pt-5 border-t border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Corpus Starting Today:</span>
                      <span className="font-bold text-[#89b441]">{formatINR(delayResult.withoutDelay)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Corpus If Delayed:</span>
                      <span className="font-bold text-white">{formatINR(delayResult.withDelay)}</span>
                    </div>
                  </div>
                </>
              )}

              {/* 7. LIFE INSURANCE */}
              {slug === 'life-insurance-calculator' && (
                <>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-[#89b441]">
                    {formatINR(insuranceResult.recommendedCover)}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Recommended Pure Term Cover for Family</div>
                  <div className="mt-6 pt-5 border-t border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Debt Protection Included:</span>
                      <span className="font-bold text-white">{formatINR(insuranceResult.debtObligations)}</span>
                    </div>
                  </div>
                </>
              )}

              {/* 8. EMI */}
              {slug === 'emi-calculator' && (
                <>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
                    {formatINR(emiResult.emi)} <span className="text-sm text-slate-400">/ month</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Monthly Repayment Outflow</div>
                  <div className="mt-6 pt-5 border-t border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Interest Outgo:</span>
                      <span className="font-bold text-[#f87b1f]">{formatINR(emiResult.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Repayment:</span>
                      <span className="font-bold text-white">{formatINR(emiResult.totalPayment)}</span>
                    </div>
                  </div>
                </>
              )}

              {/* 9. TAX */}
              {slug === 'tax-calculator' && (
                <>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-[#89b441]">
                    {taxResult.bestRegime}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Estimated Tax: {formatINR(Math.min(taxResult.taxNew, taxResult.taxOld))}</div>
                  <div className="mt-6 pt-5 border-t border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">New Regime Tax:</span>
                      <span className="font-bold text-white">{formatINR(taxResult.taxNew)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Old Regime Tax:</span>
                      <span className="font-bold text-white">{formatINR(taxResult.taxOld)}</span>
                    </div>
                  </div>
                </>
              )}

              {/* 10. MARRIAGE / 11. EDUCATION */}
              {(slug === 'marriage-expense-calculator' || slug === 'education-cost-calculator') && (
                <>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
                    {formatINR(slug === 'marriage-expense-calculator' ? marriageResult.futureCost : educationResult.futureCost)}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Projected Future Inflation-Adjusted Target Cost</div>
                  <div className="mt-6 pt-5 border-t border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Monthly SIP Needed:</span>
                      <span className="font-bold text-[#89b441]">
                        {formatINR(slug === 'marriage-expense-calculator' ? marriageResult.monthlySip : educationResult.monthlySip)} / mo
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* 12. HOME LOAN */}
              {slug === 'home-loan-calculator' && (
                <>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
                    {formatINR(homeLoanResult.emi)} <span className="text-sm text-slate-400">/ month</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Monthly Loan EMI</div>
                  <div className="mt-6 pt-5 border-t border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Net Loan Amount:</span>
                      <span className="font-bold text-white">{formatINR(homeLoanResult.loanAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Interest Outgo:</span>
                      <span className="font-bold text-[#f87b1f]">{formatINR(homeLoanResult.totalInterest)}</span>
                    </div>
                  </div>
                </>
              )}

              {/* 13. CAR */}
              {slug === 'car-purchase-calculator' && (
                <>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
                    {formatINR(carLoanResult.emi)} <span className="text-sm text-slate-400">/ month</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Monthly Auto Loan Payment</div>
                  <div className="mt-6 pt-5 border-t border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Loan Financed:</span>
                      <span className="font-bold text-white">{formatINR(carLoanResult.loanAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Interest Component:</span>
                      <span className="font-bold text-[#f87b1f]">{formatINR(carLoanResult.totalInterest)}</span>
                    </div>
                  </div>
                </>
              )}

              {/* 14. VACATION */}
              {slug === 'vacation-budget-calculator' && (
                <>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-[#89b441]">
                    {formatINR(vacationResult.monthlyRequired)} <span className="text-sm text-slate-400">/ month</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Monthly savings required for {vacMonths} months</div>
                  <div className="mt-6 pt-5 border-t border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Target Holiday Cost:</span>
                      <span className="font-bold text-white">{formatINR(vacationResult.target)}</span>
                    </div>
                  </div>
                </>
              )}

              {/* MF TOOLS (15-20) */}
              {tool.section === 'mf-tools' && (
                <>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-[#89b441]">
                    +15.8% CAGR
                  </div>
                  <div className="text-xs text-slate-300 mt-1">Simulated Historical Return ({mfTimeframe})</div>
                  <div className="mt-6 pt-5 border-t border-slate-700 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Benchmark Alpha:</span>
                      <span className="font-bold text-[#89b441]">+3.2% vs NIFTY 50 TRI</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Selected Scheme:</span>
                      <span className="font-bold text-slate-300 truncate max-w-[180px]">{mfSchemeSearch}</span>
                    </div>
                  </div>
                </>
              )}

              {/* CTA Action */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <Link
                  href="/contact-us#callback"
                  className="w-full bg-[#f87b1f] hover:bg-[#d9620b] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f87b1f]/20"
                >
                  <span>Start This Investment Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Quick Advisory Note */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs text-slate-500 leading-relaxed space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#2376b8]" />
                <span>Expert Wealth Guidance</span>
              </div>
              <p>
                Calculations are based on assumed compounding rates and inputs for illustrative purposes. For portfolio allocation tailored to your risk tolerance, connect with our certified advisors.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RELATED CALCULATORS SECTION                               */}
        {/* ========================================================= */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0f2b44]">
              Other Popular {tool.category}
            </h3>
            <Link
              href="/investor/financial-calculator"
              className="text-xs font-bold text-[#2376b8] hover:text-[#f87b1f] transition-colors flex items-center gap-1"
            >
              <span>View All 20 Tools</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherCalculators.map((other) => {
              const OtherIcon = ICONS_MAP[other.iconName] || Calculator;
              return (
                <Link
                  key={other.slug}
                  href={`/investor/financial-calculator/${other.slug}`}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#2376b8] hover:shadow-md transition-all group flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#2376b8]/10 text-slate-700 group-hover:text-[#2376b8] flex items-center justify-center shrink-0 transition-colors">
                    <OtherIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#0f2b44] group-hover:text-[#2376b8] transition-colors truncate">
                      {other.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {other.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
