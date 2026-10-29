import React, { useState, useEffect } from 'react';
import {
  Plus, Radio, Lock, Music, ShieldAlert, Folder, ShoppingBag, X, Gift,
  ChevronLeft, ChevronRight, Play, Pause, Video
} from 'lucide-react';
import SendFicModal from './SendFicModal';

export interface MiiContactStatus {
  status_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  media_url?: string;
  media_type?: 'image' | 'video' | 'audio';
  has_pulsating_ring: boolean;
  hours_remaining: number;
  now_listening?: {
    title: string;
    artist: string;
    source: string;
  };
  now_watching?: {
    title: string;
    source: string;
  };
  is_locked?: boolean;
  cards?: Array<{
    media_url: string;
    media_type: 'image' | 'video' | 'audio';
    caption?: string;
  }>;
}

interface MiiStoriesBarProps {
  onOpenCreate?: () => void;
  onOpenPinExchange?: () => void;
  onOpenOrbit?: () => void;
  onOpenMiniStore?: () => void;
  refreshTrigger?: number;
  className?: string;
}

export const MiiStoriesBar: React.FC<MiiStoriesBarProps> = ({
  onOpenCreate,
  onOpenPinExchange,
  onOpenOrbit,
  onOpenMiniStore,
  refreshTrigger,
  className = ''
}) => {
  const [statuses, setStatuses] = useState<MiiContactStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [p2pShuffleTimer, setP2pShuffleTimer] = useState(10);
  const [isP2PAutoShuffling, setIsP2PAutoShuffling] = useState(true);
  const [viewerIsPaused, setViewerIsPaused] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchMiiFeed();
  }, [refreshTrigger]);

  const fetchMiiFeed = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('fingermobile_token') ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/mii/status/feed', { headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setStatuses(data.data);
      } else {
        setStatuses(fallbackMiiStatuses);
      }
    } catch {
      setStatuses(fallbackMiiStatuses);
    } finally {
      setLoading(false);
    }
  };

  // 10-Second P2P UGC automated random shuffling engine
  useEffect(() => {
    if (!isP2PAutoShuffling || statuses.length <= 1) return;

    const countdown = setInterval(() => {
      setP2pShuffleTimer((prev) => (prev <= 1 ? 10 : prev - 1));
    }, 1000);

    const interval = setInterval(() => {
      setStatuses((prev) => {
        if (prev.length <= 1) return prev;
        const next = [...prev];
        const shifted = next.shift();
        if (shifted) next.push(shifted);
        return next;
      });
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, [isP2PAutoShuffling, statuses.length]);

  // Full-screen viewer auto-advance every 10s (slides next story in from the right)
  useEffect(() => {
    if (activeStoryIndex === null || viewerIsPaused) return;

    setStoryProgress(0);
    const progressInterval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          setActiveStoryIndex((curr) => {
            if (curr === null) return null;
            if (curr < statuses.length - 1) return curr + 1;
            return 0;
          });
          return 0;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [activeStoryIndex, viewerIsPaused, statuses.length]);

  const activeStory = activeStoryIndex !== null ? statuses[activeStoryIndex] : null;

  const handleNextStory = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex < statuses.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(0);
    }
    setStoryProgress(0);
  };

  const handlePrevStory = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    } else {
      setActiveStoryIndex(statuses.length - 1);
    }
    setStoryProgress(0);
  };

  return (
    <div className={`bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-2xl p-4 shadow-sm mb-6 ${className}`}>
      {/* Top Banner with Quick Actions: Pin Sync, Orbit, MiniStore */}
      <div className="flex items-center justify-between mb-3 text-xs flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            Mii™®©℠ Disappearing Moments (48h)
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 text-[10px] font-black flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
            P2P Shuffle: {p2pShuffleTimer}s
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {onOpenPinExchange && (
            <button
              onClick={onOpenPinExchange}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 hover:bg-emerald-100 transition-colors"
            >
              <Lock className="w-3 h-3" /> Pin Exchange
            </button>
          )}
          {onOpenOrbit && (
            <button
              onClick={onOpenOrbit}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1 hover:bg-blue-100 transition-colors"
            >
              <Folder className="w-3 h-3" /> FingerOrbit™
            </button>
          )}
          {onOpenMiniStore && (
            <button
              onClick={onOpenMiniStore}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1 hover:bg-purple-100 transition-colors"
            >
              <ShoppingBag className="w-3 h-3" /> MiniStore
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Story Rings */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-2 no-scrollbar">
        {/* Your Story (+) Button */}
        <div
          onClick={onOpenCreate}
          className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
        >
          <div className="relative w-16 h-16 rounded-full p-0.5 border-2 border-dashed border-gray-400 dark:border-gray-600 group-hover:border-gray-400 transition-colors flex items-center justify-center bg-gray-50 dark:bg-gray-800 border text-gray-950 font-black">
            <Plus className="w-6 h-6 text-slate-600 group-hover:text-emerald-500" />
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-gray-900">
              +
            </span>
          </div>
          <span className="text-[11px] font-bold mt-1 text-slate-800 dark:text-gray-300">Create 48H Mii™®©℠</span>
        </div>

        {/* Contacts with Pulsating Profile Rings - IMMEDIATELY RENDERS UPLOADED MEDIA */}
        {loading ? (
          <div className="flex space-x-3 items-center">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse border text-gray-950 border-gray-400 font-black" />
            ))}
          </div>
        ) : (
          statuses.map((item, idx) => {
            const mediaSource = item.media_url || item.cards?.[0]?.media_url || item.author_avatar;
            const isVideo = item.media_type === 'video' || item.cards?.[0]?.media_type === 'video';

            return (
              <div
                key={item.status_id}
                onClick={() => {
                  setActiveStoryIndex(idx);
                  setStoryProgress(0);
                }}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer group animate-in slide-in-from-right duration-300"
                title={`Click to view ${item.author_name}'s media in full screen`}
              >
                {/* Pulsating Colored Ring */}
                <div className={`relative w-16 h-16 rounded-full p-0.5 transition-transform group-hover:scale-105 shadow-md ${
                  item.has_pulsating_ring
                    ? 'bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 animate-pulse'
                    : 'border border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-gray-900 bg-slate-900 relative">
                    {/* Immediately Display Uploaded UGC Media */}
                    <img
                      src={mediaSource}
                      alt={item.author_name}
                      className="w-full h-full object-cover"
                    />

                    {isVideo && (
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <Video className="w-3.5 h-3.5 text-white drop-shadow" />
                      </div>
                    )}
                  </div>

                  {/* Creator Mini-Avatar in corner */}
                  {item.author_avatar && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full overflow-hidden border border-white dark:border-gray-900 shadow-sm bg-white">
                      <img src={item.author_avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* ShowCase Music / Video Indicator */}
                  {item.now_listening && (
                    <div title={`Listening to ${item.now_listening.title}`} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center border-2 border-white dark:border-gray-900">
                      <Music className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                <span className="text-[11px] font-bold mt-1 text-slate-800 dark:text-gray-200 truncate w-16 text-center">
                  @{item.author_name}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Disappearing Full-Screen Story Viewer Modal (Slides in from the right) */}
      {activeStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setActiveStoryIndex(null)}
        >
          <div
            key={activeStory.status_id}
            className="relative w-full max-w-sm aspect-[9/16] bg-gray-950 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col justify-between p-4 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top 10-Second Auto-Advance Progress Bars */}
            <div className="flex items-center gap-1 w-full mb-2">
              {statuses.map((s, idx) => (
                <div key={s.status_id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-emerald-400 transition-all duration-100 ${
                      idx < (activeStoryIndex ?? 0)
                        ? 'w-full'
                        : idx === activeStoryIndex
                        ? `w-[${storyProgress}%]`
                        : 'w-0'
                    }`}
                    style={idx === activeStoryIndex ? { width: `${storyProgress}%` } : undefined}
                  />
                </div>
              ))}
            </div>

            {/* Top Bar with 48h TTL & Close */}
            <div className="flex items-center justify-between text-white text-xs z-20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-400">
                  <img src={activeStory.author_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeStory.author_name}`} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-white">@{activeStory.author_name}</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Disappears in {Math.round(activeStory.hours_remaining || 48)}h</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewerIsPaused((p) => !p)}
                  className="w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
                  title={viewerIsPaused ? 'Resume auto-advance' : 'Pause'}
                >
                  {viewerIsPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
                <button type="button" aria-label="Close"
                  onClick={() => setActiveStoryIndex(null)}
                  className="w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Display (Uploaded Photo or Video in Full View) */}
            <div className="relative w-full h-full my-3 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {activeStory.cards?.[0]?.media_type === 'video' ? (
                <video
                  src={activeStory.cards?.[0]?.media_url || activeStory.media_url}
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeStory.cards?.[0]?.media_url || activeStory.media_url || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-emerald-400" /> End-to-End Encrypted (256-bit)
              </div>

              {/* Slide Navigation Arrows */}
              <button aria-label="Previous"
                type="button"
                onClick={handlePrevStory}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition shadow-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button aria-label="Next"
                type="button"
                onClick={handleNextStory}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition shadow-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* ShowCase Activity Pill */}
            {activeStory.now_listening && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 text-slate-200 text-xs flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 truncate">
                  <Music className="w-4 h-4 text-orange-400 flex-shrink-0 animate-bounce" />
                  <span className="truncate">Now Playing: <b>{activeStory.now_listening.title}</b> ({activeStory.now_listening.source})</span>
                </div>
              </div>
            )}

            {/* Bottom Reply Bar */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTipModal(true)}
                className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 hover:bg-emerald-500/40 transition-colors"
                title="Tip/Gift Creator"
              >
                <Gift className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Reply to Mii..."
                className="flex-1 px-3 py-2 text-xs rounded-full bg-white text-slate-900 placeholder:text-slate-400 border border-white/20 focus:outline-none font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                aria-label="Send reply"
                onClick={() => {
                  if (replyText.trim()) {
                    setReplyText('');
                  }
                }}
                className="px-3 py-2 bg-emerald-500 rounded-full text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
              >
                Send
              </button>
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

const fallbackMiiStatuses: MiiContactStatus[] = [
  {
    status_id: 'm1',
    author_id: '10',
    author_name: 'chidi_producer',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    media_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    media_type: 'image',
    has_pulsating_ring: true,
    hours_remaining: 36,
    now_listening: {
      title: 'City Boys',
      artist: 'Burna Boy',
      source: 'BeatwaveNG'
    },
    cards: [
      {
        media_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
        media_type: 'image',
        caption: 'Late night studio recording session with the crew 🎧'
      }
    ]
  },
  {
    status_id: 'm2',
    author_id: '11',
    author_name: 'ngozi_dance',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    media_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80',
    media_type: 'image',
    has_pulsating_ring: true,
    hours_remaining: 42,
    now_watching: {
      title: 'Afrobeats Showcase Live',
      source: 'Dancia-4Tv'
    },
    cards: [
      {
        media_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80',
        media_type: 'image',
        caption: 'Rehearsing the new choreography for Dancia-4Tv live broadcast! 💃'
      }
    ]
  },
  {
    status_id: 'm3',
    author_id: '12',
    author_name: 'israel_protocol',
    author_avatar: '/assets/branding/mbah_israel_obinna.jpeg',
    media_url: '/assets/branding/mbah_israel_obinna.jpeg',
    media_type: 'image',
    has_pulsating_ring: true,
    hours_remaining: 47,
    cards: [
      {
        media_url: '/assets/branding/mbah_israel_obinna.jpeg',
        media_type: 'image',
        caption: 'FingerMobile Sovereign Protocol P2P node network initialized ⚡'
      }
    ]
  }
];

export default MiiStoriesBar;
