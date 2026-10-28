import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/dashboard/MasterEmailCommsConsole', () => ({
  MasterEmailCommsConsole: () => <div data-testid="master-email-comms-console">Email Comms Console</div>,
}));

import { EmailCommsMasterConsolePage } from './EmailCommsMasterConsolePage';

describe('EmailCommsMasterConsolePage', () => {
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
        <EmailCommsMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-email-comms-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Email Comms Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Emails/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Email Comms/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

