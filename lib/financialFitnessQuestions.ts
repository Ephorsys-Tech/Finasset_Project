export interface FinancialFitnessQuestion {
  id: number;
  question: string;
  subtitle: string | null;
  options: string[];
}

export const financialFitnessQuestions: FinancialFitnessQuestion[] = [
  {
    id: 1,
    question: "Have you prepared a budget for household expenses?",
    subtitle: null,
    options: ["Yes", "No"],
  },
  {
    id: 2,
    question: "Do you have adequate cash in hand or at bank to maintain your lifestyle in case of job/income loss?",
    subtitle: "Adequate cash is more than 6 months regular expenses",
    options: ["Yes", "No"],
  },
  {
    id: 3,
    question: "Do you have life cover of atleast 8 times your annual income to take care of your family needs ?",
    subtitle: "Life insurance can be taken in the form of term insurance, ULIP, Endowment or money back policies",
    options: ["Yes", "No"],
  },
  {
    id: 4,
    question: "Have you taken Health Insurance for your entire family?",
    subtitle: null,
    options: ["Yes", "No"],
  },
  {
    id: 5,
    question: "Do you save more than 25% of your monthly income(take home salary) each month?",
    subtitle: null,
    options: ["Yes", "No"],
  },
  {
    id: 6,
    question: "Have you identified your financial goals and started working towards achieving them?",
    subtitle: "Child education, marriage, retirement, house purchase are all examples of financial goals. Have you identified how much money you would require for each of these goals to be met and how much time is left to achieve them",
    options: ["Yes", "No"],
  },
  {
    id: 7,
    question: "Are your investments diversified across atleast 3 asset classes",
    subtitle: "Various asset classes include Equity, Fixed income, Real estate, Gold, other commodities",
    options: ["Yes", "No"],
  },
  {
    id: 8,
    question: "Do you review and track the performance of your investment periodically?",
    subtitle: "Periodic review means checking fund performance, realignment to macro economic changes etc.",
    options: ["Yes", "No"],
  },
  {
    id: 9,
    question: "Do you know how much money you will need after retirement to maintain a desired lifestyle?",
    subtitle: "The calculation should involve the effect of inflation on all expenses for you and your dependents",
    options: ["Yes", "No"],
  },
  {
    id: 10,
    question: "Do you have a detailed written will?",
    subtitle: "A will ensures that the distribution of your wealth happens as you want it to happen",
    options: ["Yes", "No"],
  },
];

export interface FinancialFitnessResult {
  category: 'Champion' | 'Healthy' | 'Moderate' | 'Needs Attention';
  title: string;
  subtitle: string;
  description: string;
  color: string;
  scoreRange: string;
  recommendations: string[];
  keyStrengths: string[];
  suggestedActions: string[];
}

