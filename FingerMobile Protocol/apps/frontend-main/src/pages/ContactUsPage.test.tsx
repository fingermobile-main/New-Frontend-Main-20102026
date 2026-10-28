import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContactUsPage from './ContactUsPage';

// Mock contexts and services
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 1450,
    showToast: jest.fn(),
  }),
}));

jest.mock('../services/legalComplianceService', () => ({
  __esModule: true,
  default: {
    submitContact: jest.fn().mockResolvedValue({ success: true }),
  },
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('ContactUsPage Mobile Suite', () => {
  it('renders contact us header and form fields', () => {
    render(
      <BrowserRouter>
        <ContactUsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Contact FingerMobile™©®/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile navigation quick dock controls', () => {
    render(
      <BrowserRouter>
        <ContactUsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /Call/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Form/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Portal/i })).toBeInTheDocument();
  });
});
