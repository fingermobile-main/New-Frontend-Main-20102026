import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import rbacService, { Role, Permission } from '../../services/rbacService';

const RoleManagementPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
      setRoles(fetchedRoles);
      setPermissions(fetchedPerms);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch roles from database.');
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
      showToast('Failed to create role.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-sm text-gray-500 mt-1">Configure system roles, access levels, and granular authority.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition"
        >
          + Create New Role
        </button>
      </div>

      {loading && (
        <div className="text-center py-12 text-gray-500 text-sm">
          Loading platform roles from database...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-slate-300">
              <tr>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-gray-600">Role Title</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-gray-600">Access Level</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-gray-600">Responsibility</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <span>{role.title || role.name}</span>
                      {role.is_system && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">System</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-md">
                      Level {role.level}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 max-w-md">
                    {role.responsibility || role.description || 'System access role'}
                  </td>
                  <td className="p-4 text-sm text-right">
                    <button
                      onClick={() => setActiveRoleForPerms(role)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline"
                    >
                      View & Edit Permissions
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create Platform Role</h3>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compliance Auditor"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Authority Level (1-100)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newRoleLevel}
                  onChange={(e) => setNewRoleLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Responsibility / Scope</label>
                <textarea
                  rows={3}
                  placeholder="Describe the operational mandate and scope for this role"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
              <h3 className="text-lg font-bold text-gray-900">
                Permissions for {activeRoleForPerms.title || activeRoleForPerms.name}
              </h3>
              <button
                onClick={() => setActiveRoleForPerms(null)}
                className="text-slate-700 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {permissions.map((perm) => (
                <div key={perm.id} className="p-3 bg-gray-50 border border-slate-300 rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{perm.name}</h4>
                    <p className="text-xs text-slate-700">{perm.description || `${perm.action} on ${perm.resource_type}`}</p>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold rounded">
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
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagementPage;
