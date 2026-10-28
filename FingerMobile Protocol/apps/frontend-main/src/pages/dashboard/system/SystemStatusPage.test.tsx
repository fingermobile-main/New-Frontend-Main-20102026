import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SystemStatusPage from './SystemStatusPage';

jest.mock('../../../services/adminOperationsService', () => ({
  __esModule: true,
  adminOperationsService: {
    getSystemStatus: jest.fn().mockResolvedValue([
      {
        id: 'node-pg-primary',
        service_name: 'PostgreSQL Multi-AZ Primary Cluster',
        category: 'database',
        status: 'healthy',
        latency_ms: 3,
        uptime_pct: 99.99,
        version: 'v16.2 Enterprise',
        last_check_at: '2026-01-01T00:00:00Z'
      },
      {
        id: 'node-fic-settle',
        service_name: 'FIC Quantum Core Settlement Engine',
        category: 'core',
        status: 'healthy',
        latency_ms: 7,
        uptime_pct: 99.98,
        version: 'v2.4.1 Protocol',
        last_check_at: '2026-01-01T00:00:00Z'
      }
    ]),
    restartSystemNode: jest.fn().mockResolvedValue({ success: true })
  }
}));

jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

jest.mock('../../../components/ownership/PlatformOwnershipCard', () => ({
  PlatformOwnershipCard: () => <div data-testid="platform-ownership-card">Platform Ownership Verified</div>
}));

describe('SystemStatusPage', () => {
  it('renders system health telemetry nodes and platform status metrics', async () => {
    render(
      <MemoryRouter>
        <SystemStatusPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('platform-ownership-card')).toBeInTheDocument();
    expect(await screen.findByText(/PostgreSQL Multi-AZ Primary Cluster/i)).toBeInTheDocument();
    expect(screen.getByText(/FIC Quantum Core Settlement Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/System Status & Services/i)).toBeInTheDocument();
  });
});
