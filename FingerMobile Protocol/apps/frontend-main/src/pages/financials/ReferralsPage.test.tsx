import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ReferralsPage from './ReferralsPage';

// Mock AppContext
jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

// Mock apiService
jest.mock('../../services/apiService', () => ({
  apiService: {
    get: jest.fn().mockResolvedValue({
      data: {
        referralCode: 'FINGER-TEST',
        referralLink: 'https://fingermobileprotocol.com/join?ref=FINGER-TEST',
        totalReferrals: 12,
        activeReferrals: 8,
        totalEarnedFIC: 600,
        pendingEarningsFIC: 150,
        referrals: [
          {
            id: 'ref-1',
            referredUsername: 'alice_creator',
            referredDisplayName: 'Alice In Tech',
            status: 'active',
            rewardAmount: 50,
            rewardStatus: 'paid',
            date: '2026-10-20'
          }
        ]
      }
    }),
  },
}));

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = [
    'Users',
    'Gift',
    'Share2',
    'Copy',
    'CheckCircle2',
    'TrendingUp',
    'Sparkles',
    'Wallet',
    'Link',
    'ShieldCheck',
  ];
  const mockIcons: Record<string, any> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={`icon-${name.toLowerCase()}`} {...props} />;
  });
  return mockIcons;
});

describe('ReferralsPage Mobile & Responsive Suite', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ReferralsPage />
      </BrowserRouter>
    );
  };

  it('renders the referrals page header and key bounty details', () => {
    renderComponent();
    expect(screen.getByText(/Referrals & Sovereign Affiliate Network/i)).toBeInTheDocument();
    expect(screen.getByText(/50 FIC Bounty Active/i)).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with touch targets', () => {
    renderComponent();
    const dock = screen.getByTestId('referrals-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^code$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rewards/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /finance/i })).toBeInTheDocument();
  });

  it('renders the referral link and copy action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy code/i })).toBeInTheDocument();
  });
});
