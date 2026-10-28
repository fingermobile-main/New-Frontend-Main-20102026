import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LegalCompliancePage from './LegalCompliancePage';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../services/legalComplianceService', () => ({
  __esModule: true,
  default: {
    getDSRs: jest.fn().mockResolvedValue([
      {
        id: 'dsr-1',
        ticket_number: 'DSR-2026-001',
        user_email: 'member@fingermobile.org',
        request_type: 'EXPORT',
        status: 'PENDING',
        created_at: '2026-10-28T10:00:00Z',
      },
    ]),
    getAccountDeletions: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

describe('LegalCompliancePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders legal compliance console and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <LegalCompliancePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Legal & Regulatory Compliance Console/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Refresh/i }).length).toBeGreaterThan(0);
  });
});
