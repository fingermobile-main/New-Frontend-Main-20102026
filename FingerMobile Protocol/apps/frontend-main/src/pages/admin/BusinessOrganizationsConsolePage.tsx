/**
 * Business & Organizations Console (Hive Operations)
 * Route: /admin/business-console & /business-console
 * Dedicated Sovereign Console for Staff & Executives to manage Business Accounts,
 * KYB Accreditation, Corporate Subscriptions, SLA Tiers, and Canary Ads Allocations.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Users,
  Coins,
  Palette,
  FileCheck2,
  Sliders
} from 'lucide-react';
import sovereignRbacApi, { OrganizationProfile } from '../../services/sovereignRbacApi';
import { usePlatformPrivilege } from '../../components/common/ExecutiveOnlyContent';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

export const BusinessOrganizationsConsolePage: React.FC = () => {
  usePlatformPrivilege();
  const [businesses, setBusinesses] = useState<OrganizationProfile[]>([]);
  const [stats, setStats] = useState<{ total: number; verified: number }>({
    total: 0,
    verified: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrg, setSelectedOrg] = useState<OrganizationProfile | null>(null);

  // Edit form states
  const [editStatus, setEditStatus] = useState('verified');
  const [editVerified, setEditVerified] = useState(true);
  const [editTier, setEditTier] = useState('ENTERPRISE');
  const [editAdsCredit, setEditAdsCredit] = useState(10000);
  const [editSla, setEditSla] = useState('GOLD');

  useEffect(() => {
    document.title = 'Business & Organizations Console | FingerMobile Protocol';
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await sovereignRbacApi.getBusinessDirectory();
      setBusinesses(data.businesses);
      setStats(data.stats);
    } catch (_err) {
      // API fallback
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (org: OrganizationProfile) => {
    setSelectedOrg(org);
    setEditStatus(org.accreditation_status || 'verified');
    setEditVerified(org.is_verified ?? true);
    setEditTier(org.metadata?.tier || 'ENTERPRISE');
    setEditAdsCredit(org.metadata?.ads_credit_allocated || 10000);
    setEditSla(org.metadata?.sla_tier || 'GOLD');
  };

  const handleSaveOrganization = async () => {
    if (!selectedOrg) return;
    try {
      const updatedMetadata = {
        ...(selectedOrg.metadata || {}),
        tier: editTier,
        ads_credit_allocated: editAdsCredit,
        sla_tier: editSla
      };

      await sovereignRbacApi.updateBusinessAccreditation(selectedOrg.id, {
        accreditation_status: editStatus,
        is_verified: editVerified,
        metadata: updatedMetadata
      });

      alert(`Organization credentials updated for ${selectedOrg.name}`);
      setSelectedOrg(null);
      loadData();
    } catch (err: any) {
      alert(`Error updating organization: ${err.message}`);
    }
  };

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      !search.trim() ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.country && b.country.toLowerCase().includes(search.toLowerCase())) ||
      (b.city && b.city.toLowerCase().includes(search.toLowerCase())) ||
      (b.metadata?.registration_no && b.metadata.registration_no.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      b.accreditation_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getAccreditationBadge = (status: string, isVerified: boolean) => {
    if (isVerified || status === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-100 text-emerald-950 border border-emerald-400">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          KYB Verified
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-rose-100 text-rose-950 border border-rose-400">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Accreditation Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-amber-100 text-amber-950 border border-amber-400">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        Vetting in Progress
      </span>
    );
  };

  const getTierBadge = (tier?: string) => {
    switch (tier) {
      case 'SOVEREIGN_PARTNER':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-orange-100 text-orange-950 border border-orange-400">
            Sovereign Partner
          </span>
        );
      case 'ENTERPRISE':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-blue-100 text-blue-950 border border-blue-400">
            Enterprise Corp
          </span>
        );
      case 'GROWTH':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-purple-100 text-purple-950 border border-purple-400">
            Scaleup Merchant
          </span>
        );
      case 'STARTER_SME':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-slate-100 text-slate-900 border border-slate-300">
            Starter SME
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Link to="/forum" className="hover:text-blue-600 transition">Forum Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <Link to="/master-dashboard" className="hover:text-blue-600 transition">Executive Master Dashboard</Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <Link to="/admin/users-permissions" className="hover:text-blue-600 transition">Users Permission Console</Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <span className="text-slate-900 font-extrabold flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            Business & Organizations Console
          </span>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400 text-[11px] font-black">
            Enterprise Hive Operations
          </span>
        </nav>

        {/* Ownership Banner */}
        <PlatformOwnershipCard />

        {/* Console Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-xl bg-blue-100 text-blue-900 border border-blue-300">
              <Building2 className="w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Business & Organizations Console
              </h1>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">
                Micro-manage registered enterprises, KYB accreditation documents, corporate SLA tiers, and Canary Ads lines of credit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/businessoffices"
              className="px-4 py-2 text-xs font-black rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Business Hub
            </Link>
            <Link
              to="/admin/creators-console"
              className="px-4 py-2 text-xs font-black rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Palette className="w-3.5 h-3.5" />
              Creators Console
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
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Enterprises</span>
              <span className="p-2 rounded-xl bg-blue-100 text-blue-900 border border-blue-300">
                <Building2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.total || businesses.length}</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Incorporated Corporate Entities</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">KYB Accreditation Rate</span>
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300">
                <FileCheck2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-950">
              {stats.total > 0 ? `${Math.round((stats.verified / stats.total) * 100)}%` : '100%'}
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-1">{stats.verified || businesses.filter(b => b.is_verified).length} Verified Registrations</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Canary Ads Credit Reserve</span>
              <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
                <Coins className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">50,000 FIC</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Corporate Campaign Allocation</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Assigned Operations Staff</span>
              <span className="p-2 rounded-xl bg-purple-100 text-purple-900 border border-purple-300">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">Level 4 Clearance</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Enterprise Accounts Manager</div>
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
              placeholder="Search company, RC number, city..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-900 bg-white"
            >
              <option value="ALL">All Accreditation Statuses</option>
              <option value="verified">KYB Verified</option>
              <option value="pending">Pending Vetting</option>
              <option value="rejected">Rejected</option>
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

        {/* Organizations Table */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300 text-[11px] font-black uppercase text-slate-700 tracking-wider">
                  <th className="py-3 px-4">Enterprise Organization</th>
                  <th className="py-3 px-4">Corporate Tier & SLA</th>
                  <th className="py-3 px-4">Registration & Location</th>
                  <th className="py-3 px-4">Accreditation</th>
                  <th className="py-3 px-4">Canary Ads Line</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-700 font-semibold">
                      Loading business organizations directory...
                    </td>
                  </tr>
                ) : filteredBusinesses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-700 font-semibold">
                      No Business Organizations match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredBusinesses.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>{b.name}</span>
                          {b.is_verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          )}
                        </div>
                        {b.website && (
                          <a
                            href={b.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-blue-700 hover:underline font-bold flex items-center gap-1 mt-0.5"
                          >
                            <span>{b.website}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                      <td className="py-3.5 px-4 space-y-1">
                        <div>{getTierBadge(b.metadata?.tier)}</div>
                        <div className="text-[10px] font-bold text-slate-700 uppercase">
                          SLA: {b.metadata?.sla_tier || 'STANDARD'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900">
                          {b.metadata?.registration_no || 'RC-UNSPECIFIED'}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-700">
                          {b.city ? `${b.city}, ` : ''}{b.country || 'Global'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {getAccreditationBadge(b.accreditation_status, b.is_verified)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-amber-600" />
                          {(b.metadata?.ads_credit_allocated || 0).toLocaleString()} FIC
                        </div>
                        <div className="text-[10px] text-emerald-800 font-bold">Campaign Line Active</div>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-950 border border-blue-400 font-bold text-[11px] transition inline-flex items-center gap-1"
                        >
                          <Sliders className="w-3 h-3" />
                          Manage Vetting
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Organization Modal */}
        {selectedOrg && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full border border-slate-300 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Manage Enterprise Credentials & KYB
                </h3>
                <button
                  onClick={() => setSelectedOrg(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-700 font-black"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Company Legal Entity</label>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-extrabold text-slate-900">
                  {selectedOrg.name} ({selectedOrg.metadata?.registration_no || 'RC-UNSPECIFIED'})
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Corporate Tier</label>
                <select
                  value={editTier}
                  onChange={(e) => setEditTier(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                >
                  <option value="SOVEREIGN_PARTNER">Sovereign Partner (Unlimited SLA & Credit)</option>
                  <option value="ENTERPRISE">Enterprise Corp (Dedicated SLA & Ad Line)</option>
                  <option value="GROWTH">Scaleup Merchant (Priority Storefront)</option>
                  <option value="STARTER_SME">Starter SME (Standard Account)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Accreditation Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => {
                    setEditStatus(e.target.value);
                    setEditVerified(e.target.value === 'verified');
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                >
                  <option value="verified">Verified (KYB Passed & Certified)</option>
                  <option value="pending">Pending Review (Documents Under Verification)</option>
                  <option value="rejected">Rejected (Non-compliant documentation)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Canary Ads Credit Allocation (FIC)</label>
                <input
                  type="number"
                  value={editAdsCredit}
                  onChange={(e) => setEditAdsCredit(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedOrg(null)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 transition flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveOrganization}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition flex items-center justify-center"
                >
                  Save Corporate Configuration
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
          <button
            onClick={() => setStatusFilter('ALL')}
            aria-label="Filter All Organizations"
            className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
              statusFilter === 'ALL' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
            }`}
          >
            <span className="text-base">🏢</span>
            <span>All Orgs</span>
          </button>
          <button
            onClick={() => setStatusFilter('verified')}
            aria-label="Filter Verified"
            className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
              statusFilter === 'verified' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
            }`}
          >
            <span className="text-base">✅</span>
            <span>KYB</span>
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            aria-label="Filter Pending"
            className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
              statusFilter === 'pending' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
            }`}
          >
            <span className="text-base">⏳</span>
            <span>Pending</span>
          </button>
          <button
            onClick={loadData}
            aria-label="Reload Organizations"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
          >
            <span className="text-base">🔄</span>
            <span>Sync</span>
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to Top"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
          >
            <span className="text-base">⬆️</span>
            <span>Top</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessOrganizationsConsolePage;
