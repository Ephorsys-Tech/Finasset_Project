import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format number into Indian Rupee format (INR)
 */
export function formatINR(val, decimals = 0) {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  const num = Number(val);
  return '₹' + num.toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

/**
 * Short Indian currency formatter (Lakhs & Crores)
 */
export function formatCompactINR(amount) {
  if (!amount || isNaN(amount)) return '₹0';
  const num = Math.abs(Number(amount));
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)} K`;
  }
  return `₹${num.toFixed(0)}`;
}

/**
 * Format standard readable date
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Calculate SIP Future Value
 * Formula: M * ({[1 + i]^n - 1} / i) * (1 + i)
 * where:
 * M = monthly investment
 * i = monthly rate (annualRate / 12 / 100)
 * n = total months (years * 12)
 */
export function calculateSipProjection(monthlyAmount, annualReturnPct, years) {
  const M = Number(monthlyAmount);
  const r = Number(annualReturnPct) / 100;
  const n = Number(years) * 12;
  const i = r / 12;

  if (i === 0) {
    const invested = M * n;
    return {
      investedAmount: invested,
      estimatedReturns: 0,
      totalValue: invested,
    };
  }

  const futureValue = M * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const invested = M * n;
  const returns = futureValue - invested;

  return {
    investedAmount: Math.round(invested),
    estimatedReturns: Math.round(returns),
    totalValue: Math.round(futureValue),
  };
}

/**
 * Calculate Lumpsum Future Value
 * Formula: P * (1 + r)^t
 */
export function calculateLumpsumProjection(principal, annualReturnPct, years) {
  const P = Number(principal);
  const r = Number(annualReturnPct) / 100;
  const t = Number(years);

  const futureValue = P * Math.pow(1 + r, t);
  const returns = futureValue - P;

  return {
    investedAmount: Math.round(P),
    estimatedReturns: Math.round(returns),
    totalValue: Math.round(futureValue),
  };
}
