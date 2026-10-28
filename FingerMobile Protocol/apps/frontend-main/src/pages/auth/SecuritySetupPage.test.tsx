import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../services/identityService', () => ({
  identityService: {
    generateBackupCodes: jest.fn().mockResolvedValue(['CODE1', 'CODE2']),
  },
}));

import SecuritySetupPage from './SecuritySetupPage';

describe('SecuritySetupPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders security setup page and quick dock', () => {
    render(
      <MemoryRouter>
        <SecuritySetupPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Back to Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Security/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});
