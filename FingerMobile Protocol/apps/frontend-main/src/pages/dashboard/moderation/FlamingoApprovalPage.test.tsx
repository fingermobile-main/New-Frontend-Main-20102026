import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FlamingoApprovalPage from './FlamingoApprovalPage';

const mockFlamingoItems = [
  {
    id: 'flam-101',
    content_id: 'outfit-990',
    reason: 'Luxury Velvet Blazer Sizing Verification',
    description: 'High-end bespoke velvet blazer luxury cut specification.',
    created_at: '2026-10-28T10:00:00Z',
  },
];

jest.mock('../../../services/moderationAdminService', () => ({
  moderationAdminService: {
    getCategoryItems: () => Promise.resolve(mockFlamingoItems),
    approveCategoryItem: () => Promise.resolve({ success: true }),
    rejectCategoryItem: () => Promise.resolve({ success: true }),
  },
}));

jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

describe('FlamingoApprovalPage Mobile Optimization & Behavior', () => {
  it('renders flamingo moderation header, queue items and action buttons with 44px targets', async () => {
    render(
      <BrowserRouter>
        <FlamingoApprovalPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /flamingo luxury content moderation/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Luxury Velvet Blazer Sizing Verification/i)).toBeInTheDocument();
    });

    const approveBtn = screen.getByRole('button', { name: /approve asset/i });
    expect(approveBtn.className).toContain('min-h-[44px]');
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', async () => {
    render(
      <BrowserRouter>
        <FlamingoApprovalPage />
      </BrowserRouter>
    );

    const mobileDock = screen.getByRole('navigation', { name: /flamingo approval mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});
