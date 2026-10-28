import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContentCommunityDashboardPage from './ContentCommunityDashboardPage';

// Mock MainLayout
jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

// Mock PlatformOwnershipCard
jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>
}));

describe('ContentCommunityDashboardPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ContentCommunityDashboardPage />
      </BrowserRouter>
    );

  it('renders dashboard title and description correctly', () => {
    renderComponent();
    expect(screen.getByText('Community Insights')).toBeInTheDocument();
    expect(
      screen.getByText(/Monitor engagement, top contributors, and trending discussions/i)
    ).toBeInTheDocument();
  });

  it('renders key metrics and section headers', () => {
    renderComponent();
    expect(screen.getByText('Trending Discussions')).toBeInTheDocument();
    expect(screen.getByText('Top Contributors')).toBeInTheDocument();
    expect(screen.getByText('Active Members')).toBeInTheDocument();
    expect(screen.getByText('Total Discussions')).toBeInTheDocument();
    expect(screen.getByText('Community Health')).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /insights/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /trends/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /top/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guilds/i })).toBeInTheDocument();
  });
});
