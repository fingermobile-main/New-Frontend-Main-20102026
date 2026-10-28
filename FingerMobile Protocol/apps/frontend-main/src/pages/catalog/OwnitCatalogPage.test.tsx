import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OwnitCatalogPage from './OwnitCatalogPage';

// Mock MainLayout and OwnitCatalogConsole
jest.mock('../../components/layout/MainLayout', () => ({ children }: { children: React.ReactNode }) => (
  <div data-testid="main-layout">{children}</div>
));

jest.mock('../../components/dashboard/catalog/OwnitCatalogConsole', () => () => (
  <div data-testid="ownit-catalog-console">
    <h2>Ownit Catalog Console Mock</h2>
  </div>
));

describe('OwnitCatalogPage Mobile Optimization', () => {
  it('renders breadcrumb navigation back to OwnIt Store', () => {
    render(
      <MemoryRouter>
        <OwnitCatalogPage />
      </MemoryRouter>
    );

    expect(screen.getByText('OwnIt Store')).toBeInTheDocument();
    expect(screen.getByText('OwnIt Product Catalogue')).toBeInTheDocument();
    expect(screen.getByTestId('ownit-catalog-console')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with all 3 links', () => {
    render(
      <MemoryRouter>
        <OwnitCatalogPage />
      </MemoryRouter>
    );

    const mobileDock = screen.getByTestId('ownit-catalog-mobile-dock');
    expect(mobileDock).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /OwnIt Mall/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Catalogue/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Tracking/i })).toBeInTheDocument();
  });
});
