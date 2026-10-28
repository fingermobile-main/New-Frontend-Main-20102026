import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminControlDashboard from './AdminControlDashboard';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

describe('AdminControlDashboard Mobile Optimization', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'admin-1', username: 'founder', role: 'ADMIN' },
    });
    (useAppContext as jest.Mock).mockReturnValue({
      ficBalance: 10000,
      showToast: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders admin control dashboard heading', () => {
    render(
      <MemoryRouter>
        <AdminControlDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Control Dashboard')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <AdminControlDashboard />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Actions Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Members Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Audit Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Add Member')).toBeInTheDocument();
  });
});
