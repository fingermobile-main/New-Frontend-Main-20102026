import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContentModeratorDashboardPage from './ContentModeratorDashboardPage';
import { AppProvider } from '../contexts/AppContext';

describe('ContentModeratorDashboardPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <ContentModeratorDashboardPage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText(/Platform Governance & Moderation Console/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Queue/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Sentinel/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Audit/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /RBAC/i }).length).toBeGreaterThan(0);
  });
});
