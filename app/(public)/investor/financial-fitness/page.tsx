'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  RotateCcw,
  Check,
  Bookmark,
  Share2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  Activity,
  Award,
} from 'lucide-react';

import {
  FinancialFitnessQuestion,
  financialFitnessQuestions,
  calculateFinancialFitness,
  FinancialFitnessResult,
} from '@/lib/financialFitnessQuestions';

export type { FinancialFitnessQuestion };
export { financialFitnessQuestions };

export default function FinancialFitnessPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<boolean>(false);
  const [showReview, setShowReview] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const totalQuestions = financialFitnessQuestions.length;
  const currentQuestion = financialFitnessQuestions[currentStep];
  const selectedOption = answers[currentQuestion?.id];

  // Calculate score: Each "Yes" is worth 10 points (total 100 points)
  const yesCount = Object.values(answers).filter((val) => val === 'Yes').length;
  const totalScore = yesCount * 10;
  const result: FinancialFitnessResult = calculateFinancialFitness(totalScore);

  // Handle option selection
  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  // Handle NEXT button click
  const handleNext = () => {
    if (!selectedOption) return;

    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      setIsCompleted(true);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted || !currentQuestion) return;

      // Enter to advance if selected
      if (e.key === 'Enter' && selectedOption) {
        e.preventDefault();
        handleNext();
      }

      // 1 for Yes, 2 for No
      if (e.key === '1') {
        e.preventDefault();
        handleSelectOption('Yes');
      } else if (e.key === '2') {
        e.preventDefault();
        handleSelectOption('No');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, selectedOption, isCompleted, currentQuestion]);

  // Retake assessment
  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
    setSavedStatus(false);
    setShowReview(false);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Save assessment to localStorage
  const handleSaveAssessment = () => {
    try {
      const payload = {
        category: result.category,
        title: result.title,
        score: totalScore,
        maxScore: 100,
        yesCount,
        tagline: result.subtitle,
        savedAt: new Date().toISOString(),
        answers: Object.entries(answers).map(([qId, ans]) => ({
          questionId: Number(qId),
          answer: ans,
        })),
      };
      localStorage.setItem('user_financial_fitness', JSON.stringify(payload));
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 3000);
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  };

  // Share diagnostic link
  const handleShare = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-10 sm:py-16 px-4">
      {!isCompleted ? (
        /* ========================================================= */
        /* MULTI-STEP QUESTIONNAIRE CARD                             */
        /* ========================================================= */
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm py-10 sm:py-12 px-6 sm:px-12 transition-all duration-300">
          {/* Centered Heading */}
          <h2 className="text-xl sm:text-2xl font-medium text-slate-800 text-center mb-3 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Subtitle / Explanatory Context if available */}
          {currentQuestion.subtitle ? (
            <p className="text-xs sm:text-sm text-slate-500 text-center max-w-xl mx-auto mb-8 leading-relaxed">
              {currentQuestion.subtitle}
            </p>
          ) : (
            <div className="mb-6" />
          )}

          {/* Option Pills */}
          <div
            className="space-y-3.5 mb-8"
            role="radiogroup"
            aria-label={currentQuestion.question}
          >
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full rounded-full border px-6 py-3.5 text-slate-700 text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 text-sm sm:text-base ${
                    isSelected
                      ? 'border-[#1d70b8] bg-blue-50/40 ring-1 ring-[#1d70b8] text-slate-900 font-medium'
                      : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50/60'
                  }`}
                >
                  <span className="leading-snug">{option}</span>
                  <span
                    className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#1d70b8] bg-[#1d70b8] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Row: Centered Pill-shaped NEXT button */}
          <div className="flex items-center justify-center pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedOption}
              className="bg-[#f97316] text-white font-semibold rounded-full px-12 py-3.5 shadow-sm hover:bg-[#ea580c] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>{currentStep === totalQuestions - 1 ? 'VIEW RESULTS' : 'NEXT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* RESULTS VIEW                                              */
        /* ========================================================= */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Main Results Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm py-10 px-6 sm:px-10 transition-all duration-300">
            {/* Profile Title & Subtitle */}
            <div className="text-center pb-6 border-b border-slate-100">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Your Financial Fitness is {result.category}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
                {result.subtitle}
              </p>

              {/* Semi-Circle Speedometer / Gauge Meter (Pixel-matched to reference image) */}
              {(() => {
                const minScore = 0;
                const maxScore = 100;
                const scoreRatio = Math.max(0, Math.min(1, (totalScore - minScore) / (maxScore - minScore)));
                const radius = 120;
                const cx = 170;
                const cy = 160;
                const circumference = Math.PI * radius; // ~376.99
                const strokeDashoffset = circumference * (1 - scoreRatio);

                // Marker knob position along circumference
                const knobX = cx - radius * Math.cos(scoreRatio * Math.PI);
                const knobY = cy - radius * Math.sin(scoreRatio * Math.PI);

                // Knob color based on score ratio matching the gradient
                const getKnobColor = (ratio: number) => {
                  if (ratio <= 0.3) return '#ef4444';
                  if (ratio <= 0.55) return '#f59e0b';
                  if (ratio <= 0.75) return '#0284c7';
                  return '#10b981';
                };
                const knobColor = getKnobColor(scoreRatio);

                return (
                  <div className="mt-8 mb-2">
                    {/* Gauge Container */}
                    <div className="relative w-full max-w-[320px] sm:max-w-[360px] mx-auto select-none">
                      <svg
                        viewBox="0 0 340 185"
                        className="w-full h-auto overflow-visible"
                        aria-hidden="true"
                      >
                        <defs>
                          {/* Smooth spectrum linear gradient matching reference */}
                          <linearGradient id="fitnessGaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="28%" stopColor="#f59e0b" />
                            <stop offset="52%" stopColor="#0284c7" />
                            <stop offset="78%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>

                          {/* Subtle drop shadow for knob */}
                          <filter id="fitnessKnobGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.15" />
                          </filter>
                        </defs>

                        {/* Background subtle gray track */}
                        <path
                          d="M 50 160 A 120 120 0 0 1 290 160"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="16"
                          strokeLinecap="round"
                        />

                        {/* Active colored gradient arc */}
                        <path
                          d="M 50 160 A 120 120 0 0 1 290 160"
                          fill="none"
                          stroke="url(#fitnessGaugeGradient)"
                          strokeWidth="16"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-1000 ease-out"
                        />

                        {/* Inner dashed guide arc */}
                        <path
                          d="M 74 160 A 96 96 0 0 1 266 160"
                          fill="none"
                          stroke="#cbd5e1"
                          strokeWidth="1.5"
                          strokeDasharray="5 5"
                        />

                        {/* Indicator Marker Knob (Ring with white center) */}
                        <circle
                          cx={knobX}
                          cy={knobY}
                          r={11}
                          fill="#ffffff"
                          stroke={knobColor}
                          strokeWidth="5"
                          filter="url(#fitnessKnobGlow)"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>

                      {/* Center Score Label & Value */}
                      <div className="absolute inset-x-0 bottom-4 sm:bottom-6 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-xs sm:text-sm font-medium text-slate-500">
                          Fitness Score
                        </span>
                        <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                          {totalScore}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
                          out of 100 ({yesCount}/10 positive checks)
                        </span>
                      </div>
                    </div>

                    {/* Scale Spectrum Labels under Gauge */}
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400 max-w-[320px] sm:max-w-[360px] mx-auto px-4 mt-2">
                      <span className="text-rose-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                        Vulnerable (0)
                      </span>
                      <span className="text-sky-600 hidden sm:flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                        Moderate (50)
                      </span>
                      <span className="text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Champion (100)
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Diagnostic Summary Description */}
            <div className="py-6 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Diagnostic Analysis
              </h2>
              <p className="text-sm leading-relaxed text-slate-700">
                {result.description}
              </p>
            </div>

            {/* Strategic Action Plan to Elevate Your Score */}
            <div className="py-6 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Action Plan to Strengthen Financial Resilience
              </h2>
              <ul className="space-y-2.5 text-sm text-slate-700">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1d70b8] mt-2 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Priority Solutions */}
            <div className="py-6 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#1d70b8]" />
                <span>Recommended Financial Solutions</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {result.suggestedActions.map((action, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200"
                  >
                    {action}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleSaveAssessment}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1d70b8] text-white font-semibold text-sm hover:bg-[#165a94] active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  {savedStatus ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Report Saved ✓</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Save Diagnostic Report</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRetake}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Fitness Test</span>
                </button>
              </div>

              {/* Utility actions */}
              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 hover:text-[#1d70b8] transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Share Diagnostic'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReview(!showReview)}
                  className="inline-flex items-center gap-1 text-[#1d70b8] font-semibold hover:underline cursor-pointer"
                >
                  <span>{showReview ? 'Hide' : 'Review'} All 10 Checkpoints</span>
                  {showReview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Optional Review 10 Checkpoints Breakdown */}
          {showReview && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4 transition-all">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                10-Point Health Audit Breakdown
              </h2>
              <div className="space-y-3 divide-y divide-slate-100">
                {financialFitnessQuestions.map((q) => {
                  const ans = answers[q.id];
                  const isYes = ans === 'Yes';
                  return (
                    <div key={q.id} className="pt-3 first:pt-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-slate-700">
                            {q.id}. {q.question}
                          </p>
                          {q.subtitle && (
                            <p className="text-[11px] text-slate-400 leading-snug">
                              {q.subtitle}
                            </p>
                          )}
                        </div>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 ${
                            isYes
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isYes ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Yes (+10)</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              <span>No (0)</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Advisor CTA Card */}
          <div className="bg-gradient-to-br from-[#0f2b44] to-[#164366] text-white rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#f97316]">
                  Personalized Advisory
                </span>
                <h3 className="text-lg sm:text-xl font-bold">
                  Ready to elevate your financial health?
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-md">
                  Schedule a confidential 1-on-1 financial health consultation with Finasset Wealth advisors in Bhubaneswar to address insurance gaps, debt loads, and goal planning.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#f97316] text-white font-semibold text-xs sm:text-sm hover:bg-[#ea580c] transition-all shadow-sm text-center"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Health Review</span>
                </Link>
                <Link
                  href="/investor/financial-calculator/sip-calculator"
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors text-center border border-white/20"
                >
                  <span>Open SIP Calculator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regulatory Disclaimer */}
      <div className="max-w-3xl mx-auto mt-8 text-center">
        <p className="text-[11px] text-slate-400 leading-relaxed">
          <Info className="w-3 h-3 inline mr-1 text-slate-400" />
          <strong>Regulatory Disclaimer:</strong> Financial Fitness assessment results are provided for educational and diagnostic awareness purposes only. They do not constitute guaranteed financial outcomes or certified advisory contracts. Mutual Fund investments are subject to market risks; please review scheme information documents carefully before investing.
        </p>
      </div>
    </div>
  );
}
