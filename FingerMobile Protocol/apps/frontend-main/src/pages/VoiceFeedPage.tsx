import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { 
  Mic, Play, Pause, Heart, MessageSquare, Volume2, 
  Share2, TrendingUp, Sparkles, Filter, Clock
} from 'lucide-react';

interface VoicePost {
  id: string;
  author_id: string;
  title: string;
  audio_url: string;
  duration_seconds: number;
  category: string;
  tags: string[];
  created_at: string;
  author_username: string;
  author_avatar?: string;
  likes_count: number | string;
  comments_count: number | string;
  plays_count: number | string;
}

const VoiceFeedPage: React.FC = () => {
  const [posts, setPosts] = useState<VoicePost[]>([]);
  const [trending, setTrending] = useState<VoicePost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVoiceFeed = async () => {
      try {
        setLoading(true);
        const [postsRes, trendRes] = await Promise.all([
          fetch(`/api/voicefeed/posts${activeCategory !== 'all' ? `?category=${activeCategory}` : ''}`),
          fetch('/api/voicefeed/trending')
        ]);
        const postsData = await postsRes.json();
        const trendData = await trendRes.json();
        
        if (postsData.success && Array.isArray(postsData.data)) {
          setPosts(postsData.data);
        }
        if (trendData.success && Array.isArray(trendData.data)) {
          setTrending(trendData.data);
        }
      } catch {
        // Fallback handled gracefully
      } finally {
        setLoading(false);
      }
    };

    fetchVoiceFeed();
  }, [activeCategory]);

  const togglePlay = (id: string) => {
    setCurrentlyPlayingId(prev => prev === id ? null : id);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes_count: (Number(p.likes_count) || 0) + 1 } : p));
  };

  const handleComment = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, comments_count: (Number(p.comments_count) || 0) + 1 } : p));
  };

  const handleShare = async (id: string) => {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(`${window.location.origin}/voice-feed#${id}`);
      alert('Voice clip link copied to clipboard!');
    }
  };

  const categories = [
    { id: 'all', label: 'All Audio Clips' },
    { id: 'inspiration', label: 'Inspiration' },
    { id: 'music', label: 'Music & Stems' },
    { id: 'education', label: 'Education' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'tech', label: 'Tech & Protocols' }
  ];

  return (
    <MainLayout pageTitle="VoiceFeed - Sovereign Audio Hub">
      <div className="max-w-[1536px] 2xl:max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-cyan-800 to-indigo-900 p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-teal-200">
              <Mic className="w-4 h-4 text-teal-300 animate-pulse" />
              FingerMobile Sovereign Audio Feed
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              VoiceFeed Audio Hub
            </h1>
            <p className="text-sm sm:text-base text-slate-100 max-w-2xl font-medium leading-relaxed">
              Experience unfiltered, decentralized audio thoughts, musical stems, and master commentary directly from verified sovereign creators across Africa and beyond.
            </p>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-slate-300">
          <Filter className="w-4 h-4 text-slate-700 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Feed & Trending Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-teal-600" />
                Latest Voice Dispatches
              </h2>
              <span className="text-xs font-bold text-slate-700">
                {posts.length} clips available
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-300">
                <p className="text-sm font-bold text-slate-700">Loading sovereign voice stream...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-300">
                <p className="text-sm font-bold text-slate-700">No voice clips found in this category.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div 
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                        {post.author_username ? post.author_username.slice(0, 2).toUpperCase() : 'FM'}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {post.author_username || 'Sovereign Creator'}
                        </h3>
                        <p className="text-xs text-slate-700">
                          {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-400">
                      {post.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {post.title}
                    </h4>
                  </div>

                  {/* Audio Player Bar */}
                  <div className="bg-slate-100 rounded-xl p-4 flex items-center gap-4 border border-slate-200">
                    <button type="button" aria-label="Pause"
                      onClick={() => togglePlay(post.id)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow ${
                        currentlyPlayingId === post.id
                          ? 'bg-rose-600 text-white'
                          : 'bg-teal-700 hover:bg-teal-800 text-white'
                      }`}
                    >
                      {currentlyPlayingId === post.id ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Waveform graphic simulator */}
                    <div className="flex-1 flex items-center gap-1 h-8">
                      {Array.from({ length: 32 }).map((_, idx) => {
                        const heights = [12, 24, 18, 28, 14, 20, 32, 16, 26, 10, 22, 30];
                        const h = heights[idx % heights.length];
                        const isPlayed = currentlyPlayingId === post.id && idx < 14;
                        return (
                          <div
                            key={idx}
                            style={{ height: `${h}px` }}
                            className={`flex-1 rounded-full transition-all ${
                              isPlayed ? 'bg-teal-600' : 'bg-slate-300'
                            }`}
                          />
                        );
                      })}
                    </div>

                    <div className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(post.duration_seconds || 0)}
                    </div>
                  </div>

                  {/* Actions & Stats */}
                  <div className="flex items-center justify-between pt-2 text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-6">
                      <button
                        type="button"
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1.5 hover:text-rose-600 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        {post.likes_count} Likes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleComment(post.id)}
                        className="flex items-center gap-1.5 hover:text-teal-600 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {post.comments_count} Comments
                      </button>
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Volume2 className="w-4 h-4" />
                        {post.plays_count} Plays
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleShare(post.id)}
                      className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Trending & Recommendations Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-300 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                Trending Audio Clips
              </h3>
              <div className="divide-y divide-slate-200">
                {trending.slice(0, 4).map((trendItem, idx) => (
                  <div key={trendItem.id} className="py-3 flex items-start gap-3">
                    <span className="text-sm font-black text-slate-400 w-5">
                      0{idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {trendItem.title}
                      </h4>
                      <p className="text-[11px] text-slate-700">
                        by {trendItem.author_username || 'Creator'} • {trendItem.plays_count} plays
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-indigo-50 rounded-3xl border border-teal-200 p-6 space-y-3">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-teal-700" />
                Audio Creator Studio
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                Record your voice notes or upload lossless audio up to 5 minutes. Distribute across FingerMobile and earn Gems when listeners engage!
              </p>
              <button
                type="button"
                aria-label="Publish audio clip in creator studio"
                onClick={() => window.location.assign('/voice-feed/create')}
                className="w-full py-2.5 px-4 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4" />
                Publish Audio Clip
              </button>
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default VoiceFeedPage;
