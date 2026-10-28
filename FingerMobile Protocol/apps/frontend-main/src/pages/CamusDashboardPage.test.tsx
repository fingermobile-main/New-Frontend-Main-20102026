import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CamusDashboardPage from './CamusDashboardPage';

// Mock contexts
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 5000,
    showToast: jest.fn(),
  }),
}));

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    member: { id: 'test-student', name: 'StudentTester' },
    user: { id: 'test-student', name: 'StudentTester' },
    isAuthenticated: true,
  }),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Ownership</div>,
}));

jest.mock('../components/InstructorDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="instructor-dashboard">Instructor</div>,
}));

jest.mock('../components/camus/CamusAdminDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="camus-admin-dashboard">Admin</div>,
}));

describe('CamusDashboardPage Mobile Suite', () => {
  it('renders student welcome header and workspace mode', () => {
    render(
      <BrowserRouter>
        <CamusDashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/LMS Workspace Mode:/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile navigation quick dock controls', () => {
    render(
      <BrowserRouter>
        <CamusDashboardPage />
      </BrowserRouter>
    );

    expect(screen.getAllByRole('button', { name: /Courses/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Certs/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Live/i }).length).toBeGreaterThan(0);
  });
});
