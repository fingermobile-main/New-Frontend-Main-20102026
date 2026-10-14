import React, { useState } from 'react';
import {
  Award,
  Plus,
  Search,
  MoreHorizontal,
  Users,
  Lock,
  Trash2,
  VolumeX,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { MemberBadge, MemberPage, MemberBadgeAssignment } from '../../../types/roles-permissions';
import { CreateBadgeModal } from './CreateBadgeModal';
import { AssignBadgeModal } from './AssignBadgeModal';

/* eslint-disable no-unused-vars */
interface BadgesStudioViewProps {
  badges: MemberBadge[];
  memberPages: MemberPage[];
  onCreateBadge: (data: any) => Promise<void>;
  onUpdateBadge: (id: string, data: any) => Promise<void>;
  onDeleteBadge: (id: string) => Promise<void>;
  onAssignBadge: (badgeId: string, members: any[]) => Promise<void>;
  onUnassignBadge: (badgeId: string, memberId: string) => Promise<void>;
  onToggleMuteMember: (badgeId: string, memberId: string) => Promise<void>;
  getBadgeMembers: (badgeId: string) => Promise<MemberBadgeAssignment[]>;
}
/* eslint-enable no-unused-vars */

export const BadgesStudioView: React.FC<BadgesStudioViewProps> = (props) => {
  const {
    badges,
    memberPages,
    onCreateBadge,
    onDeleteBadge,
    onAssignBadge,
    onUnassignBadge,
    onToggleMuteMember,
    getBadgeMembers,
  } = props;
  const [search, setSearch] = useState('');
  const [activePhase, setActivePhase] = useState<'ALL' | 'ONBOARDING' | 'CORE_CONTRIBUTION' | 'ECOSYSTEM_PRESTIGE'>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [assignBadgeTarget, setAssignBadgeTarget] = useState<MemberBadge | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [viewMembersBadge, setViewMembersBadge] = useState<MemberBadge | null>(null);
  const [badgeMembersList, setBadgeMembersList] = useState<MemberBadgeAssignment[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const filteredBadges = badges.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      (b.functionalRole && b.functionalRole.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (activePhase === 'ALL') return true;
    return b.phase === activePhase;
  });

  const handleOpenMembersModal = async (badge: MemberBadge) => {
    setViewMembersBadge(badge);
    setLoadingMembers(true);
    try {
      const members = await getBadgeMembers(badge.id);
      setBadgeMembersList(members);
    } finally {
      setLoadingMembers(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
            <span>Site Members</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Member Badges</span>
          </nav>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Member Badges Studio</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              10-Tier Gamification Architecture
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Reward community merit, engagement streaks, and network prestige through 3 operational phases: Onboarding (Tiers 1–3), Core Contribution (Tiers 4–7), and Ecosystem Prestige (Tiers 8–10).
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Create New Badge</span>
        </button>
      </div>

      {/* Toolbar & Phase Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Tiers (1–10)' },
            { id: 'ONBOARDING', label: '1. Onboarding (T1–3)' },
            { id: 'CORE_CONTRIBUTION', label: '2. Contribution (T4–7)' },
            { id: 'ECOSYSTEM_PRESTIGE', label: '3. Prestige (T8–10)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePhase(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                activePhase === tab.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by badge or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 shrink-0 font-medium">
            <span className="font-bold text-slate-800 dark:text-slate-200">{filteredBadges.length}</span> Badges
          </div>
        </div>
      </div>

      {/* Badges Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
          >
            <div>
              {/* Top Row: Pill Preview + Actions */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div
                    className="px-3 py-1 rounded-full inline-flex items-center gap-1.5 text-xs font-bold shadow-sm"
                    style={{ backgroundColor: badge.bgColor, color: badge.textColor }}
                  >
                    {badge.iconSvg && (
                      <span
                        className="w-3.5 h-3.5 flex items-center justify-center shrink-0"
                        dangerouslySetInnerHTML={{ __html: badge.iconSvg }}
                      />
                    )}
                    <span>{badge.name}</span>
                  </div>

                  {badge.tierRank && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      Tier {badge.tierRank}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === badge.id ? null : badge.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {/* Context Actions Menu matching lines 135-141 & 391-400 */}
                  {activeMenuId === badge.id && (
                    <div
                      className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-20 text-left animate-in fade-in"
                      onMouseLeave={() => setActiveMenuId(null)}
                    >
                      <button
                        onClick={() => {
                          setAssignBadgeTarget(badge);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                      >
                        <Plus className="w-3.5 h-3.5 text-blue-500" />
                        <span>Assign Badge</span>
                      </button>

                      <button
                        onClick={() => {
                          handleOpenMembersModal(badge);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                      >
                        <Users className="w-3.5 h-3.5 text-emerald-500" />
                        <span>View Members</span>
                      </button>

                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete badge '${badge.name}'? Badge holders will lose unlock permissions.`)) {
                            await onDeleteBadge(badge.id);
                          }
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Badge</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Functional Role Tag */}
              {badge.functionalRole && (
                <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>{badge.functionalRole}</span>
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2.5">
                {badge.description}
              </p>

              {/* Unlock Criteria Box */}
              {badge.unlockCriteria && (
                <div className="p-2.5 mb-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-1">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Unlock Metric:</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">Automated Check</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-normal">
                    {badge.unlockCriteria}
                  </p>
                </div>
              )}

              {/* Privileges & Status Perks */}
              {badge.privileges && (
                <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] space-y-1">
                  <div className="font-bold text-amber-700 dark:text-amber-300">
                    Status & Privileges:
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-normal">
                    {badge.privileges}
                  </p>
                </div>
              )}

              {/* Page Access Tag */}
              {badge.badgeAccessEnabled && badge.accessiblePageIds?.length > 0 && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                  <Lock className="w-3 h-3 shrink-0" />
                  <span>Unlocks {badge.accessiblePageIds.length} restricted member page(s)</span>
                </div>
              )}
            </div>

            {/* Bottom Meta & Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{badge.assignedMembersCount || 0} Holders</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAssignBadgeTarget(badge)}
                  className="px-2.5 py-1 text-[11px] font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Assign
                </button>
                <button
                  onClick={() => handleOpenMembersModal(badge)}
                  className="px-2.5 py-1 text-[11px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Members
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Badge Members Drawer / Modal */}
      {viewMembersBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>{viewMembersBadge.name} Holders</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Members who have been rewarded with this credential.
                </p>
              </div>
              <button
                onClick={() => setViewMembersBadge(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2 overflow-y-auto flex-1">
              {loadingMembers ? (
                <div className="text-center py-8 text-xs text-slate-400">Loading members...</div>
              ) : badgeMembersList.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No members have been assigned this badge yet.
                </div>
              ) : (
                badgeMembersList.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{assignment.memberName}</span>
                        {assignment.isMuted && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-red-100 text-red-700 rounded font-medium">
                            Muted
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {assignment.memberEmail}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          await onToggleMuteMember(viewMembersBadge.id, assignment.memberId);
                          const updated = await getBadgeMembers(viewMembersBadge.id);
                          setBadgeMembersList(updated);
                        }}
                        className={`p-1.5 rounded-lg border text-xs ${
                          assignment.isMuted
                            ? 'text-amber-600 border-amber-200'
                            : 'text-slate-500 border-slate-200 hover:text-slate-800'
                        }`}
                        title={assignment.isMuted ? 'Unmute Member' : 'Mute Member'}
                      >
                        {assignment.isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={async () => {
                          if (window.confirm(`Revoke badge from ${assignment.memberName}?`)) {
                            await onUnassignBadge(viewMembersBadge.id, assignment.memberId);
                            const updated = await getBadgeMembers(viewMembersBadge.id);
                            setBadgeMembersList(updated);
                          }
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                        title="Remove badge"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setViewMembersBadge(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateBadgeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBadge={onCreateBadge}
        memberPages={memberPages}
      />

      <AssignBadgeModal
        isOpen={!!assignBadgeTarget}
        onClose={() => setAssignBadgeTarget(null)}
        badge={assignBadgeTarget}
        onAssign={onAssignBadge}
      />
    </div>
  );
};
