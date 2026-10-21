/**
 * Pages Permission Console
 * Route: /admin/pages-permissions
 * Master Screen & Directory Security Console for SuperAdmin & CFO
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Unlock,
  Shield,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Save,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Layers,
  Eye,
  EyeOff,
  Power,
  Users,
  Palette,
  Building2
} from 'lucide-react';
import sovereignRbacApi, { PageDirectoryEntry } from '../../services/sovereignRbacApi';
import { usePlatformPrivilege } from '../../components/common/ExecutiveOnlyContent';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

export const PagesPermissionConsolePage: React.FC = () => {
  const { isExecutive } = usePlatformPrivilege();
  const [pages, setPages] = useState<PageDirectoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [editingPage, setEditingPage] = useState<PageDirectoryEntry | null>(null);

  useEffect(() => {
    document.title = 'Pages Permission Console | FingerMobile Protocol';
    loadPages();
  }, [categoryFilter, tierFilter]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const data = await sovereignRbacApi.getPages(categoryFilter, tierFilter, search);
      setPages(data);
    } catch (err) {
      console.error('Failed to load pages directory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPages();
  };

  const handleToggleMaintenance = async (page: PageDirectoryEntry) => {
    try {
      const updatedLock = !page.is_maintenance_locked;
      await sovereignRbacApi.updatePage(page.id, {
        is_maintenance_locked: updatedLock
      });
      setPages(prev => prev.map(p => p.id === page.id ? { ...p, is_maintenance_locked: updatedLock } : p));
      alert(`Emergency Maintenance Mode ${updatedLock ? 'ENABLED' : 'DISABLED'} for "${page.title}".`);
    } catch (err: any) {
      alert(`Failed to update maintenance state: ${err.message}`);
    }
  };

  const handleSavePageEdit = async () => {
    if (!editingPage) return;
    try {
      await sovereignRbacApi.updatePage(editingPage.id, {
        min_role_tier: editingPage.min_role_tier,
        is_public_member_facing: editingPage.is_public_member_facing,
        is_backoffice_only: editingPage.is_backoffice_only,
        is_moderator_only: editingPage.is_moderator_only,
        is_distinguished_only: editingPage.is_distinguished_only,
        is_executive_only: editingPage.is_executive_only,
        has_confidential_telemetry: editingPage.has_confidential_telemetry,
        confidential_fields: editingPage.confidential_fields,
        description: editingPage.description
      });
      alert(`Permissions updated for "${editingPage.title}".`);
      setEditingPage(null);
      loadPages();
    } catch (err: any) {
      alert(`Failed to save page edit: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Link to="/forum" className="hover:text-orange-600 transition">Forum Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <Link to="/master-dashboard" className="hover:text-orange-600 transition">Executive Master Dashboard</Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <span className="text-slate-900 font-extrabold flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-orange-600" />
            Pages Permission Console
          </span>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-black">
            385 Screen Route Gatekeeper
          </span>
        </nav>

        {/* Ownership Banner */}
        <PlatformOwnershipCard />

        {/* Console Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-xl bg-slate-900 text-white shadow-sm">
              <Layers className="w-7 h-7 text-orange-400" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Pages & Screens Permission Console
              </h1>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">
                Audit and configure minimum role clearances, emergency maintenance lockdown, and confidential data shielding across all platform routes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/admin/creators-console"
              className="px-3.5 py-2 text-xs font-black rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Palette className="w-3.5 h-3.5" />
              Creators Console
            </Link>
            <Link
              to="/admin/business-console"
              className="px-3.5 py-2 text-xs font-black rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Building2 className="w-3.5 h-3.5" />
              Business Console
            </Link>
            <Link
              to="/admin/users-permissions"
              className="px-3.5 py-2 text-xs font-black rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Users className="w-3.5 h-3.5" />
              Users Permissions
            </Link>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search route by path or title (e.g. /forum, Storefront)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </form>

          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-bold"
              >
                <option value="ALL">All Categories</option>
                <option value="COMMUNITY">Community</option>
                <option value="COMMERCE">Commerce</option>
                <option value="CREATOR_STUDIO">Creator Studio</option>
                <option value="ADMIN_HIVE">Admin Hive</option>
                <option value="FINANCE">Finance</option>
                <option value="OPERATIONS">Operations</option>
                <option value="GOVERNANCE">Governance</option>
                <option value="MODERATION">Moderation</option>
                <option value="EXECUTIVE">Executive</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700">Min Tier:</span>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="p-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-bold"
              >
                <option value="ALL">All Tiers</option>
                <option value="PUBLIC">Public</option>
                <option value="MEMBER">Member</option>
                <option value="CREATOR">Creator</option>
                <option value="BUSINESS">Business</option>
                <option value="BADGE_TIER">Badge Tier</option>
                <option value="MODERATOR">Moderator</option>
                <option value="BACKOFFICE">Back Office</option>
                <option value="STAFF">Staff Clearance</option>
                <option value="CFO">CFO</option>
                <option value="SUPERADMIN">SuperAdmin</option>
              </select>
            </div>

            <button
              onClick={loadPages}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload
            </button>
          </div>
        </div>

        {/* Canonical Pages Table */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300 text-[11px] font-black uppercase text-slate-700 tracking-wider">
                  <th className="py-3 px-4">Screen Title & Route Path</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Access Clearance</th>
                  <th className="py-3 px-4">Confidential Shielding</th>
                  <th className="py-3 px-4">Maintenance Lockdown</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {pages.map((p) => {
                  const isMaintenance = p.is_maintenance_locked;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          {p.title}
                          <a href={p.path} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="text-[11px] font-mono text-slate-700 font-bold">{p.path}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300 font-extrabold text-[10px]">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] border ${
                          p.min_role_tier === 'SUPERADMIN'
                            ? 'bg-rose-100 text-rose-950 border-rose-300'
                            : p.min_role_tier === 'CFO'
                              ? 'bg-purple-100 text-purple-950 border-purple-300'
                              : p.min_role_tier === 'BACKOFFICE'
                                ? 'bg-blue-100 text-blue-950 border-blue-300'
                                : p.min_role_tier === 'MODERATOR'
                                  ? 'bg-amber-100 text-amber-950 border-amber-300'
                                  : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                        }`}>
                          {p.min_role_tier}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {p.has_confidential_telemetry ? (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-900">
                            <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                            <span>Shield Active ({Array.isArray(p.confidential_fields) ? p.confidential_fields.length : 0} fields)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>Public Payload</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleMaintenance(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black border transition flex items-center gap-1 ${
                            isMaintenance
                              ? 'bg-rose-100 text-rose-950 border-rose-400 hover:bg-rose-200'
                              : 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          {isMaintenance ? 'LOCKED (Emergency)' : 'LIVE & OPERATIONAL'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setEditingPage(p)}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition inline-flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3 text-slate-700" />
                          Edit Rules
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Edit Page Security Rules */}
        {editingPage && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-300 max-w-lg w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-600" />
                  Edit Security Rules: {editingPage.title}
                </h3>
                <button onClick={() => setEditingPage(null)} className="text-slate-500 hover:text-slate-900 font-bold">✕</button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Route Path</label>
                  <input
                    type="text"
                    disabled
                    value={editingPage.path}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-slate-100 text-slate-700 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Minimum Clearance Tier Required</label>
                  <select
                    value={editingPage.min_role_tier}
                    onChange={(e: any) => setEditingPage({ ...editingPage, min_role_tier: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="PUBLIC">PUBLIC (All visitors & guests)</option>
                    <option value="MEMBER">MEMBER (Logged-in platform user)</option>
                    <option value="BADGE_TIER">BADGE_TIER (Bronze, Silver, Gold, Platinum, VIP)</option>
                    <option value="MODERATOR">MODERATOR (Forum & community sentinel)</option>
                    <option value="BACKOFFICE">BACKOFFICE (Staff department clearances 1-5)</option>
                    <option value="CFO">CFO (Secondary Admin - Eunice Mbah & Philip Atiks)</option>
                    <option value="SUPERADMIN">SUPERADMIN (Primary Admin - Obinna Mbah & Protocol)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPage.is_backoffice_only}
                      onChange={(e) => setEditingPage({ ...editingPage, is_backoffice_only: e.target.checked })}
                      className="rounded text-orange-600"
                    />
                    Back Office Only
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPage.is_moderator_only}
                      onChange={(e) => setEditingPage({ ...editingPage, is_moderator_only: e.target.checked })}
                      className="rounded text-orange-600"
                    />
                    Moderators Only
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPage.is_distinguished_only}
                      onChange={(e) => setEditingPage({ ...editingPage, is_distinguished_only: e.target.checked })}
                      className="rounded text-orange-600"
                    />
                    Distinguished Only
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPage.has_confidential_telemetry}
                      onChange={(e) => setEditingPage({ ...editingPage, has_confidential_telemetry: e.target.checked })}
                      className="rounded text-orange-600"
                    />
                    Mask Confidential Fields
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  onClick={() => setEditingPage(null)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePageEdit}
                  className="px-4 py-2 text-xs font-black rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Permission Rules
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagesPermissionConsolePage;
