import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DataImportPage from './DataImportPage';
import { AppProvider } from '../contexts/AppContext';

describe('DataImportPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <DataImportPage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('heading', { name: /Data Import/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Home/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Import/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Bulk CSV/i }).length).toBeGreaterThan(0);
  });
});
