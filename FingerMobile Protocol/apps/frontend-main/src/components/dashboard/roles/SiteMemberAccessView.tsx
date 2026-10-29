import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  Award,
  CreditCard,
  Settings,
  ArrowRight,
  Trash2,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { MemberRole, MemberPage } from '../../../types/roles-permissions';
import { MemberPageAccessModal } from './MemberPageAccessModal';

/* eslint-disable no-unused-vars */
interface SiteMemberAccessViewProps {
  memberRoles: MemberRole[];
  memberPages: MemberPage[];
  onCreateMemberRole(data: {
    name: string;
    description?: string;
    accessiblePageIds: string[];
  }): Promise<void>;
  onDeleteMemberRole(id: string): Promise<void>;
  onSavePageAccess(pageId: string, allowedRoleIds: string[]): Promise<void>;
  onNavigateToBadges(): void;
  onNavigateToPricingPlans?(): void;
}
/* eslint-enable no-unused-vars */

export const SiteMemberAccessView: React.FC<SiteMemberAccessViewProps> = ({
  memberRoles,
  memberPages,
  onCreateMemberRole,
  onDeleteMemberRole,
  onSavePageAccess,
  onNavigateToBadges,
  onNavigateToPricingPlans,
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'roles-table' | 'subscription-matrix'>('roles-table');
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [grantedPasses, setGrantedPasses] = useState<Record<string, boolean>>({});
  const selectedPagesForNewRole = ['page_01'];

  const filteredRoles = memberRoles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(search.toLowerCase())) ||
      (r.subscriptionPlanName && r.subscriptionPlanName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    await onCreateMemberRole({
      name: newRoleName.trim(),
      description: newRoleDesc.trim(),
      accessiblePageIds: selectedPagesForNewRole,
    });
    setNewRoleName('');
    setNewRoleDesc('');
    setIsCreateRoleModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Header */}
      <div>
        <nav className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-1 flex items-center gap-1.5">
          <span>Contacts</span>
          <span>&gt;</span>
          <span>Site Members</span>
          <span>&gt;</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Site Member Access</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>Site Member Access</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-800   font-black">
                Gatekeeper Active
              </span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-300 border border-amber-400 dark:border-amber-800   font-black">
                Subscription Synced
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
              Manage member site access, role permissions, and subscription-tier page gating.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToPricingPlans?.()}
              className="px-3.5 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Subscription Models &rarr;</span>
            </button>
            <button
              onClick={() => setIsCreateRoleModalOpen(true)}
              className="px-4 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Member Role</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 mt-4 border-b border-slate-300 dark:border-slate-800 pb-2">
          <button
            onClick={() => setViewMode('roles-table')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'roles-table'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Member Roles & Gated Pages
          </button>
          <button
            onClick={() => setViewMode('subscription-matrix')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'subscription-matrix'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-3 h-3" />
            <span>Subscription-Linked Gating Matrix (20 Modules)</span>
          </button>
        </div>
      </div>

      {/* Member Pages Access Banner (Screen 5 Requirement) */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
            <Lock className="w-3 h-3" />
            <span>Private Content Architecture</span>
          </div>
          <h2 className="text-xl font-bold">Your site has {memberPages.length} member pages</h2>
          <p className="text-xs text-blue-100 leading-relaxed">
            Set which roles can access your restricted member pages, VIP Lounges, Masterclass vaults, and audio stems.
          </p>
        </div>

        <button
          onClick={() => setIsAccessModalOpen(true)}
          className="px-5 py-2.5 text-xs font-bold bg-white text-blue-700 hover:bg-blue-50 rounded-xl shadow-md transition-all flex items-center gap-2 self-start md:self-center font-mono"
        >
          <span>Set Access</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* View Mode 1: Roles Table */}
      {viewMode === 'roles-table' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Member Roles</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-200 font-mono border border-slate-400 font-black">
                {memberRoles.length}
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search member roles & plans..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 sm:w-64 text-slate-900 dark:text-white font-bold placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Roles Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Role Name</th>
                  <th className="py-3 px-4">Linked Subscription Tier</th>
                  <th className="py-3 px-4">Assigned Members</th>
                  <th className="py-3 px-4">Pages Accessible</th>
                  <th className="py-3 px-4">Date Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Role Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                          {role.name.charAt(0)}
                        </div>
                        <div>
                          <div>{role.name}</div>
                          {role.description && (
                            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">
                              {role.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Linked Subscription Tier */}
                    <td className="py-3.5 px-4 font-mono">
                      {role.subscriptionPlanName ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px] flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />
                            <span>{role.subscriptionPlanName}</span>
                          </span>
                          <span className="text-[10px] text-slate-700 font-medium">
                            {role.monthlyFIC ? `${role.monthlyFIC} FIC / mo (₦${role.monthlyNaira?.toLocaleString()})` : 'Free Tier (₦0)'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-700 font-medium text-[10px]">Standard System Role</span>
                      )}
                    </td>

                    {/* Assigned Members */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-300 font-mono font-bold text-[11px] border border-slate-400 font-black">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        <span>{role.assignedMembersCount.toLocaleString()} members</span>
                      </span>
                    </td>

                    {/* Accessible Pages */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-300 border border-blue-400 dark:border-blue-800 font-mono font-bold text-[11px]   font-black">
                        <Lock className="w-3 h-3 text-blue-500" />
                        <span>{role.accessiblePagesCount} pages</span>
                      </span>
                    </td>

                    {/* Date Created */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete member role '${role.name}'?`)) {
                            await onDeleteMemberRole(role.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Mode 2: Subscription-Linked Gating Matrix */}
      {viewMode === 'subscription-matrix' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-500" />
                <span>Subscription Tier &lt;&ndash;&gt; Member Access Matrix</span>
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                Each subscription pass automatically provisions a Member Role and unlocks corresponding private pages.
              </p>
            </div>
            <button
              onClick={() => onNavigateToPricingPlans?.()}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Manage Subscription Models on /subscriptions &rarr;</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-300 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 font-bold border-b border-slate-300 dark:border-slate-800 text-[10px] uppercase">
                <tr>
                  <th className="p-3">Restricted Screen / Page</th>
                  <th className="p-3">Required Subscription Tier</th>
                  <th className="p-3">Auto-Assigned Role</th>
                  <th className="p-3">Pricing (FIC / Naira)</th>
                  <th className="p-3">Access Mechanism</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {memberPages.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      <div>{page.title}</div>
                      <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">{page.path}</div>
                    </td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                      {page.requiredSubscriptionTier || 'Open / Public'}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-950 dark:text-blue-300 text-[10px] font-mono border border-blue-400 font-bold">
                        {page.allowedRoleIds?.[0] || 'Standard Member'}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                      {page.monthlyFIC ? `${page.monthlyFIC} FIC (₦${(page.monthlyFIC * 100).toLocaleString()})` : 'Free Tier'}
                    </td>
                    <td className="p-3 text-slate-700">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-200 text-[10px] border border-slate-400 font-bold">
                        {page.gatedCategory || 'Paywalled Channel'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setGrantedPasses((prev) => ({
                            ...prev,
                            [page.id]: !prev[page.id],
                          }));
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition border ${
                          grantedPasses[page.id]
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white border-slate-300'
                        }`}
                      >
                        {grantedPasses[page.id] ? '✓ Pass Active' : 'Grant Pass'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Feature Cards Section (Screen 5: More tools to give members page access) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Pricing Plans */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Platform Subscriptions (20 Modules)</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1 leading-relaxed">
              Sell subscriptions, memberships and passes that grant access to exclusive gated platform modules.
            </p>
          </div>
          <button
            onClick={onNavigateToPricingPlans}
            className="mt-4 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Manage Platform Subscriptions &rarr;</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Badges */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Member Badges</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1 leading-relaxed">
              Give members with the same badge access to specific site pages and milestone credentials.
            </p>
          </div>
          <button
            onClick={onNavigateToBadges}
            className="mt-4 text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Create Badge Studio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Signup & Login Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Signup and login settings</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1 leading-relaxed">
              Decide who can be a member, enable email confirmation, and add reCAPTCHA to secure your site.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/security-settings')}
            className="mt-4 text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Settings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Configure Page Access Modal */}
      <MemberPageAccessModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        pages={memberPages}
        roles={memberRoles}
        onSavePageAccess={onSavePageAccess}
      />

      {/* Create New Member Role Modal */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Create New Member Role
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-4">
              e.g., Student, VIP, Subscriber, Instructor
            </p>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Subscriber"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Optional description"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-md"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
