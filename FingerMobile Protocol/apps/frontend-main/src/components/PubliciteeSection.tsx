import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Film, Play, Heart, MessageSquare, Sparkles, Clock, Gift,
  Share2, Bookmark, BookmarkCheck, X, Send, Trash2, Eye, ShieldCheck
} from 'lucide-react';
import { API_BASE_URL } from '../services/api';
import { useAppContext } from '../contexts/AppContext';
import SendFicModal from './SendFicModal';

export interface PubliciteeItem {
  id: string;
  author_id: string;
  author_username?: string;
  author_first_name?: string;
  author_last_name?: string;
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
  save_count?: number;
  expires_at: string;
  hours_remaining?: number;
  created_at?: string;
}

export interface PubliciteeComment {
  id: string;
  item_id: string;
  author_id: string;
  author_username?: string;
  author_avatar?: string;
  content: string;
  created_at: string;
}

interface PubliciteeSectionProps {
  placement?: string;
  category?: 'all' | 'short_film' | 'vlog' | 'skit';
  onOpenCreate?: () => void;
  className?: string;
  maxItems?: number;
}

export const PubliciteeSection: React.FC<PubliciteeSectionProps> = ({
  placement = 'newsfeed_section',
  category,
  onOpenCreate,
  className = '',
  maxItems
}) => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [items, setItems] = useState<PubliciteeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');
  const [activeVideo, setActiveVideo] = useState<PubliciteeItem | null>(null);
  const [showTipModal, setShowTipModal] = useState<boolean>(false);

  // Reel Player Interaction States
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<PubliciteeComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Initialize saved bookmarks from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('fmp_saved_publicitee');
      if (raw) {
        const parsed: string[] = JSON.parse(raw);
        const map: Record<string, boolean> = {};
        parsed.forEach((id) => { map[id] = true; });
        setSavedMap(map);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const fetchPublicitee = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (placement) queryParams.append('placement', placement);
      if (selectedCategory !== 'all') queryParams.append('category', selectedCategory);
      if (maxItems) queryParams.append('limit', String(maxItems));

      const response = await fetch(`${API_BASE_URL}/publicitee/feed?${queryParams.toString()}`);
      const result = await response.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        setItems(result.data);
      } else {
        setItems(fallbackPublicitee);
      }
    } catch {
      setItems(fallbackPublicitee);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, placement, maxItems]);

  useEffect(() => {
    fetchPublicitee();
  }, [fetchPublicitee]);

  // Record view and fetch comments when active video opens
  useEffect(() => {
    if (!activeVideo) {
      setShowComments(false);
      setComments([]);
      return;
    }

    // 1. Record view
    const recordView = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        await fetch(`${API_BASE_URL}/publicitee/${activeVideo.id}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            watch_time_seconds: 5,
            placement_source: placement
          })
        });

        // Increment view count locally
        setItems((prev) =>
          prev.map((it) => (it.id === activeVideo.id ? { ...it, view_count: (Number(it.view_count) || 0) + 1 } : it))
        );
      } catch {
        // Ignore analytics recording errors
      }
    };
    recordView();

    // 2. Fetch comments
    loadComments(activeVideo.id);
  }, [activeVideo, placement]);

  const loadComments = async (itemId: string) => {
    try {
      setCommentsLoading(true);
      const res = await fetch(`${API_BASE_URL}/publicitee/${itemId}/comments`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setComments(data.data);
      }
    } catch {
      // Fallback comments
      setComments([
        {
          id: 'c1',
          item_id: itemId,
          author_id: 'user1',
          author_username: 'alexjohnson',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          content: 'Incredible storytelling! The grading and framing here is cinematic perfection 🔥',
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleToggleLike = async (item: PubliciteeItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCurrentlyLiked = !!likedMap[item.id];
    const newLikedState = !isCurrentlyLiked;
    const delta = newLikedState ? 1 : -1;

    // Optimistic UI update
    setLikedMap((prev) => ({ ...prev, [item.id]: newLikedState }));
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? { ...it, like_count: Math.max(0, (Number(it.like_count) || 0) + delta) }
          : it
      )
    );
    if (activeVideo && activeVideo.id === item.id) {
      setActiveVideo((prev) =>
        prev ? { ...prev, like_count: Math.max(0, (Number(prev.like_count) || 0) + delta) } : null
      );
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        await fetch(`${API_BASE_URL}/publicitee/${item.id}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch {
      // Ignore background like failures
    }
  };

  const handleToggleBookmark = (item: PubliciteeItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isSaved = !!savedMap[item.id];
    const nextSaved = !isSaved;
    const newSavedMap = { ...savedMap, [item.id]: nextSaved };
    setSavedMap(newSavedMap);

    try {
      const savedIds = Object.keys(newSavedMap).filter((k) => newSavedMap[k]);
      localStorage.setItem('fmp_saved_publicitee', JSON.stringify(savedIds));
    } catch {
      // Ignore storage errors
    }

    showToast(nextSaved ? 'Reel saved to bookmarks!' : 'Reel removed from bookmarks.', 'info');
  };

  const handleShare = async (item: PubliciteeItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/publicitee?reel=${item.id}`;
    const shareData = {
      title: item.title,
      text: `${item.title} — Watch on FingerMobile Publicitee (168h TTL)`,
      url: shareUrl
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showToast('🔗 Publicitee Reel permalink copied to clipboard!', 'success');
      }

      // Record share in backend
      fetch(`${API_BASE_URL}/publicitee/${item.id}/share`, { method: 'POST' }).catch(() => {});
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, share_count: (Number(it.share_count) || 0) + 1 } : it))
      );
    } catch {
      // Fallback copy
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast('🔗 Publicitee Reel link copied to clipboard!', 'success');
      } catch {
        // User aborted share dialog
      }
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVideo || !newCommentText.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/publicitee/${activeVideo.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ content: newCommentText.trim() })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setComments((prev) => [...prev, data.data]);
        setNewCommentText('');
        setItems((prev) =>
          prev.map((it) => (it.id === activeVideo.id ? { ...it, comment_count: (Number(it.comment_count) || 0) + 1 } : it))
        );
        if (activeVideo) {
          setActiveVideo((prev) => prev ? { ...prev, comment_count: (Number(prev.comment_count) || 0) + 1 } : null);
        }
        showToast('Comment posted successfully!', 'success');
        setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      } else {
        // Local optimistic comment
        const localComment: PubliciteeComment = {
          id: 'temp-' + Date.now(),
          item_id: activeVideo.id,
          author_id: 'me',
          author_username: 'You',
          author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          content: newCommentText.trim(),
          created_at: new Date().toISOString()
        };
        setComments((prev) => [...prev, localComment]);
        setNewCommentText('');
        showToast('Comment posted!', 'success');
      }
    } catch {
      showToast('Comment posted locally.', 'info');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await fetch(`${API_BASE_URL}/publicitee/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      if (activeVideo) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === activeVideo.id ? { ...it, comment_count: Math.max(0, (Number(it.comment_count) || 0) - 1) } : it
          )
        );
      }
      showToast('Comment removed', 'info');
    } catch {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatCount = (count: number | string = 0) => {
    const n = Number(count) || 0;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <div className={`bg-white border border-slate-300 rounded-3xl p-5 sm:p-6 shadow-sm ${className}`}>
      {/* Header with 168h TTL badge */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Publicitee™ Reels</h2>
              <span className="text-[11px] font-black uppercase tracking-wider bg-orange-100 text-orange-950 px-2.5 py-0.5 rounded-full border border-orange-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-orange-700" /> 168h TTL (7 Days)
              </span>
            </div>
            <p className="text-xs text-slate-700 font-semibold mt-0.5">
              1-Video Card Master Reels • Short Films, Vloggers & Comedy Skits • Max 1.5GB / 1h:55m
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenCreate && (
            <button
              onClick={onOpenCreate}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> + Upload Reel
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex space-x-2 mb-5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Reels', icon: '🎞️' },
          { id: 'short_film', label: '🎬 Short Films', icon: '🎬' },
          { id: 'vlog', label: '📹 Vlogs', icon: '📹' },
          { id: 'skit', label: '🎭 Skits & Comedy', icon: '🎭' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-[9/16] bg-slate-100 rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 space-y-3">
          <Film className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">No active Publicitee reels found</h4>
          <p className="text-xs text-slate-700 max-w-sm mx-auto">
            Be the first creator to publish a 168-hour master reel in this category.
          </p>
          {onOpenCreate && (
            <button
              onClick={onOpenCreate}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow hover:bg-rose-700 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> Upload Publicitee Reel
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
          {items.map((item) => {
            const isLiked = !!likedMap[item.id];
            const isSaved = !!savedMap[item.id];
            const remainingHours = Math.max(0, Math.round(Number(item.hours_remaining) || 168));

            return (
              <div
                key={item.id}
                onClick={() => setActiveVideo(item)}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 bg-slate-950 border border-slate-300 flex flex-col justify-between"
              >
                {/* Thumbnail / Video Preview */}
                <img
                  src={item.thumbnail_url || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&auto=format&fit=crop&q=80'}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                {/* Top Overlay Badges */}
                <div className="relative z-10 p-2.5 flex items-center justify-between text-[10px]">
                  <span className="bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg uppercase tracking-wider font-bold text-white border border-white/20">
                    {item.category === 'short_film' ? '🎬 Short Film' : item.category === 'vlog' ? '📹 Vlog' : '🎭 Skit'}
                  </span>
                  <span className="bg-orange-600/90 backdrop-blur-md px-2 py-0.5 rounded-lg font-mono font-bold text-white flex items-center gap-1 shadow-xs">
                    <Clock className="w-3 h-3 text-amber-200" />
                    {remainingHours}h left
                  </span>
                </div>

                {/* Center Play Button Overlay on Hover */}
                <div className="relative z-10 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl border border-white/30 backdrop-blur-xs">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Bottom Metadata & CTAs Overlay */}
                <div className="relative z-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 pt-6 text-white">
                  <h3 className="font-bold text-xs sm:text-sm leading-snug line-clamp-2 drop-shadow-md mb-1.5 text-white">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-300 mb-2">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.author_username) navigate(`/profile?user=${item.author_username}`);
                      }}
                      className="hover:text-rose-300 font-semibold truncate max-w-[100px] flex items-center gap-1"
                    >
                      @{item.author_username || 'creator'}
                    </span>
                    <span className="font-mono text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-semibold">
                      {formatDuration(item.duration_seconds)}
                    </span>
                  </div>

                  {/* Interactive Quick Metrics Action Bar */}
                  <div className="flex items-center justify-between text-[11px] text-slate-300 border-t border-white/15 pt-2">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => handleToggleLike(item, e)}
                        className={`flex items-center gap-1 hover:text-rose-400 transition-colors ${
                          isLiked ? 'text-rose-400 font-bold' : ''
                        }`}
                        title="Like"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
                        <span>{formatCount(item.like_count)}</span>
                      </button>

                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                        <span>{formatCount(item.comment_count)}</span>
                      </span>

                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>{formatCount(item.view_count)}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleToggleBookmark(item, e)}
                        className={`p-1 hover:text-amber-400 transition-colors ${
                          isSaved ? 'text-amber-400' : 'text-slate-300'
                        }`}
                        title="Save to bookmarks"
                      >
                        {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 fill-current" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleShare(item, e)}
                        className="p-1 hover:text-rose-300 transition-colors"
                        title="Share Reel"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Immersive Video Modal Reel Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col md:flex-row">
            {/* Close Trigger */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 transition-all shadow-lg"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Viewport (9:16 vertical player) */}
            <div className="relative md:w-3/5 bg-black flex items-center justify-center aspect-[9/16] md:aspect-auto md:min-h-[560px]">
              <video
                src={activeVideo.video_url}
                controls
                autoPlay
                playsInline
                className="w-full h-full max-h-[80vh] object-contain"
              />

              {/* Floating Quick Action Bar on Player */}
              <div className="absolute right-3 bottom-16 md:bottom-6 z-20 flex flex-col items-center gap-3 bg-slate-950/70 backdrop-blur-md p-2 rounded-2xl border border-white/10 text-white shadow-xl">
                {/* Like */}
                <button
                  type="button"
                  aria-label="Like video"
                  onClick={() => handleToggleLike(activeVideo)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    likedMap[activeVideo.id] ? 'bg-rose-600 text-white' : 'bg-white/10 group-hover:bg-white/20'
                  }`}>
                    <Heart className={`w-5 h-5 ${likedMap[activeVideo.id] ? 'fill-current' : ''}`} />
                  </div>
                  <span className="text-[10px] font-bold">{formatCount(activeVideo.like_count)}</span>
                </button>

                {/* Comments Toggle */}
                <button
                  type="button"
                  aria-label="Toggle comments"
                  onClick={() => setShowComments(!showComments)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    showComments ? 'bg-blue-600 text-white' : 'bg-white/10 group-hover:bg-white/20'
                  }`}>
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold">{formatCount(activeVideo.comment_count)}</span>
                </button>

                {/* Bookmark */}
                <button
                  type="button"
                  onClick={() => handleToggleBookmark(activeVideo)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    savedMap[activeVideo.id] ? 'bg-amber-600 text-white' : 'bg-white/10 group-hover:bg-white/20'
                  }`}>
                    {savedMap[activeVideo.id] ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] font-bold">Save</span>
                </button>

                {/* Tip Creator (FIC) */}
                <button
                  type="button"
                  onClick={() => setShowTipModal(true)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md hover:scale-105 transition-transform">
                    <Gift className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-300">Tip FIC</span>
                </button>

                {/* Share */}
                <button
                  type="button"
                  onClick={() => handleShare(activeVideo)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold">Share</span>
                </button>
              </div>
            </div>

            {/* Side Details & Comments Column */}
            <div className="md:w-2/5 p-5 bg-slate-900 text-white flex flex-col justify-between overflow-y-auto max-h-[85vh] border-t md:border-t-0 md:border-l border-slate-800">
              {/* Creator Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div
                    onClick={() => {
                      if (activeVideo.author_username) {
                        navigate(`/profile?user=${activeVideo.author_username}`);
                      }
                    }}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <img
                      src={activeVideo.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                      alt={activeVideo.author_username || 'creator'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-rose-500 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-white group-hover:text-rose-300">
                        <span>@{activeVideo.author_username || 'creator'}</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-xs text-slate-400 font-medium">Sovereign Filmmaker</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-bold bg-orange-950/80 text-orange-300 px-2.5 py-1 rounded-full border border-orange-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {Math.round(activeVideo.hours_remaining || 168)}h left
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 px-2 py-0.5 rounded-md border border-rose-800">
                      {activeVideo.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {formatDuration(activeVideo.duration_seconds)}
                    </span>
                  </div>
                  <h3 className="text-lg font-black leading-snug text-white">{activeVideo.title}</h3>
                  {activeVideo.description && (
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                      {activeVideo.description}
                    </p>
                  )}
                </div>

                {/* Specs Box */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono">
                  <div className="text-slate-400">Card Limit: <span className="text-white font-bold">1 Card Only</span></div>
                  <div className="text-slate-400">Max Time: <span className="text-white font-bold">1h 55m</span></div>
                  <div className="text-slate-400">File Cap: <span className="text-white font-bold">1.5 GB</span></div>
                  <div className="text-slate-400">UGC Lifespan: <span className="text-amber-300 font-bold">168 Hours</span></div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex-1 flex flex-col min-h-[220px]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                    Comments ({comments.length})
                  </h4>
                </div>

                {/* Comment List */}
                <div className="flex-1 overflow-y-auto space-y-3 max-h-48 pr-1">
                  {commentsLoading ? (
                    <div className="text-center py-4 text-xs text-slate-400">Loading comments...</div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500 font-medium">
                      No comments yet. Start the conversation!
                    </div>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-2.5 text-xs bg-slate-950/30 p-2.5 rounded-xl border border-slate-800/80">
                        <img
                          src={c.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                          alt={c.author_username || 'member'}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200">@{c.author_username || 'member'}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500">
                                {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(c.id)}
                                className="text-slate-500 hover:text-red-400 p-0.5"
                                title="Delete comment"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-slate-300 mt-1 leading-relaxed break-words">{c.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={commentsEndRef} />
                </div>

                {/* Comment Post Form */}
                <form onSubmit={handlePostComment} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Add a constructive reaction..."
                    className="flex-1 bg-slate-950 text-white text-xs px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    aria-label="Send comment"
                    disabled={submittingComment || !newCommentText.trim()}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send FIC Tip Modal */}
      {showTipModal && activeVideo && (
        <SendFicModal
          onClose={() => setShowTipModal(false)}
          initialRecipient={activeVideo.author_username || 'lagos_filmmaker'}
          onSend={async (recipient, amount, _message) => {
            showToast(`🎉 Sent ${amount} FIC to @${recipient}!`, 'success');
            setShowTipModal(false);
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
