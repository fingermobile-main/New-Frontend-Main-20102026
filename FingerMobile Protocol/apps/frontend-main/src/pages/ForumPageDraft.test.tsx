import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForumPageDraft from './ForumPageDraft';
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

describe('ForumPageDraft Re-export Wrapper', () => {
  it('renders ForumPage accurately through the ForumPageDraft alias', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              <ForumPageDraft />
            </ToastProvider>
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const dock = screen.getByRole('complementary', { name: /Mobile Navigation Dock/i });
    expect(dock).toBeInTheDocument();
  });
});

