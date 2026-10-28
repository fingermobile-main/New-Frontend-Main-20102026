import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

describe('DashboardPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <DashboardPage />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText(/Platform Operations & Enterprise Governance Hub/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /All Hubs/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Gov/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /CAMUS/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Sync/i }).length).toBeGreaterThan(0);
  });
});

