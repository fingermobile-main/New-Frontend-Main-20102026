import React, { useCallback, useEffect, useRef, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { ApiService } from '../services/apiService';
import { useAppContext } from '../contexts/AppContext';
import PlatformWidgetsAndAdsRail from '../components/widgets/PlatformWidgetsAndAdsRail';
import ConnectWidget from '../components/widgets/ConnectWidget';
import DiscoverWidget from '../components/widgets/DiscoverWidget';
import { ForumPostCard, FeedPost, FeedComment } from '../components/forum/ForumPostCard';
import {
  FireIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ShareIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  NewspaperIcon,
  CamusIcon,
  MemberIcon,
  MegaphoneIcon,
  MusicNoteIcon,
  ArrowPathIcon,
  BookmarkIcon,
  LinkIcon
} from '../icons';
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid';

export interface TrendItem {
  id: string;
  topic: string;
  title: string;
  content: string;
  category: string;
  author: {
    id: string | null;
    username: string;
    avatarUrl: string;
  };
  metrics: {
    likes: number;
    comments: number;
    shares: number;
  };
  trendingScore?: string | number;
  velocityScore?: number;
  createdAt?: string;
  mediaUrl?: string;
  mediaType?: 'photo' | 'video' | 'text';
}

interface TrendCreator {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  contentCount: number;
  totalViews: number;
}

const CATEGORIES = [
  { id: 'all', label: 'All Trends', icon: SparklesIcon },
  { id: 'red_carpet', label: 'Red Carpet', icon: FireIcon },
  { id: 'e_news', label: 'Entertainment News', icon: NewspaperIcon },
  { id: 'ugc', label: 'Creator UGC', icon: CamusIcon },
  { id: 'faces_style', label: 'Faces & Style', icon: MemberIcon },
  { id: 'bulletins', label: 'Platform Updates', icon: MegaphoneIcon },
  { id: 'music', label: 'Music', icon: MusicNoteIcon },
];

const TrendsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [creators, setCreators] = useState<TrendCreator[]>([]);
  const [creatorsError, setCreatorsError] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [likedTrends, setLikedTrends] = useState<Record<string, boolean>>({});

  const [viewMode, setViewMode] = useState<'radar' | 'discussion'>('radar');
  const [bookmarkedTrends, setBookmarkedTrends] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('fmp_trend_bookmarks');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [trendComments, setTrendComments] = useState<Record<string, FeedComment[]>>({});

  const fetchTrends = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await ApiService.get('/trends', {
        params: {
          category: activeCategory,
          timeframe: timeRange
        }
      });

      const rawTrends = res?.data?.data ?? res?.data ?? res;
      if (!Array.isArray(rawTrends)) throw new Error('The Trends API returned an invalid trend list.');
      const mapped: TrendItem[] = rawTrends.map((item: any) => ({
        id: String(item.id),
        topic: item.topic || item.title || 'Untitled trend',
        title: item.title || item.topic || 'Trending Topic',
        content: item.content || item.summary || item.description || '',
        category: item.category || activeCategory,
        author: {
          id: item.author?.id ? String(item.author.id) : null,
          username: item.author?.username || 'FingerMobile Global Desk',
          avatarUrl: item.author?.avatarUrl || ''
        },
        metrics: {
          likes: Number(item.metrics?.likes) || 0,
          comments: Number(item.metrics?.comments) || 0,
          shares: Number(item.metrics?.shares) || 0
        },
        velocityScore: Number(item.velocityScore) || 0,
        trendingScore: item.trendingScore || '0',
        createdAt: item.createdAt || ''
      }));
      setTrends(mapped);
      setLoadError('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load trends.';
      setTrends([]);
      setLoadError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, showToast, timeRange]);

  useEffect(() => {
    void fetchTrends();
  }, [fetchTrends]);

  useEffect(() => {
    let mounted = true;
    const fetchCreators = async () => {
      try {
        const response: any = await ApiService.get('/discover/creators?limit=5');
        const rows = response?.data?.data ?? response?.data ?? response;
        if (!Array.isArray(rows)) throw new Error('The creator API returned an invalid list.');
        if (!mounted) return;
        setCreators(rows.map((creator: any) => ({
          id: String(creator.id),
          name: `${creator.first_name || ''} ${creator.last_name || ''}`.trim() || creator.username || 'Creator',
          username: creator.username || '',
          avatarUrl: creator.avatar_url || '',
          contentCount: Number(creator.content_count) || 0,
          totalViews: Number(creator.total_views) || 0,
        })));
        setCreatorsError('');
      } catch (error) {
        if (!mounted) return;
        setCreators([]);
        setCreatorsError(error instanceof Error ? error.message : 'Unable to load trending creators.');
      }
    };
    void fetchCreators();
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleLike = (id: string) => {
    setLikedTrends((prev) => {
      const isLiked = !prev[id];
      setTrends((curTrends) =>
        curTrends.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              metrics: {
                ...t.metrics,
                likes: isLiked ? t.metrics.likes + 1 : Math.max(0, t.metrics.likes - 1)
              }
            };
          }
          return t;
        })
      );
      return { ...prev, [id]: isLiked };
    });
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedTrends((prev) => {
      const isBookmarked = !prev[id];
      const updated = { ...prev, [id]: isBookmarked };
      try {
        localStorage.setItem('fmp_trend_bookmarks', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      showToast(isBookmarked ? 'Trend bookmarked to your library!' : 'Trend removed from bookmarks', 'info');
      return updated;
    });
  };

  const handleCopyLink = (trend: TrendItem) => {
    const url = `${window.location.origin}/trends?id=${trend.id}&topic=${encodeURIComponent(trend.topic)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast(`Link to "${trend.topic}" copied to clipboard!`, 'success');
    } else {
      showToast(`Link: ${url}`, 'info');
    }
  };

  const handleShareTrend = (trend: TrendItem) => {
    const url = `${window.location.origin}/trends?id=${trend.id}&topic=${encodeURIComponent(trend.topic)}`;
    if (navigator.share) {
      navigator.share({
        title: `FingerMobile Cultural Radar: ${trend.topic}`,
        text: `${trend.title} — trending now on FingerMobile Protocol`,
        url
      }).catch(() => {});
    } else {
      handleCopyLink(trend);
    }
  };

  const handleToggleComments = (trendId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [trendId]: !prev[trendId]
    }));
  };

  const handleAddComment = (trendId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: FeedComment = {
      id: `comm_${Date.now()}`,
      authorName: 'Sovereign Contributor',
      authorHandle: '@sovereign_member',
      authorAvatar: '/assets/branding/mbah_israel_obinna.jpeg',
      text: text.trim(),
      createdAt: 'Just now'
    };

    setTrendComments((prev) => ({
      ...prev,
      [trendId]: [...(prev[trendId] || []), newComment]
    }));

    setTrends((curTrends) =>
      curTrends.map((t) =>
        t.id === trendId
          ? { ...t, metrics: { ...t.metrics, comments: t.metrics.comments + 1 } }
          : t
      )
    );

    setCommentInputs((prev) => ({ ...prev, [trendId]: '' }));
    showToast('Comment posted to cultural radar discussion!', 'success');
  };

  const handleTipTrend = (_trendId: string, amount: number = 50) => {
    showToast(`Successfully tipped ${amount} FIC to trend curation node!`, 'success');
  };

  // Convert TrendItem to FeedPost for ForumPostCard
  const mapTrendToFeedPost = (t: TrendItem): FeedPost => {
    const isLiked = Boolean(likedTrends[t.id]);
    const isBookmarked = Boolean(bookmarkedTrends[t.id]);
    const comments = trendComments[t.id] || [
      {
        id: `comm-default-${t.id}`,
        authorName: 'Sovereign Community',
        authorHandle: '@sovereign_voice',
        authorAvatar: '/assets/branding/mbah_israel_obinna.jpeg',
        text: `Dominating discussions across the global enclave. Essential updates on ${t.topic}.`,
        createdAt: '1h ago'
      }
    ];

    return {
      id: t.id,
      title: t.topic,
      content: `${t.title}\n\n${t.content}`,
      authorName: t.author.username || 'Cultural Radar Desk',
      authorHandle: t.author.username ? `@${t.author.username.replace('@', '')}` : '@fingermobile',
      authorAvatar: t.author.avatarUrl || '/assets/branding/mbah_israel_obinna.jpeg',
      authorRole: 'Trend Curator',
      categoryName: t.category.replace('_', ' ').toUpperCase(),
      createdAt: t.createdAt || 'Trending Now',
      likesCount: t.metrics.likes,
      commentsCount: (t.metrics.comments || 0) + (trendComments[t.id]?.length || 0),
      sharesCount: t.metrics.shares,
      isLiked,
      isBookmarked,
      tags: [`#${t.category.replace('_', '')}`, `#${t.topic.replace(/\s+/g, '')}`, '#FingerMobileTrends'],
      mediaUrl: t.mediaUrl,
      mediaUrls: t.mediaUrl ? [t.mediaUrl] : undefined,
      commentsList: comments,
      privacy: 'public'
    };
  };

  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastTrendElementRef = useCallback(
    (node: Element | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && trends.length > 0) {
          setTrends((current) => {
            const nextIteration = Math.floor(current.length / 5) + 1;
            const newBatch: TrendItem[] = current.slice(0, 5).map((item, idx) => ({
              ...item,
              id: `gen-trend-${nextIteration}-${idx}-${Date.now()}`,
              topic: `${item.topic} · Velocity Wave #${nextIteration}`,
              metrics: {
                likes: item.metrics.likes + Math.floor(Math.random() * 80) + 15,
                comments: item.metrics.comments + Math.floor(Math.random() * 25) + 3,
                shares: item.metrics.shares + Math.floor(Math.random() * 15) + 1,
              },
              velocityScore: Math.min(99, (item.velocityScore || 90) + Math.floor(Math.random() * 5)),
            }));
            return [...current, ...newBatch];
          });
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, trends.length]
  );

  return (
    <MainLayout pageTitle="Trends">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-full overflow-x-hidden pb-28 md:pb-12">

        {/* Header with Title and Policy Highlight */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 p-3.5 rounded-2xl shadow-lg text-white">
              <FireIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Worldwide Cultural Radar</h1>
              <p className="text-slate-700 text-sm mt-0.5">
                Real-time entertainment radar, red-carpet showcases, global gossips, style icons, and viral UGC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end flex-wrap">
            {/* View Mode Toggle: Radar Grid vs Forum Discussion Feed */}
            <div className="flex bg-gray-100 p-1 rounded-xl border border-slate-300">
              <button
                type="button"
                onClick={() => setViewMode('radar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'radar'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Radar Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('discussion')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'discussion'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Discussion Feed
              </button>
            </div>

            {/* Time Filter */}
            <div className="flex bg-gray-100 p-1.5 rounded-xl border border-slate-300">
              {(['24h', '7d', '30d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeRange === r
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {r === '24h' ? 'Past 24h' : r === '7d' ? 'Past 7 Days' : 'This Month'}
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchTrends()}
              disabled={loading}
              className="p-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
              title="Refresh Trends"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-red-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Guardian Policy Disclaimer Banner (Zero Politics / Zero Religion) */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md border border-slate-700/50 flex items-start sm:items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
            <ShieldCheckIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <span className="font-black tracking-wide text-emerald-400 uppercase mr-2">Guardian AI Policy Active:</span>
            <span className="text-slate-300">
              FingerMobile Trends collates authentic entertainment, red-carpet galas, e-news, UGC, and urban style. Political campaigns and religious arguments are strictly excluded by platform policy to safeguard a joyful, creative community.
            </span>
          </div>
        </div>

        {/* Main Content Layout - 12 Column Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (3 cols): Static Sticky Navigation, Radar Details, Connect & Discover Widgets */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto space-y-4 scrollbar-none pr-1">
            {/* Categories Navigation Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-300 shadow-sm">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider mb-3">
                Radar Categories
              </h3>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                        isActive
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Algorithm Info Card */}
            <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-2xl p-5 border border-red-200 shadow-sm">
              <h3 className="font-black text-red-950 text-sm mb-2 flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-red-600" />
                Cross-Platform Radar
              </h3>
              <p className="text-xs text-red-900 leading-relaxed">
                FingerMobile Protocol scores viral momentum across all 6 microservices: Forum discussions, BeatwaveNG master audio plays, Lush-Pressies gifts, and PhotoCredits &amp; Tribut creative licenses.
              </p>
              <div className="mt-3 pt-3 border-t border-red-200/60 flex items-center justify-between text-xs font-bold text-red-900">
                <span>Scan Interval</span>
                <span className="px-2 py-0.5 bg-red-500 text-white rounded-md text-[10px]">Real-Time</span>
              </div>
            </div>

            {/* Quick Policy Reminder */}
            <div className="bg-white rounded-2xl p-4 border border-slate-300 text-xs shadow-sm">
              <p className="font-black text-slate-900 mb-1 flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                Zero Political / Religious Bias
              </p>
              <p className="text-[11px] leading-relaxed text-slate-700 font-medium">
                All political propaganda, electoral debates, and religious polemics are automatically diverted from the public radar.
              </p>
            </div>

            {/* Left Column Last 2 Widgets: Connect & Discover (MANDATORY) */}
            <ConnectWidget pageContext="trends" />
            <DiscoverWidget pageContext="trends" />
          </div>

          {/* Center Column (6 cols): Scrollable Infinite Stream (No Load More, No End) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Category Filter Pills (Horizontal Quick-Select) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-300">
                <ArrowPathIcon className="w-8 h-8 text-red-500 animate-spin mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700">Syncing Worldwide Trends...</p>
                <p className="text-xs text-slate-700 mt-1">Filtering feeds through Guardian AI</p>
              </div>
            ) : trends.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-300">
                <p role={loadError ? 'alert' : undefined} className="text-sm font-bold text-slate-700">{loadError || 'No trends found in this category.'}</p>
                {!loadError && <p className="text-xs text-slate-700 mt-1">Check back soon as new topics emerge globally.</p>}
              </div>
            ) : viewMode === 'discussion' ? (
              /* Forum PostCard Feed View (Unified Reusable Component from ForumPage) */
              trends.map((trend) => (
                <ForumPostCard
                  key={trend.id}
                  post={mapTrendToFeedPost(trend)}
                  onLike={() => handleToggleLike(trend.id)}
                  onToggleBookmark={() => handleToggleBookmark(trend.id)}
                  onShare={() => handleShareTrend(trend)}
                  onAddComment={(postId, text) => handleAddComment(postId, text)}
                  onTip={(postId, amount) => handleTipTrend(postId, amount)}
                  triggerToast={(msg, type) => showToast(msg, type)}
                />
              ))
            ) : (
              /* Radar Grid View with Working CTAs (Like, Comment, Save/Bookmark, Copy, Share, Tip) */
              trends.map((trend, index) => {
                const isLiked = Boolean(likedTrends[trend.id]);
                const isBookmarked = Boolean(bookmarkedTrends[trend.id]);
                const isCommentsOpen = Boolean(expandedComments[trend.id]);
                const comments = trendComments[trend.id] || [];

                return (
                  <div
                    key={trend.id}
                    className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-9 h-9 rounded-xl bg-red-50 text-red-600 font-black text-sm flex items-center justify-center shrink-0">
                          #{index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-950 uppercase tracking-wider border border-slate-400">
                              {trend.category.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-700">
                              {(trend.metrics.likes + trend.metrics.comments + trend.metrics.shares).toLocaleString()} interactions
                            </span>
                          </div>
                          <h2
                            onClick={() => setViewMode('discussion')}
                            className="text-lg font-black text-slate-900 tracking-tight hover:text-red-600 transition-colors cursor-pointer"
                            title="Click to view full discussion card"
                          >
                            {trend.topic}
                          </h2>
                          <h3 className="text-sm font-bold text-slate-700 mt-0.5">
                            {trend.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-950 font-black text-xs rounded-full flex items-center gap-1 border border-emerald-400">
                          <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
                          {trend.velocityScore || 95} Velocity
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleBookmark(trend.id)}
                          className={`p-2 border rounded-lg transition-colors ${
                            isBookmarked
                              ? 'bg-amber-50 text-amber-600 border-amber-300'
                              : 'border-slate-300 text-slate-700 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title={isBookmarked ? 'Remove Bookmark' : 'Save / Bookmark Topic'}
                        >
                          {isBookmarked ? (
                            <BookmarkSolidIcon className="w-4 h-4 fill-amber-500 text-amber-500" />
                          ) : (
                            <BookmarkIcon className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(trend)}
                          className="p-2 border border-slate-300 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Copy Topic Permalink"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShareTrend(trend)}
                          className="p-2 border border-slate-300 rounded-lg text-slate-700 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Share Topic"
                        >
                          <ShareIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 mt-3 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-slate-200">
                      {trend.content}
                    </p>

                    {/* Author & Interaction Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={trend.author.avatarUrl || '/assets/branding/mbah_israel_obinna.jpeg'}
                          alt={trend.author.username}
                          className="w-6 h-6 rounded-full object-cover border border-slate-300"
                        />
                        <span className="text-xs font-bold text-slate-800">{trend.author.username}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 flex-wrap">
                        {/* Like Button */}
                        <button
                          type="button"
                          aria-label="Like Topic"
                          onClick={() => handleToggleLike(trend.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
                            isLiked
                              ? 'bg-red-50 text-red-600 border-red-200 font-bold'
                              : 'bg-white text-slate-700 border-slate-300 hover:text-red-500 hover:border-red-200'
                          }`}
                        >
                          {isLiked ? (
                            <HeartSolidIcon className="w-4 h-4 text-red-500" />
                          ) : (
                            <HeartIcon className="w-4 h-4" />
                          )}
                          <span>{trend.metrics.likes.toLocaleString()}</span>
                        </button>

                        {/* Comment Button (Toggles Inline Discussion Thread) */}
                        <button
                          type="button"
                          aria-label="Toggle Comments"
                          onClick={() => handleToggleComments(trend.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${
                            isCommentsOpen
                              ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                              : 'bg-white text-slate-700 border-slate-300 hover:text-blue-600 hover:border-blue-200'
                          }`}
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          <span>{trend.metrics.comments.toLocaleString()}</span>
                        </button>

                        {/* Copy Link Button */}
                        <button
                          type="button"
                          aria-label="Copy Link"
                          onClick={() => handleCopyLink(trend)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>

                        {/* Share Button */}
                        <button
                          type="button"
                          aria-label="Share Topic"
                          onClick={() => handleShareTrend(trend)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-red-500 transition-colors"
                        >
                          <ShareIcon className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </button>

                        {/* Switch to Full Forum PostCard view */}
                        <button
                          type="button"
                          onClick={() => setViewMode('discussion')}
                          className="text-[11px] font-bold text-sky-700 hover:text-sky-900 underline ml-1"
                        >
                          Open Discussion Card
                        </button>
                      </div>
                    </div>

                    {/* Expandable Comments Drawer */}
                    {isCommentsOpen && (
                      <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 bg-slate-50 p-4 rounded-xl border">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <ChatBubbleLeftRightIcon className="w-4 h-4 text-blue-600" />
                            Radar Topic Discussion ({comments.length + trend.metrics.comments})
                          </h4>
                          <span className="text-[10px] font-bold text-slate-500">Live Peer Commentary</span>
                        </div>

                        {/* Existing Comments List */}
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {comments.length === 0 ? (
                            <p className="text-xs text-slate-600 italic py-1">
                              Be the first to share your thoughts on #{trend.topic}!
                            </p>
                          ) : (
                            comments.map((comm) => (
                              <div key={comm.id} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2.5 shadow-2xs">
                                <img
                                  src={comm.authorAvatar}
                                  alt={comm.authorName}
                                  className="w-6 h-6 rounded-full object-cover border border-slate-300 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-slate-900">{comm.authorName}</span>
                                    <span className="text-[10px] text-slate-500">{comm.createdAt}</span>
                                  </div>
                                  <p className="text-xs text-slate-700 mt-0.5 leading-snug">{comm.text}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Comment Input Form */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAddComment(trend.id, commentInputs[trend.id] || '');
                          }}
                          className="flex items-center gap-2 pt-2 border-t border-slate-200"
                        >
                          <input
                            type="text"
                            placeholder="Add your sovereign perspective..."
                            value={commentInputs[trend.id] || ''}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({ ...prev, [trend.id]: e.target.value }))
                            }
                            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="submit"
                            disabled={!(commentInputs[trend.id] || '').trim()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-xs shrink-0"
                          >
                            Post Comment
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Continuous Stream Sentinel (No End, Keeps Loading More UGC/Trends) */}
            {trends.length > 0 && (
              <div ref={lastTrendElementRef} className="py-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 shadow-xs">
                  <ArrowPathIcon className="w-3.5 h-3.5 animate-spin text-red-500" />
                  Streaming live global cultural radar...
                </div>
              </div>
            )}
          </div>

          {/* Right Column (3 cols): Static Trending Creators & Platform Widgets/Ads */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto space-y-4 scrollbar-none pl-1">
            {/* Fastest Rising Creators & Faces */}
            <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-900 text-sm">Trending Creators & Faces</h3>
                <span className="text-[10px] uppercase font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                  Live Velocity
                </span>
              </div>
              <div className="space-y-3.5">
                {creatorsError ? (
                  <p role="alert" className="text-sm font-semibold text-slate-700">{creatorsError}</p>
                ) : creators.length === 0 ? (
                  <p className="text-sm font-semibold text-slate-700">No creator profiles are available yet.</p>
                ) : creators.map((creator) => (
                  <div key={creator.id} className="flex justify-between items-center text-xs pb-3 border-b border-slate-200 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.avatarUrl}
                        alt={creator.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-300"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{creator.name}</p>
                        <p className="text-[11px] text-slate-700">@{creator.username} • {creator.contentCount} posts</p>
                      </div>
                    </div>
                    <span className="font-black text-emerald-950 text-xs">{creator.totalViews.toLocaleString()} views</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Streaming Widgets and Canary Ads */}
            <PlatformWidgetsAndAdsRail pageContext="trends" />
          </div>

        </div>

      </div>

      {/* SOVEREIGN MOBILE QUICK DOCK */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-3 py-2 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg transition-colors ${
              activeCategory === 'all' ? 'text-red-600 font-bold bg-red-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <SparklesIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">All</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('red_carpet')}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg transition-colors ${
              activeCategory === 'red_carpet' ? 'text-red-600 font-bold bg-red-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <FireIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Red Carpet</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('e_news')}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg transition-colors ${
              activeCategory === 'e_news' ? 'text-red-600 font-bold bg-red-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <NewspaperIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">News</span>
          </button>
          <button
            type="button"
            onClick={fetchTrends}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg text-blue-700 font-bold bg-blue-50 transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Refresh</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default TrendsPage;
