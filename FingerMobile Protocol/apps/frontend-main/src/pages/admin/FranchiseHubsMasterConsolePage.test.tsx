import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/dashboard/MasterFranchiseHubsConsole', () => ({
  MasterFranchiseHubsConsole: () => <div data-testid="master-franchise-hubs-console">Franchise Hubs Console</div>,
}));

import { FranchiseHubsMasterConsolePage } from './FranchiseHubsMasterConsolePage';

describe('FranchiseHubsMasterConsolePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders console and quick dock', () => {
    render(
      <MemoryRouter>
        <FranchiseHubsMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-franchise-hubs-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Franchise Hubs Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Hubs/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Hubs/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

