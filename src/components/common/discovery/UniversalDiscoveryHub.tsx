/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Users,
  Compass,
  Award,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  Music,
  Film
} from 'lucide-react';
import { DiscoveryDomain, SharedInterestMember } from './types';
import {
  BEATWAVE_DISCOVERY_MEMBERS,
  DANCIA_DISCOVERY_MEMBERS,
  BEATWAVE_LAPIDAIRE_QUESTIONS,
  DANCIA_LAPIDAIRE_QUESTIONS
} from './mockDiscoveryData';
import { UniversalLapidaireSwipeDeck } from './UniversalLapidaireSwipeDeck';
import { UniversalDiscoverGrid } from './UniversalDiscoverGrid';
import { UniversalLapidaireModal } from './UniversalLapidaireModal';

interface UniversalDiscoveryHubProps {
  domain: DiscoveryDomain;
  initialSubTab?: 'lapidaire' | 'discover';
  onSendMessage?: (memberId: string) => void;
  onExchangePin?: (memberId: string) => void;
}

export const UniversalDiscoveryHub: React.FC<UniversalDiscoveryHubProps> = ({
  domain,
  initialSubTab = 'lapidaire',
  onSendMessage,
  onExchangePin
}) => {
  const isBeatwave = domain === 'beatwaveng';
  const members: SharedInterestMember[] = isBeatwave
    ? BEATWAVE_DISCOVERY_MEMBERS
    : DANCIA_DISCOVERY_MEMBERS;

  const dailyQuestions = isBeatwave
    ? BEATWAVE_LAPIDAIRE_QUESTIONS
    : DANCIA_LAPIDAIRE_QUESTIONS;

  const [activeSubTab, setActiveSubTab] = useState<'lapidaire' | 'discover'>(initialSubTab);
  const [showLapidaireModal, setShowLapidaireModal] = useState(false);
  const [dailyAnswered, setDailyAnswered] = useState(false);
  const [selectedDailyOption, setSelectedDailyOption] = useState<string | null>(null);

  const accentColor = isBeatwave ? 'amber' : 'rose';
  const gradientBg = isBeatwave
    ? 'from-amber-500 to-orange-600'
    : 'from-rose-500 to-red-600';

  const handleDailySelect = (opt: string) => {
    setSelectedDailyOption(opt);
    setDailyAnswered(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Protocol Header Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Glow */}
        <div
          className={`absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-gradient-to-tr ${gradientBg} opacity-15 blur-3xl pointer-events-none`}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400">
              {isBeatwave ? <Music className="w-3.5 h-3.5" /> : <Film className="w-3.5 h-3.5" />}
              <span>
                {isBeatwave
                  ? 'Sovereign Audio Resonance Protocol'
                  : 'Sovereign Cinema Resonance Protocol'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isBeatwave
                ? 'Discover Like-Minded Music & Sound Members'
                : 'Discover Like-Minded Cinema & Film Members'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isBeatwave
                ? 'Connect with members who cherish the same Album, AI Playlist, Tracks, Artist, Album Cover Aesthetics, AI Music Prompts, or Music Concert. Calibrate your Lapidaire profile to unlock deep sovereign acoustics.'
                : 'Connect with members who cherish the same Movie, Director, Cinema Genre, Live Broadcasts, Film Premieres, Watchlists, or Video Stems. Calibrate your Lapidaire profile to unlock synchronized watch-parties.'}
            </p>
          </div>

          {/* Sub-Tab Navigation Switcher */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <div className="p-1 rounded-2xl bg-slate-950 border border-slate-800 flex items-center">
              <button
                onClick={() => setActiveSubTab('lapidaire')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeSubTab === 'lapidaire'
                    ? `bg-gradient-to-r ${gradientBg} text-white shadow-lg`
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Lapidaire Swipe Deck</span>
              </button>
              <button
                onClick={() => setActiveSubTab('discover')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeSubTab === 'discover'
                    ? `bg-gradient-to-r ${gradientBg} text-white shadow-lg`
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Discover All Grid ({members.length})</span>
              </button>
            </div>

            <button
              onClick={() => setShowLapidaireModal(true)}
              className="hidden sm:flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Lapidaire Questions</span>
            </button>
          </div>
        </div>

        {/* Daily Lapidaire Spotlight Prompt */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Daily Lapidaire Spotlight
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  +50 FIC Points
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white">
                "{dailyQuestions[0].question}"
              </p>
            </div>
          </div>

          {!dailyAnswered ? (
            <div className="flex flex-wrap gap-2 shrink-0">
              {dailyQuestions[0].options.slice(0, 2).map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDailySelect(opt)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition line-clamp-1 max-w-[200px]"
                  title={opt}
                >
                  {opt}
                </button>
              ))}
              <button
                onClick={() => setShowLapidaireModal(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>More options</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-bold shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Resonance Calibrated (+50 FIC Recorded)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main View: Lapidaire Deck or Discover Grid */}
      <div className="pt-2">
        {activeSubTab === 'lapidaire' ? (
          <div className="py-2">
            <UniversalLapidaireSwipeDeck
              domain={domain}
              members={members}
              onOpenLapidaireModal={() => setShowLapidaireModal(true)}
              onSendMessage={onSendMessage}
              onExchangePin={onExchangePin}
            />
          </div>
        ) : (
          <UniversalDiscoverGrid
            domain={domain}
            members={members}
            onOpenLapidaireModal={() => setShowLapidaireModal(true)}
            onSendMessage={onSendMessage}
            onExchangePin={onExchangePin}
          />
        )}
      </div>

      {/* 10-Question Comprehensive Lapidaire Modal */}
      <UniversalLapidaireModal
        isOpen={showLapidaireModal}
        domain={domain}
        onClose={() => setShowLapidaireModal(false)}
        onCompleted={(answers) => {
          setDailyAnswered(true);
        }}
      />
    </div>
  );
};
