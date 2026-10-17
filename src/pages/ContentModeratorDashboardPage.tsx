import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Lock,
  UserX,
  Ban,
  ArrowUpRight,
  Sparkles,
  Cpu,
  History,
  CheckCircle2,
} from 'lucide-react';
import {
  ModeratorTierLevel,
  Permissions,
  ModeratorTierDefaults,
  hasPermission
} from '../types/roles-permissions';

interface QueueItem {
  id: string;
  type: 'Post' | 'Comment' | 'Profile' | 'Live Message';
  user: string;
  reason: string;
  time: string;
  priority: 'High' | 'Medium' | 'Low';
  color: 'rose' | 'amber' | 'slate';
  category: 'spam' | 'harassment' | 'impersonation' | 'inappropriate';
  snippet: string;
  status: 'pending' | 'approved' | 'removed' | 'escalated' | 'timed_out' | 'banned';
  sentinelScore: number; // 0-100% toxicity/threat
  aiAnalysis: string;
}

interface AuditLogEntry {
  id: string;
  actor: string;
  target: string;
  action: string;
  permissionUsed: string;
  timestamp: string;
  reason: string;
}

const INITIAL_QUEUE_ITEMS: QueueItem[] = [
  {
    id: 'flag-101',
    type: 'Post',
    user: '@crypto_king',
    reason: 'Potential Spam / Scam Link Injection',
    time: '10 mins ago',
    priority: 'High',
    color: 'rose',
    category: 'spam',
    snippet: '"Click this link to double your ETH instantly! Not a scam 100% legit air drop..."',
    status: 'pending',
    sentinelScore: 98,
    aiAnalysis: 'Sentinel AI flagged high-confidence crypto phishing pattern and unverified URL redirect.'
  },
  {
    id: 'flag-102',
    type: 'Comment',
    user: '@angry_user99',
    reason: 'Harassment & Targeted Insults',
    time: '45 mins ago',
    priority: 'Medium',
    color: 'amber',
    category: 'harassment',
    snippet: '"You have no idea what you are talking about, get off this platform immediately..."',
    status: 'pending',
    sentinelScore: 78,
    aiAnalysis: 'Hostile discourse detected with direct personal attack markers.'
  },
  {
    id: 'flag-103',
    type: 'Profile',
    user: '@fake_vitalik',
    reason: 'Executive & Protocol Impersonation',
    time: '2 hours ago',
    priority: 'High',
    color: 'rose',
    category: 'impersonation',
    snippet: '"Official Foundation Founder Profile - Direct message me for protocol whitelist keys..."',
    status: 'pending',
    sentinelScore: 94,
    aiAnalysis: 'Name similarity match exceeds 90% against protected platform leadership identity.'
  },
  {
    id: 'flag-104',
    type: 'Post',
    user: '@defi_degen',
    reason: 'Inappropriate Content / Unverified Shilling',
    time: '3 hours ago',
    priority: 'Low',
    color: 'slate',
    category: 'inappropriate',
    snippet: '"Check out this unverified token drop before midnight, 1000x guaranteed return..."',
    status: 'pending',
    sentinelScore: 65,
    aiAnalysis: 'Heuristic financial claim warning. Moderate risk score.'
  },
  {
    id: 'flag-105',
    type: 'Live Message',
    user: '@spam_bot_009',
    reason: 'Rapid Spamburst in Live Room Chat',
    time: 'Just now',
    priority: 'High',
    color: 'rose',
    category: 'spam',
    snippet: '"JOIN TELEGRAM FAST! FREE COINS! FREE COINS! FREE COINS!"',
    status: 'pending',
    sentinelScore: 99,
    aiAnalysis: 'Live Sentinel detected 12 repeated messages within 3 seconds. Auto-muted for 30s.'
  }
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-01',
    actor: 'Mrs. Mbah Eunice Emonena (Staff Marshall)',
    target: '@scam_trader_44',
    action: 'Platform Shadowban',
    permissionUsed: 'SHADOWBAN_USER (0x400000)',
    timestamp: 'Today at 16:42:10 UTC',
    reason: 'Coordinated bot farm activity across marketplace channels.'
  },
  {
    id: 'log-02',
    actor: 'Mercy Kulem (Lead Mod)',
    target: '@toxic_troll',
    action: 'Lock Comments & Freeze Thread',
    permissionUsed: 'LOCK_COMMENTS (0x0200)',
    timestamp: 'Today at 15:18:22 UTC',
    reason: 'Flamewar breakout exceeding community guidelines.'
  },
  {
    id: 'log-03',
    actor: 'Chidi Okonkwo (Room Sentinel)',
    target: '@chatter_disrupt',
    action: 'Live Room Timeout (15m)',
    permissionUsed: 'TIMEOUT_ROOM_USER (0x02)',
    timestamp: 'Today at 14:05:01 UTC',
    reason: 'Excessive caps spam in Dancia-4Tv Sound Clash broadcast.'
  }
];

