import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FlamingoPage from './FlamingoPage';
import { ToastProvider } from '../components/Toast';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

// Mock FlamingoDualLockGuard to immediately render children
jest.mock('../components/commerce/FlamingoDualLockGuard', () => ({
  FlamingoDualLockGuard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('FlamingoPage Mobile View & Sovereign Quick Dock', () => {
  it('renders correctly with runway status and sovereign quick dock', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              <FlamingoPage />
            </ToastProvider>
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation', { name: /Flamingo Quick Navigation/i });
    expect(nav).toBeInTheDocument();

    const runwayBtn = within(nav).getByRole('button', { name: /^Runway$/i });
    const stylistBtn = within(nav).getByRole('button', { name: /^Stylist$/i });
    const outfitsBtn = within(nav).getByRole('button', { name: /^Outfits$/i });
    const bagBtn = within(nav).getByRole('button', { name: /^Bag$/i });

    expect(runwayBtn).toBeInTheDocument();
    expect(stylistBtn).toBeInTheDocument();
    expect(outfitsBtn).toBeInTheDocument();
    expect(bagBtn).toBeInTheDocument();

    fireEvent.click(stylistBtn);
    fireEvent.click(outfitsBtn);
    fireEvent.click(runwayBtn);
    fireEvent.click(bagBtn);

    // Cart drawer should open
    expect(screen.getByText(/Private Discreet Bag/i)).toBeInTheDocument();
  });
});
