import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../services/sovereignRbacApi', () => ({
  __esModule: true,
  default: {
    getBadgePrivileges: jest.fn().mockResolvedValue([]),
    redeemBadgePerk: jest.fn().mockResolvedValue({ success: true }),
  },
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'usr-1', email: 'test@example.com' },
  }),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import { BadgePrivilegesEnclavePage } from './BadgePrivilegesEnclavePage';

describe('BadgePrivilegesEnclavePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders badge privileges enclave page and quick dock', () => {
    render(
      <MemoryRouter>
        <BadgePrivilegesEnclavePage />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Badge Enclave/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Badges/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Badges/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

