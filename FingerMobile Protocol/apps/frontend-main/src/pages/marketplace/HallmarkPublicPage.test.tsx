import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    activeSubProfile: null,
  }),
}));

jest.mock('../../contexts/MarketplaceContext', () => ({
  useMarketplace: () => ({
    products: [],
    loading: false,
    error: null,
    fetchProducts: jest.fn(),
  }),
}));

import HallmarkPublicPage from './HallmarkPublicPage';

describe('HallmarkPublicPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders hallmark page and quick dock', () => {
    render(
      <MemoryRouter>
        <HallmarkPublicPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Hallmark Public Store/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Marketplace Store/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Products/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Products/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

