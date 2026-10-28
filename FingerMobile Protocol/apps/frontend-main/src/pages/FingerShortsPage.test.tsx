import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FingerShortsPage from './FingerShortsPage';
import { AppProvider } from '../contexts/AppContext';

// Mock AuthContext
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-creator-1', name: 'Shorts Creator' }, logout: jest.fn() }),
}));

// Mock apiService
jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockImplementation((url: string) => {
      if (url.includes('/sounds') || url.includes('/tracks')) {
        return Promise.resolve({
          sounds: [
            {
              id: 'snd-1',
              title: 'Afrobeat Sunrise Pulse',
              artist: 'Beatwave Sound Lab',
              uses: '18.4k shorts',
              duration_seconds: 45
            }
          ]
        });
      }
      return Promise.resolve({});
    }),
    post: jest.fn().mockResolvedValue({ success: true, data: { sessionId: 'sess-new-1' } }),
    put: jest.fn().mockResolvedValue({ success: true }),
    delete: jest.fn().mockResolvedValue({ success: true })
  },
}));

// Mock fetch for FingerShortsSection
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        success: true,
        data: [
          {
            session_id: 'sess-101',
            author_id: 'auth-1',
            author_name: 'tunde_chef',
            author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
            session_title: 'Secret Suya Recipe in 60s',
            card_count: 2,
            expires_at: new Date(Date.now() + 38 * 3600 * 1000).toISOString(),
            hours_remaining: 38,
            cards: [
              {
                id: 'card-1',
                card_index: 0,
                media_type: 'image',
                media_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
                duration_seconds: 15,
                sound_title: 'Lagos Night Groove'
              }
            ]
          }
        ]
      })
  })
) as jest.Mock;

describe('FingerShortsPage Component', () => {
  const renderWithProviders = () =>
    render(
      <MemoryRouter>
        <AppProvider>
          <FingerShortsPage />
        </AppProvider>
      </MemoryRouter>
    );

  it('renders FingerShorts hero banner, 48h stories specification, and reel', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/Disappearing 48h Stories with Duets & Stitches/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/FingerShorts™ \(Stories Platform\)/i)).toBeInTheDocument();
    expect(screen.getByText(/48h Expiration/i)).toBeInTheDocument();
    expect(screen.getByText(/Post Story \(48h\)/i)).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with Stories, Duets, Sounds, and Create tabs', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Stories')).toBeInTheDocument();
      expect(screen.getByText('Duets')).toBeInTheDocument();
      expect(screen.getByText('Sounds')).toBeInTheDocument();
      expect(screen.getByText('Create')).toBeInTheDocument();
    });
  });

  it('switches to Duets & Stitches view when clicking Duets tab', async () => {
    renderWithProviders();

    const duetsTab = screen.getByRole('button', { name: /Duets & Stitches/i });
    fireEvent.click(duetsTab);

    expect(screen.getByText(/Duets & Stitches Collaboration/i)).toBeInTheDocument();
    expect(screen.getByText(/Interactive Duets/i)).toBeInTheDocument();
    expect(screen.getByText(/Video Stitches/i)).toBeInTheDocument();
  });

  it('switches to Sounds & Audio Library view when clicking Sounds tab', async () => {
    renderWithProviders();

    const soundsTab = screen.getByRole('button', { name: /Sounds & Audio Library/i });
    fireEvent.click(soundsTab);

    expect(screen.getByText(/Sounds & BeatwaveNG Audio Library/i)).toBeInTheDocument();
  });

  it('opens story creation modal when clicking Post Story button', async () => {
    renderWithProviders();

    const postStoryBtn = screen.getByRole('button', { name: /Post Story \(48h\)/i });
    fireEvent.click(postStoryBtn);

    await waitFor(() => {
      expect(screen.getByText('Create New Post')).toBeInTheDocument();
      expect(screen.getByText('FingerShorts (Stories)')).toBeInTheDocument();
    });
  });
});
