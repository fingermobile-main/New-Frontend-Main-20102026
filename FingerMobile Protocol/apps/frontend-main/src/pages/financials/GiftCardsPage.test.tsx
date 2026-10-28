import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GiftCardsPage from './GiftCardsPage';
import { AppProvider } from '../../contexts/AppContext';

describe('GiftCardsPage Mobile Optimization Tests', () => {
  const renderGiftCardsPage = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <GiftCardsPage />
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('renders gift cards title and action tabs', () => {
    renderGiftCardsPage();
    expect(screen.getByText('Gift Cards')).toBeInTheDocument();
    expect(screen.getAllByText('Your Gift Cards').length).toBeGreaterThan(0);
    expect(screen.getByText('Buy Gift Cards')).toBeInTheDocument();
    expect(screen.getByText('Redeem Gift Card')).toBeInTheDocument();
  });

  it('renders mobile sovereign navigation quick dock', () => {
    renderGiftCardsPage();
    const dock = screen.getByTestId('giftcards-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByText('My Cards')).toBeInTheDocument();
    expect(screen.getByText('Buy Card')).toBeInTheDocument();
    expect(screen.getByText('Redeem')).toBeInTheDocument();
  });
});
