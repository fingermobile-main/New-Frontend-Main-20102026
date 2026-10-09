import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import LushPressiesPage from '../pages/LushPressiesPage';

describe('LushPressiesPage Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('lush_pressies_consent', 'true');
    localStorage.setItem('lush_pressies_user_pin', '749102');
  });

  it('renders without crashing with Sovereign Feed and Discovery Deck', async () => {
    render(
      <MemoryRouter>
        <LushPressiesPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Alexandria Chen')).toBeInTheDocument();
    });
    expect(screen.getByText('Discovery Deck')).toBeInTheDocument();
    expect(screen.getByText('Mutual Matches')).toBeInTheDocument();
  });

  it('displays feed navigation and mutual matches section', async () => {
    render(
      <MemoryRouter>
        <LushPressiesPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Lush-Pressies Feed')).toBeInTheDocument();
    });
    expect(screen.getByText('Mutual Matches')).toBeInTheDocument();
  });
});

