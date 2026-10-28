import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PaymentPayoutsPage from './PaymentPayoutsPage';

// Mock AppContext
jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 25000,
    payoutRequests: [],
    handleInitiatePayout: jest.fn(),
    showToast: jest.fn(),
  }),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = [
    'Building',
    'CreditCard',
    'Landmark',
    'ShieldAlert',
    'AlertCircle',
    'CheckCircle2',
    'Clock',
    'ArrowLeft',
    'DollarSign',
    'Wallet',
    'FileText',
    'Check',
    'ChevronRight',
    'ExternalLink',
    'ArrowDownRight',
    'ArrowUpRight',
    'Sparkles',
  ];
  const mockIcons: Record<string, any> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={`icon-${name.toLowerCase()}`} {...props} />;
  });
  return mockIcons;
});

// Mock child components
jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnershipCard() {
    return <div data-testid="platform-ownership-card">Platform Ownership Card</div>;
  };
});

jest.mock('../../components/AnimatedAvatar', () => {
  return function MockAnimatedAvatar({ altText }: { altText?: string }) {
    return <div data-testid="animated-avatar">{altText || 'Avatar'}</div>;
  };
});

describe('PaymentPayoutsPage Mobile & Responsive Suite', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <PaymentPayoutsPage />
      </BrowserRouter>
    );
  };

  it('renders the payouts page with header and settlement information', () => {
    renderComponent();
    expect(screen.getByText(/Payment Payouts & Settlement Gateway/i)).toBeInTheDocument();
    expect(screen.getByText(/Settlement Vault/i)).toBeInTheDocument();
  });

  it('renders mobile navigation quick dock with accessible buttons', () => {
    renderComponent();
    const dock = screen.getByTestId('payouts-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /withdraw/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pending/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /vault/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /finance/i })).toBeInTheDocument();
  });

  it('renders the settlement form with input fields and submit button', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('e.g. 500')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0123456789')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit payout request/i })).toBeInTheDocument();
  });
});
