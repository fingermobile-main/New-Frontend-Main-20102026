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

        {/* 3D Brand Emoji Card */}
        <div className="relative bg-white/95 backdrop-blur-md border-2 border-emerald-400 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-3 min-w-[280px] max-w-[360px] text-center transform scale-105 transition-all">
          {/* Official 5D Mint Green Glass Emoji Badge */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#defaf2] via-[#bbf2e3] to-[#e6fff8] p-1 shadow-lg shadow-emerald-500/20 border-2 border-emerald-300 flex items-center justify-center transform hover:scale-105 transition-transform overflow-hidden">
            <img
              src={
                reaction.iconType === 'trophy'
                  ? '/assets/emojis/crown_royalty.png'
                  : reaction.iconType === 'crush'
                  ? '/assets/emojis/kissing_heart.png'
                  : reaction.iconType === 'battle'
                  ? '/assets/emojis/cool_sunglasses.png'
                  : reaction.iconType === 'combo'
                  ? '/assets/emojis/star_eyes.png'
                  : reaction.iconType === 'stun'
                  ? '/assets/emojis/surprise_dismay.png'
                  : '/assets/emojis/headphones_music.png'
              }
              alt="FingerMobile Brand 5D Emoji"
              className="w-full h-full object-cover rounded-2xl"
            />
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
