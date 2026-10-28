import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunitiesMasterConsolePage from './CommunitiesMasterConsolePage';

// Mock MainLayout
jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

// Mock MasterCommunitiesConsole
jest.mock('../../components/dashboard/MasterCommunitiesConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-communities-console">Master Communities Console Content</div>
}));

// Mock PlatformOwnershipCard
jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>
}));

describe('CommunitiesMasterConsolePage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <CommunitiesMasterConsolePage />
      </BrowserRouter>
    );

  it('renders console and ownership elements correctly', () => {
    renderComponent();
    expect(screen.getByTestId('master-communities-console')).toBeInTheDocument();
    expect(screen.getByTestId('platform-ownership-card')).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^console$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^search$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^services$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^hub$/i })).toBeInTheDocument();
  });
});
