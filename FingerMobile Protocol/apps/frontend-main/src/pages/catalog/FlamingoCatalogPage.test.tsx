import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/catalog/FlamingoCatalogConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="flamingo-catalog-console">Flamingo Catalog Console</div>,
}));

import FlamingoCatalogPage from './FlamingoCatalogPage';

describe('FlamingoCatalogPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders flamingo catalog and quick dock', () => {
    render(
      <MemoryRouter>
        <FlamingoCatalogPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('flamingo-catalog-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Flamingo Store/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Flamingo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Flamingo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});
