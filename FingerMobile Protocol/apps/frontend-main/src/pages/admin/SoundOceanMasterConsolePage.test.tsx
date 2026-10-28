import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/MasterSoundOceanConsole', () => ({
  MasterSoundOceanConsole: () => <div data-testid="master-sound-ocean-console">Sound Ocean Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import SoundOceanMasterConsolePage from './SoundOceanMasterConsolePage';

describe('SoundOceanMasterConsolePage', () => {
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
        <SoundOceanMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-sound-ocean-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sound Ocean Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Ocean/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Ocean/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

