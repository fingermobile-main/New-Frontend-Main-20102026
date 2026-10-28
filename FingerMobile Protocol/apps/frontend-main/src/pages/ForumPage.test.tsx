import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForumPage from './ForumPage';
import { ToastProvider } from '../components/Toast';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

// Mock ForumService
jest.mock('../services/forumService', () => ({
  __esModule: true,
  default: {
    getCategories: jest.fn().mockResolvedValue({
      success: true,
      data: [{ id: 'general', name: 'General', icon: 'chat' }]
    }),
    getFeedPosts: jest.fn().mockResolvedValue({
      success: true,
      data: []
    }),
    getTrendingTopics: jest.fn().mockResolvedValue({
      success: true,
      data: []
    })
  }
}));

// Mock Audio Commentary
jest.mock('../services/VoiceLineService', () => ({
  __esModule: true,
  default: {
    playCommentaryVoiceLine: jest.fn()
  }
}));

describe('ForumPage Mobile View & Sovereign Quick Dock', () => {
  it('renders correctly with forum dock actions', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              <ForumPage />
            </ToastProvider>
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const dock = screen.getByRole('complementary', { name: /Mobile Navigation Dock/i });
    expect(dock).toBeInTheDocument();

    const discoverBtn = within(dock).getByRole('button', { name: /Discover & Trends/i });
    const createBtn = within(dock).getByRole('button', { name: /Create Post/i });
    const walletBtn = within(dock).getByRole('button', { name: /Sovereign Wallet/i });
    const hallmarksBtn = within(dock).getByRole('button', { name: /Hallmarks Mega-Communities/i });

    expect(discoverBtn).toBeInTheDocument();
    expect(createBtn).toBeInTheDocument();
    expect(walletBtn).toBeInTheDocument();
    expect(hallmarksBtn).toBeInTheDocument();

    fireEvent.click(createBtn);
    fireEvent.click(walletBtn);
    fireEvent.click(hallmarksBtn);
    fireEvent.click(discoverBtn);
  });
});
