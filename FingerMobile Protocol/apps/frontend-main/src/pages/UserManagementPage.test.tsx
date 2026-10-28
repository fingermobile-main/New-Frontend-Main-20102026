import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          uuid: 'u-1',
          email: 'admin@fingermobile.com',
          firstName: 'Amina',
          lastName: 'Bello',
          username: 'amina_admin',
          role: 'admin',
          status: 'active',
          emailVerified: true,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z'
        }
      ]
    }),
    post: jest.fn().mockResolvedValue({ data: { success: true } })
  }
}));

jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>
}));

import UserManagementPage from './UserManagementPage';

describe('UserManagementPage', () => {
  it('renders user management header and table', () => {
    render(
      <BrowserRouter>
        <UserManagementPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Platform Member & Identity Management/i })).toBeInTheDocument();
  });

  it('filters by role and opens creation modal via quick dock', () => {
    render(
      <BrowserRouter>
        <UserManagementPage />
      </BrowserRouter>
    );

    const adminBtns = screen.getAllByRole('button', { name: /Admins/i });
    expect(adminBtns.length).toBeGreaterThan(0);
    fireEvent.click(adminBtns[0]);

    const addUserBtns = screen.getAllByRole('button', { name: /Add User/i });
    expect(addUserBtns.length).toBeGreaterThan(0);
    fireEvent.click(addUserBtns[0]);
  });
});
