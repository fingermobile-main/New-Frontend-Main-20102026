import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyWalletPage from './MyWalletPage';
import { enhancedWalletService } from '../../services/enhancedWalletService';

// Mock enhancedWalletService
jest.mock('../../services/enhancedWalletService', () => ({
  enhancedWalletService: {
    getWallet: jest.fn().mockResolvedValue({
      ficBalance: 12000,
      storeCreditBalance: 3000,
      stakeBalance: 600
    }),
    getEarningDistributions: jest.fn().mockResolvedValue([
      {
        id: 'dist-1',
        memberId: 'mem-1',
        grossEarning: 1000,
        memberRetained: 450,
        storeCredit: 250,
        stakeAmount: 50,
        platformRetained: 250,
        earningType: 'ADS',
        distributionDate: '2026-01-01T00:00:00Z',
        txHash: '0x123abc'
      }
    ]),
    getStakeInvestments: jest.fn().mockResolvedValue([]),
    spendStoreCredit: jest.fn().mockResolvedValue({ success: true, message: 'Spent' }),
    distributeEarnings: jest.fn().mockResolvedValue({
      success: true,
      distribution: {
        memberRetained: 450,
        storeCredit: 250,
        stakeAmount: 50,
        platformRetained: 250
      }
    })
  }
}));

describe('MyWalletPage Mobile Optimization Tests', () => {
  const renderPage = () => {
    return render(
      <BrowserRouter>
        <MyWalletPage />
      </BrowserRouter>
    );
  };

  it('renders multi-balance sovereign wallet header and cards', async () => {
    renderPage();
    expect(screen.getByText('Multi-Balance Sovereign Wallet')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('12,000')).toBeInTheDocument();
      expect(screen.getByText('3,000')).toBeInTheDocument();
    });
  });

  it('renders mobile sovereign navigation quick dock', () => {
    renderPage();
    const dock = screen.getByTestId('my-wallet-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByText('Store')).toBeInTheDocument();
    expect(screen.getByText('Vault')).toBeInTheDocument();
    expect(screen.getByText('Simulate')).toBeInTheDocument();
  });

  it('interacts with simulate 4-part split modal', () => {
    renderPage();
    const simBtns = screen.getAllByRole('button', { name: /simulate/i });
    expect(simBtns.length).toBeGreaterThan(0);
    fireEvent.click(simBtns[0]);
    expect(screen.getByText('Simulate 4-Part Earning Distribution')).toBeInTheDocument();
  });
});
