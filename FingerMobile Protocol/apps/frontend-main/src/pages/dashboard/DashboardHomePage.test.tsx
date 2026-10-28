import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    ficBalance: 12000,
  }),
}));

jest.mock('../../contexts/Web3Context', () => ({
  useWeb3: () => ({
    walletAddress: '0x123...456',
    balance: 2450,
  }),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

jest.mock('../../components/StatCard', () => {
  return function MockStatCard({ title }: { title: string }) {
    return <div data-testid="stat-card">{title}</div>;
  };
});

jest.mock('../../components/TrendCard', () => {
  return function MockTrendCard({ trend }: { trend: any }) {
    return <div data-testid="trend-card">{trend.title}</div>;
  };
});

jest.mock('../../components/PostCard', () => {
  return function MockPostCard({ post }: { post: any }) {
    return <div data-testid="post-card">{post.title || post.content}</div>;
  };
});

import DashboardHomePage from './DashboardHomePage';

describe('DashboardHomePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders creator dashboard and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <DashboardHomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Creator Dashboard/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Create/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Upload/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Monetize/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
