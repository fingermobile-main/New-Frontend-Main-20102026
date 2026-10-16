/* eslint-disable no-unused-vars */
import React from 'react';
import { X, Sparkles, MessageCircle, Key, Heart, Zap, CheckCircle2 } from 'lucide-react';
import { MatchCelebrationData, DiscoveryDomain } from './types';

interface SharedInterestMatchCelebrationModalProps {
  data: MatchCelebrationData | null;
  domain: DiscoveryDomain;
  onClose: () => void;
  onSendMessage?: (_memberId: string) => void;
  onExchangePin?: (_memberId: string) => void;
}

export const SharedInterestMatchCelebrationModal: React.FC<SharedInterestMatchCelebrationModalProps> = ({
  data,
  domain,
  onClose,
  onSendMessage,
  onExchangePin
}) => {
  if (!data) return null;

  const { member, matchType, sharedHighlights } = data;
  const isBeatwave = domain === 'beatwaveng';
  const isSuperLike = matchType === 'super_like_colabo';

  const accentColor = isBeatwave ? 'amber' : 'rose';
  const gradientBg = isBeatwave
    ? 'from-amber-600 via-yellow-500 to-orange-600'
    : 'from-rose-600 via-red-500 to-orange-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 text-center"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          aria-label="Close match dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ambient Glow */}
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-tr ${gradientBg} opacity-20 blur-3xl pointer-events-none`} />

        {/* Celebration Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 mb-4">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>
            {isSuperLike
              ? '✨ VIP Sovereign Super-Like Match!'
              : '🌟 Resonant Shared Interest Match!'}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          It's a Sovereign Match!
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
          You and <span className="font-bold text-white">{member.name}</span> resonate at{' '}
          <span className="font-extrabold text-emerald-400 font-mono text-sm">
            {member.compatibilityScore}% Compatibility
          </span>{' '}
          on {isBeatwave ? 'BeatwaveNG soundwaves' : 'Dancia-4Tv cinema frequencies'}.
        </p>

        {/* Avatars Connection Stage */}
        <div className="relative flex items-center justify-center gap-6 my-6">
          {/* Current User Avatar Placeholder / Seal */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-slate-700 bg-slate-800 p-0.5 shadow-xl flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
                alt="You"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-white shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="block text-[11px] font-bold text-slate-300 mt-2">You</span>
          </div>

          {/* Central Pulsating Energy Beam */}
          <div className="flex flex-col items-center justify-center">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${gradientBg} text-white flex items-center justify-center shadow-lg shadow-${accentColor}-500/40 animate-pulse`}>
              {isSuperLike ? <Zap className="w-6 h-6 fill-current" /> : <Heart className="w-6 h-6 fill-current" />}
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent my-1" />
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
              Mutual
            </span>
          </div>

          {/* Matched Member Avatar */}
          <div className="relative">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-${accentColor}-500 bg-slate-800 p-0.5 shadow-xl flex items-center justify-center overflow-hidden`}>
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-blue-500 text-white shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="block text-[11px] font-bold text-white mt-2">{member.name.split(' ')[0]}</span>
          </div>
        </div>

        {/* Mutual Resonances Highlights */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6 text-left">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <span>🎯 Shared Resonances in Common:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sharedHighlights.map((hl, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-amber-300"
              >
                <span>✨</span>
                <span>{hl}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              if (onExchangePin) onExchangePin(member.id);
              onClose();
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r ${gradientBg} text-white hover:brightness-110 shadow-lg shadow-${accentColor}-500/25 transition flex items-center justify-center gap-2`}
          >
            <Key className="w-4 h-4" />
            <span>
              {isBeatwave
                ? 'Exchange Colabo+ & VirDrive PIN'
                : 'Send Watch-Party Sovereign PIN'}
            </span>
          </button>
          <button
            onClick={() => {
              if (onSendMessage) onSendMessage(member.id);
              onClose();
            }}
            className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Direct Message</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          Keep exploring deck →
        </button>
      </div>
    </div>
  );
};
