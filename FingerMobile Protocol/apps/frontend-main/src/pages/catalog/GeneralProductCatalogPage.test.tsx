import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GeneralProductCatalogPage from './GeneralProductCatalogPage';

// Mock MainLayout
jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

// Mock GeneralProductCatalogConsole
jest.mock('../../components/dashboard/catalog/GeneralProductCatalogConsole', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="general-product-catalog-console">
      <h2>General Product & Services Master Catalogue</h2>
      <button>Sync Live DB</button>
      <button>Ingest Product / Service</button>
      <input placeholder="Search by title, SKU, or specs..." />
    </div>
  )
}));

describe('GeneralProductCatalogPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <GeneralProductCatalogPage />
      </BrowserRouter>
    );

  it('renders general product catalog header, breadcrumbs, and console', () => {
    renderComponent();
    expect(screen.getByText('Master Dashboard')).toBeInTheDocument();
    expect(screen.getByText('General Product Catalogue')).toBeInTheDocument();
    expect(screen.getByTestId('general-product-catalog-console')).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^catalog$/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^ingest$/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /^sync$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^dashboard$/i })).toBeInTheDocument();
  });
});

