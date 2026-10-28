import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DPOPage from './DPOPage';
import { AppProvider } from '../contexts/AppContext';

describe('DPOPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <DPOPage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText(/Data Protection Officer \(DPO\) Office/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Overview/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Console/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Request/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Audit/i }).length).toBeGreaterThan(0);
  });
});

