import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 8500,
    showToast: jest.fn(),
  }),
}));

jest.mock('../services/apiService', () => ({
  ApiService: {
    get: jest.fn().mockResolvedValue({
      data: [
        {
          id: 'sead-1',
          title: 'Niger Delta Mangrove Restoration',
          category: 'Environment',
          location: 'Bayelsa State',
          pitch_summary: 'Community mangrove replanting initiative',
          target_funding: 50000,
          current_funding: 23000,
          deadline: '2026-12-31',
          organizer_name: 'EcoSovereign Trust',
          backers_count: 88
        }
      ]
    }),
    post: jest.fn().mockResolvedValue({ data: { success: true } })
  }
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

import SeadsPage from './SeadsPage';

describe('SeadsPage', () => {
  it('renders crowdfunding header and initiatives', () => {
    render(
      <BrowserRouter>
        <SeadsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Seads Crowdfunding & Impact/i })).toBeInTheDocument();
    expect(screen.getByText(/Impact Balance/i)).toBeInTheDocument();
  });

  it('filters by category and opens launch modal using quick dock', () => {
    render(
      <BrowserRouter>
        <SeadsPage />
      </BrowserRouter>
    );

    const ecoBtns = screen.getAllByRole('button', { name: /Eco|Environment/i });
    expect(ecoBtns.length).toBeGreaterThan(0);
    fireEvent.click(ecoBtns[0]);

    const launchBtns = screen.getAllByRole('button', { name: /Launch|Launch Initiative/i });
    expect(launchBtns.length).toBeGreaterThan(0);
    fireEvent.click(launchBtns[0]);
  });
});

