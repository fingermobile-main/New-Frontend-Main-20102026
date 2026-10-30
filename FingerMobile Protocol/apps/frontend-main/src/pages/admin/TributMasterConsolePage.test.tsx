import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/MasterTributConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-tribut-console">Tribut Master Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import TributMasterConsolePage from './TributMasterConsolePage';

describe('TributMasterConsolePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders Tribut console and quick dock', () => {
    render(
      <MemoryRouter>
        <TributMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-tribut-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Tribut Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Pins/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Pins/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});
