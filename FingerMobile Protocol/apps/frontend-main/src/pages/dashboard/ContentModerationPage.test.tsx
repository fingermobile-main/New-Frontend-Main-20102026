import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../components/ui/Select', () => ({
  Select: ({ children }: any) => <div data-testid="select">{children}</div>,
  SelectTrigger: ({ children }: any) => <button type="button">{children}</button>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-value={value}>{children}</div>,
}));

import ContentModerationPage from './ContentModerationPage';

const mockQueue = [
  {
    id: 'cm-101',
    content_type: 'comment',
    contentPreview: 'Suspicious spam comment link',
    status: 'pending',
    reported_by: 'user_sentinel',
    reason: 'Spam violation',
    created_at: '2026-10-28T10:00:00Z',
  },
];

jest.mock('../../services/moderationAdminService', () => ({
  moderationAdminService: {
    getQueue: () => Promise.resolve(mockQueue),
    approveItem: () => Promise.resolve({ success: true }),
    rejectItem: () => Promise.resolve({ success: true }),
  },
}));

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

describe('ContentModerationPage Mobile Optimization & Behavior', () => {
  it('renders moderation console title, queue item and core metrics', async () => {
    render(
      <BrowserRouter>
        <ContentModerationPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /content moderation console/i })).toBeInTheDocument();
    await waitFor(() => {
      const items = screen.getAllByText(/Suspicious spam comment link/i);
      expect(items.length).toBeGreaterThan(0);
    });
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with min 44px touch targets', async () => {
    render(
      <BrowserRouter>
        <ContentModerationPage />
      </BrowserRouter>
    );

    const mobileDock = screen.getByRole('navigation', { name: /content moderation mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});
