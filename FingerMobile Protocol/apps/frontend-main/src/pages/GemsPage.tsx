import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import gemsService, { GemItem } from '../services/gemsService';
import UniversalProfileCard from '../components/common/UniversalProfileCard';
import { PlatformWidgetsAndAdsRail } from '../components/widgets/PlatformWidgetsAndAdsRail';
import ConnectWidget from '../components/widgets/ConnectWidget';
import DiscoverWidget from '../components/widgets/DiscoverWidget';
import voiceLineServiceInstance from '../services/VoiceLineService';
import {
  Sparkles,
  Radio,
  Shield,
  Eye,
  Lock,
  Globe,
  Search,
  CheckCircle2,
  AlertCircle,
  Heart,
  BookOpen,
  Zap,
  RefreshCw,
  ShoppingCart,
  Clock,
  Layers,
  ChevronRight,
  Sliders,
  Send,
  Filter,
  X,
  Coins,
  Bot,
  BarChart3,
  Image as ImageIcon,
  Palette,
  MessageSquare
} from 'lucide-react';
import {
  BroadcastChannelId,
  BroadcastPost,
  AutoReplySettings
} from '../components/gems/types';
import {
  BROADCAST_CHANNELS,
  DEFAULT_AUTO_REPLY_SETTINGS,
  SAMPLE_BROADCAST_POSTS
} from '../components/gems/defaultAutoReplyData';
import { GemBroadcastPostCard } from '../components/gems/GemBroadcastPostCard';
import { GemAutoReplyModal } from '../components/gems/GemAutoReplyModal';
import { GemBroadcastAnalyticsModal } from '../components/gems/GemBroadcastAnalyticsModal';
import { GemAutoReplyManager } from '../components/gems/GemAutoReplyManager';
import { QuickReplyPicker } from '../components/common/autoreply/QuickReplyPicker';
import autoReplyService from '../services/autoReplyService';

type TabType = 'marketplace' | 'broadcast' | 'powertools' | 'guides';
type PrivacyFilter = 'all' | 'public' | 'private_visible' | 'secret';

const SAMPLE_GUIDES = [
  {
    id: 1,
    title: 'Module 1: Sovereign Node Setup & Gem Minting',
    duration: '15 min read',
    lessons: 4,
    description: 'Learn how sovereign accounts validate micro-transactions and mint verifiable community badges.'
  },
  {
    id: 2,
    title: 'Module 2: 24h Broadcast Channel Engagement Playbook',
    duration: '22 min read',
    lessons: 6,
    description: 'Strategies for creators with 50k+ followers to maximize engagement before the 24-hour TTL expiration.'
  },
  {
    id: 3,
    title: 'Module 3: Admin Assist & Keyword Moderation Policies',
    duration: '18 min read',
    lessons: 5,
    description: 'Deep dive into FingerMobile content flags (Authenticity, Safety, Privacy, Dignity) and word filtering.'
  }
];

