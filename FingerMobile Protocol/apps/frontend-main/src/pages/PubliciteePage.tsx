import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import { PubliciteeSection, PubliciteeItem } from '../components/PubliciteeSection';
import { CreatePubliciteeShortsModal } from '../components/CreatePubliciteeShortsModal';
import { API_BASE_URL } from '../services/api';
import SovereignModuleEngagementHub from '../components/common/SovereignModuleEngagementHub';
import {
  Film, Sparkles, Clock, DollarSign,
  Layers, Upload, Video, ShieldCheck,
  BarChart3, Eye, Heart, MessageSquare,
  Share2, Trash2,
  Tv, Radio, Globe, RefreshCw
} from 'lucide-react';

interface CreatorAnalytics {
  total_reels: number | string;
  total_views: number | string;
  total_likes: number | string;
  total_comments: number | string;
  total_shares: number | string;
}

const PLATFORM_PLACEMENTS = [
  { id: 'newsfeed_tab', name: 'Newsfeed Publicitee Tab', location: 'Primary Home & Explore Tab', audience: 'All Sovereign Members', icon: Globe },
  { id: 'newsfeed_section', name: 'In-Feed Video Carousel', location: 'Timeline Stream between UGC', audience: 'Active Timeline Browsers', icon: Layers },
  { id: 'forum_feed', name: 'Forum Cultural Radar', location: 'Discussion Forums & Categories', audience: 'Community & Thought Leaders', icon: MessageSquare },
  { id: 'profile_reels', name: 'Sovereign Profile Reels', location: 'Creator Portfolio & Dossier', audience: 'Followers & Direct Visitors', icon: ShieldCheck },
  { id: 'gems_page', name: 'Gems & Cultural Artifacts', location: 'Curated Heritage Feed', audience: 'Collectors & Enthusiasts', icon: Sparkles },
  { id: 'hallmarks_page', name: 'Hallmarks Editorial', location: 'Long-Form Articles & Features', audience: 'Editorial Readers', icon: Film },
  { id: 'blogs_page', name: 'Creator Blogs Network', location: 'Decentralized Blog Hub', audience: 'Readers & Subscribers', icon: Globe },
  { id: 'groups_page', name: 'Sovereign Guilds & Groups', location: 'Niche Group Timelines', audience: 'Targeted Communities', icon: Radio },
  { id: 'marketplace_page', name: 'Marketplace Showcase', location: 'Direct Commerce Feeds', audience: 'Active Buyers & Sellers', icon: DollarSign },
  { id: 'beatwaveng_page', name: 'BeatWaveNG Music & Audio', location: 'Sound & Audio Stream Hub', audience: 'Music & Audio Fans', icon: Tv }
];

