import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/dashboard/MasterMemberRetentionConsole', () => ({
  MasterMemberRetentionConsole: () => <div data-testid="master-member-retention-console">Member Retention Console</div>,
}));

import { MemberRetentionMasterConsolePage } from './MemberRetentionMasterConsolePage';

describe('MemberRetentionMasterConsolePage', () => {
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
        <MemberRetentionMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-member-retention-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Member Retention Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Retention/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Retention/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

