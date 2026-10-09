/**
 * LapidaireQuestionModal
 * Interactive 30 Lapidaire questions modal for Lush Pressies.
 * Allows members to answer key lifestyle, intimacy, and core value questions to train the AI matching score engine.
 */

import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { Sparkles, CheckCircle2, ChevronRight, X } from 'lucide-react';

export interface LapidaireQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export type IcebreakerQuestionModalProps = LapidaireQuestionModalProps;

interface Question {
  id: number;
  question_text: string;
  category: string;
  options?: string[];
}

const DEFAULT_LAPIDAIRE_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Relationship Intent',
    question_text: 'What is your primary relationship goal on Lush Pressies?',
    options: [
      'Long-term Commitment',
      'Serious Dating',
      'Empathetic Connection',
      'Hopeful Romance',
    ],
  },
  {
    id: 2,
    category: 'Love Language',
    question_text: 'How do you best express affection to a partner?',
    options: [
      'Thoughtful Gifts',
      'Quality Time',
      'Words of Affirmation',
      'Acts of Service',
    ],
  },
  {
    id: 3,
    category: 'Financial Alignment',
    question_text:
      'How do you view shared sovereign wealth and gift exchanges?',
    options: [
      'Generous & Mutual',
      'Balanced & Equal',
      'Goal-Oriented',
      'Private & Discreet',
    ],
  },
  {
    id: 4,
    category: 'Lifestyle & Travel',
    question_text: 'What is your ideal weekend getaway with a match?',
    options: [
      'Luxury Beach Resort',
      'Cultural City Tour',
      'Quiet Mountain Retreat',
      'Web3 & Tech Summit',
    ],
  },
  {
    id: 5,
    category: 'Communication Style',
    question_text: 'How often do you prefer to stay in contact with a match?',
    options: [
      'Daily Messages & Calls',
      'Regular Check-ins',
      'Deep Occasional Convos',
      'Flow with the Moment',
    ],
  },
];

export const LapidaireQuestionModal: React.FC<LapidaireQuestionModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [questions, setQuestions] = useState<Question[]>(
    DEFAULT_LAPIDAIRE_QUESTIONS
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Try fetching questions from backend (supporting both /lapidaires and legacy /lapidaires)
    apiService
      .get('/lushpressies/lapidaires')
      .catch(() => apiService.get('/lushpressies/lapidaires'))
      .then((res) => {
        if (res.data?.data && res.data.data.length > 0) {
          setQuestions(res.data.data);
        }
      })
      .catch(() => {
        // Fallback to default questions
      });
  }, []);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex] || DEFAULT_LAPIDAIRE_QUESTIONS[0];

  const handleNext = async () => {
    if (!selectedOption) return;

    const updatedAnswers = { ...answers, [currentQ.id]: selectedOption };
    setAnswers(updatedAnswers);

    // Post to backend
    try {
      await apiService.post(`/lushpressies/lapidaires/${currentQ.id}/answer`, {
        response_text: selectedOption,
      });
    } catch {
      // Ignore if offline
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(updatedAnswers[questions[currentIndex + 1]?.id] || '');
    } else {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        if (onComplete) onComplete();
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-2xl max-w-lg w-full p-6 space-y-6 relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">
                30 Lapidaire Questions
              </h3>
              <p className="text-[10px] text-emerald-700 font-semibold">
                Gem-Cut AI Values & Matching Score
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-[11px] text-gray-500 mb-1.5 font-medium">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>
              {Math.round(((currentIndex + 1) / questions.length) * 100)}%
              Completed
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300 rounded-full"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="space-y-4">
          <div className="inline-block px-2.5 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
            {currentQ.category}
          </div>

          <h4 className="text-base font-black text-gray-900 leading-snug">
            {currentQ.question_text}
          </h4>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options?.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-gray-200 hover:border-emerald-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-between items-center">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setSelectedOption(
                  answers[questions[currentIndex - 1]?.id] || ''
                );
              }
            }}
            disabled={currentIndex === 0}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedOption || submitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-40 flex items-center gap-1.5"
          >
            {submitting
              ? 'Saving...'
              : currentIndex === questions.length - 1
                ? 'Finish & Save'
                : 'Next Question'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const IcebreakerQuestionModal = LapidaireQuestionModal;
export default LapidaireQuestionModal;
