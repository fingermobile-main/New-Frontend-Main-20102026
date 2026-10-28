import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StercsCurationDashboard from './StercsCurationDashboard';

// Mock layout & context
jest.mock('../../components/layout/MainLayout', () => ({ children }: any) => <div data-testid="main-layout">{children}</div>);
jest.mock('../../components/Toast', () => ({
  useToast: () => ({ addToast: jest.fn() })
}));
jest.mock('../../components/dashboard/PlatformOwnershipCard', () => () => <div data-testid="ownership-card">Platform Ownership Card</div>);
jest.mock('../../components/dashboard/SubscriptionModelsConsole', () => () => <div data-testid="subscription-models">Subscription Models Console</div>);

describe('StercsCurationDashboard Mobile Optimization', () => {
  it('renders curation header and title', async () => {
    render(
      <BrowserRouter>
        <StercsCurationDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/STERCS Content & Subscription Curation/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile quick dock navigation', () => {
    render(
      <BrowserRouter>
        <StercsCurationDashboard />
      </BrowserRouter>
    );

    expect(screen.getAllByRole('button', { name: /subscriptions/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /products/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /ads/i }).length).toBeGreaterThanOrEqual(1);
  });
});

