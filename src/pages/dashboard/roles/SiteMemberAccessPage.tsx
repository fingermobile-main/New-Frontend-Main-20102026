import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import { SiteMemberAccessView } from '../../../components/dashboard/roles/SiteMemberAccessView';
import rolesPermissionsService from '../../../services/rolesPermissionsService';
import { MemberRole, MemberPage } from '../../../types/roles-permissions';

export const SiteMemberAccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [memberRoles, setMemberRoles] = useState<MemberRole[]>([]);
  const [memberPages, setMemberPages] = useState<MemberPage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const overview = await rolesPermissionsService.getMemberAccessOverview();
      setMemberRoles(overview.memberRoles);
      setMemberPages(overview.memberPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRole = async (data: any) => {
    await rolesPermissionsService.createMemberRole(data);
    await fetchData();
  };

  const handleDeleteRole = async (id: string) => {
    await rolesPermissionsService.deleteMemberRole(id);
    await fetchData();
  };

  const handleSavePageAccess = async (pageId: string, allowedRoleIds: string[]) => {
    await rolesPermissionsService.updatePagePermissions(pageId, allowedRoleIds);
    await fetchData();
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <SiteMemberAccessView
            memberRoles={memberRoles}
            memberPages={memberPages}
            onCreateMemberRole={handleCreateRole}
            onDeleteMemberRole={handleDeleteRole}
            onSavePageAccess={handleSavePageAccess}
            onNavigateToBadges={() => navigate('/settings/badges')}
            onNavigateToPricingPlans={() => navigate('/subscriptions')}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default SiteMemberAccessPage;
