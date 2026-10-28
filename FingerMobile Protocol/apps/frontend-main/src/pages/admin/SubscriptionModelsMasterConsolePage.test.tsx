import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/SubscriptionModelsConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="subscription-models-console">Subscription Models Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import SubscriptionModelsMasterConsolePage from './SubscriptionModelsMasterConsolePage';

describe('SubscriptionModelsMasterConsolePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders console and quick dock', () => {
    render(
      <MemoryRouter>
        <SubscriptionModelsMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('subscription-models-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Subscription Models Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Subscriptions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Subscriptions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

