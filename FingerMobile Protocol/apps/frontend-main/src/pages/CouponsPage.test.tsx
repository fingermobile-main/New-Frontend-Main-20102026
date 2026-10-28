import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CouponsPage from './CouponsPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

describe('CouponsPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <CouponsPage />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('heading', { name: /Sovereign Coupons & Promo Vouchers/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Available/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Claimed/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Vault/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Create/i }).length).toBeGreaterThan(0);
  });
});

