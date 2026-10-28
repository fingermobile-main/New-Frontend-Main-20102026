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
