import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DataSubjectRequestPage from './DataSubjectRequestPage';
import { AppProvider } from '../contexts/AppContext';

describe('DataSubjectRequestPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <DataSubjectRequestPage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('heading', { name: /Data Subject Request/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Home/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Privacy/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /DPO Office/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Form/i }).length).toBeGreaterThan(0);
  });
});

