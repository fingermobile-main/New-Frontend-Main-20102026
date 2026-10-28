import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DatabaseIntegrationReportPage from './DatabaseIntegrationReportPage';
import { AppProvider } from '../contexts/AppContext';

describe('DatabaseIntegrationReportPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <DatabaseIntegrationReportPage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('heading', { name: /Database Integration Report/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Dashboard/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Report/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Top/i }).length).toBeGreaterThan(0);
  });
});

