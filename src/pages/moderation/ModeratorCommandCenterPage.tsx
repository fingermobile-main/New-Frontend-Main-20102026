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
import { usePlatformPrivilege } from '../../components/common/ExecutiveOnlyContent';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

export const ModeratorCommandCenterPage: React.FC = () => {
  const { isExecutive } = usePlatformPrivilege();
  const [moderators, setModerators] = useState<ModeratorScope[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock reported items queue for moderators
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

  const handleDismiss = (id: string) => {
    setFlags(prev => prev.filter(f => f.id !== id));
    alert(`Report ${id} dismissed as benign.`);
  };

  const handleTimeout = (user: string, id: string) => {
    setFlags(prev => prev.filter(f => f.id !== id));
    alert(`Issued 24-hour forum cooldown timeout to ${user}. Topic quarantined.`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
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

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Feed
            </button>
            {isExecutive && (
              <Link
                to="/admin/users-permissions"
                className="px-4 py-2 text-xs font-black rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Manage Moderator Scopes
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
            <div className="text-2xl font-black text-amber-900 mt-1">7 Members</div>
            <div className="text-[11px] font-semibold text-slate-700 mt-1">Cooldown in progress</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quarantined Threads</div>
            <div className="text-2xl font-black text-slate-900 mt-1">3 Topics</div>
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
                      className="px-3 py-1.5 text-xs font-black rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition flex items-center gap-1 shadow-2xs"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Issue 24h Timeout
                    </button>
                    <button
                      onClick={() => {
                        setFlags(prev => prev.filter(f => f.id !== item.id));
                        alert(`Thread deleted and quarantined.`);
                      }}
                      className="px-3 py-1.5 text-xs font-black rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1 shadow-2xs"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      Quarantine Content
                    </button>
                    <button
                      onClick={() => handleDismiss(item.id)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 transition flex items-center gap-1 border border-slate-300"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                      Dismiss Report
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorCommandCenterPage;
