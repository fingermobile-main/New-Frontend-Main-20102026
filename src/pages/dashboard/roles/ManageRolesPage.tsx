import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import { RoleCatalogView } from '../../../components/dashboard/roles/RoleCatalogView';
import rolesPermissionsService from '../../../services/rolesPermissionsService';
import { RoleDetail, Permission } from '../../../types/roles-permissions';

export const ManageRolesPage: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<RoleDetail[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        rolesPermissionsService.getRoles(),
        rolesPermissionsService.getPermissions(),
      ]);
      setRoles(rolesRes.roles);
      setPermissions(permsRes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRole = async (data: any) => {
    await rolesPermissionsService.createRole(data);
    await fetchData();
  };

  const handleDeleteRole = async (id: string) => {
    await rolesPermissionsService.deleteRole(id);
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
          <RoleCatalogView
            roles={roles}
            permissions={permissions}
            onBack={() => navigate('/settings/roles-permissions')}
            onCreateRole={handleCreateRole}
            onDeleteRole={handleDeleteRole}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ManageRolesPage;
