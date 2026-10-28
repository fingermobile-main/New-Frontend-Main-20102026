import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/LegalLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="legal-layout">{children}</div>
  ),
}));

jest.mock('../../components/legal/LegalDocumentBanner', () => ({
  __esModule: true,
  default: () => <div data-testid="legal-document-banner">Legal Document Banner</div>,
}));

import CommunityGuidelinesPage from './CommunityGuidelinesPage';

describe('CommunityGuidelinesPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders community guidelines and quick dock', () => {
    render(
      <MemoryRouter>
        <CommunityGuidelinesPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('legal-layout')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Legal Center/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contact Community/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Guidelines/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

