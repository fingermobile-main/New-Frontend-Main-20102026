import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import { CollaboratorsTable } from '../../../components/dashboard/roles/CollaboratorsTable';
import rolesPermissionsService from '../../../services/rolesPermissionsService';
import { Collaborator, CollaboratorSeatPlan, RoleDetail } from '../../../types/roles-permissions';

export const RolesPermissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [seats, setSeats] = useState<CollaboratorSeatPlan>({
    totalSeats: 10,
    usedSeats: 5,
    availableSeats: 5,
    canUpgrade: true,
  });
  const [availableRoles, setAvailableRoles] = useState<RoleDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [collabRes, rolesRes] = await Promise.all([
        rolesPermissionsService.getCollaborators(),
        rolesPermissionsService.getRoles(),
      ]);
      setCollaborators(collabRes.collaborators);
      setSeats(collabRes.seats);
      setAvailableRoles(rolesRes.roles);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvite = async (data: any) => {
    await rolesPermissionsService.inviteCollaborator(data);
    await fetchData();
  };

  const handleRemove = async (id: string) => {
    await rolesPermissionsService.removeCollaborator(id);
    await fetchData();
  };

  const handleUpdateRoles = async (id: string, roleIds: string[]) => {
    await rolesPermissionsService.updateCollaboratorRoles(id, roleIds);
    await fetchData();
  };

  const handleUpdateLocations = async (id: string, data: any) => {
    await rolesPermissionsService.updateCollaboratorLocations(id, data);
    await fetchData();
  };

  const handleUpgradePlan = () => {
    alert('Upgrade Plan: Requesting additional collaborator seat packs from Sovereign Cloud Billing.');
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <CollaboratorsTable
            collaborators={collaborators}
            seats={seats}
            availableRoles={availableRoles}
            onInvite={handleInvite}
            onRemove={handleRemove}
            onUpdateRoles={handleUpdateRoles}
            onUpdateLocations={handleUpdateLocations}
            onUpgradePlan={handleUpgradePlan}
            onNavigateToManageRoles={() => navigate('/settings/roles-permissions/manage-roles')}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default RolesPermissionsPage;
