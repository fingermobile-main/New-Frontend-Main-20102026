/*
 * FingerMobile Protocol™ - Groups Page Component
 * Digital Living Room™ Micro-Community Architecture
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import groupsService, { Group, CreateGroupRequest } from '../services/groupsService';
import UniversalProfileCard from '../components/common/UniversalProfileCard';
import PlatformWidgetsAndAdsRail from '../components/widgets/PlatformWidgetsAndAdsRail';
import ConnectWidget from '../components/widgets/ConnectWidget';
import DiscoverWidget from '../components/widgets/DiscoverWidget';
import SovereignModuleEngagementHub from '../components/common/SovereignModuleEngagementHub';
import {
  Users,
  Search,
  Plus,
  Shield,
  Eye,
  Lock,
  Globe,
  Sliders,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  BarChart2,
  Heart,
  ChevronRight,
  Compass
} from 'lucide-react';


type TabType = 'my-groups' | 'discover' | 'guides' | 'powertools';
type PrivacyTier = 'all' | 'public' | 'private' | 'secret';

interface GroupRule {
  id: number;
  title: string;
  description: string;
}

const DEFAULT_GROUP_RULES: GroupRule[] = [
  { id: 1, title: 'No Link Dropping or Unauthorized Pitching', description: 'Avoid promotional opt-ins, cold affiliate links, or self-promotion unless in designated threads.' },
  { id: 2, title: 'Authenticity & Real Identity', description: 'No fake identities, impersonation, bots, or artificial engagement inflation.' },
  { id: 3, title: 'Absolute Safety & Zero Intimidation', description: 'Zero tolerance for bullying, harassment, intimidation, or predatory behavior.' },
  { id: 4, title: 'Data Privacy & Anti-Doxxing', description: 'Never share private messages, phone numbers, or off-platform identities without consent.' },
  { id: 5, title: 'Dignity & Mutual Respect', description: 'Maintain discourse free of hate speech, discrimination, or systemic degradation.' },
  { id: 6, title: 'Listen Before You Speak', description: 'Read pinned guidelines and search existing discussions before opening redundant threads.' },
  { id: 7, title: 'No Cross-Spamming', description: 'Never copy-paste the exact same query across multiple groups simultaneously.' },
  { id: 8, title: 'Constructive Crowdsourced Problem Solving', description: 'Keep comments focused on real-world practical answers, insights, and solutions.' },
  { id: 9, title: 'Respect Moderator Decisions', description: 'Adhere to rulings by community moderators and sovereign node facilitators.' },
  { id: 10, title: 'Uphold the Member-First Lens', description: 'Center conversations on shared member growth rather than corporate broadcasting.' }
];

const GROUP_GUIDES = [
  {
    id: 1,
    title: 'The Digital Living Room: Peer-to-Peer Community Architecture',
    lessons: 5,
    duration: '20 min read',
    description: 'Learn why many-to-many communication outperforms performative billboards, and how micro-communities foster genuine trust.'
  },
  {
    id: 2,
    title: 'Admin Assist Setup: Keyword Moderation & Automation',
    lessons: 4,
    duration: '15 min read',
    description: 'Deploy automated policy scanners that block scam links, banned words, and bot accounts from your community feed.'
  },
  {
    id: 3,
    title: 'Facilitated Engagement: Interactive Polls & Live Q&As',
    lessons: 6,
    duration: '25 min read',
    description: 'How to facilitate peer-to-peer psychology, prompt members to answer each other, and drive organic user-generated content.'
  }
];

const GroupsPage: React.FC = () => {
  const { showToast } = useAppContext();

  // Tab & Filters State
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [privacyFilter, setPrivacyFilter] = useState<PrivacyTier>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Groups Data State
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Group Creation Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createForm, setCreateForm] = useState<CreateGroupRequest>({
    name: '',
    description: '',
    category: 'Technology',
    privacy: 'public',
    isModerated: true
  });

  // Admin Power Tools & Policy Test State
  const [anonymousPostingEnabled, setAnonymousPostingEnabled] = useState(false);
  const [moderationText, setModerationText] = useState('');
  const [moderationScan, setModerationScan] = useState<{ clean: boolean; flaggedWords: string[] } | null>(null);
  const [activePollVote, setActivePollVote] = useState<number | null>(null);

  // Infinite Scroll Observer & Dynamic Generation State
  const groupSentinelRef = React.useRef<HTMLDivElement>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [pageIteration, setPageIteration] = useState(1);

  // Fetch Groups from Backend API
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await groupsService.getAllGroups();
      if (res.success && res.data) {
        setAllGroups(res.data);
      }
    } catch (err) {
      setError('Failed to connect to groups database');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Infinite Scroll Observer - No hard end, continuously streams micro-communities
  useEffect(() => {
    if (!groupSentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore && allGroups.length > 0) {
          setIsFetchingMore(true);
          setTimeout(() => {
            setPageIteration((prev) => {
              const next = prev + 1;
              const generated: Group[] = allGroups.slice(0, 6).map((item, idx) => ({
                ...item,
                id: `gen-grp-${next}-${idx}-${Date.now()}`,
                name: `${item.name} · Relay Salon #${next}.${idx + 1}`,
                members: item.members + Math.floor(Math.random() * 85) + 12,
                online: Math.floor(Math.random() * 40) + 5,
                isJoined: false
              }));
              setAllGroups((current) => [...current, ...generated]);
              return next;
            });
            setIsFetchingMore(false);
          }, 450);
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(groupSentinelRef.current);
    return () => observer.disconnect();
  }, [isFetchingMore, allGroups.length]);

  // Categories list derived from groups
  const categories = useMemo(() => {
    const set = new Set(allGroups.map((g) => g.category));
    return ['all', ...Array.from(set)];
  }, [allGroups]);

  // Filtered Groups
  const filteredGroups = useMemo(() => {
    return allGroups.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        g.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesPrivacy =
        privacyFilter === 'all' ||
        g.privacy === privacyFilter;

      const matchesTab =
        activeTab !== 'my-groups' ||
        g.isJoined;

      return matchesSearch && matchesCategory && matchesPrivacy && matchesTab;
    });
  }, [allGroups, searchTerm, selectedCategory, privacyFilter, activeTab]);

  // Join/Leave Toggle
  const handleToggleJoin = async (group: Group) => {
    try {
      if (group.isJoined) {
        await groupsService.leaveGroup(group.id);
        setAllGroups((prev) =>
          prev.map((g) =>
            g.id === group.id ? { ...g, isJoined: false, members: Math.max(0, g.members - 1) } : g
          )
        );
        showToast(`Left ${group.name}`, 'info');
      } else {
        await groupsService.joinGroup(group.id);
        setAllGroups((prev) =>
          prev.map((g) =>
            g.id === group.id ? { ...g, isJoined: true, members: g.members + 1 } : g
          )
        );
        showToast(`Welcome to ${group.name}!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  // Create Group Submission
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      showToast('Group name is required', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await groupsService.createGroup(createForm);
      if (res.success) {
        showToast(`Group "${createForm.name}" created successfully!`, 'success');
        setIsCreateModalOpen(false);
        setCreateForm({
          name: '',
          description: '',
          category: 'Technology',
          privacy: 'public',
          isModerated: true
        });
        fetchGroups();
      } else {
        showToast(res.message || 'Failed to create group', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Group creation error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Run Admin Assist Policy Scanner
  const runAdminAssistScan = () => {
    const BANNED_PATTERNS = [
      '100% free', 'make money', 'million dollars', 'act now', 'click here',
      'urgent', 'winner', 'miracle', 'work from home', 'fast cash', 'no catch',
      'fuck', 'bitch', 'asshole', 'pussy', 'dick', 'scam', 'unsecured debt'
    ];
    const lower = moderationText.toLowerCase();
    const hits = BANNED_PATTERNS.filter((word) => lower.includes(word));
    setModerationScan({
      clean: hits.length === 0,
      flaggedWords: hits
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
      {/* Top Banner & Living Room Identity */}
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto mb-6 sm:mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900/90 border border-blue-500/30 p-5 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                The Digital Living Room™ Micro-Community Architecture
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>Groups Protocol</span>
                <span className="text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-md bg-blue-600/30 text-blue-300 border border-blue-500/30">
                  Many-to-Many
                </span>
              </h1>
              <p className="mt-2 text-slate-300 text-xs sm:text-base max-w-2xl leading-relaxed">
                Shared dedicated spaces prioritizing peer-to-peer dialogue, crowdsourced problem solving, and belonging. Stripping away performative status feeds in favor of focused high-utility connections.
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="min-h-[44px] px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Digital Living Room
              </button>
            </div>
          </div>

          {/* 3 Core Pillars Header Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-500/20">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">1. Shared Identity & Passion</h4>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">Hyper-specific niche gathering without generic social clutter.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">2. Crowdsourced Problem Solving</h4>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">Living search engine where peers provide battle-tested answers.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">3. Belonging & Support</h4>
                <p className="text-[11px] text-slate-300 font-medium mt-0.5">Psychological safe havens understood by peers who truly get it.</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-blue-500/20">
            <button
              type="button"
              onClick={() => setActiveTab('discover')}
              className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                activeTab === 'discover'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              Discover Living Rooms
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-blue-900/60 text-blue-200">
                {allGroups.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('my-groups')}
              className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                activeTab === 'my-groups'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              My Joined Communities
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-emerald-900/60 text-emerald-200">
                {allGroups.filter((g) => g.isJoined).length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('guides')}
              className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                activeTab === 'guides'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              Guides & Modules
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('powertools')}
              className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                activeTab === 'powertools'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              Admin Power Tools & Policy Flags
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Static & Sticky */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto space-y-4 scrollbar-none pr-1">
            <UniversalProfileCard />

            {/* Quick Micro-Community Governance Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Living Room Standards</span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                Autonomous p2p salons with zero corporate surveillance. Powered by member-first moderation and cryptographic identity.
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                <span>Active Living Rooms</span>
                <span className="font-bold text-blue-400">{allGroups.length}</span>
              </div>
            </div>

            {/* Left Column Last 2 Widgets: Connect & Discover */}
            <ConnectWidget pageContext="groups" />
            <DiscoverWidget pageContext="groups" />
          </div>

          {/* Center Column: Scrollable Infinite Stream */}
          <div className="lg:col-span-6 space-y-6">
            {/* Sovereign Engagement & Activity Console */}
            <SovereignModuleEngagementHub module="groups" />
        {/* ======================================================== */}
        {/* TAB 1 & 2: DISCOVER & MY GROUPS */}
        {/* ======================================================== */}
        {(activeTab === 'discover' || activeTab === 'my-groups') && (
          <div className="space-y-6">
            {/* The Architectural Blueprint: 3 Privacy Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setPrivacyFilter(privacyFilter === 'public' ? 'all' : 'public')}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  privacyFilter === 'public'
                    ? 'bg-blue-950/60 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Public Groups</h3>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">Open ecosystem discovery; posts show across the global feed</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPrivacyFilter(privacyFilter === 'private' ? 'all' : 'private')}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  privacyFilter === 'private'
                    ? 'bg-blue-950/60 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Private & Visible</h3>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">Discoverable in search; posts protected for members only</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPrivacyFilter(privacyFilter === 'secret' ? 'all' : 'secret')}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  privacyFilter === 'secret'
                    ? 'bg-blue-950/60 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Private & Hidden ("Secret")</h3>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">Zero search visibility; exclusive private family/mastermind salons</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search groups by name, topic, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-300 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <LoadingSpinner />
                <p className="mt-4 text-sm text-slate-300 font-medium">Loading Digital Living Rooms from PostgreSQL...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredGroups.length === 0 && (
              <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">No Groups Found</h3>
                <p className="text-sm text-slate-300 font-medium max-w-md mx-auto mt-1">
                  {activeTab === 'my-groups'
                    ? 'You have not joined any groups yet. Browse the Discover tab to connect!'
                    : 'No groups matched your active search query.'}
                </p>
                {activeTab === 'my-groups' && (
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Explore Discover Tab
                  </button>
                )}
              </div>
            )}

            {/* Groups Grid */}
            {!loading && filteredGroups.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredGroups.map((group) => {
                  return (
                    <div
                      key={group.id}
                      className="group bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 flex flex-col justify-between"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                        <img
                          src={group.avatarUrl}
                          alt={group.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                        {/* Privacy Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-md ${
                              group.privacy === 'public'
                                ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                                : group.privacy === 'private'
                                  ? 'bg-indigo-950/80 border border-indigo-500/40 text-indigo-300'
                                  : 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
                            }`}
                          >
                            {group.privacy === 'public' && <Globe className="w-3 h-3" />}
                            {group.privacy === 'private' && <Eye className="w-3 h-3" />}
                            {group.privacy === 'secret' && <Lock className="w-3 h-3" />}
                            {group.privacy}
                          </span>
                        </div>

                        {/* Online Indicator */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-medium text-emerald-400 shadow-md">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span>{group.online} online</span>
                        </div>

                        {/* Category Pill */}
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-900/80 text-blue-200 border border-blue-500/30">
                            {group.category}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-base text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                            {group.name}
                          </h3>

                          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mt-1">
                            <Users className="w-3.5 h-3.5 text-slate-300" />
                            <span>{group.members.toLocaleString()} members</span>
                          </div>

                          <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                            {group.description || 'Dedicated micro-community for crowdsourced problem solving and shared passion.'}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                          <button
                            onClick={() => showToast(`Opening chat room for ${group.name}...`, 'info')}
                            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Enter living room chat"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleJoin(group)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                              group.isJoined
                                ? 'bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-800'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                            }`}
                          >
                            {group.isJoined ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                Joined (Leave)
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                Join Living Room
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Continuous Infinite Stream Sentinel */}
            <div ref={groupSentinelRef} className="h-12 flex items-center justify-center">
              {isFetchingMore && (
                <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold py-4">
                  <LoadingSpinner />
                  <span>Streaming more Living Rooms & micro-communities...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: GUIDES & LEARNING MODULES */}
        {/* ======================================================== */}
        {activeTab === 'guides' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                Featured Educational Modules & Guides
              </h3>
              <p className="text-xs text-slate-300 font-medium mb-6">
                Step-by-step learning modules for community founders, moderators, and active participants.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {GROUP_GUIDES.map((guide) => (
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
                      onClick={() => showToast(`Starting guide: ${guide.title}`, 'info')}
                      className="mt-4 flex items-center justify-between w-full px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 text-xs font-semibold transition-colors"
                    >
                      <span>Explore Module</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Poll Demonstration */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Facilitated Psychology: Interactive Community Poll</h4>
                  <p className="text-xs text-slate-300 font-medium">Prompting peer-to-peer engagement instead of brand broadcasts.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <p className="text-sm font-semibold text-slate-200">
                  "What is your highest priority when establishing a new sovereign digital living room?"
                </p>
                <div className="space-y-2">
                  {[
                    'Enforcing strict keyword moderation & zero-doxxing policies',
                    'Curating step-by-step learning modules in the Guides tab',
                    'Fostering peer-to-peer crowdsourced problem solving'
                  ].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActivePollVote(idx);
                        showToast('Vote recorded on sovereign ledger!', 'success');
                      }}
                      className={`w-full p-3 rounded-lg text-xs font-medium text-left transition-all border ${
                        activePollVote === idx
                          ? 'bg-blue-600/30 border-blue-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {activePollVote === idx && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: ADMIN POWER TOOLS & POLICY FLAGS */}
        {/* ======================================================== */}
        {activeTab === 'powertools' && (
          <div className="space-y-6">
            {/* 4 Guiding Principles of Content Moderation Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2.5 text-blue-400 mb-1">
                  <Shield className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white">1. Authenticity</h4>
                </div>
                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                  Prevents fake identities, spam link drops, bot accounts, and artificial engagement inflation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2.5 text-emerald-400 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white">2. Safety</h4>
                </div>
                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                  Zero tolerance for real-world harm, predatory behaviors, intimidation, or harassment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2.5 text-pink-400 mb-1">
                  <Lock className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white">3. Privacy</h4>
                </div>
                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                  Safeguards member data; strictly prohibits unauthorized sharing of personal records (doxxing).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2.5 text-amber-400 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white">4. Dignity</h4>
                </div>
                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                  Preserves a shared environment free of hate speech, prejudice, or systemic degradation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Admin Assist Auto-Moderation Scanner */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Admin Assist: Words Moderation Test</h3>
                    <p className="text-xs text-slate-300 font-medium">Tests incoming text against the platform words blacklist</p>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={moderationText}
                  onChange={(e) => setModerationText(e.target.value)}
                  placeholder="Test phrases (e.g. 'earn money fast cash 100% free' or ordinary text)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={runAdminAssistScan}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Scan Policy Compliance
                </button>

                {moderationScan && (
                  <div
                    className={`p-3 rounded-xl border text-xs ${
                      moderationScan.clean
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : 'bg-red-950/60 border-red-500/40 text-red-300'
                    }`}
                  >
                    {moderationScan.clean ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Compliant: Text cleared all 4 platform principles (Authenticity, Safety, Privacy, Dignity).
                      </span>
                    ) : (
                      <div>
                        <span className="flex items-center gap-2 font-bold mb-1">
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          Declined by Admin Assist!
                        </span>
                        <span>Flagged phrases: {moderationScan.flaggedWords.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-xs text-slate-300 font-semibold">Allow Anonymous Posting in Living Room</span>
                  <input
                    type="checkbox"
                    checked={anonymousPostingEnabled}
                    onChange={(e) => setAnonymousPostingEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-500 bg-slate-950 border-slate-700"
                  />
                </div>
              </div>

              {/* 10 Explicit Group Rules */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                      <Sliders className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Clear Governance: 10 Explicit Rules</h3>
                      <p className="text-xs text-slate-300 font-medium">Concrete bounds to remove spam and resolve disputes</p>
                    </div>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {DEFAULT_GROUP_RULES.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-0.5"
                    >
                      <div className="font-bold text-blue-400">
                        {rule.id}. {rule.title}
                      </div>
                      <p className="text-slate-300 font-medium text-[11px] leading-relaxed">{rule.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
          </div>

          {/* Right Column: Static & Sticky Platform Rail */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto space-y-4 scrollbar-none pl-1">
            <PlatformWidgetsAndAdsRail pageContext="groups" />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CREATE GROUP MODAL */}
      {/* ======================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-blue-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Plus className="w-4 h-4" />
                Initialize Digital Living Room
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-300 font-medium hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Living Room Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vintage Camera Collectors Club"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Purpose & Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Define your niche, peer expectations, and problem solving focus..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Social">Social</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Arts">Arts</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Education">Education</option>
                    <option value="Community">Community</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Privacy Tier
                  </label>
                  <select
                    value={createForm.privacy}
                    onChange={(e) => setCreateForm({ ...createForm, privacy: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private & Visible</option>
                    <option value="secret">Secret (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-medium">
                <span className="font-semibold text-blue-400">Living Room Policy:</span> All new groups enforce the 4 principles (Authenticity, Safety, Privacy, Dignity) and 10 default community rules.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <LoadingSpinner /> : 'Create Living Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Floating Sovereign Mobile Navigation Quick Dock */}
      <div
        data-testid="groups-mobile-dock"
        className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden"
      >
        <button
          type="button"
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-transform active:scale-95 ${
            activeTab === 'discover' ? 'text-blue-400' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Globe className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Discover</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('my-groups')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-transform active:scale-95 ${
            activeTab === 'my-groups' ? 'text-blue-400' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Joined</span>
        </button>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-emerald-400 active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Create</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('guides')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-transform active:scale-95 ${
            activeTab === 'guides' ? 'text-blue-400' : 'text-slate-300 hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Guides</span>
        </button>
      </div>
    </div>
  );
};

export default GroupsPage;
