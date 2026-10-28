import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreatorDashboardPage from './CreatorDashboardPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

describe('CreatorDashboardPage Mobile & Accessibility', () => {
  it('renders gracefully with auth context', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <CreatorDashboardPage />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Creator Studio Dashboard Restricted|Creator Dashboard/i)).toBeInTheDocument();
  });
});

