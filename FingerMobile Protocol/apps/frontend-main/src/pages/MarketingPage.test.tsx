import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MarketingPage from './MarketingPage';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../components/dashboard/MarketingDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="marketing-dashboard">Marketing Dashboard Mock</div>
}));

jest.mock('../services/advertisingService', () => ({
  advertisingService: {
    getCampaigns: jest.fn().mockResolvedValue([])
  }
}));

describe('MarketingPage Component', () => {
  it('renders page titles and marketing actions', () => {
    render(
      <BrowserRouter>
        <MarketingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Platform Marketing Hub/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View All Campaigns/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Canary Ad Studio/i })).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', () => {
    render(
      <BrowserRouter>
        <MarketingPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /^Hub$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Campaigns$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Studio$/i })).toBeInTheDocument();
  });
});

