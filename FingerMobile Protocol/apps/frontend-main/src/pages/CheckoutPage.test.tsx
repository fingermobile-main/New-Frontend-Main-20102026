import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CheckoutPage from './CheckoutPage';

// Mock AppContext
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 50000,
    showToast: jest.fn()
  })
}));

// Mock MarketplaceContext
jest.mock('../contexts/MarketplaceContext', () => ({
  useMarketplace: () => ({
    cart: [
      {
        id: 'c-1',
        name: 'Sovereign Leather Journal',
        price: 45,
        quantity: 2,
        image: 'https://example.com/journal.jpg'
      }
    ],
    placeOrder: jest.fn().mockResolvedValue(true)
  })
}));

// Mock AuthContext
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u-1', name: 'Buyer Test' }
  })
}));

describe('CheckoutPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>
    );

  it('renders checkout header and order summary', () => {
    renderComponent();
    expect(screen.getByText('Checkout & Payment')).toBeInTheDocument();
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Sovereign Leather Journal')).toBeInTheDocument();
  });

  it('renders place order action button and gift/paylink triggers', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /place order now/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^gift$/i })[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^paylink$/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^mall$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^vault$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^pay$/i })).toBeInTheDocument();
  });
});
