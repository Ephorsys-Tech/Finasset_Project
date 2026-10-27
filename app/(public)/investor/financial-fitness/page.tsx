
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
} from 'lucide-react';

import {
  financialFitnessQuestions,
  calculateFinancialFitness,
} from '@/lib/financialFitnessQuestions';

import type {
  FinancialFitnessResult,
} from '@/lib/financialFitnessQuestions';

export default function FinancialFitnessPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<boolean>(false);
  const [showReview, setShowReview] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const totalQuestions = financialFitnessQuestions.length;
  const currentQuestion = financialFitnessQuestions[currentStep];
  const selectedOption = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  // Calculate score: Each "Yes" is worth 10 points.
  const yesCount = Object.values(answers).filter(
    (answer) => answer === 'Yes'
  ).length;

  const totalScore = yesCount * 10;

  const result: FinancialFitnessResult =
    calculateFinancialFitness(totalScore);

  // Handle option selection.
  const handleSelectOption = (option: string) => {
    if (!currentQuestion) return;

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.id]: option,
    }));
  };

  // Handle Next button.
  const handleNext = () => {
    if (!selectedOption) return;

    if (currentStep < totalQuestions - 1) {
      setCurrentStep((previousStep) => previousStep + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      setIsCompleted(true);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }
  };

  // Keyboard navigation support.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isCompleted || !currentQuestion) return;

      // Enter advances when an answer has been selected.
      if (event.key === 'Enter' && selectedOption) {
        event.preventDefault();
        handleNext();
      }

      // Keyboard shortcuts: 1 = Yes, 2 = No.
      if (event.key === '1') {
        event.preventDefault();
        handleSelectOption('Yes');
      } else if (event.key === '2') {
        event.preventDefault();
        handleSelectOption('No');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentStep, selectedOption, isCompleted, currentQuestion]);

  // Retake the assessment.
  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
    setSavedStatus(false);
    setShowReview(false);

    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Save the assessment to localStorage.
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
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId: Number(questionId),
          answer,
        })),
      };

      localStorage.setItem(
        'user_financial_fitness',
        JSON.stringify(payload)
      );

      setSavedStatus(true);

      window.setTimeout(() => {
        setSavedStatus(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save assessment:', error);
    }
  };

  // Share the assessment link.
  const handleShare = async () => {
    try {
      if (!navigator.clipboard) {
        console.warn('Clipboard access is unavailable in this browser.');
        return;
      }

      await navigator.clipboard.writeText(window.location.href);

      setCopiedLink(true);

      window.setTimeout(() => {
        setCopiedLink(false);
      }, 2500);
    } catch (error) {
      console.error('Failed to copy assessment link:', error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] px-4 py-10 sm:py-16">
      {!isCompleted ? (
        /* Questionnaire */
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200/90 bg-white px-6 py-10 shadow-sm transition-all duration-300 sm:px-12 sm:py-12">
          {currentQuestion ? (
            <>
              <h2 className="mb-3 text-center text-xl font-medium leading-relaxed text-slate-800 sm:text-2xl">
                {currentQuestion.question}
              </h2>

              {currentQuestion.subtitle ? (
                <p className="mx-auto mb-8 max-w-xl text-center text-xs leading-relaxed text-slate-500 sm:text-sm">
                  {currentQuestion.subtitle}
                </p>
              ) : (
                <div className="mb-6" />
              )}

              <div
                className="mb-8 space-y-3.5"
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
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-full border px-6 py-3.5 text-left text-sm transition-all duration-200 sm:text-base ${isSelected
                          ? 'border-[#1d70b8] bg-blue-50/40 font-medium text-slate-900 ring-1 ring-[#1d70b8]'
                          : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50/60'
                        }`}
                    >
                      <span className="leading-snug">{option}</span>

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${isSelected
                            ? 'border-[#1d70b8] bg-[#1d70b8] text-white'
                            : 'border-slate-300 bg-white'
                          }`}
                      >
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-center border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#f97316] px-12 py-3.5 font-semibold text-white shadow-sm transition-all hover:bg-[#ea580c] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>
                    {currentStep === totalQuestions - 1
                      ? 'VIEW RESULTS'
                      : 'NEXT'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-600">
                No financial fitness questions are currently available.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Results */
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Main Results Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white px-6 py-10 shadow-sm transition-all duration-300 sm:px-10">
            <div className="border-b border-slate-100 pb-6 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Your Financial Fitness is {result.category}
              </h1>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
                {result.subtitle}
              </p>

              {/* Financial Fitness Gauge */}
              {(() => {
                const scoreRatio = Math.max(
                  0,
                  Math.min(1, totalScore / 100)
                );

                const radius = 120;
                const cx = 170;
                const cy = 160;
                const circumference = Math.PI * radius;
                const strokeDashoffset =
                  circumference * (1 - scoreRatio);

                const knobX =
                  cx - radius * Math.cos(scoreRatio * Math.PI);

                const knobY =
                  cy - radius * Math.sin(scoreRatio * Math.PI);

                const getKnobColor = (ratio: number) => {
                  if (ratio <= 0.3) return '#ef4444';
                  if (ratio <= 0.55) return '#f59e0b';
                  if (ratio <= 0.75) return '#0284c7';
                  return '#10b981';
                };

                const knobColor = getKnobColor(scoreRatio);

                return (
                  <div className="mb-2 mt-8">
                    <div className="relative mx-auto w-full max-w-[320px] select-none sm:max-w-[360px]">
                      <svg
                        viewBox="0 0 340 185"
                        className="h-auto w-full overflow-visible"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient
                            id="fitnessGaugeGradient"
                            x1="0%"
                            y1="100%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="28%" stopColor="#f59e0b" />
                            <stop offset="52%" stopColor="#0284c7" />
                            <stop offset="78%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>

                          <filter
                            id="fitnessKnobGlow"
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                          >
                            <feDropShadow
                              dx="0"
                              dy="2"
                              stdDeviation="3"
                              floodColor="#000000"
                              floodOpacity="0.15"
                            />
                          </filter>
                        </defs>

                        <path
                          d="M 50 160 A 120 120 0 0 1 290 160"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="16"
                          strokeLinecap="round"
                        />

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

                        <path
                          d="M 74 160 A 96 96 0 0 1 266 160"
                          fill="none"
                          stroke="#cbd5e1"
                          strokeWidth="1.5"
                          strokeDasharray="5 5"
                        />

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

                      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center justify-center text-center sm:bottom-6">
                        <span className="text-xs font-medium text-slate-500 sm:text-sm">
                          Fitness Score
                        </span>

                        <span className="mt-0.5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                          {totalScore}
                        </span>

                        <span className="mt-0.5 text-[11px] font-semibold text-slate-400">
                          out of 100 ({yesCount}/{totalQuestions} positive
                          checks)
                        </span>
                      </div>
                    </div>

                    <div className="mx-auto mt-2 flex max-w-[320px] items-center justify-between px-4 text-xs font-semibold text-slate-400 sm:max-w-[360px]">
                      <span className="flex items-center gap-1 text-rose-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                        Vulnerable (0)
                      </span>

                      <span className="hidden items-center gap-1 text-sky-600 sm:flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
                        Moderate (50)
                      </span>

                      <span className="flex items-center gap-1 text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        Champion (100)
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Diagnostic Analysis */}
            <div className="border-b border-slate-100 py-6">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                Diagnostic Analysis
              </h2>

              <p className="text-sm leading-relaxed text-slate-700">
                {result.description}
              </p>
            </div>

            {/* Action Plan */}
            <div className="border-b border-slate-100 py-6">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                Action Plan to Strengthen Financial Resilience
              </h2>

              <ul className="space-y-2.5 text-sm text-slate-700">
                {result.recommendations.map((recommendation, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 leading-relaxed"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1d70b8]" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Financial Solutions */}
            <div className="border-b border-slate-100 py-6">
              <h2 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Activity className="h-4 w-4 text-[#1d70b8]" />
                <span>Recommended Financial Solutions</span>
              </h2>

              <div className="flex flex-wrap gap-2">
                {result.suggestedActions.map((action, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {action}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleSaveAssessment}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1d70b8] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#165a94] active:scale-95"
                >
                  {savedStatus ? (
                    <>
                      <Check className="h-4 w-4 stroke-[2.5]" />
                      <span>Report Saved ✓</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      <span>Save Diagnostic Report</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Retake Fitness Test</span>
                </button>
              </div>

              {/* Utility Actions */}
              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-[#1d70b8]"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>
                    {copiedLink
                      ? 'Link Copied to Clipboard!'
                      : 'Share Diagnostic'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReview((previous) => !previous)}
                  className="inline-flex cursor-pointer items-center gap-1 font-semibold text-[#1d70b8] hover:underline"
                >
                  <span>
                    {showReview ? 'Hide' : 'Review'} All Checkpoints
                  </span>

                  {showReview ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Review Answers */}
          {showReview && (
            <div className="space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all sm:p-8">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-800">
                Financial Fitness Checkpoint Breakdown
              </h2>

              <div className="divide-y divide-slate-100 space-y-3">
                {financialFitnessQuestions.map((question) => {
                  const answer = answers[question.id];
                  const isYes = answer === 'Yes';

                  return (
                    <div key={question.id} className="pt-3 first:pt-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-slate-700">
                            {question.id}. {question.question}
                          </p>

                          {question.subtitle && (
                            <p className="text-[11px] leading-snug text-slate-400">
                              {question.subtitle}
                            </p>
                          )}
                        </div>

                        <span
                          className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${isYes
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-rose-200 bg-rose-50 text-rose-700'
                            }`}
                        >
                          {isYes ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              <span>Yes (+10)</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-3 w-3 text-rose-600" />
                              <span>{answer ? 'No (0)' : 'Unanswered'}</span>
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

          {/* Advisor CTA */}
          <div className="rounded-3xl bg-gradient-to-br from-[#0f2b44] to-[#164366] p-6 text-white shadow-md sm:p-8">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#f97316]">
                  Personalized Advisory
                </span>

                <h3 className="text-lg font-bold sm:text-xl">
                  Ready to elevate your financial health?
                </h3>

                <p className="max-w-md text-xs text-slate-200 sm:text-sm">
                  Schedule a confidential one-on-one financial health
                  consultation with Finasset Wealth advisors in Bhubaneswar
                  to address insurance gaps, debt loads, and goal planning.
                </p>
              </div>

              <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f97316] px-6 py-3 text-center text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#ea580c] sm:text-sm"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Health Review</span>
                </Link>

                <Link
                  href="/investor/financial-calculator/sip-calculator"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-center text-xs font-medium text-white transition-colors hover:bg-white/20"
                >
                  <span>Open SIP Calculator</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regulatory Disclaimer */}
      <div className="mx-auto mt-8 max-w-3xl text-center">
        <p className="text-[11px] leading-relaxed text-slate-400">
          <Info className="mr-1 inline h-3 w-3 text-slate-400" />
          <strong>Regulatory Disclaimer:</strong> Financial Fitness assessment
          results are provided for educational and diagnostic awareness
          purposes only. They do not constitute guaranteed financial outcomes
          or certified advisory contracts. Mutual Fund investments are subject
          to market risks; please review scheme information documents carefully
          before investing.
        </p>
      </div>
    </div>
  );
}
