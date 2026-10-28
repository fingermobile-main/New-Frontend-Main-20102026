import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/MasterGamingSuperViConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-gaming-super-vi-console">Gaming Super-VI Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import { GamingSuperViMasterConsolePage } from './GamingSuperViMasterConsolePage';

describe('GamingSuperViMasterConsolePage', () => {
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
        <GamingSuperViMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-gaming-super-vi-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Gaming Super-VI Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Gaming/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Gaming/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

