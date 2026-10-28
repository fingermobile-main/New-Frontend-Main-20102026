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

jest.mock('../../services/advertisingService', () => ({
  advertisingService: {
    getCampaigns: jest.fn().mockResolvedValue([
      {
        id: 'c-1',
        title: 'Super Campaign',
        status: 'active',
        budget: '500',
        spent: '100',
      },
    ]),
    createCampaign: jest.fn().mockResolvedValue({}),
  },
}));

import DashboardCampaignsPage from './CampaignsPage';

describe('CampaignsPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders campaigns page and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <DashboardCampaignsPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Create New Campaign/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Create/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Refresh/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
