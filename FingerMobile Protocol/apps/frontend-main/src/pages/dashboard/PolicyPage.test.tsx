import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PolicyPage from './PolicyPage';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../services/legalComplianceService', () => ({
  __esModule: true,
  default: {
    getLegalDocuments: jest.fn().mockResolvedValue([
      {
        id: 'doc-1',
        title: 'Terms of Service & EULA',
        slug: 'terms',
        version: '2.1',
        is_active: true,
        effective_date: '2026-10-28T12:00:00Z',
        summary: 'Primary platform participation agreement',
      },
    ]),
    updateLegalDocument: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

describe('PolicyPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders policy management page and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <PolicyPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Policy & Statutory Document Management/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Refresh/i }).length).toBeGreaterThan(0);
  });
});
