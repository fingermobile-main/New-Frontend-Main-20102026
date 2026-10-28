import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/dashboard/MasterDomainEdgeConsole', () => ({
  MasterDomainEdgeConsole: () => <div data-testid="master-domain-edge-console">Domain Edge Console</div>,
}));

import { DomainEdgeMasterConsolePage } from './DomainEdgeMasterConsolePage';

describe('DomainEdgeMasterConsolePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders domain edge console and quick dock', () => {
    render(
      <MemoryRouter>
        <DomainEdgeMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-domain-edge-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Domain Edge Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Domains/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Domains/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

