import React, { useCallback, useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { ApiService } from '../services/apiService';
import { useAppContext } from '../contexts/AppContext';
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
  ArrowPathIcon
} from '../icons';

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

const TrendsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [likedTrends, setLikedTrends] = useState<Record<string, boolean>>({});

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

  const handleShareTrend = (trend: TrendItem) => {
    if (navigator.share) {
      navigator.share({
        title: `FingerMobile Trends: ${trend.topic}`,
        text: `${trend.title} — trending on FingerMobile Protocol`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${trend.topic}: ${trend.title} - ${window.location.href}`);
      showToast(`Link to ${trend.topic} copied to clipboard!`, 'info');
    }
  };

  return (
    <MainLayout pageTitle="Trends">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
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

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-gray-50 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Trends Stream (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
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
            ) : (
              trends.map((trend, index) => {
                const isLiked = !!likedTrends[trend.id];
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
                          <h2 className="text-lg font-black text-slate-900 tracking-tight hover:text-red-600 transition-colors cursor-pointer">
                            {trend.topic}
                          </h2>
                          <h3 className="text-sm font-bold text-slate-700 mt-0.5">
                            {trend.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-950 font-black text-xs rounded-full flex items-center gap-1 border  border-emerald-400">
                          <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
                          {trend.velocityScore || 95} Velocity
                        </span>
                        <button
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
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={trend.author.avatarUrl}
                          alt={trend.author.username}
                          className="w-6 h-6 rounded-full object-cover border border-slate-300"
                        />
                        <span className="text-xs font-bold text-slate-800">{trend.author.username}</span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                        <button
                          onClick={() => handleToggleLike(trend.id)}
                          className={`flex items-center gap-1.5 transition-colors ${
                            isLiked ? 'text-red-600 font-bold' : 'hover:text-red-500'
                          }`}
                        >
                          <HeartIcon className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                          {trend.metrics.likes.toLocaleString()}
                        </button>
                        <div className="flex items-center gap-1 text-slate-700">
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          {trend.metrics.comments.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-slate-700">
                          <ShareIcon className="w-4 h-4" />
                          {trend.metrics.shares.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Sidebar: Radar & Rising Creators */}
          <div className="space-y-6">
            {/* Algorithm Info Card */}
            <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-2xl p-6 border border-red-100 shadow-sm">
              <h3 className="font-black text-red-950 text-base mb-2 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-red-600" />
                Cross-Platform Radar
              </h3>
              <p className="text-xs text-red-900 leading-relaxed">
                FingerMobile Protocol scores viral momentum across all 6 microservices: Forum discussions, BeatwaveNG master audio plays, LushPressies gifts, and PhotoCredits &amp; Tribut creative licenses.
              </p>
              <div className="mt-4 pt-4 border-t border-red-200/60 flex items-center justify-between text-xs font-bold text-red-900">
                <span>Algorithmic Scan Interval</span>
                <span className="px-2 py-0.5 bg-red-500 text-white rounded-md text-[10px]">Real-Time</span>
              </div>
            </div>

            {/* Fastest Rising Creators & Faces */}
            <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-900 text-sm">Trending Creators & Faces</h3>
                <span className="text-[10px] uppercase font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Live Velocity
                </span>
              </div>
              <div className="space-y-3.5">
                {RISING_CREATORS.map((creator, i) => (
                  <div key={i} className="flex justify-between items-center text-xs pb-3 border-b border-slate-200 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-300"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{creator.name}</p>
                        <p className="text-[11px] text-slate-700">{creator.tag} • <span className="text-slate-700">{creator.niche}</span></p>
                      </div>
                    </div>
                    <span className="font-black text-emerald-600 text-xs">{creator.gain}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Policy Reminder */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-xs text-slate-600">
              <p className="font-black text-slate-900 mb-1 flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                Zero Political / Religious Bias
              </p>
              <p className="text-[11px] leading-relaxed text-slate-500">
                To maintain a safe, inspiring environment, all political propaganda, electoral debates, and religious polemics are automatically diverted from the public radar.
              </p>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default TrendsPage;
