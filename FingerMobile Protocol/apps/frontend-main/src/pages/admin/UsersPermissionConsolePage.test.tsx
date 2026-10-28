import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../services/sovereignRbacApi', () => ({
  __esModule: true,
  default: {
    getUsersDirectory: jest.fn().mockResolvedValue({
      users: [],
      stats: { total: 0, superadmins: 0, creators: 0, staff: 0, distinguished: 0 },
    }),
    updateUserStaffRoles: jest.fn().mockResolvedValue({ success: true }),
  },
}));

jest.mock('../../components/common/ExecutiveOnlyContent', () => ({
  usePlatformPrivilege: jest.fn(),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import { UsersPermissionConsolePage } from './UsersPermissionConsolePage';

describe('UsersPermissionConsolePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders users permissions console and quick dock', () => {
    render(
      <MemoryRouter>
        <UsersPermissionConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Users Permissions Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Users/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh Users/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

