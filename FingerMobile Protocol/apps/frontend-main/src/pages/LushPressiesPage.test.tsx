import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LushPressiesPage from './LushPressiesPage';
import apiService from '../services/apiService';

describe('LushPressiesPage Component', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('lush_pressies_consent', 'true');
    localStorage.setItem('lush_pressies_user_pin', '749102');
  });

  it('renders user profile and LinkedIn-style feed channels', async () => {
    render(
      <MemoryRouter>
        <LushPressiesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Guest Explorer')).toBeInTheDocument();
    });

    expect(screen.getByText('Lush-Pressies Feed')).toBeInTheDocument();
    expect(screen.getAllByText(/Encore™ \(3–5★\)/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Discover Deck').length).toBeGreaterThan(0);
    expect(screen.getByText('Discovery Deck')).toBeInTheDocument();
    expect(screen.getByText('Mutual Matches')).toBeInTheDocument();
  });

  it('navigates to Encore tab and displays 3-5 star member highscores', async () => {
    render(
      <MemoryRouter>
        <LushPressiesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Guest Explorer')).toBeInTheDocument();
    });

    const encoreButtons = screen.getAllByRole('button', { name: /Encore™/i });
    expect(encoreButtons.length).toBeGreaterThan(0);
    fireEvent.click(encoreButtons[0]);

    await waitFor(() => {
      expect(
        screen.getByText('Exclusive 3–5 Star Members & FingerLux Expeditions')
      ).toBeInTheDocument();
    });

    expect(screen.getAllByText('Propose Meet').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Luxury Gift').length).toBeGreaterThan(0);
  });

  it('allows opening Gamification Dashboard modal from rewards section', async () => {
    render(
      <MemoryRouter>
        <LushPressiesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('View Badges & Leaderboard')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('View Badges & Leaderboard'));

    await waitFor(() => {
      expect(
        screen.getByText('Lush Gamification, Streaks & Leaderboard')
      ).toBeInTheDocument();
    });
  });

  it('allows opening Activity Heatmap modal', async () => {
    render(
      <MemoryRouter>
        <LushPressiesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Activity Heatmap')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Activity Heatmap'));

    await waitFor(() => {
      expect(
        screen.getByText('Member Activity Heatmap & Peak Hours')
      ).toBeInTheDocument();
    });
  });

  it('allows opening 5-Month Commitment Milestone modal', async () => {
    render(
      <MemoryRouter>
        <LushPressiesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('5-Month Commitment')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('5-Month Commitment'));

    await waitFor(() => {
      expect(
        screen.getByText('5-Month Commitment Milestone')
      ).toBeInTheDocument();
    });
  });

  it('allows opening Lush Plushies luxury gift catalog modal', async () => {
    render(
      <MemoryRouter>
        <LushPressiesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Catalog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Catalog'));

    await waitFor(() => {
      expect(
        screen.getByText('Lush Plushies Luxury Gift Catalog')
      ).toBeInTheDocument();
    });
  });

  it('allows opening Edit Profile modal and modifying bio', async () => {
    render(
      <MemoryRouter>
        <LushPressiesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Guest Explorer')).toBeInTheDocument();
    });

    const editProfileBtn = screen.getByTitle('Edit Bio, Headline, Avatars & Banners');
    fireEvent.click(editProfileBtn);

    await waitFor(() => {
      expect(
        screen.getByText('Edit Lush Pressies Profile')
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Display Name')).toBeInTheDocument();
    expect(screen.getByText('Bio & Lifestyle Statement')).toBeInTheDocument();
  });

  it('displays PIN Quota gauge and allows opening PIN Packages modal', async () => {
    render(
      <MemoryRouter>
        <LushPressiesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Guest Explorer')).toBeInTheDocument();
    });

    // Check PIN Quota indicators
    expect(screen.getAllByText(/PIN Quota/i).length).toBeGreaterThan(0);

    const buyPinsBtn = screen.getByRole('button', { name: /\+ Buy PINs/i });
    fireEvent.click(buyPinsBtn);

    await waitFor(() => {
      expect(
        screen.getByText('6-Digit PIN Generation Packages & Quota')
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Starter Connector Pack')).toBeInTheDocument();
    expect(screen.getByText('Elite Matchmaker Pack')).toBeInTheDocument();
  });

  it('allows opening unlocked member profile and revoking 6-digit PIN', async () => {
    jest.spyOn(apiService, 'get').mockImplementation(async (path: any) => {
      if (path === '/lushpressies/matches') {
        return { data: { matches: [{ target_user_id: 'nia-1', name: 'Nia Adebayo', pin_exchanged: true }] } } as any;
      }
      return { data: {} } as any;
    });

    render(
      <MemoryRouter>
        <LushPressiesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Guest Explorer')).toBeInTheDocument();
    });

    // Nia Adebayo is an unlocked match with pinExchanged: true in Mutual Matches
    const niaMatches = await screen.findAllByText('Nia Adebayo');
    // The match card is the second one in the discovery sidebar
    fireEvent.click(niaMatches[niaMatches.length - 1]);

    await waitFor(() => {
      expect(screen.getByText('6-Digit PIN Exchanged')).toBeInTheDocument();
    });

    expect(screen.getByText('Change of Mind / Mismatch?')).toBeInTheDocument();
    const revokeBtn = screen.getByRole('button', { name: /Revoke PIN/i });
    fireEvent.click(revokeBtn);

    await waitFor(() => {
      expect(
        screen.getByText('Revoke PIN & Close Connection')
      ).toBeInTheDocument();
    });
  });
});
