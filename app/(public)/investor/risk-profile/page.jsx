'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Target,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Shield,
  PieChart,
} from 'lucide-react';

export default function RiskProfilePage() {
  const [questionnaire, setQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/api/v1/public/questionnaires/risk-profile')
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
      alert(`Please answer all ${totalQuestions} questions to compute your accurate risk profile.`);
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
        <p className="text-sm font-semibold">Loading psychometric risk profiler...</p>
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
            <Target className="w-3.5 h-3.5 text-[#2376b8]" />
            <span>Psychometric Asset Profiler</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Know Your Investor Risk Profile
          </h1>
          <p className="text-slate-300 mt-4 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
            Discover whether your emotional tolerance and financial runway classify you as Conservative, Moderate, or Aggressive. Build a portfolio that lets you sleep peacefully at night.
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
                  Assessment Complete
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2b44]">
                  {result.band?.title || 'Moderate Growth Investor'}
                </h2>
                <div className="inline-block bg-[#0f2b44] text-white px-4 py-1.5 rounded-full text-xs font-bold">
                  Score: {result.score} / {result.maxPossibleScore} Points • Category: {result.band?.category}
                </div>
              </div>

              {/* Description & Recommendation */}
              <div className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-200/80 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0f2b44]">
                  Profile Analysis
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {result.band?.description}
                </p>
                <div className="pt-3 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2376b8] mb-1">
                    Finasset Strategic Recommendation:
                  </h4>
                  <p className="text-sm font-semibold text-[#0f2b44] leading-relaxed">
                    {result.band?.recommendation}
                  </p>
                </div>
              </div>

              {/* Suggested Asset Allocation */}
              {result.band?.assetAllocation && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#0f2b44]">
                    Recommended Target Asset Mix
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center">
                      <div className="text-3xl font-extrabold text-[#2376b8]">
                        {result.band.assetAllocation.equity}%
                      </div>
                      <div className="text-xs font-bold text-slate-600 mt-1 uppercase">Equity Funds & Stocks</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Capital Growth</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center">
                      <div className="text-3xl font-extrabold text-[#89b441]">
                        {result.band.assetAllocation.debt}%
                      </div>
                      <div className="text-xs font-bold text-slate-600 mt-1 uppercase">Debt, Bonds & FDs</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Stability & Income</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center">
                      <div className="text-3xl font-extrabold text-[#f87b1f]">
                        {result.band.assetAllocation.goldRealEstate}%
                      </div>
                      <div className="text-xs font-bold text-slate-600 mt-1 uppercase">Gold & Real Estate</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Inflation Shield</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0f2b44] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Questionnaire</span>
                </button>

                <Link
                  href="/contact-us#callback"
                  className="bg-[#f87b1f] hover:bg-[#d9620b] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-[#f87b1f]/20 transition-all flex items-center gap-2"
                >
                  <span>Build This Custom Portfolio with Us</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Questions View */
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-10">
              <div className="border-b border-slate-100 pb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2376b8]">
                  Step-by-Step Diagnostic
                </span>
                <h2 className="text-2xl font-bold text-[#0f2b44] mt-1">
                  Answer the Following 5 Questions
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select the option that best reflects your true instincts and current financial reality.
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
                  <span>Compute My Risk Profile</span>
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
