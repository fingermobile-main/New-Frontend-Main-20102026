import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/MasterLoansQrConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-loans-qr-console">Loans QR Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import LoansQrMasterConsolePage from './LoansQrMasterConsolePage';

describe('LoansQrMasterConsolePage', () => {
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
        <LoansQrMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-loans-qr-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Loans QR Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Loans/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Loans/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

