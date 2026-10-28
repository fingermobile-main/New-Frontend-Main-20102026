import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StorefrontDetailPage from './StorefrontDetailPage';

// Mock AppContext
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 25000,
    showToast: jest.fn()
  })
}));

// Mock apiService
jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      id: 'store-101',
      name: 'Lagos Sound Lab',
      description: 'Afrobeats stems and sovereign sound loops.',
      coverImageUrl: 'https://example.com/sound-cover.jpg',
      productCount: 4,
      followerCount: 320,
      rating: 4.9,
      owner: {
        id: 'user-9',
        name: 'DJ Eko',
        membername: 'djeko',
        avatarUrl: 'https://example.com/djeko.jpg',
        isVerified: true,
        stats: { followers: 320, following: 40, posts: 12 }
      },
      products: [
        {
          id: 'p-1',
          name: 'Amapiano Log Drum Stem Pack',
          price: 50,
          category: 'Audio',
          imageUrl: 'https://example.com/drum.jpg'
        }
      ]
    }),
    post: jest.fn().mockResolvedValue({ success: true, data: {} })
  }
}));

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'store-101' })
}));

describe('StorefrontDetailPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <StorefrontDetailPage />
      </BrowserRouter>
    );

  it('renders storefront hero details, creator info and product card', async () => {
    renderComponent();
    expect(await screen.findAllByText('Lagos Sound Lab')).not.toHaveLength(0);
    expect(screen.getByText('DJ Eko')).toBeInTheDocument();
    expect(screen.getByText('Amapiano Log Drum Stem Pack')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /instant buy/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', async () => {
    renderComponent();
    expect(await screen.findByRole('button', { name: /^stores$/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^tip$/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^paylink$/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^message$/i })[0]).toBeInTheDocument();
  });
});
