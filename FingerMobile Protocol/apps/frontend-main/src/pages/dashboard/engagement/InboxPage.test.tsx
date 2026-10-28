import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import InboxPage from './InboxPage';

// Mock AppContext
jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

// Mock messageService
jest.mock('../../../services/MessageService', () => ({
  getConversations: jest.fn().mockResolvedValue([
    {
      id: '1',
      name: 'Alice Validator',
      participants: [{ name: 'Alice Validator', username: 'alice_val' }],
      lastMessage: 'Attestation verification received',
      updatedAt: new Date().toISOString(),
      unreadCount: 0
    }
  ]),
  getMessages: jest.fn().mockResolvedValue([
    { id: '101', sender_id: '1', content: 'Attestation verification received' }
  ]),
  sendMessage: jest.fn().mockResolvedValue({ success: true })
}));

describe('InboxPage Mobile Integration', () => {
  it('renders inbox layout and messaging elements', () => {
    render(
      <MemoryRouter>
        <InboxPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Engagement Inbox/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ New Message/i })).toBeInTheDocument();
  });

  it('renders quick dock buttons', () => {
    render(
      <MemoryRouter>
        <InboxPage />
      </MemoryRouter>
    );

    expect(screen.getAllByRole('button', { name: /New/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Refresh/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
