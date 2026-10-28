import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UgcAnalyticsPage from './UgcAnalyticsPage';

// Mock AppContext
jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

describe('UgcAnalyticsPage Mobile Integration', () => {
  it('renders title, stats, and community cards', () => {
    render(
      <MemoryRouter>
        <UgcAnalyticsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /UGC Analytics/i })).toBeInTheDocument();
    expect(screen.getByText(/Total Communities/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Members/i)).toBeInTheDocument();
    expect(screen.getByText(/6,850/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Revenue \(FIC\)/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Jane's Art Hub/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Tech Talks/i })).toBeInTheDocument();
  });

  it('renders quick dock buttons', () => {
    render(
      <MemoryRouter>
        <UgcAnalyticsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /UGC/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh/i })).toBeInTheDocument();
  });
});
