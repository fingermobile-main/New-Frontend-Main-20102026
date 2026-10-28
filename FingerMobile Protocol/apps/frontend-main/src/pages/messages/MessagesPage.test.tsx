import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    member: { id: 'usr-1', username: 'testuser' },
    activeSubProfile: null,
  }),
}));

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../components/layout/MainLayout', () => {
  return function MockMainLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="main-layout">{children}</div>;
  };
});

jest.mock('../../components/AudioCallModal', () => {
  return function MockAudioCallModal() {
    return <div data-testid="audio-call-modal" />;
  };
});

jest.mock('../../components/VideoCallModal', () => {
  return function MockVideoCallModal() {
    return <div data-testid="video-call-modal" />;
  };
});

import MessagesPage from './MessagesPage';

describe('MessagesPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('renders messages page with quick dock buttons', () => {
    render(
      <MemoryRouter>
        <MessagesPage />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/Chats/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /New Chat/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Vault/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Dashboard/i })).toBeInTheDocument();
  });
});
