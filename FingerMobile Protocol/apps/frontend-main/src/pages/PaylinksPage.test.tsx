import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ success: true, paylinks: null }),
    post: jest.fn().mockResolvedValue({ success: true, data: {} }),
  }
}));

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', name: 'Test User' },
    isAuthenticated: true,
  }),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

import PaylinksPage from './PaylinksPage';

describe('PaylinksPage', () => {
  it('renders hero title and default paylink entries', async () => {
    render(
      <BrowserRouter>
        <PaylinksPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Sovereign Paylinks & Direct Checkout/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Durbar Festival High-Res Photo License/i)).toBeInTheDocument();
    });
  });

  it('renders mobile quick dock buttons and opens create modal', async () => {
    render(
      <BrowserRouter>
        <PaylinksPage />
      </BrowserRouter>
    );

    const createBtn = screen.getByRole('button', { name: /^Create$/i });
    expect(createBtn).toBeInTheDocument();
    fireEvent.click(createBtn);

    expect(screen.getByRole('heading', { level: 3, name: /Generate New Paylink/i })).toBeInTheDocument();
  });
});
