import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MemberLandingPage from './MemberLandingPage';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    member: {
      id: 'member-101',
      username: 'johndoe',
      name: 'John Doe'
    }
  })
}));

jest.mock('../hooks/useMemberLandingData', () => ({
  useMemberLandingData: () => ({
    data: {
      walletBalance: 1250.5,
      notificationsCount: 4,
      groupsCount: 12,
      postsCount: 38,
      forumCategories: [
        { id: 1, name: 'General Discussions', slug: 'general', description: 'Chat about anything', postCount: 120, rank: 1 },
        { id: 2, name: 'Tech & Dev', slug: 'tech', description: 'Engineering and architecture', postCount: 85, rank: 2 }
      ]
    },
    loading: false,
    error: null,
    refreshData: jest.fn()
  })
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

describe('MemberLandingPage Component', () => {
  it('renders MemberLandingPage welcome banner and stats overview', () => {
    render(
      <BrowserRouter>
        <MemberLandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Welcome back, John Doe!/i)).toBeInTheDocument();
    expect(screen.getByText(/Wallet Balance/i)).toBeInTheDocument();
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', () => {
    render(
      <BrowserRouter>
        <MemberLandingPage />
      </BrowserRouter>
    );

    const nav = screen.getByRole('navigation', { name: /Member Landing Mobile Navigation/i });
    expect(nav).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /^Overview$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Post$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Groups$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Market$/i })).toBeInTheDocument();
  });
});

