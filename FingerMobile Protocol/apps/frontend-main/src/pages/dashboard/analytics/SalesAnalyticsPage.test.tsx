import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SalesAnalyticsPage from './SalesAnalyticsPage';

// Mock AppContext
jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: () => ({
    salesAnalytics: {
      metrics: {
        totalRevenue: 348200,
        totalOrders: 1420,
        avgOrderValue: 245
      },
      monthlyRevenue: [
        { month: 'May', revenue: 42000 },
        { month: 'Jun', revenue: 58000 }
      ],
      topProducts: [
        { id: 'p-1', name: 'FIC Quantum Validator Node Key', price: 499, sales: 320 }
      ]
    }
  })
}));

describe('SalesAnalyticsPage Mobile Integration', () => {
  it('renders sales overview, metric cards, and charts', () => {
    render(
      <MemoryRouter>
        <SalesAnalyticsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Sales Analytics/i })).toBeInTheDocument();
    expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/348,200 FIC/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/1,420/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg. Order Value/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Monthly Revenue/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Top Selling Products/i })).toBeInTheDocument();
    expect(screen.getByText(/FIC Quantum Validator Node Key/i)).toBeInTheDocument();
  });

  it('renders quick dock buttons', () => {
    render(
      <MemoryRouter>
        <SalesAnalyticsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Sales/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh/i })).toBeInTheDocument();
  });
});
