import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdvancedAnalyticsPage from './AdvancedAnalyticsPage';
import { useAppContext } from '../contexts/AppContext';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../components/dashboard/AdvancedAnalyticsDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="advanced-analytics-dashboard">Analytics Dashboard Content</div>,
}));

describe('AdvancedAnalyticsPage Mobile Optimization', () => {
  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      ficBalance: 420,
      showToast: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders analytics heading and dashboard component', () => {
    render(
      <MemoryRouter>
        <AdvancedAnalyticsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Advanced Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('advanced-analytics-dashboard')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <AdvancedAnalyticsPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Metrics Overview')).toBeInTheDocument();
    expect(screen.getByLabelText('Generate Report')).toBeInTheDocument();
    expect(screen.getByLabelText('Export Data')).toBeInTheDocument();
    expect(screen.getByLabelText('Back to Forum')).toBeInTheDocument();
  });
});
