/*
 * FingerMobile Protocol™ - Blogs Page Component (Ultra-Premium Redesign)
 * Copyright © 2025-2026 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import UniversalProfileCard from '../components/common/UniversalProfileCard';
import { useHaptic } from '../contexts/HapticFeedbackContext';
import { useCommunity } from '../contexts/CommunityContext';
import MainLayout from '../components/layout/MainLayout';
import { useBlogPosts, type BlogPost } from '../hooks/useBlogPosts';
import { PlatformWidgetsAndAdsRail } from '../components/widgets/PlatformWidgetsAndAdsRail';
import ConnectWidget from '../components/widgets/ConnectWidget';
import DiscoverWidget from '../components/widgets/DiscoverWidget';
import voiceLineServiceInstance from '../services/VoiceLineService';
import {
  ShieldCheck,
  Sparkles,
  Search,
  BookOpen,
  Bookmark,
  Heart,
  MessageSquare,
  Gift,
  Link as LinkIcon,
  Eye,
  Clock,
  LayoutGrid,
  List,
  ArrowUpRight,
  TrendingUp,
  Award,
  CheckCircle2,
  X,
  Trash2,
  Coins,
  FileText,
  Flame,
  Plus,
  PlusCircle,
  Share2,
  Layers,
  Cpu,
  Music,
  Scale,
  Compass,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import BlogComposerModal from '../components/blog/BlogComposerModal';
import {
  BlogCommentModal,
  BlogSendGiftModal,
  BlogPaylinkModal,
  BlogTokenizeModal
} from '../components/blog/BlogActionModals';
import { ApiService } from '../services/api';

const BlogsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, ficBalance } = useAppContext();
  const { triggerHaptic } = useHaptic();
  const { displayOption, setDisplayOption } = useCommunity();
  const { blogPosts, loading, error, addBlogPost, toggleLike, setBlogPosts } = useBlogPosts();

  // Search, Filter, Sort & Tabs
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'liked'>('recent');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'dispatches' | 'spotlight' | 'reading-list' | 'monetization'>('dispatches');

  // Interactive Modals State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedPostForAction, setSelectedPostForAction] = useState<BlogPost | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isPaylinkModalOpen, setIsPaylinkModalOpen] = useState(false);
  const [isTokenizeModalOpen, setIsTokenizeModalOpen] = useState(false);
  const [readerPost, setReaderPost] = useState<BlogPost | null>(null);

  // Bookmarked posts store
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Infinite scroll items & state
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<BlogPost[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login state
  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    setIsLoggedIn(!!token || !!user);
  }, []);

  // Initialize items from hook
  useEffect(() => {
    if (blogPosts && blogPosts.length > 0) {
      setItems(blogPosts);
      // Pre-seed bookmarked items
      const seeded = new Set<string>();
      blogPosts.forEach(p => {
        if (p.isBookmarked) seeded.add(p.id);
      });
      setBookmarkedIds(seeded);
    }
  }, [blogPosts]);

  const handleHaptic = useCallback(() => {
    triggerHaptic('selection');
  }, [triggerHaptic]);

  // Infinite scroll observer & generator (No Load More, No End)
  const blogSentinelRef = useRef<HTMLDivElement>(null);

  const loadMoreItems = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const source = (items.length > 0) ? items : (blogPosts || []);
    if (source && source.length > 0) {
      const newItems = [...source].slice(0, 4).map((post, index) => ({
        ...post,
        id: `blog-inf-${page}-${post.id}-${index}-${Date.now()}`,
        title: `${post.title} (Dispatch Volume #${page}.${index + 1})`,
        views: (post.views || 100) + Math.floor(Math.random() * 200) + 50
      }));

      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
    }
    setIsLoadingMore(false);
  }, [blogPosts, isLoadingMore, items, page]);

  useEffect(() => {
    if (!blogSentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMoreItems();
        }
      },
      { threshold: 0.1, rootMargin: '600px' }
    );
    observer.observe(blogSentinelRef.current);
    return () => observer.disconnect();
  }, [loadMoreItems, isLoadingMore]);

  // All combined posts
  const allPosts = useMemo(() => {
    return items.length > 0 ? items : (blogPosts || []);
  }, [items, blogPosts]);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allPosts.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['all', ...Array.from(set)];
  }, [allPosts]);

  // Popular Tags
  const popularTags = useMemo(() => {
    const counts: Record<string, number> = {};
    allPosts.forEach(p => {
      p.tags?.forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [allPosts]);

  // Filtered & Sorted Posts
  const filteredPosts = useMemo(() => {
    return allPosts
      .filter((post: BlogPost) => {
        const matchesSearch =
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
        const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
        const isBookmarked = bookmarkedOnly ? bookmarkedIds.has(post.id) : true;

        return matchesSearch && matchesCategory && matchesTag && isBookmarked;
      })
      .sort((a: BlogPost, b: BlogPost) => {
        if (sortBy === 'recent') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
        if (sortBy === 'liked') return (b.likes || 0) - (a.likes || 0);
        return 0;
      });
  }, [allPosts, searchTerm, categoryFilter, selectedTag, bookmarkedOnly, bookmarkedIds, sortBy]);

  // Spotlight Top Article
  const spotlightPost = useMemo(() => {
    if (allPosts.length === 0) return null;
    return [...allPosts].sort((a, b) => (b.views + b.likes * 2) - (a.views + a.likes * 2))[0];
  }, [allPosts]);

  // Action Handlers
  const handleLike = async (postId: string) => {
    handleHaptic();
    const res = await toggleLike(postId);
    if (res?.success) {
      showToast('Article appreciated! +1 Like recorded ✨', 'success');
    } else {
      showToast(res?.message || 'Article liked locally', 'info');
    }
  };

  const handleBookmarkToggle = (postId: string) => {
    handleHaptic();
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
        showToast('Removed from reading list', 'info');
      } else {
        next.add(postId);
        showToast('Saved to sovereign reading list! 📚', 'success');
      }
      return next;
    });
  };

  const handleOpenComment = (post: BlogPost) => {
    handleHaptic();
    voiceLineServiceInstance.playCommentaryVoiceLine('blogs');
    setSelectedPostForAction(post);
    setIsCommentModalOpen(true);
  };

  const handleOpenGift = (post: BlogPost) => {
    handleHaptic();
    setSelectedPostForAction(post);
    setIsGiftModalOpen(true);
  };

  const handleOpenPaylink = (post: BlogPost) => {
    handleHaptic();
    setSelectedPostForAction(post);
    setIsPaylinkModalOpen(true);
  };

  const handleOpenTokenize = (post: BlogPost) => {
    handleHaptic();
    setSelectedPostForAction(post);
    setIsTokenizeModalOpen(true);
  };

  const handleDeletePost = async (postId: string) => {
    handleHaptic();
    if (window.confirm('Are you sure you want to permanently delete this sovereign dispatch?')) {
      try {
        await ApiService.request(`/blogs/posts/${postId}`, { method: 'DELETE' });
      } catch (e) {
        console.warn('Backend delete notification:', e);
      }
      setBlogPosts(prev => prev.filter(p => p.id !== postId));
      setItems(prev => prev.filter(p => p.id !== postId));
      showToast('Dispatch deleted successfully.', 'success');
    }
  };

  const handleShare = (post: BlogPost) => {
    handleHaptic();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Dispatch URL copied to clipboard! 🔗', 'success');
    }
  };

  // Metrics
  const totalViews = useMemo(() => allPosts.reduce((acc, p) => acc + (p.views || 0), 0), [allPosts]);
  const totalTipsFic = useMemo(() => allPosts.reduce((acc, p) => acc + (p.likes * 5 || 0), 0), [allPosts]);
  const totalAuthors = useMemo(() => {
    const ids = new Set(allPosts.map(p => p.author?.id || p.author?.membername || 'anon'));
    return ids.size;
  }, [allPosts]);

  if (loading && allPosts.length === 0) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
            Synchronizing Sovereign Editorial Dispatches...
          </span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50/70 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">
        <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 overflow-x-hidden">

          {/* ========================================================================= */}
          {/* 1. FLAGSHIP EXECUTIVE HERO SECTION (Exact Hallmarks Styling)              */}
          {/* ========================================================================= */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 md:p-10 shadow-2xl border border-slate-800">
            {/* Ambient Background Glow Spheres */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-400/40 text-orange-400 text-xs font-black tracking-wider uppercase backdrop-blur-sm">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span>Sovereign Editorial & Long-Form UGC Dispatch Hub</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  FingerMobile Blogs™{' '}
                  <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                    Sovereign UGC Studio
                  </span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Decentralized editorial articles, long-form technical dispatches, and sovereign curriculum. Monetize high-value insights with automated FIC tips, cryptographic PayLinks, and WORM-notarized article minting.
                </p>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Dispatches</span>
                    <span className="text-xl font-black text-white">{allPosts.length} Published</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Verified Authors</span>
                    <span className="text-xl font-black text-emerald-400">{totalAuthors} Nodes</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Total Impressions</span>
                    <span className="text-xl font-black text-amber-400">{totalViews.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Tipping Pool</span>
                    <span className="text-xl font-black text-orange-400">{totalTipsFic.toLocaleString()} FIC</span>
                  </div>
                </div>
              </div>

              {/* Protocol Action Center Card */}
              <div className="w-full lg:w-80 flex flex-col gap-3 p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg shrink-0">
                <span className="text-xs font-black uppercase tracking-wider text-orange-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  Editorial Action Center
                </span>

                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Draft New Article</span>
                </button>

                <button
                  onClick={() => navigate('/blogs/templates')}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-amber-300" />
                  <span>Explore 5 SEO Templates</span>
                </button>

                <div className="text-[11px] text-slate-200 font-semibold text-center pt-1 border-t border-white/10">
                  Wallet Liquidity: <span className="font-bold text-emerald-400">{ficBalance.toLocaleString()} FIC</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. SUB-NAVIGATION TABS BAR                                                */}
          {/* ========================================================================= */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-300 pb-3">
            <div className="flex items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl border border-slate-300">
              <button
                onClick={() => { setActiveTab('dispatches'); handleHaptic(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'dispatches'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Layers className="w-4 h-4" />
                All Dispatches ({allPosts.length})
              </button>

              <button
                onClick={() => { setActiveTab('spotlight'); handleHaptic(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'spotlight'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Flame className="w-4 h-4 text-orange-400" />
                Editorial Spotlight
              </button>

              <button
                onClick={() => { setActiveTab('reading-list'); handleHaptic(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'reading-list'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Bookmark className="w-4 h-4 text-purple-500" />
                Saved Reading List ({bookmarkedIds.size})
              </button>

              <button
                onClick={() => { setActiveTab('monetization'); handleHaptic(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'monetization'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-500" />
                Creator Monetization
              </button>
            </div>

            {/* View Mode & Bookmarks Quick Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setBookmarkedOnly(!bookmarkedOnly); handleHaptic(); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  bookmarkedOnly
                    ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                }`}
                title="Filter bookmarked articles"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved Only</span>
              </button>

              <div className="flex items-center bg-white rounded-xl border border-slate-300 p-1 shadow-xs">
                <button
                  onClick={() => { setDisplayOption('card'); handleHaptic(); }}
                  className={`p-1.5 rounded-lg transition-all ${
                    displayOption === 'card' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setDisplayOption('row'); handleHaptic(); }}
                  className={`p-1.5 rounded-lg transition-all ${
                    displayOption === 'row' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: ALL DISPATCHES VIEW                                                */}
          {/* ========================================================================= */}
          {activeTab === 'dispatches' && (
            <div className="space-y-6">

              {/* SEARCH & CATEGORY CHIPS BAR */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-300 space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="text"
                      placeholder="Search dispatches by title, keyword, or author..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white text-slate-900 pl-10 pr-10 py-2.5 rounded-xl text-xs font-bold border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-400"
                    />
                    {searchTerm && (
                      <button type="button" aria-label="Close"
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-white text-slate-900 px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="popular">Top Reads (Views)</option>
                      <option value="liked">Most Appreciated</option>
                    </select>
                  </div>
                </div>

                {/* Category Pills Strip */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
                  {categories.map((cat) => {
                    const isActive = categoryFilter === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => { setCategoryFilter(cat); handleHaptic(); }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                          isActive
                            ? 'bg-orange-600 text-white border-orange-700 shadow-sm'
                            : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'all' ? 'All Topics' : cat}
                      </button>
                    );
                  })}
                  {selectedTag && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300">
                      <span>Tag: {selectedTag}</span>
                      <button aria-label="Close" type="button" onClick={() => setSelectedTag(null)} className="hover:text-red-700">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* MAIN 3-COLUMN LAYOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT COLUMN (3 cols): Static, does not scroll with page */}
                <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto space-y-4 scrollbar-none pr-1">
                  {/* Universal Profile Card */}
                  <UniversalProfileCard />

                  {/* Creator Monetization Card */}
                  <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-2xl p-5 border border-slate-800 text-white shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Your Liquid Treasury
                      </span>
                      <Coins className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="text-2xl font-black text-emerald-400 font-mono">
                      {ficBalance.toFixed(2)} FIC
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Instant reader tipping, automated 45/25/5/25 split distribution, and PayLink settlements.
                    </p>
                    <button
                      onClick={() => navigate('/financials')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      Manage Treasury
                    </button>
                  </div>

                  {/* Trending Sovereign Tags */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      Trending Protocol Topics
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {popularTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => { setSelectedTag(selectedTag === tag ? null : tag); handleHaptic(); }}
                          className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition ${
                            selectedTag === tag
                              ? 'bg-orange-500 text-white border-orange-600'
                              : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sovereign Editorial Standards */}
                  <div className="bg-amber-50 rounded-2xl p-5 border border-amber-300 text-xs text-amber-950 space-y-2">
                    <div className="font-bold flex items-center gap-1.5 text-sm text-amber-900">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      Sovereign Publishing Rules
                    </div>
                    <ul className="space-y-1.5 text-slate-800 leading-relaxed">
                      <li>• <strong>Originality:</strong> Evaluated by Guardian AI Contextual Engine.</li>
                      <li>• <strong>Anti-Abuse:</strong> 50-PIN rate limits & WORM immutability.</li>
                      <li>• <strong>Creator Split:</strong> 45% FIC / 25% Credit / 5% Stake / 25% Fund.</li>
                    </ul>
                  </div>

                  {/* Left Column Last 2 Widgets: Connect & Discover */}
                  <ConnectWidget pageContext="blogs" />
                  <DiscoverWidget pageContext="blogs" />
                </div>

                {/* CENTER COLUMN (6 cols): Scrollable, no load more, no end */}
                <div className="lg:col-span-6 space-y-6">
                  {filteredPosts.length > 0 ? (
                    <div
                      className={
                        displayOption === 'card'
                          ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                          : 'space-y-4'
                      }
                    >
                      {filteredPosts.map((post: BlogPost) => {
                        const isBookmarked = bookmarkedIds.has(post.id);
                        return (
                          <div
                            key={post.id}
                            className="bg-white rounded-2xl border border-slate-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                          >
                            <div className="space-y-3">
                              {/* Header Meta: Category + Tags + Bookmarking */}
                              <div className="flex items-center justify-between gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-950 border border-orange-300">
                                  {post.category || 'General Dispatch'}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleBookmarkToggle(post.id)}
                                    className={`p-1.5 rounded-lg border transition ${
                                      isBookmarked
                                        ? 'bg-purple-100 text-purple-900 border-purple-300'
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
                                    }`}
                                    title={isBookmarked ? 'Saved to reading list' : 'Save to reading list'}
                                  >
                                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                                  </button>
                                  <button
                                    onClick={() => handleShare(post)}
                                    className="p-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900 transition"
                                    title="Share dispatch"
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Title */}
                              <h3
                                onClick={() => setReaderPost(post)}
                                className="font-black text-slate-900 text-base sm:text-lg leading-snug group-hover:text-orange-600 transition-colors cursor-pointer line-clamp-2"
                              >
                                {post.title}
                              </h3>

                              {/* Excerpt */}
                              <p className="text-slate-700 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                                {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').slice(0, 180) + '...'}
                              </p>

                              {/* Author and Read Time */}
                              <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
                                <img
                                  src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                                  alt={post.author?.membername || 'Author'}
                                  className="w-7 h-7 rounded-full object-cover ring-1 ring-orange-500/40"
                                />
                                <div className="truncate">
                                  <span className="font-bold text-slate-900 block truncate">
                                    {post.author?.membername || 'Sovereign Node'}
                                  </span>
                                </div>
                                <span className="text-slate-600 font-bold">•</span>
                                <span className="flex items-center gap-1 text-slate-600 font-medium">
                                  <Clock className="w-3 h-3" />
                                  5 min read
                                </span>
                              </div>
                            </div>

                            {/* Action Tray */}
                            <div className="pt-4 mt-3 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                <button
                                  onClick={() => handleLike(post.id)}
                                  className="flex items-center gap-1 text-slate-700 hover:text-rose-600 transition"
                                  title="Appreciate article"
                                >
                                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                                  <span>{post.likes || 0}</span>
                                </button>

                                <button
                                  onClick={() => handleOpenComment(post)}
                                  className="flex items-center gap-1 text-slate-700 hover:text-blue-600 transition"
                                  title="Join discussion"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{post.commentCount || 0}</span>
                                </button>

                                <span className="flex items-center gap-1 text-slate-600 font-mono">
                                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                                  <span>{post.views || 0}</span>
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleOpenGift(post)}
                                  className="px-2.5 py-1 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-950 font-bold text-xs transition flex items-center gap-1 border border-pink-300"
                                  title="Tip FIC to author"
                                >
                                  <Gift className="w-3.5 h-3.5 text-pink-700" />
                                  <span>Tip</span>
                                </button>

                                <button
                                  onClick={() => handleOpenPaylink(post)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs transition flex items-center gap-1 border border-emerald-300"
                                  title="Create PayLink"
                                >
                                  <LinkIcon className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>PayLink</span>
                                </button>

                                <button
                                  onClick={() => setReaderPost(post)}
                                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs transition flex items-center gap-1 shadow-xs"
                                >
                                  <span>Read</span>
                                  <ArrowUpRight className="w-3 h-3" />
                                </button>

                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="p-1 rounded-lg text-slate-600 hover:text-rose-600 transition"
                                  title="Delete article"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-300 space-y-3">
                      <BookOpen className="w-12 h-12 text-orange-500 mx-auto" />
                      <h3 className="text-base font-bold text-slate-900">No sovereign dispatches found</h3>
                      <p className="text-xs text-slate-700 max-w-md mx-auto">
                        No articles matched your active search term or topic filter. Clear filters or draft a new dispatch to publish to the network.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setCategoryFilter('all');
                          setSelectedTag(null);
                          setBookmarkedOnly(false);
                        }}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}

                  {/* Infinite Dispatch Stream Sentinel (No Load More Button, No End) */}
                  <div ref={blogSentinelRef} className="py-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-300 shadow-xs text-xs font-bold text-slate-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                      <span>Streaming more sovereign dispatches, essays & Canary ads...</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN (3 cols): Static, does not scroll, loads Platform Widgets & Canary Ads */}
                <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto space-y-4 scrollbar-none pl-1">
                  <PlatformWidgetsAndAdsRail
                    pageContext="blogs"
                    initialChildren={
                      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-md space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-orange-300">Sovereign Press</span>
                          <span className="text-[10px] bg-orange-500/40 text-orange-200 px-2 py-0.5 rounded-full font-bold">WORM Archive</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-black">Decentralized Publishing</h4>
                          <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                            Long-form essays, cryptographic research, and peer-reviewed dispatches with zero editorial censorship.
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                          <span className="text-slate-400">Total Articles:</span>
                          <span className="font-mono font-bold text-emerald-400">{filteredPosts.length}</span>
                        </div>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: EDITORIAL SPOTLIGHT (Hero Feature Article)                         */}
          {/* ========================================================================= */}
          {activeTab === 'spotlight' && spotlightPost && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-300 p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-bold text-xs border border-amber-300">
                    <Award className="w-4 h-4 text-amber-700" />
                    Editor's Sovereign Pick of the Week
                  </span>
                  <span className="text-xs font-mono text-slate-600 font-bold">
                    WORM Notarized #{spotlightPost.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                      {spotlightPost.title}
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                      {spotlightPost.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                      <img
                        src={spotlightPost.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={spotlightPost.author?.membername}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{spotlightPost.author?.membername}</div>
                        <div className="text-slate-600">Chief Protocol Architect • Verified Sovereign Node</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 flex-wrap">
                      <button
                        onClick={() => setReaderPost(spotlightPost)}
                        className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-md shadow-orange-600/20"
                      >
                        <BookOpen className="w-4 h-4" />
                        Read Full Dispatch
                      </button>
                      <button
                        onClick={() => handleOpenGift(spotlightPost)}
                        className="px-4 py-3 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-950 font-bold text-xs border border-pink-300 transition flex items-center gap-2"
                      >
                        <Gift className="w-4 h-4 text-pink-700" />
                        Tip 25 FIC
                      </button>
                      <button
                        onClick={() => handleOpenTokenize(spotlightPost)}
                        className="px-4 py-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold text-xs border border-purple-300 transition flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-purple-700" />
                        Tokenize WORM Hallmark NFT
                      </button>
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-950 min-h-[300px] flex items-center justify-center p-8 text-center text-white">
                    <div className="space-y-4 max-w-sm">
                      <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md inline-block">
                        <Flame className="w-8 h-8 text-orange-400" />
                      </div>
                      <h4 className="font-black text-lg text-white">Sovereign Proof-of-Reading</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Readers who complete verified technical dispatches unlock accredited community credentials and governance badges.
                      </p>
                      <div className="pt-2 text-xs font-mono text-emerald-400 font-bold">
                        {spotlightPost.views.toLocaleString()} Protocol Readers Synchronized
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: SAVED READING LIST                                                 */}
          {/* ========================================================================= */}
          {activeTab === 'reading-list' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-300 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-purple-600" />
                      Your Sovereign Reading Queue ({bookmarkedIds.size})
                    </h3>
                    <p className="text-xs text-slate-700">
                      Dispatches saved for offline reading, scholarly quotation, and curriculum review.
                    </p>
                  </div>
                  {bookmarkedIds.size > 0 && (
                    <button
                      onClick={() => { setBookmarkedIds(new Set()); showToast('Reading list cleared', 'info'); }}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Clear Reading List
                    </button>
                  )}
                </div>

                {bookmarkedIds.size > 0 ? (
                  <div className="divide-y divide-slate-200">
                    {allPosts.filter(p => bookmarkedIds.has(p.id)).map(post => (
                      <div key={post.id} className="py-4 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-orange-600">{post.category}</span>
                          <h4
                            onClick={() => setReaderPost(post)}
                            className="font-bold text-slate-900 text-sm hover:text-orange-600 cursor-pointer"
                          >
                            {post.title}
                          </h4>
                          <div className="text-xs text-slate-600">
                            By {post.author?.membername} • 5 min read
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setReaderPost(post)}
                            className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition"
                          >
                            Read Now
                          </button>
                          <button
                            onClick={() => handleBookmarkToggle(post.id)}
                            className="p-1.5 text-slate-600 hover:text-red-600"
                            title="Remove from queue"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-700 space-y-2">
                    <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-900">Your reading list is currently empty.</p>
                    <p className="text-xs text-slate-600">Click the bookmark icon on any dispatch to save it here for later.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: CREATOR MONETIZATION & TIPPING ENGINE                              */}
          {/* ========================================================================= */}
          {activeTab === 'monetization' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl border border-slate-800 p-8 text-white shadow-2xl space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold mb-2">
                    <DollarSign className="w-4 h-4" />
                    Long-Form Creator Monetization Engine
                  </div>
                  <h3 className="text-2xl font-black text-white">Direct Reader Tipping & Paywall Settlements</h3>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed mt-1">
                    Every long-form article on FingerMobile can accept micro-tips, generate instant fiat/crypto PayLinks, and trigger automated 4-way revenue splits.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-orange-400 font-bold block uppercase">45% Liquid FIC</span>
                    <span className="text-xl font-black text-white">$12.50 / tip</span>
                    <span className="text-[10px] text-slate-300 block mt-1">Immediately spendable or withdrawable.</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/30">
                    <span className="text-[11px] text-emerald-400 font-bold block uppercase">25% Store Credit</span>
                    <span className="text-xl font-black text-emerald-400">$6.25 / tip</span>
                    <span className="text-[10px] text-slate-300 block mt-1">Marketplace goods, sound stems & gifts.</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-sky-400 font-bold block uppercase">5% 1-Yr Stake</span>
                    <span className="text-xl font-black text-sky-300">+1.5% APY</span>
                    <span className="text-[10px] text-slate-300 block mt-1">Matures to sovereign vault annually.</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[11px] text-purple-400 font-bold block uppercase">25% Protocol Ops</span>
                    <span className="text-xl font-black text-purple-300">Zero Gas</span>
                    <span className="text-[10px] text-slate-300 block mt-1">Subsidizes Guardian AI node clearing.</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-slate-300">
                    Current Wallet Balance: <span className="text-emerald-400 font-bold">{ficBalance.toLocaleString()} FIC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsComposerOpen(true)}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition"
                    >
                      Publish Monetized Article
                    </button>
                    <button
                      onClick={() => navigate('/blogs/templates')}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition"
                    >
                      View Premium Templates
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => { setActiveTab('dispatches'); handleHaptic(); }}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 ${
            activeTab === 'dispatches' ? 'text-orange-600 font-bold' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Dispatches</span>
        </button>
        <button
          type="button"
          onClick={() => { setIsComposerOpen(true); handleHaptic(); }}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 text-slate-700 hover:text-slate-900"
        >
          <PlusCircle className="w-5 h-5 text-orange-600" />
          <span className="text-[10px] tracking-tight">Write</span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('reading-list'); handleHaptic(); }}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 ${
            activeTab === 'reading-list' ? 'text-orange-600 font-bold' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-5 h-5 text-purple-600" />
          <span className="text-[10px] tracking-tight">Saved</span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('monetization'); handleHaptic(); }}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 ${
            activeTab === 'monetization' ? 'text-orange-600 font-bold' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px] tracking-tight">Monetize</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE ARTICLE READER MODAL (HIGH CONTRAST READING EXPERIENCE)    */}
      {/* ========================================================================= */}
      {readerPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-300 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <img
                  src={readerPost.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={readerPost.author?.membername}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500"
                />
                <div>
                  <div className="font-bold text-slate-900 text-sm">{readerPost.author?.membername}</div>
                  <div className="text-xs text-slate-600 font-medium">
                    Published {new Date(readerPost.createdAt).toLocaleDateString()} • 5 min read
                  </div>
                </div>
              </div>

              <button type="button" aria-label="Close"
                onClick={() => setReaderPost(null)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Article Body */}
            <div className="p-8 overflow-y-auto space-y-6 text-slate-800">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-950 border border-orange-300">
                  {readerPost.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {readerPost.title}
                </h1>
              </div>

              <div
                className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-800"
                dangerouslySetInnerHTML={{ __html: readerPost.content }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                {readerPost.tags?.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Reader Action Tray */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLike(readerPost.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-bold text-xs text-slate-800 hover:text-rose-600 transition"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>{readerPost.likes || 0} Likes</span>
                  </button>
                  <button
                    onClick={() => handleBookmarkToggle(readerPost.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-bold text-xs text-slate-800 hover:text-purple-600 transition"
                  >
                    <Bookmark className="w-4 h-4 text-purple-500" />
                    <span>Save to Queue</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setReaderPost(null); handleOpenGift(readerPost); }}
                    className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Tip Author</span>
                  </button>
                  <button
                    onClick={() => { setReaderPost(null); handleOpenTokenize(readerPost); }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tokenize NFT</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODALS SUITE                                                           */}
      {/* ========================================================================= */}
      <BlogComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onPostCreated={(p) => addBlogPost(p)}
      />

      <BlogCommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        postTitle={selectedPostForAction?.title || filteredPosts[0]?.title}
        postId={selectedPostForAction?.id || filteredPosts[0]?.id}
        onCommentSubmitted={(postId, comment) => {
          showToast('Comment published to Sovereign discussion thread!', 'success');
        }}
      />

      <BlogSendGiftModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        postTitle={selectedPostForAction?.title || filteredPosts[0]?.title}
        authorName={selectedPostForAction?.author?.membername || filteredPosts[0]?.author?.membername}
        userFicBalance={ficBalance}
        onGiftSent={(amount, giftName) => {
          showToast(`Successfully sent ${giftName} (${amount} FIC)! 🎁`, 'success');
        }}
      />

      <BlogPaylinkModal
        isOpen={isPaylinkModalOpen}
        onClose={() => setIsPaylinkModalOpen(false)}
        postTitle={selectedPostForAction?.title || filteredPosts[0]?.title}
        onPaylinkCreated={() => {
          showToast('Sovereign Paylink generated and ready to share!', 'success');
        }}
      />

      <BlogTokenizeModal
        isOpen={isTokenizeModalOpen}
        onClose={() => setIsTokenizeModalOpen(false)}
        postTitle={selectedPostForAction?.title || filteredPosts[0]?.title}
        onTokenized={() => {
          showToast('Article tokenized as Sovereign Proof-of-Achievement Hallmark NFT!', 'success');
        }}
      />
    </MainLayout>
  );
};

export default BlogsPage;
