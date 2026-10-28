import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    member: { id: 'usr-1', username: 'owneruser' },
  }),
}));

jest.mock('../../services/apiService', () => ({
  get: jest.fn().mockImplementation((url: string) => {
    if (url.includes('/playlists/pl-1')) {
      return Promise.resolve({
        id: 'pl-1',
        name: 'Acoustic Vibes',
        ownerId: 'usr-1',
        trackIds: ['t-1', 't-2'],
      });
    }
    if (url.includes('/tracks')) {
      return Promise.resolve([
        { id: 't-1', title: 'Song One', artist: 'Artist One', albumArtUrl: 'https://example.com/1.jpg' },
        { id: 't-2', title: 'Song Two', artist: 'Artist Two', albumArtUrl: 'https://example.com/2.jpg' },
      ]);
    }
    return Promise.resolve([]);
  }),
  delete: jest.fn().mockResolvedValue({ success: true }),
}));

import PlaylistDetailPage from './PlaylistDetailPage';

describe('PlaylistDetailPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders playlist detail and quick dock', async () => {
    render(
      <MemoryRouter initialEntries={['/music/playlist/pl-1']}>
        <Routes>
          <Route path="/music/playlist/:playlistId" element={<PlaylistDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Acoustic Vibes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play First/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Shuffle/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Pin/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
