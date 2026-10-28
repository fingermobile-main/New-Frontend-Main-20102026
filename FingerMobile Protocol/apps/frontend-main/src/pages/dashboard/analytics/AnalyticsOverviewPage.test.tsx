import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AnalyticsOverviewPage from './AnalyticsOverviewPage';

describe('AnalyticsOverviewPage Mobile Integration', () => {
  it('renders title, stats, and charts correctly', () => {
    render(
      <MemoryRouter>
        <AnalyticsOverviewPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Analytics Overview/i })).toBeInTheDocument();
    expect(screen.getByText(/Total Views/i)).toBeInTheDocument();
    expect(screen.getByText(/1.2M/i)).toBeInTheDocument();
    expect(screen.getByText(/Followers Gained/i)).toBeInTheDocument();
    expect(screen.getByText(/Engagement Rate/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Monthly Post Views/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Engagement Breakdown/i })).toBeInTheDocument();
  });

  it('renders sovereign quick dock buttons', () => {
    render(
      <MemoryRouter>
        <AnalyticsOverviewPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Overview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh/i })).toBeInTheDocument();
  });
});
