import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/UnifiedFinancialTreasuryConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="unified-financial-treasury-console">Financial Treasury Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import { FinancialTreasuryMasterConsolePage } from './FinancialTreasuryMasterConsolePage';

describe('FinancialTreasuryMasterConsolePage', () => {
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
        <FinancialTreasuryMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('unified-financial-treasury-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Financial Treasury Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Treasury/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Treasury/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

