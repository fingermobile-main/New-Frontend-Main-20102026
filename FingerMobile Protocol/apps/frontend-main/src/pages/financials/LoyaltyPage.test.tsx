import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoyaltyPage from './LoyaltyPage';

// Mock AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    member: { id: 'usr-1', loyaltyPoints: 250 },
  }),
}));

// Mock AppContext
jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

// Mock MainLayout
jest.mock('../../components/layout/MainLayout', () => {
  return function MockMainLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="main-layout">{children}</div>;
  };
});

// Mock apiService
jest.mock('../../services/apiService', () => ({
  apiService: {
    get: jest.fn().mockResolvedValue({
      data: {
        points: 250,
        tier: 'Bronze',
        rewards: [
          { id: '1', title: '10% Discount', description: 'Discount perk', points_cost: 100 }
        ],
        history: []
      }
    }),
    post: jest.fn().mockResolvedValue({ data: { success: true } })
  },
}));

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = ['Trophy', 'Award', 'Gift', 'Wallet'];
  const mockIcons: Record<string, any> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={`icon-${name.toLowerCase()}`} {...props} />;
  });
  return mockIcons;
});

// Mock local icons
jest.mock('../../icons', () => ({
  GiftIcon: (props: any) => <span data-testid="icon-gift" {...props} />,
  SparklesIcon: (props: any) => <span data-testid="icon-sparkles" {...props} />,
  CheckCircleIcon: (props: any) => <span data-testid="icon-check" {...props} />,
}));

describe('LoyaltyPage Mobile & Responsive Suite', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <LoyaltyPage />
      </BrowserRouter>
    );
  };

  it('renders the loyalty tier header and points balance', () => {
    renderComponent();
    expect(screen.getByText(/You are a Bronze Member!/i)).toBeInTheDocument();
    expect(screen.getByText(/loyalty points available/i)).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with touch targets', () => {
    renderComponent();
    const dock = screen.getByTestId('loyalty-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tier/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rewards/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /referrals/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /finance/i })).toBeInTheDocument();
  });

  it('renders reward redemption cards with touch target buttons', () => {
    renderComponent();
    expect(screen.getByText('Redeem Rewards')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /redeem/i }).length).toBeGreaterThan(0);
  });
});

