import React, { useState } from 'react';
import { X, Shield, Check, AlertCircle } from 'lucide-react';
import { Permission, RoleCategory } from '../../../types/roles-permissions';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    description: string;
    category: RoleCategory;
    permissions: string[];
  }) => Promise<void>;
  availablePermissions: Permission[];
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  availablePermissions,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RoleCategory>('CUSTOM');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'site.edit',
    'cms.content.view',
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTogglePermission = (code: string) => {
    if (selectedPermissions.includes(code)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== code));
    } else {
      setSelectedPermissions([...selectedPermissions, code]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Role name is required');
      return;
    }
    if (selectedPermissions.length === 0) {
      setError('Select at least one permission node');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onCreate({
        name: name.trim(),
        description: description.trim(),
        category,
        permissions: selectedPermissions,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Custom Role</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Define granular permissions and operational scope for this custom role.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-700 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
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
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Live Event Streamer, Reservations Manager"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-bold border-slate-300 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Explain what collaborators with this role can do..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-bold border-slate-300 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as RoleCategory)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="CUSTOM">Custom Roles</option>
              <option value="GENERAL">General Roles</option>
              <option value="CMS">CMS Roles</option>
              <option value="BILLING">Billing Roles</option>
              <option value="MARKETING">Marketing Roles</option>
              <option value="STORES">Stores Roles</option>
              <option value="BOOKINGS">Bookings Roles</option>
              <option value="EVENTS">Events Roles</option>
              <option value="PAYMENTS">Payments Roles</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select Permissions ({selectedPermissions.length} selected)
            </label>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {availablePermissions.map((perm) => {
                const isSelected = selectedPermissions.includes(perm.code);
                return (
                  <div
                    key={perm.id}
                    onClick={() => handleTogglePermission(perm.code)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        <span>{perm.name}</span>
                        <code className="text-[10px] px-1 py-0.2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-slate-500">
                          {perm.code}
                        </code>
                      </div>
                      {perm.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {perm.description}
                        </p>
                      )}
                    </div>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
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

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20"
            >
              {loading ? 'Creating...' : '+ Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
