import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BadgesManagementPage from './BadgesManagementPage';

// Mock MainLayout
jest.mock('../../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

// Mock badgeService & rolesPermissionsService
jest.mock('../../../services/badgeService', () => ({
  getBadges: jest.fn().mockResolvedValue([
    { id: 'b-1', name: 'Master Creator', description: 'Awarded to top tier creators', icon: '🌟' }
  ]),
  createBadge: jest.fn(),
  updateBadge: jest.fn(),
  deleteBadge: jest.fn(),
  assignBadge: jest.fn(),
  unassignBadge: jest.fn(),
  toggleMuteMember: jest.fn(),
  getBadgeMembers: jest.fn().mockResolvedValue([])
}));

jest.mock('../../../services/rolesPermissionsService', () => ({
  getMemberPages: jest.fn().mockResolvedValue([
    { id: 'p-1', name: 'Creator Showcase', slug: 'creator-showcase' }
  ])
}));

describe('BadgesManagementPage Mobile Integration', () => {
  it('renders badges view after loading', async () => {
    render(
      <MemoryRouter>
        <BadgesManagementPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Badges/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh/i })).toBeInTheDocument();
  });
});
