import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/dashboard/MasterSupportCareConsole', () => ({
  MasterSupportCareConsole: () => <div data-testid="master-support-care-console">Support Care Console</div>,
}));

import { SupportCareMasterConsolePage } from './SupportCareMasterConsolePage';

describe('SupportCareMasterConsolePage', () => {
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
        <SupportCareMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-support-care-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Support Care Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Support/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Support/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

