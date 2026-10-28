import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DatabaseIntegrationSummary from './DatabaseIntegrationSummary';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

describe('DatabaseIntegrationSummary Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <DatabaseIntegrationSummary />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('heading', { name: /Database Integration Summary/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Summary/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Components/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Security/i }).length).toBeGreaterThan(0);
  });
});

