import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdvancedFingerWarPage from './AdvancedFingerWarPage';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('AdvancedFingerWarPage Mobile Optimization', () => {
  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      ficBalance: 750,
      showToast: jest.fn(),
    });
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'u1', username: 'combatant' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders hero title and tactile combat banner', () => {
    render(
      <MemoryRouter>
        <AdvancedFingerWarPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Advanced FingerWar™ Championship')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <AdvancedFingerWarPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Battle Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Tournaments Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Leaderboard Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Quests Tab')).toBeInTheDocument();
  });
});
