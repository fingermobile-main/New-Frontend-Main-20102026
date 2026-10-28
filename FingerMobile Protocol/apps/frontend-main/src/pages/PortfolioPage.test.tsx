import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 500,
    showToast: jest.fn(),
  }),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

import PortfolioPage from './PortfolioPage';

describe('PortfolioPage', () => {
  it('renders creator name, bio and sample projects', () => {
    render(
      <BrowserRouter>
        <PortfolioPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Tunde Afolabi/i)).toBeInTheDocument();
    expect(screen.getByText(/Eko Atlantic Architectural Documentary Campaign/i)).toBeInTheDocument();
  });

  it('renders mobile quick dock buttons and switches tab to Photos', () => {
    render(
      <BrowserRouter>
        <PortfolioPage />
      </BrowserRouter>
    );

    const photosBtn = screen.getByRole('button', { name: /^Photos$/i });
    expect(photosBtn).toBeInTheDocument();
    fireEvent.click(photosBtn);

    expect(screen.getByText(/Neon Harbor Reverie/i)).toBeInTheDocument();
  });
});
