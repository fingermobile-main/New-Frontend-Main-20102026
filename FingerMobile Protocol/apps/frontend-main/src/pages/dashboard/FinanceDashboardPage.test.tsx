import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FinanceDashboardPage from './FinanceDashboardPage';

jest.mock('../../services/apiService', () => ({
  apiService: {
    get: jest.fn().mockResolvedValue({
      data: {
        balance: 5000,
      },
    }),
  },
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

describe('FinanceDashboardPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders finance dashboard and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <FinanceDashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Finance & Treasury Dashboard/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Wallet/i }).length).toBeGreaterThan(0);
  });
});
