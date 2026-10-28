/**
 * Content Creators Console (Hive Operations)
 * Route: /admin/creators-console & /creators-console
 * Dedicated Sovereign Console for Staff & Executives to manage Content Creators,
 * Tiers, Subscriptions, Monetization Splits, and Verification Badges.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Palette,
  Users,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Coins,
  DollarSign,
  Sliders
} from 'lucide-react';
import sovereignRbacApi, { CreatorProfile } from '../../services/sovereignRbacApi';
import { usePlatformPrivilege } from '../../components/common/ExecutiveOnlyContent';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

export const ContentCreatorsConsolePage: React.FC = () => {
  usePlatformPrivilege();
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [stats, setStats] = useState<{ total: number; active: number; tiers: any[] }>({
    total: 0,
    active: 0,
    tiers: []
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile | null>(null);

  // Form edit states
  const [editTier, setEditTier] = useState('TIER_1');
  const [editStatus, setEditStatus] = useState('ACTIVE');

  useEffect(() => {
    document.title = 'Content Creators Console | FingerMobile Protocol';
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await sovereignRbacApi.getCreatorsDirectory();
      setCreators(data.creators);
      setStats(data.stats);
    } catch (_err) {
      // API fallback
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (creator: CreatorProfile) => {
    setSelectedCreator(creator);
    setEditTier(creator.tier || 'TIER_3');
    setEditStatus(creator.status || 'ACTIVE');
  };

  const handleSaveCreator = async () => {
    if (!selectedCreator) return;
    try {
      await sovereignRbacApi.updateCreatorProfile(selectedCreator.id, {
        tier: editTier,
        status: editStatus
      });
      alert(`Creator profile updated for ${selectedCreator.display_name || selectedCreator.username || 'Creator'}`);
      setSelectedCreator(null);
      loadData();
    } catch (err: any) {
      alert(`Error updating creator profile: ${err.message}`);
    }
  };

  const filteredCreators = creators.filter((c) => {
    const matchesSearch =
      !search.trim() ||
      (c.display_name && c.display_name.toLowerCase().includes(search.toLowerCase())) ||
      (c.username && c.username.toLowerCase().includes(search.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      (c.country_code && c.country_code.toLowerCase().includes(search.toLowerCase()));

    const matchesTier = tierFilter === 'ALL' || c.tier === tierFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'TIER_1':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-purple-100 text-purple-950 border border-purple-400">
            Tier 1: Pro Studio (90/10 Split)
          </span>
        );
      case 'TIER_2':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-blue-100 text-blue-950 border border-blue-400">
            Tier 2: Verified Partner (85/15 Split)
          </span>
        );
      case 'TIER_3':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-100 text-emerald-950 border border-emerald-400">
            Tier 3: Emerging Creator (80/20 Split)
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-950 border border-emerald-400">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Active
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-950 border border-rose-400">
            <XCircle className="w-3 h-3 text-rose-600" />
            Suspended
          </span>
        );
      case 'PENDING_APPROVAL':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-950 border border-amber-400">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Link to="/forum" className="hover:text-purple-600 transition">Forum Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <Link to="/master-dashboard" className="hover:text-purple-600 transition">Executive Master Dashboard</Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <Link to="/admin/users-permissions" className="hover:text-purple-600 transition">Users Permission Console</Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <span className="text-slate-900 font-extrabold flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-purple-600" />
            Content Creators Console
          </span>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-400 text-[11px] font-black">
            Creator Hive Operations
          </span>
        </nav>

        {/* Ownership Banner */}
        <PlatformOwnershipCard />

        {/* Console Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-xl bg-purple-100 text-purple-900 border border-purple-300">
              <Palette className="w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Content Creators Console
              </h1>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">
                Micro-manage registered Content Creators, subscription tiers, revenue share splits, and UGC broadcast rights.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/creatordashboard"
              className="px-4 py-2 text-xs font-black rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Creator Studio
            </Link>
            <Link
              to="/admin/business-console"
              className="px-4 py-2 text-xs font-black rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Building2 className="w-3.5 h-3.5" />
              Business Console
            </Link>
            <Link
              to="/admin/users-permissions"
              className="px-4 py-2 text-xs font-black rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Users className="w-3.5 h-3.5 text-orange-400" />
              Users Permissions
            </Link>
          </div>
        </div>

        {/* Top Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Creators</span>
              <span className="p-2 rounded-xl bg-purple-100 text-purple-900 border border-purple-300">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.total || creators.length}</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Registered Creator Profiles</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Broadcasters</span>
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300">
                <CheckCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-950">{stats.active || creators.filter(c => c.status === 'ACTIVE').length}</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Verified Active Studios</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Revenue Share Standard</span>
              <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">85% / 15%</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Creator Payout / Protocol Reserve</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Assigned Operations Staff</span>
              <span className="p-2 rounded-xl bg-blue-100 text-blue-900 border border-blue-300">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">Level 4 Clearance</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Creator Ops Director Authorized</div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search creator by name, handle, country..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-900 bg-white"
            >
              <option value="ALL">All Tiers</option>
              <option value="TIER_1">Tier 1: Pro Studio</option>
              <option value="TIER_2">Tier 2: Verified Partner</option>
              <option value="TIER_3">Tier 3: Emerging Creator</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-900 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_APPROVAL">Pending Review</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            <button
              onClick={loadData}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload
            </button>
          </div>
        </div>

        {/* Creators Table */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300 text-[11px] font-black uppercase text-slate-700 tracking-wider">
                  <th className="py-3 px-4">Creator Identity</th>
                  <th className="py-3 px-4">Tier & Revenue Split</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reputation & FIC</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-700 font-semibold">
                      Loading content creators directory...
                    </td>
                  </tr>
                ) : filteredCreators.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-700 font-semibold">
                      No Content Creators match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredCreators.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>{c.display_name || c.username || 'Creator'}</span>
                          {c.status === 'ACTIVE' && (
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-700 font-bold">
                          @{c.username || 'creator'} • {c.email || 'No email registered'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {getTierBadge(c.tier)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {c.country_code || 'NG'}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(c.status)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {c.reputation_score || 480} Rep
                        </div>
                        <div className="text-[11px] text-amber-700 font-black flex items-center gap-1">
                          <Coins className="w-3 h-3 text-amber-600" />
                          {c.gem_balance || 1500} FIC
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-400 font-bold text-[11px] transition inline-flex items-center gap-1"
                        >
                          <Sliders className="w-3 h-3" />
                          Manage Tier
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Creator Modal */}
        {selectedCreator && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full border border-slate-300 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-600" />
                  Manage Creator Tier & Clearance
                </h3>
                <button
                  onClick={() => setSelectedCreator(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-700 font-black"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Creator Member</label>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-extrabold text-slate-900">
                  {selectedCreator.display_name || selectedCreator.username} (@{selectedCreator.username})
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Creator Tier & Revenue Split</label>
                <select
                  value={editTier}
                  onChange={(e) => setEditTier(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                >
                  <option value="TIER_1">Tier 1: Pro Studio (90% Creator / 10% Reserve)</option>
                  <option value="TIER_2">Tier 2: Verified Partner (85% Creator / 15% Reserve)</option>
                  <option value="TIER_3">Tier 3: Emerging Creator (80% Creator / 20% Reserve)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Broadcast Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                >
                  <option value="ACTIVE">ACTIVE (Full Studio & Broadcast Access)</option>
                  <option value="PENDING_APPROVAL">PENDING_APPROVAL (Under Vetting)</option>
                  <option value="SUSPENDED">SUSPENDED (Broadcast Locked)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedCreator(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCreator}
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition"
                >
                  Save Creator Configuration
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
          <a
            href="/admin/creators-console"
            aria-label="Creators Console"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-purple-600"
          >
            <span className="text-base">🎨</span>
            <span>Creators</span>
          </a>
          <button
            onClick={() => { const el = document.querySelector('input[type="text"]') as HTMLInputElement; if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth' }); } }}
            aria-label="Search Creators"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-purple-600"
          >
            <span className="text-base">🔍</span>
            <span>Search</span>
          </button>
          <button
            onClick={loadData}
            aria-label="Refresh Creators"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-purple-600"
          >
            <span className="text-base">🔄</span>
            <span>Sync</span>
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to Top"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-purple-600"
          >
            <span className="text-base">⬆️</span>
            <span>Top</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCreatorsConsolePage;
