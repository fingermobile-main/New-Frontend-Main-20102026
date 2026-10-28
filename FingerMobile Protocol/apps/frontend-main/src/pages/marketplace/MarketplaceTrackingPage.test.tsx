import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ data: [] }),
  },
}));

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

import MarketplaceTrackingPage from './MarketplaceTrackingPage';

describe('MarketplaceTrackingPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders tracking page and quick dock', () => {
    render(
      <MemoryRouter>
        <MarketplaceTrackingPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Marketplace Shop/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Storefront Hub/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Tracking/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

