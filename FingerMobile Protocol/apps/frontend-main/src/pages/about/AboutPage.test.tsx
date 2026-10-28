import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AboutPage from './AboutPage';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 250.75,
    showToast: jest.fn(),
  }),
}));

jest.mock('../../components/GiftModal', () => {
  return function MockGiftModal() {
    return <div data-testid="mock-gift-modal" />;
  };
});

jest.mock('../../components/CreatePaylinkModal', () => {
  return function MockCreatePaylinkModal() {
    return <div data-testid="mock-paylink-modal" />;
  };
});

jest.mock('../../layouts/MainLayout', () => {
  return function MockMainLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="main-layout">{children}</div>;
  };
});

describe('AboutPage (Subpage Screen)', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  test('renders AboutPage header, tabs, and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByText(/Production Screens/i)).toBeInTheDocument();
    expect(screen.getByText(/250.75 FIC/i)).toBeInTheDocument();

    // Check Sovereign Mobile Navigation Quick Dock buttons
    const founderBtn = screen.getByRole('button', { name: /Founder Tab/i });
    expect(founderBtn).toBeInTheDocument();
    fireEvent.click(founderBtn);

    const techBtn = screen.getByRole('button', { name: /Technology Tab/i });
    fireEvent.click(techBtn);

    const govBtn = screen.getByRole('button', { name: /Governance Tab/i });
    fireEvent.click(govBtn);

    const contactBtn = screen.getByRole('button', { name: /Contact Tab/i });
    fireEvent.click(contactBtn);

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
