import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => {
  return function MockMainLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="main-layout">{children}</div>;
  };
});

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    ficBalance: 50000,
    openModal: jest.fn(),
  }),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

jest.mock('../../components/dashboard/crm/CrmWidget', () => () => <div data-testid="crm-widget" />);
jest.mock('../../components/dashboard/erp/ErpFinanceWidget', () => () => <div data-testid="erp-finance" />);
jest.mock('../../components/dashboard/erp/ErpHRWidget', () => () => <div data-testid="erp-hr" />);
jest.mock('../../components/dashboard/crm/CrmMarketingWidget', () => () => <div data-testid="crm-marketing" />);
jest.mock('../../components/dashboard/crm/CrmInvoicingWidget', () => () => <div data-testid="crm-invoicing" />);
jest.mock('../../components/dashboard/crm/CrmIntegrationsWidget', () => () => <div data-testid="crm-integrations" />);

import BusinessHubPage from './BusinessHubPage';

describe('BusinessHubPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders business hub and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <BusinessHubPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Business Hub & ERP Mesh/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Finance/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /HR/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Marketing/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
