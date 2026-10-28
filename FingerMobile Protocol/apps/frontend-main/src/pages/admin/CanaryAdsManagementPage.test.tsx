import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CanaryAdsManagementPage from './CanaryAdsManagementPage';
import { advertisingService } from '../../services/advertisingService';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../components/layout/UniversalHeader', () => () => (
  <div data-testid="universal-header">Universal Header</div>
));

jest.mock('../../components/layout/H2AdBucket', () => () => (
  <div data-testid="h2-ad-bucket">H2 Ad Bucket</div>
));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => () => (
  <div data-testid="platform-ownership-card">Platform Ownership</div>
));

jest.mock('../../services/advertisingService', () => ({
  advertisingService: {
    getAdminQueue: jest.fn().mockResolvedValue([
      {
        id: 'ad-cr-101',
        placement: 'FEED_BANNER',
        headline: 'Super Fast Sovereign Fiber',
        description: 'Blazing fast connectivity across Nigeria',
        company_name: 'FastNet Nigeria',
        billing_email: 'billing@fastnet.ng',
        campaign_title: 'Q4 National Rollout',
        media_url: 'https://example.com/ad.jpg',
        destination_url: 'https://fastnet.ng',
        ai_policy_passed: true,
        ai_policy_score: 98,
        created_at: '2026-10-20T10:00:00Z',
      },
    ]),
    moderateCreative: jest.fn().mockResolvedValue({ success: true }),
  },
}));

describe('CanaryAdsManagementPage (Subpage Screen)', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    jest.clearAllMocks();
  });

  test('renders CanaryAdsManagementPage with queue, inspector and quick dock', async () => {
    render(<CanaryAdsManagementPage />);

    expect(screen.getByText('Canary™ Internal Ad Review Queue')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText('Super Fast Sovereign Fiber').length).toBeGreaterThan(0);
    });

    // Check Sovereign Mobile Navigation Quick Dock buttons
    const refreshBtn = screen.getByRole('button', { name: /Refresh Queue/i });
    expect(refreshBtn).toBeInTheDocument();
    fireEvent.click(refreshBtn);

    const queueBtn = screen.getByRole('button', { name: /View Queue List/i });
    expect(queueBtn).toBeInTheDocument();
    fireEvent.click(queueBtn);

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