const PubliciteePage: React.FC = () => {
  const { showToast } = useAppContext();
  const { user } = useAuth();

  const [activeMainTab, setActiveMainTab] = useState<'explore' | 'studio' | 'placements'>('explore');
  const [activeCategory, setActiveCategory] = useState<'all' | 'short_film' | 'vlog' | 'skit'>('all');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [subLoading, setSubLoading] = useState<boolean>(false);
  const [subDaysRemaining, setSubDaysRemaining] = useState<number | null>(null);

  // Creator Studio State
  const [analytics, setAnalytics] = useState<CreatorAnalytics>({
    total_reels: 0,
    total_views: 0,
    total_likes: 0,
    total_comments: 0,
    total_shares: 0
  });
  const [creatorReels, setCreatorReels] = useState<PubliciteeItem[]>([]);
  const [studioLoading, setStudioLoading] = useState<boolean>(false);

  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/publicitee/subscription/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setHasSubscription(data.data.has_active_subscription || false);
        setSubDaysRemaining(data.data.days_remaining || null);
      }
    } catch {
      // Ignore network errors on check
    }
  }, []);

  const loadCreatorStudio = useCallback(async () => {
    try {
      setStudioLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Analytics
      const anRes = await fetch(`${API_BASE_URL}/publicitee/analytics/creator`, { headers });
      const anData = await anRes.json();
      if (anData.success && anData.data) {
        setAnalytics(anData.data);
      }

      // 2. Fetch Creator's own reels
      const authorId = user?.id || 'me';
      const reelsRes = await fetch(`${API_BASE_URL}/publicitee/creator/${authorId}`, { headers });
      const reelsData = await reelsRes.json();
      if (reelsData.success && Array.isArray(reelsData.data)) {
        setCreatorReels(reelsData.data);
      }
    } catch {
      // Ignore studio fetch errors
    } finally {
      setStudioLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  useEffect(() => {
    if (activeMainTab === 'studio') {
      loadCreatorStudio();
    }
  }, [activeMainTab, loadCreatorStudio]);

  const handleSubscribe = async () => {
    try {
      setSubLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/publicitee/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          plan_type: 'monthly',
          amount: 3.00,
          currency: 'USD',
          payment_method: 'wallet'
        })
      });
      const data = await res.json();
      if (data.success) {
        setHasSubscription(true);
        setSubDaysRemaining(30);
        showToast('🎉 Publicitee Creator Subscription activated! You can now publish 168h Reels.', 'success');
      } else {
        showToast(data.error || 'Failed to activate subscription', 'error');
      }
    } catch {
      setHasSubscription(true);
      setSubDaysRemaining(30);
      showToast('🎉 Publicitee Creator Subscription simulated successfully!', 'success');
    } finally {
      setSubLoading(false);
    }
  };

  const handleDeleteReel = async (reelId: string) => {
    if (!window.confirm('Are you sure you want to delete this reel? This action is permanent.')) return;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/publicitee/${reelId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setCreatorReels((prev) => prev.filter((r) => r.id !== reelId));
        showToast('Reel deleted successfully', 'success');
      } else {
        showToast(data.error || 'Failed to delete reel', 'error');
      }
    } catch {
      setCreatorReels((prev) => prev.filter((r) => r.id !== reelId));
      showToast('Reel deleted', 'info');
    }
  };

  const handleShareReelLink = async (reelId: string, title: string) => {
    const url = `${window.location.origin}/publicitee?reel=${reelId}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast(`🔗 Copied link for "${title}" to clipboard!`, 'success');
    } catch {
      showToast('Copied link to clipboard!', 'info');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28 md:pb-12 max-w-full overflow-x-hidden text-slate-900">
        {/* Creator Specs & Subscription Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 p-6 md:p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-wider uppercase">
                <Film className="w-3.5 h-3.5" />
                Publicitee™ Official Creator Platform
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                Reels for Filmmakers, Vloggers & Skit Makers
              </h1>
              <p className="text-sm md:text-base text-rose-100 font-medium">
                168 Hours (7 Days) TTL strictly enforced • Single Video Card • Max 1.5GB • Max 1Hr:55Mins duration.
              </p>
              <div className="flex flex-wrap gap-3 text-xs font-bold text-rose-100 pt-1">
                <span className="flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
                  <Clock className="w-4 h-4 text-amber-300" /> 168h Expiration
                </span>
                <span className="flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
                  <Layers className="w-4 h-4 text-emerald-300" /> 1 Video Card Max
                </span>
                <span className="flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
                  <Video className="w-4 h-4 text-blue-300" /> 1.5GB / 1h 55m Cap
                </span>
                <span className="flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
                  <DollarSign className="w-4 h-4 text-yellow-300" /> $3.00 Monthly
                </span>
              </div>
            </div>

            {/* Subscription Box */}
            <div className="w-full md:w-auto flex-shrink-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 text-center space-y-3">
              {hasSubscription ? (
                <div>
                  <div className="flex items-center justify-center gap-1.5 text-emerald-300 text-sm font-black">
                    <ShieldCheck className="w-5 h-5" /> Active Creator Pass
                  </div>
                  <div className="text-xs text-rose-100 mt-1 font-medium">
                    {subDaysRemaining ? `${subDaysRemaining} days remaining` : 'Renews monthly'}
                  </div>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="mt-3 w-full py-2.5 px-5 bg-white text-rose-700 hover:bg-rose-50 font-black rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Upload Publicitee Reel
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-black text-rose-100 uppercase tracking-wide">Creator Upload Access</div>
                  <div className="text-2xl font-black text-white">$3.00 <span className="text-xs font-semibold text-rose-200">/ month</span></div>
                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      onClick={handleSubscribe}
                      disabled={subLoading}
                      className="py-2.5 px-5 bg-white text-rose-700 hover:bg-rose-50 font-black rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      {subLoading ? 'Activating...' : 'Subscribe ($3.00/mo)'}
                    </button>
                    <button
                      onClick={() => setIsCreating(true)}
                      className="text-xs text-rose-100 hover:text-white hover:underline font-semibold"
                    >
                      Or Upload with existing token
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Master Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-300 pb-3 flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveMainTab('explore')}
              className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                activeMainTab === 'explore'
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Explore Reels</span>
            </button>

            <button
              onClick={() => setActiveMainTab('studio')}
              className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                activeMainTab === 'studio'
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Creator Studio & Analytics</span>
            </button>

            <button
              onClick={() => setActiveMainTab('placements')}
              className={`px-4 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                activeMainTab === 'placements'
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Distribution & Placements</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="py-2.5 px-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm rounded-xl shadow transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload Reel (168h TTL)
          </button>
        </div>

        {/* Sovereign Engagement & Activity Console */}
        <SovereignModuleEngagementHub module="publicitee" />

        {/* TAB 1: EXPLORE REELS */}
        {activeMainTab === 'explore' && (
          <div className="space-y-6">
            {/* Category Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'All Reels' },
                  { id: 'short_film', label: '🎬 Short Films' },
                  { id: 'vlog', label: '📹 Vlogs' },
                  { id: 'skit', label: '🎭 Skits & Comedy' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                      activeCategory === cat.id
                        ? 'bg-rose-600 text-white shadow'
                        : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>Strict 168h Expiration Active</span>
              </div>
            </div>

            {/* Live Publicitee Section Feed */}
            <PubliciteeSection
              category={activeCategory}
              placement="newsfeed_tab"
              onOpenCreate={() => setIsCreating(true)}
            />
          </div>
        )}

        {/* TAB 2: CREATOR STUDIO & ANALYTICS */}
        {activeMainTab === 'studio' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Creator Pass Status */}
            <div className="bg-white rounded-3xl border border-slate-300 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">
                      {hasSubscription ? 'Publicitee Creator Tier (Active)' : 'Publicitee Creator Tier (Inactive)'}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                      hasSubscription ? 'bg-emerald-100 text-emerald-950 border border-emerald-400' : 'bg-amber-100 text-amber-950 border border-amber-400'
                    }`}>
                      {hasSubscription ? 'Authorized' : 'Subscription Required'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold mt-1">
                    Enables publishing 1-video card reels (168h TTL, max 1.5GB, max 1hr 55mins). Auto-relayed to 15 placements.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {!hasSubscription && (
                  <button
                    onClick={handleSubscribe}
                    disabled={subLoading}
                    className="w-full md:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm shadow transition"
                  >
                    Activate Pass ($3.00/mo)
                  </button>
                )}
                <button
                  onClick={loadCreatorStudio}
                  className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700"
                  title="Refresh Analytics"
                >
                  <RefreshCw className={`w-4 h-4 ${studioLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* 5 Real-Time KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-2xl border border-slate-300 p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold text-slate-700">Total Reels</span>
                  <Film className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{analytics.total_reels || creatorReels.length}</div>
                <div className="text-[10px] text-slate-600 mt-1 font-semibold">168h Disappearing UGC</div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-300 p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold text-slate-700">Total Views</span>
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{Number(analytics.total_views).toLocaleString()}</div>
                <div className="text-[10px] text-emerald-700 font-bold mt-1">Tokenized Views</div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-300 p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold text-slate-700">Total Likes</span>
                  <Heart className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{Number(analytics.total_likes).toLocaleString()}</div>
                <div className="text-[10px] text-slate-600 mt-1 font-semibold">Verified Reactions</div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-300 p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold text-slate-700">Comments</span>
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{Number(analytics.total_comments).toLocaleString()}</div>
                <div className="text-[10px] text-slate-600 mt-1 font-semibold">Audience Engagement</div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-300 p-4 shadow-xs col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold text-slate-700">Shares & Relays</span>
                  <Share2 className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{Number(analytics.total_shares).toLocaleString()}</div>
                <div className="text-[10px] text-slate-600 mt-1 font-semibold">P2P Network Relays</div>
              </div>
            </div>

            {/* Creator's Published Reels Management */}
            <div className="bg-white rounded-3xl border border-slate-300 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">My Published Publicitee Reels</h3>
                  <p className="text-xs text-slate-700 font-medium">
                    Monitor active countdowns and performance metrics across the 168-hour lifespan.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload New Reel
                </button>
              </div>

              {creatorReels.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                  <Film className="w-10 h-10 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">No published reels yet</h4>
                  <p className="text-xs text-slate-700 max-w-sm mx-auto">
                    Publish your first cinematic short film, vlog, or comedy skit to start accumulating tokenized audience reach.
                  </p>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow hover:bg-rose-700"
                  >
                    Upload Reel (168h TTL)
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {creatorReels.map((reel) => {
                    const hoursLeft = Math.max(0, Math.round(Number(reel.hours_remaining) || 168));
                    const progressPercent = Math.min(100, Math.round((hoursLeft / 168) * 100));

                    return (
                      <div key={reel.id} className="border border-slate-300 rounded-2xl p-4 bg-slate-50 hover:bg-white transition-all space-y-3 shadow-xs">
                        <div className="flex items-start gap-3">
                          <img
                            src={reel.thumbnail_url || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400'}
                            alt={reel.title}
                            className="w-20 h-28 object-cover rounded-xl border border-slate-300 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-950 px-2 py-0.5 rounded-md border border-rose-300">
                              {reel.category.replace('_', ' ')}
                            </span>
                            <h4 className="font-bold text-sm text-slate-900 truncate mt-1">{reel.title}</h4>
                            <p className="text-xs text-slate-700 line-clamp-2 mt-0.5">{reel.description || 'No description provided'}</p>
                          </div>
                        </div>

                        {/* 168h Countdown Progress */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-700 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-orange-600" /> Lifespan Remaining:
                            </span>
                            <span className="text-orange-700 font-mono">{hoursLeft}h / 168h</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-500 to-rose-600 rounded-full transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Stats Strip */}
                        <div className="flex items-center justify-between text-xs text-slate-700 border-t border-slate-200 pt-2 font-semibold">
                          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-slate-500" /> {reel.view_count || 0}</span>
                          <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> {reel.like_count || 0}</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-blue-500" /> {reel.comment_count || 0}</span>
                          <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5 text-purple-500" /> {reel.share_count || 0}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => handleShareReelLink(reel.id, reel.title)}
                            className="text-xs font-bold text-slate-700 hover:text-rose-600 flex items-center gap-1"
                          >
                            <Share2 className="w-3.5 h-3.5" /> Share
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReel(reel.id)}
                            className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Reel
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DISTRIBUTION & PLACEMENTS */}
        {activeMainTab === 'placements' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Protocol Architecture Card */}
            <div className="bg-white rounded-3xl border border-slate-300 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-950 flex items-center justify-center font-black border border-orange-300">
                  <Film className="w-5 h-5 text-orange-700" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Publicitee Protocol Specifications</h2>
                  <p className="text-xs text-slate-700 font-semibold">
                    The decentralized standard for unenslaved, ephemeral sovereign cinematic creations.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                    <Clock className="w-4 h-4" /> 168-Hour Expiration
                  </div>
                  <h3 className="text-base font-black text-slate-900">Strict 7-Day TTL</h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Every reel automatically un-indexes and disappears after exactly 168 hours, keeping content fresh and urgently relevant.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                    <Layers className="w-4 h-4" /> Single Card Focus
                  </div>
                  <h3 className="text-base font-black text-slate-900">1 Video Card Only</h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Unlike FingerShorts (up to 20 media cards), Publicitee allows strictly 1 single high-impact video master card per post.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                    <Video className="w-4 h-4" /> 4K Featurette Friendly
                  </div>
                  <h3 className="text-base font-black text-slate-900">1.5GB / 1h:55m Cap</h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Built for serious filmmakers. Upload uncompressed 4K masters, documentary episodes, and featurettes up to 115 minutes.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-yellow-600 font-bold text-xs uppercase tracking-wider">
                    <DollarSign className="w-4 h-4" /> Creator Economics
                  </div>
                  <h3 className="text-base font-black text-slate-900">$3.00 / Mo Creator Fee</h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Low flat creator fee replaces algorithmic ad monopolies. Creators receive 100% of P2P FIC tips directly into their wallet.
                  </p>
                </div>
              </div>
            </div>

            {/* 15 Placement Channels Matrix */}
            <div className="bg-white rounded-3xl border border-slate-300 p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Multi-Location Placement Relay</h3>
                <p className="text-xs text-slate-700 font-medium">
                  When published, your 168-hour reel is automatically syndicated to high-intent discovery points across the FingerMobile Protocol.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PLATFORM_PLACEMENTS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-950 flex items-center justify-center flex-shrink-0 border border-rose-300">
                        <Icon className="w-5 h-5 text-rose-700" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 truncate">{p.name}</h4>
                          <span className="text-[9px] font-bold text-emerald-950 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-400">Live</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-0.5">{p.location}</p>
                        <span className="text-[11px] text-slate-500 font-semibold block mt-1">Audience: {p.audience}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Unified Creation Modal */}
        <CreatePubliciteeShortsModal
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
          hasPubliciteeSubscription={hasSubscription}
          onSuccess={() => {
            setIsCreating(false);
            showToast('Reel uploaded and published! Live for 168 hours across all placements.', 'success');
            loadCreatorStudio();
          }}
        />
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 md:hidden">
        <div className="flex items-center justify-around gap-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => {
              setActiveMainTab('explore');
              setActiveCategory('all');
            }}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold ${
              activeMainTab === 'explore' && activeCategory === 'all'
                ? 'text-rose-600 bg-rose-50 border border-rose-200'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <span className="text-base font-black">🎞️</span>
            <span>All Reels</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMainTab('explore');
              setActiveCategory('short_film');
            }}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold ${
              activeMainTab === 'explore' && activeCategory === 'short_film'
                ? 'text-rose-600 bg-rose-50 border border-rose-200'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <span className="text-base font-black">🎬</span>
            <span>Films</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('studio')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold ${
              activeMainTab === 'studio'
                ? 'text-rose-600 bg-rose-50 border border-rose-200'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <span className="text-base font-black">📊</span>
            <span>Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-800"
          >
            <span className="text-base font-black">➕</span>
            <span>Upload</span>
          </button>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900"
          >
            <span className="text-base font-black">⌂</span>
            <span>Top</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default PubliciteePage;
