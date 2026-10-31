/*
 * FingerMobile Protocol™ - Hallmarks Page Component (Ultra-Premium Redesign)
 * Copyright © 2025-2026 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms.
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import voiceLineServiceInstance from '../services/VoiceLineService';
import {
  TrophyIcon,
  UsersIcon,
  CalendarIcon,
  PlusIcon,
  EyeIcon,
  ShieldIcon,
  PinIcon,
  TrashIcon
} from '../icons';
import {
  ShieldCheck,
  Sparkles,
  Search,
  Award,
  AlertTriangle,
  Snowflake,
  RefreshCw,
  ArrowUpRight,
  SlidersHorizontal,
  Lock,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { hallmarksService, Hallmark } from '../services/HallmarksService';
import { useAppContext } from '../contexts/AppContext';
import CreateHallmarkModal from '../components/hallmark/CreateHallmarkModal';
import MainLayout from '../components/layout/MainLayout';
import { PlatformWidgetsAndAdsRail } from '../components/widgets/PlatformWidgetsAndAdsRail';
import ConnectWidget from '../components/widgets/ConnectWidget';
import DiscoverWidget from '../components/widgets/DiscoverWidget';
import SovereignEngagementDropdownTrigger from '../components/common/SovereignEngagementDropdownTrigger';

interface Community {
  id: number;
  name: string;
  description: string;
  members: number;
  badgesAwarded: number;
  createdAt: string;
  featured: boolean;
  status?: 'active' | 'suspended' | 'frozen' | 'deleted';
  creator_id?: number | string;
  is_suspended?: boolean;
  suspended_until?: string;
  suspension_reason?: string;
  warning_count?: number;
  last_warning_reason?: string;
  is_frozen?: boolean;
  frozen_until?: string;
  frozen_reason?: string;
}

interface QuotaData {
  userId: number;
  createdCount: number;
  totalCreated: number;
  maxAllowed: number;
  canCreate: boolean;
  myPages: any[];
  moderationQuota: {
    totalPins: number;
    usedPins: number;
    remainingPins: number;
    cycleStart: string;
    cycleEnd: string;
    durationMonths: number;
  };
}

const HallmarksPage: React.FC = () => {
  const { user, ficBalance } = useAppContext();

  // Initial Mock Community Data
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: 1,
      name: 'Digital Living Room',
      description: 'Sovereign conversational commons for protocol architects and creative nodes.',
      members: 14820,
      badgesAwarded: 48,
      createdAt: '2023-01-15',
      featured: true,
      status: 'active',
      warning_count: 0
    },
    {
      id: 2,
      name: 'Afro-Futurism Sound Lab',
      description: 'Sonic engineers, BeatwaveNG creators, and decentralized streaming producers.',
      members: 9240,
      badgesAwarded: 32,
      createdAt: '2023-04-10',
      featured: true,
      status: 'active',
      warning_count: 0
    },
    {
      id: 3,
      name: 'Stercs Visual Guild',
      description: 'Filmmakers, motion graphic designers, and video editors building sovereign media.',
      members: 6150,
      badgesAwarded: 24,
      createdAt: '2023-05-20',
      featured: false,
      status: 'active',
      warning_count: 0
    },
    {
      id: 4,
      name: 'Sovereign Knowledge Circle',
      description: 'Literature, scientific archives, and sovereign curriculum discussion groups.',
      members: 4540,
      badgesAwarded: 19,
      createdAt: '2023-07-01',
      featured: false,
      status: 'active',
      warning_count: 0
    },
    {
      id: 5,
      name: 'Entrepreneurs & Commerce Hub',
      description: 'P2P merchant networking, storefront strategies, and FIC liquidity management.',
      members: 11840,
      badgesAwarded: 52,
      createdAt: '2023-03-18',
      featured: true,
      status: 'active',
      warning_count: 0
    }
  ]);

  const [myHallmarks, setMyHallmarks] = useState<Hallmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [quota, setQuota] = useState<QuotaData | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'featured' | 'active' | 'moderated'>('all');
  const [activeTab, setActiveTab] = useState('communities');
  const [expandedModId, setExpandedModId] = useState<number | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isQuotaExplainerOpen, setIsQuotaExplainerOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // Moderation action modal state
  const [modModal, setModModal] = useState<{
    isOpen: boolean;
    type: 'warn' | 'suspend' | 'freeze';
    community: Community | null;
    reason: string;
    durationDays: number;
  }>({
    isOpen: false,
    type: 'warn',
    community: null,
    reason: '',
    durationDays: 3
  });

  // Action toast / alert message
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Infinite scroll & login state
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [communityItems, setCommunityItems] = useState<Community[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Comments
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; author: string; role: string; text: string; time: string }>>([
    {
      id: '1',
      author: 'Nia Adebayo',
      role: 'Core Architect',
      text: 'Huge congratulations to all sovereign node builders awarded the Top Contributor Hallmark!',
      time: '10m ago'
    },
    {
      id: '2',
      author: 'Tariq Al-Mansoor',
      role: 'Node Validator',
      text: 'Proud to see our Digital Living Room community achieve the 14k member hallmark milestone today!',
      time: '25m ago'
    },
    {
      id: '3',
      author: 'Zainab Okafor',
      role: 'Creative Producer',
      text: 'The 50-PIN safeguard gives our creators peace of mind against arbitrary moderation actions.',
      time: '1h ago'
    }
  ]);

  // Load Quota
  const refreshQuota = useCallback(async () => {
    try {
      const res = await hallmarksService.getQuota();
      if (res.success && res.data) {
        setQuota(res.data);
      }
    } catch (_err) {
      // Fallback gracefully
    }
  }, []);

  // Load Live Communities from API
  const refreshCommunities = useCallback(async () => {
    try {
      const res = await hallmarksService.getAllHallmarks();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const live: Community[] = res.data.map((h: any) => ({
          id: h.id,
          name: h.name,
          description: h.description || 'Community Hallmark Page',
          members: h.members || 100,
          badgesAwarded: h.badgesAwarded || 12,
          createdAt: h.createdAt || h.created_at || '2023-01-01',
          featured: h.rarity === 'legendary' || h.rarity === 'epic',
          status: h.status || 'active',
          creator_id: h.creator_id,
          is_suspended: h.is_suspended,
          suspended_until: h.suspended_until,
          suspension_reason: h.suspension_reason,
          warning_count: h.warning_count || 0,
          last_warning_reason: h.last_warning_reason,
          is_frozen: h.is_frozen,
          frozen_until: h.frozen_until,
          frozen_reason: h.frozen_reason
        }));
        setCommunities(live);
      }
    } catch (_err) {
      // Fallback gracefully
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([refreshQuota(), refreshCommunities()]);
      setLoading(false);
    };
    init();
  }, [refreshQuota, refreshCommunities]);

  // Check login
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      setIsLoggedIn(!!token || !!userData);
    };
    checkLoginStatus();
  }, []);

  // Load User Hallmarks
  useEffect(() => {
    const fetchUserHallmarks = async () => {
      if (!user?.id) {
        setMyHallmarks([
          {
            id: 1,
            name: 'Top Contributor',
            description: 'Awarded for consistently verified, high-impact contributions to the protocol.',
            rarity: 'rare',
            category: 'achievement',
            criteria: {},
            createdAt: '2023-08-12',
            updatedAt: '2023-08-12',
            icon: '🏆'
          },
          {
            id: 2,
            name: 'Sovereign Node Pioneer',
            description: 'Maintained 99.9% uptime and zero governance disputes across sovereign communities.',
            rarity: 'epic',
            category: 'milestone',
            criteria: {},
            createdAt: '2023-11-04',
            updatedAt: '2023-11-04',
            icon: '🛡️'
          }
        ]);
        return;
      }

      try {
        const response = await hallmarksService.getUserHallmarks(user.id);
        if (response.success && response.data) {
          const mapped: Hallmark[] = response.data.map((uh: any) => uh.hallmark || uh);
          setMyHallmarks(mapped);
        }
      } catch (_err) {
        // Fallback gracefully
      }
    };

    fetchUserHallmarks();
  }, [user]);

  // Infinite scroll
  const loadMoreItems = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newItems: Community[] = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i,
      name: `Sovereign Hallmark Node ${page}.${i + 1}`,
      description: `Decentralized collective node ${page}.${i + 1} hosted on FingerMobile Protocol with verified cryptographic credentials.`,
      members: Math.floor(Math.random() * 4000) + 500,
      badgesAwarded: Math.floor(Math.random() * 60) + 10,
      createdAt: new Date().toISOString().split('T')[0],
      featured: Math.random() > 0.6,
      status: 'active',
      warning_count: 0
    }));

    setCommunityItems((prev) => [...prev, ...newItems]);
    setPage((prev) => prev + 1);
    setIsLoadingMore(false);
  }, [isLoadingMore, page]);

  useEffect(() => {
    if (sentinelRef.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isLoadingMore) {
            loadMoreItems();
          }
        },
        { threshold: 0.1, rootMargin: '600px' }
      );
      observer.current.observe(sentinelRef.current);
    }
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loadMoreItems, isLoadingMore]);

  useEffect(() => {
    if (communityItems.length === 0 && communities.length > 0) {
      setCommunityItems(communities);
    }
  }, [communities, communityItems.length]);

  // Handle Create Community button click with strict quota check
  const handleCreateCommunityClick = () => {
    if (quota && !quota.canCreate) {
      setIsQuotaExplainerOpen(true);
    } else {
      setIsCreateModalOpen(true);
    }
  };

  // Open Moderation Action Modal
  const openModAction = (type: 'warn' | 'suspend' | 'freeze', community: Community) => {
    if (type === 'suspend' && (!community.warning_count || community.warning_count < 1)) {
      setActionAlert({
        type: 'error',
        message: `⚠️ Policy Violation: A formal warning must be issued to "${community.name}" before executing a suspension.`
      });
      return;
    }
    setModModal({
      isOpen: true,
      type,
      community,
      reason: '',
      durationDays: 3
    });
  };

  // Execute Moderation Action
  const handleExecuteModAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modModal.community || !modModal.reason.trim()) return;

    const { type, community, reason, durationDays } = modModal;
    setModModal((prev) => ({ ...prev, isOpen: false }));

    try {
      if (type === 'warn') {
        const res = await hallmarksService.warnHallmark(community.id, reason);
        if (res.success) {
          setActionAlert({
            type: 'success',
            message: `Formal policy warning logged on "${community.name}". (0 PINs deducted)`
          });
        } else {
          setActionAlert({ type: 'error', message: res.message || 'Failed to issue warning' });
        }
      } else if (type === 'suspend') {
        const res = await hallmarksService.suspendHallmark(community.id, durationDays, reason);
        if (res.success) {
          setActionAlert({
            type: 'success',
            message: `🚫 "${community.name}" suspended for ${durationDays} days. 1 PIN deducted (${res.remainingPins ?? 'balance updated'} PINs remaining). 1 creation slot released!`
          });
        } else {
          setActionAlert({ type: 'error', message: res.message || 'Failed to suspend hallmark' });
        }
      } else if (type === 'freeze') {
        const res = await hallmarksService.freezeHallmark(community.id, reason);
        if (res.success) {
          setActionAlert({
            type: 'success',
            message: `❄️ "${community.name}" frozen for 6 hours. 1 PIN deducted (${res.remainingPins ?? 'balance updated'} PINs remaining). 1 creation slot released!`
          });
        } else {
          setActionAlert({ type: 'error', message: res.message || 'Failed to freeze hallmark' });
        }
      }

      await Promise.all([refreshQuota(), refreshCommunities()]);
    } catch (err: any) {
      setActionAlert({ type: 'error', message: err.message || 'Action failed' });
    }
  };

  // Unfreeze
  const handleUnfreeze = async (communityId: number) => {
    try {
      const res = await hallmarksService.unfreezeHallmark(communityId);
      if (res.success) {
        setActionAlert({ type: 'success', message: 'Hallmark unfreezed and restored to active state.' });
        await Promise.all([refreshQuota(), refreshCommunities()]);
      }
    } catch (err: any) {
      setActionAlert({ type: 'error', message: err.message || 'Failed to unfreeze' });
    }
  };

  // Unsuspend
  const handleUnsuspend = async (communityId: number) => {
    try {
      const res = await hallmarksService.unsuspendHallmark(communityId);
      if (res.success) {
        setActionAlert({ type: 'success', message: 'Hallmark unsuspended and restored to active state.' });
        await Promise.all([refreshQuota(), refreshCommunities()]);
      }
    } catch (err: any) {
      setActionAlert({ type: 'error', message: err.message || 'Failed to unsuspend' });
    }
  };

  // Delete Hallmark (Creator or SuperAdmin)
  const handleDeleteHallmark = async (communityId: number, communityName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${communityName}"? This will release 1 HallMarks creation slot.`)) {
      return;
    }
    try {
      const res = await hallmarksService.deleteHallmark(communityId);
      if (res.success) {
        setActionAlert({ type: 'success', message: `"${communityName}" deleted. 1 creation slot released!` });
        await Promise.all([refreshQuota(), refreshCommunities()]);
      } else {
        setActionAlert({ type: 'error', message: res.message || 'Failed to delete hallmark' });
      }
    } catch (err: any) {
      setActionAlert({ type: 'error', message: err.message || 'Failed to delete hallmark' });
    }
  };

  // Load Audit Ledger
  const handleOpenAuditModal = async () => {
    setIsAuditModalOpen(true);
    setAuditLoading(true);
    try {
      const res = await hallmarksService.getModerationAudit();
      if (res.success && res.data) {
        setAuditLogs(res.data);
      }
    } catch (_err) {
      // Fallback
    } finally {
      setAuditLoading(false);
    }
  };

  const handlePostCommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      author: user?.username || 'Israel Mbah',
      role: 'Sovereign Node Architect',
      text: commentInput.trim(),
      time: 'Just now'
    };
    setComments((prev) => [newComment, ...prev]);
    voiceLineServiceInstance.playCommentaryVoiceLine('hallmarks');
    setCommentInput('');
  };

  const allCommunities = useMemo(() => {
    return [...communities, ...communityItems].filter(
      (c, i, self) => i === self.findIndex((item) => item.id === c.id)
    );
  }, [communities, communityItems]);

  const filteredCommunities = useMemo(() => {
    return allCommunities.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());

      const isSuspended =
        c.status === 'suspended' ||
        (c.is_suspended && (!c.suspended_until || new Date(c.suspended_until) > new Date()));
      const isFrozen =
        c.status === 'frozen' ||
        (c.is_frozen && (!c.frozen_until || new Date(c.frozen_until) > new Date()));

      if (statusFilter === 'featured') return matchesSearch && c.featured;
      if (statusFilter === 'active') return matchesSearch && !isSuspended && !isFrozen;
      if (statusFilter === 'moderated') return matchesSearch && (isSuspended || isFrozen || (c.warning_count ?? 0) > 0);
      return matchesSearch;
    });
  }, [allCommunities, searchQuery, statusFilter]);

  const createdCount = quota?.createdCount ?? 0;
  const maxAllowed = quota?.maxAllowed ?? 2;
  const remainingPins = quota?.moderationQuota?.remainingPins ?? 48;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
            Synchronizing Sovereign Hallmarks...
          </span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50/70 w-full max-w-full overflow-x-hidden pb-28 md:pb-12 text-slate-900">
        <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">

          {/* 1. Flagship Executive Hero Section */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 md:p-10 shadow-2xl border border-slate-800">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-400/40 text-orange-400 text-xs font-black tracking-wider uppercase backdrop-blur-sm">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span>Sovereign Protocol Governance & Mega-Communities</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  HallMarks™ <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">Sovereign Hub</span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Architect and host decentralized mega-communities up to 250,000 members. Verify cryptographic credentials, mint community accolades, and enforce balanced 50-PIN anti-abuse safeguards.
                </p>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Live Communities</span>
                    <span className="text-xl font-black text-white">{allCommunities.length} Active Nodes</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Total Members</span>
                    <span className="text-xl font-black text-emerald-400">148,250+</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Accolades Issued</span>
                    <span className="text-xl font-black text-amber-400">1,280+</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Your Page Slots</span>
                    <span className="text-xl font-black text-orange-400">{createdCount} / {maxAllowed} Used</span>
                  </div>
                </div>
              </div>

              {/* Action Console Card */}
              <div className="w-full lg:w-80 flex flex-col gap-3 p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
                <span className="text-xs font-black uppercase tracking-wider text-orange-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  Protocol Action Center
                </span>

                <button
                  onClick={handleCreateCommunityClick}
                  className="w-full min-h-[44px] py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Launch Community ({createdCount}/{maxAllowed})</span>
                </button>

                <button
                  onClick={handleOpenAuditModal}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📜</span>
                  <span>View 50-PIN Audit Ledger</span>
                </button>

                <div className="text-[11px] text-slate-300 text-center pt-1 border-t border-white/10">
                  Wallet Liquidity: <span className="font-bold text-emerald-400">{ficBalance.toLocaleString()} FIC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Global Alert Notification */}
          {actionAlert && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm animate-fade-in ${
                actionAlert.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                  : 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{actionAlert.type === 'success' ? '✅' : '⚠️'}</span>
                <p className="text-sm font-semibold">{actionAlert.message}</p>
              </div>
              <button
                onClick={() => setActionAlert(null)}
                className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-black/5 hover:bg-black/10 transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (3 cols): Static, does not scroll with page */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto space-y-4 scrollbar-none pr-1">
            {/* Operator Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-300 shadow-sm flex items-center gap-3">
              <div className="relative">
                <img
                  src="/assets/branding/mbah_israel_obinna.jpeg"
                  alt="Israel Mbah"
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-orange-500/30 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-black text-slate-900 text-base truncate">
                    {user?.username ? `@${user.username}` : 'Israel Mbah'}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
                    LVL 7 SOVEREIGN
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-semibold truncate">Lead Protocol Architect & Creator</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800">Consent PIN: ••22</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">Verified Node</span>
                </div>
              </div>
            </div>

            {/* Page Quota Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👥</span>
                  <h4 className="font-black text-slate-900 text-sm">2-Page Creation Quota</h4>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-black ${
                    createdCount >= maxAllowed
                      ? 'bg-amber-100 text-amber-950 border border-amber-400'
                      : 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                  }`}
                >
                  {createdCount} / {maxAllowed} Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    createdCount >= 1
                      ? 'bg-orange-50 border-orange-300 text-orange-950 font-bold'
                      : 'bg-slate-50 border-dashed border-slate-300 text-slate-600 font-semibold'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider block font-black">Slot 1</span>
                  <span className="text-xs font-black">{createdCount >= 1 ? 'Active Page' : 'Available'}</span>
                </div>
                <div
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    createdCount >= 2
                      ? 'bg-orange-50 border-orange-300 text-orange-950 font-bold'
                      : 'bg-slate-50 border-dashed border-slate-300 text-slate-600 font-semibold'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider block font-black">Slot 2</span>
                  <span className="text-xs font-black">{createdCount >= 2 ? 'Active Page' : 'Available'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-600">
                <span>Slots restored on delete, suspend, freeze</span>
                {createdCount >= maxAllowed && (
                  <button
                    onClick={() => setIsQuotaExplainerOpen(true)}
                    className="font-bold text-orange-600 hover:underline"
                  >
                    Manage
                  </button>
                )}
              </div>
            </div>

            {/* Anti-Abuse PIN Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛡️</span>
                  <h4 className="font-black text-slate-900 text-sm">50-PIN Safeguard Tracker</h4>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-950 border border-indigo-400">
                  {remainingPins} / 50 PINs Left
                </span>
              </div>

              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${(remainingPins / 50) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-700 font-semibold">
                <span>Cycle: Oct 2026 – Apr 2027 (6 Mos)</span>
                <button
                  onClick={handleOpenAuditModal}
                  className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <span>Ledger</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Left Column Last 2 Widgets: Connect & Discover */}
            <ConnectWidget pageContext="hallmarks" />
            <DiscoverWidget pageContext="hallmarks" />
          </div>

          {/* CENTER COLUMN (6 cols): Scrollable, no load more, no end */}
          <div className="lg:col-span-6 space-y-6">
            {/* Sovereign Engagement & Activity Console Dropdown Trigger (Non-blocking) */}
            <SovereignEngagementDropdownTrigger module="hallmarks" label="HallMarks" />

            {/* 3. Navigation Tabs, Search & Filters Toolbar */}
            <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 pb-3">
              {/* Tab Navigation */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveTab('communities')}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'communities'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                  }`}
                >
                  <span>🏛️</span>
                  <span>Sovereign Communities ({allCommunities.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('hallmarks')}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'hallmarks'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                  }`}
                >
                  <span>🏅</span>
                  <span>My Accolades ({myHallmarks.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('governance')}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'governance'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                  }`}
                >
                  <span>📜</span>
                  <span>Governance & Protocol</span>
                </button>

                <button
                  onClick={() => setActiveTab('discourse')}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'discourse'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                  }`}
                >
                  <span>💬</span>
                  <span>Discourse ({comments.length})</span>
                </button>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleCreateCommunityClick}
                className="min-h-[44px] bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <PlusIcon className="w-4 h-4" />
                <span>New Community</span>
              </Button>
            </div>

            {/* Live Filter & Search Strip (Visible for Communities tab) */}
            {activeTab === 'communities' && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-300 shadow-sm">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sovereign communities by name, topic or creator..."
                    className="w-full pl-10 pr-4 py-2 text-xs font-bold text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mr-1 hidden sm:inline">
                    Filter:
                  </span>
                  {(['all', 'featured', 'active', 'moderated'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                        statusFilter === filter
                          ? 'bg-orange-100 text-orange-950 border border-orange-400 font-black'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Tab Content: Sovereign Communities Grid */}
          {activeTab === 'communities' && (
            <div className="space-y-6">
              {filteredCommunities.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-300 shadow-sm space-y-3">
                  <span className="text-4xl">🏛️</span>
                  <h3 className="text-lg font-bold text-slate-900">No Communities Matched</h3>
                  <p className="text-xs text-slate-700 max-w-md mx-auto">
                    Try adjusting your search query or filter settings, or launch a new sovereign community page.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                    variant="outline"
                    className="text-xs font-bold border-slate-300 text-slate-800"
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCommunities.map((community) => {
                    const isSuspended =
                      community.status === 'suspended' ||
                      (community.is_suspended && (!community.suspended_until || new Date(community.suspended_until) > new Date()));
                    const isFrozen =
                      community.status === 'frozen' ||
                      (community.is_frozen && (!community.frozen_until || new Date(community.frozen_until) > new Date()));
                    const isModExpanded = expandedModId === community.id;

                    return (
                      <div
                        key={community.id}
                        className={`group bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                          isSuspended
                            ? 'border-rose-300 bg-rose-50/20'
                            : isFrozen
                            ? 'border-blue-300 bg-blue-50/20'
                            : community.featured
                            ? 'border-amber-300/80 hover:border-amber-400'
                            : 'border-slate-300 hover:border-orange-400'
                        }`}
                      >
                        {/* Status Stripe */}
                        <div
                          className={`h-1.5 w-full ${
                            isSuspended
                              ? 'bg-rose-500'
                              : isFrozen
                              ? 'bg-blue-500'
                              : community.featured
                              ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600'
                              : 'bg-emerald-500'
                          }`}
                        />

                        <div className="p-6 space-y-4 flex-1">
                          {/* Badges & Header */}
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-black text-slate-900 text-lg leading-snug group-hover:text-orange-600 transition-colors">
                              {community.name}
                            </h3>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {community.featured && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-400 shadow-2xs">
                                  ★ FEATURED
                                </span>
                              )}
                              {isSuspended ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-950 border border-rose-400">
                                  🚫 SUSPENDED
                                </span>
                              ) : isFrozen ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-950 border border-blue-400">
                                  ❄️ FROZEN (6H)
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-400">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                            {community.description}
                          </p>

                          {/* Warning Banner on Card */}
                          {community.warning_count && community.warning_count > 0 && !isSuspended && !isFrozen && (
                            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-950 flex items-center justify-between font-bold">
                              <span>⚠️ Policy Warning #{community.warning_count}</span>
                              <span className="text-[10px] font-black text-amber-900">Eligible for 1-7d suspend</span>
                            </div>
                          )}

                          {isSuspended && (
                            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-[11px] text-rose-950 font-bold">
                              🚫 Suspended until {community.suspended_until ? new Date(community.suspended_until).toLocaleDateString() : '7 days'}. Slot released!
                            </div>
                          )}

                          {isFrozen && (
                            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-300 text-[11px] text-blue-950 font-bold">
                              ❄️ Frozen for 6 hours by Badge Holder. Slot released!
                            </div>
                          )}

                          {/* Metrics Strip */}
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                              <UsersIcon className="w-3.5 h-3.5 text-slate-600" />
                              <span>{community.members.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                              <TrophyIcon className="w-3.5 h-3.5 text-amber-500" />
                              <span>{community.badgesAwarded} Badges</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold justify-end">
                              <CalendarIcon className="w-3 h-3 text-slate-600" />
                              <span>{new Date(community.createdAt).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 bg-slate-50/80 border-t border-slate-200 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                voiceLineServiceInstance.playVoiceLine('hallmarks');
                                setActionAlert({
                                  type: 'success',
                                  message: `Joined "${community.name}" community channel. Welcome, Sovereign Node!`
                                });
                              }}
                              className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <span>Enter Community</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setExpandedModId(isModExpanded ? null : community.id)}
                              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                                isModExpanded
                                  ? 'bg-amber-100 text-amber-950 border-amber-400'
                                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                              }`}
                              title="Toggle Moderation Tools"
                            >
                              <ShieldIcon className="w-3.5 h-3.5" />
                              <span>Moderate</span>
                            </button>
                          </div>

                          {/* Accordion Moderation Controls */}
                          {isModExpanded && (
                            <div className="pt-2 mt-2 border-t border-dashed border-slate-300 space-y-2 animate-fade-in">
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                                <span>Anti-Abuse Controls:</span>
                                <span className="text-[10px] text-slate-600">ID #{community.id}</span>
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                {!isSuspended && !isFrozen && (
                                  <>
                                    <button
                                      onClick={() => openModAction('warn', community)}
                                      className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-black transition cursor-pointer"
                                      title="Issue formal warning (0 PINs deducted)"
                                    >
                                      ⚠️ Issue Warning (0 PIN)
                                    </button>
                                    <button
                                      onClick={() => openModAction('suspend', community)}
                                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-950 border border-rose-300 text-[11px] font-black transition cursor-pointer"
                                      title="Suspend 1-7 days (Consumes 1 PIN, requires warning first)"
                                    >
                                      🚫 Suspend (-1 PIN)
                                    </button>
                                    <button
                                      onClick={() => openModAction('freeze', community)}
                                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-300 text-[11px] font-black transition cursor-pointer"
                                      title="Freeze for 6 hours (Consumes 1 PIN)"
                                    >
                                      ❄️ Freeze (-1 PIN)
                                    </button>
                                  </>
                                )}
                                {isSuspended && (
                                  <button
                                    onClick={() => handleUnsuspend(community.id)}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-400 text-[11px] font-black transition cursor-pointer"
                                  >
                                    🔄 Unsuspend & Restore Slot
                                  </button>
                                )}
                                {isFrozen && (
                                  <button
                                    onClick={() => handleUnfreeze(community.id)}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-400 text-[11px] font-black transition cursor-pointer"
                                  >
                                    🔄 Unfreeze & Restore Slot
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteHallmark(community.id, community.name)}
                                  className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-300 transition cursor-pointer ml-auto"
                                  title="Permanently delete community and free slot"
                                >
                                  <TrashIcon className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sentinel for infinite scroll */}
              <div ref={sentinelRef} style={{ height: '20px' }} />
              {isLoadingMore && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>
          )}

          {/* 5. Tab Content: My Accolades Tab */}
          {activeTab === 'hallmarks' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Your Protocol Accolades & Badges</h2>
                  <p className="text-xs text-slate-700 mt-0.5">
                    Cryptographic credentials earned for community architecture, governance, and verified milestones.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-950 border border-amber-400 self-start md:self-auto">
                  {myHallmarks.length} Cryptographic HallMarks Minted
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myHallmarks.map((hallmark) => (
                  <div
                    key={hallmark.id}
                    className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-5 relative overflow-hidden"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-md shrink-0">
                      {hallmark.icon || '🏅'}
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-black text-slate-900 text-lg">{hallmark.name}</h3>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 text-indigo-950 border border-indigo-400">
                          {hallmark.rarity}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">{hallmark.description}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-700 font-semibold">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3.5 h-3.5 text-slate-600" />
                          <span>Minted: {new Date(hallmark.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-[11px] border border-slate-300">
                          {hallmark.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Tab Content: Governance Framework */}
          {activeTab === 'governance' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-300 shadow-sm space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-950 text-xs font-black uppercase tracking-wider mb-2 border border-indigo-300">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    Protocol Standard V3
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Sovereign Community Governance Rules</h2>
                  <p className="text-sm text-slate-700 mt-1 max-w-3xl">
                    The FingerMobile Protocol implements strict anti-abuse mechanisms to prevent centralized capture, protect community integrity, and guarantee creator rights.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-6 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2">
                    <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <span className="text-xl">👥</span>
                      2-Page Profile Concurrency Limit
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      Each user profile can maintain up to two (2) active HallMarks pages concurrently. To launch a third, an existing page must be deleted by author/admin, suspended, or frozen. This prevents name squatting and encourages high-quality active hubs.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                    <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <span className="text-xl">🛡️</span>
                      50-PIN Semi-Annual Quota
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      Moderators & Badge Holders hold exactly 50 PINs per 6-month rotation. Suspensions (1–7 days) and Freezes (6 hours) each deduct exactly 1 PIN, preventing power-tripping and spamming of moderation sanctions.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <span className="text-xl">⚠️</span>
                      Mandatory Prior Warning Rule
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      A Moderator cannot enact a suspension without first logging at least one formal policy warning on the community record (0 PINs deducted). Every warning provides an audit trail with documented rationale.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                    <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <span className="text-xl">❄️</span>
                      Badge Freeze Circuit-Breaker
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      Any verified Badge-carrying member can execute an emergency 6-hour freeze in urgent harassment or security events, deducting 1 PIN from their 50-PIN quota and immediately releasing creation capacity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. Tab Content: Discourse & Commendations */}
          {activeTab === 'discourse' && (
            <div className="bg-white rounded-3xl p-8 border border-slate-300 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <span>🏅</span> Hallmark Commendations & Node Discourse
                  </h3>
                  <p className="text-xs text-slate-700 mt-0.5">
                    Share commendations, celebrate sovereign milestone unlocks, and interact with fellow node architects.
                  </p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-950 rounded-full border border-orange-400 font-black text-xs self-start sm:self-auto">
                  {comments.length} Commendations
                </span>
              </div>

              {/* Commendation Form */}
              <form onSubmit={handlePostCommendation} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Share a congratulatory commendation or milestone achievement..."
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
                />
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-sm cursor-pointer"
                >
                  Post Commendation
                </Button>
              </form>

              {/* Commendations Stream */}
              <div className="space-y-3 pt-2">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">@{c.author}</span>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                          {c.role}
                        </span>
                        <span className="text-[10px] text-slate-700 font-semibold">• {c.time}</span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-semibold">{c.text}</p>
                    </div>

                    <button
                      onClick={() => voiceLineServiceInstance.playCommentaryVoiceLine('hallmarks')}
                      className="p-2 rounded-xl bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200 transition-colors shrink-0 cursor-pointer"
                      title="Audio Commentary Preview"
                    >
                      <Volume2 className="w-4 h-4 text-orange-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>

          {/* RIGHT COLUMN (3 cols): Static, does not scroll, loads Platform Widgets & Canary Ads */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto space-y-4 scrollbar-none pl-1">
            <PlatformWidgetsAndAdsRail
              pageContext="hallmarks"
              initialChildren={
                <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-4 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">Mega-Community Cap</span>
                    <span className="text-[10px] bg-purple-500/40 text-purple-200 px-2 py-0.5 rounded-full font-bold">250,000 Nodes</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black">Hallmark Governance Hub</h4>
                    <p className="text-[11px] text-purple-200 mt-1 line-clamp-2">
                      Sovereign collectives with autonomous voting, tokenized badges, and cryptographic 50-PIN moderation safeguards.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-purple-800/60">
                    <span className="text-purple-300">Active Hallmarks:</span>
                    <span className="font-mono font-bold text-emerald-400">{filteredCommunities.length}</span>
                  </div>
                </div>
              }
            />
          </div>
        </div>

          {/* MODAL 1: Create Hallmark Modal */}
          <CreateHallmarkModal
            isOpen={isCreateModalOpen}
            onClose={() => {
              setIsCreateModalOpen(false);
              refreshQuota();
              refreshCommunities();
            }}
            activeCount={createdCount}
            maxAllowed={maxAllowed}
            onCommunityCreated={(newComm) => {
              setCommunityItems((prev) => [newComm, ...prev]);
              refreshQuota();
              refreshCommunities();
            }}
          />

          {/* MODAL 2: 2-Page Quota Limit Explainer Modal */}
          {isQuotaExplainerOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 space-y-5">
                <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">HallMarks™ Capacity Limit (2/2)</h3>
                      <p className="text-xs text-slate-700">Maximum allocation reached for this profile</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsQuotaExplainerOpen(false)}
                    className="text-slate-700 hover:text-slate-900 text-lg font-black p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-950 space-y-2 leading-relaxed font-semibold">
                  <p className="font-black text-amber-950">
                    Protocol Rule: One Member / User Profile can only create a maximum of two (2) HallMarks pages.
                  </p>
                  <p>A creation slot is automatically restored when one of your active pages is:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Deleted</strong> by you (author/creator) or a SuperAdmin.</li>
                    <li><strong>Suspended</strong> by a Moderator (for 1–7 days, after a prior warning).</li>
                    <li><strong>Frozen</strong> by a Badge-carrying Member (for 6 hours).</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                    Your Active HallMarks Pages:
                  </h4>
                  <div className="space-y-2">
                    {quota?.myPages && quota.myPages.length > 0 ? (
                      quota.myPages.map((p: any) => (
                        <div
                          key={p.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-300 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-black text-slate-900">{p.name}</div>
                            <div className="text-[10px] text-slate-700 font-semibold">
                              Status: <span className="font-bold text-emerald-600">{p.status}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setIsQuotaExplainerOpen(false);
                              handleDeleteHallmark(p.id, p.name);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                          >
                            <TrashIcon className="w-3.5 h-3.5" /> Delete & Free Slot
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 text-center font-semibold">
                        No individual ownership pages found in active state.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => setIsQuotaExplainerOpen(false)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Understood
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL 3: 50-PIN Moderation Audit Ledger Modal */}
          {isAuditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 space-y-4 max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📜</span>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Moderation 50-PIN Audit Ledger</h3>
                      <p className="text-xs text-slate-700">Transparent ledger of all moderation PIN executions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAuditModalOpen(false)}
                    className="text-slate-700 hover:text-slate-900 text-lg font-black p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {auditLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                  ) : auditLogs.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-700 font-semibold space-y-2">
                      <span className="text-2xl block">🛡️</span>
                      <p>No moderation actions logged in the current 6-month cycle. Full 50 PINs intact.</p>
                    </div>
                  ) : (
                    auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                log.action_type === 'suspend'
                                  ? 'bg-rose-100 text-rose-950 border border-rose-300'
                                  : log.action_type === 'freeze'
                                  ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold'
                                  : 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                              }`}
                            >
                              {log.action_type}
                            </span>
                            <span className="font-black text-slate-900">Hallmark #{log.hallmark_id}</span>
                            {log.duration_hours && (
                              <span className="text-slate-700 font-semibold">({log.duration_hours}h duration)</span>
                            )}
                          </div>
                          <div className="text-slate-700 text-[11px] italic font-semibold">"{log.reason}"</div>
                        </div>

                        <div className="text-right text-[10px] text-slate-600 font-bold">
                          <div>Pin: -1 PIN</div>
                          <div>{new Date(log.created_at || Date.now()).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-200">
                  <Button
                    onClick={() => setIsAuditModalOpen(false)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Close Ledger
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL 4: Moderation Action Execution Modal */}
          {modModal.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-300 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>{modModal.type === 'warn' ? '⚠️' : modModal.type === 'suspend' ? '🚫' : '❄️'}</span>
                    <span>
                      {modModal.type === 'warn'
                        ? 'Issue Policy Warning'
                        : modModal.type === 'suspend'
                        ? 'Execute Suspension'
                        : 'Freeze Hallmark (6h)'}
                    </span>
                  </h3>
                  <button
                    onClick={() => setModModal((prev) => ({ ...prev, isOpen: false }))}
                    className="text-slate-700 hover:text-slate-900 text-lg font-black p-1"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleExecuteModAction} className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-1">
                      Target Community
                    </label>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs font-black text-slate-900">
                      {modModal.community?.name}
                    </div>
                  </div>

                  {modModal.type === 'suspend' && (
                    <div>
                      <label className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-1">
                        Suspension Duration (Days)
                      </label>
                      <select
                        value={modModal.durationDays}
                        onChange={(e) =>
                          setModModal((prev) => ({ ...prev, durationDays: Number(e.target.value) }))
                        }
                        className="w-full text-xs font-black text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500"
                      >
                        <option value={1}>1 Day (24 Hours)</option>
                        <option value={3}>3 Days (Standard)</option>
                        <option value={7}>7 Days (Maximum)</option>
                      </select>
                      <p className="text-[11px] text-slate-600 mt-1 font-semibold">
                        Deducts 1 PIN from your 50-PIN quota and immediately frees 1 creation slot for the community creator.
                      </p>
                    </div>
                  )}

                  {modModal.type === 'freeze' && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-semibold space-y-1">
                      <p className="font-black text-blue-950">Badge-Holder Emergency Circuit-Breaker</p>
                      <p>
                        Freezes public interaction for 6 hours. Deducts 1 PIN from your quota and restores creation capacity.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-1">
                      Reason / Policy Violation Justification
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={modModal.reason}
                      onChange={(e) => setModModal((prev) => ({ ...prev, reason: e.target.value }))}
                      placeholder="Specify the exact code of conduct violation or rationale..."
                      className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setModModal((prev) => ({ ...prev, isOpen: false }))}
                      className="text-xs font-bold border-slate-300 text-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={`text-xs font-black text-white ${
                        modModal.type === 'warn'
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : modModal.type === 'suspend'
                          ? 'bg-rose-600 hover:bg-rose-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      Confirm {modModal.type === 'warn' ? 'Warning' : 'Execution'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Sovereign Mobile Navigation Quick Dock */}
        <nav
          aria-label="Hallmarks Master Navigation"
          className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('communities');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold transition-colors cursor-pointer ${
              activeTab === 'communities' ? 'text-orange-400' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span>Guilds</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('hallmarks');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold transition-colors cursor-pointer ${
              activeTab === 'hallmarks' ? 'text-amber-400' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-5 h-5 mb-0.5" />
            <span>Accolades</span>
          </button>
          <button
            type="button"
            onClick={handleCreateCommunityClick}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <PlusIcon className="w-5 h-5 mb-0.5" />
            <span>Create</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAuditModal}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <ShieldIcon className="w-5 h-5 mb-0.5" />
            <span>Audit</span>
          </button>
        </nav>
      </div>
    </MainLayout>
  );
};

export default HallmarksPage;
