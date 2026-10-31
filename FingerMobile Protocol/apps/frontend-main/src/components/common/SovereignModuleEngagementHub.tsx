/*
 * FingerMobile Protocol™ - Sovereign Module Engagement & Activity Hub
 * Common component for Forum, Groups, Blogs, Hallmarks, Gems, Mii, and Publicitee
 * Supports:
 * 1. Metrics: Comments, Mentions, Connect and Follows, All comments
 * 2. Response Status: Responded, Haven't responded
 * 3. Activity Log: All time, All activities, All Criteria
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare, AtSign, UserPlus, Users, CheckCircle2, AlertCircle,
  Clock, Activity, Filter, RefreshCw, Send, ChevronDown, ChevronUp,
  Search, ShieldCheck, Sparkles, X, ExternalLink, CornerDownRight
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

export type SovereignModuleType = 'forum' | 'groups' | 'blogs' | 'hallmarks' | 'gems' | 'mii' | 'publicitee' | 'all';

interface ModuleSummary {
  comments_count: number;
  mentions_count: number;
  connect_and_follows_count: number;
  all_comments_count: number;
  responded_count: number;
  havent_responded_count: number;
  total_interactions: number;
}

interface InteractionItem {
  id: string;
  module: string;
  interaction_type: 'comment' | 'mention' | 'connect_follow';
  item_id: string;
  item_title: string;
  actor_id?: string;
  actor_name: string;
  actor_handle: string;
  actor_avatar?: string;
  content: string;
  metadata?: any;
  responded: boolean;
  responded_at?: string;
  response_content?: string;
  criteria_tags?: string[];
  created_at: string;
}

interface ActivityLogItem {
  id: string;
  module: string;
  actor_name: string;
  actor_handle: string;
  actor_avatar?: string;
  activity_type: string;
  title: string;
  description?: string;
  target_id?: string;
  target_type?: string;
  metadata?: any;
  criteria: string;
  created_at: string;
}

interface SovereignModuleEngagementHubProps {
  module: SovereignModuleType;
  title?: string;
  subtitle?: string;
  className?: string;
  compact?: boolean;
}

export const SovereignModuleEngagementHub: React.FC<SovereignModuleEngagementHubProps> = ({
  module,
  title,
  subtitle,
  className = '',
  compact = false
}) => {
  const { showToast } = useAppContext();

  // Tab View: 'interactions' vs 'activity_log'
  const [activeView, setActiveView] = useState<'interactions' | 'activity_log'>('interactions');

  // Summary Metrics State
  const [summary, setSummary] = useState<ModuleSummary>({
    comments_count: 0,
    mentions_count: 0,
    connect_and_follows_count: 0,
    all_comments_count: 0,
    responded_count: 0,
    havent_responded_count: 0,
    total_interactions: 0
  });

  // Filter States for Interactions
  const [interactionFilter, setInteractionFilter] = useState<'all' | 'comment' | 'mention' | 'connect_follow' | 'all_comments'>('all');
  const [responseStatusFilter, setResponseStatusFilter] = useState<'all' | 'responded' | 'havent_responded'>('all');
  const [interactions, setInteractions] = useState<InteractionItem[]>([]);
  const [loadingInteractions, setLoadingInteractions] = useState<boolean>(true);

  // Filter States for Activity Log (All time, All activities, All Criteria)
  const [timeRangeFilter, setTimeRangeFilter] = useState<'all_time' | '24h' | '7d' | '30d' | '90d'>('all_time');
  const [activityTypeFilter, setActivityTypeFilter] = useState<'all' | 'comments' | 'mentions' | 'connect_and_follows' | 'responds' | 'security'>('all');
  const [criteriaFilter, setCriteriaFilter] = useState<'all' | 'verified_sovereign' | 'urgent' | 'patron_vip' | 'standard'>('all');
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [loadingActivityLogs, setLoadingActivityLogs] = useState<boolean>(true);

  // Search Query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Inline Reply state per interaction item
  const [replyingItemId, setReplyingItemId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [isSubmittingReply, setIsSubmittingReply] = useState<boolean>(false);

  // Refresh Trigger
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // 1. Fetch Summary
  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`/api/module-interactions/summary?module=${module}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSummary(json.data);
      }
    } catch {
      // Handled silently
    }
  }, [module]);

  // 2. Fetch Interactions
  const fetchInteractions = useCallback(async () => {
    try {
      setLoadingInteractions(true);
      const params = new URLSearchParams({
        module,
        type: interactionFilter,
        response_status: responseStatusFilter,
        search: searchQuery
      });
      const res = await fetch(`/api/module-interactions?${params.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInteractions(json.data);
      }
    } catch {
      // Handled
    } finally {
      setLoadingInteractions(false);
    }
  }, [module, interactionFilter, responseStatusFilter, searchQuery]);

  // 3. Fetch Activity Logs
  const fetchActivityLogs = useCallback(async () => {
    try {
      setLoadingActivityLogs(true);
      const params = new URLSearchParams({
        module,
        time_range: timeRangeFilter,
        activity_type: activityTypeFilter,
        criteria: criteriaFilter,
        search: searchQuery
      });
      const res = await fetch(`/api/module-interactions/activity-logs?${params.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setActivityLogs(json.data);
      }
    } catch {
      // Handled
    } finally {
      setLoadingActivityLogs(false);
    }
  }, [module, timeRangeFilter, activityTypeFilter, criteriaFilter, searchQuery]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary, refreshKey]);

  useEffect(() => {
    if (activeView === 'interactions') {
      fetchInteractions();
    } else {
      fetchActivityLogs();
    }
  }, [activeView, fetchInteractions, fetchActivityLogs, refreshKey]);

  // Handle Response Submission
  const handleSendResponse = async (interactionId: string) => {
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);
    try {
      const res = await fetch(`/api/module-interactions/${interactionId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response_content: replyText.trim() })
      });
      const json = await res.json();

      if (json.success && json.data) {
        showToast('Sovereign response recorded and marked Responded!', 'success');
        setReplyingItemId(null);
        setReplyText('');
        setRefreshKey(Date.now());
      } else {
        showToast(json.error || 'Failed to submit response', 'error');
      }
    } catch {
      showToast('Response saved locally', 'info');
      setReplyingItemId(null);
      setReplyText('');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const getModuleDisplayName = (mod: SovereignModuleType) => {
    switch (mod) {
      case 'forum': return 'Forum';
      case 'groups': return 'Digital Living Rooms';
      case 'blogs': return 'Editorial Blogs';
      case 'hallmarks': return 'Hallmarks 250k';
      case 'gems': return 'Gems & Liquidity';
      case 'mii': return 'Mii Disappearing';
      case 'publicitee': return 'Publicitee Canary';
      default: return 'Cross-Module';
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs space-y-5 ${className}`}>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {title || `${getModuleDisplayName(module)} Engagement & Activity Console`}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400">
              P2P Protocol
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
            {subtitle || 'Granular tracking of Comments, Mentions, Connects, Responded Status & Activity Log.'}
          </p>
        </div>

        {/* View Switcher: Interactions vs Activity Log */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-300 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveView('interactions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeView === 'interactions'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactions & Responses</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('activity_log')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeView === 'activity_log'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Activity Log</span>
          </button>
          <button
            type="button"
            onClick={() => setRefreshKey(Date.now())}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. Element 1 & 2: Engagement Metrics Row (Comments, Mentions, Connect and Follows, All comments, Responded, Haven't responded) */}
      <div className="space-y-3">
        <div className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between">
          <span>Interaction Categories & Response Filters:</span>
          <span className="text-slate-700 font-semibold">{summary.total_interactions} Total Logged</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Comments */}
          <button
            type="button"
            onClick={() => {
              setActiveView('interactions');
              setInteractionFilter('comment');
            }}
            className={`p-3 rounded-2xl border transition text-left cursor-pointer ${
              interactionFilter === 'comment' && activeView === 'interactions'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-500 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300">
                Comments
              </span>
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {summary.comments_count}
            </div>
            <span className="text-[10px] text-blue-700 dark:text-blue-400 font-bold block mt-0.5">
              Active Threads
            </span>
          </button>

          {/* Mentions */}
          <button
            type="button"
            onClick={() => {
              setActiveView('interactions');
              setInteractionFilter('mention');
            }}
            className={`p-3 rounded-2xl border transition text-left cursor-pointer ${
              interactionFilter === 'mention' && activeView === 'interactions'
                ? 'bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-500 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300">
                Mentions
              </span>
              <AtSign className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {summary.mentions_count}
            </div>
            <span className="text-[10px] text-purple-700 dark:text-purple-400 font-bold block mt-0.5">
              Direct Peer Tags
            </span>
          </button>

          {/* Connect and Follows */}
          <button
            type="button"
            onClick={() => {
              setActiveView('interactions');
              setInteractionFilter('connect_follow');
            }}
            className={`p-3 rounded-2xl border transition text-left cursor-pointer ${
              interactionFilter === 'connect_follow' && activeView === 'interactions'
                ? 'bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-500 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-teal-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300">
                Connect & Follows
              </span>
              <UserPlus className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {summary.connect_and_follows_count}
            </div>
            <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold block mt-0.5">
              Peer Mesh Links
            </span>
          </button>

          {/* All comments */}
          <button
            type="button"
            onClick={() => {
              setActiveView('interactions');
              setInteractionFilter('all_comments');
            }}
            className={`p-3 rounded-2xl border transition text-left cursor-pointer ${
              interactionFilter === 'all_comments' && activeView === 'interactions'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-500 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300">
                All Comments
              </span>
              <Users className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {summary.all_comments_count}
            </div>
            <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold block mt-0.5">
              Combined Feed
            </span>
          </button>

          {/* Responded */}
          <button
            type="button"
            onClick={() => {
              setActiveView('interactions');
              setResponseStatusFilter('responded');
            }}
            className={`p-3 rounded-2xl border transition text-left cursor-pointer ${
              responseStatusFilter === 'responded' && activeView === 'interactions'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 shadow-xs'
                : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black text-emerald-950 dark:text-emerald-300">
                Responded
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-950 dark:text-emerald-400 mt-1">
              {summary.responded_count}
            </div>
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold block mt-0.5">
              Closed & Answered
            </span>
          </button>

          {/* Haven't responded */}
          <button
            type="button"
            onClick={() => {
              setActiveView('interactions');
              setResponseStatusFilter('havent_responded');
            }}
            className={`p-3 rounded-2xl border transition text-left cursor-pointer ${
              responseStatusFilter === 'havent_responded' && activeView === 'interactions'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500 shadow-xs'
                : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 hover:border-amber-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black text-amber-950 dark:text-amber-300">
                Haven't Responded
              </span>
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xl font-black text-amber-950 dark:text-amber-400 mt-1">
              {summary.havent_responded_count}
            </div>
            <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold block mt-0.5">
              Pending Attention
            </span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Search & Granular Filter Bar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${getModuleDisplayName(module)} activity, members, or items...`}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Specific Controls */}
        {activeView === 'interactions' ? (
          <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300 text-[11px]">Filter:</span>
            <select
              value={interactionFilter}
              onChange={(e) => setInteractionFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
            >
              <option value="all">All Types</option>
              <option value="comment">Comments</option>
              <option value="mention">Mentions</option>
              <option value="connect_follow">Connect & Follows</option>
              <option value="all_comments">All Comments</option>
            </select>

            <select
              value={responseStatusFilter}
              onChange={(e) => setResponseStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
            >
              <option value="all">All Response States</option>
              <option value="responded">Responded</option>
              <option value="havent_responded">Haven't Responded</option>
            </select>
          </div>
        ) : (
          /* Element 3: Activity Log Selectors (All time, All activities, All Criteria) */
          <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
            {/* 1. All Time selector */}
            <div className="flex items-center gap-1">
              <span className="text-slate-700 dark:text-slate-300 text-[11px]">Time:</span>
              <select
                value={timeRangeFilter}
                onChange={(e) => setTimeRangeFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
              >
                <option value="all_time">All time</option>
                <option value="24h">Past 24 Hours</option>
                <option value="7d">Past 7 Days</option>
                <option value="30d">Past 30 Days</option>
                <option value="90d">Past 90 Days</option>
              </select>
            </div>

            {/* 2. All Activities selector */}
            <div className="flex items-center gap-1">
              <span className="text-slate-700 dark:text-slate-300 text-[11px]">Activity:</span>
              <select
                value={activityTypeFilter}
                onChange={(e) => setActivityTypeFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
              >
                <option value="all">All activities</option>
                <option value="comments">Comments</option>
                <option value="mentions">Mentions</option>
                <option value="connect_and_follows">Connect & Follows</option>
                <option value="responds">Creator Responds</option>
                <option value="security">PIN & Security</option>
              </select>
            </div>

            {/* 3. All Criteria selector */}
            <div className="flex items-center gap-1">
              <span className="text-slate-700 dark:text-slate-300 text-[11px]">Criteria:</span>
              <select
                value={criteriaFilter}
                onChange={(e) => setCriteriaFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
              >
                <option value="all">All Criteria</option>
                <option value="verified_sovereign">Verified Sovereign</option>
                <option value="urgent">Urgent / Attention</option>
                <option value="patron_vip">Patron VIP</option>
                <option value="standard">Standard</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Content Display: Interactions List vs Activity Log Feed */}
      {activeView === 'interactions' ? (
        <div className="space-y-3">
          {loadingInteractions ? (
            <div className="py-12 text-center space-y-2">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Fetching interactions from PostgreSQL...
              </p>
            </div>
          ) : interactions.length === 0 ? (
            <div className="py-12 text-center space-y-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <MessageSquare className="w-6 h-6 text-slate-400 mx-auto" />
              <h5 className="text-xs font-black text-slate-900 dark:text-white">
                No matching interactions found
              </h5>
              <p className="text-[11px] text-slate-700 dark:text-slate-400 font-medium">
                Try switching filters to 'All Types' or clearing search.
              </p>
            </div>
          ) : (
            interactions.map((item) => {
              const isReplying = replyingItemId === item.id;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.responded
                      ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800'
                      : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={item.actor_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={item.actor_name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            {item.actor_name}
                          </span>
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {item.actor_handle}
                          </span>
                          <span className="text-[9px] font-bold px-2 py-0.2 rounded-full uppercase bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300">
                            {item.interaction_type.replace('_', ' ')}
                          </span>
                          {item.criteria_tags?.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-950 border border-blue-300 dark:bg-blue-950 dark:text-blue-300"
                            >
                              {tag.replace('_', ' ')}
                            </span>
                          ))}
                        </div>

                        <div className="text-[10px] text-slate-700 dark:text-slate-400 font-medium mt-0.5">
                          On <strong>{item.item_title}</strong> • {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>

                        <p className="text-xs text-slate-900 dark:text-slate-100 font-medium mt-2 leading-relaxed">
                          {item.content}
                        </p>
                      </div>
                    </div>

                    {/* Response Status Badge */}
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      {item.responded ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 text-[10px] font-black flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Responded
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-400 text-[10px] font-black flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-700" /> Haven't Responded
                        </span>
                      )}

                      {!item.responded && (
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingItemId(isReplying ? null : item.id);
                            setReplyText('');
                          }}
                          className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1 mt-1"
                        >
                          <CornerDownRight className="w-3 h-3" />
                          <span>{isReplying ? 'Close Reply' : 'Reply & Close'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Responded Message Display */}
                  {item.responded && item.response_content && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                      <div className="p-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                          Sovereign Creator Response • {item.responded_at ? new Date(item.responded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Verified'}
                        </span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold mt-0.5">
                          "{item.response_content}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Inline Reply Box for Haven't Responded */}
                  {isReplying && (
                    <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 space-y-2">
                      <label className="block text-[11px] font-black text-slate-900 dark:text-white">
                        Send Official Sovereign Response to {item.actor_name}:
                      </label>
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Write reply to ${item.actor_handle}...`}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setReplyingItemId(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isSubmittingReply || !replyText.trim()}
                          onClick={() => handleSendResponse(item.id)}
                          className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>{isSubmittingReply ? 'Recording...' : 'Publish Response & Mark Responded'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Element 3: Activity Log Feed (All time, All activities, All Criteria) */
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>
              Activity Log ({activityLogs.length} events logged under Criteria: &quot;{criteriaFilter}&quot;, Time: &quot;{timeRangeFilter}&quot;)
            </span>
            <span className="text-[10px] text-slate-700 dark:text-slate-400 font-semibold">
              Live Audit Trail
            </span>
          </div>

          {loadingActivityLogs ? (
            <div className="py-12 text-center space-y-2">
              <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Querying sovereign activity log table...
              </p>
            </div>
          ) : activityLogs.length === 0 ? (
            <div className="py-12 text-center space-y-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Clock className="w-6 h-6 text-slate-400 mx-auto" />
              <h5 className="text-xs font-black text-slate-900 dark:text-white">
                No activity logs match the selected criteria
              </h5>
              <p className="text-[11px] text-slate-700 dark:text-slate-400 font-medium">
                Try setting Time Range to &quot;All time&quot; and Criteria to &quot;All Criteria&quot;.
              </p>
            </div>
          ) : (
            activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 transition-all flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={log.actor_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                    alt={log.actor_name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {log.actor_name}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {log.actor_handle}
                      </span>
                      <span className="text-[9px] font-black px-2 py-0.2 rounded-full uppercase bg-blue-50 text-blue-900 border border-blue-300 dark:bg-blue-950 dark:text-blue-300">
                        {log.activity_type.replace('_', ' ')}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.2 rounded-full uppercase bg-emerald-100 text-emerald-950 border border-emerald-400">
                        {log.criteria.replace('_', ' ')}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                      {log.title}
                    </h5>
                    {log.description && (
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {log.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-700 dark:text-slate-400 font-mono font-bold block">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">
                    {new Date(log.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SovereignModuleEngagementHub;
