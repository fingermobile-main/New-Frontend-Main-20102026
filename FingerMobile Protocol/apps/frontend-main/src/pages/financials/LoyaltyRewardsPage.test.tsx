import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoyaltyRewardsPage from './LoyaltyRewardsPage';
import { AppProvider } from '../../contexts/AppContext';

describe('LoyaltyRewardsPage Mobile Optimization Tests', () => {
  const renderLoyaltyRewardsPage = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <LoyaltyRewardsPage />
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('renders loyalty rewards header and tier status', () => {
    renderLoyaltyRewardsPage();
    expect(screen.getByText('Loyalty Rewards')).toBeInTheDocument();
    expect(screen.getByText('Your Loyalty Status')).toBeInTheDocument();
    expect(screen.getByText('Claimable Rewards')).toBeInTheDocument();
  });

  it('renders mobile sovereign navigation quick dock', () => {
    renderLoyaltyRewardsPage();
    const dock = screen.getByTestId('loyalty-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByText('Gifts')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
  });
});
