import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoleManagementPage from './RoleManagementPage';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../services/rbacService', () => ({
  __esModule: true,
  default: {
    getRoles: jest.fn().mockResolvedValue([
      {
        id: 'role-1',
        name: 'SuperAdmin',
        title: 'Super Administrator',
        description: 'Sovereign root authority',
        level: 100,
        is_system: true,
      },
    ]),
    getPermissions: jest.fn().mockResolvedValue([]),
    createRole: jest.fn().mockResolvedValue({ id: 'r-2', name: 'NewRole' }),
  },
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

describe('RoleManagementPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders role authority matrix and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <RoleManagementPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Role & Authority Matrix/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Role/i }).length).toBeGreaterThan(0);
  });
});
