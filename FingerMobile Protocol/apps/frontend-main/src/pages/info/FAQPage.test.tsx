import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

import FAQPage from './FAQPage';

describe('FAQPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders FAQ page and quick dock', () => {
    render(
      <MemoryRouter>
        <FAQPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Support Desk/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search FAQ/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload FAQ/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

