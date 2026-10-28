import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FICVaultPage from './FICVaultPage';

// Mock enhancedWalletService
jest.mock('../services/enhancedWalletService', () => ({
  enhancedWalletService: {
    getWallet: jest.fn().mockResolvedValue({
      ficBalance: 5000,
      storeCreditBalance: 1250,
      stakeBalance: 2500
    }),
    getStakeInvestments: jest.fn().mockResolvedValue([]),
    withdrawMaturedStake: jest.fn().mockResolvedValue({ success: true, message: 'Withdrawn' })
  }
}));

describe('FICVaultPage Wrapper', () => {
  it('renders the underlying financials FicVaultPage correctly', () => {
    render(
      <BrowserRouter>
        <FICVaultPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('fic-vault-mobile-dock')).toBeInTheDocument();
  });
});