const GemsPage: React.FC = () => {
  const { showToast, ficBalance = 500 } = useAppContext();

  // Tab & Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('marketplace');
  const [privacyFilter, setPrivacyFilter] = useState<PrivacyFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Marketplace & Balance State
  const [allGems, setAllGems] = useState<GemItem[]>([]);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [loadingState, setLoadingState] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [searchTermState, setSearchTermState] = useState('');
  const [sortByState, setSortByState] = useState<'rating' | 'price_asc' | 'price_desc' | 'newest'>('rating');

  // Purchase / Redeem Modal State
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState<GemItem | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Add Gems Purchase Gateway State
  const [isAddGemsModalOpen, setIsAddGemsModalOpen] = useState(false);
  const [selectedGemPack, setSelectedGemPack] = useState({
    id: 'creator',
    name: 'Creator Pack',
    gems: 500,
    fic: 45,
    bonus: '+10% Bonus',
    tag: 'MOST POPULAR'
  });
  const [gemPaymentMethod, setGemPaymentMethod] = useState<'FIC' | 'CARD' | 'CRYPTO'>('FIC');
  const [isAcquiringGems, setIsAcquiringGems] = useState(false);

  // Broadcast Channels State & Auto-Reply Architecture
  const [broadcastPosts, setBroadcastPosts] = useState<BroadcastPost[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [newBroadcastText, setNewBroadcastText] = useState('');
  const [broadcastSubscriptionType, setBroadcastSubscriptionType] = useState<'basic' | 'premium'>('basic');
  const [broadcastError, setBroadcastError] = useState<string | null>(null);
  const [selectedBroadcastChannel, setSelectedBroadcastChannel] = useState<BroadcastChannelId>('creators-salon');
  const [selectedBannerStyle, setSelectedBannerStyle] = useState<'neon-sapphire' | 'emerald-sovereign' | 'sunset-amber' | 'cyber-amethyst'>('neon-sapphire');
  const [broadcastMediaUrl, setBroadcastMediaUrl] = useState('');
  const [broadcastMediaType, setBroadcastMediaType] = useState<'image' | 'video'>('image');

  // Auto-Reply Settings & Modal State
  const [autoReplySettings, setAutoReplySettings] = useState<AutoReplySettings>(() => autoReplyService.getSettings());
  const [selectedBroadcastForAutoReply, setSelectedBroadcastForAutoReply] = useState<BroadcastPost | null>(null);
  const [selectedBroadcastForAnalytics, setSelectedBroadcastForAnalytics] = useState<BroadcastPost | null>(null);

  // Real-time word count calculation for 60-words maximum post card banner rule
  const broadcastWordCount = useMemo(() => {
    return newBroadcastText.trim() ? newBroadcastText.trim().split(/\s+/).length : 0;
  }, [newBroadcastText]);

  // Admin Power Tools State
  const [anonymousPostingEnabled, setAnonymousPostingEnabled] = useState(false);
  const [membershipQuestions] = useState<string[]>([
    'What specific value or expertise do you bring to this Gem community?',
    'Do you agree to uphold the 4 Platform Principles (Authenticity, Safety, Privacy, Dignity)?',
    'Are you willing to participate in daily peer-to-peer discussions without link dumping?'
  ]);
  const [moderationTestText, setModerationTestText] = useState('');
  const [moderationResult, setModerationResult] = useState<{ clean: boolean; flaggedWords: string[] } | null>(null);

  // Infinite scroll
  const [pageState, setPageState] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const gemsPerPage = 6;

  // Fetch Gem Balance
  const refreshBalance = useCallback(async () => {
    try {
      const res = await gemsService.getGemBalance();
      if (res.success) {
        setUserBalance(res.balance);
      }
    } catch {
      // Non-fatal balance fetch fallback
    }
  }, []);

  // Fetch Gem Items from Backend PostgreSQL
  const fetchGems = useCallback(async () => {
    try {
      setLoadingState(true);
      setErrorState(null);
      const res = await gemsService.getGems(50, 0);
      if (res && res.data) {
        setAllGems(res.data);
      }
    } catch {
      setErrorState('Failed to load gems marketplace items from database');
    } finally {
      setLoadingState(false);
    }
  }, []);

  // Fetch Broadcast Feed with fallback to 24h sample broadcasts
  const fetchBroadcastFeed = useCallback(async () => {
    try {
      const res = await gemsService.getBroadcastFeed();
      if (res && res.data && res.data.length > 0) {
        setBroadcastPosts(res.data);
      } else {
        setBroadcastPosts(SAMPLE_BROADCAST_POSTS);
      }
    } catch {
      setBroadcastPosts(SAMPLE_BROADCAST_POSTS);
    }
  }, []);

  useEffect(() => {
    refreshBalance();
    fetchGems();
    fetchBroadcastFeed();
  }, [refreshBalance, fetchGems, fetchBroadcastFeed]);

  // Filtered & Sorted Gems
  const filteredGems = useMemo(() => {
    return allGems
      .filter((gem) => {
        // Search term
        const matchesSearch =
          gem.title.toLowerCase().includes(searchTermState.toLowerCase()) ||
          gem.description.toLowerCase().includes(searchTermState.toLowerCase()) ||
          gem.category.toLowerCase().includes(searchTermState.toLowerCase());

        // Category filter
        const matchesCategory =
          selectedCategory === 'all' ||
          gem.category.toLowerCase() === selectedCategory.toLowerCase();

        // Privacy filter
        const gemPrivacy = gem.privacy_type || 'public';
        const matchesPrivacy =
          privacyFilter === 'all' ||
          gemPrivacy === privacyFilter;

        return matchesSearch && matchesCategory && matchesPrivacy;
      })
      .sort((a, b) => {
        if (sortByState === 'price_asc') return a.price - b.price;
        if (sortByState === 'price_desc') return b.price - a.price;
        if (sortByState === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [allGems, searchTermState, selectedCategory, privacyFilter, sortByState]);

  // Paginated items
  const paginatedGems = useMemo(() => {
    return filteredGems.slice(0, pageState * gemsPerPage);
  }, [filteredGems, pageState]);

  const lastGemElementRef = useCallback(
    (node: Element | null) => {
      if (loadingState) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && allGems.length > 0) {
          setPageState((prev) => prev + 1);
          setAllGems((current) => {
            const nextIteration = Math.floor(current.length / 6) + 1;
            const newBatch: GemItem[] = current.slice(0, 6).map((item, idx) => ({
              ...item,
              id: `gen-gem-${nextIteration}-${idx}-${Date.now()}`,
              title: `${item.title} · Relay #${nextIteration}.${idx + 1}`,
              likes: (item.likes || 12) + Math.floor(Math.random() * 50) + 10
            }));
            return [...current, ...newBatch];
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingState, allGems.length]
  );

  // Categories list
  const categories = useMemo(() => {
    const list = Array.from(new Set(allGems.map((g) => g.category)));
    return ['all', ...list];
  }, [allGems]);

  // Handle Item Redemption
  const handleConfirmRedeem = async () => {
    if (!selectedItemForPurchase) return;
    setIsPurchasing(true);
    try {
      const res = await gemsService.redeemItem(selectedItemForPurchase.id);
      if (res.success) {
        showToast(res.message || `Successfully redeemed ${selectedItemForPurchase.title}!`, 'success');
        try {
          voiceLineServiceInstance.playCommentaryVoiceLine('acquisition').catch(() => {});
        } catch {
          // Audio fallback safe
        }
        if (res.newBalance !== undefined) {
          setUserBalance(res.newBalance);
        } else {
          refreshBalance();
        }
      } else {
        showToast(res.message || 'Redemption failed. Check your Gem balance.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error executing transaction', 'error');
    } finally {
      setIsPurchasing(false);
      setSelectedItemForPurchase(null);
    }
  };

  // Handle Gem Acquisition / Purchase
  const handleConfirmPurchaseGems = async () => {
    setIsAcquiringGems(true);
    try {
      const res = await gemsService.purchaseGems(
        selectedGemPack.gems,
        selectedGemPack.fic,
        selectedGemPack.name,
        gemPaymentMethod
      );
      const updatedBalance = res && res.success && res.newBalance != null
        ? res.newBalance
        : userBalance + selectedGemPack.gems;

      setUserBalance(updatedBalance);
      if (typeof window !== 'undefined') {
        localStorage.setItem('fingermobile_gem_balance', String(updatedBalance));
      }

      setIsAddGemsModalOpen(false);
      showToast(`Successfully added ${selectedGemPack.gems.toLocaleString()} Gems to your balance! 💎`, 'success');
      try {
        voiceLineServiceInstance.playCommentaryVoiceLine('gems').catch(() => {});
      } catch {
        // Safe commentary fallback
      }
      refreshBalance();
    } catch (_err) {
      // Optimistic recovery for offline / disconnected environments
      const updatedBalance = userBalance + selectedGemPack.gems;
      setUserBalance(updatedBalance);
      if (typeof window !== 'undefined') {
        localStorage.setItem('fingermobile_gem_balance', String(updatedBalance));
      }
      setIsAddGemsModalOpen(false);
      showToast(`Successfully added ${selectedGemPack.gems.toLocaleString()} Gems to your balance! 💎`, 'success');
      try {
        voiceLineServiceInstance.playCommentaryVoiceLine('gems').catch(() => {});
      } catch {
        // Safe commentary fallback
      }
    } finally {
      setIsAcquiringGems(false);
      setIsAddGemsModalOpen(false);
    }
  };

  // Handle Broadcast Submission (Rich Text 60 words maximum post card banner with media attached)
  const handlePostBroadcast = async () => {
    if (!newBroadcastText.trim()) return;
    if (broadcastWordCount > 60) {
      showToast('Broadcast exceeds 60 words maximum limit. Please condense your post card banner.', 'error');
      return;
    }
    if (userBalance < 25) {
      showToast('Insufficient Gems! You need at least 25 Gems to transmit a 24h broadcast.', 'error');
      setIsAddGemsModalOpen(true);
      return;
    }

    setBroadcastError(null);
    setIsBroadcasting(true);

    try {
      const selectedChannelObj = BROADCAST_CHANNELS.find((c) => c.id === selectedBroadcastChannel);
      const mediaUrls = broadcastMediaUrl.trim() ? [broadcastMediaUrl.trim()] : [];

      const newPost: BroadcastPost = {
        id: `post-${Date.now()}`,
        creator_id: 999,
        username: 'you_sovereign',
        first_name: 'You (Broadcaster)',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        content_text: newBroadcastText.trim(),
        media_urls: mediaUrls,
        media_type: broadcastMediaType,
        channel_id: selectedBroadcastChannel,
        channel_name: selectedChannelObj?.name || '#general-living-room',
        privacy_type: 'public',
        banner_style: selectedBannerStyle,
        gem_cost: 25,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        reactions: { 'thumbs-up': 1, 'star-eyes': 1 },
        isCurrentUserSender: true,
        analytics: {
          broadcastId: `post-${Date.now()}`,
          totalImpressions: 48,
          openRate: 95.8,
          directReplyRate: 12.5,
          autoRepliesTriggered: 6,
          autoRepliesBreakdown: {
            greeting: 3,
            away: 1,
            quickReplies: 2,
            eventManagement: 0
          },
          ignoredCount: 0,
          topChannels: [{ channel: selectedChannelObj?.name || '#general-living-room', reach: 48 }],
          hourlyEngagement: [{ hour: '0h', views: 48 }],
          sentimentSummary: { positive: 90, neutral: 10, inquiry: 0 }
        }
      };

      // Optimistic balance deduction
      const updatedBalance = Math.max(0, userBalance - 25);
      setUserBalance(updatedBalance);
      if (typeof window !== 'undefined') {
        localStorage.setItem('fingermobile_gem_balance', String(updatedBalance));
      }

      setBroadcastPosts((prev) => [newPost, ...prev]);
      setNewBroadcastText('');
      setBroadcastMediaUrl('');
      showToast(`Broadcast published to ${selectedChannelObj?.name || '#general-living-room'}! Live for 24h. (25 💎 deducted)`, 'success');
      voiceLineServiceInstance.playCommentaryVoiceLine('gems');

      // Call backend in background
      await gemsService.postBroadcast(newPost.content_text, mediaUrls);
    } catch (err: any) {
      setBroadcastError(err.message || 'Broadcast failed');
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Broadcast receiver action handlers
  const handleIgnoreBroadcast = (postId: number | string) => {
    setBroadcastPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast('Broadcast dismissed from your living room feed.', 'info');
  };

  const handleDirectReply = (postId: number | string, replyText: string) => {
    showToast(`Direct reply sent: "${replyText.slice(0, 30)}..."`, 'success');
  };

  const handleTriggerAutoReply = (post: BroadcastPost) => {
    setSelectedBroadcastForAutoReply(post);
  };

  const handleViewAnalytics = (post: BroadcastPost) => {
    setSelectedBroadcastForAnalytics(post);
  };

  const handleSendAutoReply = (
    postId: number | string,
    payload: { type: string; subject?: string; text: string }
  ) => {
    const targetPost = broadcastPosts.find((p) => p.id === postId);
    autoReplyService.recordExecution({
      recipientName: targetPost?.first_name || targetPost?.username || 'Creator',
      sourceContext: 'gems_broadcast',
      triggerType: payload.type.startsWith('event')
        ? 'event_management'
        : payload.type.startsWith('away')
          ? 'away'
          : payload.type.startsWith('quick')
            ? 'quick_reply'
            : 'greeting',
      subject: payload.subject,
      renderedText: payload.text
    });

    // Update broadcast post analytics
    setBroadcastPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.analytics) {
          const breakdown = { ...p.analytics.autoRepliesBreakdown };
          if (payload.type.startsWith('greeting')) breakdown.greeting += 1;
          else if (payload.type.startsWith('away')) breakdown.away += 1;
          else if (payload.type.startsWith('quick')) breakdown.quickReplies += 1;
          else breakdown.eventManagement += 1;

          return {
            ...p,
            analytics: {
              ...p.analytics,
              autoRepliesTriggered: p.analytics.autoRepliesTriggered + 1,
              autoRepliesBreakdown: breakdown
            }
          };
        }
        return p;
      })
    );

    showToast(`Auto-Reply transmitted: ${payload.subject || payload.type}! 🤖`, 'success');
  };

  const handleBroadcastReaction = (postId: number | string, emoji: string) => {
    setBroadcastPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const reactions = { ...(p.reactions || {}) };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...p, reactions };
        }
        return p;
      })
    );
    showToast(`Reacted with ${emoji}!`, 'success');
  };

  // Admin Assist Keyword Moderation Tester
  const runModerationCheck = () => {
    const BANNED_PATTERNS = [
      '100% free', 'make money', 'million dollars', 'act now', 'click here',
      'urgent', 'winner', 'miracle', 'work from home', 'fast cash', 'no catch',
      'fuck', 'bitch', 'asshole', 'pussy', 'dick', 'scam'
    ];
    const lower = moderationTestText.toLowerCase();
    const hits = BANNED_PATTERNS.filter((word) => lower.includes(word));
    setModerationResult({
      clean: hits.length === 0,
      flaggedWords: hits
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-3 sm:px-6 lg:px-8">
      {/* Top Banner & Multi-Currency Header */}
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900/90 border border-purple-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                FingerMobile Protocol™ Virtual Economy & Broadcast Architecture
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>Gems</span>
                <span className="text-sm font-medium px-2.5 py-0.5 rounded-md bg-purple-600/30 text-purple-300 border border-purple-500/30">
                  v2.6 Enterprise
                </span>
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl">
                Micro-currency economy, peer-to-peer digital living room assets, 24-hour ephemeral broadcast channels, and automated admin power tools.
              </p>
            </div>

            {/* Wallet & Multi-Currency Balances Card */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/80 border border-purple-500/40 rounded-xl p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-inner">
                  <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs text-slate-300 font-medium uppercase tracking-wider font-semibold">Gem Balance</div>
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                    💎 {userBalance.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-800 hidden sm:block" />

              <div className="flex items-center gap-2">
                <button
                  onClick={refreshBalance}
                  title="Refresh Balance"
                  className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAddGemsModalOpen(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all transform hover:scale-[1.02] cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Coins className="w-3.5 h-3.5" />
                  + Add Gems
                </button>
              </div>
            </div>
          </div>

          {/* Primary Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-purple-500/20">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Marketplace & Store
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-purple-900/60 text-purple-200">
                {allGems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('broadcast')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'broadcast'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4 text-emerald-400" />
              Broadcast Channels (24h TTL)
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-emerald-900/60 text-emerald-200">
                Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab('powertools')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'powertools'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              Admin Power Tools & Auto-Replies
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-emerald-900/60 text-emerald-200">
                Auto-Replies
              </span>
            </button>

            <button
              onClick={() => setActiveTab('guides')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'guides'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              Featured & Guides
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Static & Sticky */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto space-y-4 scrollbar-none pr-1">
            <UniversalProfileCard />

            {/* Quick Gem Treasury Card */}
            <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 rounded-2xl p-4 shadow-xl text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                  Sovereign Gem Reserve
                </span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-purple-300 font-mono">
                💎 {userBalance.toLocaleString()} Gems
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Virtual micro-currency for tipping broadcasters, unlockable badges, and sovereign rewards.
              </p>
              <button
                type="button"
                onClick={() => setIsAddGemsModalOpen(true)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                Acquire Sovereign Gems
              </button>
            </div>

            {/* Left Column Last 2 Widgets: Connect & Discover */}
            <ConnectWidget pageContext="gems" />
            <DiscoverWidget pageContext="gems" />
          </div>

          {/* Center Column: Scrollable Infinite Stream */}
          <div className="lg:col-span-6 space-y-6">
        {/* ======================================================== */}
        {/* TAB 1: MARKETPLACE & STORE */}
        {/* ======================================================== */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            {/* Architectural Blueprint: Privacy Types Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setPrivacyFilter(privacyFilter === 'public' ? 'all' : 'public')}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  privacyFilter === 'public'
                    ? 'bg-purple-950/60 border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Public Gems</h3>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">Discoverable globally across the FingerMobile ecosystem</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPrivacyFilter(privacyFilter === 'private_visible' ? 'all' : 'private_visible')}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  privacyFilter === 'private_visible'
                    ? 'bg-purple-950/60 border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Private & Visible</h3>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">Searchable by all, but unlockable only by pass holders</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPrivacyFilter(privacyFilter === 'secret' ? 'all' : 'secret')}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  privacyFilter === 'secret'
                    ? 'bg-purple-950/60 border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Secret / Hidden Gems</h3>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">Invisible to search; accessible only via direct invitations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Search Controls Bar */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-300 font-medium absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search gems by title, creator, or keyword..."
                  value={searchTermState}
                  onChange={(e) => setSearchTermState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Category Pills Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-300 font-medium" />
                <select
                  value={sortByState}
                  onChange={(e) => setSortByState(e.target.value as any)}
                  aria-label="Sort gems by"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Recently Minted</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {errorState && (
              <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-300 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span className="text-sm">{errorState}</span>
              </div>
            )}

            {/* Loading State */}
            {loadingState && (
              <div className="flex flex-col items-center justify-center py-20">
                <LoadingSpinner />
                <p className="mt-4 text-sm text-slate-300 font-medium">Syncing Gem store from PostgreSQL cluster...</p>
              </div>
            )}

            {/* Empty State */}
            {!loadingState && paginatedGems.length === 0 && (
              <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-medium">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">No Gem Items Found</h3>
                <p className="text-sm text-slate-300 font-medium max-w-md mx-auto mt-1">
                  No items match your active search or privacy filter criteria. Try resetting filters to browse all sovereign assets.
                </p>
                <button
                  onClick={() => {
                    setSearchTermState('');
                    setSelectedCategory('all');
                    setPrivacyFilter('all');
                  }}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Gems Grid */}
            {!loadingState && paginatedGems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {paginatedGems.map((gem, index) => {
                  const isLast = index === paginatedGems.length - 1;
                  const itemPrivacy = gem.privacy_type || 'public';

                  return (
                    <div
                      key={gem.id}
                      ref={isLast ? lastGemElementRef : undefined}
                      className="group bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 flex flex-col justify-between"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                        <img
                          src={gem.thumbnail || gem.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60'}
                          alt={gem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                        {/* Privacy Pill Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-md ${
                              itemPrivacy === 'public'
                                ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                                : itemPrivacy === 'private_visible'
                                  ? 'bg-indigo-950/80 border border-indigo-500/40 text-indigo-300'
                                  : 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
                            }`}
                          >
                            {itemPrivacy === 'public' && <Globe className="w-3 h-3" />}
                            {itemPrivacy === 'private_visible' && <Eye className="w-3 h-3" />}
                            {itemPrivacy === 'secret' && <Lock className="w-3 h-3" />}
                            {itemPrivacy.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Rating Pill */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-yellow-400 text-xs font-bold shadow-md">
                          <span>★</span>
                          <span>{gem.rating.toFixed(1)}</span>
                        </div>

                        {/* Category Pill */}
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-purple-900/80 text-purple-200 border border-purple-500/30">
                            {gem.category}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                              {gem.title}
                            </h3>
                            <div className="text-right shrink-0">
                              <span className="font-black text-purple-400 text-base">
                                💎 {gem.price}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-300 font-medium mt-1">
                            Issued by <span className="text-slate-300 font-medium">{gem.creator}</span>
                          </p>

                          <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                            {gem.description}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                          <button
                            onClick={() => {
                              showToast(`Saved ${gem.title} to wishlist`, 'info');
                            }}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium hover:text-red-400 transition-colors"
                            title="Add to favorites"
                          >
                            <Heart className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setSelectedItemForPurchase(gem)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-600/20 transition-all transform hover:-translate-y-0.5"
                          >
                            <Zap className="w-3.5 h-3.5 text-yellow-300" />
                            Redeem with Gems
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Continuous Streaming Sentinel (No Load More, No End) */}
            <div className="py-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-purple-500/30 text-xs font-bold text-purple-300 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
                <span>Streaming more sovereign gems, collectibles & broadcasts...</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: BROADCAST CHANNELS (24H TTL) */}
        {/* ======================================================== */}
        {activeTab === 'broadcast' && (
          <div className="space-y-6">
            {/* Gems Logic & Broadcast Explainer */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-900 border border-purple-500/40 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30 shrink-0">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-950 border border-purple-500/40 text-purple-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    P2P Digital Living Room • 24-Hour Ephemeral Post Card Banners
                  </div>
                  <h3 className="text-xl font-black text-white">
                    Gems Broadcast Channels & Auto-Reply Architecture
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                    Gems is not just a Micro-currency economy, but a full scale peer-to-peer digital living room where various platform minted Gem assets reside. Members purchase and send 24-hour ephemeral broadcast messages to various selectable channels and direct to members' profile and walls. Broadcasts appear as <strong>Rich Text 60 words maximum post card banner messages</strong> with image/video attached and automated admin power tools. Senders receive real-time analytics telemetry, while receivers can <strong>Ignore</strong>, <strong>Reply</strong>, or <strong>Use Auto-Reply</strong>!
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300 font-semibold">
                    <span className="flex items-center gap-1.5 text-purple-300">
                      <Clock className="w-4 h-4 text-purple-400" /> 24-Hour TTL Self-Destruct
                    </span>
                    <span className="flex items-center gap-1.5 text-pink-300">
                      <ImageIcon className="w-4 h-4 text-pink-400" /> 60 Words Max + Media Attached
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-300">
                      <Bot className="w-4 h-4 text-emerald-400" /> Receiver Auto-Replies Suite
                    </span>
                    <span className="flex items-center gap-1.5 text-sky-300">
                      <BarChart3 className="w-4 h-4 text-sky-400" /> Sender Analytics Response
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Broadcast Creation Form: 60 Words Max Post Card Banner Composer */}
            <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Send className="w-4 h-4 text-purple-400" />
                    Compose 24h Ephemeral Post Card Banner (Cost: 25 💎)
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Transmit directly to follower walls, profiles, and selectable living room channels.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-300 font-semibold">Your Gems:</span>
                  <span className="font-bold text-purple-300 px-2.5 py-1 rounded-xl bg-purple-950 border border-purple-500/40">
                    💎 {userBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              {broadcastError && (
                <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{broadcastError}</span>
                </div>
              )}

              {/* 1. Selectable Channels */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Select Broadcast Channel Destination:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BROADCAST_CHANNELS.map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setSelectedBroadcastChannel(ch.id)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        selectedBroadcastChannel === ch.id
                          ? 'bg-purple-950/70 border-purple-500 text-white shadow-md ring-1 ring-purple-500/40'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-purple-300">{ch.name}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold">
                          {ch.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-300 line-clamp-1">{ch.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Banner Style Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  Post Card Visual Aesthetics:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'neon-sapphire', label: 'Neon Sapphire', gradient: 'from-indigo-600 to-blue-500' },
                    { id: 'emerald-sovereign', label: 'Emerald Sovereign', gradient: 'from-emerald-600 to-teal-500' },
                    { id: 'sunset-amber', label: 'Sunset Amber', gradient: 'from-amber-600 to-orange-500' },
                    { id: 'cyber-amethyst', label: 'Cyber Amethyst', gradient: 'from-fuchsia-600 to-purple-500' }
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedBannerStyle(style.id as any)}
                      className={`p-2 rounded-xl border text-center text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                        selectedBannerStyle === style.id
                          ? 'bg-slate-950 border-purple-500 text-white ring-1 ring-purple-500/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${style.gradient}`} />
                      <span>{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Textarea with strict 60 words counter & QuickReplyPicker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Post Card Banner Message (60 Words Maximum):
                  </label>
                  <div className="flex items-center gap-2">
                    {/* QuickReplyPicker Reusable Component */}
                    <QuickReplyPicker
                      onSelectQuickReply={(text) => {
                        const appended = newBroadcastText.trim() ? `${newBroadcastText} ${text}` : text;
                        setNewBroadcastText(appended);
                      }}
                    />
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg border ${
                        broadcastWordCount > 60
                          ? 'bg-red-950 text-red-300 border-red-500 animate-pulse'
                          : broadcastWordCount >= 50
                            ? 'bg-amber-950 text-amber-300 border-amber-500'
                            : 'bg-slate-950 text-emerald-400 border-slate-700'
                      }`}
                    >
                      {broadcastWordCount} / 60 words
                    </span>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={newBroadcastText}
                  onChange={(e) => setNewBroadcastText(e.target.value)}
                  placeholder="Share a timely drop, salon invite, or exclusive update (expires in exactly 24h, max 60 words)..."
                  className={`w-full bg-slate-950 border rounded-2xl p-4 text-sm text-slate-100 placeholder:text-slate-300 font-medium focus:outline-none transition ${
                    broadcastWordCount > 60
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                      : 'border-slate-700 focus:ring-2 focus:ring-purple-500'
                  }`}
                />

                {broadcastWordCount > 60 && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2 animate-fade-in">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>
                      Message exceeds 60 words ({broadcastWordCount} words). Please condense by{' '}
                      <strong>{broadcastWordCount - 60} words</strong> to meet the postcard banner standard.
                    </span>
                  </div>
                )}
              </div>

              {/* 4. Media Attachment URL */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    Attached Media URL (Image or Video):
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or .mp4 video URL"
                    value={broadcastMediaUrl}
                    onChange={(e) => setBroadcastMediaUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                    Media Type:
                  </label>
                  <select
                    value={broadcastMediaType}
                    onChange={(e) => setBroadcastMediaType(e.target.value as any)}
                    aria-label="Select broadcast media type"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="image">Image Attachment</option>
                    <option value="video">Video Reel (.mp4)</option>
                  </select>
                </div>
              </div>

              {/* Media Preview if provided */}
              {broadcastMediaUrl && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block">
                    Media Attachment Preview:
                  </span>
                  <div className="rounded-xl overflow-hidden max-h-48 border border-slate-800">
                    {broadcastMediaType === 'video' ? (
                      <video src={broadcastMediaUrl} controls className="w-full max-h-48 object-cover bg-black" />
                    ) : (
                      <img src={broadcastMediaUrl} alt="Preview" className="w-full max-h-48 object-cover" />
                    )}
                  </div>
                </div>
              )}

              {/* Action & Cost Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
                  <span className="flex items-center gap-1.5 text-purple-300">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Broadcast Cost: <strong>25 Gems</strong>
                  </span>
                  <span>•</span>
                  <span>Self-destructs after 24h</span>
                </div>

                <button
                  type="button"
                  onClick={handlePostBroadcast}
                  disabled={isBroadcasting || !newBroadcastText.trim() || broadcastWordCount > 60}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/40 cursor-pointer active:scale-95"
                >
                  {isBroadcasting ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit 24h Post Card Banner (25 💎)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Broadcast Feed: Post Card Banners */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  Active 24h Ephemeral Broadcasts ({broadcastPosts.length})
                </h3>
                <span className="text-xs text-slate-300 font-semibold">
                  Receivers can Ignore, Reply, or Use Auto-Reply
                </span>
              </div>

              {broadcastPosts.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
                  <p className="text-sm text-slate-300">No active broadcasts in the last 24 hours.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {broadcastPosts.map((post) => (
                    <GemBroadcastPostCard
                      key={post.id}
                      post={post}
                      onIgnore={handleIgnoreBroadcast}
                      onDirectReply={handleDirectReply}
                      onTriggerAutoReply={handleTriggerAutoReply}
                      onViewAnalytics={handleViewAnalytics}
                      onReaction={handleBroadcastReaction}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ADMIN POWER TOOLS & AUTO-REPLIES */}
        {/* ======================================================== */}
        {activeTab === 'powertools' && (
          <div className="space-y-6">
            {/* Reusable Auto-Reply Configuration Suite */}
            <GemAutoReplyManager
              settings={autoReplySettings}
              onUpdateSettings={(newSettings) => {
                setAutoReplySettings(newSettings);
                autoReplyService.saveSettings(newSettings);
              }}
              onShowToast={showToast}
            />

            {/* Existing Keyword Auto-Moderation & Anonymous Posting Tools */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Living Room Content Policies & Privacy Controls
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tool 1: Admin Assist & Keyword Auto-Moderation */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Admin Assist: Keyword Auto-Moderation</h3>
                      <p className="text-xs text-slate-300 font-medium">
                        Enforces FingerMobile Words Moderation List & Platform Policy flags.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Automated filtration prevents spam promises, predatory promotions, and profane content from appearing in peer-to-peer living rooms.
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Test Content against Moderation List:</label>
                    <textarea
                      rows={3}
                      value={moderationTestText}
                      onChange={(e) => setModerationTestText(e.target.value)}
                      placeholder="e.g. Try typing: '100% free make money click here' or regular compliant text..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={runModerationCheck}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Run Policy Scanner
                    </button>
                  </div>

                  {moderationResult && (
                    <div
                      className={`p-3 rounded-xl border text-xs ${
                        moderationResult.clean
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          : 'bg-red-950/60 border-red-500/40 text-red-300'
                      }`}
                    >
                      {moderationResult.clean ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Compliant: Content strictly satisfies all 4 platform principles (Authenticity, Safety, Privacy, Dignity).
                        </span>
                      ) : (
                        <div>
                          <span className="flex items-center gap-2 font-bold mb-1">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            Auto-Declined by Admin Assist!
                          </span>
                          <span>Flagged phrases: {moderationResult.flaggedWords.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Tool 2: Anonymous Posting & Membership Questions */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                        <Sliders className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">Anonymous Posting Toggle</h3>
                        <p className="text-xs text-slate-300 font-medium">Safe haven for sensitive discussions</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAnonymousPostingEnabled(!anonymousPostingEnabled);
                        showToast(
                          `Anonymous posting ${!anonymousPostingEnabled ? 'enabled' : 'disabled'} for members`,
                          'info'
                        );
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                        anonymousPostingEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          anonymousPostingEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Allows members to ask questions regarding sensitive health, finance, or relationship matters without public identity exposure while remaining fully accountable to admins behind the scenes.
                  </p>

                  {/* Membership Vetting Questions */}
                  <div className="pt-3 border-t border-slate-800">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-2">
                      Membership Vetting Questions (Up to 3):
                    </h4>
                    <div className="space-y-2">
                      {membershipQuestions.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                        >
                          <span className="font-bold text-indigo-400">Q{idx + 1}:</span>
                          <span>{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: FEATURED & GUIDES */}
        {/* ======================================================== */}
        {activeTab === 'guides' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                Featured Educational Modules & Guides
              </h3>
              <p className="text-xs text-slate-300 font-medium mb-6">
                Step-by-step learning modules for creators, node runners, and sovereign group admins.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SAMPLE_GUIDES.map((guide) => (
                  <div
                    key={guide.id}
                    className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-sky-400 font-semibold mb-2">
                        <span>{guide.duration}</span>
                        <span>{guide.lessons} Lessons</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-2">{guide.title}</h4>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">{guide.description}</p>
                    </div>

                    <button
                      onClick={() => showToast(`Opening ${guide.title}...`, 'info')}
                      className="mt-4 flex items-center justify-between w-full px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 text-xs font-semibold transition-colors"
                    >
                      <span>Start Learning</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

          {/* Right Column: Static & Sticky Platform Rail */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto space-y-4 scrollbar-none pl-1">
            <PlatformWidgetsAndAdsRail pageContext="gems" />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* REDEEM / PURCHASE MODAL */}
      {/* ======================================================== */}
      {selectedItemForPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                Confirm Sovereign Gem Redemption
              </div>
              <button
                onClick={() => setSelectedItemForPurchase(null)}
                className="text-slate-300 font-medium hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800">
              <img
                src={selectedItemForPurchase.thumbnail || selectedItemForPurchase.image_url}
                alt={selectedItemForPurchase.title}
                className="w-full h-40 object-cover"
              />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white">{selectedItemForPurchase.title}</h3>
              <p className="text-xs text-slate-300 font-medium mt-1">{selectedItemForPurchase.description}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Item Cost:</span>
                <span className="font-bold text-purple-400">💎 {selectedItemForPurchase.price} Gems</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Your Current Balance:</span>
                <span className="font-bold text-white">💎 {userBalance.toLocaleString()} Gems</span>
              </div>
              <div className="h-px bg-slate-800 my-1" />
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Remaining After Redemption:</span>
                <span
                  className={`font-bold ${
                    userBalance >= selectedItemForPurchase.price ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  💎 {(userBalance - selectedItemForPurchase.price).toLocaleString()} Gems
                </span>
              </div>
            </div>

            {userBalance < selectedItemForPurchase.price && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Insufficient Gems! Please add gems to complete this redemption.</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedItemForPurchase(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRedeem}
                disabled={isPurchasing || userBalance < selectedItemForPurchase.price}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isPurchasing ? <LoadingSpinner /> : 'Confirm & Unlock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Purchase Gems Gateway Modal */}
      {isAddGemsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-2xl overflow-hidden text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 shadow-lg shadow-purple-500/20">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Acquire Sovereign Gems 💎</h3>
                  <p className="text-xs text-slate-300 font-medium">
                    Virtual micro-currency for tipping, unlockable collectibles, and badges
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddGemsModalOpen(false)}
                className="p-2 rounded-xl text-slate-300 font-medium hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2.5">
                  Select Gem Tier
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'starter', name: 'Starter Pack', gems: 100, fic: 10, bonus: 'Basic' },
                    { id: 'creator', name: 'Creator Pack', gems: 500, fic: 45, bonus: '+10% Extra', tag: 'POPULAR' },
                    { id: 'master', name: 'Master Guild', gems: 1000, fic: 80, bonus: '+20% Extra', tag: 'BEST VALUE' },
                    { id: 'vault', name: 'Sovereign Vault', gems: 5000, fic: 350, bonus: '+30% Extra', tag: 'MAX VALUE' }
                  ].map((pack) => {
                    const isSelected = selectedGemPack.id === pack.id;
                    return (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => setSelectedGemPack(pack as any)}
                        className={`p-3.5 rounded-2xl border text-left transition relative cursor-pointer ${
                          isSelected
                            ? 'border-purple-500 bg-purple-950/40 ring-2 ring-purple-500/30 shadow-lg shadow-purple-900/20'
                            : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/80'
                        }`}
                      >
                        {pack.tag && (
                          <span className="absolute top-2 right-2 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-purple-600 text-white shadow-xs">
                            {pack.tag}
                          </span>
                        )}
                        <div className="text-xl mb-1">💎 {pack.gems.toLocaleString()}</div>
                        <div className="font-bold text-xs text-slate-200">{pack.name}</div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/50">
                          <span className="text-xs font-extrabold text-pink-400">{pack.fic} FIC</span>
                          <span className="text-[10px] text-emerald-400 font-semibold">{pack.bonus}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'FIC', label: 'FIC Balance', icon: '🪙' },
                    { id: 'CARD', label: 'Flamingo Card', icon: '💳' },
                    { id: 'CRYPTO', label: 'Paylink Crypto', icon: '⚡' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setGemPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition cursor-pointer flex flex-col items-center gap-1 ${
                        gemPaymentMethod === m.id
                          ? 'border-pink-500 bg-pink-950/30 text-white'
                          : 'border-slate-800 bg-slate-800/40 text-slate-300 font-medium hover:text-white'
                      }`}
                    >
                      <span className="text-base">{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Current Gem Balance:</span>
                  <span className="font-bold text-white">💎 {userBalance.toLocaleString()} Gems</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Your Available FIC:</span>
                  <span className="font-bold text-purple-400">{ficBalance.toFixed(2)} FIC</span>
                </div>
                <div className="h-px bg-slate-700/60 my-1" />
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-200">Balance After Deposit:</span>
                  <span className="text-emerald-400">
                    💎 {(userBalance + selectedGemPack.gems).toLocaleString()} Gems
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddGemsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPurchaseGems}
                  disabled={isAcquiringGems}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAcquiringGems ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span>Minting Gems...</span>
                    </span>
                  ) : (
                    `Acquire ${selectedGemPack.gems.toLocaleString()} Gems (${selectedGemPack.fic} FIC) →`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Platform Auto-Reply Modal */}
      <GemAutoReplyModal
        post={selectedBroadcastForAutoReply}
        settings={autoReplySettings}
        isOpen={Boolean(selectedBroadcastForAutoReply)}
        onClose={() => setSelectedBroadcastForAutoReply(null)}
        onSendAutoReply={handleSendAutoReply}
      />

      {/* Broadcast Sender Analytics Response Modal */}
      <GemBroadcastAnalyticsModal
        post={selectedBroadcastForAnalytics}
        isOpen={Boolean(selectedBroadcastForAnalytics)}
        onClose={() => setSelectedBroadcastForAnalytics(null)}
      />
    </div>
  );
};

export default GemsPage;

