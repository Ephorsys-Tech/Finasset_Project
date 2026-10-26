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
  ChevronRight,
  Download,
  Loader2,
} from 'lucide-react';
import { formatINR, calculateSipProjection, calculateLumpsumProjection } from '@/lib/utils';
import { ALL_CALCULATORS } from '@/lib/calculatorsData';
import MinimalCalculatorCard from '@/components/calculators/MinimalCalculatorCard';
import CalculatorPieChart from '@/components/calculators/CalculatorPieChart';
import CalculatorComparisonChart from '@/components/calculators/CalculatorComparisonChart';
import { exportCalculatorToPdf } from '@/components/calculators/pdfExport';

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

/**
 * Reusable Slider with direct numeric Input Box matching reference design
 */
function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  isCurrency = false,
}) {
  const [localText, setLocalText] = useState(null);

  const displayVal =
    localText !== null
      ? localText
      : isCurrency
      ? (Number(value) || 0).toLocaleString('en-IN')
      : String(value ?? '');

  const handleBlur = () => {
    if (localText !== null) {
      const clean = Number(localText.replace(/[^0-9.-]/g, ''));
      if (!isNaN(clean)) {
        const clamped = Math.max(min, Math.min(max, clean));
        onChange(clamped);
      }
      setLocalText(null);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center gap-2">
        <label className="text-xs font-semibold text-slate-700 leading-tight">
          {label}
        </label>
        <input
          type="text"
          value={displayVal}
          onChange={(e) => setLocalText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleBlur();
          }}
          className="w-24 sm:w-28 py-1 px-2.5 text-xs sm:text-sm font-bold text-slate-800 bg-white border border-slate-300 rounded-md shadow-inner text-right focus:outline-none focus:ring-1 focus:ring-[#2376b8] focus:border-[#2376b8]"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          setLocalText(null);
          onChange(Number(e.target.value));
        }}
        className="w-full accent-[#2376b8] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
      />
    </div>
  );
}

