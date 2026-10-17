import React, { useState, useEffect } from 'react';
import { Film, Play, Heart, MessageSquare, Sparkles, Clock, Gift } from 'lucide-react';
import SendFicModal from './SendFicModal';

export interface PubliciteeItem {
  id: string;
  author_id: string;
  author_username?: string;
  author_avatar?: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  category: 'short_film' | 'vlog' | 'skit';
  file_size_bytes: number;
  duration_seconds: number;
  card_count: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  expires_at: string;
  hours_remaining?: number;
}

interface PubliciteeSectionProps {
  placement?: string;
  category?: 'all' | 'short_film' | 'vlog' | 'skit';
  onOpenCreate?: () => void;
  className?: string;
}

export const PubliciteeSection: React.FC<PubliciteeSectionProps> = ({
  placement = 'newsfeed_section',
  category,
  onOpenCreate,
  className = ''
}) => {
  const [items, setItems] = useState<PubliciteeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');
  const [activeVideo, setActiveVideo] = useState<PubliciteeItem | null>(null);
  const [showTipModal, setShowTipModal] = useState(false);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  useEffect(() => {
    fetchPublicitee();
  }, [selectedCategory, placement]);

  const fetchPublicitee = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (placement) queryParams.append('placement', placement);
      if (selectedCategory !== 'all') queryParams.append('category', selectedCategory);

      const response = await fetch(`/api/publicitee/feed?${queryParams.toString()}`);
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setItems(result.data);
      } else {
        setItems(fallbackPublicitee);
      }
    } catch {
      setItems(fallbackPublicitee);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`bg-gradient-to-r from-orange-50/50 via-amber-50/30 to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-orange-200/60 dark:border-gray-700/80 rounded-2xl p-5 shadow-sm ${className}`}>
      {/* Header with 168h TTL badge */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Publicitee</h2>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-orange-100 text-orange-950 dark:bg-orange-950/80 dark:text-orange-300 px-2 py-0.5 rounded-full border border-orange-400 dark:border-orange-800 flex items-center gap-1 font-black">
                <Clock className="w-3 h-3" /> 168h TTL (7 Days)
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Reels for Short Film & Movie Makers, Vloggers and Skit Creators</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenCreate && (
            <button
              onClick={onOpenCreate}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> + Create Publicitee
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Reels' },
          { id: 'short_film', label: 'Short Films' },
          { id: 'vlog', label: 'Vlogs' },
          { id: 'skit', label: 'Skits & Comedy' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-[9/16] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
          No active Publicitee reels found in this section.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveVideo(item)}
              className="group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 bg-black"
            >
              {/* Thumbnail or Video Background */}
              <img
                src={item.thumbnail_url || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&auto=format&fit=crop&q=80'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />

              {/* Top Gradient Badge Overlay */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] text-white">
                <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-white/20">
                  {item.category.replace('_', ' ')}
                </span>
                <span className="bg-orange-600/90 backdrop-blur-md px-1.5 py-0.5 rounded font-mono font-medium">
                  {Math.round(item.hours_remaining || 168)}h left
                </span>
              </div>

              {/* Bottom Metadata Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 text-white flex flex-col justify-end">
                <h3 className="font-semibold text-xs leading-snug line-clamp-2 drop-shadow-sm mb-1">{item.title}</h3>
                <div className="flex items-center justify-between text-[11px] text-gray-300">
                  <span>@{item.author_username || 'creator'}</span>
                  <span>{formatDuration(item.duration_seconds)}</span>
                </div>
                <div className="flex items-center space-x-3 mt-2 text-[10px] text-gray-300 border-t border-white/10 pt-1.5">
                  <span className="flex items-center gap-1"><Play className="w-3 h-3 text-orange-400" /> {item.view_count || 0}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-400" /> {item.like_count || 0}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-blue-400" /> {item.comment_count || 0}</span>
                </div>
              </div>

              {/* Play Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div className="w-12 h-12 rounded-full bg-orange-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal Preview */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
            >
              ✕
            </button>
            <div className="aspect-[9/16] bg-black flex items-center justify-center">
              <video
                src={activeVideo.video_url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 text-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase font-bold text-orange-400">{activeVideo.category.replace('_', ' ')}</span>
                <span className="text-xs text-gray-400 font-mono">168h TTL Window</span>
              </div>
              <h3 className="text-base font-bold">{activeVideo.title}</h3>
              {activeVideo.description && (
                <p className="text-xs text-gray-300 mt-1">{activeVideo.description}</p>
              )}
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setShowTipModal(true)}
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Gift className="w-4 h-4" /> Tip Creator
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

const fallbackPublicitee: PubliciteeItem[] = [
  {
    id: 'p1',
    author_id: '1',
    author_username: 'lagos_filmmaker',
    title: 'The Hustle in Eko: A 5-Minute Short Film',
    description: 'An intimate look at street life in downtown Lagos.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    category: 'short_film',
    file_size_bytes: 52428800,
    duration_seconds: 320,
    card_count: 1,
    view_count: 1420,
    like_count: 340,
    comment_count: 52,
    share_count: 18,
    expires_at: new Date(Date.now() + 160 * 3600 * 1000).toISOString(),
    hours_remaining: 160
  },
  {
    id: 'p2',
    author_id: '2',
    author_username: 'naija_skits',
    title: 'When Your African Mom Finds Your Report Card',
    description: 'Relatable comedy skit with African parents.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    category: 'skit',
    file_size_bytes: 31457280,
    duration_seconds: 145,
    card_count: 1,
    view_count: 2890,
    like_count: 810,
    comment_count: 120,
    share_count: 95,
    expires_at: new Date(Date.now() + 155 * 3600 * 1000).toISOString(),
    hours_remaining: 155
  }
];

export default PubliciteeSection;
