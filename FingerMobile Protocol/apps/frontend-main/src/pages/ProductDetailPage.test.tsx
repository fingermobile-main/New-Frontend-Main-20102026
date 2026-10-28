import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductDetailPage from './ProductDetailPage';

// Mock AppContext
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    openModal: jest.fn()
  })
}));

// Mock MarketplaceContext
jest.mock('../contexts/MarketplaceContext', () => ({
  useMarketplace: () => ({
    products: [
      {
        id: 'prod-123',
        name: 'Sovereign Yoruba Aso-Oke Jacket',
        price: 180,
        description: 'Authentic handwoven ceremonial attire crafted by master artisans.',
        stock: 12,
        rating: 4.8,
        reviewCount: 34,
        category: 'Fashion',
        images: ['https://example.com/aso-oke.jpg']
      }
    ],
    loading: false,
    getProductById: jest.fn(),
    handleAddToCart: jest.fn()
  })
}));

// Mock marketplaceService
jest.mock('../services/marketplaceService', () => ({
  __esModule: true,
  default: {
    getProductById: jest.fn().mockResolvedValue({
      id: 'prod-123',
      name: 'Sovereign Yoruba Aso-Oke Jacket',
      price: 180,
      description: 'Authentic handwoven ceremonial attire crafted by master artisans.',
      stock_quantity: 12,
      avg_rating: 4.8,
      review_count: 34,
      category: 'Fashion',
      image_url: 'https://example.com/aso-oke.jpg'
    })
  }
}));

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'prod-123' })
}));

describe('ProductDetailPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ProductDetailPage />
      </BrowserRouter>
    );

  it('renders product details and actions correctly', async () => {
    renderComponent();
    expect(await screen.findByText('Sovereign Yoruba Aso-Oke Jacket')).toBeInTheDocument();
    expect(screen.getByText(/\$180\.00/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /add to cart/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /buy now/i })[0]).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', async () => {
    renderComponent();
    expect(await screen.findByRole('button', { name: /^catalog$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^add cart$/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /buy now/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /^stores$/i })).toBeInTheDocument();
  });
});
