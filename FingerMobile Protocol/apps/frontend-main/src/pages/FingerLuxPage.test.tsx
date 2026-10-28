import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FingerLuxPage from './FingerLuxPage';
import { ToastProvider } from '../components/Toast';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

// Mock useFingerLux
jest.mock('../hooks/useFingerLux', () => ({
  useFingerLux: () => ({
    loading: false,
    error: null,
    refreshData: jest.fn()
  })
}));

describe('FingerLuxPage Mobile View & Sovereign Quick Dock', () => {
  it('renders correctly with header and sovereign quick dock', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              <FingerLuxPage />
            </ToastProvider>
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation', { name: /FingerLux Quick Navigation/i });
    expect(nav).toBeInTheDocument();

    const catalogBtn = within(nav).getByRole('button', { name: /^Catalog$/i });
    const calendarBtn = within(nav).getByRole('button', { name: /^Calendar$/i });
    const posBtn = within(nav).getByRole('button', { name: /^POS$/i });
    const revenueBtn = within(nav).getByRole('button', { name: /^Revenue$/i });

    expect(catalogBtn).toBeInTheDocument();
    expect(calendarBtn).toBeInTheDocument();
    expect(posBtn).toBeInTheDocument();
    expect(revenueBtn).toBeInTheDocument();

    fireEvent.click(calendarBtn);
    fireEvent.click(posBtn);
    fireEvent.click(revenueBtn);
    fireEvent.click(catalogBtn);
  });
});
