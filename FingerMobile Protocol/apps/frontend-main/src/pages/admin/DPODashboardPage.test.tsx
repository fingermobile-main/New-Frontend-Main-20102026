import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/UniversalHeader', () => ({
  __esModule: true,
  default: ({ pageTitle }: { pageTitle: string }) => (
    <div data-testid="universal-header">{pageTitle}</div>
  ),
}));

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockRejectedValue(new Error('API unavailable')),
    post: jest.fn().mockResolvedValue({ data: { success: true } }),
  },
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

// Mock URL.createObjectURL for export test
global.URL.createObjectURL = jest.fn(() => 'blob:mock');
global.URL.revokeObjectURL = jest.fn();

import { DPODashboardPage } from './DPODashboardPage';

describe('DPODashboardPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders DPO dashboard and quick dock', () => {
    render(
      <MemoryRouter>
        <DPODashboardPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('universal-header')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /DPO Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export CAR Report/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh DPO Data/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

