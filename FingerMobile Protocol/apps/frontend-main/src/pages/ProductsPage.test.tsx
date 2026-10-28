import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductsPage from './ProductsPage';

const mockProducts = [
  {
    id: 'p-1',
    name: 'Handcrafted Adire Shirt',
    category: 'Fashion',
    price: 95,
    rating: 4.9,
    description: 'Authentic Nigerian indigo tie-dye fashion garment.'
  }
];

// Mock MarketplaceContext with stable reference
jest.mock('../contexts/MarketplaceContext', () => ({
  useMarketplace: () => ({
    products: mockProducts,
    loading: false,
    error: null,
    getProductById: jest.fn(),
    handleAddToCart: jest.fn()
  })
}));

// Mock ProductCard
jest.mock('../components/ProductCard', () => ({
  __esModule: true,
  default: ({ product }: any) => <div data-testid="product-card">{product.name}</div>
}));

describe('ProductsPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ProductsPage />
      </BrowserRouter>
    );

  it('renders products page header, search and select filters', () => {
    renderComponent();
    expect(screen.getByText('Our Products')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    expect(screen.getByTestId('product-card')).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^catalog$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^search$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^filter$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^stores$/i })).toBeInTheDocument();
  });
});
