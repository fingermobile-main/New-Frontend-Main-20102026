import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityPageEnhanced from './CommunityPageEnhanced';

// Mock contexts
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

// Mock hooks
jest.mock('../hooks/useCommunityMembers', () => ({
  useCommunityMembers: () => ({
    members: [
      { id: '1', name: 'John Doe', avatarUrl: 'https://picsum.photos/100', role: 'Creator Pro' }
    ],
    loading: false,
    error: null,
  }),
}));

jest.mock('../hooks/useCommunityPosts', () => ({
  useCommunityPosts: () => ({
    posts: [
      { id: 'p1', title: 'First Community Track', content: 'Track preview', tags: ['music'], author: { name: 'Producer 1' } }
    ],
    loading: false,
    error: null,
  }),
}));

jest.mock('../hooks/useCommunityGroups', () => ({
  useCommunityGroups: () => ({
    groups: [
      { id: 'g1', name: 'Sound Engineers', description: 'Audio collective', memberCount: 120 }
    ],
    loading: false,
    error: null,
  }),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = ['Users', 'FileText', 'Compass', 'MessageSquare', 'Plus'];
  const mockIcons: Record<string, any> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={`icon-${name.toLowerCase()}`} {...props} />;
  });
  return mockIcons;
});

describe('CommunityPageEnhanced Mobile & Responsive Suite', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CommunityPageEnhanced />
      </BrowserRouter>
    );
  };

  it('renders community hub title and create guild button', () => {
    renderComponent();
    expect(screen.getByText('Community Hub')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create guild/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with touch targets', () => {
    renderComponent();
    const dock = screen.getByTestId('community-enhanced-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /posts/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guilds/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^create$/i })).toBeInTheDocument();
  });

  it('renders search and filter input fields with 44px min-height', () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/search community.../i);
    expect(searchInput).toHaveClass('min-h-[44px]');
  });
});
