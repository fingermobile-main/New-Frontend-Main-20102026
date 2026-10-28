import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SubscriptionsPage from './SubscriptionsPage';
import { AppProvider } from '../../contexts/AppContext';

describe('SubscriptionsPage Mobile Optimization Tests', () => {
  const renderSubscriptionsPage = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <SubscriptionsPage />
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('renders subscriptions studio title and graphical cards', () => {
    renderSubscriptionsPage();
    expect(screen.getByText('Subscriptions, Passes & FIC Management')).toBeInTheDocument();
    expect(screen.getByText('Create New Card')).toBeInTheDocument();
    expect(screen.getByText(/Graphical Subscription Cards/i)).toBeInTheDocument();
  });

  it('renders mobile sovereign navigation quick dock', () => {
    renderSubscriptionsPage();
    const dock = screen.getByTestId('subscriptions-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByText('Plans')).toBeInTheDocument();
    expect(screen.getByText('Audit')).toBeInTheDocument();
    expect(screen.getByText('Tokens')).toBeInTheDocument();
    expect(screen.getByText('+ Card')).toBeInTheDocument();
  });
});

