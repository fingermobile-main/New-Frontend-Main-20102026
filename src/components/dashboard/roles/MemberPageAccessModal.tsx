import React, { useState } from 'react';
import { X, Lock, Check, Layers, AlertCircle } from 'lucide-react';
import { MemberPage, MemberRole } from '../../../types/roles-permissions';

interface MemberPageAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: MemberPage[];
  roles: MemberRole[];
  onSavePageAccess: (pageId: string, allowedRoleIds: string[]) => Promise<void>;
}

export const MemberPageAccessModal: React.FC<MemberPageAccessModalProps> = ({
  isOpen,
  onClose,
  pages,
  roles,
  onSavePageAccess,
}) => {
  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0]?.id || 'page_01');
  const [pageRoleMap, setPageRoleMap] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    pages.forEach((p) => {
      initial[p.id] = p.allowedRoleIds || [];
    });
    return initial;
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const activePage = pages.find((p) => p.id === selectedPageId) || pages[0];
  const activeAllowedRoles = pageRoleMap[activePage?.id] || [];

  const handleToggleRole = (roleId: string) => {
    const current = pageRoleMap[activePage.id] || [];
    const updated = current.includes(roleId)
      ? current.filter((id) => id !== roleId)
      : [...current, roleId];

    setPageRoleMap({
      ...pageRoleMap,
      [activePage.id]: updated,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSavePageAccess(activePage.id, activeAllowedRoles);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <span>Configure Gated Member Page Access</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select which member roles are permitted to access each private page on your site.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-700 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col md:flex-row gap-6 overflow-y-auto flex-1">
          {/* Left: Pages List */}
          <div className="w-full md:w-5/12 space-y-1.5 border-r border-slate-100 dark:border-slate-800 pr-0 md:pr-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Member Page:
            </div>
            {pages.map((p) => {
              const isSelected = p.id === activePage?.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPageId(p.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="line-clamp-1">{p.title}</div>
                  <div
                    className={`text-[10px] mt-0.5 font-mono ${
                      isSelected ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {p.path}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Roles Toggle for Active Page */}
          <div className="w-full md:w-7/12 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{activePage?.title}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                {activePage?.path}
              </p>
            </div>

            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200">
              Check the roles that should be granted viewing and interaction access to this page.
            </div>

            <div className="space-y-2">
              {roles.map((role) => {
                const isChecked = activeAllowedRoles.includes(role.id);
                return (
                  <div
                    key={role.id}
                    onClick={() => handleToggleRole(role.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                      isChecked
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {role.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {role.assignedMembersCount} assigned members
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                        isChecked
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Saving...' : 'Apply Access Gate'}
          </button>
        </div>
      </div>
    </div>
  );
};
