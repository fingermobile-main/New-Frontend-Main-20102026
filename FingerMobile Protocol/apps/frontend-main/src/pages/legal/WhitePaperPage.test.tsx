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

jest.mock('../../components/legal/DigitalNotarizationModal', () => ({
  DigitalNotarizationModal: () => <div data-testid="notarization-modal">Digital Notarization Modal</div>,
}));

import WhitePaperPage from './WhitePaperPage';

describe('WhitePaperPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders white paper and quick dock', () => {
    render(
      <MemoryRouter>
        <WhitePaperPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('legal-layout')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Legal Center/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Verify Certificate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload WhitePaper/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

