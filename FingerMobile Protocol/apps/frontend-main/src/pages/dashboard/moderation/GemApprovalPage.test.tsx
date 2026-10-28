import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GemApprovalPage from './GemApprovalPage';

// Mock AppContext
jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

// Mock moderationAdminService
jest.mock('../../../services/moderationAdminService', () => ({
  getCategoryItems: jest.fn().mockResolvedValue([
    {
      id: 'gem-sub-1',
      reported_by: 'user-1',
      reporter_username: 'alice_creator',
      reason: 'Top Community Contributor Reward',
      description: 'Created 25+ featured posts in Community Hub',
      created_at: new Date().toISOString()
    }
  ]),
  approveCategoryItem: jest.fn().mockResolvedValue({ success: true }),
  rejectCategoryItem: jest.fn().mockResolvedValue({ success: true })
}));

// Mock gemsService
jest.mock('../../../services/gemsService', () => ({
  awardGems: jest.fn().mockResolvedValue({ success: true })
}));

// Mock PlatformOwnershipCard
jest.mock('../../../components/dashboard/PlatformOwnershipCard', () => () => (
  <div data-testid="platform-ownership-card">Platform Ownership</div>
));

describe('GemApprovalPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <GemApprovalPage />
      </BrowserRouter>
    );

  it('renders gem approval queue header and pending submissions', async () => {
    renderComponent();
    expect(screen.getByText(/Gem Award & Approval Queue/i)).toBeInTheDocument();
    expect(await screen.findByText('Top Community Contributor Reward')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /approve & award/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reject request/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^queue$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^refresh$/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^gems hub$/i }).length).toBeGreaterThanOrEqual(1);
  });
});
