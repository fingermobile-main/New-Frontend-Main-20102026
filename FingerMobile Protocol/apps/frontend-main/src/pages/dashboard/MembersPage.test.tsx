import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MembersPage from './MembersPage';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      data: {
        users: [
          {
            id: 'mem-101',
            name: 'Satoshi Sterling',
            email: 'ssterling@fingermobileprotocol.com',
            role: 'Admin',
            status: 'Active',
            lastActive: 'Just now',
          },
        ],
      },
    }),
  },
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

describe('MembersPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders members management page and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <MembersPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Members Management/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Add/i }).length).toBeGreaterThan(0);
  });
});
