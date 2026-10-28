import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DeveloperPortalPage from './DeveloperPortalPage';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      data: {
        data: {
          total_endpoints: 128,
          documented_endpoints: 128,
          last_updated: '2026-10-28T12:00:00Z',
        },
      },
    }),
  },
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

describe('DeveloperPortalPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders developer portal and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <DeveloperPortalPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Developer Portal & API Mesh/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /JS SDK/i }).length).toBeGreaterThan(0);
  });
});
