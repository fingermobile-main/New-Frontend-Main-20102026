import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Web3Provider, useWeb3 } from './Web3Context';
import { AppProvider } from './AppContext';

const TestComponent = () => {
  const { isConnected, walletAddress, chainName, isMetaMaskInstalled, connectMetaMask } = useWeb3();

  return (
    <div>
      <div data-testid="is-connected">{isConnected ? 'true' : 'false'}</div>
      <div data-testid="wallet-address">{walletAddress || 'none'}</div>
      <div data-testid="chain-name">{chainName}</div>
      <div data-testid="is-installed">{isMetaMaskInstalled ? 'true' : 'false'}</div>
      <button data-testid="connect-btn" onClick={() => connectMetaMask({ skipSignature: true })}>
        Connect
      </button>
    </div>
  );
};

describe('Web3Context & Provider', () => {
  beforeEach(() => {
    localStorage.clear();
    delete (window as any).ethereum;
  });

  it('renders default disconnected state when no provider exists', () => {
    render(
      <AppProvider>
        <Web3Provider>
          <TestComponent />
        </Web3Provider>
      </AppProvider>
    );

    expect(screen.getByTestId('is-connected').textContent).toBe('false');
    expect(screen.getByTestId('wallet-address').textContent).toBe('none');
    expect(screen.getByTestId('chain-name').textContent).toBe('Not Connected');
    expect(screen.getByTestId('is-installed').textContent).toBe('false');
  });

  it('detects injected MetaMask provider and connects accounts', async () => {
    const mockRequest = jest.fn().mockImplementation(({ method }: { method: string }) => {
      if (method === 'eth_requestAccounts') return Promise.resolve(['0x71C8363837937A0275037475445665C03264640F']);
      if (method === 'eth_chainId') return Promise.resolve('0x1');
      return Promise.resolve(null);
    });

    (window as any).ethereum = {
      isMetaMask: true,
      request: mockRequest,
      on: jest.fn(),
      removeListener: jest.fn()
    };

    render(
      <AppProvider>
        <Web3Provider>
          <TestComponent />
        </Web3Provider>
      </AppProvider>
    );

    expect(screen.getByTestId('is-installed').textContent).toBe('true');

    await act(async () => {
      screen.getByTestId('connect-btn').click();
    });

    expect(mockRequest).toHaveBeenCalledWith({ method: 'eth_requestAccounts' });
    expect(screen.getByTestId('is-connected').textContent).toBe('true');
    expect(screen.getByTestId('wallet-address').textContent).toBe('0x71C8363837937A0275037475445665C03264640F');
    expect(screen.getByTestId('chain-name').textContent).toBe('Ethereum Mainnet');
  });
});

