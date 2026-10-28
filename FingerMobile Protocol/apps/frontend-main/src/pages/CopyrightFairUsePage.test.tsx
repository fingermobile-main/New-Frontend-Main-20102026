import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CopyrightFairUsePage from './CopyrightFairUsePage';
import { AppProvider } from '../contexts/AppContext';

describe('CopyrightFairUsePage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <CopyrightFairUsePage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText(/FingerMobile Copyright & AI Fair Use Compliance Policy/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Policy/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Evaluate/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Accept/i }).length).toBeGreaterThan(0);
  });
});

