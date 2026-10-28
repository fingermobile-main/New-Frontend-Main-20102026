import React, { useState, useEffect } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { BadgesStudioView } from '../../../components/dashboard/badges/BadgesStudioView';
import PlatformOwnershipCard from '../../../components/dashboard/PlatformOwnershipCard';
import badgeService from '../../../services/badgeService';
import rolesPermissionsService from '../../../services/rolesPermissionsService';
import { MemberBadge, MemberPage, MemberBadgeAssignment } from '../../../types/roles-permissions';

export const BadgesManagementPage: React.FC = () => {
  const [badges, setBadges] = useState<MemberBadge[]>([]);
  const [memberPages, setMemberPages] = useState<MemberPage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedBadges, fetchedPages] = await Promise.all([
        badgeService.getBadges(),
        rolesPermissionsService.getMemberPages(),
      ]);
      setBadges(fetchedBadges);
      setMemberPages(fetchedPages);
    } catch (error) {
      console.error('Failed to load badges or member pages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBadge = async (data: any) => {
    await badgeService.createBadge(data);
    await fetchData();
  };

  const handleUpdateBadge = async (id: string, data: any) => {
    await badgeService.updateBadge(id, data);
    await fetchData();
  };

  const handleDeleteBadge = async (id: string) => {
    await badgeService.deleteBadge(id);
    await fetchData();
  };

  const handleAssignBadge = async (badgeId: string, members: any[]) => {
    await badgeService.assignBadge(badgeId, members);
    await fetchData();
  };

  const handleUnassignBadge = async (badgeId: string, memberId: string) => {
    await badgeService.unassignBadge(badgeId, memberId);
    await fetchData();
  };

  const handleToggleMuteMember = async (badgeId: string, memberId: string) => {
    await badgeService.toggleMuteMember(badgeId, memberId);
    await fetchData();
  };

  const getBadgeMembers = async (badgeId: string): Promise<MemberBadgeAssignment[]> => {
    return await badgeService.getBadgeMembers(badgeId);
  };

  return (
    <MainLayout>
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 overflow-x-hidden text-slate-900 pb-28 md:pb-12">
        <PlatformOwnershipCard />
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <BadgesStudioView
            badges={badges}
            memberPages={memberPages}
            onCreateBadge={handleCreateBadge}
            onUpdateBadge={handleUpdateBadge}
            onDeleteBadge={handleDeleteBadge}
            onAssignBadge={handleAssignBadge}
            onUnassignBadge={handleUnassignBadge}
            onToggleMuteMember={handleToggleMuteMember}
            getBadgeMembers={getBadgeMembers}
          />
        )}
        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around z-30 shadow-lg">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            type="button"
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-amber-600 bg-amber-50 transition-colors"
          >
            <span className="text-base font-extrabold leading-none mb-0.5">🎖️</span>
            <span>Badges</span>
          </button>
          <button
            onClick={() => fetchData()}
            type="button"
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <span className="text-base font-black leading-none mb-0.5">🔄</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default BadgesManagementPage;
