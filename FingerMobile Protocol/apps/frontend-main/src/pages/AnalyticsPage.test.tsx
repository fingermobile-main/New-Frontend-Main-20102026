import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AnalyticsPage from './AnalyticsPage';

describe('AnalyticsPage Mobile Optimization', () => {
  it('renders analytics dashboard header and export report button', () => {
    render(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Export Report')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Overview Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Engagement Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Revenue Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Export Report')).toBeInTheDocument();
  });
});

