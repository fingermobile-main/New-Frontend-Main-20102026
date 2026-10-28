import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RolesPermissionsPage from './RolesPermissionsPage';

jest.mock('../../../services/rolesPermissionsService', () => ({
  __esModule: true,
  default: {
    getCollaborators: jest.fn().mockResolvedValue({
      collaborators: [
        {
          id: 'collab-1',
          name: 'Chief Architect',
          email: 'architect@fingermobile.protocol',
          role: 'Administrator',
          roles: [
            { id: 'role-admin', name: 'Administrator' }
          ],
          roleIds: ['role-admin'],
          status: 'active',
          invitedAt: '2026-01-01',
          avatarUrl: 'https://avatar.test'
        }
      ],
      seats: {
        totalSeats: 10,
        usedSeats: 1,
        availableSeats: 9,
        canUpgrade: true
      }
    }),
    getRoles: jest.fn().mockResolvedValue({
      roles: [
        {
          id: 'role-admin',
          name: 'Administrator',
          description: 'Full admin access',
          type: 'custom',
          badgeText: 'Admin',
          category: 'Operations',
          permissionsCount: 20,
          activeCollaboratorsCount: 1,
          isSystemRole: false,
          permissionIds: ['perm-all']
        }
      ]
    }),
    inviteCollaborator: jest.fn().mockResolvedValue({ success: true }),
    removeCollaborator: jest.fn().mockResolvedValue({ success: true }),
    updateCollaboratorRoles: jest.fn().mockResolvedValue({ success: true }),
    updateCollaboratorLocations: jest.fn().mockResolvedValue({ success: true })
  }
}));

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'usr-1', username: 'SuperAdmin', role: 'admin' },
    isAuthenticated: true
  })
}));

jest.mock('../../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership Verified</div>
}));

describe('RolesPermissionsPage', () => {
  it('renders collaborators management, seat allocation, and platform ownership', async () => {
    render(
      <MemoryRouter>
        <RolesPermissionsPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('platform-ownership-card')).toBeInTheDocument();
    expect(await screen.findByText(/Chief Architect/i)).toBeInTheDocument();
    expect(screen.getByText(/Roles & Collaborators Governance/i)).toBeInTheDocument();
  });
});
