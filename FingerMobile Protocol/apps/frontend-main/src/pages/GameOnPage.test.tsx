import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GameOnPage from './GameOnPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

// Mock ApiService
jest.mock('../services/apiService', () => ({
  ApiService: {
    get: jest.fn().mockResolvedValue({
      matches: [],
      events: [],
      leaderboard: []
    }),
    post: jest.fn().mockResolvedValue({ success: true })
  }
}));

describe('GameOnPage Mobile View & Sovereign Quick Dock', () => {
  it('renders correctly with title and sovereign mobile navigation dock', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <GameOnPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Game On Arena & Sports Hub/i)).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: /GameOn Quick Navigation/i });
    expect(nav).toBeInTheDocument();

    const tourneysBtn = within(nav).getByRole('button', { name: /^Tourneys$/i });
    const matchesBtn = within(nav).getByRole('button', { name: /^Matches$/i });
    const arcadeBtn = within(nav).getByRole('button', { name: /^Arcade$/i });
    const ranksBtn = within(nav).getByRole('button', { name: /^Ranks$/i });

    expect(tourneysBtn).toBeInTheDocument();
    expect(matchesBtn).toBeInTheDocument();
    expect(arcadeBtn).toBeInTheDocument();
    expect(ranksBtn).toBeInTheDocument();

    fireEvent.click(matchesBtn);
    fireEvent.click(arcadeBtn);
    fireEvent.click(ranksBtn);
    fireEvent.click(tourneysBtn);
  });
});
