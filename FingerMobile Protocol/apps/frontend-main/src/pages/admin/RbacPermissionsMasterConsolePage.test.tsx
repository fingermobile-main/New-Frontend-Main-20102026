import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/MasterRbacPermissionsConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-rbac-permissions-console">RBAC Permissions Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import { RbacPermissionsMasterConsolePage } from './RbacPermissionsMasterConsolePage';

describe('RbacPermissionsMasterConsolePage', () => {
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
        <RbacPermissionsMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-rbac-permissions-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /RBAC Permissions Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search RBAC/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload RBAC/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

