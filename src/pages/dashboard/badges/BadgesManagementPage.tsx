import React, { useState, useEffect } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { BadgesStudioView } from '../../../components/dashboard/badges/BadgesStudioView';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
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
      </div>
    </MainLayout>
  );
};

export default BadgesManagementPage;
