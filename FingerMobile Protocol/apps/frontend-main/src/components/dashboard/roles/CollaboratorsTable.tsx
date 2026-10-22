import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Info,
  Plus,
  CheckCircle2,
  MapPin,
  Trash2,
  Shield,
  UserCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Collaborator, CollaboratorSeatPlan, RoleDetail } from '../../../types/roles-permissions';
import { InviteCollaboratorModal } from './InviteCollaboratorModal';
import { ManageLocationsModal } from './ManageLocationsModal';

interface CollaboratorsTableProps {
  collaborators: Collaborator[];
  seats: CollaboratorSeatPlan;
  availableRoles: RoleDetail[];
  onInvite: (data: any) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onUpdateRoles: (id: string, roleIds: string[]) => Promise<void>;
  onUpdateLocations: (id: string, data: any) => Promise<void>;
  onUpgradePlan?: () => void;
  onNavigateToManageRoles: () => void;
}

export const CollaboratorsTable: React.FC<CollaboratorsTableProps> = ({
  collaborators,
  seats,
  availableRoles,
  onInvite,
  onRemove,
  onUpdateRoles,
  onUpdateLocations,
  onUpgradePlan,
  onNavigateToManageRoles,
}) => {
  const [search, setSearch] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [locationModalCollaborator, setLocationModalCollaborator] = useState<Collaborator | null>(null);
  const [roleEditCollaborator, setRoleEditCollaborator] = useState<Collaborator | null>(null);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<string>('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredList = collaborators.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.roles.some((r) => r.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRoleChangeSubmit = async () => {
    if (roleEditCollaborator && selectedRoleForEdit) {
      await onUpdateRoles(roleEditCollaborator.id, [selectedRoleForEdit]);
      setRoleEditCollaborator(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-1 flex items-center gap-1.5">
            <span>Settings</span>
            <span>/</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Roles & Permissions</span>
          </nav>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Roles & Permissions</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-950 dark:text-blue-300 border border-blue-400 dark:border-blue-800   font-black">
              Enterprise RBAC
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
            Invite collaborators to work on this site and manage roles.{' '}
            <Link to="/admin/pages-permissions" className="text-blue-700 dark:text-blue-400 font-bold hover:underline">
              Platform RBAC Guide
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToManageRoles}
            className="px-4 py-2.5 text-xs font-bold border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors shadow-sm"
          >
            Manage Roles
          </button>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Invite Collaborators</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
        </div>
      </div>

      {/* Plan / Seat Quota Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1 max-w-xl">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              <span className="text-blue-700 dark:text-blue-400 font-bold">{seats.availableSeats} collaborator seats left</span>
              <Info className="w-4 h-4 text-slate-500 cursor-pointer" />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-mono font-bold ml-auto">
                {seats.usedSeats}/{seats.totalSeats}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border text-slate-950 border-slate-400 font-black">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (seats.usedSeats / seats.totalSeats) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Your current plan ({seats.planName || 'Enterprise Tier'}) allows for {seats.totalSeats} collaborator seats. To add more, upgrade your plan.
            </p>
          </div>

          <button
            onClick={onUpgradePlan}
            className="px-4 py-2 text-xs font-bold border border-blue-600 text-blue-700 dark:text-blue-400 dark:border-blue-500 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors self-start md:self-center"
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Collaborator List Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Collaborators</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-200 font-mono border border-slate-400 font-black">
              {collaborators.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Filter collaborators"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5 text-slate-600" />
              <span>Filter</span>
            </button>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-64 text-slate-900 dark:text-white font-bold placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Roles</th>
                <th className="py-3 px-4">Location Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Status date</th>
                <th className="py-3 px-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {filteredList.map((collab) => (
                <tr key={collab.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Name + Email + Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
                        {collab.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{collab.name}</div>
                        {collab.email && <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">{collab.email}</div>}
                      </div>
                    </div>
                  </td>

                  {/* Roles */}
                  <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                    <div className="flex flex-col gap-1">
                      {collab.roles.map((role, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 dark:text-slate-200"
                        >
                          <Shield className="w-3 h-3 text-blue-600 flex-shrink-0" />
                          <span>{role.name}</span>
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Location Scope */}
                  <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-medium">
                    {collab.locationScope?.type === 'SPECIFIC' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/40 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[10px] font-bold">
                        <MapPin className="w-3 h-3" />
                        <span>Specific ({collab.locationScope.locationNames?.[0] || '1 Location'})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                        <MapPin className="w-3 h-3 opacity-60" />
                        <span>All locations</span>
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                        collab.status === 'Active'
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-300 border-emerald-400 dark:border-emerald-800'
                          : 'bg-amber-100 dark:bg-amber-950/40 text-amber-950 dark:text-amber-300 border-amber-400 dark:border-amber-800'
                      }`}
                    >
                      {collab.status}
                    </span>
                  </td>

                  {/* Status Date */}
                  <td className="py-3.5 px-4 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    {collab.statusDate ? new Date(collab.statusDate).toLocaleDateString() : '—'}
                  </td>

                  {/* Actions Dropdown */}
                  <td className="py-3.5 px-4 text-right relative">
                    <button type="button" aria-label="More options"
                      onClick={() => setActiveMenuId(activeMenuId === collab.id ? null : collab.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Popover Action Menu */}
                    {activeMenuId === collab.id && (
                      <div
                        className="absolute right-4 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-20 text-left animate-in fade-in"
                        onMouseLeave={() => setActiveMenuId(null)}
                      >
                        <button
                          onClick={() => {
                            setRoleEditCollaborator(collab);
                            setSelectedRoleForEdit(collab.roles[0]?.id || 'role_website_manager');
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-bold"
                        >
                          <Shield className="w-3.5 h-3.5 text-blue-600" />
                          <span>Change role</span>
                        </button>
                        <button
                          onClick={() => {
                            setLocationModalCollaborator(collab);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-bold"
                        >
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>Manage locations</span>
                        </button>
                        <button
                          onClick={() => {
                            alert(`Set ${collab.name} as primary client liaison`);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-bold"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Set as client</span>
                        </button>
                        <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                        <button
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to remove ${collab.name} as a collaborator?`)) {
                              await onRemove(collab.id);
                            }
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove collaborator</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <InviteCollaboratorModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={onInvite}
        availableRoles={availableRoles}
      />

      <ManageLocationsModal
        isOpen={!!locationModalCollaborator}
        collaborator={locationModalCollaborator}
        onClose={() => setLocationModalCollaborator(null)}
        onSave={onUpdateLocations}
      />

      {/* Role Quick-Edit Modal */}
      {roleEditCollaborator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Change Role for {roleEditCollaborator.name}
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1 mb-4">
              Select the new primary role for this team member.
            </p>
            <select
              value={selectedRoleForEdit}
              onChange={(e) => setSelectedRoleForEdit(e.target.value)}
              className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white mb-6 font-bold focus:ring-2 focus:ring-indigo-500"
            >
              {availableRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.category})
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setRoleEditCollaborator(null)}
                className="px-4 py-2 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChangeSubmit}
                className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-md"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
