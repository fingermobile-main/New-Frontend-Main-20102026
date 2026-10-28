import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LushChatPage from './LushChatPage';

describe('LushChatPage Component', () => {
  it('renders LushChatPage with chat title and message lists', () => {
    render(
      <BrowserRouter>
        <LushChatPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Lush Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/Recent Conversations/i)).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', () => {
    render(
      <BrowserRouter>
        <LushChatPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Chats/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Active Chat/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Voice/i })).toBeInTheDocument();
  });
});
