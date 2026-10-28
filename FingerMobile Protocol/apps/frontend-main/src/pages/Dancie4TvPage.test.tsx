import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dancie4TvPage from './Dancie4TvPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

describe('Dancie4TvPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Dancie4TvPage />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('heading', { name: /Dancie 4 Tv/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Discovery/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Feed/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Updates/i }).length).toBeGreaterThan(0);
  });
});

