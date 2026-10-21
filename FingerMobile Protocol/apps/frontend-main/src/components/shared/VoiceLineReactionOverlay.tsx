import React, { useEffect, useState, useRef } from 'react';
import emojiPackService from '../../services/emojiPackService';

interface VoiceLineEventDetail {
  id?: string;
  voiceLineId?: string;
  category?: string;
  text?: string;
  transcript?: string;
  message?: string;
  type?: 'success' | 'error' | 'info' | 'warning' | 'voiceline';
  duration?: number;
}

interface ReactionState {
  id: string;
  text: string;
  category: string;
  imageUrl: string;
  altText: string;
  visible: boolean;
  isFadingOut?: boolean;
}

export const VoiceLineReactionOverlay: React.FC = () => {
  const [reaction, setReaction] = useState<ReactionState | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<VoiceLineEventDetail>;
      const detail = customEvent.detail || {};

      const displayText =
        detail.text || detail.transcript || detail.message || 'FingerMobile Reaction';
      const rawCategory = detail.category || detail.type || 'forum';
      const eventId =
        detail.id || detail.voiceLineId || `reaction-${Date.now()}`;

      // Retrieve official FingerMobile 5D Mint-Green Emoji
      const emojiItem =
        emojiPackService.getVoiceLineEmoji(rawCategory) ||
        emojiPackService.getToastEmoji(detail.type || 'info');

      // Clear any pending timers
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

      setReaction({
        id: eventId,
        text: displayText,
        category: rawCategory,
        imageUrl: emojiItem.imageUrl,
        altText: emojiItem.altText,
        visible: true,
        isFadingOut: false,
      });

      // Begin fadeout at 1000ms
      fadeTimerRef.current = setTimeout(() => {
        setReaction((prev) => (prev ? { ...prev, isFadingOut: true } : null));
      }, 1000);

      // EXACTLY 1.2 SECONDS MAX (1200ms) - Unconditionally dismiss
      timerRef.current = setTimeout(() => {
        setReaction(null);
      }, 1200);
    };

    window.addEventListener('fingermobile:voiceline', handleTrigger as EventListener);
    window.addEventListener('fingermobile:toast', handleTrigger as EventListener);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      window.removeEventListener('fingermobile:voiceline', handleTrigger as EventListener);
      window.removeEventListener('fingermobile:toast', handleTrigger as EventListener);
    };
  }, []);

  if (!reaction || !reaction.visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center select-none transition-opacity duration-200 ${
        reaction.isFadingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
      aria-live="polite"
    >
      <div
        onClick={() => setReaction(null)}
        className="relative transform flex flex-col items-center pointer-events-auto cursor-pointer animate-in fade-in zoom-in-95 duration-150"
        title="Click to dismiss"
      >
        {/* Glowing backdrop halo */}
        <div className="absolute -inset-10 bg-gradient-to-r from-emerald-400/25 via-[#defaf2]/40 to-teal-400/25 rounded-full blur-2xl animate-pulse" />

        {/* 3D Brand Emoji Card */}
        <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-emerald-400 rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-2.5 min-w-[280px] max-w-[360px] text-center transform hover:scale-[1.02] transition-transform">
          {/* Official 5D Mint Green Glass Emoji Badge (#defaf2 with yellow lip and red tongue) */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#defaf2] via-[#bbf2e3] to-[#e6fff8] p-1.5 shadow-lg shadow-emerald-500/20 border-2 border-emerald-300 flex items-center justify-center overflow-hidden">
            <img
              src={reaction.imageUrl}
              alt={reaction.altText}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Voice transcript / Toast badge */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-0.5 rounded-full border border-emerald-300">
              {reaction.category.replace(/^commentary:/, '').toUpperCase()} REACTION
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm px-2">
              "{reaction.text}"
            </h3>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <span>⚡</span> FingerMobile AI Audio Engine (1.2s auto-dismiss)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceLineReactionOverlay;
