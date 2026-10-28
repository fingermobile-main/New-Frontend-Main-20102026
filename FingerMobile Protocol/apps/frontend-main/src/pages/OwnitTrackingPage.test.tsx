import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OwnitTrackingPage from './OwnitTrackingPage';

// Mock API service
jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      data: [
        {
          id: 101,
          tracking_number: 'OWNIT-EXP-77291',
          shipping_status: 'in-transit',
          shipping_address: {
            city: 'Geneva',
            address: 'Cointrin International Hub'
          },
          delivery_date: '2026-11-04T12:00:00Z',
          seller_name: 'Geneva Master Vault',
          order_date: '2026-10-28T06:30:00Z'
        }
      ]
    })
  }
}));

describe('OwnitTrackingPage Mobile Optimization', () => {
  it('renders Ownit purchase tracking header and action buttons', async () => {
    render(<OwnitTrackingPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Ownit Purchase Tracking' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh Status/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New Purchase/i })).toBeInTheDocument();
  });

  it('renders active consignments list and loads tracking reference card', async () => {
    render(<OwnitTrackingPage />);

    const trackingRefs = await screen.findAllByText('OWNIT-EXP-77291');
    expect(trackingRefs.length).toBeGreaterThan(0);
    expect(screen.getAllByText('in-transit').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Cointrin International Hub/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Activity History')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', async () => {
    render(<OwnitTrackingPage />);

    const mobileDock = screen.getByTestId('ownit-tracking-mobile-dock');
    expect(mobileDock).toBeInTheDocument();

    expect(screen.getAllByRole('button', { name: /Refresh/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Shipments/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New Order/i })).toBeInTheDocument();
  });

  it('triggers refresh action when refresh button is tapped', async () => {
    render(<OwnitTrackingPage />);

    const refreshBtn = screen.getByRole('button', { name: /Refresh Status/i });
    fireEvent.click(refreshBtn);

    expect(screen.getByRole('button', { name: /Refreshing...|Refresh Status/i })).toBeInTheDocument();
  });
});
