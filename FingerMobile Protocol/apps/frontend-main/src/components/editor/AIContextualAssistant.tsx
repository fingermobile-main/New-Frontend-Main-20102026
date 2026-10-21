/*
 * FingerMobile Protocol™ - AI Contextual Assistant Bar & Insights Modal
 * Displays real-time content analysis, virality potential, sentiment,
 * recommended tags, and optimal publishing window.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Clock,
  Tag,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Zap,
  BarChart2
} from 'lucide-react';
import { ContentAnalysisResult } from './AIContextualAlgorithm';

interface AIContextualAssistantProps {
  analysis: ContentAnalysisResult;
  onApplyTags?: (tags: string[]) => void;
  onApplyCategory?: (category: string) => void;
  onApplySchedule?: (window: ContentAnalysisResult['optimalPostingWindow']) => void;
  onEnhanceContent?: () => void;
}

export const AIContextualAssistant: React.FC<AIContextualAssistantProps> = ({
  analysis,
  onApplyTags,
  onApplyCategory,
  onApplySchedule,
  onEnhanceContent
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300';
    if (score >= 70) return 'text-orange-500 bg-orange-50 dark:bg-orange-950/40 border-orange-300';
    return 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300';
  };

  return (
    <div className="border border-orange-200 dark:border-orange-900/40 bg-gradient-to-r from-orange-50/70 via-amber-50/50 to-purple-50/60 dark:from-slate-900 dark:to-slate-950 rounded-2xl p-4 shadow-sm text-xs space-y-3">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500 text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                AI Contextual Distribution Engine
              </span>
              <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] ${getScoreColor(analysis.overallScore)}`}>
                Score: {analysis.overallScore}/100 • {analysis.viralityPotential}
              </span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              Evaluates multi-tier audience resonance, hook strength & timing beyond raw shared graph.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 transition flex items-center gap-1 font-semibold"
        >
          <span>{isExpanded ? 'Hide Insights' : 'View Insights'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Action Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {onEnhanceContent && (
          <button
            type="button"
            onClick={onEnhanceContent}
            className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>AI Polish Hook</span>
          </button>
        )}

        {onApplyTags && analysis.recommendedTags.length > 0 && (
          <button
            type="button"
            onClick={() => onApplyTags(analysis.recommendedTags)}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-400 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1 transition"
          >
            <Tag className="w-3 h-3 text-orange-500" />
            <span>Apply Tags ({analysis.recommendedTags.slice(0, 3).join(' ')})</span>
          </button>
        )}

        {onApplySchedule && (
          <button
            type="button"
            onClick={() => onApplySchedule(analysis.optimalPostingWindow)}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-400 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1 transition"
          >
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Optimal Window ({analysis.optimalPostingWindow.time})</span>
          </button>
        )}

        {onApplyCategory && analysis.recommendedCategory && (
          <button
            type="button"
            onClick={() => onApplyCategory(analysis.recommendedCategory)}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-400 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1 transition"
          >
            <BarChart2 className="w-3 h-3 text-indigo-500" />
            <span>Category: {analysis.recommendedCategory}</span>
          </button>
        )}
      </div>

      {/* Expanded Breakdown */}
      {isExpanded && (
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
          {/* Factor Meters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300 block font-medium">Hook Strength</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                {analysis.factors.hookStrength}%
              </span>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300 block font-medium">Multimedia Richness</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                {analysis.factors.multimediaRichness}%
              </span>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300 block font-medium">Readability Index</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                {analysis.readabilityScore}/100 ({analysis.estimatedReadingTimeMinutes}m read)
              </span>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300 block font-medium">Safety & Compliance</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Passed
              </span>
            </div>
          </div>

          {/* Actionable suggestions */}
          <div className="bg-white/90 dark:bg-slate-900/90 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              Contextual Growth Suggestions:
            </span>
            {analysis.actionableSuggestions.map((sug, i) => (
              <div key={i} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>{sug}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContextualAssistant;
