import React, { useState, useEffect } from 'react';
import {
  Smartphone, Heart, MessageCircle, Music, Clock, Sparkles, Layers,
  SplitSquareVertical, Gift, ChevronLeft, ChevronRight, Play, Pause, X
} from 'lucide-react';
import SendFicModal from './SendFicModal';
import { useAppContext } from '../contexts/AppContext';

export interface FingerShortCard {
  id: string;
  card_index: number;
  media_type: 'video' | 'image' | 'audio';
  media_url: string;
  thumbnail_url?: string;
  duration_seconds: number;
  sound_title?: string;
  is_duet?: boolean;
  is_stitch?: boolean;
  views_count?: number;
  likes_count?: number;
}

export interface FingerShortSession {
  session_id: string;
  author_id: string;
  author_name?: string;
  author_avatar?: string;
  session_title?: string;
  card_count: number;
  expires_at: string;
  hours_remaining?: number;
  cards: FingerShortCard[];
}

interface FingerShortsSectionProps {
  onOpenCreate?: () => void;
  className?: string;
}

export const FingerShortsSection: React.FC<FingerShortsSectionProps> = ({
  onOpenCreate,
  className = ''
}) => {
  const [sessions, setSessions] = useState<FingerShortSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSession, setActiveSession] = useState<FingerShortSession | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [showTipModal, setShowTipModal] = useState(false);
  const [p2pShuffleTimer, setP2pShuffleTimer] = useState(10);
  const [isP2PAutoShuffling, setIsP2PAutoShuffling] = useState(true);
  const [cardProgress, setCardProgress] = useState(0);
  const [viewerPaused, setViewerPaused] = useState(false);
  const { showToast } = useAppContext();
  const [likedCardIds, setLikedCardIds] = useState<Record<string, boolean>>({});

  const handleDuet = () => {
    showToast?.('Duet recorder opening...', 'info');
    onOpenCreate?.();
  };

  const handleLike = () => {
    const card = activeSession?.cards[currentCardIndex];
    if (!card) return;
    const isLiked = likedCardIds[card.id];
    setLikedCardIds((prev) => ({ ...prev, [card.id]: !isLiked }));
    showToast?.(!isLiked ? 'Story liked!' : 'Story unliked', 'success');
  };

  const handleComment = () => {
    showToast?.('Comments coming soon to live stories', 'info');
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  const fetchShorts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/fingershorts/for-you?limit=10');
      const result = await response.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        setSessions(result.data);
      } else {
        setSessions(fallbackShorts);
      }
    } catch {
      setSessions(fallbackShorts);
    } finally {
      setLoading(false);
    }
  };

  // 10-Second P2P Random UGC Shuffling Engine for Story Reel
  useEffect(() => {
    if (!isP2PAutoShuffling || sessions.length <= 1) return;

    const timer = setInterval(() => {
      setP2pShuffleTimer((prev) => (prev <= 1 ? 10 : prev - 1));
    }, 1000);

    const interval = setInterval(() => {
      setSessions((prev) => {
        if (prev.length <= 1) return prev;
        const next = [...prev];
        const shifted = next.shift();
        if (shifted) next.push(shifted);
        return next;
      });
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [isP2PAutoShuffling, sessions.length]);

  // Fullscreen Multi-Card Story Viewer: 10s auto-progression sliding next card in from the right
  useEffect(() => {
    if (!activeSession || viewerPaused) return;

    setCardProgress(0);
    const progInterval = setInterval(() => {
      setCardProgress((p) => {
        if (p >= 100) {
          nextCard();
          return 0;
        }
        return p + 1;
      });
    }, 100);

    return () => clearInterval(progInterval);
  }, [activeSession, currentCardIndex, viewerPaused]);

  // Keyboard navigation
  useEffect(() => {
    if (!activeSession) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextCard();
      else if (e.key === 'ArrowLeft') prevCard();
      else if (e.key === 'Escape') setActiveSession(null);
      else if (e.key === ' ') {
        e.preventDefault();
        setViewerPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSession, currentCardIndex]);

  const handleOpenStory = (session: FingerShortSession) => {
    setActiveSession(session);
    setCurrentCardIndex(0);
    setCardProgress(0);
  };

  const nextCard = () => {
    if (!activeSession) return;
    if (currentCardIndex < activeSession.cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setCardProgress(0);
    } else {
      // Loop or go to next session
      setActiveSession(null);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
      setCardProgress(0);
    }
  };

  return (
    <div className={`bg-gradient-to-r from-purple-50/70 via-pink-50/50 to-blue-50/60 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-purple-200/80 dark:border-gray-700/80 rounded-2xl p-5 shadow-sm my-6 ${className}`}>
      {/* Header with 48h TTL badge & 10s P2P Shuffle Indicator */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">FingerShorts</h2>
              <span className="text-[11px] font-black uppercase tracking-wider bg-purple-100 text-purple-950 border border-purple-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" /> 48h TTL
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 flex items-center gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                P2P Shuffle: {p2pShuffleTimer}s
              </span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-300 font-medium">Ephemeral multi-card stories (Up to 20 media cards, Free $0.00)</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsP2PAutoShuffling((v) => !v)}
            className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition"
            title="Toggle 10s P2P auto-shuffle"
          >
            {isP2PAutoShuffling ? 'Pause Shuffle' : 'Resume Shuffle'}
          </button>
          {onOpenCreate && (
            <button
              onClick={onOpenCreate}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> + Create FingerShorts
            </button>
          )}
        </div>
      </div>

      {/* Stories Scrollable Reel Row - IMMEDIATELY RENDERS UPLOADED MEDIA */}
      {loading ? (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="w-28 sm:w-32 aspect-[9/16] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse flex-shrink-0" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-6 text-gray-700 dark:text-gray-400 text-xs font-semibold">No active FingerShorts stories right now.</div>
      ) : (
        <div className="flex space-x-3.5 overflow-x-auto pb-2 no-scrollbar">
          {sessions.map((session) => {
            const firstCard = session.cards?.[0] || { media_url: '', media_type: 'image' };
            const mediaSource = firstCard.thumbnail_url || firstCard.media_url || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80';

            return (
              <div
                key={session.session_id}
                onClick={() => handleOpenStory(session)}
                className="group relative w-28 sm:w-32 aspect-[9/16] rounded-xl overflow-hidden cursor-pointer flex-shrink-0 shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-pink-500 bg-gray-900 animate-in slide-in-from-right duration-300"
                title={`Click to view ${session.author_name}'s story in full screen`}
              >
                {/* Immediately Display Uploaded Media */}
                {firstCard.media_type === 'video' ? (
                  <div className="w-full h-full relative">
                    <video
                      src={firstCard.media_url}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-pink-600/80 flex items-center justify-center shadow">
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={mediaSource}
                    alt={session.session_title || 'Story'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}

                {/* Card Count Pill */}
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/20">
                  <Layers className="w-2.5 h-2.5 text-pink-400" />
                  {session.card_count}/20
                </div>

                {/* 48h TTL Indicator */}
                <div className="absolute top-2 right-2 bg-purple-900/90 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono text-purple-200">
                  {Math.round(session.hours_remaining || 48)}h
                </div>

                {/* Bottom Author Tag */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-2 text-white">
                  <p className="text-[11px] font-bold truncate leading-tight">@{session.author_name || 'member'}</p>
                  {firstCard.sound_title && (
                    <p className="text-[9px] text-pink-300 truncate flex items-center gap-0.5 mt-0.5 font-medium">
                      <Music className="w-2.5 h-2.5 flex-shrink-0" /> {firstCard.sound_title}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Multi-Card Cinematic Fullscreen Story Viewer (Slides in from the right) */}
      {activeSession && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setActiveSession(null)}
        >
          {/* Active Card Container - Keyed by currentCardIndex so each slide enters smoothly from right */}
          <div
            key={`${activeSession.session_id}-${currentCardIndex}`}
            className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col justify-between animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Multi-Card Progress Bars */}
            <div className="absolute top-3 inset-x-3 z-30 flex space-x-1">
              {activeSession.cards.map((card, idx) => (
                <div key={card.id || idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-white transition-all duration-100 ${
                      idx < currentCardIndex
                        ? 'w-full'
                        : idx === currentCardIndex
                        ? `w-[${cardProgress}%]`
                        : 'w-0'
                    }`}
                    style={idx === currentCardIndex ? { width: `${cardProgress}%` } : undefined}
                  />
                </div>
              ))}
            </div>

            {/* Header info */}
            <div className="absolute top-6 inset-x-3 z-30 flex items-center justify-between text-white text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-pink-500 overflow-hidden border border-white/50">
                  <img
                    src={activeSession.author_avatar || 'https://placehold.co/40x40/FF6B6B/FFFFFF?text=FM'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-bold text-white block">@{activeSession.author_name || 'creator'}</span>
                  <span className="text-[10px] text-pink-300">
                    Card {currentCardIndex + 1} of {activeSession.card_count} (10s slide)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewerPaused((p) => !p)}
                  className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
                  title={viewerPaused ? 'Resume auto-advance' : 'Pause'}
                >
                  {viewerPaused ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5 fill-white" />}
                </button>
                <button
                  type="button"
                  aria-label="Close short viewer"
                  onClick={() => setActiveSession(null)}
                  className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center font-bold hover:bg-black/80 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Card Media Display */}
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              {activeSession.cards[currentCardIndex]?.media_type === 'video' ? (
                <video
                  src={activeSession.cards[currentCardIndex].media_url}
                  autoPlay
                  controls
                  playsInline
                  onEnded={nextCard}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeSession.cards[currentCardIndex]?.media_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}

              {/* Explicit Slide Navigation Buttons */}
              <button
                type="button"
                onClick={prevCard}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition shadow-lg z-20"
                title="Previous Card"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={nextCard}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition shadow-lg z-20"
                title="Next Card (Slides in from right)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Tap Left/Right Navigation zones */}
              <div className="absolute inset-y-0 left-0 w-1/4 cursor-pointer z-10" onClick={prevCard} />
              <div className="absolute inset-y-0 right-0 w-1/4 cursor-pointer z-10" onClick={nextCard} />
            </div>

            {/* Bottom Actions Overlay: Duet, Stitch, Sounds, Reply */}
            <div className="absolute bottom-4 inset-x-4 z-30 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3 text-xs">
                {activeSession.cards[currentCardIndex]?.sound_title && (
                  <span className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full text-[10px] font-medium border border-white/20">
                    <Music className="w-3 h-3 text-pink-400" /> {activeSession.cards[currentCardIndex].sound_title}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  title="Tip Creator"
                  aria-label="Tip Creator"
                  onClick={() => setShowTipModal(true)}
                  className="p-2 bg-black/60 rounded-full hover:bg-black/90 transition shadow"
                >
                  <Gift className="w-4 h-4 text-emerald-400" />
                </button>
                <button
                  type="button"
                  title="Duet"
                  aria-label="Duet with creator"
                  onClick={handleDuet}
                  className="p-2 bg-black/60 rounded-full hover:bg-black/90 transition shadow"
                >
                  <SplitSquareVertical className="w-4 h-4 text-purple-300" />
                </button>
                <button
                  type="button"
                  title="Like"
                  aria-label="Like story card"
                  onClick={handleLike}
                  className="p-2 bg-black/60 rounded-full hover:bg-black/90 transition shadow"
                >
                  <Heart className={`w-4 h-4 ${activeSession && likedCardIds[activeSession.cards[currentCardIndex]?.id] ? 'fill-red-500 text-red-500' : 'text-red-400'}`} />
                </button>
                <button
                  type="button"
                  title="Comment"
                  aria-label="Comment on story card"
                  onClick={handleComment}
                  className="p-2 bg-black/60 rounded-full hover:bg-black/90 transition shadow"
                >
                  <MessageCircle className="w-4 h-4 text-blue-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTipModal && (
        <SendFicModal
          onClose={() => setShowTipModal(false)}
          onSend={async (recipient, amount, message) => {
            console.log(`Sending ${amount} FIC to ${recipient} with message: ${message}`);
            return Promise.resolve();
          }}
        />
      )}
    </div>
  );
};

const fallbackShorts: FingerShortSession[] = [
  {
    session_id: 'fs1',
    author_id: '1',
    author_name: 'creative_maya',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    session_title: 'Behind the Scenes Dance Studio',
    card_count: 3,
    expires_at: new Date(Date.now() + 45 * 3600 * 1000).toISOString(),
    hours_remaining: 45,
    cards: [
      {
        id: 'c1',
        card_index: 1,
        media_type: 'video',
        media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        duration_seconds: 25.0,
        sound_title: 'Afrobeat Tempo 120'
      },
      {
        id: 'c2',
        card_index: 2,
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
        duration_seconds: 5.0
      },
      {
        id: 'c3',
        card_index: 3,
        media_type: 'video',
        media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        duration_seconds: 30.0,
        sound_title: 'Studio Chillout'
      }
    ]
  },
  {
    session_id: 'fs2',
    author_id: '2',
    author_name: 'tunde_chef',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    session_title: 'Quick Suya Skewers Recipe',
    card_count: 2,
    expires_at: new Date(Date.now() + 38 * 3600 * 1000).toISOString(),
    hours_remaining: 38,
    cards: [
      {
        id: 'c4',
        card_index: 1,
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
        duration_seconds: 5.0
      },
      {
        id: 'c5',
        card_index: 2,
        media_type: 'video',
        media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration_seconds: 40.0,
        sound_title: 'Cooking Rhythm Beats'
      }
    ]
  }
];

export default FingerShortsSection;
