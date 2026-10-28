import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CanaryAdsPage from './CanaryAdsPage';

// Mock contexts and hooks
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 7500,
    showToast: jest.fn(),
  }),
}));

jest.mock('../hooks/useAds', () => ({
  useAds: () => ({
    ads: [],
    loading: false,
    fetchAds: jest.fn(),
  }),
}));

jest.mock('../services/advertisingService', () => ({
  advertisingService: {
    getCampaigns: jest.fn().mockResolvedValue([]),
    getMarketingStats: jest.fn().mockResolvedValue({
      reach: '500,000+',
      totalClicks: 22000,
      activeCampaigns: 4,
      totalSpent: 1250,
    }),
    toggleCampaignStatus: jest.fn(),
    deleteCampaign: jest.fn(),
  },
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('CanaryAdsPage Mobile Suite', () => {
  it('renders advertising engine hero and metric highlights', () => {
    render(
      <BrowserRouter>
        <CanaryAdsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Canary Advertising Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Impressions/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile navigation quick dock controls', () => {
    render(
      <BrowserRouter>
        <CanaryAdsPage />
      </BrowserRouter>
    );

    expect(screen.getAllByRole('button', { name: /Placements/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Campaigns/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Analytics/i }).length).toBeGreaterThan(0);
  });
});
