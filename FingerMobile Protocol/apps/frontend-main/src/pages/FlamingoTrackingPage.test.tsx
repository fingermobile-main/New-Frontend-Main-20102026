import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import FlamingoTrackingPage from './FlamingoTrackingPage';

jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: () => Promise.resolve({
      data: [
        {
          id: 1,
          tracking_number: 'FLAM-123456789',
          status: 'shipped',
          current_location: { country: 'NG', state: 'Lagos', area: 'VI' },
          estimated_arrival: '2026-10-30T10:00:00Z',
          status_updates: [
            {
              id: 1,
              status: 'processing',
              description: 'Order is being processed',
              alert_level: 'info',
              created_at: '2026-10-28T08:00:00Z',
            },
          ],
        },
      ],
    }),
  },
}));

describe('FlamingoTrackingPage Mobile Optimization & Behavior', () => {
  it('renders purchase tracking header, tracking code and min-44px buttons', async () => {
    render(<FlamingoTrackingPage />);

    expect(screen.getByRole('heading', { name: /purchase tracking/i })).toBeInTheDocument();
    await waitFor(() => {
      const trackingCodes = screen.getAllByText(/FLAM-123456789/i);
      expect(trackingCodes.length).toBeGreaterThan(0);
    });

    const refreshBtn = screen.getByRole('button', { name: /refresh status/i });
    expect(refreshBtn.style.minHeight).toBe('44px');
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(<FlamingoTrackingPage />);

    const mobileDock = screen.getByRole('navigation', { name: /flamingo tracking mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});

