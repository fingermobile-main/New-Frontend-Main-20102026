import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../components/dashboard/PartnerHouseWidget', () => {
  return function MockPartnerHouse() {
    return <div data-testid="partner-house-widget" />;
  };
});

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
        name: 'Summer Splash Ads',
        status: 'active',
        budget: 500,
        spent: 120,
        impressions: 4500,
        clicks: 340,
        format: 'banner',
      },
    ]),
    updateCampaignStatus: jest.fn().mockResolvedValue({}),
  },
}));

import DashboardAdvertisingPage from './AdvertisingPage';

describe('AdvertisingPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders advertising management page and mobile quick dock', async () => {
    render(
      <MemoryRouter>
        <DashboardAdvertisingPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Advertising Management/i)).toBeInTheDocument();
    expect(screen.getByText(/All Platform Campaigns/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Campaigns/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Canary Studio/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Launch/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
