import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/MasterSoundRiverConsole', () => ({
  MasterSoundRiverConsole: () => <div data-testid="master-sound-river-console">Sound River Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import SoundRiverMasterConsolePage from './SoundRiverMasterConsolePage';

describe('SoundRiverMasterConsolePage', () => {
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
        <SoundRiverMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-sound-river-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sound River Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search River/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload River/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

