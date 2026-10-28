import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WalletFundingPage from './WalletFundingPage';
import { useAppContext } from '../contexts/AppContext';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('WalletFundingPage Mobile Optimization', () => {
  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      ficBalance: 250,
      showToast: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders fund wallet header and deposit forms', () => {
    render(
      <MemoryRouter>
        <WalletFundingPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Fund Your Wallet')).toBeInTheDocument();
    expect(screen.getByText('Alternative Bank')).toBeInTheDocument();
    expect(screen.getByText('Select Payment Method & Banking Rail')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <WalletFundingPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Direct Deposit')).toBeInTheDocument();
    expect(screen.getByLabelText('Send Gift')).toBeInTheDocument();
    expect(screen.getByLabelText('Create Paylink')).toBeInTheDocument();
    expect(screen.getByLabelText('Wallet Overview')).toBeInTheDocument();
  });
});
