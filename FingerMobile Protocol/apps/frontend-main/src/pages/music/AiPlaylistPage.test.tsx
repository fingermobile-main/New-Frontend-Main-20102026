import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../services/apiService', () => ({
  get: jest.fn().mockResolvedValue({ data: [] }),
  post: jest.fn().mockResolvedValue({ id: 'playlist-1' }),
}));

import AiPlaylistPage from './AiPlaylistPage';

describe('AiPlaylistPage', () => {
  it('renders AI playlist studio and quick dock', () => {
    render(
      <MemoryRouter>
        <AiPlaylistPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/AI Playlist & Audio Novel Studio/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Curate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sample Vibe/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Beatwave/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Dashboard/i })).toBeInTheDocument();
  });
});
