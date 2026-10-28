import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ModerationPage from './ModerationPage';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    handleApproveContent: jest.fn(),
    handleRemoveContent: jest.fn(),
  }),
}));

jest.mock('../../services/moderationAdminService', () => ({
  moderationAdminService: {
    getQueue: jest.fn().mockResolvedValue([
      {
        id: 'mod-q-101',
        content_id: 'post-9021',
        content_type: 'post',
        reason: 'Suspicious External Phishing Link',
        priority: 'high',
        status: 'pending',
        reported_by: 'sentinel-ai',
        reporter_username: 'Guardian Sentinel Node #4',
        contentPreview: 'Claim free tokens immediately',
        created_at: '2026-10-28T12:00:00Z',
      },
    ]),
    approveItem: jest.fn().mockResolvedValue({}),
    removeItem: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock('../../components/ownership/PlatformOwnershipCard', () => ({
  PlatformOwnershipCard: () => <div data-testid="platform-ownership-card" />,
}));

describe('ModerationPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders moderation page and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <ModerationPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Content Moderation Queue/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Refresh/i }).length).toBeGreaterThan(0);
  });
});
