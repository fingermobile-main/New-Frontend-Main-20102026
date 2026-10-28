import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../services/MessageService', () => ({
  __esModule: true,
  default: {
    getConversations: jest.fn().mockResolvedValue([
      {
        id: 'c1',
        name: 'Amina Bello',
        avatarUrl: 'https://example.com/amina.jpg',
        lastMessage: 'Let us coordinate the cryptographic enclave audit',
        updatedAt: '2026-10-18T10:00:00Z',
        unreadCount: 1,
        participants: [{ name: 'Amina Bello', username: 'aminabello' }]
      }
    ]),
    getMessages: jest.fn().mockResolvedValue([
      {
        id: 'm1',
        content: 'Hello, are you ready for the key exchange?',
        createdAt: '2026-10-18T10:00:00Z',
        isOwn: false,
        status: 'read'
      }
    ]),
    sendMessage: jest.fn().mockResolvedValue({ success: true }),
  }
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../components/AnimatedAvatar', () => () => <div data-testid="animated-avatar" />);
jest.mock('../components/LoadingSpinner', () => () => <div data-testid="loading-spinner" />);

import PrivateMessagesPage from './PrivateMessagesPage';

describe('PrivateMessagesPage', () => {
  it('renders conversations list and active chat view', async () => {
    render(
      <BrowserRouter>
        <PrivateMessagesPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Private Messages/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByText(/Amina Bello/i)[0]).toBeInTheDocument();
    });
  });

  it('renders mobile quick dock buttons and opens new chat modal', async () => {
    render(
      <BrowserRouter>
        <PrivateMessagesPage />
      </BrowserRouter>
    );

    const newChatBtn = screen.getByRole('button', { name: /New Chat/i });
    expect(newChatBtn).toBeInTheDocument();
    fireEvent.click(newChatBtn);

    expect(screen.getByText(/Start Private Channel/i)).toBeInTheDocument();
  });
});

