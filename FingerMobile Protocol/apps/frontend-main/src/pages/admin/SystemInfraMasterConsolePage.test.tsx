import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/MasterSystemInfraConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-system-infra-console">System Infra Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import { SystemInfraMasterConsolePage } from './SystemInfraMasterConsolePage';

describe('SystemInfraMasterConsolePage', () => {
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
        <SystemInfraMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-system-infra-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /System Infra Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Infra/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Infra/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

