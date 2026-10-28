import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DatabaseIntegrationDashboard from './DatabaseIntegrationDashboard';
import { AppProvider } from '../contexts/AppContext';

describe('DatabaseIntegrationDashboard Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <DatabaseIntegrationDashboard />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('heading', { name: /Database Integration Dashboard/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Clusters/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Seek/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Verify/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Report/i }).length).toBeGreaterThan(0);
  });
});

