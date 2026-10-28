import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CataloguePage from './CataloguePage';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

describe('CataloguePage Mobile Optimization & Behavior', () => {
  it('renders catalogue marketplace title and search bar with 44px min-h', () => {
    render(
      <BrowserRouter>
        <CataloguePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /creative asset catalogue/i })).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText(/search by title, creator, stem, tags/i);
    expect(searchInput.className).toContain('min-h-[44px]');
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <BrowserRouter>
        <CataloguePage />
      </BrowserRouter>
    );

    const mobileDock = screen.getByRole('navigation', { name: /catalogue mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});

