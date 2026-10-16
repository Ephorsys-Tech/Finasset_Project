'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Shield,
  Activity,
} from 'lucide-react';

export default function FinancialFitnessPage() {
  const [questionnaire, setQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/api/v1/public/questionnaires/financial-fitness')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setQuestionnaire(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelectOption = (questionId, score) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: score,
    }));
  };

  const handleCalculateScore = () => {
    const questions = questionnaire?.questions || [];
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < totalQuestions) {
      alert(`Please answer all ${totalQuestions} questions to compute your Financial Fitness score.`);
      return;
    }

    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

    const bands = questionnaire?.resultBands || [];
    const matchedBand = bands.find(
      (b) => totalScore >= b.minScore && totalScore <= b.maxScore
    ) || bands[bands.length - 1];

    setResult({
      score: totalScore,
      maxPossibleScore: totalQuestions * 4,
      percentage: Math.round((totalScore / (totalQuestions * 4)) * 100),
      band: matchedBand,
    });

    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-[#2376b8] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm font-semibold">Loading financial fitness diagnostic...</p>
      </div>
    );
  }

  const questions = questionnaire?.questions || [];

  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Banner */}
      <section className="bg-[#0f2b44] text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2376b8]/20 border border-[#2376b8]/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-4">
            <Activity className="w-3.5 h-3.5 text-[#2376b8]" />
            <span>360° Financial Vitality Checkup</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Check Your Financial Fitness
          </h1>
          <p className="text-slate-300 mt-4 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
            Evaluate your financial resilience across emergency buffers, savings rates, debt loads, and family protection. Discover your fitness index in under 3 minutes.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {result ? (
            /* Result View */
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl space-y-8 animate-in fade-in duration-300">
              <div className="text-center space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#f87b1f]">
                  Diagnostic Report
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2b44]">
                  {result.band?.title}
                </h2>
                <div className="inline-flex items-center gap-2 bg-[#0f2b44] text-white px-5 py-2 rounded-full text-sm font-bold">
                  <span>Fitness Score: {result.score} / {result.maxPossibleScore}</span>
                  <span>({result.percentage}%)</span>
                </div>
              </div>

              {/* Score Meter Bar */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    style={{ width: `${result.percentage}%` }}
                    className="h-full bg-gradient-to-r from-[#2376b8] via-[#89b441] to-[#f87b1f] rounded-full transition-all duration-700"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold uppercase">
                  <span>Needs Attention (&lt;45%)</span>
                  <span>Fair (45-60%)</span>
                  <span>Healthy (60-80%)</span>
                  <span>Champion (&gt;80%)</span>
                </div>
              </div>

              {/* Analysis & Prescriptive Next Steps */}
              <div className="bg-[#f8fafc] rounded-2xl p-6 sm:p-8 border border-slate-200/80 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0f2b44]">
                  Diagnostic Summary
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {result.band?.description}
                </p>
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2376b8] mb-1">
                    Action Plan to Elevate Your Score:
                  </h4>
                  <p className="text-sm font-semibold text-[#0f2b44] leading-relaxed">
                    {result.band?.recommendation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0f2b44] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Fitness Test</span>
                </button>

                <Link
                  href="/contact-us#callback"
                  className="bg-[#f87b1f] hover:bg-[#d9620b] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-[#f87b1f]/20 transition-all flex items-center gap-2"
                >
                  <span>Book Free 1-on-1 Financial Health Review</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
              </div>
            </div>
          ) : (
            /* Questions View */
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-10">
              <div className="border-b border-slate-100 pb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8]">
                  5-Point Financial Health Audit
                </span>
                <h2 className="text-2xl font-bold text-[#0f2b44] mt-1">
                  Answer the Health Checkup Questions
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Be candid and transparent with your numbers for an authentic assessment.
                </p>
              </div>

              <div className="space-y-8">
                {questions.map((q, idx) => (
                  <div key={q.id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#0f2b44] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          {q.category}
                        </span>
                        <h3 className="text-base font-bold text-[#0f2b44] mt-0.5">
                          {q.title}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-10">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = answers[q.id] === opt.score;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(q.id, opt.score)}
                            className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-[#0f2b44] text-white border-[#0f2b44] shadow-md font-semibold'
                                : 'bg-[#f8fafc] text-slate-700 border-slate-200/80 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                  isSelected ? 'border-[#f87b1f] bg-[#f87b1f]' : 'border-slate-400'
                                }`}
                              >
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0f2b44]" />}
                              </span>
                              <span>{opt.text}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  {Object.keys(answers).length} of {questions.length} questions answered
                </div>

                <button
                  type="button"
                  onClick={handleCalculateScore}
                  className="w-full sm:w-auto bg-[#f87b1f] hover:bg-[#d9620b] text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg shadow-[#f87b1f]/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Evaluate My Financial Fitness</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
