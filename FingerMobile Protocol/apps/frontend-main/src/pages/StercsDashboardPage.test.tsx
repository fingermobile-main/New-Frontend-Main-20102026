import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StercsDashboardPage from './StercsDashboardPage';

// Mock dependencies
jest.mock('../services/dashboardService', () => ({
  __esModule: true,
  default: {
    getAdminDashboardData: jest.fn().mockResolvedValue({
      totalUsers: 15400,
      activeUsers: 8900,
      systemHealth: 'optimal',
      metrics: []
    })
  }
}));

jest.mock('../services/UserProfileSyncService', () => ({
  __esModule: true,
  default: {
    getProfile: jest.fn().mockReturnValue({
      id: 'usr_1',
      displayName: 'Commander Alpha',
      role: 'L5-Executive'
    }),
    getUserProfile: jest.fn().mockResolvedValue(null),
    subscribe: jest.fn().mockReturnValue(() => {})
  }
}));

jest.mock('../services/GuardianSearchIndexingService', () => ({
  guardianSearchIndexer: {
    query: jest.fn().mockReturnValue({ results: [] })
  }
}));

jest.mock('../components/dashboard/CorporateGovernanceConsole', () => () => <div data-testid="governance-console">Corporate Governance Console</div>);
jest.mock('../components/dashboard/EnterpriseFinancialEcosystemConsole', () => () => <div data-testid="financial-console">Financial Ecosystem Console</div>);
jest.mock('../components/dashboard/StercsControlCenter', () => () => <div data-testid="control-center">Stercs Control Center</div>);
jest.mock('../components/dashboard/PlatformOwnershipCard', () => () => <div data-testid="ownership-card">Platform Ownership Card</div>);

describe('StercsDashboardPage Mobile Optimization', () => {
  it('renders the Stercs dashboard and its core navigation tabs', async () => {
    render(
      <BrowserRouter>
        <StercsDashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Sovereign Control Core/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile quick dock navigation buttons', () => {
    render(
      <BrowserRouter>
        <StercsDashboardPage />
      </BrowserRouter>
    );

    expect(screen.getAllByRole('button', { name: /overview/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /governance/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /modules/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /controls/i }).length).toBeGreaterThanOrEqual(1);
  });
});
