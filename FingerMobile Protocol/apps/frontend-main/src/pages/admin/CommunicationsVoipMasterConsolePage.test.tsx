import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/MasterCommunicationsVoipConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-comms-voip-console">Master Comms VoIP Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import CommunicationsVoipMasterConsolePage from './CommunicationsVoipMasterConsolePage';

describe('CommunicationsVoipMasterConsolePage', () => {
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
        <CommunicationsVoipMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-comms-voip-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Comms VoIP Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Comms/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Comms/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

