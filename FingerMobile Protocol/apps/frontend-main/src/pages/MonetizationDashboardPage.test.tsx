import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MonetizationDashboardPage from './MonetizationDashboardPage';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    member: { id: 'member-1', username: 'creator_pro' }
  })
}));

jest.mock('../contexts/MonetizationContext', () => ({
  useMonetization: () => ({
    loading: false,
    error: null,
    refreshEligibility: jest.fn()
  })
}));

jest.mock('../components/dashboard/MonetizationDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="monetization-dashboard">Monetization Dashboard Mock</div>
}));

jest.mock('../components/dashboard/GemTransactions', () => ({
  __esModule: true,
  default: () => <div data-testid="gem-transactions">Gem Transactions Mock</div>
}));

jest.mock('../components/dashboard/EarningsAnalytics', () => ({
  __esModule: true,
  default: () => <div data-testid="earnings-analytics">Earnings Analytics Mock</div>
}));

jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership Card Mock</div>
}));

describe('MonetizationDashboardPage Component', () => {
  it('renders Monetization Dashboard heading and refresh button', () => {
    render(
      <BrowserRouter>
        <MonetizationDashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Monetization Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh Data/i })).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', () => {
    render(
      <BrowserRouter>
        <MonetizationDashboardPage />
      </BrowserRouter>
    );

    const nav = screen.getByRole('navigation', { name: /Monetization Dashboard Mobile Navigation/i });
    expect(nav).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /^Overview$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Academy$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Payouts$/i })).toBeInTheDocument();
  });
});

