import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    getCampaignDetails: jest.fn().mockResolvedValue({
      campaign: {
        id: 'c-1',
        title: 'Festival Rewards Campaign',
      },
      impressions: { total: 12000 },
      clicks: { total: 850 },
      spend: { total: 320 },
      reach: { data: [{ day: 'Mon', value: 100 }] },
      engagement: { data: [{ day: 'Mon', value: 50 }] },
    }),
  }),
}));

jest.mock('../../services/advertisingService', () => ({
  advertisingService: {
    getCampaignAnalytics: jest.fn().mockResolvedValue({
      campaign: {
        id: 'c-1',
        title: 'Festival Rewards Campaign',
      },
      impressions: { total: 12000 },
      clicks: { total: 850 },
      spend: { total: 320 },
      reach: { data: [{ day: 'Mon', value: 100 }] },
      engagement: { data: [{ day: 'Mon', value: 50 }] },
    }),
  },
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

import DashboardCampaignDetailPage from './CampaignDetailPage';

describe('CampaignDetailPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders campaign detail page and mobile quick dock', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/dashboard/campaigns/c-1']}>
        <Routes>
          <Route path="/dashboard/campaigns/:campaignId" element={<DashboardCampaignDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Campaigns Management|Back to Campaigns/i)).toBeInTheDocument();
  });
});
