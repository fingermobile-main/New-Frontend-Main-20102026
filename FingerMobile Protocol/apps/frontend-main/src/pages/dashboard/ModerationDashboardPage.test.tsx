import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ModerationDashboardPage from './ModerationDashboardPage';

// Mock AppContext
jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

// Mock moderationAdminService
jest.mock('../../services/moderationAdminService', () => ({
  moderationAdminService: {
    getQueue: jest.fn().mockResolvedValue([]),
    getStats: jest.fn().mockResolvedValue({
      pending: 2,
      approved: 18,
      rejected: 4,
      highPriorityPending: 1,
      avgReviewTimeSeconds: 42
    }),
    getReports: jest.fn().mockResolvedValue([]),
    getCategoryItems: jest.fn().mockResolvedValue([])
  }
}));

// Mock PlatformOwnershipCard
jest.mock('../../components/ownership/PlatformOwnershipCard', () => ({
  PlatformOwnershipCard: () => <div data-testid="platform-ownership-card">Platform Ownership</div>
}));

describe('ModerationDashboardPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ModerationDashboardPage />
      </BrowserRouter>
    );

  it('renders moderation dashboard header, stats, and tabs', () => {
    renderComponent();
    expect(screen.getByText('Content Moderation Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh queue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^pending review$/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^queue$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^reports$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^flagged$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^rules$/i })).toBeInTheDocument();
  });
});

