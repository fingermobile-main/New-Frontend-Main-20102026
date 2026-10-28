import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HallmarkPublicPage from './HallmarkPublicPage';

const mockProducts = [
  {
    id: 'prod-1',
    name: 'Sovereign Hallmark Token',
    description: 'Verifiable physical token',
    price: 99,
    category: 'Hardware',
    images: ['https://placehold.co/200x200']
  }
];

const mockFetchProducts = jest.fn();

// Mock contexts
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    activeSubProfile: null
  })
}));

jest.mock('../../contexts/MarketplaceContext', () => ({
  useMarketplace: () => ({
    products: mockProducts,
    loading: false,
    error: null,
    fetchProducts: mockFetchProducts
  })
}));

describe('HallmarkPublicPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <HallmarkPublicPage />
      </BrowserRouter>
    );

  it('renders hallmark public store header and product cards', () => {
    renderComponent();
    expect(screen.getByText('Hallmark Public Store')).toBeInTheDocument();
    expect(screen.getByText('Sovereign Hallmark Token')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to hallmarks hub/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^store$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^refresh$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^market$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^hub$/i })).toBeInTheDocument();
  });
});
