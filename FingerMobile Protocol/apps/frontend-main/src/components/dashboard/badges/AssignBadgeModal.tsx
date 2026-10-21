import React, { useState } from 'react';
import { X, Award, Check, Users, Search, AlertCircle } from 'lucide-react';
import { MemberBadge } from '../../../types/roles-permissions';

interface AssignBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  badge: MemberBadge | null;
  onAssign: (
    badgeId: string,
    members: Array<{ id: string; name: string; email?: string }>
  ) => Promise<void>;
}

const SAMPLE_COMMUNITY_MEMBERS = [
  { id: 'mem_101', name: 'Adaobi Okonjo', email: 'adaobi@fingermobileprotocol.com' },
  { id: 'mem_102', name: 'Chidi Amadi', email: 'chidi@fingermobileprotocol.com' },
  { id: 'mem_103', name: 'Kelechi Nwosu', email: 'kelechi@fingermobileprotocol.com' },
  { id: 'mem_104', name: 'Zainab Balogun', email: 'zainab@fingermobileprotocol.com' },
  { id: 'mem_105', name: 'Tunde Adeleke', email: 'tunde@fingermobileprotocol.com' },
  { id: 'mem_106', name: 'Sarah Jenkins', email: 'sarah.j@fingermobileprotocol.com' },
  { id: 'mem_107', name: 'David Chen', email: 'david.chen@fingermobileprotocol.com' },
];

export const AssignBadgeModal: React.FC<AssignBadgeModalProps> = ({
  isOpen,
  onClose,
  badge,
  onAssign,
}) => {
  const [search, setSearch] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !badge) return null;

  const filteredMembers = SAMPLE_COMMUNITY_MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelectMember = (id: string) => {
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter((mId) => mId !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMemberIds.length === 0) {
      setError('Please select at least one site member');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const membersToAssign = SAMPLE_COMMUNITY_MEMBERS.filter((m) =>
        selectedMemberIds.includes(m.id)
      );
      await onAssign(badge.id, membersToAssign);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to assign badge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Assign Member Badge</span>
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
              Award <strong className="text-slate-900 dark:text-white font-black">{badge.name}</strong> to community members.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-300 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="relative">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {filteredMembers.map((member) => {
              const isChecked = selectedMemberIds.includes(member.id);
              return (
                <div
                  key={member.id}
                  onClick={() => toggleSelectMember(member.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                    isChecked
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40'
                      : 'border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-black text-xs text-slate-950 dark:text-slate-200 border border-slate-400">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-slate-700 dark:text-slate-300 font-mono font-semibold">
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-400 dark:border-slate-600'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-300 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">
              {selectedMemberIds.length} member(s) selected
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
              >
                {loading ? 'Assigning...' : 'Assign Badge'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
