import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SupportDashboardPage from './SupportDashboardPage';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    supportTickets: [],
    handleRespondToTicket: jest.fn(),
    showToast: jest.fn(),
  }),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

describe('SupportDashboardPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders support operations dashboard and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <SupportDashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Support Operations Dashboard/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Latest/i }).length).toBeGreaterThan(0);
  });
});
