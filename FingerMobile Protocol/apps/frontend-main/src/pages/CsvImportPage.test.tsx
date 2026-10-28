import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CsvImportPage from './CsvImportPage';
import { AppProvider } from '../contexts/AppContext';

describe('CsvImportPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <CsvImportPage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('heading', { name: /CSV Data Import/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Upload/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Bulk Server/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Top/i }).length).toBeGreaterThan(0);
  });
});

