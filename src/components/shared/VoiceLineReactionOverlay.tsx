import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, Flame, ShieldAlert, Award, Star, Zap } from 'lucide-react';

interface VoiceLineEventDetail {
  id: string;
  category: string;
  transcript: string;
  duration?: number;
}

interface ReactionState {
  id: string;
  transcript: string;
  category: string;
  iconType: 'trophy' | 'crush' | 'battle' | 'combo' | 'stun' | 'sparkle';
  visible: boolean;
}

export const VoiceLineReactionOverlay: React.FC = () => {
  const [reaction, setReaction] = useState<ReactionState | null>(null);

  useEffect(() => {
    const handleVoiceLine = (e: Event) => {
      const customEvent = e as CustomEvent<VoiceLineEventDetail>;
      const { id, transcript, category } = customEvent.detail || {};

      let iconType: ReactionState['iconType'] = 'sparkle';
      const lower = (id + ' ' + (transcript || '')).toLowerCase();

      if (lower.includes('great') || lower.includes('awesome') || lower.includes('blessings')) {
        iconType = 'trophy';
      } else if (lower.includes('sugar') || lower.includes('wooow') || lower.includes('yeeeaah')) {
        iconType = 'crush';
      } else if (lower.includes('bootilicious') || lower.includes('gang') || lower.includes('war')) {
        iconType = 'battle';
      } else if (lower.includes('combo') || lower.includes('gbaski') || lower.includes('sharp')) {
        iconType = 'combo';
      } else if (lower.includes('goodness') || lower.includes('endowed') || lower.includes('gorgeous') || lower.includes('divine')) {
        iconType = 'stun';
      }

      setReaction({
        id: id || 'reaction',
        transcript: transcript || 'Level Complete!',
        category: category || 'combo',
        iconType,
        visible: true,
      });

      // Exactly 2 seconds visual display
      const timer = setTimeout(() => {
        setReaction(prev => (prev?.id === id ? { ...prev, visible: false } : prev));
      }, 2000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('fingermobile:voiceline', handleVoiceLine as EventListener);
    return () => {
      window.removeEventListener('fingermobile:voiceline', handleVoiceLine as EventListener);
    };
  }, []);

  if (!reaction || !reaction.visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center animate-fade-in select-none"
      aria-live="polite"
    >
      <div className="relative transform animate-bounce-subtle flex flex-col items-center">
        {/* Glowing backdrop circle */}
        <div className="absolute -inset-10 bg-gradient-to-r from-amber-400/30 via-emerald-400/30 to-indigo-500/30 rounded-full blur-2xl animate-pulse" />

        {/* 3D Emoticon Card */}
        <div className="relative bg-white/95 backdrop-blur-md border-2 border-amber-400 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-3 min-w-[260px] max-w-[340px] text-center transform scale-105 transition-all">
          {/* Animated 3D Graphic Badge */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-lg flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              {reaction.iconType === 'trophy' && (
                <Trophy className="w-10 h-10 text-amber-400 animate-pulse" />
              )}
              {reaction.iconType === 'crush' && (
                <Star className="w-10 h-10 text-pink-400 animate-spin-slow" />
              )}
              {reaction.iconType === 'battle' && (
                <ShieldAlert className="w-10 h-10 text-rose-400 animate-pulse" />
              )}
              {reaction.iconType === 'combo' && (
                <Zap className="w-10 h-10 text-cyan-400 animate-bounce" />
              )}
              {reaction.iconType === 'stun' && (
                <Flame className="w-10 h-10 text-orange-400 animate-pulse" />
              )}
              {reaction.iconType === 'sparkle' && (
                <Sparkles className="w-10 h-10 text-emerald-400 animate-pulse" />
              )}
            </div>
          </div>

          {/* Voice transcript badge */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs uppercase tracking-wider font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {reaction.category.toUpperCase()} REACTION
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight drop-shadow-sm">
              "{reaction.transcript}"
            </h3>
            <p className="text-xs font-semibold text-slate-700">
              ⚡ FingerMobile AI Audio Engine (0.85x)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
