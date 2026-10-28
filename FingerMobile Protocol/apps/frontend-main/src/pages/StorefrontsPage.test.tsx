import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StorefrontsPage from './StorefrontsPage';

// Mock MainLayout
jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

// Mock AppContext
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 75000,
    showToast: jest.fn()
  })
}));

// Mock apiService
jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ success: true, data: [] }),
    post: jest.fn().mockResolvedValue({ success: true, data: {} })
  }
}));

describe('StorefrontsPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <StorefrontsPage />
      </BrowserRouter>
    );

  it('renders storefronts hero header and active stores', () => {
    renderComponent();
    expect(screen.getByText('Creator Storefronts & Merchant Gateway')).toBeInTheDocument();
    expect(screen.getByText(/Decentralized digital commerce engine for artists/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search store name, creator/i)).toBeInTheDocument();
  });

  it('renders mode tabs across discovery, economics, and registration', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /commission economics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open a storefront/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^stores$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^economics$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^launch$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^products$/i })).toBeInTheDocument();
  });
});

