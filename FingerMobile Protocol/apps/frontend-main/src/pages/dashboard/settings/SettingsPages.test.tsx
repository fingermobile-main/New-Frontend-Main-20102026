import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BillingPage from './BillingPage';
import DomainsPage from './DomainsPage';
import GeneralSettingsPage from './GeneralSettingsPage';

jest.mock('../../../services/adminOperationsService', () => {
  const mockBilling = [
    {
      id: 'inv-test-1',
      invoice_number: 'INV-2026-TEST',
      plan_name: 'Enterprise Protocol Dedicated',
      amount: 1450.00,
      currency: 'USD',
      status: 'paid',
      billing_cycle: 'monthly',
      created_at: '2026-01-01T00:00:00Z',
      paid_at: '2026-01-01T00:00:00Z'
    }
  ];
  const ops = {
    getBillingRecords: jest.fn().mockResolvedValue(mockBilling),
    getDomains: jest.fn().mockResolvedValue([
      {
        id: 'dom-test-1',
        domain: 'protocol.fingermobile.io',
        is_primary: true,
        ssl_status: 'active',
        dns_records: [{ type: 'A', name: '@', value: '198.51.100.45' }]
      }
    ]),
    getSettings: jest.fn().mockResolvedValue([
      { config_key: 'site_title', config_value: 'FingerMobile Protocol' },
      { config_key: 'site_description', config_value: 'Sovereign Telemetry Enclave' }
    ]),
    updateSetting: jest.fn().mockResolvedValue({ success: true }),
    createDomain: jest.fn().mockResolvedValue({ success: true })
  };
  return {
    __esModule: true,
    default: ops,
    adminOperationsService: ops
  };
});

jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: () => ({
    settings: { siteName: 'FingerMobile Protocol', siteDescription: 'Sovereign Telemetry Enclave' },
    updateSettings: jest.fn(),
    showToast: jest.fn()
  })
}));

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'usr-1', username: 'SuperAdmin', role: 'admin' },
    isAuthenticated: true
  })
}));

jest.mock('../../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership Verified</div>
}));

describe('Settings Sub-Directory Pages', () => {
  it('renders BillingPage with plan summary and invoice ledger', async () => {
    render(
      <MemoryRouter>
        <BillingPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('platform-ownership-card')).toBeInTheDocument();
    expect(screen.getByText(/Current Plan/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Manage Subscription/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Payment Method/i })).toBeInTheDocument();
  });

  it('renders DomainsPage with DNS records and primary domain status', async () => {
    render(
      <MemoryRouter>
        <DomainsPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('platform-ownership-card')).toBeInTheDocument();
    expect(await screen.findByText(/protocol.fingermobile.io/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Custom Domains$/i })).toBeInTheDocument();
  });

  it('renders GeneralSettingsPage with form controls and configuration values', async () => {
    render(
      <MemoryRouter>
        <GeneralSettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('platform-ownership-card')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('FingerMobile Protocol')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Settings/i })).toBeInTheDocument();
  });
});
