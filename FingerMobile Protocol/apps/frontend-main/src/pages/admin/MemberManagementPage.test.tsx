import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    user: { id: 'usr-1', email: 'admin@fmp.com', role: 'admin' },
  }),
}));

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            id: 'MEM-001',
            email: 'test@fmp.com',
            role: 'user',
            createdAt: '2026-01-01T00:00:00Z',
          },
        ],
      },
    }),
    post: jest.fn().mockResolvedValue({ data: { success: true } }),
    put: jest.fn().mockResolvedValue({ data: { success: true } }),
    delete: jest.fn().mockResolvedValue({ data: { success: true } }),
  },
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import MemberManagementPage from './MemberManagementPage';

describe('MemberManagementPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders members page and quick dock', async () => {
    render(
      <MemoryRouter>
        <MemberManagementPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Member Management/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Find Member/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh Members/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});
