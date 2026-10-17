import React, { useState } from 'react';
import { X, Mail, User, Shield, MapPin, Check, AlertCircle } from 'lucide-react';
import { RoleDetail } from '../../../types/roles-permissions';

interface InviteCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: {
    email: string;
    name: string;
    roleIds: string[];
    locationScope: { type: 'ALL' | 'SPECIFIC'; locationIds?: string[]; locationNames?: string[] };
  }) => Promise<void>;
  availableRoles: RoleDetail[];
}

export const InviteCollaboratorModal: React.FC<InviteCollaboratorModalProps> = ({
  isOpen,
  onClose,
  onInvite,
  availableRoles,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(['role_website_manager']);
  const [locationType, setLocationType] = useState<'ALL' | 'SPECIFIC'>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('loc_lagos_hq');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (selectedRoleIds.length === 0) {
      setError('Please select at least one role for this collaborator');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onInvite({
        email: email.trim(),
        name: name.trim() || email.split('@')[0],
        roleIds: selectedRoleIds,
        locationScope: {
          type: locationType,
          locationIds: locationType === 'SPECIFIC' ? [selectedLocation] : [],
          locationNames: locationType === 'SPECIFIC' ? ['Lagos Flagship Hub'] : [],
        },
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (roleId: string) => {
    if (selectedRoleIds.includes(roleId)) {
      if (selectedRoleIds.length > 1) {
        setSelectedRoleIds(selectedRoleIds.filter((id) => id !== roleId));
      }
    } else {
      setSelectedRoleIds([...selectedRoleIds, roleId]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Invite Collaborator</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Invite team members with role-based access. Invitations are valid for 29 days.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-700 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-bold border-slate-300 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name (Optional)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Marcus Ellery"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-bold border-slate-300 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Assign Role(s) <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {availableRoles.slice(0, 8).map((role) => {
                const isSelected = selectedRoleIds.includes(role.id);
                return (
                  <div
                    key={role.id}
                    onClick={() => toggleRole(role.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 dark:border-blue-600'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{role.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                          {role.category}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 line-clamp-1">
                        {role.description}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Location Assignment
            </label>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 ${
                  locationType === 'ALL'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="loc"
                  checked={locationType === 'ALL'}
                  onChange={() => setLocationType('ALL')}
                  className="sr-only text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <MapPin className="w-4 h-4" />
                <span className="font-medium">All Locations</span>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 ${
                  locationType === 'SPECIFIC'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="loc"
                  checked={locationType === 'SPECIFIC'}
                  onChange={() => setLocationType('SPECIFIC')}
                  className="sr-only text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Specific Location</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
