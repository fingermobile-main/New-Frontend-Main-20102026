import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReportsPage from './ReportsPage';

jest.mock('../../components/Header', () => () => <div data-testid="header" />);
jest.mock('../../components/Footer', () => () => <div data-testid="footer" />);

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../services/adminOperationsService', () => ({
  adminOperationsService: {
    getPlatformStats: jest.fn().mockResolvedValue({
      users: 1200,
      activeUsers: 850,
      revenue: 45000,
      posts: 3200,
    }),
  },
}));

jest.mock('../../services/moderationAdminService', () => ({
  moderationAdminService: {
    getQueue: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

describe('ReportsPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders reports analytics page and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <ReportsPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Reports & Analytical Intelligence/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Refresh/i }).length).toBeGreaterThan(0);
  });
});
