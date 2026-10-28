import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PlatformStatusPage from './PlatformStatusPage';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../services/adminOperationsService', () => ({
  adminOperationsService: {
    getSystemStatus: jest.fn().mockResolvedValue([
      {
        id: 'node-1',
        service_name: 'PostgreSQL Primary Enclave',
        category: 'DATABASE',
        status: 'healthy',
        latency_ms: 4,
        uptime_pct: 99.99,
        version: '15.4',
        last_check_at: '2026-10-28T12:00:00Z',
      },
    ]),
    triggerHealthCheck: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

describe('PlatformStatusPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders platform status page and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <PlatformStatusPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Platform Operations & Node Status/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Diagnose|Run Diagnostics/i }).length).toBeGreaterThan(0);
  });
});
