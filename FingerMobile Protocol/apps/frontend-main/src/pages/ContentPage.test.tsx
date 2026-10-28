import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContentPage from './ContentPage';
import { AppProvider } from '../contexts/AppContext';

describe('ContentPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <ContentPage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('heading', { name: /Content Management/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Items/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Search/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Create/i }).length).toBeGreaterThan(0);
  });
});

