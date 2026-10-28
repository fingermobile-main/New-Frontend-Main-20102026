import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FranchiseManagementPage from './FranchiseManagementPage';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../services/adminOperationsService', () => ({
  __esModule: true,
  default: {
    getFranchises: jest.fn().mockResolvedValue([
      {
        id: 'fr-1',
        name: 'Lagos Island Flagship',
        code: 'FR-LOS-01',
        region: 'West Africa (Lagos)',
        status: 'active',
        active_terminals: 12,
        royalty_pct: 8.5,
      },
    ]),
  },
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

describe('FranchiseManagementPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders franchise management console and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <FranchiseManagementPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Franchise & Terminal Operations Console/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /New/i }).length).toBeGreaterThan(0);
  });
});
