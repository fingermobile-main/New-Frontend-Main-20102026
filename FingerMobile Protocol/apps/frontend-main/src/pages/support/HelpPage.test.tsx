import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

import HelpPage from './HelpPage';

describe('HelpPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders help page and quick dock', () => {
    render(
      <MemoryRouter>
        <HelpPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contact Desk/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Help/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Help/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});