export function calculateFinancialFitness(score: number): FinancialFitnessResult {
  // Score is out of 100 (each Yes = 10 points)
  if (score >= 80) {
    return {
      category: 'Champion',
      title: 'Financially Fit Champion',
      subtitle: 'Exceptional financial resilience, disciplined planning, and comprehensive security',
      description:
        'Congratulations! You have built a remarkably robust financial fortress. With solid emergency liquidity, substantial family protection, disciplined savings, goal alignment, and estate planning, your financial health is in the top tier.',
      color: '#10b981',
      scoreRange: '80 - 100 Points',
      recommendations: [
        'Optimize tax efficiency through equity-linked mutual funds, sovereign gold bonds, and long-term capital compounding instruments.',
        'Conduct periodic rebalancing across your diversified asset classes to maintain target allocations and harvest gains.',
        'Review your estate plan and ensure nominee details across all bank accounts, mutual funds, and demat holdings are up to date.',
      ],
      keyStrengths: [
        'Strong emergency reserves protecting against unforeseen disruptions',
        'Adequate life and comprehensive family health insurance safety nets',
        'High savings rate and clear multi-year goal alignment',
      ],
      suggestedActions: [
        'Direct Equity & PMS Wealth Advisory',
        'Tax-Optimized Mutual Fund Portfolios',
        'Comprehensive Estate & Will Structuring',
      ],
    };
  }

  if (score >= 60) {
    return {
      category: 'Healthy',
      title: 'Financially Healthy & Stable',
      subtitle: 'Solid foundational habits with strategic opportunities for enhancement',
      description:
        'You maintain a healthy financial standing with good foundational security in place. By addressing a few remaining blind spots—such as formal retirement sizing, asset class diversification, or estate planning—you can easily achieve peak financial resilience.',
      color: '#0284c7',
      scoreRange: '60 - 70 Points',
      recommendations: [
        'Bridge any remaining insurance gaps to ensure life cover strictly meets at least 8x your annual income.',
        'Calculate your exact inflation-adjusted post-retirement income requirements to prevent longevity shortfalls.',
        'Spread capital across at least 3 distinct asset classes (Equity, Fixed Income, Gold/Real Estate) to reduce systemic risk.',
      ],
      keyStrengths: [
        'Consistent budgeting and proactive savings habit',
        'Essential insurance cushions established for the family',
        'Awareness of primary financial milestones',
      ],
      suggestedActions: [
        'Systematic Investment Plans (SIP) in Flexi-Cap & Multi-Asset Funds',
        'Inflation-Adjusted Retirement Calculator',
        'Term Life & Super Top-up Health Cover Review',
      ],
    };
  }

  if (score >= 40) {
    return {
      category: 'Moderate',
      title: 'Moderate Financial Fitness',
      subtitle: 'Basic elements in place, but vulnerable to unexpected financial shocks',
      description:
        'You have taken essential first steps, but significant vulnerabilities remain. Gaps in emergency reserves, health coverage, or retirement readiness leave your financial future vulnerable during economic corrections or health emergencies.',
      color: '#f59e0b',
      scoreRange: '40 - 50 Points',
      recommendations: [
        'Prioritize building a 6-month living expense buffer in liquid mutual funds before taking speculative risks.',
        'Acquire dedicated family health insurance immediately so medical bills do not erode hard-earned savings.',
        'Increase your monthly savings rate to at least 25% of take-home income through automated recurring SIP mandates.',
      ],
      keyStrengths: [
        'Initial financial awareness and intention to grow wealth',
        'Opportunity to rapidly improve score with basic structural adjustments',
        'Willingness to evaluate financial gaps transparently',
      ],
      suggestedActions: [
        'Emergency Fund Creation in Liquid Debt Mutual Funds',
        'Family Comprehensive Floater Health Insurance',
        'Goal-Based Automated SIP Planning',
      ],
    };
  }

  return {
    category: 'Needs Attention',
    title: 'Needs Immediate Attention',
    subtitle: 'Urgent intervention required to establish basic financial security and defense',
    description:
      'Your financial diagnostic indicates high exposure to risk. Without a written budget, emergency savings buffer, or life and health insurance, any income loss or contingency could jeopardize your family\'s financial stability.',
    color: '#ef4444',
    scoreRange: '0 - 30 Points',
    recommendations: [
      'Create a strict monthly household budget today to identify and eliminate non-essential expenditure leaks.',
      'Set up a primary emergency liquidity account with at least 3 to 6 months of basic living expenses.',
      'Consult with an AMFI-registered financial advisor at Finasset Wealth to construct an actionable debt-reduction and security roadmap.',
    ],
    keyStrengths: [
      'Taking this diagnostic is the first crucial step toward financial freedom',
      'Clear roadmap of high-impact fixes that can immediately elevate security',
      'Opportunity to build sound financial habits from the ground up',
    ],
    suggestedActions: [
      '1-on-1 Confidential Financial Health Consultation',
      'Basic Term Life Insurance & Family Health Cover',
      'Automated Small-Ticket SIP for Emergency Reserves',
    ],
  };
}
