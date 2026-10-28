import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StorefrontTrackingPage } from './StorefrontTrackingPage';

// Mock AppContext
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

// Mock apiService
jest.mock('../services/apiService', () => {
  const mockApi = {
    get: jest.fn().mockImplementation((url: string) => {
      if (url.includes('tracking')) {
        return Promise.resolve({
          shipments: [
            {
              id: 1,
              tracking_number: 'TRK-987654321',
              order_id: 'ORD-1001',
              storefront_id: 'store-1',
              storefront_name: 'Lagos Sound Lab',
              customer_name: 'Adewale Adeleke',
              carrier: 'DHL Express',
              status: 'in-transit',
              origin: 'Lagos, Nigeria',
              destination: 'London, UK',
              estimated_arrival: '2026-11-04',
              total: 120,
              currency: 'USD',
              items: [{ title: 'Stem Pack', qty: 1, price: 120 }],
              current_location: { country: 'Nigeria', state: 'Lagos', area: 'Ikeja Cargo Terminal' },
              status_updates: []
            }
          ]
        });
      }
      return Promise.resolve({ data: [] });
    }),
    post: jest.fn().mockResolvedValue({ success: true }),
    put: jest.fn().mockResolvedValue({ success: true }),
    delete: jest.fn().mockResolvedValue({ success: true }),
    request: jest.fn().mockResolvedValue({ success: true })
  };

  return {
    __esModule: true,
    default: mockApi,
    apiService: mockApi,
    ApiService: mockApi
  };
});

// Mock PlatformDomainManagementConsole
jest.mock('../components/dashboard/PlatformDomainManagementConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-domain-management-console">Platform Domain Management</div>,
  COMMERCE_DOMAIN_KEYS: []
}));

describe('StorefrontTrackingPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <StorefrontTrackingPage />
      </BrowserRouter>
    );

  it('renders tracking operations header and active shipments', async () => {
    renderComponent();
    expect(screen.getByText('E-Commerce & Storefront Sovereign Operations')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dispatch package/i })).toBeInTheDocument();
    const trackingCodes = await screen.findAllByText('TRK-987654321');
    expect(trackingCodes.length).toBeGreaterThan(0);
  });

  it('renders tab switchers across logistics and commerce database', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /transit & logistics tracking/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /commerce database management/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^transit$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^commerce$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^dispatch$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^stores$/i })).toBeInTheDocument();
  });
});
