import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminSecurityEventsPage from './AdminSecurityEventsPage';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockCard() {
    return <div data-testid="platform-ownership-card">Platform Ownership</div>;
  };
});

jest.mock('../../services/guardianService', () => ({
  guardianService: {
    getLogs: jest.fn().mockResolvedValue([
      {
        id: 1,
        created_at: '2026-10-21T00:15:30Z',
        action_taken: 'BIOMETRIC_ANOMALY_DETECTED',
        target_user_id: 'user-abcdef1234',
        details: { description: 'Rapid credential retry threshold exceeded' },
        severity: 'high',
      },
      {
        id: 2,
        created_at: '2026-10-20T23:44:12Z',
        action_taken: 'GEO_RATE_LIMIT_WARNING',
        target_user_id: null,
        details: { description: 'Burst traffic detected from unverified subnet' },
        severity: 'medium',
      },
    ]),
  },
}));

describe('AdminSecurityEventsPage (Subpage Screen)', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  test('renders security events header, table, filter and quick dock', async () => {
    render(<AdminSecurityEventsPage />);

    expect(screen.getByText('Security & Sentinel Audit Events')).toBeInTheDocument();
    expect(screen.getByText(/Live cryptographic telemetry from hardware TEE enclaves/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('BIOMETRIC_ANOMALY_DETECTED')).toBeInTheDocument();
    });

    // Test Quick Dock buttons
    const criticalBtn = screen.getByRole('button', { name: /Filter High/i });
    expect(criticalBtn).toBeInTheDocument();
    fireEvent.click(criticalBtn);

    const mediumBtn = screen.getByRole('button', { name: /Filter Medium/i });
    fireEvent.click(mediumBtn);

    const syncBtn = screen.getByRole('button', { name: /Sync Telemetry/i });
    fireEvent.click(syncBtn);

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});

