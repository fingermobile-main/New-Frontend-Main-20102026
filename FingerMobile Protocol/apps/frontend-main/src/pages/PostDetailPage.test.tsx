import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostDetailPage from './PostDetailPage';

const mockMember = {
  id: 'usr-test',
  name: 'Test Member',
  username: 'testmember',
};

jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      data: {
        data: {
          id: 'post-101',
          title: 'Sovereign Decentralized Consensus in Lagos',
          content: 'Exploring sovereign zero-knowledge architecture and forum community discourse.',
          author_name: 'Mbah Israel Obinna',
          author_id: 'usr-1',
          created_at: '2026-10-28T09:00:00Z',
          likes_count: 42,
          replies_count: 5,
          comments: [],
        }
      }
    }),
    post: jest.fn().mockResolvedValue({ data: { success: true } })
  }
}));

jest.mock('../utils/errorLogger', () => ({
  logError: jest.fn(),
}));

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    member: mockMember,
    showToast: jest.fn(),
    ficBalance: 2500,
    handleAiAssist: jest.fn(),
  }),
}));

// Mock PostCard and CommentSection to ensure clean unit testing without external complex child rendering
jest.mock('../components/PostCard', () => {
  return function MockPostCard({ post }: { post: any }) {
    return <div data-testid="mock-post-card">{post.title}</div>;
  };
});

jest.mock('../components/CommentSection', () => {
  return function MockCommentSection() {
    return <div data-testid="mock-comment-section">Comments</div>;
  };
});

describe('PostDetailPage Mobile Optimization & Behavior', () => {
  it('renders post title and min 44px back button', async () => {
    render(
      <BrowserRouter>
        <PostDetailPage />
      </BrowserRouter>
    );

    const backBtn = await screen.findByRole('button', { name: /back to feed/i });
    expect(backBtn).toBeInTheDocument();
    expect(backBtn.className).toContain('min-h-[44px]');
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', async () => {
    render(
      <BrowserRouter>
        <PostDetailPage />
      </BrowserRouter>
    );

    const mobileDock = await screen.findByRole('navigation', { name: /post detail mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});
