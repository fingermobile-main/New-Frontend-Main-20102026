import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StorefrontPage from './StorefrontPage';

// Mock MainLayout
jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

// Mock AppContext
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    member: { id: 'u-1', name: 'Merchant Test' },
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

describe('StorefrontPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <StorefrontPage />
      </BrowserRouter>
    );

  it('renders page header and title correctly', () => {
    renderComponent();
    expect(screen.getByText('Storefronts')).toBeInTheDocument();
    expect(screen.getByText('Mall & Dashboard')).toBeInTheDocument();
  });

  it('renders tab buttons across catalog and merchant dashboard', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /browse storefronts mall/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open merchant dashboard/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^mall$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^merchant$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^catalog$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^copilot$/i })).toBeInTheDocument();
  });
});
