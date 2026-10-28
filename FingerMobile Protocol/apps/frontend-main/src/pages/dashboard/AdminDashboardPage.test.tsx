import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

jest.mock('../../services/adminOperationsService', () => ({
  adminOperationsService: {
    getDashboardStats: jest.fn().mockResolvedValue({
      totalUsers: 14000,
    }),
  },
}));

import AdminDashboardPage from './AdminDashboardPage';

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders admin governance console and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Admin & Governance Console/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Overview/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Members/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Add/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
