import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WalletAndPayPage from './WalletAndPayPage';
import { useAppContext } from '../contexts/AppContext';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('WalletAndPayPage Mobile Optimization', () => {
  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      ficBalance: 1200,
      openModal: jest.fn(),
      showToast: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders wallet & pay header and balance overview', () => {
    render(
      <MemoryRouter>
        <WalletAndPayPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Wallet & Pay')).toBeInTheDocument();
    expect(screen.getByText('Balance Overview')).toBeInTheDocument();
    expect(screen.getByText(/1,200/)).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <WalletAndPayPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Fund Wallet')).toBeInTheDocument();
    expect(screen.getByLabelText('Withdraw Wallet')).toBeInTheDocument();
    expect(screen.getByLabelText('Gift Cards')).toBeInTheDocument();
    expect(screen.getByLabelText('Pay Links')).toBeInTheDocument();
  });
});
