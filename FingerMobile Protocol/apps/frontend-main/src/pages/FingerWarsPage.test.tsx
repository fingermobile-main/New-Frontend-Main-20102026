import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FingerWarsPage from './FingerWarsPage';

// Mock contexts and services
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 2500,
    showToast: jest.fn()
  })
}));

jest.mock('../services/apiService', () => ({
  ApiService: {
    get: jest.fn().mockResolvedValue({
      data: {
        tournaments: [
          {
            id: 't-1',
            title: 'Genesis Finger Clash',
            description: 'Weekly standard knockout championship with instant escrow.',
            entry_fee: 50,
            currency: 'FIC',
            prize_pool: 5000,
            max_participants: 64,
            status: 'registration',
            is_public: true,
            created_at: '2026-10-01'
          }
        ],
        challenges: [
          {
            id: 'c-1',
            title: 'Daily Tap Master',
            description: 'Achieve 120 taps in 10 seconds.',
            category: 'daily',
            progress: 100,
            reward: 25,
            is_claimed: false
          }
        ],
        leaderboard: [
          {
            rank: 1,
            username: 'FingerSovereign',
            elo_rating: 2450,
            wins: 142,
            losses: 12,
            tier: 'Grandmaster'
          }
        ],
        matches: [
          {
            id: 'm-1',
            player1: 'SpeedKing',
            player2: 'Open Lobby Challenge',
            wager: 50,
            status: 'lobby'
          }
        ]
      }
    }),
    post: jest.fn().mockResolvedValue({ success: true })
  }
}));

jest.mock('../services/VoiceLineService', () => ({
  __esModule: true,
  default: {
    playCommentaryVoiceLine: jest.fn()
  }
}));

jest.mock('../components/layout/MainLayout', () => ({ children }: { children: React.ReactNode }) => (
  <div data-testid="main-layout">{children}</div>
));

describe('FingerWarsPage Mobile Optimization', () => {
  it('renders the FingerWars hero header and active balance', async () => {
    render(
      <MemoryRouter>
        <FingerWarsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'FingerWars Battle Arena' })).toBeInTheDocument();
    expect(screen.getByText('War Chest')).toBeInTheDocument();
    expect(screen.getByText('2,500 FIC')).toBeInTheDocument();
  });

  it('renders championship tournament card and supports registration', async () => {
    render(
      <MemoryRouter>
        <FingerWarsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Genesis Finger Clash')).toBeInTheDocument();
    });

    expect(screen.getByText(/5,000 FIC Pool/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register \(50 FIC\)/i })).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with all 5 touch targets', () => {
    render(
      <MemoryRouter>
        <FingerWarsPage />
      </MemoryRouter>
    );

    const mobileDock = screen.getByTestId('finger-wars-mobile-dock');
    expect(mobileDock).toBeInTheDocument();

    expect(screen.getAllByRole('button', { name: /Tourneys/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Quests/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Lobby/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Ranks/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Battle/i }).length).toBeGreaterThan(0);
  });

  it('switches to quests tab and allows claiming completed reward', async () => {
    render(
      <MemoryRouter>
        <FingerWarsPage />
      </MemoryRouter>
    );

    const questsBtns = screen.getAllByRole('button', { name: /Quests/i });
    fireEvent.click(questsBtns[0]);

    await waitFor(() => {
      expect(screen.getByText('Daily Tap Master')).toBeInTheDocument();
    });

    const claimBtn = screen.getByRole('button', { name: /Claim Reward/i });
    expect(claimBtn).toBeInTheDocument();
    fireEvent.click(claimBtn);
  });

  it('switches to lobby tab and opens PvP challenge modal with 44px inputs', async () => {
    render(
      <MemoryRouter>
        <FingerWarsPage />
      </MemoryRouter>
    );

    const lobbyBtns = screen.getAllByRole('button', { name: /Lobby/i });
    fireEvent.click(lobbyBtns[0]);

    await waitFor(() => {
      expect(screen.getByText('SpeedKing')).toBeInTheDocument();
    });

    const postWagerBtn = screen.getByRole('button', { name: /Post Wager Match/i });
    fireEvent.click(postWagerBtn);

    expect(screen.getByRole('heading', { level: 3, name: 'Create PvP Challenge' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Leave empty for Open Public Lobby/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Deploy Challenge/i })).toBeInTheDocument();
  });
});
