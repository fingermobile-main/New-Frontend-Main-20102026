import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../services/legalComplianceService', () => ({
  __esModule: true,
  default: {
    submitSupportTicket: jest.fn().mockResolvedValue({ id: 'TCK-100' }),
  },
}));

import ContactSupportPage from './ContactSupportPage';

describe('ContactSupportPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders contact support page and quick dock', () => {
    render(
      <MemoryRouter>
        <ContactSupportPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Help Center/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New Ticket/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Support/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});
