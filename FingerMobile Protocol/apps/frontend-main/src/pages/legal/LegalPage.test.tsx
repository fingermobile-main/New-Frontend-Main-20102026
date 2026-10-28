import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../services/legalComplianceService', () => ({
  legalComplianceService: {
    submitDMCA: jest.fn().mockResolvedValue({ success: true }),
  },
}));

import LegalPage from './LegalPage';

describe('LegalPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders legal page and quick dock', () => {
    render(
      <MemoryRouter>
        <LegalPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Legal Hub/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /File DMCA/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Reload Legal Hub/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});
