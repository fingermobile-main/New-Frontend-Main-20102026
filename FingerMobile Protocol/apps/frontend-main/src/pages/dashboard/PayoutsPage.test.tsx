import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PayoutsPage from './PayoutsPage';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    payoutRequests: [],
    handleInitiatePayout: jest.fn(),
    handleProcessPayout: jest.fn(),
    showToast: jest.fn(),
  }),
}));

jest.mock('../../services/apiService', () => ({
  apiService: {
    get: jest.fn().mockResolvedValue({
      data: [
        {
          id: 'pay-1',
          memberId: 'mem-101',
          amount: 500,
          status: 'pending',
          bankName: 'Access Bank',
          accountNumber: '0123456789',
        },
      ],
    }),
    post: jest.fn().mockResolvedValue({ success: true }),
  },
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

describe('PayoutsPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders payouts page and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <PayoutsPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Initiate Manual Payout/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Refresh/i }).length).toBeGreaterThan(0);
  });
});
