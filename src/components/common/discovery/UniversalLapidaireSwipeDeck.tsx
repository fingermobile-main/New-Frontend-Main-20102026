/* eslint-disable no-unused-vars */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  X,
  Heart,
  Star,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  MapPin,
  MessageCircle,
  Flame,
  CheckCircle2
} from 'lucide-react';
import {
  SharedInterestMember,
  DiscoveryDomain,
  SwipeDirection,
  MatchCelebrationData
} from './types';
import { SharedInterestMatchCelebrationModal } from './SharedInterestMatchCelebrationModal';

interface UniversalLapidaireSwipeDeckProps {
  domain: DiscoveryDomain;
  members: SharedInterestMember[];
  onOpenLapidaireModal: () => void;
  onSendMessage?: (_memberId: string) => void;
  onExchangePin?: (_memberId: string) => void;
}

const SWIPE_THRESHOLD_X = 90;
const SWIPE_THRESHOLD_Y = -110;

export const UniversalLapidaireSwipeDeck: React.FC<UniversalLapidaireSwipeDeckProps> = ({
  domain,
  members,
  onOpenLapidaireModal,
  onSendMessage,
  onExchangePin
}) => {
  const isBeatwave = domain === 'beatwaveng';
  const accentColor = isBeatwave ? 'amber' : 'rose';
  const gradientBg = isBeatwave
    ? 'from-amber-500 to-orange-600'
    : 'from-rose-500 to-red-600';

  const [deck, setDeck] = useState<SharedInterestMember[]>(members);
  const [swipedCount, setSwipedCount] = useState<number>(0);
  const [swipedHistory, setSwipedHistory] = useState<{
    member: SharedInterestMember;
    direction: SwipeDirection;
  }[]>([]);
  const [matchData, setMatchData] = useState<MatchCelebrationData | null>(null);

  // Dragging gesture state for top card
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeDirection, setActiveDirection] = useState<SwipeDirection | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startRef = useRef({ x: 0, y: 0 });

  // Reset deck if members list changes
  useEffect(() => {
    setDeck(members);
    setSwipedCount(0);
    setSwipedHistory([]);
  }, [members]);

  const currentCards = deck.slice(swipedCount, swipedCount + 3);
  const topCard = currentCards[0];

  const executeSwipe = useCallback(
    (member: SharedInterestMember, direction: SwipeDirection) => {
      setSwipedHistory((prev) => [...prev, { member, direction }]);
      setSwipedCount((prev) => prev + 1);

      // Check for mutual match trigger (high compatibility or super-like)
      if (direction === 'like' || direction === 'super_like') {
        const highlights = member.sharedInterests.slice(0, 3).map((si) => `${si.label}: ${si.value}`);
        setMatchData({
          member,
          matchType: direction === 'super_like' ? 'super_like_colabo' : 'mutual_like',
          matchedAt: new Date().toISOString(),
          sharedHighlights: highlights
        });
      }
    },
    []
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!cardRef.current || isExiting) return;
    cardRef.current.setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  }, [isExiting]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || isExiting) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    setPos({ x: dx, y: dy });

    if (dy < SWIPE_THRESHOLD_Y && Math.abs(dx) < 80) {
      setActiveDirection('super_like');
    } else if (dx > SWIPE_THRESHOLD_X) {
      setActiveDirection('like');
    } else if (dx < -SWIPE_THRESHOLD_X) {
      setActiveDirection('pass');
    } else {
      setActiveDirection(null);
    }
  }, [isDragging, isExiting]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging || isExiting || !topCard) return;
    setIsDragging(false);

    if (activeDirection) {
      setIsExiting(true);
      setTimeout(() => {
        executeSwipe(topCard, activeDirection);
        setPos({ x: 0, y: 0 });
        setActiveDirection(null);
        setIsExiting(false);
      }, 300);
    } else {
      setPos({ x: 0, y: 0 });
      setActiveDirection(null);
    }
  }, [isDragging, isExiting, activeDirection, topCard, executeSwipe]);

  // Button-driven swipe
  const handleButtonSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (!topCard || isExiting) return;
      setActiveDirection(direction);
      setIsExiting(true);

      const targetX = direction === 'pass' ? -400 : direction === 'like' ? 400 : 0;
      const targetY = direction === 'super_like' ? -400 : 0;
      setPos({ x: targetX, y: targetY });

      setTimeout(() => {
        executeSwipe(topCard, direction);
        setPos({ x: 0, y: 0 });
        setActiveDirection(null);
        setIsExiting(false);
      }, 280);
    },
    [topCard, isExiting, executeSwipe]
  );

  // Rewind last swipe
  const handleRewind = useCallback(() => {
    if (swipedCount === 0 || swipedHistory.length === 0) return;
    setSwipedCount((prev) => Math.max(0, prev - 1));
    setSwipedHistory((prev) => prev.slice(0, prev.length - 1));
  }, [swipedCount, swipedHistory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (!topCard || isExiting) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleButtonSwipe('pass');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleButtonSwipe('like');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleButtonSwipe('super_like');
      } else if (e.key === 'Backspace' || e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleRewind();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [topCard, isExiting, handleButtonSwipe, handleRewind]);

  // Deck exhausted
  if (!topCard) {
    return (
      <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-5 shadow-2xl">
        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-tr ${gradientBg} text-white flex items-center justify-center shadow-lg shadow-${accentColor}-500/30`}>
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Deck Caught Up!
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            You have explored all active shared interest profiles in this wave. Calibrate your Lapidaire profile to discover new sovereign circles.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => {
              setSwipedCount(0);
              setSwipedHistory([]);
            }}
            className={`py-3 px-5 rounded-xl text-xs font-bold bg-gradient-to-r ${gradientBg} text-white hover:brightness-110 shadow-lg transition flex items-center justify-center gap-2`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Shuffle &amp; Replay Lapidaire Deck</span>
          </button>
          <button
            onClick={onOpenLapidaireModal}
            className="py-2.5 px-5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            Sharpen Lapidaire AI Calibration
          </button>
        </div>
      </div>
    );
  }

  const rotation = pos.x * 0.08;

  return (
    <div className="w-full max-w-md mx-auto select-none flex flex-col items-center">
      {/* Top Banner: Controls & Status */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className={`w-4 h-4 text-${accentColor}-400`} />
            <span>Lapidaire P2P Deck</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {deck.length - swipedCount} Remaining
          </span>
        </div>

        <button
          onClick={onOpenLapidaireModal}
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Calibrate AI ({isBeatwave ? 'Audio' : 'Cinema'})</span>
        </button>
      </div>

      {/* Card Stack Container */}
      <div className="relative w-full aspect-[3/4.2] min-h-[460px] max-h-[560px]">
        {currentCards.map((member, index) => {
          const isTop = index === 0;
          const stackScale = 1 - index * 0.04;
          const stackTranslateY = index * 10;

          const cardStyle: React.CSSProperties = isTop
            ? {
              transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)',
              zIndex: 30,
              cursor: isDragging ? 'grabbing' : 'grab'
            }
            : {
              transform: `scale(${stackScale}) translateY(${stackTranslateY}px)`,
              zIndex: 30 - index,
              opacity: 1 - index * 0.2,
              pointerEvents: 'none'
            };

          return (
            <div
              key={member.id}
              ref={isTop ? cardRef : undefined}
              style={cardStyle}
              onPointerDown={isTop ? handlePointerDown : undefined}
              onPointerMove={isTop ? handlePointerMove : undefined}
              onPointerUp={isTop ? handlePointerUp : undefined}
              className="absolute inset-0 rounded-3xl overflow-hidden bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col justify-between p-4"
            >
              {/* Overlay Feedback Stamps during gesture drag */}
              {isTop && activeDirection === 'like' && (
                <div className="absolute top-6 right-6 z-40 border-4 border-emerald-400 text-emerald-400 font-black text-lg px-4 py-1.5 rounded-2xl rotate-12 bg-black/60 backdrop-blur-sm tracking-wider animate-pulse">
                  CONNECT 💚
                </div>
              )}
              {isTop && activeDirection === 'pass' && (
                <div className="absolute top-6 left-6 z-40 border-4 border-rose-500 text-rose-500 font-black text-lg px-4 py-1.5 rounded-2xl -rotate-12 bg-black/60 backdrop-blur-sm tracking-wider animate-pulse">
                  PASS ✗
                </div>
              )}
              {isTop && activeDirection === 'super_like' && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 border-4 border-amber-400 text-amber-400 font-black text-base sm:text-lg px-4 py-1.5 rounded-2xl bg-black/80 backdrop-blur-sm tracking-widest animate-pulse flex items-center gap-1.5 whitespace-nowrap">
                  <span>⭐ SUPER LIKE / VIP PIN</span>
                </div>
              )}

              {/* Background Media / Avatar Hero Frame */}
              <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-950 shrink-0">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Compatibility Score Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-500/80 text-emerald-300 font-mono text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{member.compatibilityScore}% Resonance</span>
                </div>

                {/* Sovereign Tier Tag */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-xs border border-slate-700 text-[10px] font-bold text-amber-400">
                  {member.memberTier || 'Sovereign Member'}
                </div>

                {/* Member Identity Details on Hero */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-lg font-black text-white">{member.name}</h4>
                      {member.verified && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                      {member.ninVerified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-300">
                      <span className="font-mono text-slate-400">{member.handle}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{member.location}</span>
                      </span>
                    </div>
                  </div>

                  {member.isOnline && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live
                    </span>
                  )}
                </div>
              </div>

              {/* Shared Interests Grid & Details */}
              <div className="flex-1 py-3 overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Shared Resonance Matrix:</span>
                    <span className="text-amber-400 font-mono">{member.sharedInterests.length} Mutual Matches</span>
                  </div>

                  {/* Pills Grid */}
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {member.sharedInterests.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-950 border border-slate-800 text-slate-200"
                      >
                        <span>{tag.icon || '✨'}</span>
                        <span className="text-amber-400 font-bold">{tag.label}:</span>
                        <span>{tag.value}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Lapidaire Answer Spotlight */}
                {member.lapidaireAnswers.length > 0 && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mb-0.5">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Lapidaire Core Resonance:</span>
                    </div>
                    <p className="text-xs italic text-slate-300 line-clamp-2">
                      "{member.lapidaireAnswers[0].answer}"
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer Hint */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>← Swipe Left to Pass</span>
                <span className="text-amber-400 font-bold">↑ Swipe Up Super-Like</span>
                <span>Swipe Right to Connect →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Buttons */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5 z-40">
        {/* Rewind */}
        <button
          onClick={handleRewind}
          disabled={swipedCount === 0}
          title="Rewind Last Member (Z or Backspace)"
          className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white border border-slate-700 shadow-lg flex items-center justify-center transition transform hover:scale-110 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Pass Button (Swipe Left) */}
        <button
          onClick={() => handleButtonSwipe('pass')}
          title="Pass (ArrowLeft)"
          className="w-14 h-14 rounded-full bg-slate-900 hover:bg-rose-950 text-rose-500 border border-rose-500/40 shadow-xl flex items-center justify-center transition transform hover:scale-110 active:scale-95 text-xl font-bold"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Super Like / Colabo+ PIN (Swipe Up) */}
        <button
          onClick={() => handleButtonSwipe('super_like')}
          title="Super Like & Exchange PIN (ArrowUp)"
          className={`w-12 h-12 rounded-full bg-slate-900 hover:bg-${accentColor}-950 text-amber-400 border border-amber-400/50 shadow-xl flex items-center justify-center transition transform hover:scale-110 active:scale-95`}
        >
          <Star className="w-6 h-6 fill-amber-400/20" />
        </button>

        {/* Connect / Like (Swipe Right) */}
        <button
          onClick={() => handleButtonSwipe('like')}
          title="Connect / Match (ArrowRight)"
          className="w-14 h-14 rounded-full bg-slate-900 hover:bg-emerald-950 text-emerald-400 border border-emerald-500/40 shadow-xl flex items-center justify-center transition transform hover:scale-110 active:scale-95"
        >
          <Heart className="w-7 h-7 fill-emerald-400/20" />
        </button>

        {/* Instant Message */}
        <button
          onClick={() => {
            if (topCard && onSendMessage) onSendMessage(topCard.id);
          }}
          title="Send Direct Sovereign Message"
          className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 shadow-lg flex items-center justify-center transition transform hover:scale-110 active:scale-95"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* Mutual Match Celebration Modal */}
      <SharedInterestMatchCelebrationModal
        data={matchData}
        domain={domain}
        onClose={() => setMatchData(null)}
        onSendMessage={onSendMessage}
        onExchangePin={onExchangePin}
      />
    </div>
  );
};
