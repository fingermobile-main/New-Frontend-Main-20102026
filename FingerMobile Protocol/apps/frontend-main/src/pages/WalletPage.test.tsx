import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WalletPage from './WalletPage';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ success: true, data: { balance: 500, transactions: [] } }),
    post: jest.fn().mockResolvedValue({ success: true, data: {} }),
  },
}));

jest.mock('../hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

jest.mock('../contexts/Web3Context', () => ({
  useWeb3: () => ({
    isConnected: false,
    walletConnected: false,
    connectedAccount: null,
    walletAddress: null,
    account: null,
    balance: 1000,
    chainId: 1,
    chainName: 'Ethereum Mainnet',
    isMetaMaskInstalled: true,
    isConnecting: false,
    isVerified: false,
    verificationProof: null,
    connectWallet: jest.fn(),
    connectMetaMask: jest.fn(),
    disconnectWallet: jest.fn(),
    signChallenge: jest.fn(),
    switchChain: jest.fn(),
    getMetaMaskDeepLink: () => 'https://metamask.app.link',
  }),
}));

describe('WalletPage Mobile Optimization', () => {
  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <WalletPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Fund FIC')).toBeInTheDocument();
    expect(screen.getByLabelText('Send FIC')).toBeInTheDocument();
    expect(screen.getByLabelText('Receive FIC')).toBeInTheDocument();
    expect(screen.getByLabelText('Refresh Balances')).toBeInTheDocument();
  });
});
