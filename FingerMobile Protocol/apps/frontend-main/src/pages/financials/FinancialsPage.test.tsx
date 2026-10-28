import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FinancialsPage from './FinancialsPage';
import { AppProvider } from '../../contexts/AppContext';

describe('FinancialsPage Mobile Optimization Tests', () => {
  const renderFinancialsPage = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <FinancialsPage />
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('renders financials header title and tabs', () => {
    renderFinancialsPage();
    expect(screen.getByText('Financial Ecosystem & Liquidity Matrix')).toBeInTheDocument();
    expect(screen.getAllByText('Wallet').length).toBeGreaterThan(0);
    expect(screen.getByText('FIC Vault')).toBeInTheDocument();
    expect(screen.getByText('Subscriptions')).toBeInTheDocument();
  });

  it('renders mobile sovereign navigation quick dock', () => {
    renderFinancialsPage();
    const dock = screen.getByTestId('financials-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByText('Monetize')).toBeInTheDocument();
    expect(screen.getByText('Plans')).toBeInTheDocument();
  });
});
