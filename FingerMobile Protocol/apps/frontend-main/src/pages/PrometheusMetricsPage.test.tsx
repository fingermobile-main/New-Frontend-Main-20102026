import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership Card</div>
}));

import PrometheusMetricsPage from './PrometheusMetricsPage';

describe('PrometheusMetricsPage', () => {
  it('renders prometheus metrics title and query builder', () => {
    render(
      <BrowserRouter>
        <PrometheusMetricsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Prometheus Metrics/i })).toBeInTheDocument();
    expect(screen.getByText(/Query Builder/i)).toBeInTheDocument();
  });

  it('toggles view modes using mobile quick dock', () => {
    render(
      <BrowserRouter>
        <PrometheusMetricsPage />
      </BrowserRouter>
    );

    const graphBtns = screen.getAllByRole('button', { name: /Graph/i }); const graphBtn = graphBtns[0];
    expect(graphBtn).toBeInTheDocument();
    fireEvent.click(graphBtn);

    const tableBtns = screen.getAllByRole('button', { name: /Table/i }); const tableBtn = tableBtns[0];
    expect(tableBtn).toBeInTheDocument();
    fireEvent.click(tableBtn);
  });
});
