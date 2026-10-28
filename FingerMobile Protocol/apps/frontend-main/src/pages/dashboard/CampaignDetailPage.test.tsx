import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockAnalytics = {
  campaign: {
    id: 'c-1',
    title: 'Festival Rewards Campaign',
    status: 'active',
  },
  impressions: { total: 12000 },
  clicks: { total: 850 },
  spend: { total: 320 },
  reach: { total: 12000, data: [{ day: 'Mon', value: 100 }] },
  engagement: { total: 850, data: [{ day: 'Mon', value: 50 }] },
};

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    getCampaignDetails: jest.fn(() => Promise.resolve(mockAnalytics)),
  }),
}));

jest.mock('../../services/advertisingService', () => ({
  advertisingService: {
    getCampaignAnalytics: jest.fn(() => Promise.resolve(mockAnalytics)),
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
    render(
      <MemoryRouter initialEntries={['/dashboard/campaigns/c-1']}>
        <Routes>
          <Route path="/dashboard/campaigns/:campaignId" element={<DashboardCampaignDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading\.\.\./i)).not.toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByRole('heading', { level: 1, name: /Festival Rewards Campaign/i })).toBeInTheDocument();
    expect(screen.getByText(/Back to Campaigns Management/i)).toBeInTheDocument();
  });
});
