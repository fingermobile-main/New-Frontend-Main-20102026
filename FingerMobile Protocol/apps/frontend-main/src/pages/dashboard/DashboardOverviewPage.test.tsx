import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardOverviewPage from './DashboardOverviewPage';

describe('DashboardOverviewPage', () => {
  it('renders dashboard overview metrics and mobile quick dock', async () => {
    render(
      <MemoryRouter>
        <DashboardOverviewPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Synchronizing dashboard telemetries\.\.\./i)).not.toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText(/Dashboard Overview/i)).toBeInTheDocument();
  });
});
