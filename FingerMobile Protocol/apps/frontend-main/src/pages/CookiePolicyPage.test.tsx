import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CookiePolicyPage from './CookiePolicyPage';
import { AppProvider } from '../contexts/AppContext';

describe('CookiePolicyPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <CookiePolicyPage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText(/FingerMobile Cookie Policy/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Home/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Privacy/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Terms/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Top/i }).length).toBeGreaterThan(0);
  });
});

