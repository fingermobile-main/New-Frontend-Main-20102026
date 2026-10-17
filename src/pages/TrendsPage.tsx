import React, { useEffect, useState } from 'react';
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

const DEFAULT_TRENDS: Record<string, TrendItem[]> = {
  all: [
    {
      id: 'tr-all-1',
      topic: '#MetGala2026',
      title: 'Met Gala Red Carpet Sneak Peek: Holographic Couture Unveiled',
      content: 'Celebrity stylists tease interactive fiber-optic dresses that react dynamically to flash photography, setting an unprecedented global fashion benchmark.',
      category: 'red_carpet',
      author: {
        id: 'fm-redcarpet',
        username: 'Vogue & Protocol Desk',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      },
      metrics: { likes: 58400, comments: 4200, shares: 12900 },
      velocityScore: 99,
      trendingScore: '99.40'
    },
    {
      id: 'tr-all-2',
      topic: '#OneMinuteVignette',
      title: 'Viral UGC Spotlight: Cinematic 60-Second Micro-Films Captivate Global Feeds',
      content: 'Independent filmmakers and digital storytellers achieve millions of impressions using rapid cinematic editing and original sound design directly exported to FingerMobile.',
      category: 'ugc',
      author: {
        id: 'fm-ugc',
        username: 'Creator Studio Collective',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      metrics: { likes: 72000, comments: 6100, shares: 15800 },
      velocityScore: 98,
      trendingScore: '98.90'
    },
    {
      id: 'tr-all-3',
      topic: '#SummerWorldTourTease',
      title: 'Global E-News: Multi-Platinum Afrobeat Icons Tease Joint Stadium Tour',
      content: 'Leaked tour schedules and studio snippets ignite speculation about an unprecedented 25-city international summer arena tour across London, Paris, New York, and Lagos.',
      category: 'e_news',
      author: {
        id: 'fm-enews',
        username: 'Global E-News Radar',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      },
      metrics: { likes: 56000, comments: 4800, shares: 12000 },
      velocityScore: 97,
      trendingScore: '97.20'
    },
    {
      id: 'tr-all-4',
      topic: '#VoiceLineCommentaryLive',
      title: 'Platform Bulletin: VoiceLine Dynamic Audio Commentary Now Active Across 6 Microservices',
      content: 'Members can now experience immersive audio commentary with background ambient playback at 35% default system volume across Forum, LushPressies, and Groups.',
      category: 'bulletins',
      author: {
        id: 'fm-official',
        username: 'FingerMobile Core',
        avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'
      },
      metrics: { likes: 64000, comments: 5200, shares: 14200 },
      velocityScore: 98,
      trendingScore: '98.40'
    },
    {
      id: 'tr-all-5',
      topic: '#StreetStyleRevolution',
      title: 'Trending Faces: Rising London & Lagos Stylists Redefining Everyday Urban Streetwear',
      content: 'A new wave of fashion creatives merges oversized vintage silhouettes with modern athletic tailoring, creating viral runway street looks.',
      category: 'faces_style',
      author: {
        id: 'fm-style',
        username: 'StreetStyle Wire',
        avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150'
      },
      metrics: { likes: 33400, comments: 2700, shares: 5900 },
      velocityScore: 95,
      trendingScore: '94.60'
    }
  ],
  red_carpet: [
    {
      id: 'tr-rc-1',
      topic: '#MetGala2026',
      title: 'Met Gala Red Carpet Sneak Peek: Holographic Couture Unveiled',
      content: 'Celebrity stylists tease interactive fiber-optic dresses that react dynamically to flash photography, setting an unprecedented global fashion benchmark.',
      category: 'red_carpet',
      author: {
        id: 'fm-redcarpet',
        username: 'Vogue & Protocol Desk',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      },
      metrics: { likes: 58400, comments: 4200, shares: 12900 },
      velocityScore: 99,
      trendingScore: '99.40'
    },
    {
      id: 'tr-rc-2',
      topic: '#CannesGlamour2026',
      title: 'Cannes Film Festival Red Carpet: Afrobeats & Nollywood Stars Turn Heads in Custom Kente',
      content: 'Global cinema luminaries converge on the French Riviera with custom handcrafted African couture dominating red carpet photography and social impressions.',
      category: 'red_carpet',
      author: {
        id: 'fm-cannes',
        username: 'Cannes Festival Press',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
      },
      metrics: { likes: 38500, comments: 2900, shares: 6100 },
      velocityScore: 97,
      trendingScore: '96.80'
    },
    {
      id: 'tr-rc-3',
      topic: '#GrammysAfterparty',
      title: 'Grammy Red Carpet & Gala: Inside the Star-Studded Lagos-to-LA Celebration',
      content: 'High-energy celebration brings together international charting producers, songwriters, and fashion designers for an exclusive gala night.',
      category: 'red_carpet',
      author: {
        id: 'fm-grammy',
        username: 'Grammy SoundWire',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
      },
      metrics: { likes: 31200, comments: 2400, shares: 5400 },
      velocityScore: 95,
      trendingScore: '95.40'
    }
  ],
  e_news: [
    {
      id: 'tr-en-1',
      topic: '#SummerWorldTourTease',
      title: 'Global E-News: Multi-Platinum Afrobeat Icons Tease Joint Stadium Tour',
      content: 'Leaked tour schedules and studio snippets ignite speculation about an unprecedented 25-city international summer arena tour.',
      category: 'e_news',
      author: {
        id: 'fm-enews',
        username: 'Global E-News Radar',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      },
      metrics: { likes: 56000, comments: 4800, shares: 12000 },
      velocityScore: 97,
      trendingScore: '97.20'
    },
    {
      id: 'tr-en-2',
      topic: '#BehindTheVelvetRopes',
      title: 'Entertainment Insider: Top Hitmakers Spotted Collaborating at Studio 234',
      content: 'Photographers capture three Grammy-winning sound designers entering the private facility for secret marathon recording sessions.',
      category: 'e_news',
      author: {
        id: 'fm-insider',
        username: 'Pop Radar Insider',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
      },
      metrics: { likes: 24000, comments: 1850, shares: 3900 },
      velocityScore: 93,
      trendingScore: '93.10'
    }
  ],
  ugc: [
    {
      id: 'tr-ugc-1',
      topic: '#OneMinuteVignette',
      title: 'Viral UGC Spotlight: Cinematic 60-Second Micro-Films Captivate Global Audiences',
      content: 'Independent filmmakers and digital storytellers achieve millions of impressions using rapid cinematic editing and original sound design.',
      category: 'ugc',
      author: {
        id: 'fm-ugc',
        username: 'Creator Studio Collective',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      metrics: { likes: 72000, comments: 6100, shares: 15800 },
      velocityScore: 99,
      trendingScore: '98.90'
    },
    {
      id: 'tr-ugc-2',
      topic: '#LushMysteryChallenge',
      title: 'LushPressies Viral Trend: Mystery Box Unboxing Sensation',
      content: 'Members exchange surprise gift tokens and unbox digital collectibles with real-time video reactions across the network.',
      category: 'ugc',
      author: {
        id: 'fm-lush',
        username: 'LushPressies Central',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
      },
      metrics: { likes: 45000, comments: 3800, shares: 8200 },
      velocityScore: 96,
      trendingScore: '96.50'
    },
    {
      id: 'tr-ugc-3',
      topic: '#PhotoCreditsShowcase',
      title: 'UGC Photographers Trend Worldwide with 35mm Vintage Film Scans',
      content: 'Visual artists share high-resolution analog street photography, sparking a surge in digital collector licensing via PhotoCredits.',
      category: 'ugc',
      author: {
        id: 'fm-photo',
        username: 'PhotoCredits Curators',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      },
      metrics: { likes: 21500, comments: 1600, shares: 3400 },
      velocityScore: 92,
      trendingScore: '91.70'
    }
  ],
  faces_style: [
    {
      id: 'tr-fs-1',
      topic: '#StreetStyleRevolution',
      title: 'Trending Faces: Rising London & Lagos Stylists Redefining Everyday Urban Streetwear',
      content: 'A new wave of fashion creatives merges oversized vintage silhouettes with modern athletic tailoring, creating viral runway street looks.',
      category: 'faces_style',
      author: {
        id: 'fm-style',
        username: 'StreetStyle Wire',
        avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150'
      },
      metrics: { likes: 33400, comments: 2700, shares: 5900 },
      velocityScore: 95,
      trendingScore: '94.60'
    },
    {
      id: 'tr-fs-2',
      topic: '#MilanFashionWeek',
      title: 'Milan Fashion Week: Sustainable Afro-Futurism Dominates the Runway',
      content: 'Designers showcase stunning zero-waste garments blended with traditional West African fabrics and LED accents.',
      category: 'faces_style',
      author: {
        id: 'fm-milan',
        username: 'Milano Runway Daily',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
      },
      metrics: { likes: 42000, comments: 3100, shares: 8900 },
      velocityScore: 98,
      trendingScore: '98.50'
    },
    {
      id: 'tr-fs-3',
      topic: '#GlowingSkinAesthetics',
      title: 'Trending Beauty: Minimalist Clean-Face Visuals Sweep Video Feeds',
      content: 'Organic skincare routines and raw unfiltered aesthetic portraits rise to prominence across creative creator circles.',
      category: 'faces_style',
      author: {
        id: 'fm-beauty',
        username: 'Pure Glow Editors',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
      },
      metrics: { likes: 18900, comments: 1200, shares: 2800 },
      velocityScore: 90,
      trendingScore: '89.50'
    }
  ],
  bulletins: [
    {
      id: 'tr-bl-1',
      topic: '#FingerMobileUpdate',
      title: 'FingerMobile Official Bulletin: Creator Payout Engine Expands to 15 New Regional Hubs',
      content: 'Instant revenue-share settlements now live across EMEA and North American creator collectives, with sub-second bank and wallet transfers.',
      category: 'bulletins',
      author: {
        id: 'fm-official',
        username: 'FingerMobile Core',
        avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'
      },
      metrics: { likes: 89000, comments: 7500, shares: 22000 },
      velocityScore: 99,
      trendingScore: '99.10'
    },
    {
      id: 'tr-bl-2',
      topic: '#VoiceLineCommentaryLive',
      title: 'Platform Bulletin: VoiceLine Dynamic Audio Commentary Now Active Across 6 Microservices',
      content: 'Members can now experience immersive audio commentary with background ambient playback at 35% default system volume across Forum, LushPressies, and Groups.',
      category: 'bulletins',
      author: {
        id: 'fm-official',
        username: 'FingerMobile Core',
        avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'
      },
      metrics: { likes: 64000, comments: 5200, shares: 14200 },
      velocityScore: 98,
      trendingScore: '98.40'
    }
  ],
  music: [
    {
      id: 'tr-mu-1',
      topic: '#BeatwaveGlobal',
      title: 'BeatwaveNG Sound Wave: Afrobeat Producers Cross 100M Streams',
      content: 'Global listeners tune in to the high-fidelity stem-mastered streams with over 20,000 simultaneous audio rooms open.',
      category: 'music',
      author: {
        id: 'fm-beatwave',
        username: 'BeatwaveNG Radar',
        avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150'
      },
      metrics: { likes: 68000, comments: 5900, shares: 16500 },
      velocityScore: 98,
      trendingScore: '97.80'
    }
  ]
};

const CATEGORIES = [
  { id: 'all', label: 'All Trends', icon: FireIcon },
  { id: 'red_carpet', label: 'Red Carpet & Galas', icon: SparklesIcon },
  { id: 'e_news', label: 'E-News & Gossips', icon: NewspaperIcon },
  { id: 'ugc', label: 'Trending UGC & Videos', icon: CamusIcon },
  { id: 'faces_style', label: 'Trending Faces & Style', icon: MemberIcon },
  { id: 'bulletins', label: 'Platform Bulletins', icon: MegaphoneIcon },
  { id: 'music', label: 'Beatwave & Audio', icon: MusicNoteIcon }
];

const RISING_CREATORS = [
  {
    name: 'Kemi Visuals',
    tag: '@kemiphotos',
    gain: '+450%',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    niche: '35mm Film Art'
  },
  {
    name: 'Dj Flex NG',
    tag: '@djflex',
    gain: '+380%',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    niche: 'Beatwave Audio'
  },
  {
    name: 'Amina Style Vault',
    tag: '@aminavault',
    gain: '+310%',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    niche: 'Afro-Couture'
  },
  {
    name: 'Lagos Street Focus',
    tag: '@lagosstreet',
    gain: '+240%',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    niche: 'UGC Cinematography'
  }
];

const TrendsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [likedTrends, setLikedTrends] = useState<Record<string, boolean>>({});

  const fetchTrends = async () => {
    try {
      setLoading(true);
      const res: any = await ApiService.get('/trends', {
        params: {
          category: activeCategory,
          timeframe: timeRange
        }
      });

      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: TrendItem[] = res.data.map((item: any, idx: number) => ({
          id: item.id || `tr-${idx}`,
          topic: item.topic || `#${(item.title || 'Trend').replace(/[^a-zA-Z0-9]/g, '')}`,
          title: item.title || item.topic || 'Trending Topic',
          content: item.content || item.summary || item.description || '',
          category: item.category || activeCategory,
          author: {
            id: item.author?.id || null,
            username: item.author?.username || 'FingerMobile Global Desk',
            avatarUrl: item.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          },
          metrics: {
            likes: item.metrics?.likes || 0,
            comments: item.metrics?.comments || 0,
            shares: item.metrics?.shares || 0
          },
          velocityScore: item.velocityScore || Math.min(99, Math.max(50, Math.round(Number(item.trendingScore || 85)))),
          trendingScore: item.trendingScore || '88.00',
          createdAt: item.createdAt || new Date().toISOString()
        }));
        setTrends(mapped);
      } else {
        const fallback = DEFAULT_TRENDS[activeCategory] || DEFAULT_TRENDS.all;
        setTrends(fallback);
      }
    } catch {
      const fallback = DEFAULT_TRENDS[activeCategory] || DEFAULT_TRENDS.all;
      setTrends(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [activeCategory, timeRange]);

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
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Worldwide Cultural Radar</h1>
              <p className="text-gray-600 text-sm mt-0.5">
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
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {r === '24h' ? 'Past 24h' : r === '7d' ? 'Past 7 Days' : 'This Month'}
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchTrends()}
              disabled={loading}
              className="p-2.5 bg-white border border-slate-300 rounded-xl text-gray-600 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
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
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
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
                <p className="text-sm font-bold text-gray-700">Syncing Worldwide Trends...</p>
                <p className="text-xs text-slate-700 mt-1">Filtering feeds through Guardian AI</p>
              </div>
            ) : trends.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-300">
                <p className="text-sm font-bold text-gray-700">No trends found in this category.</p>
                <p className="text-xs text-slate-700 mt-1">Check back soon as new topics emerge globally.</p>
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
                            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                              {trend.category.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-700">
                              {(trend.metrics.likes + trend.metrics.comments + trend.metrics.shares).toLocaleString()} interactions
                            </span>
                          </div>
                          <h2 className="text-lg font-black text-gray-900 tracking-tight hover:text-red-600 transition-colors cursor-pointer">
                            {trend.topic}
                          </h2>
                          <h3 className="text-sm font-bold text-gray-700 mt-0.5">
                            {trend.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-950 font-black text-xs rounded-full flex items-center gap-1 border text-emerald-950 border-emerald-400">
                          <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
                          {trend.velocityScore || 95} Velocity
                        </span>
                        <button
                          onClick={() => handleShareTrend(trend)}
                          className="p-2 border border-slate-300 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Share Topic"
                        >
                          <ShareIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 mt-3 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-slate-200">
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
                        <span className="text-xs font-bold text-gray-800">{trend.author.username}</span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
                        <button
                          onClick={() => handleToggleLike(trend.id)}
                          className={`flex items-center gap-1.5 transition-colors ${
                            isLiked ? 'text-red-600 font-bold' : 'hover:text-red-500'
                          }`}
                        >
                          <HeartIcon className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                          {trend.metrics.likes.toLocaleString()}
                        </button>
                        <div className="flex items-center gap-1 text-gray-500">
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          {trend.metrics.comments.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
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
                <h3 className="font-black text-gray-900 text-sm">Trending Creators & Faces</h3>
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
                        <p className="font-bold text-gray-900">{creator.name}</p>
                        <p className="text-[11px] text-slate-700">{creator.tag} • <span className="text-gray-500">{creator.niche}</span></p>
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
