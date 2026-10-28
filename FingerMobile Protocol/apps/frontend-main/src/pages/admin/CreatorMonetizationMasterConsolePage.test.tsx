import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/MasterCreatorMonetizationConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-creator-monetization-console">Creator Monetization Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import { CreatorMonetizationMasterConsolePage } from './CreatorMonetizationMasterConsolePage';

describe('CreatorMonetizationMasterConsolePage', () => {
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
        <CreatorMonetizationMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-creator-monetization-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Creator Monetization Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Creators/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Monetization/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

