/*
 * FingerMobile Protocol™ - Hallmarks Page Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { hallmarksService, Hallmark } from '../services/HallmarksService';
import { useAppContext } from '../contexts/AppContext';
import CreateHallmarkModal from '../components/hallmark/CreateHallmarkModal';
import UniversalProfileCard from '../components/common/UniversalProfileCard';

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
    periodStart?: string;
    periodEnd?: string;
  };
}

const HallmarksPage: React.FC = () => {
  const { user } = useAppContext();
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: 1,
      name: 'Tech Innovators',
      description: 'For tech enthusiasts and innovators to share ideas and projects',
      members: 1242,
      badgesAwarded: 42,
      createdAt: '2023-05-15',
      featured: true,
      status: 'active',
      warning_count: 0
    },
    {
      id: 2,
      name: 'Art & Design',
      description: 'Creative minds sharing artistic works and design inspiration',
      members: 892,
      badgesAwarded: 28,
      createdAt: '2023-06-22',
      featured: false,
      status: 'active',
      warning_count: 1
    },
    {
      id: 3,
      name: 'Fitness Warriors',
      description: 'Motivation and tips for fitness enthusiasts',
      members: 2105,
      badgesAwarded: 67,
      createdAt: '2023-04-10',
      featured: true,
      status: 'active',
      warning_count: 0
    },
    {
      id: 4,
      name: 'Book Club',
      description: 'Literature lovers discussing books and authors',
      members: 542,
      badgesAwarded: 15,
      createdAt: '2023-07-01',
      featured: false,
      status: 'active',
      warning_count: 0
    },
    {
      id: 5,
      name: 'Entrepreneurs Hub',
      description: 'Networking and sharing business insights',
      members: 784,
      badgesAwarded: 35,
      createdAt: '2023-03-18',
      featured: true,
      status: 'active',
      warning_count: 0
    }
  ]);

  const [myHallmarks, setMyHallmarks] = useState<Hallmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState<QuotaData | null>(null);

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
  const [comments, setComments] = useState<Array<{ id: string; author: string; text: string; time: string }>>([
    { id: '1', author: 'Nia Adebayo', text: 'Huge congratulations to all sovereign node builders awarded the Top Contributor Hallmark!', time: '10m ago' },
    { id: '2', author: 'Tariq Al-Mansoor', text: 'Proud to see our Digital Living Room community achieve the Community Builder Hallmark milestone today!', time: '25m ago' }
  ]);

  // Load Quota
  const refreshQuota = useCallback(async () => {
    try {
      const res = await hallmarksService.getQuota();
      if (res.success && res.data) {
        setQuota(res.data);
      }
    } catch (err) {
      console.warn('Failed to load hallmarks quota:', err);
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
    } catch (err) {
      console.warn('Failed to load communities from API:', err);
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
            description: 'Awarded for consistently helpful contributions',
            rarity: 'rare',
            category: 'achievement',
            criteria: {},
            createdAt: '2023-08-12',
            updatedAt: '2023-08-12',
            icon: '🏆'
          },
          {
            id: 2,
            name: 'Community Builder',
            description: 'Recognized for creating valuable content',
            rarity: 'epic',
            category: 'community',
            criteria: {},
            createdAt: '2023-07-22',
            updatedAt: '2023-07-22',
            icon: '🏗️'
          }
        ]);
        return;
      }

      try {
        const response = await hallmarksService.getUserHallmarks(user.id);
        if (response.success && response.data) {
          setMyHallmarks(response.data.map((uh: any) => uh.hallmark));
        }
      } catch (err) {
        console.error('Error fetching user hallmarks:', err);
      }
    };

    fetchUserHallmarks();
  }, [user]);

  // Infinite scroll
  const loadMoreItems = useCallback(async () => {
    if (isLoggedIn || !hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newItems: Community[] = Array.from({ length: 3 }, (_, i) => ({
      id: communities.length + communityItems.length + i + 1,
      name: `Sovereign Guild ${page}.${i + 1}`,
      description: `Decentralized collective ${page}.${i + 1} on FingerMobile Protocol`,
      members: Math.floor(Math.random() * 5000) + 100,
      badgesAwarded: Math.floor(Math.random() * 100),
      createdAt: new Date().toISOString().split('T')[0],
      featured: Math.random() > 0.5,
      status: 'active',
      warning_count: 0
    }));

    setCommunityItems(prev => [...prev, ...newItems]);
    setPage(prev => prev + 1);
    if (page >= 6) setHasMore(false);
    setIsLoadingMore(false);
  }, [hasMore, isLoadingMore, isLoggedIn, page, communities.length, communityItems.length]);

  useEffect(() => {
    if (isLoggedIn) {
      setHasMore(false);
      return;
    }
    if (sentinelRef.current) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
        }
      }, { threshold: 1.0 });
      observer.current.observe(sentinelRef.current);
    }
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loadMoreItems, hasMore, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      setCommunityItems(communities);
    }
  }, [communities, isLoggedIn]);

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
    setModModal(prev => ({ ...prev, isOpen: false }));

    try {
      if (type === 'warn') {
        const res = await hallmarksService.warnHallmark(community.id, reason);
        if (res.success) {
          setActionAlert({ type: 'success', message: `Formal policy warning logged on "${community.name}". (0 PINs deducted)` });
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
    } catch (err) {
      console.warn('Failed to load audit logs:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  const handlePostCommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      author: user?.username || 'You',
      text: commentInput.trim(),
      time: 'Just now'
    };
    setComments(prev => [newComment, ...prev]);
    voiceLineServiceInstance.playCommentaryVoiceLine('hallmarks');
    setCommentInput('');
  };

  const allCommunities = [...communities, ...communityItems].filter((c, i, self) =>
    i === self.findIndex(item => item.id === c.id)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6b00]"></div>
      </div>
    );
  }

  const createdCount = quota?.createdCount ?? 0;
  const maxAllowed = quota?.maxAllowed ?? 2;
  const remainingPins = quota?.moderationQuota?.remainingPins ?? 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-purple-50/20 to-indigo-50/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center pt-2 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#ff6b00] text-xs font-bold uppercase tracking-wider mb-2">
            <span>🛡️</span> Sovereign Recognition & Communities
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">HallMarks™ Hub</h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mt-1">
            Build and manage sovereign community pages, verify credentials, and enforce protocol standards.
          </p>
        </div>

        {/* Global Toast Alert */}
        {actionAlert && (
          <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm animate-fade-in ${
            actionAlert.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{actionAlert.type === 'success' ? '✓' : '⚠️'}</span>
              <p className="text-sm font-medium">{actionAlert.message}</p>
            </div>
            <button
              onClick={() => setActionAlert(null)}
              className="text-xs font-bold hover:underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Layout with UniversalProfileCard on Top Left */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Top Left ProfileCard Column */}
          <div className="lg:col-span-1 space-y-4">
            <UniversalProfileCard />
          </div>

          {/* Main Dashboard & Content Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* 1. HallMarks Page Creation Quota Dashboard Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">HallMarks Page Creation Quota</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  createdCount >= maxAllowed ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold' : 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold'
                }`}>
                  {createdCount} / {maxAllowed} Pages Active
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-xl">
                One user profile can create a maximum of <strong>two (2) HallMarks pages</strong>. A slot is restored when an existing page is deleted by creator/author/SuperAdmin, suspended (1–7 days), or frozen (6 hrs).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-xl border border-slate-300">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                  createdCount >= 1 ? 'bg-orange-500 text-white shadow-sm' : 'bg-white text-gray-400 border border-dashed border-gray-300'
                }`}>
                  <span>Slot 1:</span> {createdCount >= 1 ? 'Active' : 'Available'}
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                  createdCount >= 2 ? 'bg-orange-500 text-white shadow-sm' : 'bg-white text-gray-400 border border-dashed border-gray-300'
                }`}>
                  <span>Slot 2:</span> {createdCount >= 2 ? 'Active' : 'Available'}
                </div>
              </div>

              {createdCount >= maxAllowed && (
                <Button
                  onClick={() => setIsQuotaExplainerOpen(true)}
                  variant="outline"
                  className="text-xs font-bold border-amber-300 text-amber-800 hover:bg-amber-50"
                >
                  Manage Capacity
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Moderator & Badge-Holder 50-PIN Safeguard Tracker Bar */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 text-white rounded-2xl p-5 shadow-sm border border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <h3 className="text-base font-bold text-white">Sovereign Moderation Anti-Abuse Safeguard</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ff6b00] text-white">
                  {remainingPins} / 50 PINs Available
                </span>
              </div>
              <p className="text-xs text-gray-300 max-w-2xl">
                To prevent moderation abuse, Moderators & Badge Holders are strictly limited to <strong>50 PINs each</strong>, rotating automatically every <strong>6 months</strong>. Each suspension (1–7d after warning) or freeze (6h) consumes exactly 1 PIN.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Current Cycle</div>
                <div className="text-xs font-bold text-orange-400">Oct 2026 – Apr 2027 (6 Mos)</div>
              </div>
              <Button
                onClick={handleOpenAuditModal}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-sm"
              >
                <span>📜</span> View PIN Audit Ledger
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="communities" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm rounded-xl p-1 mb-6 border border-slate-300">
            <TabsTrigger value="communities" className="data-[state=active]:bg-[#ff6b00] data-[state=active]:text-white rounded-lg py-2 font-bold text-xs">
              Communities ({allCommunities.length})
            </TabsTrigger>
            <TabsTrigger value="hallmarks" className="data-[state=active]:bg-[#ff6b00] data-[state=active]:text-white rounded-lg py-2 font-bold text-xs">
              My Accolades ({myHallmarks.length})
            </TabsTrigger>
            <TabsTrigger value="discover" className="data-[state=active]:bg-[#ff6b00] data-[state=active]:text-white rounded-lg py-2 font-bold text-xs">
              Discover & Governance
            </TabsTrigger>
          </TabsList>

          {/* Communities Tab */}
          <TabsContent value="communities" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Live Communities</h2>
                <p className="text-xs text-gray-500">Explore, participate, or moderate protocol community pages.</p>
              </div>
              <Button
                onClick={handleCreateCommunityClick}
                className="bg-[#ff6b00] hover:bg-[#e05e00] text-white flex items-center font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm"
              >
                <PlusIcon className="w-4 h-4 mr-1.5" />
                Create Community ({createdCount}/{maxAllowed})
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCommunities.map((community) => {
                const isSuspended = community.status === 'suspended' || (community.is_suspended && (!community.suspended_until || new Date(community.suspended_until) > new Date()));
                const isFrozen = community.status === 'frozen' || (community.is_frozen && (!community.frozen_until || new Date(community.frozen_until) > new Date()));

                return (
                  <Card key={community.id} className="overflow-hidden bg-white shadow-sm rounded-2xl border border-slate-300 hover:shadow-md transition-shadow flex flex-col justify-between">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg font-bold text-gray-900">{community.name}</CardTitle>
                        <div className="flex items-center gap-1">
                          {community.featured && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] px-2 py-0.5">
                              Featured
                            </Badge>
                          )}
                          {isSuspended ? (
                            <Badge className="bg-red-600 text-white text-[10px] px-2 py-0.5">
                              🚫 Suspended
                            </Badge>
                          ) : isFrozen ? (
                            <Badge className="bg-blue-600 text-white text-[10px] px-2 py-0.5">
                              ❄️ Frozen (6h)
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0.5">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-xs text-gray-600 line-clamp-2 mt-1">
                        {community.description}
                      </CardDescription>

                      {/* Warnings or Suspension Alert Banner on Card */}
                      {community.warning_count && community.warning_count > 0 && !isSuspended && !isFrozen && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-center justify-between">
                          <span>⚠️ Warning logged ({community.warning_count})</span>
                          <span className="text-[10px] text-amber-700">Eligible for 1–7d suspension</span>
                        </div>
                      )}
                      {isSuspended && (
                        <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-900">
                          🚫 Suspended until {community.suspended_until ? new Date(community.suspended_until).toLocaleDateString() : '7 days'}. Slot freed!
                        </div>
                      )}
                      {isFrozen && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900">
                          ❄️ Frozen for 6 hours by Badge Holder. Slot freed!
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="pb-3 text-xs text-gray-500 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <UsersIcon className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          <span>{community.members.toLocaleString()} members</span>
                        </div>
                        <div className="flex items-center">
                          <TrophyIcon className="w-3.5 h-3.5 mr-1 text-amber-500" />
                          <span>{community.badgesAwarded} badges</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-400 text-[11px]">
                        <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                        <span>Created {new Date(community.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2 pb-4 px-4 border-t border-gray-100 flex flex-col gap-2">
                      <div className="flex items-center justify-between w-full">
                        <Button variant="outline" className="text-xs font-semibold px-3 py-1.5 h-8 border-gray-300 text-gray-700">
                          <EyeIcon className="w-3.5 h-3.5 mr-1.5" /> View
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-1.5 h-8">
                          Join
                        </Button>
                      </div>

                      {/* Moderation & Admin Control Bar */}
                      <div className="w-full pt-2 mt-1 border-t border-dashed border-gray-200 flex flex-wrap items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Moderation:</span>
                        <div className="flex items-center gap-1">
                          {!isSuspended && !isFrozen && (
                            <>
                              <button
                                onClick={() => openModAction('warn', community)}
                                className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-400 font-bold text-[11px] font-bold transition"
                                title="Issue formal policy warning (0 PINs)"
                              >
                                ⚠️ Warn
                              </button>
                              <button
                                onClick={() => openModAction('suspend', community)}
                                className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition"
                                title="Suspend 1-7 days (Consumes 1 PIN, requires prior warning)"
                              >
                                🚫 Suspend (-1 PIN)
                              </button>
                              <button
                                onClick={() => openModAction('freeze', community)}
                                className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-400 font-bold text-[11px] font-bold transition"
                                title="Freeze for 6 hours (Consumes 1 PIN)"
                              >
                                ❄️ Freeze (-1 PIN)
                              </button>
                            </>
                          )}
                          {isSuspended && (
                            <button
                              onClick={() => handleUnsuspend(community.id)}
                              className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold text-[11px] font-bold transition"
                            >
                              🔄 Restore / Unsuspend
                            </button>
                          )}
                          {isFrozen && (
                            <button
                              onClick={() => handleUnfreeze(community.id)}
                              className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold text-[11px] font-bold transition"
                            >
                              🔄 Restore / Unfreeze
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteHallmark(community.id, community.name)}
                            className="p-1 rounded text-gray-400 hover:text-rose-600 transition"
                            title="Delete page and release 1 creation slot (Creator / SuperAdmin)"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Sentinel element for infinite scroll */}
            <div ref={sentinelRef} style={{ height: '20px' }} />
            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6b00]"></div>
              </div>
            )}
          </TabsContent>

          {/* Accolades Tab */}
          <TabsContent value="hallmarks" className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Your Earned Hallmarks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myHallmarks.map((hallmark) => (
                <Card key={hallmark.id} className="overflow-hidden bg-white shadow-sm rounded-2xl border border-slate-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{hallmark.icon || '🏅'}</div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">{hallmark.name}</CardTitle>
                        <CardDescription className="text-xs text-gray-600">{hallmark.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-xs text-gray-400">
                      <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                      <span>Awarded {new Date(hallmark.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary" className="mr-2 text-xs">
                        {hallmark.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {hallmark.rarity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-300 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Sovereign Community Governance Rules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                  <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                    <span>👥</span> 2-Page Profile Limit
                  </h4>
                  <p>
                    Each user profile can maintain up to two (2) active HallMarks pages concurrently. To launch a third, an existing page must be deleted by author/admin, suspended, or frozen.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                    <span>🛡️</span> 50-PIN Semi-Annual Quota
                  </h4>
                  <p>
                    Moderators & Badge Holders hold 50 PINs per 6-month rotation. Suspensions (1–7 days) and Freezes (6 hours) each deduct 1 PIN, preventing moderation abuse.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                  <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                    <span>⚠️</span> Mandatory Warning Rule
                  </h4>
                  <p>
                    A Moderator cannot enact a suspension without first logging at least one formal policy warning on the community record.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                  <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                    <span>❄️</span> Badge Freeze Capability
                  </h4>
                  <p>
                    Any verified Badge-carrying member can execute a 6-hour freeze in urgent harassment or security events, deducting 1 PIN from their 50-PIN quota.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Discourse / Commendations */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-300 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>🏅</span> Hallmark Commendations & Discourse
              </h3>
              <p className="text-xs text-gray-500">
                Congratulate peers on milestone unlocks and share community hallmark accolades.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-orange-50 text-[#ff6b00] rounded-full">
              {comments.length} Commendations
            </span>
          </div>

          <form onSubmit={handlePostCommendation} className="flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Leave an encouraging comment or commendation..."
              className="flex-1 bg-gray-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
            />
            <Button type="submit" className="bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs px-5 rounded-xl">
              Post
            </Button>
          </form>

          <div className="space-y-2 pt-1">
            {comments.map((c) => (
              <div key={c.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start justify-between text-xs">
                <div>
                  <span className="font-bold text-gray-900 mr-2">@{c.author}</span>
                  <span className="text-[10px] text-gray-400">{c.time}</span>
                  <p className="text-gray-700 mt-1">{c.text}</p>
                </div>
              </div>
            ))}
            </div>
          </div>
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">HallMarks™ Capacity Limit (2/2)</h3>
                  <p className="text-xs text-gray-500">Maximum allocation reached for this profile</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuotaExplainerOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2 leading-relaxed">
              <p className="font-bold text-amber-950">
                Protocol Rule: One Member / User Profile can only create a maximum of two (2) HallMarks pages.
              </p>
              <p>
                A creation slot is automatically restored when one of your active pages is:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Deleted</strong> by you (author/creator) or a SuperAdmin.</li>
                <li><strong>Suspended</strong> by a Moderator (for 1–7 days, after a prior warning).</li>
                <li><strong>Frozen</strong> by a Badge-carrying Member (for 6 hours).</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Your Active HallMarks Pages:</h4>
              <div className="space-y-2">
                {quota?.myPages && quota.myPages.length > 0 ? (
                  quota.myPages.map((page: any) => (
                    <div key={page.id} className="p-3 bg-gray-50 rounded-xl border border-slate-300 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-gray-900">{page.name}</div>
                        <div className="text-[10px] text-gray-500">Status: <span className="font-semibold text-emerald-600">{page.status}</span></div>
                      </div>
                      <button
                        onClick={() => {
                          setIsQuotaExplainerOpen(false);
                          handleDeleteHallmark(page.id, page.name);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                      >
                        <TrashIcon className="w-3.5 h-3.5" /> Delete & Free Slot
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl border text-xs text-gray-500 text-center">
                    No individual ownership pages found in active state.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setIsQuotaExplainerOpen(false)}
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
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
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📜</span>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">Moderation 50-PIN Audit Ledger</h3>
                  <p className="text-xs text-gray-500">Transparent ledger of all moderation PIN executions</p>
                </div>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {auditLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#ff6b00]"></div>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  No moderation actions logged in the current 6-month cycle. Full 50 PINs intact.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.action_type === 'suspend' ? 'bg-rose-100 text-rose-800' :
                          log.action_type === 'freeze' ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold' :
                          'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                        }`}>
                          {log.action_type}
                        </span>
                        <span className="font-bold text-gray-900">Hallmark #{log.hallmark_id}</span>
                        {log.duration_hours && (
                          <span className="text-gray-400">({log.duration_hours}h duration)</span>
                        )}
                      </div>
                      <div className="text-gray-600 text-[11px] italic">"{log.reason}"</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-rose-600 text-[11px]">-{log.pins_consumed} PIN</div>
                      <div className="text-[10px] text-gray-400">
                        {log.created_at ? new Date(log.created_at).toLocaleDateString() : 'Recent'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                Remaining Balance: <strong>{remainingPins} / 50 PINs</strong>
              </span>
              <Button
                onClick={() => setIsAuditModalOpen(false)}
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-5 py-2 rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Moderation Action Execution Modal (Warn / Suspend / Freeze) */}
      {modModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleExecuteModAction} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {modModal.type === 'warn' ? '⚠️' : modModal.type === 'suspend' ? '🚫' : '❄️'}
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 capitalize">
                    {modModal.type === 'warn' ? 'Issue Formal Policy Warning' :
                     modModal.type === 'suspend' ? 'Enact Community Suspension (1–7 Days)' :
                     'Enact 6-Hour Member Freeze'}
                  </h3>
                  <p className="text-xs text-gray-500">Target: {modModal.community?.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModModal(prev => ({ ...prev, isOpen: false }))}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className={`p-3 rounded-xl text-xs ${
              modModal.type === 'warn'
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}>
              {modModal.type === 'warn' && (
                <span>⚠️ Formal warnings do not consume PINs. This creates an auditable record required before any subsequent suspension.</span>
              )}
              {modModal.type === 'suspend' && (
                <span>🚫 Suspension consumes <strong>1 PIN</strong> from your 50-PIN quota. Validated: target has prior warning on file.</span>
              )}
              {modModal.type === 'freeze' && (
                <span>❄️ Freeze is locked to <strong>6 hours</strong> and consumes <strong>1 PIN</strong> from your 50-PIN quota.</span>
              )}
            </div>

            {modModal.type === 'suspend' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Suspension Duration (Days): {modModal.durationDays}
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={modModal.durationDays}
                  onChange={(e) => setModModal(prev => ({ ...prev, durationDays: Number(e.target.value) }))}
                  className="w-full accent-[#ff6b00]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>1 Day</span>
                  <span>3 Days</span>
                  <span>7 Days (Max)</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Policy Reason / Justification <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={modModal.reason}
                onChange={(e) => setModModal(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Enter specific protocol rule violation reason..."
                className="w-full bg-gray-50 border border-slate-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModModal(prev => ({ ...prev, isOpen: false }))}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={`text-xs font-bold text-white ${
                  modModal.type === 'warn' ? 'bg-amber-600 hover:bg-amber-700' :
                  modModal.type === 'suspend' ? 'bg-rose-600 hover:bg-rose-700' :
                  'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Confirm {modModal.type === 'warn' ? 'Warning' : 'Execution'}
              </Button>
            </div>
          </form>
        </div>
      )}

      </div>
    </div>
  );
};

export default HallmarksPage;
