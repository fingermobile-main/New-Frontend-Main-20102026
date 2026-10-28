import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContentAdminDashboardPage from './ContentAdminDashboardPage';
import { AppProvider } from '../contexts/AppContext';

describe('ContentAdminDashboardPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <ContentAdminDashboardPage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('heading', { name: /Content Admin Dashboard/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Governance/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Metrics/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Users/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Report/i }).length).toBeGreaterThan(0);
  });
});
