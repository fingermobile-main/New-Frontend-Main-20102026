import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BlogsPage from './BlogsPage';

// Mock contexts and hooks
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    currentUser: { id: 'test-user', membername: 'TestAuthor', email: 'author@test.com' },
    ficBalance: 1250.50,
  }),
}));

jest.mock('../contexts/HapticFeedbackContext', () => ({
  useHaptic: () => ({
    handleHaptic: jest.fn(),
  }),
}));

jest.mock('../contexts/CommunityContext', () => ({
  useCommunity: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../hooks/useBlogPosts', () => ({
  useBlogPosts: () => ({
    posts: [
      {
        id: '1',
        title: 'Sovereign Technical Insights',
        excerpt: 'Decentralized systems and architecture',
        content: 'Long form content here',
        category: 'protocol',
        author: { membername: 'Alice', avatar: '' },
        tags: ['technology'],
        createdAt: '2026-03-01',
        metrics: { views: 120, likes: 45, comments: 12, giftsFic: 50 },
        isSpotlight: true,
      },
    ],
    loading: false,
    addBlogPost: jest.fn(),
  }),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../components/common/UniversalProfileCard', () => ({
  __esModule: true,
  default: () => <div data-testid="universal-profile-card">Profile</div>,
}));

jest.mock('../components/widgets/PlatformWidgetsAndAdsRail', () => ({
  PlatformWidgetsAndAdsRail: () => <div data-testid="widgets-rail">Rail</div>,
}));

describe('BlogsPage Mobile Suite', () => {
  it('renders executive hero and primary mobile dispatches navigation', () => {
    render(
      <BrowserRouter>
        <BlogsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/FingerMobile Blogs™/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile navigation quick dock controls', () => {
    render(
      <BrowserRouter>
        <BlogsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Write/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Saved/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Monetize/i })).toBeInTheDocument();
  });
});
