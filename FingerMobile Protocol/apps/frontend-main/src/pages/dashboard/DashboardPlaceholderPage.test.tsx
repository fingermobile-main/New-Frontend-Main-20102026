import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardPlaceholderPage from './DashboardPlaceholderPage';

describe('DashboardPlaceholderPage', () => {
  it('renders dashboard placeholder node and mobile quick dock', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/unknown-module']}>
        <DashboardPlaceholderPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Protocol Node Connected/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Integrity/i }).length).toBeGreaterThan(0);
  });
});
