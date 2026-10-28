import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyStorefrontPage from './MyStorefrontPage';

// Mock AppContext
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

// Mock apiService
jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockImplementation((url) => {
      if (url === '/api/storefront') {
        return Promise.resolve({
          storefronts: [
            {
              id: 'store-1',
              name: 'Artisan Textile Studio',
              coverImage: 'https://example.com/cover.jpg',
              avatar: 'https://example.com/avatar.jpg',
              description: 'Authentic Nigerian tie-dye boutique.'
            }
          ]
        });
      }
      return Promise.resolve({ products: [], stats: {} });
    }),
    put: jest.fn().mockResolvedValue({ success: true }),
    post: jest.fn().mockResolvedValue({ success: true })
  }
}));

// Mock SocialEmbedModal
jest.mock('../components/commerce/SocialEmbedModal', () => ({
  __esModule: true,
  default: () => <div data-testid="social-embed-modal" />
}));

describe('MyStorefrontPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <MyStorefrontPage />
      </BrowserRouter>
    );

  it('renders my storefront header and title', async () => {
    renderComponent();
    expect(await screen.findByText('My Storefront')).toBeInTheDocument();
    expect(screen.getByText(/Manage your storefront and track your sales performance/i)).toBeInTheDocument();
  });

  it('renders navigation tabs across products, analytics and storage', async () => {
    renderComponent();
    expect(await screen.findAllByRole('button', { name: /^overview$/i })).not.toHaveLength(0);
    expect(screen.getAllByRole('button', { name: /^products$/i })).not.toHaveLength(0);
    expect(screen.getByRole('button', { name: /^storage & quota plan$/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', async () => {
    renderComponent();
    expect(await screen.findAllByRole('button', { name: /^overview$/i })).not.toHaveLength(0);
    expect(screen.getAllByRole('button', { name: /^products$/i })).not.toHaveLength(0);
    expect(screen.getByRole('button', { name: /^storage$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^mall$/i })).toBeInTheDocument();
  });
});
