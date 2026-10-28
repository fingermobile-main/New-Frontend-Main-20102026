import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HallmarkPage from './HallmarkPage';

// Mock AppContext
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 1250
  })
}));

// Mock AdBanner & FixedAdBanner
jest.mock('../components/AdBanner', () => () => <div data-testid="ad-banner">AdBanner</div>);
jest.mock('../components/FixedAdBanner', () => () => <div data-testid="fixed-ad-banner">FixedAdBanner</div>);
jest.mock('../components/BurgerMenu', () => () => <div data-testid="burger-menu">BurgerMenu</div>);

// Mock HallmarksService
jest.mock('../services/HallmarksService', () => ({
  hallmarksService: {
    getAllHallmarks: jest.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'Community Builder',
          description: 'Created 50+ community posts that received over 1000 likes',
          rarity: 'gold',
          createdAt: '2031-06-15',
          icon: 'https://placehold.co/100x100/f59e0b/white?text=🏅'
        }
      ]
    })
  }
}));

describe('HallmarkPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <HallmarkPage />
      </BrowserRouter>
    );

  it('renders hallmark page title, search, and balance', () => {
    renderComponent();
    expect(screen.getByText('Hallmark Achievements')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search achievements/i)).toBeInTheDocument();
    expect(screen.getByText(/1250/i)).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^hallmarks$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^search$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^leaders$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^market$/i })).toBeInTheDocument();
  });
});

