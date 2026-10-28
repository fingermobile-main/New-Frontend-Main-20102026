import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StorefrontCatalogPage from './StorefrontCatalogPage';

// Mock MainLayout
jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

// Mock StorefrontVettingCatalogConsole
jest.mock('../../components/dashboard/catalog/StorefrontVettingCatalogConsole', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="storefront-vetting-catalog-console">
      <h2>General Storefront Product Catalogue & Vetting Console</h2>
      <button>Refresh</button>
      <input placeholder="Search merchant items..." />
    </div>
  )
}));

describe('StorefrontCatalogPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <StorefrontCatalogPage />
      </BrowserRouter>
    );

  it('renders storefront catalog header, breadcrumbs, and console', () => {
    renderComponent();
    expect(screen.getByText('Storefront Portal')).toBeInTheDocument();
    expect(screen.getByText('General Storefront Product Catalogue')).toBeInTheDocument();
    expect(screen.getByTestId('storefront-vetting-catalog-console')).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^catalog$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^filter$/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^refresh$/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /^portal$/i })).toBeInTheDocument();
  });
});
