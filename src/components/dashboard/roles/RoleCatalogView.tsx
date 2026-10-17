import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Shield,
  Search,
  Filter,
  Check,
  Trash2,
  Edit2,
  Lock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { RoleDetail, Permission } from '../../../types/roles-permissions';
import { CreateRoleModal } from './CreateRoleModal';

interface RoleCatalogViewProps {
  roles: RoleDetail[];
  permissions: Permission[];
  onBack: () => void;
  onCreateRole: (data: any) => Promise<void>;
  onDeleteRole: (id: string) => Promise<void>;
}

export const RoleCatalogView: React.FC<RoleCatalogViewProps> = ({
  roles,
  permissions,
  onBack,
  onCreateRole,
  onDeleteRole,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRoleDetail, setSelectedRoleDetail] = useState<RoleDetail | null>(null);

  const categories = [
    'ALL',
    'CUSTOM',
    'GENERAL',
    'CMS',
    'BILLING',
    'MARKETING',
    'STORES',
    'POS',
    'BLOG',
    'BOOKINGS',
    'EVENTS',
    'PAYMENTS',
    'RESTAURANTS',
  ];

  const filteredRoles = roles.filter((r) => {
    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collaborators</span>
          </button>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Manage Roles</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {roles.length} Total
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create, view and edit roles & permissions for this site.{' '}
            <a href="#learn-more" className="text-blue-600 dark:text-blue-400 hover:underline">
              Learn more
            </a>
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Role</span>
        </button>
      </div>

      {/* Toolbar & Filter Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search roles by title or scope..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-bold border-slate-300 placeholder:text-slate-400"
            />
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 self-end sm:self-auto">
            Showing <span className="font-bold text-slate-800 dark:text-slate-200">{filteredRoles.length}</span> roles
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'All Roles' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Roles Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-700 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Assigned Count</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {role.category}
                    </span>
                  </td>

                  {/* Title + Default Lock */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span>{role.name}</span>
                      {role.isSystemDefault && (
                        <span title="System default role">
                          <Lock className="w-3 h-3 text-slate-500" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-md">
                    <p className="line-clamp-2">{role.description}</p>
                  </td>

                  {/* Assigned Count */}
                  <td className="py-3.5 px-4">
                    {role.assignedUsersCount > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-300 border border-blue-400 dark:border-blue-800 text-blue-950 border-blue-400 font-black">
                        {role.assignedUsersCount} Assigned
                      </span>
                    ) : (
                      <span className="text-slate-700 text-[11px]">Not assigned</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedRoleDetail(role)}
                        className="px-2.5 py-1 text-[11px] font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        Inspect
                      </button>
                      {!role.isSystemDefault && (
                        <button
                          onClick={async () => {
                            if (window.confirm(`Delete custom role '${role.name}'?`)) {
                              await onDeleteRole(role.id);
                            }
                          }}
                          className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Details Inspector Modal */}
      {selectedRoleDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>{selectedRoleDetail.name}</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                {selectedRoleDetail.category}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">{selectedRoleDetail.description}</p>
            <div className="mt-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Included Permissions Nodes:
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                {(selectedRoleDetail.permissions || ['site.edit', 'billing.manage']).map((p, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRoleDetail(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={onCreateRole}
        availablePermissions={permissions}
      />
    </div>
  );
};
