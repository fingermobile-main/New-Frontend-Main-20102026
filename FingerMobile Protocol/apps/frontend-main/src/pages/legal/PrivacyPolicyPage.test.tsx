import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    user: { id: 'usr-1' },
  }),
}));

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

import PrivacyPolicyPage from './PrivacyPolicyPage';

describe('PrivacyPolicyPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders privacy policy and quick dock', () => {
    render(
      <MemoryRouter>
        <PrivacyPolicyPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('legal-layout')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Legal Center/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Privacy Officer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Privacy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});
