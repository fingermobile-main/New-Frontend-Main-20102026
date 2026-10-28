import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PostDetailPage from './PostDetailPage';

const mockPost = {
  id: 'post-101',
  title: 'Sovereign Decentralized Consensus in Lagos',
  content: 'Exploring sovereign zero-knowledge architecture and forum community discourse.',
  author_name: 'Mbah Israel Obinna',
  author_id: 'usr-1',
  created_at: '2026-10-28T09:00:00Z',
  likes_count: 42,
  replies_count: 5,
  comments: [],
};

jest.mock('../services/apiService', () => ({
  apiService: {
    get: jest.fn().mockImplementation(() => Promise.resolve({ data: mockPost })),
    post: jest.fn().mockImplementation(() => Promise.resolve({ data: { success: true } })),
  },
  default: {
    get: jest.fn().mockImplementation(() => Promise.resolve({ data: mockPost })),
    post: jest.fn().mockImplementation(() => Promise.resolve({ data: { success: true } })),
  },
}));

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    member: {
      id: 'usr-test',
      name: 'Test Member',
      username: 'testmember',
    },
    showToast: jest.fn(),
    ficBalance: 2500,
    handleAiAssist: jest.fn(),
  }),
}));

describe('PostDetailPage Mobile Optimization & Behavior', () => {
  it('renders post title and min 44px back button', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/posts/post-101']}>
          <Routes>
            <Route path="/posts/:id" element={<PostDetailPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    const backBtn = await screen.findByRole('button', { name: /back to feed/i });
    expect(backBtn).toBeInTheDocument();
    expect(backBtn.className).toContain('min-h-[44px]');
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/posts/post-101']}>
          <Routes>
            <Route path="/posts/:id" element={<PostDetailPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    const mobileDock = await screen.findByRole('navigation', { name: /post detail mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});

