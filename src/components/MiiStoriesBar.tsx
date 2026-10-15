import React, { useState, useEffect } from 'react';
import { Plus, Radio, Lock, Music, ShieldAlert, Folder, ShoppingBag, X, Gift } from 'lucide-react';
import SendFicModal from './SendFicModal';

export interface MiiContactStatus {
  status_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
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
}

interface MiiStoriesBarProps {
  onOpenCreate?: () => void;
  onOpenPinExchange?: () => void;
  onOpenOrbit?: () => void;
  onOpenMiniStore?: () => void;
  className?: string;
}

export const MiiStoriesBar: React.FC<MiiStoriesBarProps> = ({
  onOpenCreate,
  onOpenPinExchange,
  onOpenOrbit,
  onOpenMiniStore,
  className = ''
}) => {
  const [statuses, setStatuses] = useState<MiiContactStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeStory, setActiveStory] = useState<any | null>(null);
  const [showTipModal, setShowTipModal] = useState(false);

  useEffect(() => {
    fetchMiiFeed();
  }, []);

  const fetchMiiFeed = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/mii/status/feed', { headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
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

  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm mb-6 ${className}`}>
      {/* Top Banner with Quick Actions: Pin Sync, Orbit, MiniStore */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            Mii™®©℠ Disappearing Moments (48h)
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
          <div className="relative w-16 h-16 rounded-full p-0.5 border-2 border-dashed border-gray-300 dark:border-gray-600 group-hover:border-emerald-500 transition-colors flex items-center justify-center bg-gray-50 dark:bg-gray-800">
            <Plus className="w-6 h-6 text-slate-500 group-hover:text-emerald-500" />
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-gray-900">
              +
            </span>
          </div>
          <span className="text-[11px] font-semibold mt-1 text-gray-700 dark:text-gray-300">Create 48H Mii™®©℠</span>
        </div>

        {/* Contacts with Pulsating Profile Rings */}
        {loading ? (
          <div className="flex space-x-3 items-center">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          statuses.map((item) => (
            <div
              key={item.status_id}
              onClick={() => setActiveStory(item)}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
            >
              {/* Pulsating Colored Ring */}
              <div className={`relative w-16 h-16 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                item.has_pulsating_ring
                  ? 'bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 animate-pulse'
                  : 'border border-gray-200 dark:border-gray-700'
              }`}>
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white dark:border-gray-900">
                  <img
                    src={item.author_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.author_name}`}
                    alt={item.author_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* ShowCase Music / Video Indicator */}
                {item.now_listening && (
                  <div title={`Listening to ${item.now_listening.title}`} className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center border-2 border-white dark:border-gray-900">
                    <Music className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>

              <span className="text-[11px] font-medium mt-1 text-gray-800 dark:text-gray-200 truncate w-16 text-center">
              @{item.author_name}
              </span>
            </div>
          )))}
      </div>

      {/* Disappearing Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-sm aspect-[9/16] bg-gray-950 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col justify-between p-4">
            {/* Top Bar with 48h TTL & Close */}
            <div className="flex items-center justify-between text-white text-xs z-20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-400">
                  <img src={activeStory.author_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeStory.author_name}`} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold">@{activeStory.author_name}</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Disappears in {Math.round(activeStory.hours_remaining || 48)}h</p>
                </div>
              </div>
              <button onClick={() => setActiveStory(null)} className="w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Display */}
            <div className="relative w-full h-full my-3 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activeStory.cards?.[0]?.media_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-emerald-400" /> End-to-End Encrypted (256-bit)
              </div>
            </div>

            {/* ShowCase Activity Pill */}
            {activeStory.now_listening && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 text-white text-xs flex items-center justify-between mb-2">
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
                placeholder="Reply to Mii..."
                className="flex-1 px-3 py-2 text-xs rounded-full bg-white/20 text-white placeholder:text-slate-500 border border-white/20 focus:outline-none"
              />
              <button className="px-3 py-2 bg-emerald-500 rounded-full text-white text-xs font-bold">
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
    has_pulsating_ring: true,
    hours_remaining: 36,
    now_listening: {
      title: 'City Boys',
      artist: 'Burna Boy',
      source: 'BeatwaveNG'
    }
  },
  {
    status_id: 'm2',
    author_id: '11',
    author_name: 'ngozi_dance',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    has_pulsating_ring: true,
    hours_remaining: 42,
    now_watching: {
      title: 'Afrobeats Showcase Live',
      source: 'Dancia-4Tv'
    }
  }
];

export default MiiStoriesBar;
