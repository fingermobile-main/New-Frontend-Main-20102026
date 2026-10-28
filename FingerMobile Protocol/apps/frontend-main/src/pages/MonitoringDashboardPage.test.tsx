import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MonitoringDashboardPage from './MonitoringDashboardPage';

// Mock MainLayout & AppContext
jest.mock('../components/layout/MainLayout', () => ({ children }: any) => <div data-testid="main-layout">{children}</div>);
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

describe('MonitoringDashboardPage Mobile Optimization', () => {
  it('renders the system monitoring header', async () => {
    render(
      <BrowserRouter>
        <MonitoringDashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/System Monitoring Dashboard/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile quick dock with refresh and live toggle', () => {
    render(
      <BrowserRouter>
        <MonitoringDashboardPage />
      </BrowserRouter>
    );

    expect(screen.getAllByRole('button', { name: /refresh/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /live on|paused/i })).toBeInTheDocument();
  });
});

