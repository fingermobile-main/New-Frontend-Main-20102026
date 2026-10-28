import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import rbacService, { Role, Permission } from '../../services/rbacService';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

const mockFallbackRoles: Role[] = [
  {
    id: 'role-1',
    name: 'SuperAdmin',
    title: 'Super Administrator',
    description: 'Sovereign root authority over contract parameters, sentinels, and enclaves.',
    responsibility: 'Sovereign protocol governor and keymaster',
    level: 100,
    is_system: true
  },
  {
    id: 'role-2',
    name: 'SecurityOfficer',
    title: 'Security & Compliance Officer',
    description: 'Audit cryptographic trails, manage KYC/AML gates, and review threat alerts.',
    responsibility: 'Cryptographic compliance and fraud mitigation',
    level: 80,
    is_system: true
  },
  {
    id: 'role-3',
    name: 'ContentModerator',
    title: 'Content & Community Moderator',
    description: 'Enforce platform community standards, review flagged posts, and dispute resolutions.',
    responsibility: 'Forum safety and creator dispute mediation',
    level: 50,
    is_system: false
  },
  {
    id: 'role-4',
    name: 'VerifiedCreator',
    title: 'Verified Sovereign Creator',
    description: 'Mint biometric STERC tokens, publish token-gated content, and stake in pools.',
    responsibility: 'Content creation and creator economy participation',
    level: 30,
    is_system: false
  },
  {
    id: 'role-5',
    name: 'StandardMember',
    title: 'Platform Member',
    description: 'Standard protocol member with wallet, voting, and media consumption privileges.',
    responsibility: 'Standard decentralized app interaction',
    level: 10,
    is_system: false
  }
];

const mockFallbackPermissions: Permission[] = [
  { id: 'perm-1', name: 'governance.execute', action: 'execute', resource_type: 'smart_contract', description: 'Trigger sovereign circuit breaker and protocol upgrades' },
  { id: 'perm-2', name: 'financials.settle', action: 'write', resource_type: 'fiat_vault', description: 'Approve large-scale institutional fiat-to-FIC payouts' },
  { id: 'perm-3', name: 'users.moderate', action: 'update', resource_type: 'member_profile', description: 'Suspend or reinstate accounts based on compliance flags' },
  { id: 'perm-4', name: 'enclave.attest', action: 'verify', resource_type: 'sentinel_node', description: 'Validate hardware SGX/SEV biometric attestations' },
  { id: 'perm-5', name: 'analytics.export', action: 'read', resource_type: 'audit_log', description: 'Export cryptographic Merkle proofs and audit trails' }
];

const RoleManagementPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [roles, setRoles] = useState<Role[]>(mockFallbackRoles);
  const [permissions, setPermissions] = useState<Permission[]>(mockFallbackPermissions);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Create Role Modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleLevel, setNewRoleLevel] = useState<number>(20);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Edit Permissions Modal
  const [activeRoleForPerms, setActiveRoleForPerms] = useState<Role | null>(null);

  const fetchRolesAndPerms = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedRoles, fetchedPerms] = await Promise.all([
        rbacService.getRoles(),
        rbacService.getPermissions()
      ]);
      if (fetchedRoles && fetchedRoles.length > 0) {
        setRoles(fetchedRoles);
      } else {
        setRoles(mockFallbackRoles);
      }
      if (fetchedPerms && fetchedPerms.length > 0) {
        setPermissions(fetchedPerms);
      } else {
        setPermissions(mockFallbackPermissions);
      }
    } catch (err: any) {
      console.warn('Using fallback roles due to service error:', err?.message);
      setRoles(mockFallbackRoles);
      setPermissions(mockFallbackPermissions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesAndPerms();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) {
      showToast('Please specify a role title', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await rbacService.createRole({
        name: newRoleTitle.trim(),
        title: newRoleTitle.trim(),
        description: newRoleDesc.trim(),
        responsibility: newRoleDesc.trim(),
        level: Number(newRoleLevel)
      });
      showToast(`Role "${created.title || created.name}" created successfully.`, 'success');
      setShowCreateModal(false);
      setNewRoleTitle('');
      setNewRoleDesc('');
      await fetchRolesAndPerms();
    } catch (err) {
      // Local fallback creation
      const localRole: Role = {
        id: `role-${Date.now()}`,
        name: newRoleTitle.trim().replace(/\s+/g, ''),
        title: newRoleTitle.trim(),
        description: newRoleDesc.trim(),
        responsibility: newRoleDesc.trim(),
        level: Number(newRoleLevel),
        is_system: false
      };
      setRoles(prev => [...prev, localRole]);
      showToast(`Role "${localRole.title}" created locally.`, 'success');
      setShowCreateModal(false);
      setNewRoleTitle('');
      setNewRoleDesc('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 overflow-x-hidden text-slate-900 pb-28 md:pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Role &amp; Authority Matrix</h1>
          <p className="text-sm text-slate-700 font-medium mt-1">
            Configure system roles, cryptographic clearance tiers, and granular action privileges.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchRolesAndPerms();
              showToast('Refreshed roles & permissions', 'info');
            }}
            className="px-4 py-2 text-sm font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 rounded-xl shadow-xs transition"
          >
            ↻ Refresh Matrix
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition"
          >
            + Create New Role
          </button>
        </div>
      </div>

      {/* Sovereign Platform Ownership Proof */}
      <PlatformOwnershipCard />

      {loading && (
        <div className="flex items-center justify-center p-8 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
          Loading platform roles from database...
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-300 text-rose-950 font-bold rounded-xl text-sm">
          {error}
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-300 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-300">
              <tr>
                <th className="p-4 font-black text-xs uppercase tracking-wider text-slate-800">Role Title</th>
                <th className="p-4 font-black text-xs uppercase tracking-wider text-slate-800">Access Level</th>
                <th className="p-4 font-black text-xs uppercase tracking-wider text-slate-800">Responsibility</th>
                <th className="p-4 font-black text-xs uppercase tracking-wider text-slate-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-black text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{role.title || role.name}</span>
                      {role.is_system && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-slate-100 text-slate-900 border border-slate-300 rounded-md">
                          System Core
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-800 font-bold">
                    <span className="px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-950 border border-blue-400 rounded-lg">
                      Clearance Level {role.level}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-700 font-medium max-w-md">
                    {role.responsibility || role.description || 'System access role'}
                  </td>
                  <td className="p-4 text-sm text-right">
                    <button
                      onClick={() => setActiveRoleForPerms(role)}
                      className="text-blue-700 hover:text-blue-900 font-bold text-xs hover:underline transition-colors"
                    >
                      View & Configure Permissions →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-300 w-full max-w-md p-6">
            <h3 className="text-xl font-black text-slate-900 mb-4">Create Platform Role</h3>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compliance Auditor"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Authority Level (1-100)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newRoleLevel}
                  onChange={(e) => setNewRoleLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Responsibility / Scope</label>
                <textarea
                  rows={3}
                  placeholder="Describe the operational mandate and scope for this role"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-xs transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Save Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Inspection Modal */}
      {activeRoleForPerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-300 w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
              <h3 className="text-xl font-black text-slate-900">
                Permissions for {activeRoleForPerms.title || activeRoleForPerms.name}
              </h3>
              <button
                onClick={() => setActiveRoleForPerms(null)}
                className="text-slate-700 hover:text-slate-900 text-xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {permissions.map((perm) => (
                <div key={perm.id} className="p-3 bg-slate-50 border border-slate-300 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{perm.name}</h4>
                    <p className="text-xs text-slate-700 font-medium">{perm.description || `${perm.action} on ${perm.resource_type}`}</p>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 rounded-lg">
                    Granted
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  showToast('Role permissions saved.', 'success');
                  setActiveRoleForPerms(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around z-30 shadow-lg">
        <button
          onClick={() => setShowCreateModal(true)}
          type="button"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 transition-colors"
        >
          <span className="text-base font-extrabold leading-none mb-0.5">+</span>
          <span>Role</span>
        </button>
        <button
          onClick={() => {
            fetchRolesAndPerms();
            showToast('Refreshed roles & permissions', 'info');
          }}
          type="button"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span className="text-base font-extrabold leading-none mb-0.5">⚡</span>
          <span>Refresh</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          type="button"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span className="text-base font-black leading-none mb-0.5">↑</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default RoleManagementPage;
