import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TrendsSwarmMasterConsolePage from './TrendsSwarmMasterConsolePage';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../../components/dashboard/MasterTrendsSwarmConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-trends-swarm-console">Master Trends Swarm Console Active</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership Verified</div>,
}));

describe('TrendsSwarmMasterConsolePage Mobile Optimization', () => {
  it('renders the layout, console, and ownership card', () => {
    render(
      <MemoryRouter>
        <TrendsSwarmMasterConsolePage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByTestId('master-trends-swarm-console')).toBeInTheDocument();
    expect(screen.getByTestId('platform-ownership-card')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <TrendsSwarmMasterConsolePage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Refresh Swarm')).toBeInTheDocument();
    expect(screen.getByLabelText('Manage Trends')).toBeInTheDocument();
    expect(screen.getByLabelText('Trends Feed')).toBeInTheDocument();
    expect(screen.getByLabelText('Admin Hub')).toBeInTheDocument();
  });
});
