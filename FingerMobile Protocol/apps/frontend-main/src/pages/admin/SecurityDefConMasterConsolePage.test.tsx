import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/MasterSecurityDefConConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-security-defcon-console">Security DefCon Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import { SecurityDefConMasterConsolePage } from './SecurityDefConMasterConsolePage';

describe('SecurityDefConMasterConsolePage', () => {
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
        <SecurityDefConMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-security-defcon-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Security DefCon Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search DefCon/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload DefCon/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

