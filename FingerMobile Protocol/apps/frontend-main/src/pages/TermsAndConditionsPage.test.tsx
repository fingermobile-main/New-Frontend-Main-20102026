import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../components/legal/LegalDocumentBanner', () => ({
  __esModule: true,
  default: ({ defaultTitle }: { defaultTitle: string }) => <div data-testid="legal-banner">{defaultTitle}</div>
}));

import TermsAndConditionsPage from './TermsAndConditionsPage';

describe('TermsAndConditionsPage', () => {
  it('renders terms title and legal sections', () => {
    render(
      <BrowserRouter>
        <TermsAndConditionsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Terms and Conditions/i })).toBeInTheDocument();
    expect(screen.getByText(/1. Introduction/i)).toBeInTheDocument();
  });

  it('renders mobile quick dock navigation links', () => {
    render(
      <BrowserRouter>
        <TermsAndConditionsPage />
      </BrowserRouter>
    );

    const homeLinks = screen.getAllByRole('link', { name: /Home/i }); expect(homeLinks.length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /Privacy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
