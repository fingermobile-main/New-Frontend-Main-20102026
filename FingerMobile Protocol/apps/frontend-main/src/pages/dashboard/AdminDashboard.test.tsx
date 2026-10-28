import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/admin/AdminLayout', () => {
  return function MockAdminLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="admin-layout">{children}</div>;
  };
});

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

jest.mock('../../services/adminOperationsService', () => ({
  adminOperationsService: {
    getDashboardStats: jest.fn().mockResolvedValue({
      totalUsers: 14000,
      activeSessions: 9000,
      totalTransactions: 25000,
    }),
  },
}));

import AdminDashboard from './AdminDashboard';

describe('AdminDashboard', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders admin dashboard and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Platform Admin Operations/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Overview/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Members/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Users/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
