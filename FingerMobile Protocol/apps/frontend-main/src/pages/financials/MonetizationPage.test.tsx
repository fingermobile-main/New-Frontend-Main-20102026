import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MonetizationPage from './MonetizationPage';
import { AppProvider } from '../../contexts/AppContext';

describe('MonetizationPage Mobile Optimization Tests', () => {
  const renderMonetizationPage = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <MonetizationPage />
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('renders sovereign creator monetization title and stats', () => {
    renderMonetizationPage();
    expect(screen.getByText('Sovereign Creator Monetization')).toBeInTheDocument();
    expect(screen.getByText('Lock into FIC Vault')).toBeInTheDocument();
    expect(screen.getByText('Request Instant Payout')).toBeInTheDocument();
    expect(screen.getByText(/Active Revenue Streams/i)).toBeInTheDocument();
  });

  it('renders mobile sovereign navigation quick dock', () => {
    renderMonetizationPage();
    const dock = screen.getByTestId('monetization-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByText('Wallet')).toBeInTheDocument();
    expect(screen.getByText('Vault')).toBeInTheDocument();
    expect(screen.getByText('Payout')).toBeInTheDocument();
  });

  it('interacts with payout button', () => {
    renderMonetizationPage();
    const payoutBtn = screen.getByText('Request Instant Payout');
    expect(payoutBtn).toBeInTheDocument();
    fireEvent.click(payoutBtn);
  });
});
