import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/dashboard/MasterInvestorRelationsConsole', () => ({
  MasterInvestorRelationsConsole: () => <div data-testid="master-investor-relations-console">Investor Relations Console</div>,
}));

import { InvestorRelationsMasterConsolePage } from './InvestorRelationsMasterConsolePage';

describe('InvestorRelationsMasterConsolePage', () => {
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
        <InvestorRelationsMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-investor-relations-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Investor Relations Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search IR/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload IR/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

