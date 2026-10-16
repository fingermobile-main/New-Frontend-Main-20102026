/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ChevronRight, Award, Music, Film, Check } from 'lucide-react';
import { DiscoveryDomain, LapidaireQuestionItem } from './types';
import { BEATWAVE_LAPIDAIRE_QUESTIONS, DANCIA_LAPIDAIRE_QUESTIONS } from './mockDiscoveryData';

interface UniversalLapidaireModalProps {
  isOpen: boolean;
  domain: DiscoveryDomain;
  onClose: () => void;
  onCompleted?: (_answers: Record<number, string>) => void;
}

export const UniversalLapidaireModal: React.FC<UniversalLapidaireModalProps> = ({
  isOpen,
  domain,
  onClose,
  onCompleted
}) => {
  const isBeatwave = domain === 'beatwaveng';
  const questions: LapidaireQuestionItem[] = isBeatwave
    ? BEATWAVE_LAPIDAIRE_QUESTIONS
    : DANCIA_LAPIDAIRE_QUESTIONS;

  const storageKey = `fmp_lapidaire_${domain}_answers_v1`;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Load existing answers from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedAnswers(parsed);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = (opt: string) => {
    const updated = { ...selectedAnswers, [currentQ.id]: opt };
    setSelectedAnswers(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 220);
    } else {
      setIsCompleted(true);
      if (onCompleted) onCompleted(updated);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  const accentColor = isBeatwave ? 'amber' : 'rose';
  const gradientColor = isBeatwave
    ? 'from-amber-500 to-orange-600'
    : 'from-rose-500 to-red-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 text-left"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl bg-gradient-to-tr ${gradientColor} text-white shadow-md`}>
              {isBeatwave ? <Music className="w-5 h-5" /> : <Film className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{isBeatwave ? 'BeatwaveNG Lapidaire Calibration' : 'Dancia-4Tv Lapidaire Calibration'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                  AI Resonance
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Answer {questions.length} core lifestyle &amp; taste questions to sharpen P2P member matching.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isCompleted ? (
          <div className="py-5 space-y-6">
            {/* Progress Bar & Stage Indicator */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-slate-400">
                  Question <span className="text-white font-bold">{currentIndex + 1}</span> of {questions.length}
                </span>
                <span className={`text-${accentColor}-400 font-mono text-[11px] font-bold`}>
                  {progressPercent}% Calibrated
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${gradientColor} transition-all duration-300`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Category: {currentQ.category}
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentQ.resonanceImpact}</span>
                </span>
              </div>
              <p className="text-base sm:text-lg font-extrabold text-white leading-snug">
                "{currentQ.question}"
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full p-3.5 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between border ${
                      isSelected
                        ? `bg-slate-800/90 border-${accentColor}-500 text-white shadow-md ring-1 ring-${accentColor}-500`
                        : 'bg-slate-950 hover:bg-slate-800/60 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="flex-1 pr-3">{opt}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition ${
                        isSelected
                          ? `bg-${accentColor}-500 border-${accentColor}-500 text-slate-950`
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="text-[10px] text-slate-500">{idx + 1}</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation back / forward */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
              >
                ← Previous Question
              </button>
              {selectedAnswers[currentQ.id] && currentIndex < questions.length - 1 && (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className={`text-xs font-bold text-${accentColor}-400 hover:underline flex items-center gap-1`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Completion State */
          <div className="py-8 text-center space-y-5">
            <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-tr ${gradientColor} text-white flex items-center justify-center shadow-xl shadow-${accentColor}-500/30`}>
              <Award className="w-8 h-8" />
            </div>

            <h4 className="text-2xl font-black text-white">
              Lapidaire Profile Calibrated!
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Your {isBeatwave ? 'acoustic' : 'cinematic'} preferences have trained the sovereign P2P matching model. You will now see tailored resonance scores on the Discover and Lapidaire tabs.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>+100 Sovereign FIC Activity Points Granted</span>
            </div>

            <div className="flex justify-center gap-3 pt-3">
              <button
                onClick={handleReset}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Recalibrate Answers
              </button>
              <button
                onClick={onClose}
                className={`py-2.5 px-6 rounded-xl text-xs font-bold bg-gradient-to-r ${gradientColor} text-white hover:brightness-110 shadow-lg transition`}
              >
                Explore Discover Deck →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
