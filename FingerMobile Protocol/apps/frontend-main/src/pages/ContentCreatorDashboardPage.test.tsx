import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContentCreatorDashboardPage from './ContentCreatorDashboardPage';
import { AppProvider } from '../contexts/AppContext';

describe('ContentCreatorDashboardPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <ContentCreatorDashboardPage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('heading', { name: /Creator Studio/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /All/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Videos/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Articles/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Create/i }).length).toBeGreaterThan(0);
  });
});
