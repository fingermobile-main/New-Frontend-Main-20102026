import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/catalog/MarketplaceCatalogConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="marketplace-catalog-console">Marketplace Catalog Console</div>,
}));

import MarketplaceCatalogPage from './MarketplaceCatalogPage';

describe('MarketplaceCatalogPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders marketplace catalog and quick dock', () => {
    render(
      <MemoryRouter>
        <MarketplaceCatalogPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('marketplace-catalog-console')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Marketplace Store/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Search Catalog/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Catalog/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});