export const ContentModeratorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE_ITEMS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'spam' | 'harassment' | 'impersonation'>('all');
  const [activeTab, setActiveTab] = useState<'queue' | 'audit_log'>('queue');
  const [resolvedToday, setResolvedToday] = useState<number>(142);
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Moderator Tier state (Tier 1 through Tier 5)
  const [activeModTier, setActiveModTier] = useState<ModeratorTierLevel>('TIER_4_GLOBAL_STAFF');

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Active bitmask derived from selected tier
  const activeBitmask = ModeratorTierDefaults[activeModTier];

  // Bitmask permission checks
  const canTimeout = hasPermission(activeBitmask, Permissions.TIMEOUT_ROOM_USER);
  const canLockComments = hasPermission(activeBitmask, Permissions.LOCK_COMMENTS);
  const canDeletePost = hasPermission(activeBitmask, Permissions.DELETE_COMMUNITY_POST);
  const canTriage = hasPermission(activeBitmask, Permissions.TRIAGE_LOCAL_REPORTS);
  const canPermBanCommunity = hasPermission(activeBitmask, Permissions.PERM_BAN_COMMUNITY);
  const canShadowban = hasPermission(activeBitmask, Permissions.SHADOWBAN_USER);
  const canPermBanPlatform = hasPermission(activeBitmask, Permissions.PERM_BAN_PLATFORM);

  const logAction = (actionName: string, permUsed: string, target: string, reason: string) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      actor: `Active Mod (${activeModTier})`,
      target,
      action: actionName,
      permissionUsed: permUsed,
      timestamp: new Date().toUTCString(),
      reason
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleApprove = (id: string) => {
    if (!canTriage) {
      showNotification('Permission Denied: Requires Tier 2 (Community Warden) or higher.');
      return;
    }
    const item = queue.find((q) => q.id === id);
    setQueue((prev) => prev.filter((q) => q.id !== id));
    setResolvedToday((c) => c + 1);
    logAction('Approve Content', 'TRIAGE_LOCAL_REPORTS (0x1000)', item?.user || 'user', 'Flag dismissed as compliant');
    showNotification(`Approved ${item?.type || 'item'} by ${item?.user || 'user'}. Flag cleared.`);
  };

  const handleRemove = (id: string) => {
    if (!canDeletePost) {
      showNotification('Permission Denied: Requires Tier 2 (Community Warden) or higher.');
      return;
    }
    const item = queue.find((q) => q.id === id);
    setQueue((prev) => prev.filter((q) => q.id !== id));
    setResolvedToday((c) => c + 1);
    logAction('Delete / Remove Content', 'DELETE_COMMUNITY_POST (0x0100)', item?.user || 'user', `Infraction: ${item?.reason}`);
    showNotification(`Removed offending ${item?.type || 'item'} by ${item?.user || 'user'}. Infraction recorded.`);
  };

  const handleTimeout = (id: string, minutes: number) => {
    if (!canTimeout) {
      showNotification('Permission Denied: Requires Tier 1 (Room Sentinel) or higher.');
      return;
    }
    const item = queue.find((q) => q.id === id);
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'timed_out' } : q))
    );
    logAction(`Timeout User (${minutes}m)`, 'TIMEOUT_ROOM_USER (0x02)', item?.user || 'user', `Timed out for ${minutes} minutes.`);
    showNotification(`Issued ${minutes}-minute timeout to ${item?.user}.`);
  };

  const handleLockComments = (id: string) => {
    if (!canLockComments) {
      showNotification('Permission Denied: Requires Tier 2 (Community Warden) or higher.');
      return;
    }
    const item = queue.find((q) => q.id === id);
    logAction('Lock Comments & Freeze Discussion', 'LOCK_COMMENTS (0x0200)', item?.user || 'user', 'Thread locked due to moderation review.');
    showNotification(`Locked comments and froze discussion for item by ${item?.user}.`);
  };

  const handleCommunityBan = (id: string) => {
    if (!canPermBanCommunity) {
      showNotification('Permission Denied: Requires Tier 3 (Lead Community Mod) or higher.');
      return;
    }
    const item = queue.find((q) => q.id === id);
    setQueue((prev) => prev.filter((q) => q.id !== id));
    logAction('Permanent Community Ban', 'PERM_BAN_COMMUNITY (0x8000)', item?.user || 'user', 'Banned from community hub.');
    showNotification(`Permanently banned ${item?.user} from this community hub.`);
  };

  const handleShadowban = (id: string) => {
    if (!canShadowban) {
      showNotification('Permission Denied: Requires Tier 4 (Global Staff) or higher.');
      return;
    }
    const item = queue.find((q) => q.id === id);
    setQueue((prev) => prev.filter((q) => q.id !== id));
    logAction('Network Shadowban', 'SHADOWBAN_USER (0x400000)', item?.user || 'user', 'Global shadowban applied across network.');
    showNotification(`Applied platform-wide shadowban to ${item?.user}.`);
  };

  const handlePlatformBan = (id: string) => {
    if (!canPermBanPlatform) {
      showNotification('Permission Denied: Requires Tier 5 (SuperAdmin - Founder Authority).');
      return;
    }
    const item = queue.find((q) => q.id === id);
    setQueue((prev) => prev.filter((q) => q.id !== id));
    logAction('Permanent Platform Termination', 'PERM_BAN_PLATFORM (0x100000000)', item?.user || 'user', 'Hardware and biometric blacklist applied.');
    showNotification(`Permanent platform termination executed for ${item?.user}.`);
  };

  const handleEscalate = (id: string) => {
    const item = queue.find((q) => q.id === id);
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'escalated', priority: 'High', color: 'rose' } : q))
    );
    logAction('Escalate Item', 'TRIAGE_LOCAL_REPORTS (0x1000)', item?.user || 'user', 'Escalated to Senior Staff Inspectorate.');
    showNotification(`Escalated ${item?.type || 'item'} to Senior Staff Inspectorate.`);
  };

  const filteredQueue = queue.filter((item) => {
    if (activeFilter === 'spam') return item.category === 'spam';
    if (activeFilter === 'harassment') return item.category === 'harassment';
    if (activeFilter === 'impersonation') return item.category === 'impersonation';
    return true;
  });

  const pendingCount = queue.filter((q) => q.status === 'pending').length;
  const highPriorityCount = queue.filter((q) => q.priority === 'High').length;

  return (
    <MainLayout pageTitle="Moderation Queue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Header & RBAC Tier Authority Banner */}
        <div className="mb-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Platform Governance & Moderation Console
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-950 border border-amber-400 font-bold dark:bg-amber-950 dark:text-amber-300 border border-amber-400 dark:border-amber-800 font-black">
                    64-Bit Bitmask RBAC
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  Unified operational console bridging Sentinel AI autonomous chat hygiene with 5 human moderation tiers and immutable audit logging.
                </p>
              </div>
            </div>

            {/* Active Moderator Tier Selector */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shrink-0 space-y-2">
              <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-500" />
                  Active Moderator Tier:
                </span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  Mask: 0x{activeBitmask.toString(16).toUpperCase()}
                </span>
              </div>
              <select
                value={activeModTier}
                onChange={(e) => {
                  setActiveModTier(e.target.value as ModeratorTierLevel);
                  showNotification(`Switched operator scope to ${e.target.value}`);
                }}
                className="w-full text-xs font-bold p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="TIER_1_ROOM_SENTINEL">Tier 1: Room Sentinel (Live Chat Ephemeral)</option>
                <option value="TIER_2_COMMUNITY_WARDEN">Tier 2: Community Warden (Hub / Forums)</option>
                <option value="TIER_3_LEAD_MOD">Tier 3: Lead Community Mod (Guild Master)</option>
                <option value="TIER_4_GLOBAL_STAFF">Tier 4: Global Staff (Platform Marshall)</option>
                <option value="TIER_5_SUPERADMIN">Tier 5: SuperAdmin (Root Operations)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pending Reviews', value: pendingCount.toString(), icon: <Clock className="w-5 h-5 text-amber-500" /> },
            { label: 'High Priority', value: highPriorityCount.toString(), icon: <AlertTriangle className="w-5 h-5 text-rose-500" /> },
            { label: 'Resolved Today', value: resolvedToday.toString(), icon: <CheckCircle className="w-5 h-5 text-emerald-500" /> },
            { label: 'Audit Log Records', value: auditLogs.length.toString(), icon: <History className="w-5 h-5 text-blue-500" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{stat.label}</span>
                {stat.icon}
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs (Queue vs Audit Ledger) */}
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'queue'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Active Triage Queue ({pendingCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('audit_log')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'audit_log'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Immutable Moderation Audit Ledger ({auditLogs.length})</span>
          </button>
        </div>

        {activeTab === 'queue' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Moderation Queue Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Pending Flagged Incidents</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {filteredQueue.length}
                    </span>
                  </h2>

                  {/* Category Filter */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {['all', 'spam', 'harassment', 'impersonation'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveFilter(cat as any)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition ${
                          activeFilter === cat
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredQueue.length === 0 ? (
                  <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <p className="text-slate-800 dark:text-white font-bold text-base">Queue Fully Cleared</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">No pending flagged items under this category filter.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredQueue.map((item) => (
                      <div
                        key={item.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          item.priority === 'High'
                            ? 'bg-rose-50/20 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                            : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {/* Top Meta */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-black uppercase rounded ${
                                item.priority === 'High'
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-amber-500 text-white'
                              }`}
                            >
                              {item.priority} Priority
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {item.type}
                            </span>
                            <span className="text-[11px] text-slate-700 font-mono">
                              {item.time}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Sentinel Score: {item.sentinelScore}%
                            </span>
                          </div>

                          <button
                            onClick={() => setSelectedItem(item)}
                            className="p-1.5 text-slate-700 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                            title="Inspect Item"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Reason & Content */}
                        <div className="mb-2.5">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Author: <span className="text-amber-600 dark:text-amber-400">{item.user}</span>
                          </p>
                          <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mt-0.5">
                            Reason: {item.reason}
                          </p>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 italic mb-3">
                          {item.snippet}
                        </div>

                        {/* Sentinel AI Analysis Note */}
                        <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 text-[11px] text-blue-700 dark:text-blue-300 mb-4 flex items-start gap-2">
                          <Cpu className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-500" />
                          <span>{item.aiAnalysis}</span>
                        </div>

                        {/* Dynamic Action Buttons based on 64-Bit Bitmask Permissions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {canTriage && (
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition flex items-center gap-1"
                              title="Dismiss flag and approve content"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}

                          {canDeletePost && (
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition flex items-center gap-1"
                              title="Delete offending post"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Remove
                            </button>
                          )}

                          {canTimeout && (
                            <button
                              onClick={() => handleTimeout(item.id, 15)}
                              className="px-3 py-1.5 text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl transition flex items-center gap-1"
                              title="Timeout user for 15 minutes"
                            >
                              <Clock className="w-3.5 h-3.5" /> Timeout 15m
                            </button>
                          )}

                          {canLockComments && (
                            <button
                              onClick={() => handleLockComments(item.id)}
                              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition flex items-center gap-1"
                              title="Lock comments and freeze thread"
                            >
                              <Lock className="w-3.5 h-3.5" /> Freeze
                            </button>
                          )}

                          {canPermBanCommunity && (
                            <button
                              onClick={() => handleCommunityBan(item.id)}
                              className="px-3 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition flex items-center gap-1"
                              title="Ban from this community hub"
                            >
                              <UserX className="w-3.5 h-3.5" /> Hub Ban
                            </button>
                          )}

                          {canShadowban && (
                            <button
                              onClick={() => handleShadowban(item.id)}
                              className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-black dark:bg-slate-800 text-white rounded-xl transition flex items-center gap-1"
                              title="Global network shadowban"
                            >
                              <Ban className="w-3.5 h-3.5" /> Shadowban
                            </button>
                          )}

                          {canPermBanPlatform && (
                            <button
                              onClick={() => handlePlatformBan(item.id)}
                              className="px-3 py-1.5 text-xs font-black bg-red-700 hover:bg-red-800 text-white rounded-xl shadow-md transition flex items-center gap-1"
                              title="Permanent platform termination"
                            >
                              <Ban className="w-3.5 h-3.5" /> Platform Ban
                            </button>
                          )}

                          <button
                            onClick={() => handleEscalate(item.id)}
                            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl transition ml-auto"
                          >
                            Escalate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Guidelines & Quick Mod Links */}
            <div className="space-y-6">
              {/* Active Tier Permissions Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span>Tier Capabilities Breakdown</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { label: 'Timeout Live User (1-60m)', allowed: canTimeout },
                    { label: 'Triage / Approve Reports', allowed: canTriage },
                    { label: 'Remove Community Posts', allowed: canDeletePost },
                    { label: 'Freeze Thread / Lock Comments', allowed: canLockComments },
                    { label: 'Issue Community Ban', allowed: canPermBanCommunity },
                    { label: 'Platform Shadowban', allowed: canShadowban },
                    { label: 'Permanent Platform Termination', allowed: canPermBanPlatform },
                  ].map((cap, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                      <span className="text-slate-600 dark:text-slate-400">{cap.label}</span>
                      {cap.allowed ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                        </span>
                      ) : (
                        <span className="text-slate-700 dark:text-slate-600 font-bold flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Gated
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Navigation Card */}
              <div className="bg-gradient-to-br from-amber-500 to-rose-600 rounded-3xl p-6 text-white shadow-lg space-y-4">
                <h3 className="text-base font-black">Governance Studios</h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Switch between community merit, staff collaborator seats, and root platform administration.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/dashboard/badges')}
                    className="w-full py-2.5 px-4 text-xs font-bold bg-white text-slate-900 hover:bg-slate-50 rounded-xl transition flex items-center justify-between"
                  >
                    <span>Member Badges Studio</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/members-console')}
                    className="w-full py-2.5 px-4 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition flex items-center justify-between"
                  >
                    <span>Members Sovereign RBAC Console</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/master-dashboard')}
                    className="w-full py-2.5 px-4 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition flex items-center justify-between"
                  >
                    <span>Master Dashboard</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Audit Ledger Tab */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-500" />
                  <span>Immutable Moderation Audit Ledger</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Cryptographic WORM records of all moderation interventions, bitmask authorizations, and actor timestamps.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                    <th className="pb-3 px-3">Timestamp</th>
                    <th className="pb-3 px-3">Actor / Authority</th>
                    <th className="pb-3 px-3">Target</th>
                    <th className="pb-3 px-3">Action Executed</th>
                    <th className="pb-3 px-3">Bitmask Used</th>
                    <th className="pb-3 px-3">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">{log.timestamp}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{log.actor}</td>
                      <td className="py-3 px-3 font-mono text-amber-600 dark:text-amber-400">{log.target}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">{log.action}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-blue-600 dark:text-blue-400">{log.permissionUsed}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{log.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Item Inspection Dialog */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-amber-500" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Flagged Incident Dossier</h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded-full text-slate-700 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 mb-6">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Reported User:</span> {selectedItem.user}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Content Type:</span> {selectedItem.type}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Infraction Reason:</span> {selectedItem.reason}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Sentinel Toxicity Score:</span> {selectedItem.sentinelScore}%
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                  {selectedItem.snippet}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleApprove(selectedItem.id);
                    setSelectedItem(null);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
                >
                  Approve Item
                </button>
                <button
                  onClick={() => {
                    handleRemove(selectedItem.id);
                    setSelectedItem(null);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition"
                >
                  Remove Item
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default ContentModeratorDashboardPage;
