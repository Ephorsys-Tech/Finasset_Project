export interface Option {
  id: string;
  label: string;
  points: number;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
}

export const riskQuestions: Question[] = [
  {
    id: 1,
    question: "Which of these investments would you feel more comfortable owning?",
    options: [
      { id: "1a", label: "Fixed deposit", points: 1 },
      { id: "1b", label: "Government stock", points: 2 },
      { id: "1c", label: "Shares in older established companies", points: 3 },
      { id: "1d", label: "Blue Chip international investments", points: 4 },
      { id: "1e", label: "Shares in overseas emerging markets", points: 5 },
    ],
  },
  {
    id: 2,
    question: "Is your future financial goal",
    options: [
      { id: "2a", label: "Vital, such as saving for your child's future education or saving for your retirement?", points: 1 },
      { id: "2b", label: "Important such as paying off your car early?", points: 3 },
      { id: "2c", label: "A luxury that you can do without, such as an overseas holiday?", points: 5 },
    ],
  },
  {
    id: 3,
    question: "What is your primary financial goal?",
    options: [
      { id: "3a", label: "Capital Protection: Protection of your capital against a decline in the market value of your investments.", points: 1 },
      { id: "3b", label: "Capital Income: To receive an income generated from your investments.", points: 2 },
      { id: "3c", label: "Consistency: A high degree of stability and predictability of your investment return over time.", points: 3 },
      { id: "3d", label: "Long-Term Inflation Hedge: High degree of protection of long-term purchasing power of your investment.", points: 4 },
      { id: "3e", label: "Capital Appreciation: Increase in market value of your investments, primarily through capital growth in excess of inflation.", points: 5 },
    ],
  },
  {
    id: 4,
    question: "Which of the following investment returns would most appeal to you if you were to invest an initial amount of Rs 20 000 for one year?",
    options: [
      { id: "4a", label: "A guaranteed amount of Rs 21 000.", points: 1 },
      { id: "4b", label: "Any amount between Rs 20 000 to Rs 22 000.", points: 2 },
      { id: "4c", label: "Any amount between Rs 18 000 to Rs 23 000.", points: 3 },
      { id: "4d", label: "Any amount between Rs 15 000 to Rs 26 000.", points: 4 },
      { id: "4e", label: "Any amount between Rs 0 to Rs 30 000.", points: 5 },
    ],
  },
  {
    id: 5,
    question: "Please select the statement most applicable to you:",
    options: [
      { id: "5a", label: "I would rather protect my assets, even though there may be limited growth potential.", points: 1 },
      { id: "5b", label: "I would rather experience steady growth each year.", points: 3 },
      { id: "5c", label: "I would like high growth even though it may mean very volatile returns in the short term.", points: 5 },
    ],
  },
  {
    id: 6,
    question: "Please select the statement most applicable to you:",
    options: [
      { id: "6a", label: "I believe that I will not have enough money for my goal and therefore don't want to lose what I already have.", points: 1 },
      { id: "6b", label: "I believe that I will have enough money for my goal and therefore would like a consistent long-term investment.", points: 3 },
      { id: "6c", label: "I believe that I will have more than enough money for my goal and therefore can afford to be more aggressive with the investments that I make.", points: 5 },
    ],
  },
  {
    id: 7,
    question: "I am prepared to accept short-term losses if I believe the long-term returns will be good.",
    options: [
      { id: "7a", label: "Strongly Agree", points: 5 },
      { id: "7b", label: "Agree", points: 4 },
      { id: "7c", label: "Neutral", points: 3 },
      { id: "7d", label: "Disagree", points: 2 },
      { id: "7e", label: "Strongly Disagree", points: 1 },
    ],
  },
  {
    id: 8,
    question: "I would quit my job and start my own business if the right opportunity arose.",
    options: [
      { id: "8a", label: "Strongly Agree", points: 5 },
      { id: "8b", label: "Agree", points: 4 },
      { id: "8c", label: "Neutral", points: 3 },
      { id: "8d", label: "Disagree", points: 2 },
      { id: "8e", label: "Strongly Disagree", points: 1 },
    ],
  },
  {
    id: 9,
    question: "I expect my investment earnings to increase in line with inflation over the next 5 years.",
    options: [
      { id: "9a", label: "Strongly Agree", points: 5 },
      { id: "9b", label: "Agree", points: 4 },
      { id: "9c", label: "Neutral", points: 3 },
      { id: "9d", label: "Disagree", points: 2 },
      { id: "9e", label: "Strongly Disagree", points: 1 },
    ],
  },
  {
    id: 10,
    question: "I have sufficient funds set aside to cover most emergencies.",
    options: [
      { id: "10a", label: "Strongly Agree", points: 5 },
      { id: "10b", label: "Agree", points: 4 },
      { id: "10c", label: "Neutral", points: 3 },
      { id: "10d", label: "Disagree", points: 2 },
      { id: "10e", label: "Strongly Disagree", points: 1 },
    ],
  },
];

export interface RiskProfileResult {
  category: 'Conservative' | 'Moderately Conservative' | 'Moderate' | 'Moderately Aggressive' | 'Aggressive';
  title: string;
  subtitle: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  scoreRange: string;
  allocation: {
    equity: number;
    debt: number;
    gold: number;
  };
  recommendations: string[];
  suggestedFunds: string[];
}

