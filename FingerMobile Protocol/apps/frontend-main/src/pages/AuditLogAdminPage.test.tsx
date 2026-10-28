import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuditLogAdminPage from './AuditLogAdminPage';

// Mock MainLayout & AppContext
jest.mock('../components/layout/MainLayout', () => ({ children }: any) => <div data-testid="main-layout">{children}</div>);
jest.mock('../components/dashboard/PlatformOwnershipCard', () => () => <div data-testid="ownership-card">Platform Ownership Card</div>);
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

// Mock api
jest.mock('../services/api', () => ({
  api: {
    get: jest.fn().mockResolvedValue({ data: { logs: [], totalLogs: 0 } }),
    delete: jest.fn().mockResolvedValue({ data: {} })
  }
}));

describe('AuditLogAdminPage Mobile Optimization', () => {
  it('renders the WORM cryptographic audit viewer title', async () => {
    render(
      <BrowserRouter>
        <AuditLogAdminPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/WORM Cryptographic Audit Viewer/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile quick dock with refresh and export', () => {
    render(
      <BrowserRouter>
        <AuditLogAdminPage />
      </BrowserRouter>
    );

    expect(screen.getAllByRole('button', { name: /refresh/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /export/i }).length).toBeGreaterThanOrEqual(1);
  });
});

