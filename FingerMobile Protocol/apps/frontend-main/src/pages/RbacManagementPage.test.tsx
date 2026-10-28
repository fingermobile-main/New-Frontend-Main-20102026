import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    ficBalance: 2500,
  }),
}));

jest.mock('../hooks/useRbacData', () => ({
  __esModule: true,
  default: () => ({
    loading: false,
    error: null,
    refreshData: jest.fn(),
    data: {
      roles: [
        { id: 'role-1', name: 'SuperAdmin', description: 'Full system privileges' }
      ],
      departments: [
        { id: 'dept-1', name: 'Security Engineering' }
      ],
      franchiseLocations: [
        { id: 'loc-1', name: 'West Africa', children: [] }
      ]
    }
  })
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../components/dashboard/RbacDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="rbac-dashboard">RBAC Dashboard Component</div>
}));

jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership Card</div>
}));

import RbacManagementPage from './RbacManagementPage';

describe('RbacManagementPage', () => {
  it('renders RBAC title and dashboard', () => {
    render(
      <BrowserRouter>
        <RbacManagementPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /RBAC & Scoped Permissions Center/i })).toBeInTheDocument();
    expect(screen.getByTestId('rbac-dashboard')).toBeInTheDocument();
  });

  it('switches views and opens assignment modal through quick dock', () => {
    render(
      <BrowserRouter>
        <RbacManagementPage />
      </BrowserRouter>
    );

    const rolesBtns = screen.getAllByRole('button', { name: /Roles/i });
    expect(rolesBtns.length).toBeGreaterThan(0);
    fireEvent.click(rolesBtns[0]);

    const assignBtns = screen.getAllByRole('button', { name: /Assign/i });
    expect(assignBtns.length).toBeGreaterThan(0);
    fireEvent.click(assignBtns[0]);
  });
});

