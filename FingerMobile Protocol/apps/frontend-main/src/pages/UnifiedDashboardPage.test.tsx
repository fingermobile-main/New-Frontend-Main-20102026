import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 7800,
    showToast: jest.fn(),
  }),
}));

jest.mock('../services/apiService', () => ({
  apiService: {
    get: jest.fn().mockResolvedValue({
      data: {
        activeUsers: 1540,
        totalFIC: 320000,
        defconLevel: 5,
        systemUptime: '99.99%',
        activeNodes: 64
      }
    })
  }
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>
}));

import UnifiedDashboardPage from './UnifiedDashboardPage';

describe('UnifiedDashboardPage', () => {
  it('renders command center and subsystem consoles', () => {
    render(
      <BrowserRouter>
        <UnifiedDashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Unified Platform Command Console/i })).toBeInTheDocument();
    expect(screen.getByText(/Enterprise Financial Ecosystem/i)).toBeInTheDocument();
  });

  it('triggers sync via mobile quick dock', () => {
    render(
      <BrowserRouter>
        <UnifiedDashboardPage />
      </BrowserRouter>
    );

    const syncBtns = screen.getAllByRole('button', { name: /Sync|Refresh/i });
    expect(syncBtns.length).toBeGreaterThan(0);
    fireEvent.click(syncBtns[0]);
  });
});
