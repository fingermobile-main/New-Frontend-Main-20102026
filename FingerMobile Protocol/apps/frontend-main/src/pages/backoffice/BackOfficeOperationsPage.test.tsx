import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../services/sovereignRbacApi', () => ({
  __esModule: true,
  default: {
    getStaffRoles: jest.fn().mockResolvedValue([]),
    getStaffAssignments: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock('../../components/common/ExecutiveOnlyContent', () => ({
  usePlatformPrivilege: () => ({ isExecutive: true, clearanceLevel: 4 }),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import { BackOfficeOperationsPage } from './BackOfficeOperationsPage';

describe('BackOfficeOperationsPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders back office operations page and quick dock', () => {
    render(
      <MemoryRouter>
        <BackOfficeOperationsPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Back Office Operations/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Back Office/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});
