import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ManageRolesPage from './ManageRolesPage';
import SiteMemberAccessPage from './SiteMemberAccessPage';

jest.mock('../../../services/rolesPermissionsService', () => ({
  __esModule: true,
  default: {
    getRoles: jest.fn().mockResolvedValue({
      roles: [
        {
          id: 'role-1',
          name: 'Super Admin',
          description: 'Full platform management permissions',
          type: 'platform',
          category: 'Platform Admin',
          badgeText: 'Owner',
          permissionsCount: 28,
          activeCollaboratorsCount: 2,
          isSystemRole: true,
          permissionIds: ['perm-all']
        }
      ]
    }),
    getPermissions: jest.fn().mockResolvedValue([
      { id: 'perm-1', name: 'Manage Users', code: 'users.manage', category: 'Security' }
    ]),
    getMemberAccessOverview: jest.fn().mockResolvedValue({
      memberRoles: [
        {
          id: 'mrole-1',
          name: 'Founding Member',
          color: 'indigo',
          assignedMembersCount: 15,
          isDefault: true,
          type: 'standard',
          accessLevel: 'full'
        }
      ],
      memberPages: [
        {
          id: 'mpage-1',
          title: 'Community Enclave',
          slug: '/community',
          category: 'public',
          allowedRoleIds: ['mrole-1']
        }
      ]
    }),
    createRole: jest.fn().mockResolvedValue({ success: true }),
    deleteRole: jest.fn().mockResolvedValue({ success: true }),
    createMemberRole: jest.fn().mockResolvedValue({ success: true }),
    deleteMemberRole: jest.fn().mockResolvedValue({ success: true }),
    updatePagePermissions: jest.fn().mockResolvedValue({ success: true })
  }
}));

jest.mock('../../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership Verified</div>
}));

describe('Roles Sub-Directory Pages', () => {
  it('renders ManageRolesPage with platform ownership card and role content', async () => {
    render(
      <MemoryRouter>
        <ManageRolesPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('platform-ownership-card')).toBeInTheDocument();
    expect(await screen.findByText(/Super Admin/i)).toBeInTheDocument();
  });

  it('renders SiteMemberAccessPage with membership roles and page access controls', async () => {
    render(
      <MemoryRouter>
        <SiteMemberAccessPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('platform-ownership-card')).toBeInTheDocument();
    expect(await screen.findByText(/Founding Member/i)).toBeInTheDocument();
  });
});
