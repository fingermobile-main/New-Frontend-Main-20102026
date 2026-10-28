import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/MasterMiiStoriesConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-mii-stories-console">Mii-Stories Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import MiiStoriesMasterConsolePage from './MiiStoriesMasterConsolePage';

describe('MiiStoriesMasterConsolePage', () => {
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
        <MiiStoriesMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-mii-stories-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Mii-Stories Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Stories/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Stories/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

