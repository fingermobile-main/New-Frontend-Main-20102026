import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/LegalLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="legal-layout">{children}</div>
  ),
}));

import LegalIndexPage from './IndexPage';

describe('LegalIndexPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders legal index and quick dock', () => {
    render(
      <MemoryRouter>
        <LegalIndexPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('legal-layout')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Legal Index/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Service Terms/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Legal Index/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

