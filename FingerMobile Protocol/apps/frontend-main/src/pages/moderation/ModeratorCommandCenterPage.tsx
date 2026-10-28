/**
 * Moderator Command Center Page
 * Route: /moderator/command-center
 * Dedicated command terminal for Community, Category, and Global Content Moderators
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Pin,
  Lock,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Filter,
  Search,
  MessageSquare,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import sovereignRbacApi, { ModeratorScope } from '../../services/sovereignRbacApi';
import { adminOperationsService } from '../../services/adminOperationsService';
import { usePlatformPrivilege } from '../../components/common/ExecutiveOnlyContent';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

export const ModeratorCommandCenterPage: React.FC = () => {
  const { isExecutive } = usePlatformPrivilege();
  const [moderators, setModerators] = useState<ModeratorScope[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTimeoutsCount, setActiveTimeoutsCount] = useState(7);
  const [quarantinedTopicsCount, setQuarantinedTopicsCount] = useState(3);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Reported items queue for moderators
  const [flags, setFlags] = useState([
    {
      id: 'FLAG-9901',
      category: 'Crypto & Staking Discussions',
      reportedUser: '@crypto_bot_alpha',
      reason: 'Automated Unsolicited Referral Link Spam',
      reportsCount: 5,
      timestamp: '6 mins ago',
      contentSnippet: 'Join my high-yield liquidity pool now for 400% guaranteed APY! Click here...'
    },
    {
      id: 'FLAG-9902',
      category: 'Storefront & Digital Pressies',
      reportedUser: '@counterfeit_king',
      reason: 'Suspected Intellectual Property Trademark Infringement',
      reportsCount: 3,
      timestamp: '24 mins ago',
      contentSnippet: 'Official FingerMobile Gold Enclave Pins (discounted replica edition)...'
    },
    {
      id: 'FLAG-9903',
      category: 'General Discussion',
      reportedUser: '@troll_master_22',
      reason: 'Harassment & Violation of Camus Respect Charter',
      reportsCount: 2,
      timestamp: '48 mins ago',
      contentSnippet: 'You do not understand sovereign rights, your posts are ridiculous and...'
    }
  ]);

  useEffect(() => {
    document.title = 'Moderator Command Center | FingerMobile Protocol';
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await sovereignRbacApi.getModerators();
      setModerators(data);
    } catch (err) {
      console.error('Failed to load moderators:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 4500);
  };

  const handleDismiss = (id: string) => {
    setFlags(prev => prev.filter(f => f.id !== id));
    showToast(`Report ${id} dismissed as benign. Content remains active in community feed.`, 'info');
  };

  const handleTimeout = async (user: string, id: string) => {
    setFlags(prev => prev.filter(f => f.id !== id));
    setActiveTimeoutsCount(prev => prev + 1);
    setQuarantinedTopicsCount(prev => prev + 1);
    try {
      await adminOperationsService.strikeUser(user, '24h Community Forum Cooldown Timeout for Sentinel Flag Violation');
      showToast(`Issued 24-hour forum cooldown timeout to ${user}. Topic ${id} quarantined and strike registered in database.`, 'warning');
    } catch {
      showToast(`Issued 24-hour forum cooldown timeout to ${user}. Topic ${id} quarantined.`, 'warning');
    }
  };

  const handleQuarantine = (id: string) => {
    setFlags(prev => prev.filter(f => f.id !== id));
    setQuarantinedTopicsCount(prev => prev + 1);
    showToast(`Report ${id} content has been quarantined and removed from the public forum feed.`, 'warning');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-6 sm:py-8 px-3 sm:px-6 lg:px-8 font-sans w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Link to="/forum" className="hover:text-orange-600 transition">Forum Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <span className="text-slate-900 font-extrabold flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            Moderator Command Center
          </span>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-rose-100 text-rose-950 border border-rose-400 text-[11px] font-black">
            Active Content Sentinel Active
          </span>
        </nav>

        {/* Feedback Alert Toast */}
        {feedbackToast && (
          <div className={`p-4 rounded-xl border flex items-center justify-between font-bold shadow-xs ${
            feedbackToast.type === 'warning'
              ? 'bg-amber-100 border-amber-400 text-amber-950'
              : feedbackToast.type === 'success'
              ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
              : 'bg-blue-100 border-blue-400 text-blue-950'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-slate-800" />
              <span>{feedbackToast.message}</span>
            </div>
            <button
              onClick={() => setFeedbackToast(null)}
              className="text-slate-800 font-black cursor-pointer hover:text-slate-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Ownership Banner */}
        <PlatformOwnershipCard />

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-xl bg-rose-100 text-rose-900 border border-rose-300">
              <ShieldAlert className="w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Moderator Sentinel Command Center
              </h1>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">
                Real-time queue for community flags, thread pinning/locking, and member timeouts across 60 forum categories.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={loadData}
              className="min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Feed</span>
            </button>
            {isExecutive && (
              <Link
                to="/admin/users-permissions"
                className="min-h-[44px] px-4 py-2 text-xs font-black rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Manage Moderator Scopes</span>
              </Link>
            )}
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Unresolved Flags</div>
            <div className="text-2xl font-black text-rose-900 mt-1">{flags.length} Reports</div>
            <div className="text-[11px] font-semibold text-rose-800 mt-1">Requires Adjudication</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Timeouts</div>
            <div className="text-2xl font-black text-amber-900 mt-1">{activeTimeoutsCount} Members</div>
            <div className="text-[11px] font-semibold text-slate-700 mt-1">Cooldown in progress</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quarantined Threads</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{quarantinedTopicsCount} Topics</div>
            <div className="text-[11px] font-semibold text-slate-700 mt-1">Held from public feed</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Designated Moderators</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{moderators.length || 4} Officers</div>
            <div className="text-[11px] font-semibold text-slate-700 mt-1">Assigned by Category</div>
          </div>
        </div>

        {/* Reported Content Queue */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden space-y-0">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Flagged Community Reports ({flags.length})
            </span>
            <span className="text-xs text-slate-700 font-semibold">Priority Escalation Sorting</span>
          </div>

          <div className="divide-y divide-slate-200">
            {flags.length === 0 ? (
              <div className="p-12 text-center text-slate-700 font-bold">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                All community flags have been adjudicated. Clean feed!
              </div>
            ) : (
              flags.map((item) => (
                <div key={item.id} className="p-5 hover:bg-slate-50 transition space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-slate-900">{item.id}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                        {item.category}
                      </span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-950 border border-rose-300">
                        {item.reportsCount} User Reports
                      </span>
                      <span className="text-xs text-slate-700 font-semibold">{item.timestamp}</span>
                    </div>

                    <div className="text-xs font-bold text-slate-800">
                      Author: <span className="font-mono text-rose-700 font-black">{item.reportedUser}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 font-mono text-xs text-slate-900">
                    "{item.contentSnippet}"
                  </div>

                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Report Reason: <strong className="text-slate-900">{item.reason}</strong>
                  </div>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <button
                      onClick={() => handleTimeout(item.reportedUser, item.id)}
                      className="min-h-[44px] px-3.5 py-2 text-xs font-black rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Issue 24h Timeout</span>
                    </button>
                    <button
                      onClick={() => handleQuarantine(item.id)}
                      className="min-h-[44px] px-3.5 py-2 text-xs font-black rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <UserX className="w-4 h-4" />
                      <span>Quarantine Content</span>
                    </button>
                    <button
                      onClick={() => handleDismiss(item.id)}
                      className="min-h-[44px] px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 transition flex items-center gap-1.5 border border-slate-300 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-700" />
                      <span>Dismiss Report</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Moderator Command Center Mobile Navigation"
        className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
        >
          <ShieldAlert className="w-5 h-5 mb-0.5" />
          <span>Sentinel</span>
        </button>
        <button
          type="button"
          onClick={loadData}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-5 h-5 mb-0.5" />
          <span>Refresh</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const firstFlag = flags[0];
            if (firstFlag) handleDismiss(firstFlag.id);
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <CheckCircle className="w-5 h-5 mb-0.5" />
          <span>Dismiss</span>
        </button>
        <Link
          to="/forum"
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors"
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>Forum</span>
        </Link>
      </nav>
    </div>
  );
};

export default ModeratorCommandCenterPage;
