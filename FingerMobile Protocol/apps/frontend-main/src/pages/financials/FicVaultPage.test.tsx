import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FicVaultPage from './FicVaultPage';
import { enhancedWalletService } from '../../services/enhancedWalletService';

// Mock enhancedWalletService
jest.mock('../../services/enhancedWalletService', () => ({
  enhancedWalletService: {
    getWallet: jest.fn().mockResolvedValue({
      ficBalance: 5000,
      storeCreditBalance: 1250,
      stakeBalance: 2500
    }),
    getStakeInvestments: jest.fn().mockResolvedValue([
      {
        id: 'stake-test-1',
        memberId: 'mem-1',
        amount: 2500,
        interestRate: 1.5,
        startDate: '2026-01-01T00:00:00Z',
        maturityDate: '2027-01-01T00:00:00Z',
        status: 'active',
        expectedReturn: 2537.5,
        actualReturn: 0,
        createdAt: '2026-01-01T00:00:00Z'
      }
    ]),
    withdrawMaturedStake: jest.fn().mockResolvedValue({ success: true, message: 'Withdrawn' })
  }
}));

describe('FicVaultPage Mobile Optimization Tests', () => {
  const renderPage = () => {
    return render(
      <BrowserRouter>
        <FicVaultPage />
      </BrowserRouter>
    );
  };

  it('renders FIC vault header and balances', async () => {
    renderPage();
    expect(screen.getByText(/FIC Vault & "Sleepers" Pool/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('5,000')).toBeInTheDocument();
    });
  });

  it('renders mobile sovereign navigation quick dock', () => {
    renderPage();
    const dock = screen.getByTestId('fic-vault-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByText('Stake')).toBeInTheDocument();
    expect(screen.getByText('Wallet')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
  });

  it('opens staking modal with touch controls', () => {
    renderPage();
    const stakeBtn = screen.getByText('+ Lock Sleeper Stake');
    expect(stakeBtn).toBeInTheDocument();
    fireEvent.click(stakeBtn);
    expect(screen.getByText(/Lock Tokens in "Sleepers" Pool/i)).toBeInTheDocument();
  });
});
