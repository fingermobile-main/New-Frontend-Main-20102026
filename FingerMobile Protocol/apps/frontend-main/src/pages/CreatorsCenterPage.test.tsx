import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreatorsCenterPage from './CreatorsCenterPage';
import { AppProvider } from '../contexts/AppContext';

describe('CreatorsCenterPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <CreatorsCenterPage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText(/Creators Center & Services/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Overview/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Legal/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /ID Doc/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Biometric/i }).length).toBeGreaterThan(0);
  });
});

