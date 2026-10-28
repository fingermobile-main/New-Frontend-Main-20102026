import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    member: {
      name: 'Jane Doe',
      membername: 'janedoe',
      email: 'jane@example.com',
      bio: 'Sovereign developer',
      avatarUrl: 'https://example.com/avatar.jpg',
    },
    setMember: jest.fn(),
    showToast: jest.fn(),
  }),
}));

jest.mock('../../services/api', () => ({
  updateMemberProfile: jest.fn().mockResolvedValue({}),
}));

import EditProfile from './EditProfile';

describe('EditProfile', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders edit profile page and quick dock', () => {
    render(
      <MemoryRouter>
        <EditProfile />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Edit Profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Avatar/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Cancel/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
