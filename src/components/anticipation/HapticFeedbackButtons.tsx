import React, { useState } from 'react';
import { HeartIcon } from '../icons';

interface HapticFeedbackButtonsProps {
  targetId: string;
  targetType?: string;
  initialLoves?: number;
  initialDislikes?: number;
  // eslint-disable-next-line no-unused-vars
  onRewardReceived?: (reward: { type: string; amount: number; badge?: string }) => void;
}

export const HapticFeedbackButtons: React.FC<HapticFeedbackButtonsProps> = ({
  targetId,
  targetType = 'post',
  initialLoves = 0,
  initialDislikes = 0,
  onRewardReceived
}) => {
  const [loves, setLoves] = useState(initialLoves);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userVote, setUserVote] = useState<'love' | 'dislike' | null>(null);
  const [isShimmering, setIsShimmering] = useState(false);
  const [pressTimer, setPressTimer] = useState<any>(null);
  const [rewardNotice, setRewardNotice] = useState<string | null>(null);

  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (err) {
        // Vibrations not permitted or hardware unsupported
      }
    }
  };

  const handleLove = async () => {
    const isActivating = userVote !== 'love';
    setUserVote(isActivating ? 'love' : null);
    setLoves((prev) => (isActivating ? prev + 1 : Math.max(0, prev - 1)));
    if (userVote === 'dislike') setDislikes((prev) => Math.max(0, prev - 1));

    if (isActivating) {
      triggerHaptic([30, 50, 30]); // double_click haptic pattern
      setIsShimmering(true);
      setTimeout(() => setIsShimmering(false), 800);

      try {
        const res = await fetch('/api/v1/vault/anticipation/interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetId,
            targetType,
            interactionType: 'love'
          })
        });

        if (res.ok) {
          // Check for stochastic reinforcement reward
          const rewardRes = await fetch('/api/v1/vault/anticipation/stochastic-reward');
          if (rewardRes.ok) {
            const rewardData = await rewardRes.json();
            if (rewardData.data && rewardData.data.rewardType !== 'none') {
              setRewardNotice(`+${rewardData.data.rewardAmount} Gems Unlocked!`);
              if (onRewardReceived) {
                onRewardReceived({
                  type: rewardData.data.rewardType,
                  amount: rewardData.data.rewardAmount,
                  badge: rewardData.data.badge
                });
              }
              setTimeout(() => setRewardNotice(null), 3000);
            }
          }
        }
      } catch (err) {
        // Network fallback
      }
    }
  };

  const handleDislike = async () => {
    const isActivating = userVote !== 'dislike';
    setUserVote(isActivating ? 'dislike' : null);
    setDislikes((prev) => (isActivating ? prev + 1 : Math.max(0, prev - 1)));
    if (userVote === 'love') setLoves((prev) => Math.max(0, prev - 1));

    triggerHaptic(20); // soft tap

    try {
      await fetch('/api/v1/vault/anticipation/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId,
          targetType,
          interactionType: 'dislike'
        })
      });
    } catch (err) {
      // Network fallback
    }
  };

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      triggerHaptic([50, 80, 50, 100]); // Burst long-press
      setIsShimmering(true);
      setRewardNotice('🔥 2.5x Anticipation Multiplier!');
      setTimeout(() => setRewardNotice(null), 2500);
      setTimeout(() => setIsShimmering(false), 1200);
    }, 800);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <div className="relative inline-flex items-center gap-1.5 select-none">
      {/* Stochastic reward popup pill */}
      {rewardNotice && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] shadow-lg animate-bounce pointer-events-none z-20 whitespace-nowrap">
          {rewardNotice}
        </div>
      )}

      {/* Love Button with Haptic Shimmer */}
      <button
        type="button"
        onClick={handleLove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
          userVote === 'love'
            ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 shadow-sm'
            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/60'
        } ${isShimmering ? 'ring-2 ring-amber-400 scale-105' : ''}`}
        title="Love (Long-press for burst reward)"
      >
        <HeartIcon className={`w-3.5 h-3.5 ${userVote === 'love' ? 'fill-rose-500 text-rose-500' : ''}`} />
        <span>{loves}</span>
        {isShimmering && (
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse pointer-events-none" />
        )}
      </button>

      {/* Dislike / Critical Feedback Button */}
      <button
        type="button"
        onClick={handleDislike}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
          userVote === 'dislike'
            ? 'bg-slate-700 text-slate-200 border border-slate-600'
            : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-slate-200 border border-transparent'
        }`}
        title="Dislike / Critical Feedback"
      >
        <span className="text-xs">👎</span>
        <span>{dislikes}</span>
      </button>
    </div>
  );
};

export default HapticFeedbackButtons;
