import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FICVaultPage from './FICVaultPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

describe('FICVaultPage Wrapper', () => {
  it('renders the underlying financials FicVaultPage correctly', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <FICVaultPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation', { name: /Sleeper Quick Navigation/i })).toBeInTheDocument();
  });
});
