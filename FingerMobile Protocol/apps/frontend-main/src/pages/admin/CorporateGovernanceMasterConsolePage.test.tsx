import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/MasterCorporateGovernanceConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-corporate-governance-console">Corporate Governance Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import { CorporateGovernanceMasterConsolePage } from './CorporateGovernanceMasterConsolePage';

describe('CorporateGovernanceMasterConsolePage', () => {
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
        <CorporateGovernanceMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-corporate-governance-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Corporate Governance Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Governance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Governance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

