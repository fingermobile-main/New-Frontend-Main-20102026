import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/LegalLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="legal-layout">{children}</div>
  ),
}));

import CommunityStandardsNudityPage from './CommunityStandardsNudityPage';

describe('CommunityStandardsNudityPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders community standards and quick dock', () => {
    render(
      <MemoryRouter>
        <CommunityStandardsNudityPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('legal-layout')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Legal Center/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Report Violations/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Standards/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

