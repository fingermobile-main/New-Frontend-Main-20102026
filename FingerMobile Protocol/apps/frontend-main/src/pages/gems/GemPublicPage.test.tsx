import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GemPublicPage from './GemPublicPage';

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ slug: 'alpha-gem' })
}));

// Mock contexts
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    member: { id: 'user-1', name: 'Test User' }
  })
}));

jest.mock('../../contexts/GemContext', () => ({
  useGem: () => ({
    gems: [
      {
        id: 'gem-1',
        slug: 'alpha-gem',
        name: 'Alpha Sovereign Gem',
        rules: 'Be respectful and innovate together.',
        owner: { id: 'user-1', name: 'Israel Mbah', membername: 'israel' },
        members: ['user-1'],
        posts: ['post-1'],
        settings: { joinFee: 0 }
      }
    ],
    handleJoinGem: jest.fn()
  })
}));

jest.mock('../../contexts/PostContext', () => {
  const ReactActual = jest.requireActual('react');
  return {
    PostContext: ReactActual.createContext({
      posts: [
        {
          id: 'post-1',
          author: { id: 'user-1', name: 'Israel Mbah' },
          content: 'Welcome to Alpha Sovereign Gem!'
        }
      ]
    })
  };
});

jest.mock('../../contexts/VoiceFeedContext', () => {
  const ReactActual = jest.requireActual('react');
  return {
    VoiceFeedContext: ReactActual.createContext({
      state: { isPlaying: false }
    })
  };
});

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 5000,
    openModal: jest.fn(),
    showToast: jest.fn(),
    triggerSpecialEffect: jest.fn(),
    activeSubProfile: null
  })
}));

// Mock PostCard
jest.mock('../../components/PostCard', () => ({ post }: { post: any }) => (
  <div data-testid="post-card">{post.content}</div>
));

describe('GemPublicPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <GemPublicPage />
      </BrowserRouter>
    );

  it('renders gem header, title, and posts', () => {
    renderComponent();
    expect(screen.getByText('Alpha Sovereign Gem')).toBeInTheDocument();
    expect(screen.getByText('Welcome to Alpha Sovereign Gem!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to gems/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^feed$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^gems hub$/i })).toBeInTheDocument();
  });
});
