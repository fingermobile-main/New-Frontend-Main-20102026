import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PostCard from './PostCard';

describe('PostCard', () => {
  const mockPost = {
    id: '1',
    title: 'Test Post',
    content: 'Test content',
    excerpt: 'Test excerpt',
    timestamp: new Date('2023-01-01'),
    likes: 0,
    comments: 0,
    shares: 0,
    mediaUrl: '',
    author: {
      id: 'author-1',
      name: 'Test User',
      avatar: ''
    },
    createdAt: '2023-01-01',
    likesCount: 0,
    repliesCount: 0,
    repostsCount: 0,
    bookmarksCount: 0,
    isLiked: false,
    isBookmarked: false,
    isReposted: false,
    type: 'post' as const,
    privacy: 'public',
    tags: [],
    views: 0,
    location: '',
    profileId: 'profile-1',
    authorId: 'author-1',
    isSpoiler: false,
    isPrivate: false,
    isFollowersOnly: false,
    isAiGenerated: false,
    viewsCount: 0,
    sharesCount: 0,
    giftCount: 0,
    tokenized: false
  };

  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <PostCard post={mockPost as any} />
      </MemoryRouter>
    );
    expect(screen.getByText(/test post/i)).toBeTruthy();
  });

  it('renders AI badge and attachments when present', () => {
    const aiPost = {
      ...mockPost,
      id: '2',
      isAiGenerated: true,
      aiBadgeLabel: 'AI-Generated Art',
      attachments: [
        { type: 'gift_tip', data: { amount: 50, currency: 'FIC' } },
        { type: 'heavy_document', data: { filename: 'master.iso' } }
      ]
    };

    render(
      <MemoryRouter>
        <PostCard post={aiPost as any} />
      </MemoryRouter>
    );
    expect(screen.getByText(/AI-Generated Art/i)).toBeInTheDocument();
    expect(screen.getByText(/gift tip/i)).toBeInTheDocument();
    expect(screen.getByText(/master.iso/i)).toBeInTheDocument();
  });
});