export default function CalculatorDetailClient({ slug, tool }) {
  const Icon = ICONS_MAP[tool.iconName] || Calculator;
  const [isExporting, setIsExporting] = useState(false);

  // =========================================================
  // 1. CALCULATOR STATES
  // =========================================================
  // 1. SIP
  const [sipMonthly, setSipMonthly] = useState(tool.defaultInputs?.amount || 15000);
  const [sipRate, setSipRate] = useState(tool.defaultInputs?.rate || 12);
  const [sipYears, setSipYears] = useState(tool.defaultInputs?.years || 8);

  // 2. Lumpsum (defaults matching user screenshot)
  const [lumpAmount, setLumpAmount] = useState(tool.defaultInputs?.amount || 15000);
  const [lumpYears, setLumpYears] = useState(tool.defaultInputs?.years || 8);
  const [lumpRate, setLumpRate] = useState(tool.defaultInputs?.rate || 12);

  // 3. STP
  const [stpCorpus, setStpCorpus] = useState(tool.defaultInputs?.sourceCorpus || 1000000);
  const [stpMonthly, setStpMonthly] = useState(tool.defaultInputs?.transferMonthly || 25000);
  const [stpRate, setStpRate] = useState(tool.defaultInputs?.rate || 12.0);
  const [stpYears, setStpYears] = useState(tool.defaultInputs?.years || 3);

  // 4. SWP
  const [swpCorpus, setSwpCorpus] = useState(tool.defaultInputs?.corpus || 2500000);
  const [swpWithdrawal, setSwpWithdrawal] = useState(tool.defaultInputs?.withdrawal || 20000);
  const [swpRate, setSwpRate] = useState(tool.defaultInputs?.rate || 9.0);
  const [swpYears, setSwpYears] = useState(tool.defaultInputs?.years || 10);

  // 5. Retirement
  const [retCurrentAge, setRetCurrentAge] = useState(tool.defaultInputs?.currentAge || 30);
  const [retRetireAge, setRetRetireAge] = useState(tool.defaultInputs?.retirementAge || 60);
  const [retExpense, setRetExpense] = useState(tool.defaultInputs?.monthlyExpense || 50000);
  const [retInflation, setRetInflation] = useState(tool.defaultInputs?.inflation || 6);
  const [retReturn, setRetReturn] = useState(tool.defaultInputs?.returnRate || 11);

  // 6. Delay
  const [delayMonthly, setDelayMonthly] = useState(tool.defaultInputs?.monthlySip || 10000);
  const [delayYears, setDelayYears] = useState(tool.defaultInputs?.delayYears || 2);
  const [delayTotalYears, setDelayTotalYears] = useState(tool.defaultInputs?.totalYears || 20);
  const [delayRate, setDelayRate] = useState(tool.defaultInputs?.rate || 12.5);

  // 7. Life Insurance
  const [insIncome, setInsIncome] = useState(tool.defaultInputs?.annualIncome || 1200000);
  const [insExpense, setInsExpense] = useState(tool.defaultInputs?.annualExpense || 600000);
  const [insLoans, setInsLoans] = useState(tool.defaultInputs?.loans || 2500000);
  const [insSavings, setInsSavings] = useState(tool.defaultInputs?.savings || 500000);
  const [insYears, setInsYears] = useState(tool.defaultInputs?.workingYears || 25);

  // 8. EMI
  const [emiPrincipal, setEmiPrincipal] = useState(tool.defaultInputs?.loanAmount || 3000000);
  const [emiRate, setEmiRate] = useState(tool.defaultInputs?.interestRate || 9.0);
  const [emiYears, setEmiYears] = useState(tool.defaultInputs?.tenureYears || 15);

  // 9. TAX
  const [taxIncome, setTaxIncome] = useState(tool.defaultInputs?.income || 1500000);
  const [tax80C, setTax80C] = useState(tool.defaultInputs?.section80C || 150000);
  const [tax80D, setTax80D] = useState(tool.defaultInputs?.section80D || 25000);
  const [taxNps, setTaxNps] = useState(tool.defaultInputs?.nps80CCD || 50000);

  // 10. Marriage
  const [marrCost, setMarrCost] = useState(tool.defaultInputs?.currentCost || 2000000);
  const [marrYears, setMarrYears] = useState(tool.defaultInputs?.yearsAway || 8);
  const [marrInflation, setMarrInflation] = useState(tool.defaultInputs?.inflation || 7);
  const [marrReturn, setMarrReturn] = useState(tool.defaultInputs?.expectedReturn || 12);

  // 11. Education
  const [eduCost, setEduCost] = useState(tool.defaultInputs?.currentCost || 2500000);
  const [eduYears, setEduYears] = useState(tool.defaultInputs?.yearsToCollege || 10);
  const [eduInflation, setEduInflation] = useState(tool.defaultInputs?.inflation || 10);
  const [eduReturn, setEduReturn] = useState(tool.defaultInputs?.expectedReturn || 12);

  // 12. Home Loan
  const [homeProperty, setHomeProperty] = useState(tool.defaultInputs?.propertyCost || 6000000);
  const [homeDown, setHomeDown] = useState(tool.defaultInputs?.downPayment || 1200000);
  const [homeRate, setHomeRate] = useState(tool.defaultInputs?.interestRate || 8.5);
  const [homeYears, setHomeYears] = useState(tool.defaultInputs?.tenureYears || 20);

  // 13. Car Purchase (Goal Planning Model matching reference image)
  const [carCost, setCarCost] = useState(10000); // 10,000 as in reference image
  const [carYears, setCarYears] = useState(5);
  const [carReturn, setCarReturn] = useState(22);
  const [carInflation, setCarInflation] = useState(18);

  // 14. Vacation
  const [vacCost, setVacCost] = useState(tool.defaultInputs?.estimatedCost || 350000);
  const [vacMonths, setVacMonths] = useState(tool.defaultInputs?.monthsAway || 18);
  const [vacReturn, setVacReturn] = useState(tool.defaultInputs?.expectedReturn || 7);

  // MF Tools Mock Selection
  const [mfSchemeSearch, setMfSchemeSearch] = useState('HDFC Top 100 Fund - Growth');
  const [mfCategory, setMfCategory] = useState('Flexi Cap Fund');
  const [mfTimeframe, setMfTimeframe] = useState('5 Years');

  // =========================================================
  // 2. MATHEMATICAL CALCULATIONS (Safely Handled)
  // =========================================================
  const retYears = Math.max(1, (Number(retRetireAge) || 60) - (Number(retCurrentAge) || 30));

  // Goal Calculator Helper
  const computeGoal = (cost, years, inf, ret) => {
    const c = Number(cost) || 0;
    const y = Math.max(1, Number(years) || 1);
    const i = Number(inf) || 0;
    const r = Number(ret) || 0;

    const futureCost = Math.round(c * Math.pow(1 + i / 100, y));
    const monthlyRate = r / 100 / 12;
    const months = y * 12;
    const factor = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const monthlySip = factor > 0 ? Math.round(futureCost / factor) : Math.round(futureCost / months);
    const lumpsum = Math.round(futureCost / Math.pow(1 + r / 100, y));

    return { futureCost, monthlySip, lumpsum };
  };

  // =========================================================
  // 3. ADAPTIVE SUMMARY ROWS, PIE CHART & COMPARISON DATA
  // =========================================================
  const {
    summaryRows,
    pieChartData,
    pieChartTitle,
    comparisonData,
    comparisonTitle,
    series1Name,
    series2Name,
  } = useMemo(() => {
    // 1. SIP CALCULATOR
    if (slug === 'sip-calculator') {
      const monthly = Number(sipMonthly) || 0;
      const years = Number(sipYears) || 1;
      const rate = Number(sipRate) || 0;

      const invested = monthly * 12 * years;
      const proj = calculateSipProjection(monthly, rate, years);
      const totalVal = proj.totalValue || proj.total || invested;
      const returns = Math.max(0, totalVal - invested);

      const comp = [];
      for (let y = 1; y <= years; y++) {
        const yearInvested = monthly * 12 * y;
        const yearProj = calculateSipProjection(monthly, rate, y);
        const yearReturn = Math.max(0, (yearProj.totalValue || yearProj.total) - yearInvested);
        comp.push({
          label: `${y}`,
          series1: yearInvested,
          series2: yearReturn,
        });
      }

      return {
        summaryRows: [
          { label: 'Invested Amount', value: formatINR(invested) },
          { label: 'Wealth Gained', value: formatINR(returns) },
          { label: 'Expected Amount', value: formatINR(totalVal) },
        ],
        pieChartTitle: 'SIP Calculator - Pie Chart',
        pieChartData: [
          { label: 'Total Investment', value: invested, color: '#2376b8' },
          { label: 'Return Amount', value: returns, color: '#89b441' },
        ],
        comparisonTitle: 'SIP Comparison',
        comparisonData: comp,
        series1Name: 'Total Investment',
        series2Name: 'Return Amount',
      };
    }

    // 2. LUMPSUM CALCULATOR (Exact Match to User Reference Image)
    if (slug === 'lumpsum-calculator') {
      const invested = Number(lumpAmount) || 0;
      const years = Number(lumpYears) || 1;
      const rate = Number(lumpRate) || 0;

      const futureVal = Math.round(invested * Math.pow(1 + rate / 100 / 12, years * 12));
      const returns = Math.max(0, futureVal - invested);

      const comp = [];
      for (let y = 1; y <= years; y++) {
        const yearVal = Math.round(invested * Math.pow(1 + rate / 100 / 12, y * 12));
        const yearReturn = Math.max(0, yearVal - invested);
        comp.push({
          label: `${y}`,
          series1: invested,
          series2: yearReturn,
        });
      }

      return {
        summaryRows: [
          { label: 'Invested Amount', value: formatINR(invested) },
          { label: 'Wealth Gained', value: formatINR(returns) },
          { label: 'Expected Amount', value: formatINR(futureVal) },
        ],
        pieChartTitle: 'Lumpsum Calculator - Pie Chart',
        pieChartData: [
          { label: 'Total Investment', value: invested, color: '#2376b8' },
          { label: 'Return Amount', value: returns, color: '#89b441' },
        ],
        comparisonTitle: 'Lumpsum Comparison',
        comparisonData: comp,
        series1Name: 'Total Investment',
        series2Name: 'Return Amount',
      };
    }

    // 3. CAR PURCHASE CALCULATOR (Exact Match to User Reference Image)
    if (slug === 'car-purchase-calculator') {
      const cost = Number(carCost) || 0;
      const years = Number(carYears) || 1;
      const inf = Number(carInflation) || 0;
      const ret = Number(carReturn) || 0;

      const goal = computeGoal(cost, years, inf, ret);

      const comp = [];
      for (let y = 1; y <= years; y++) {
        comp.push({
          label: `${y}`,
          series1: cost,
          series2: Math.round(cost * Math.pow(1 + inf / 100, y)),
        });
      }

      return {
        summaryRows: [
          { label: 'Current Cost of Car', value: formatINR(cost) },
          { label: 'Future Cost of Car', value: formatINR(goal.futureCost) },
          { label: 'Planning Through SIP', value: formatINR(goal.monthlySip) },
          { label: 'Planning Through Lump Sum', value: formatINR(goal.lumpsum) },
        ],
        pieChartTitle: 'Current & Future Cost Of Car Breakup - Pie Chart',
        pieChartData: [
          { label: 'Current Cost of Car', value: cost, color: '#2376b8' },
          { label: 'Future Cost of Car', value: goal.futureCost, color: '#89b441' },
        ],
        comparisonTitle: 'Car Planning Comparison',
        comparisonData: comp,
        series1Name: 'Current Cost of Car',
        series2Name: 'Future Cost of Car',
      };
    }

    // 4. STP CALCULATOR
    if (slug === 'stp-calculator') {
      const corpus = Number(stpCorpus) || 0;
      const monthly = Number(stpMonthly) || 0;
      const years = Number(stpYears) || 1;
      const rate = Number(stpRate) || 0;

      const transferred = Math.min(corpus, monthly * 12 * years);
      const remainingDebt = Math.max(0, corpus - transferred);
      const equityProj = calculateSipProjection(monthly, rate, years);
      const equityValue = equityProj.totalValue || equityProj.total;
      const combinedTotal = remainingDebt + equityValue;

      const comp = [];
      for (let y = 1; y <= years; y++) {
        comp.push({
          label: `${y}`,
          series1: Math.max(0, corpus - monthly * 12 * y),
          series2: calculateSipProjection(monthly, rate, y).totalValue,
        });
      }

      return {
        summaryRows: [
          { label: 'Source Liquid Corpus', value: formatINR(corpus) },
          { label: 'Total Transferred to Equity', value: formatINR(transferred) },
          { label: 'Remaining Liquid Balance', value: formatINR(remainingDebt) },
          { label: 'Projected Equity Value', value: formatINR(equityValue) },
          { label: 'Combined Final Portfolio', value: formatINR(combinedTotal) },
        ],
        pieChartTitle: 'STP Equity vs Debt Distribution - Pie Chart',
        pieChartData: [
          { label: 'Equity Portfolio', value: equityValue, color: '#2376b8' },
          { label: 'Remaining Liquid Debt', value: remainingDebt, color: '#89b441' },
        ],
        comparisonTitle: 'STP Transfer Comparison',
        comparisonData: comp,
        series1Name: 'Liquid Balance',
        series2Name: 'Equity Value',
      };
    }

    // 5. SWP CALCULATOR
    if (slug === 'swp-calculator') {
      const corpus = Number(swpCorpus) || 0;
      const withdrawal = Number(swpWithdrawal) || 0;
      const rate = Number(swpRate) || 0;
      const years = Number(swpYears) || 1;

      let balance = corpus;
      const monthlyRate = rate / 100 / 12;
      const months = years * 12;
      let totalWithdrawn = 0;

      for (let m = 0; m < months; m++) {
        if (balance <= 0) break;
        balance = balance * (1 + monthlyRate) - withdrawal;
        totalWithdrawn += withdrawal;
      }
      const remainingCorpus = Math.max(0, Math.round(balance));

      const comp = [];
      for (let y = 1; y <= years; y++) {
        comp.push({
          label: `${y}`,
          series1: withdrawal * 12 * y,
          series2: Math.max(0, Math.round(corpus - withdrawal * 12 * y * 0.7)),
        });
      }

      return {
        summaryRows: [
          { label: 'Initial Investment Corpus', value: formatINR(corpus) },
          { label: 'Total Regular Income Paid', value: formatINR(totalWithdrawn) },
          { label: 'Residual Portfolio Corpus', value: formatINR(remainingCorpus) },
          { label: 'Total Value Received', value: formatINR(totalWithdrawn + remainingCorpus) },
        ],
        pieChartTitle: 'SWP Payout vs Balance - Pie Chart',
        pieChartData: [
          { label: 'Total Income Withdrawn', value: totalWithdrawn, color: '#89b441' },
          { label: 'Remaining Corpus', value: remainingCorpus, color: '#2376b8' },
        ],
        comparisonTitle: 'SWP Income Comparison',
        comparisonData: comp,
        series1Name: 'Withdrawn Income',
        series2Name: 'Residual Corpus',
      };
    }

    // 6. RETIREMENT CORPUS
    if (slug === 'retirement-corpus-calculator') {
      const expense = Number(retExpense) || 0;
      const inf = Number(retInflation) || 0;
      const ret = Number(retReturn) || 0;

      const futureMonthlyExpense = Math.round(expense * Math.pow(1 + inf / 100, retYears));
      const requiredCorpus = Math.round(futureMonthlyExpense * 12 * 22);
      const r = ret / 100 / 12;
      const n = retYears * 12;
      const monthlySipNeeded = Math.round((requiredCorpus * r) / (Math.pow(1 + r, n) - 1));

      const comp = [];
      const intervals = [1, 2, 3, 4, 5];
      intervals.forEach((step) => {
        const y = Math.round((retYears / 5) * step);
        comp.push({
          label: `${y}y`,
          series1: Math.round(expense * 12 * y),
          series2: Math.round((requiredCorpus / 5) * step),
        });
      });

      return {
        summaryRows: [
          { label: 'Years to Retirement', value: `${retYears} Years` },
          { label: 'Future Monthly Expense', value: `${formatINR(futureMonthlyExpense)} / mo` },
          { label: 'Target Retirement Nest Egg', value: formatINR(requiredCorpus) },
          { label: 'Planning Through Monthly SIP', value: `${formatINR(monthlySipNeeded)} / mo` },
        ],
        pieChartTitle: 'Retirement Nest Egg Breakup - Pie Chart',
        pieChartData: [
          { label: 'Living Expenses Base', value: expense * 12 * 20, color: '#2376b8' },
          { label: 'Inflation Buffer', value: Math.max(0, requiredCorpus - expense * 12 * 20), color: '#89b441' },
        ],
        comparisonTitle: 'Retirement Corpus Comparison',
        comparisonData: comp,
        series1Name: 'Base Expenses',
        series2Name: 'Target Nest Egg',
      };
    }

    // 7. INVESTMENT DELAY
    if (slug === 'investment-delay-calculator') {
      const monthly = Number(delayMonthly) || 0;
      const delay = Number(delayYears) || 1;
      const totalY = Number(delayTotalYears) || 20;
      const rate = Number(delayRate) || 0;

      const startedNow = calculateSipProjection(monthly, rate, totalY).totalValue;
      const startedDelayed = calculateSipProjection(monthly, rate, Math.max(1, totalY - delay)).totalValue;
      const costOfDelay = Math.max(0, startedNow - startedDelayed);

      const comp = [];
      for (let y = 1; y <= 5; y++) {
        const horizon = Math.round((totalY / 5) * y);
        comp.push({
          label: `${horizon}y`,
          series1: calculateSipProjection(monthly, rate, Math.max(1, horizon - delay)).totalValue,
          series2: calculateSipProjection(monthly, rate, horizon).totalValue,
        });
      }

      return {
        summaryRows: [
          { label: 'Wealth If Started Today', value: formatINR(startedNow) },
          { label: `Wealth If Delayed by ${delay} Years`, value: formatINR(startedDelayed) },
          { label: 'Net Cost of Delay (Lost Wealth)', value: formatINR(costOfDelay) },
        ],
        pieChartTitle: 'Delay Opportunity Cost - Pie Chart',
        pieChartData: [
          { label: 'Wealth If Delayed', value: startedDelayed, color: '#2376b8' },
          { label: 'Lost Opportunity Wealth', value: costOfDelay, color: '#f87b1f' },
        ],
        comparisonTitle: 'Delay Cost Comparison',
        comparisonData: comp,
        series1Name: 'Delayed Growth',
        series2Name: 'Start Today Growth',
      };
    }

    // 8. LIFE INSURANCE
    if (slug === 'life-insurance-calculator') {
      const income = Number(insIncome) || 0;
      const expense = Number(insExpense) || 0;
      const loans = Number(insLoans) || 0;
      const savings = Number(insSavings) || 0;
      const years = Number(insYears) || 1;

      const incomeNeed = Math.round((income - expense) * years);
      const netCover = Math.max(1000000, incomeNeed + loans - savings);

      const comp = [];
      [1, 2, 3, 4, 5].forEach((i) => {
        const y = Math.round((years / 5) * i);
        comp.push({
          label: `${y}y`,
          series1: Math.round(savings + (income - expense) * y * 0.4),
          series2: netCover,
        });
      });

      return {
        summaryRows: [
          { label: 'Family Income Replacement Need', value: formatINR(incomeNeed) },
          { label: 'Loan Clearance Obligation', value: formatINR(loans) },
          { label: 'Existing Liquid Financial Assets', value: formatINR(savings) },
          { label: 'Recommended Term Insurance Cover', value: formatINR(netCover) },
        ],
        pieChartTitle: 'Protection Coverage Need - Pie Chart',
        pieChartData: [
          { label: 'Income Protection', value: incomeNeed, color: '#2376b8' },
          { label: 'Debt Liabilities', value: loans, color: '#f87b1f' },
          { label: 'Existing Assets', value: savings, color: '#89b441' },
        ],
        comparisonTitle: 'Insurance Protection Comparison',
        comparisonData: comp,
        series1Name: 'Accumulated Assets',
        series2Name: 'Protection Cover Need',
      };
    }

    // 9. EMI
    if (slug === 'emi-calculator') {
      const P = Number(emiPrincipal) || 0;
      const r = (Number(emiRate) || 0) / 100 / 12;
      const n = (Number(emiYears) || 1) * 12;

      const emi = r > 0 ? Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : Math.round(P / n);
      const totalPayment = emi * n;
      const totalInterest = Math.max(0, totalPayment - P);

      const comp = [];
      const years = Number(emiYears) || 1;
      for (let y = 1; y <= years; y++) {
        comp.push({
          label: `${y}`,
          series1: Math.round((P / years) * y),
          series2: Math.round((totalPayment / years) * y),
        });
      }

      return {
        summaryRows: [
          { label: 'Loan Principal Amount', value: formatINR(P) },
          { label: 'Total Interest Outgo', value: formatINR(totalInterest) },
          { label: 'Total Amount Payable', value: formatINR(totalPayment) },
          { label: 'Monthly Loan EMI', value: `${formatINR(emi)} / mo` },
        ],
        pieChartTitle: 'Principal vs Interest Breakup - Pie Chart',
        pieChartData: [
          { label: 'Principal Loan Amount', value: P, color: '#2376b8' },
          { label: 'Total Interest Outgo', value: totalInterest, color: '#f87b1f' },
        ],
        comparisonTitle: 'EMI Payment Comparison',
        comparisonData: comp,
        series1Name: 'Principal Repaid',
        series2Name: 'Total Paid (Principal+Interest)',
      };
    }

    // 10. TAX
    if (slug === 'tax-calculator') {
      const gross = Number(taxIncome) || 0;
      let taxNew = 0;
      const taxableNew = Math.max(0, gross - 75000);
      if (taxableNew > 300000) {
        if (taxableNew > 300000) taxNew += Math.min(300000, taxableNew - 300000) * 0.05;
        if (taxableNew > 600000) taxNew += Math.min(300000, taxableNew - 600000) * 0.10;
        if (taxableNew > 900000) taxNew += Math.min(300000, taxableNew - 900000) * 0.15;
        if (taxableNew > 1200000) taxNew += Math.min(300000, taxableNew - 1200000) * 0.20;
        if (taxableNew > 1500000) taxNew += (taxableNew - 1500000) * 0.30;
        taxNew = Math.round(taxNew * 1.04);
      }

      const deductions = 50000 + Math.min(150000, Number(tax80C)) + Math.min(50000, Number(tax80D)) + Math.min(50000, Number(taxNps));
      const taxableOld = Math.max(0, gross - deductions);
      let taxOld = 0;
      if (taxableOld > 250000) taxOld += Math.min(250000, taxableOld - 250000) * 0.05;
      if (taxableOld > 500000) taxOld += Math.min(500000, taxableOld - 500000) * 0.20;
      if (taxableOld > 1000000) taxOld += (taxableOld - 1000000) * 0.30;
      taxOld = Math.round(taxOld * 1.04);

      const bestRegime = taxNew <= taxOld ? 'New Tax Regime' : 'Old Tax Regime';
      const bestTax = Math.min(taxNew, taxOld);
      const savings = Math.abs(taxNew - taxOld);

      const comp = [
        { label: 'Slab 1', series1: 25000, series2: 15000 },
        { label: 'Slab 2', series1: 75000, series2: 60000 },
        { label: 'Slab 3', series1: 150000, series2: 125000 },
        { label: 'Total', series1: taxOld, series2: taxNew },
      ];

      return {
        summaryRows: [
          { label: 'Gross Annual Income', value: formatINR(gross) },
          { label: 'Tax Under New Regime', value: formatINR(taxNew) },
          { label: 'Tax Under Old Regime', value: formatINR(taxOld) },
          { label: 'Recommended Best Regime', value: bestRegime },
          { label: 'Tax Saved by Choosing Best', value: formatINR(savings) },
        ],
        pieChartTitle: 'Income vs Tax Liability - Pie Chart',
        pieChartData: [
          { label: 'Net Take-Home Income', value: Math.max(0, gross - bestTax), color: '#89b441' },
          { label: 'Tax Liability', value: bestTax, color: '#2376b8' },
        ],
        comparisonTitle: 'Regime Tax Comparison',
        comparisonData: comp,
        series1Name: 'Old Tax Regime',
        series2Name: 'New Tax Regime',
      };
    }

    // 11. MARRIAGE
    if (slug === 'marriage-expense-calculator') {
      const goal = computeGoal(marrCost, marrYears, marrInflation, marrReturn);

      const comp = [];
      const years = Number(marrYears) || 1;
      for (let y = 1; y <= years; y++) {
        comp.push({
          label: `${y}`,
          series1: Number(marrCost),
          series2: Math.round(Number(marrCost) * Math.pow(1 + Number(marrInflation) / 100, y)),
        });
      }

      return {
        summaryRows: [
          { label: 'Current Cost of Wedding', value: formatINR(marrCost) },
          { label: 'Future Cost of Wedding', value: formatINR(goal.futureCost) },
          { label: 'Planning Through SIP', value: formatINR(goal.monthlySip) },
          { label: 'Planning Through Lump Sum', value: formatINR(goal.lumpsum) },
        ],
        pieChartTitle: 'Current & Future Cost Of Wedding Breakup - Pie Chart',
        pieChartData: [
          { label: 'Current Cost of Wedding', value: Number(marrCost), color: '#2376b8' },
          { label: 'Future Cost of Wedding', value: goal.futureCost, color: '#89b441' },
        ],
        comparisonTitle: 'Wedding Planning Comparison',
        comparisonData: comp,
        series1Name: 'Current Cost of Wedding',
        series2Name: 'Future Cost of Wedding',
      };
    }

    // 12. EDUCATION
    if (slug === 'education-cost-calculator') {
      const goal = computeGoal(eduCost, eduYears, eduInflation, eduReturn);

      const comp = [];
      const years = Number(eduYears) || 1;
      for (let y = 1; y <= years; y++) {
        comp.push({
          label: `${y}`,
          series1: Number(eduCost),
          series2: Math.round(Number(eduCost) * Math.pow(1 + Number(eduInflation) / 100, y)),
        });
      }

      return {
        summaryRows: [
          { label: 'Current Cost of Education', value: formatINR(eduCost) },
          { label: 'Future Cost of Education', value: formatINR(goal.futureCost) },
          { label: 'Planning Through SIP', value: formatINR(goal.monthlySip) },
          { label: 'Planning Through Lump Sum', value: formatINR(goal.lumpsum) },
        ],
        pieChartTitle: 'Current & Future Cost Of Education Breakup - Pie Chart',
        pieChartData: [
          { label: 'Current Cost of Education', value: Number(eduCost), color: '#2376b8' },
          { label: 'Future Cost of Education', value: goal.futureCost, color: '#89b441' },
        ],
        comparisonTitle: 'Education Planning Comparison',
        comparisonData: comp,
        series1Name: 'Current Cost of Education',
        series2Name: 'Future Cost of Education',
      };
    }

    // 13. HOME LOAN
    if (slug === 'home-loan-calculator') {
      const property = Number(homeProperty) || 0;
      const down = Number(homeDown) || 0;
      const P = Math.max(0, property - down);
      const r = (Number(homeRate) || 0) / 100 / 12;
      const n = (Number(homeYears) || 1) * 12;

      const emi = r > 0 ? Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : Math.round(P / n);
      const totalPayment = emi * n;
      const totalInterest = Math.max(0, totalPayment - P);

      const comp = [];
      const years = Number(homeYears) || 1;
      for (let y = 1; y <= years; y++) {
        comp.push({
          label: `${y}`,
          series1: Math.round((P / years) * y),
          series2: Math.round(((P + totalInterest) / years) * y),
        });
      }

      return {
        summaryRows: [
          { label: 'Property Cost', value: formatINR(property) },
          { label: 'Down Payment', value: formatINR(down) },
          { label: 'Net Home Loan Financed', value: formatINR(P) },
          { label: 'Total Interest Outgo', value: formatINR(totalInterest) },
          { label: 'Monthly Home Loan EMI', value: `${formatINR(emi)} / mo` },
        ],
        pieChartTitle: 'Home Loan Cost Breakup - Pie Chart',
        pieChartData: [
          { label: 'Net Loan Principal', value: P, color: '#2376b8' },
          { label: 'Total Interest Outgo', value: totalInterest, color: '#f87b1f' },
          { label: 'Down Payment', value: down, color: '#89b441' },
        ],
        comparisonTitle: 'Home Loan Payment Comparison',
        comparisonData: comp,
        series1Name: 'Principal Financed',
        series2Name: 'Total Cost (Loan + Interest)',
      };
    }

    // 14. VACATION
    if (slug === 'vacation-budget-calculator') {
      const target = Number(vacCost) || 0;
      const months = Number(vacMonths) || 1;
      const rate = Number(vacReturn) || 0;

      const r = rate / 100 / 12;
      const factor = ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
      const monthlyRequired = factor > 0 ? Math.round(target / factor) : Math.round(target / months);

      const comp = [];
      for (let m = 1; m <= 5; m++) {
        const interval = Math.round((months / 5) * m);
        comp.push({
          label: `${interval}m`,
          series1: monthlyRequired * interval,
          series2: target,
        });
      }

      return {
        summaryRows: [
          { label: 'Estimated Vacation Budget', value: formatINR(target) },
          { label: 'Planning Horizon', value: `${months} Months` },
          { label: 'Planning Through Monthly SIP', value: `${formatINR(monthlyRequired)} / mo` },
          { label: 'Projected Target Holiday Fund', value: formatINR(target) },
        ],
        pieChartTitle: 'Vacation Fund Breakup - Pie Chart',
        pieChartData: [
          { label: 'Your Monthly Savings', value: monthlyRequired * months, color: '#2376b8' },
          { label: 'Compound Gains Earned', value: Math.max(0, target - monthlyRequired * months), color: '#89b441' },
        ],
        comparisonTitle: 'Vacation Savings Comparison',
        comparisonData: comp,
        series1Name: 'Monthly Savings Total',
        series2Name: 'Target Budget',
      };
    }

    // MF TOOLS (15-20)
    const mfComp = [
      { label: '1Y', series1: 100000, series2: 115000 },
      { label: '2Y', series1: 200000, series2: 242000 },
      { label: '3Y', series1: 300000, series2: 385000 },
      { label: '4Y', series1: 400000, series2: 540000 },
      { label: '5Y', series1: 500000, series2: 720000 },
    ];
    return {
      summaryRows: [
        { label: 'Selected Scheme', value: mfSchemeSearch },
        { label: 'Historical Timeframe', value: mfTimeframe },
        { label: 'Simulated Historical Return', value: '+15.8% CAGR' },
        { label: 'Benchmark Alpha Yield', value: '+3.2% vs NIFTY 50' },
      ],
      pieChartTitle: 'Alpha & Return Breakup - Pie Chart',
      pieChartData: [
        { label: 'Benchmark Yield', value: 12.6, color: '#2376b8' },
        { label: 'Scheme Alpha', value: 3.2, color: '#89b441' },
      ],
      comparisonTitle: 'Scheme vs Benchmark Comparison',
      comparisonData: mfComp,
      series1Name: 'Benchmark Return',
      series2Name: 'Scheme Performance',
    };
  }, [
    slug,
    sipMonthly,
    sipRate,
    sipYears,
    lumpAmount,
    lumpYears,
    lumpRate,
    stpCorpus,
    stpMonthly,
    stpRate,
    stpYears,
    swpCorpus,
    swpWithdrawal,
    swpRate,
    swpYears,
    retCurrentAge,
    retRetireAge,
    retExpense,
    retInflation,
    retReturn,
    retYears,
    delayMonthly,
    delayRate,
    delayTotalYears,
    delayYears,
    insIncome,
    insExpense,
    insLoans,
    insSavings,
    insYears,
    emiPrincipal,
    emiRate,
    emiYears,
    taxIncome,
    tax80C,
    tax80D,
    taxNps,
    marrCost,
    marrYears,
    marrInflation,
    marrReturn,
    eduCost,
    eduYears,
    eduInflation,
    eduReturn,
    homeProperty,
    homeDown,
    homeYears,
    homeRate,
    carCost,
    carYears,
    carInflation,
    carReturn,
    vacCost,
    vacMonths,
    vacReturn,
    mfSchemeSearch,
    mfTimeframe,
  ]);

  // Handle PDF Export
  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      await exportCalculatorToPdf({
        elementId: 'calculator-report-view',
        title: tool.title,
        fileName: `Finasset_${slug}_Report.pdf`,
      });
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Other related calculators for bottom grid
  const otherCalculators = useMemo(() => {
    return Object.values(ALL_CALCULATORS)
      .filter((c) => c.slug !== slug && c.section === tool.section)
      .slice(0, 4);
  }, [slug, tool.section]);

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      {/* Top Breadcrumb Header */}
      <div className="bg-[#0f2b44] text-white border-b border-slate-800 py-3.5 px-4 sm:px-8">
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

      {/* Main Interactive Tool Body matching reference design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* ========================================================= */}
        {/* REPORT CARD VIEW (Captured by PDF Downloader)             */}
        {/* ========================================================= */}
        <div
          id="calculator-report-view"
          className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden"
        >
          {/* Top Blue Header Ribbon matching reference image */}
          <div className="bg-[#2376b8] text-white px-5 sm:px-7 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight">
                {tool.title}
              </h1>
            </div>
            <span className="text-[11px] font-semibold bg-white/15 px-3 py-0.5 rounded-full border border-white/20">
              {tool.badge}
            </span>
          </div>

          {/* Calculator 2-Column Content Grid */}
          <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* ===================================================== */}
            {/* LEFT COLUMN: INPUT SLIDERS & BREAKDOWN TABLE          */}
            {/* ===================================================== */}
            <div className="lg:col-span-6 border border-slate-300 rounded-2xl p-5 sm:p-6 bg-white flex flex-col justify-between shadow-sm">
              {/* Form Input Sliders */}
              <div className="space-y-4 mb-6">
                {/* 1. SIP */}
                {slug === 'sip-calculator' && (
                  <>
                    <SliderInput
                      label="Total Investment (₹)"
                      value={sipMonthly}
                      onChange={setSipMonthly}
                      min={1000}
                      max={200000}
                      step={1000}
                      isCurrency
                    />
                    <SliderInput
                      label="Time Period (Years)"
                      value={sipYears}
                      onChange={setSipYears}
                      min={1}
                      max={35}
                      step={1}
                    />
                    <SliderInput
                      label="Expected Return (%)"
                      value={sipRate}
                      onChange={setSipRate}
                      min={1}
                      max={30}
                      step={0.5}
                    />
                  </>
                )}

                {/* 2. LUMPSUM (Exact labels & order matching Image 1) */}
                {slug === 'lumpsum-calculator' && (
                  <>
                    <SliderInput
                      label="Total Investment (₹)"
                      value={lumpAmount}
                      onChange={setLumpAmount}
                      min={1000}
                      max={10000000}
                      step={1000}
                      isCurrency
                    />
                    <SliderInput
                      label="Time Period (Years)"
                      value={lumpYears}
                      onChange={setLumpYears}
                      min={1}
                      max={30}
                      step={1}
                    />
                    <SliderInput
                      label="Expected Return (%)"
                      value={lumpRate}
                      onChange={setLumpRate}
                      min={1}
                      max={30}
                      step={0.5}
                    />
                  </>
                )}

                {/* 3. CAR PURCHASE CALCULATOR (Exact match to reference image) */}
                {slug === 'car-purchase-calculator' && (
                  <>
                    <SliderInput
                      label="Current Cost (₹)"
                      value={carCost}
                      onChange={setCarCost}
                      min={1000}
                      max={10000000}
                      step={1000}
                      isCurrency
                    />
                    <SliderInput
                      label="After How Many Years Do You Wish To Plan Your Dream Car (Y)"
                      value={carYears}
                      onChange={setCarYears}
                      min={1}
                      max={15}
                      step={1}
                    />
                    <SliderInput
                      label="Rate of Return (%)"
                      value={carReturn}
                      onChange={setCarReturn}
                      min={1}
                      max={30}
                      step={1}
                    />
                    <SliderInput
                      label="Inflation Rate (%)"
                      value={carInflation}
                      onChange={setCarInflation}
                      min={1}
                      max={25}
                      step={1}
                    />
                  </>
                )}

                {/* 4. STP */}
                {slug === 'stp-calculator' && (
                  <>
                    <SliderInput
                      label="Source Liquid Corpus (₹)"
                      value={stpCorpus}
                      onChange={setStpCorpus}
                      min={100000}
                      max={10000000}
                      step={50000}
                      isCurrency
                    />
                    <SliderInput
                      label="Monthly Transfer Amount (₹)"
                      value={stpMonthly}
                      onChange={setStpMonthly}
                      min={5000}
                      max={500000}
                      step={5000}
                      isCurrency
                    />
                    <SliderInput
                      label="Equity Return Rate (%)"
                      value={stpRate}
                      onChange={setStpRate}
                      min={8}
                      max={24}
                      step={0.5}
                    />
                    <SliderInput
                      label="Transfer Period (Years)"
                      value={stpYears}
                      onChange={setStpYears}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </>
                )}

                {/* 5. SWP */}
                {slug === 'swp-calculator' && (
                  <>
                    <SliderInput
                      label="Initial Investment Corpus (₹)"
                      value={swpCorpus}
                      onChange={setSwpCorpus}
                      min={500000}
                      max={20000000}
                      step={100000}
                      isCurrency
                    />
                    <SliderInput
                      label="Monthly Withdrawal Amount (₹)"
                      value={swpWithdrawal}
                      onChange={setSwpWithdrawal}
                      min={5000}
                      max={200000}
                      step={2000}
                      isCurrency
                    />
                    <SliderInput
                      label="Expected Return Rate (%)"
                      value={swpRate}
                      onChange={setSwpRate}
                      min={6}
                      max={15}
                      step={0.5}
                    />
                    <SliderInput
                      label="Withdrawal Tenure (Years)"
                      value={swpYears}
                      onChange={setSwpYears}
                      min={1}
                      max={30}
                      step={1}
                    />
                  </>
                )}

                {/* 6. RETIREMENT */}
                {slug === 'retirement-corpus-calculator' && (
                  <>
                    <SliderInput
                      label="Current Age (Years)"
                      value={retCurrentAge}
                      onChange={setRetCurrentAge}
                      min={20}
                      max={60}
                      step={1}
                    />
                    <SliderInput
                      label="Planned Retirement Age (Years)"
                      value={retRetireAge}
                      onChange={setRetRetireAge}
                      min={45}
                      max={75}
                      step={1}
                    />
                    <SliderInput
                      label="Current Monthly Living Expense (₹)"
                      value={retExpense}
                      onChange={setRetExpense}
                      min={15000}
                      max={300000}
                      step={5000}
                      isCurrency
                    />
                    <SliderInput
                      label="Expected Inflation Rate (%)"
                      value={retInflation}
                      onChange={setRetInflation}
                      min={3}
                      max={12}
                      step={0.5}
                    />
                    <SliderInput
                      label="Pre-Retirement Investment Return (%)"
                      value={retReturn}
                      onChange={setRetReturn}
                      min={8}
                      max={18}
                      step={0.5}
                    />
                  </>
                )}

                {/* 7. DELAY */}
                {slug === 'investment-delay-calculator' && (
                  <>
                    <SliderInput
                      label="Monthly SIP Amount (₹)"
                      value={delayMonthly}
                      onChange={setDelayMonthly}
                      min={2000}
                      max={100000}
                      step={1000}
                      isCurrency
                    />
                    <SliderInput
                      label="Delay in Starting (Years)"
                      value={delayYears}
                      onChange={setDelayYears}
                      min={1}
                      max={10}
                      step={1}
                    />
                    <SliderInput
                      label="Total Horizon (Years)"
                      value={delayTotalYears}
                      onChange={setDelayTotalYears}
                      min={5}
                      max={35}
                      step={1}
                    />
                    <SliderInput
                      label="Expected Return Rate (%)"
                      value={delayRate}
                      onChange={setDelayRate}
                      min={8}
                      max={18}
                      step={0.5}
                    />
                  </>
                )}

                {/* 8. LIFE INSURANCE */}
                {slug === 'life-insurance-calculator' && (
                  <>
                    <SliderInput
                      label="Annual Income (₹)"
                      value={insIncome}
                      onChange={setInsIncome}
                      min={300000}
                      max={10000000}
                      step={50000}
                      isCurrency
                    />
                    <SliderInput
                      label="Annual Household Expenses (₹)"
                      value={insExpense}
                      onChange={setInsExpense}
                      min={150000}
                      max={5000000}
                      step={50000}
                      isCurrency
                    />
                    <SliderInput
                      label="Outstanding Loans & Liabilities (₹)"
                      value={insLoans}
                      onChange={setInsLoans}
                      min={0}
                      max={20000000}
                      step={100000}
                      isCurrency
                    />
                    <SliderInput
                      label="Current Savings & Investments (₹)"
                      value={insSavings}
                      onChange={setInsSavings}
                      min={0}
                      max={10000000}
                      step={100000}
                      isCurrency
                    />
                  </>
                )}

                {/* 9. EMI */}
                {slug === 'emi-calculator' && (
                  <>
                    <SliderInput
                      label="Loan Amount (₹)"
                      value={emiPrincipal}
                      onChange={setEmiPrincipal}
                      min={100000}
                      max={20000000}
                      step={50000}
                      isCurrency
                    />
                    <SliderInput
                      label="Rate of Interest (% p.a.)"
                      value={emiRate}
                      onChange={setEmiRate}
                      min={6}
                      max={18}
                      step={0.25}
                    />
                    <SliderInput
                      label="Loan Tenure (Years)"
                      value={emiYears}
                      onChange={setEmiYears}
                      min={1}
                      max={30}
                      step={1}
                    />
                  </>
                )}

                {/* 10. TAX */}
                {slug === 'tax-calculator' && (
                  <>
                    <SliderInput
                      label="Annual Gross Salary / Income (₹)"
                      value={taxIncome}
                      onChange={setTaxIncome}
                      min={300000}
                      max={10000000}
                      step={50000}
                      isCurrency
                    />
                    <SliderInput
                      label="Section 80C Deductions (₹)"
                      value={tax80C}
                      onChange={setTax80C}
                      min={0}
                      max={150000}
                      step={5000}
                      isCurrency
                    />
                    <SliderInput
                      label="Section 80D Health Insurance (₹)"
                      value={tax80D}
                      onChange={setTax80D}
                      min={0}
                      max={100000}
                      step={5000}
                      isCurrency
                    />
                  </>
                )}

                {/* 11. MARRIAGE */}
                {slug === 'marriage-expense-calculator' && (
                  <>
                    <SliderInput
                      label="Current Estimated Cost (₹)"
                      value={marrCost}
                      onChange={setMarrCost}
                      min={200000}
                      max={20000000}
                      step={50000}
                      isCurrency
                    />
                    <SliderInput
                      label="After How Many Years (Y)"
                      value={marrYears}
                      onChange={setMarrYears}
                      min={1}
                      max={25}
                      step={1}
                    />
                    <SliderInput
                      label="Rate of Return (%)"
                      value={marrReturn}
                      onChange={setMarrReturn}
                      min={6}
                      max={24}
                      step={0.5}
                    />
                    <SliderInput
                      label="Inflation Rate (%)"
                      value={marrInflation}
                      onChange={setMarrInflation}
                      min={3}
                      max={15}
                      step={0.5}
                    />
                  </>
                )}

                {/* 12. EDUCATION */}
                {slug === 'education-cost-calculator' && (
                  <>
                    <SliderInput
                      label="Current Cost of Education (₹)"
                      value={eduCost}
                      onChange={setEduCost}
                      min={200000}
                      max={20000000}
                      step={50000}
                      isCurrency
                    />
                    <SliderInput
                      label="Years to College (Y)"
                      value={eduYears}
                      onChange={setEduYears}
                      min={1}
                      max={25}
                      step={1}
                    />
                    <SliderInput
                      label="Rate of Return (%)"
                      value={eduReturn}
                      onChange={setEduReturn}
                      min={6}
                      max={24}
                      step={0.5}
                    />
                    <SliderInput
                      label="Education Inflation Rate (%)"
                      value={eduInflation}
                      onChange={setEduInflation}
                      min={4}
                      max={18}
                      step={0.5}
                    />
                  </>
                )}

                {/* 13. HOME LOAN */}
                {slug === 'home-loan-calculator' && (
                  <>
                    <SliderInput
                      label="Property Cost (₹)"
                      value={homeProperty}
                      onChange={setHomeProperty}
                      min={1000000}
                      max={50000000}
                      step={200000}
                      isCurrency
                    />
                    <SliderInput
                      label="Down Payment (₹)"
                      value={homeDown}
                      onChange={setHomeDown}
                      min={200000}
                      max={20000000}
                      step={100000}
                      isCurrency
                    />
                    <SliderInput
                      label="Home Loan Interest Rate (% p.a.)"
                      value={homeRate}
                      onChange={setHomeRate}
                      min={6.5}
                      max={15}
                      step={0.25}
                    />
                    <SliderInput
                      label="Tenure (Years)"
                      value={homeYears}
                      onChange={setHomeYears}
                      min={1}
                      max={30}
                      step={1}
                    />
                  </>
                )}

                {/* 14. VACATION */}
                {slug === 'vacation-budget-calculator' && (
                  <>
                    <SliderInput
                      label="Estimated Vacation Budget (₹)"
                      value={vacCost}
                      onChange={setVacCost}
                      min={50000}
                      max={3000000}
                      step={10000}
                      isCurrency
                    />
                    <SliderInput
                      label="Planning Horizon (Months)"
                      value={vacMonths}
                      onChange={setVacMonths}
                      min={3}
                      max={60}
                      step={1}
                    />
                    <SliderInput
                      label="Expected Return Rate (%)"
                      value={vacReturn}
                      onChange={setVacReturn}
                      min={4}
                      max={15}
                      step={0.5}
                    />
                  </>
                )}

                {/* MF TOOLS */}
                {tool.section === 'mf-tools' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Scheme Search / Select</label>
                      <input
                        type="text"
                        value={mfSchemeSearch}
                        onChange={(e) => setMfSchemeSearch(e.target.value)}
                        className="w-full py-1.5 px-3 text-xs sm:text-sm font-semibold text-slate-800 bg-white border border-slate-300 rounded-md shadow-inner"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Timeframe</label>
                        <select
                          value={mfTimeframe}
                          onChange={(e) => setMfTimeframe(e.target.value)}
                          className="w-full py-1.5 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md"
                        >
                          <option>1 Year</option>
                          <option>3 Years</option>
                          <option>5 Years</option>
                          <option>10 Years</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                        <select
                          value={mfCategory}
                          onChange={(e) => setMfCategory(e.target.value)}
                          className="w-full py-1.5 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md"
                        >
                          <option>Flexi Cap Fund</option>
                          <option>Large & Mid Cap</option>
                          <option>Small Cap Fund</option>
                          <option>Debt Liquid Fund</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Breakdown Summary Table matching reference image */}
              <div className="border-t border-slate-200 pt-4 space-y-2.5">
                {summaryRows.map((row, idx) => (
                  <div
                    key={row.label + idx}
                    className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-b-0 text-xs sm:text-sm"
                  >
                    <span className="text-slate-600 font-medium">{row.label}</span>
                    <span className="font-extrabold text-slate-900 tracking-tight">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Download PDF Option Row at the bottom of the left card */}
              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  Download
                </span>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                  className="inline-flex items-center gap-1.5 p-1 rounded hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
                  title="Download calculation report, pie chart and comparison chart as PDF"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      <span className="text-xs font-semibold text-slate-600">Exporting...</span>
                    </>
                  ) : (
                    <svg
                      className="w-5 h-6 text-red-500 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5c0 .83-.67 1.5-1.5 1.5H7v2H5.5V9H8c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V9H13c.83 0 1.5.67 1.5 1.5v3zm4-3H17v1h1.5V13H17v2h-1.5V9h3v1.5zM7 10.5h1v1H7v-1zm4.5 1.5h1v1.5h-1V12z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* ===================================================== */}
            {/* RIGHT COLUMN: PIE CHART (TOP) & COMPARISON (BOTTOM)   */}
            {/* ===================================================== */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
              {/* TOP: Donut / Pie Chart */}
              <div className="flex-1">
                <CalculatorPieChart
                  title={pieChartTitle}
                  data={pieChartData}
                />
              </div>

              {/* BOTTOM: Multi-Bar Comparison Diagram */}
              <div className="flex-1">
                <CalculatorComparisonChart
                  title={comparisonTitle}
                  data={comparisonData}
                  series1Name={series1Name}
                  series1Color="#2376b8"
                  series2Name={series2Name}
                  series2Color="#89b441"
                />
              </div>
            </div>
          </div>

          {/* Bottom Disclaimer Row directly inside the report view */}
          <div className="px-5 sm:px-7 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            <strong className="text-slate-700">Disclaimer:-</strong> This calculator is for informational and illustrative purposes only and does not constitute investment advice. Actual results may vary with market performance.
          </div>
        </div>

        {/* Advisory Note & Certified Wealth Guidance */}
        <div className="mt-8 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2376b8]/10 text-[#2376b8] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0f2b44]">
                Want Personalized Portfolio Guidance?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculations are based on assumed compounding rates. Consult our SEBI-registered advisors to match your goals.
              </p>
            </div>
          </div>
          <Link
            href="/contact-us#callback"
            className="w-full sm:w-auto bg-[#f87b1f] hover:bg-[#d9620b] text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md shadow-[#f87b1f]/20 flex items-center justify-center gap-2 shrink-0"
          >
            <span>Book Advisor Call</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ========================================================= */}
        {/* OTHER POPULAR CALCULATORS SECTION (ServiceCard Grid)     */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {otherCalculators.map((other) => (
              <MinimalCalculatorCard
                key={other.slug}
                title={other.title}
                href={`/investor/financial-calculator/${other.slug}`}
                tag={other.badge}
                description={other.desc}
                icon={other.iconName}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