export function calculateRiskProfile(score: number): RiskProfileResult {
  if (score <= 18) {
    return {
      category: 'Conservative',
      title: 'Conservative Investor',
      subtitle: 'Preservation of capital with minimal tolerance for volatility',
      description:
        'You prioritize capital security and protection against loss above market-beating returns. Your main investment goal is capital safety and liquidity, accepting modest yields in return for absolute peace of mind.',
      color: '#10b981',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-200',
      scoreRange: '10 - 18 Points',
      allocation: {
        debt: 80,
        equity: 15,
        gold: 5,
      },
      recommendations: [
        'Maintain primary exposure in high-liquidity fixed income and sovereign debt instruments.',
        'Allocate a small 15% equity sleeve into blue-chip index funds to defend against long-term purchasing power erosion.',
        'Keep an emergency reserve in liquid mutual funds for seamless instant access without penalty.',
      ],
      suggestedFunds: [
        'Liquid & Overnight Debt Funds',
        'Banking & PSU Debt Funds',
        'Short Duration Bond Funds',
        'Large Cap Nifty 50 Index Funds',
        'Sovereign Gold Bonds (SGB)',
      ],
    };
  }

  if (score <= 26) {
    return {
      category: 'Moderately Conservative',
      title: 'Moderately Conservative Investor',
      subtitle: 'Steady income generation with measured equity participation',
      description:
        'You seek stability and predictable income but understand that limited equity exposure is required to outpace inflation. You can tolerate minor market drawdowns if it supports long-term wealth preservation.',
      color: '#0284c7',
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-700',
      badgeBorder: 'border-sky-200',
      scoreRange: '19 - 26 Points',
      allocation: {
        debt: 60,
        equity: 30,
        gold: 10,
      },
      recommendations: [
        'Build a solid base of quality corporate debt and conservative hybrid mutual funds.',
        'Maintain a 30% allocation to large-cap equities for steady compounding across market cycles.',
        'Incorporate 10% gold exposure to cushion broader market drawdowns.',
      ],
      suggestedFunds: [
        'Conservative Hybrid Mutual Funds',
        'Corporate Bond Funds',
        'Large Cap Index & Blue Chip Equity',
        'Target Maturity Debt Funds',
        'Gold ETFs / Sovereign Gold Bonds',
      ],
    };
  }

  if (score <= 34) {
    return {
      category: 'Moderate',
      title: 'Moderate / Balanced Investor',
      subtitle: 'Balanced growth and capital preservation across market cycles',
      description:
        'You seek a balanced blend of capital appreciation and steady income. You are willing to accept moderate short-term fluctuations in return for significant multi-year wealth accumulation.',
      color: '#1d70b8',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-[#1d70b8]',
      badgeBorder: 'border-blue-200',
      scoreRange: '27 - 34 Points',
      allocation: {
        equity: 50,
        debt: 40,
        gold: 10,
      },
      recommendations: [
        'Adopt an equal balance between growth-oriented equity mutual funds and stabilizing fixed-income securities.',
        'Utilize Balanced Advantage (Dynamic Asset Allocation) funds to automate counter-cyclical equity management.',
        'Rebalance annually to preserve target asset weightings and lock in gains.',
      ],
      suggestedFunds: [
        'Balanced Advantage / Dynamic Asset Allocation Funds',
        'Flexi-Cap Mutual Funds',
        'Large & Mid-Cap Equity Funds',
        'Medium Duration Corporate Debt Funds',
        'Multi-Asset Allocation Funds',
      ],
    };
  }

  if (score <= 42) {
    return {
      category: 'Moderately Aggressive',
      title: 'Moderately Aggressive Investor',
      subtitle: 'Long-term capital growth with tolerance for interim market dips',
      description:
        'Your primary objective is long-term capital compounding. You have an investment horizon of 5+ years and are comfortable navigating periodic market volatility in pursuit of higher alpha.',
      color: '#f97316',
      badgeBg: 'bg-orange-50',
      badgeText: 'text-orange-700',
      badgeBorder: 'border-orange-200',
      scoreRange: '35 - 42 Points',
      allocation: {
        equity: 70,
        debt: 25,
        gold: 5,
      },
      recommendations: [
        'Focus on diversified equity funds with healthy mid-cap and flexi-cap exposures.',
        'Maintain a 25% debt cushion in liquid or short-term funds to exploit market corrections and SIP opportunistically.',
        'Stick with systematic investment plans (SIPs) without pausing during corrections to benefit from rupee-cost averaging.',
      ],
      suggestedFunds: [
        'Flexi-Cap & Multi-Cap Mutual Funds',
        'Large & Mid-Cap Equity Funds',
        'Quality Mid-Cap Funds',
        'Arbitrage & Short-Duration Debt',
        'Systematic Investment Plans (SIP)',
      ],
    };
  }

  return {
    category: 'Aggressive',
    title: 'Aggressive Investor',
    subtitle: 'Maximum wealth maximization with high tolerance for volatility',
    description:
      'You are a high-growth oriented investor with an extended investment horizon (7+ years). Short-term market pullbacks do not deter your confidence; you see them as buying opportunities to maximize compounding returns.',
    color: '#e11d48',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    scoreRange: '43 - 50 Points',
    allocation: {
      equity: 85,
      debt: 10,
      gold: 5,
    },
    recommendations: [
      'Prioritize high-conviction growth equities, mid-caps, small-caps, and emerging thematic opportunities.',
      'Maintain disciplined 10% cash/arbitrage liquidity for tactical dip deployments.',
      'Adopt a strict multi-year mindset, ignoring transient noise and quarterly market volatility.',
    ],
    suggestedFunds: [
      'Mid-Cap & Small-Cap Growth Funds',
      'Multi-Cap & Thematic Funds',
      'International / Global Equity Funds',
      'Direct Equity PMS / High-Conviction Funds',
      'Tactical Arbitrage Funds for Dip Deployments',
    ],
  };
}
