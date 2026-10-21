/**
 * Users Permission Console
 * Route: /admin/users-permissions
 * Sovereign Console for Primary Admins (SuperAdmin) and CFO/Co-Founders to manage user RBAC,
 * Back Office Staff roles, Badge tiers, Distinguished Member ranks, and Moderator scopes.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Crown,
  Award,
  Briefcase,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  UserCheck,
  Lock,
  ChevronRight,
  RefreshCw,
  Plus,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Palette,
  Building2,
  Sliders
} from 'lucide-react';
import sovereignRbacApi, {
  UserPermissionSummary,
  StaffRole,
  DistinguishedRank
} from '../../services/sovereignRbacApi';
import { usePlatformPrivilege } from '../../components/common/ExecutiveOnlyContent';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

export const UsersPermissionConsolePage: React.FC = () => {
  const { isPrimaryAdmin, isCfo, isExecutive, roleTier } = usePlatformPrivilege();
  const [users, setUsers] = useState<UserPermissionSummary[]>([]);
  const [staffRoles, setStaffRoles] = useState<StaffRole[]>([]);
  const [distRanks, setDistRanks] = useState<DistinguishedRank[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserPermissionSummary | null>(null);
  const [activeModal, setActiveModal] = useState<'staff' | 'distinguished' | 'moderator' | 'role' | null>(null);

  // Filter state for member groups
  const [accountFilter, setAccountFilter] = useState<'ALL' | 'CREATORS' | 'BUSINESS' | 'STAFF'>('ALL');

  // Form states for assignments
  const [selectedStaffRole, setSelectedStaffRole] = useState('');
  const [staffNotes, setStaffNotes] = useState('');
  const [selectedDistRank, setSelectedDistRank] = useState('');
  const [distCitation, setDistCitation] = useState('');
  const [modTier, setModTier] = useState('COMMUNITY_MOD');
  const [modCategory, setModCategory] = useState('ALL');
  const [newRole, setNewRole] = useState('Member');

  useEffect(() => {
    document.title = 'Users Permission Console | FingerMobile Protocol';
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, staffData, distData] = await Promise.all([
        sovereignRbacApi.getUsersMatrix(search),
        sovereignRbacApi.getStaffDirectory(),
        sovereignRbacApi.getDistinguished()
      ]);
      setUsers(usersData);
      setStaffRoles(staffData.roles);
      setDistRanks(distData.ranks);
      if (staffData.roles.length > 0) setSelectedStaffRole(staffData.roles[0].id);
      if (distData.ranks.length > 0) setSelectedDistRank(distData.ranks[0].id);
    } catch (err) {
      console.error('Failed to load users permission matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleAssignStaff = async () => {
    if (!selectedUser || !selectedStaffRole) return;
    try {
      await sovereignRbacApi.assignStaff(selectedUser.id, selectedStaffRole, staffNotes);
      alert(`Staff role assigned to ${selectedUser.username || selectedUser.email}`);
      setActiveModal(null);
      loadData();
    } catch (err: any) {
      alert(`Error assigning staff role: ${err.message}`);
    }
  };

  const handleBestowHonor = async () => {
    if (!selectedUser || !selectedDistRank) return;
    try {
      await sovereignRbacApi.appointDistinguished(selectedUser.id, selectedDistRank, distCitation);
      alert(`Distinguished honor bestowed upon ${selectedUser.username || selectedUser.email}`);
      setActiveModal(null);
      loadData();
    } catch (err: any) {
      alert(`Error bestowing honor: ${err.message}`);
    }
  };

  const handleAssignModerator = async () => {
    if (!selectedUser) return;
    try {
      await sovereignRbacApi.assignModerator({
        userId: selectedUser.id,
        modTier,
        assignedCategory: modCategory
      });
      alert(`Moderator scope granted to ${selectedUser.username || selectedUser.email}`);
      setActiveModal(null);
      loadData();
    } catch (err: any) {
      alert(`Error assigning moderator scope: ${err.message}`);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;
    try {
      await sovereignRbacApi.updateUserRole(selectedUser.id, newRole);
      alert(`Account role updated to "${newRole}" for ${selectedUser.username || selectedUser.email}`);
      setActiveModal(null);
      loadData();
    } catch (err: any) {
      alert(`Error updating role: ${err.message}`);
    }
  };

  const filteredUsers = users.filter((u) => {
    const r = (u.role || '').toLowerCase();
    if (accountFilter === 'CREATORS') {
      return r === 'creator';
    }
    if (accountFilter === 'BUSINESS') {
      return r === 'business' || r === 'organization';
    }
    if (accountFilter === 'STAFF') {
      return (u.staff_roles && u.staff_roles.length > 0) || u.isExecutive || r === 'admin' || r === 'superadmin' || r === 'staff';
    }
    return true;
  });

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
            <Users className="w-3.5 h-3.5 text-orange-600" />
            Users Permission Console
          </span>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-orange-100 text-orange-950 border border-orange-400 text-[11px] font-black">
            Executive RBAC Authority
          </span>
        </nav>

        {/* Ownership Banner */}
        <PlatformOwnershipCard />

        {/* Console Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-xl bg-orange-100 text-orange-900 border border-orange-300">
              <Users className="w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Users Permission Console
              </h1>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">
                Grant or revoke Back Office Staff clearance, Distinguished Member ranks, Forum Moderator scopes, and Account Types.
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
              to="/admin/pages-permissions"
              className="px-3.5 py-2 text-xs font-black rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-orange-400" />
              Pages Permissions
            </Link>
          </div>
        </div>

        {/* Filter Toolbar & Category Tabs */}
        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setAccountFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer shrink-0 ${
                accountFilter === 'ALL'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Members ({users.length})
            </button>
            <button
              onClick={() => setAccountFilter('CREATORS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer shrink-0 ${
                accountFilter === 'CREATORS'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Content Creators
            </button>
            <button
              onClick={() => setAccountFilter('BUSINESS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer shrink-0 ${
                accountFilter === 'BUSINESS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Business & Orgs
            </button>
            <button
              onClick={() => setAccountFilter('STAFF')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer shrink-0 ${
                accountFilter === 'STAFF'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Staff & Admins
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email, name or handle..."
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-300 text-slate-900 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </form>

            <button
              onClick={loadData}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload
            </button>
          </div>
        </div>

        {/* Users Matrix Table */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300 text-[11px] font-black uppercase text-slate-700 tracking-wider">
                  <th className="py-3 px-4">Member Identity</th>
                  <th className="py-3 px-4">Platform Tier</th>
                  <th className="py-3 px-4">Back Office Staff Roles</th>
                  <th className="py-3 px-4">Distinguished Honors</th>
                  <th className="py-3 px-4">Moderation Scope</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-700 font-semibold">
                      No members found matching the selected group filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isPrimary = u.executiveTier === 'PRIMARY_SUPER_ADMIN';
                    const isSecCfo = u.executiveTier === 'SECONDARY_ADMIN_CFO';
                    const userRole = (u.role || '').toLowerCase();
                    const isCreator = userRole === 'creator';
                    const isBusiness = userRole === 'business' || userRole === 'organization';

                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900">{u.display_name || u.username || 'Member'}</div>
                          <div className="text-[11px] font-mono text-slate-700 font-bold">{u.email}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          {isPrimary ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-950 border border-orange-400 font-black text-[10px]">
                              <Crown className="w-3 h-3 text-orange-600" /> Primary Admin / Owner
                            </span>
                          ) : isSecCfo ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-400 font-black text-[10px]">
                              <Sparkles className="w-3 h-3 text-purple-600" /> CFO & Co-Founder
                            </span>
                          ) : isCreator ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-400 font-black text-[10px]">
                              <Palette className="w-3 h-3 text-purple-600" /> Content Creator
                            </span>
                          ) : isBusiness ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400 font-black text-[10px]">
                              <Building2 className="w-3 h-3 text-blue-600" /> Business Organization
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300 font-bold text-[10px]">
                              Platform Member
                            </span>
                          )}
                        </td>

                      <td className="py-3.5 px-4">
                        {u.staff_roles && u.staff_roles.length > 0 ? (
                          <div className="space-y-1">
                            {u.staff_roles.map((sr, idx) => (
                              <span key={idx} className="inline-block px-2 py-0.5 rounded-md bg-blue-100 text-blue-950 border border-blue-400 text-[10px] font-extrabold mr-1">
                                {sr.roleName} (Lvl {sr.clearance})
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 font-medium text-[11px]">No staff role</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {u.distinguished_ranks && u.distinguished_ranks.length > 0 ? (
                          <div className="space-y-1">
                            {u.distinguished_ranks.map((dr, idx) => (
                              <span key={idx} className="inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 border border-amber-400 text-[10px] font-extrabold mr-1">
                                {dr.rankName} ({dr.votingWeight}x Vote)
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 font-medium text-[11px]">Standard Citizen</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {u.moderator_scopes && u.moderator_scopes.length > 0 ? (
                          <div className="space-y-1">
                            {u.moderator_scopes.map((ms, idx) => (
                              <span key={idx} className="inline-block px-2 py-0.5 rounded-md bg-rose-100 text-rose-950 border border-rose-400 text-[10px] font-extrabold mr-1">
                                {ms.modTier}: {ms.category}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 font-medium text-[11px]">No mod scope</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 flex-wrap justify-end">
                          <button
                            onClick={() => { setSelectedUser(u); setNewRole(u.role || 'Member'); setActiveModal('role'); }}
                            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-purple-50 text-purple-900 border border-purple-300 hover:bg-purple-100 transition"
                            title="Change Account Type / Role"
                          >
                            + Role
                          </button>
                          <button
                            onClick={() => { setSelectedUser(u); setActiveModal('staff'); }}
                            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-900 border border-blue-300 hover:bg-blue-100 transition"
                            title="Assign Back Office Role"
                          >
                            + Staff
                          </button>
                          <button
                            onClick={() => { setSelectedUser(u); setActiveModal('distinguished'); }}
                            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition"
                            title="Bestow Council Honor"
                          >
                            + Honor
                          </button>
                          <button
                            onClick={() => { setSelectedUser(u); setActiveModal('moderator'); }}
                            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-rose-50 text-rose-900 border border-rose-300 hover:bg-rose-100 transition"
                            title="Grant Moderator Scope"
                          >
                            + Mod
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Assign Staff Role */}
        {activeModal === 'staff' && selectedUser && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Assign Back Office Role
                </h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-slate-900 font-bold">✕</button>
              </div>

              <div>
                <p className="text-xs text-slate-700 font-semibold mb-3">
                  Assigning operational role to <strong className="text-slate-900">{selectedUser.username || selectedUser.email}</strong>.
                </p>

                <label className="block text-xs font-bold text-slate-800 mb-1">Select Department Role</label>
                <select
                  value={selectedStaffRole}
                  onChange={(e) => setSelectedStaffRole(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 mb-3"
                >
                  {staffRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.department} - Clearance Level {r.clearance_level})
                    </option>
                  ))}
                </select>

                <label className="block text-xs font-bold text-slate-800 mb-1">Administrative Notes</label>
                <textarea
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  placeholder="Reason for role assignment..."
                  rows={3}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignStaff}
                  className="px-4 py-2 text-xs font-black rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Confirm Staff Assignment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Bestow Distinguished Honor */}
        {activeModal === 'distinguished' && selectedUser && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  Bestow Distinguished Council Rank
                </h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-slate-900 font-bold">✕</button>
              </div>

              <div>
                <p className="text-xs text-slate-700 font-semibold mb-3">
                  Appointing <strong className="text-slate-900">{selectedUser.username || selectedUser.email}</strong> to the Distinguished Registry.
                </p>

                <label className="block text-xs font-bold text-slate-800 mb-1">Select Council Rank</label>
                <select
                  value={selectedDistRank}
                  onChange={(e) => setSelectedDistRank(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-amber-500 mb-3"
                >
                  {distRanks.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.rank_name} (Voting Weight: {r.voting_weight}x)
                    </option>
                  ))}
                </select>

                <label className="block text-xs font-bold text-slate-800 mb-1">Honor Citation</label>
                <textarea
                  value={distCitation}
                  onChange={(e) => setDistCitation(e.target.value)}
                  placeholder="Official citation honoring contributions..."
                  rows={3}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBestowHonor}
                  className="px-4 py-2 text-xs font-black rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                >
                  Bestow Council Seat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Grant Moderator Scope */}
        {activeModal === 'moderator' && selectedUser && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  Grant Moderator Scope
                </h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-slate-900 font-bold">✕</button>
              </div>

              <div>
                <p className="text-xs text-slate-700 font-semibold mb-3">
                  Assigning forum moderation scope to <strong className="text-slate-900">{selectedUser.username || selectedUser.email}</strong>.
                </p>

                <label className="block text-xs font-bold text-slate-800 mb-1">Moderator Tier</label>
                <select
                  value={modTier}
                  onChange={(e) => setModTier(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-rose-500 mb-3"
                >
                  <option value="COMMUNITY_MOD">Community Moderator (Timeouts, Pin/Lock)</option>
                  <option value="CATEGORY_MOD">Category Moderator (Category Dispute Review)</option>
                  <option value="GLOBAL_MOD">Global Content Moderator (Platform-wide bans)</option>
                  <option value="SAFETY_COMPLIANCE">Safety & Compliance Officer (AML/Fraud)</option>
                </select>

                <label className="block text-xs font-bold text-slate-800 mb-1">Assigned Category / Jurisdiction</label>
                <input
                  type="text"
                  value={modCategory}
                  onChange={(e) => setModCategory(e.target.value)}
                  placeholder="e.g. ALL or Crypto & Staking or Beatwave"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignModerator}
                  className="px-4 py-2 text-xs font-black rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                >
                  Grant Moderation Power
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Change Account Role / Account Type */}
        {activeModal === 'role' && selectedUser && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-600" />
                  Update Account Role & Tier
                </h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-slate-900 font-bold">✕</button>
              </div>

              <div>
                <p className="text-xs text-slate-700 font-semibold mb-3">
                  Modifying platform role for <strong className="text-slate-900">{selectedUser.username || selectedUser.email}</strong>.
                </p>

                <label className="block text-xs font-bold text-slate-800 mb-1">Select Platform Role / Account Type</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-purple-500 mb-3"
                >
                  <option value="Member">Platform Member (Standard Free Tier)</option>
                  <option value="Creator">Content Creator (Creator Studio & UGC Suite)</option>
                  <option value="Business">Business / Organization (Enterprise Merchant)</option>
                  <option value="Staff">Operations Staff (Back Office Clearance)</option>
                  <option value="Moderator">Community Moderator (Sentinels)</option>
                </select>
                <p className="text-[11px] text-slate-600 font-medium">
                  Selecting <strong>Content Creator</strong> immediately unlocks the member's front-facing Creator Dashboard (/creatordashboard) and Creator Studio tools.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateRole}
                  className="px-4 py-2 text-xs font-black rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                >
                  Apply Role Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPermissionConsolePage;
