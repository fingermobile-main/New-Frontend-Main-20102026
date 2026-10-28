import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FranchisePage from './FranchisePage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

describe('FranchisePage Mobile View & Sovereign Quick Dock', () => {
  it('renders correctly with title and sovereign mobile navigation dock', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <FranchisePage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Global Franchise Network/i)).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: /Franchise Quick Navigation/i });
    expect(nav).toBeInTheDocument();

    const hubsBtn = within(nav).getByRole('button', { name: /^Hubs$/i });
    const tiersBtn = within(nav).getByRole('button', { name: /^Tiers$/i });
    const payoutsBtn = within(nav).getByRole('button', { name: /^Payouts$/i });
    const licenseBtn = within(nav).getByRole('button', { name: /^License$/i });

    expect(hubsBtn).toBeInTheDocument();
    expect(tiersBtn).toBeInTheDocument();
    expect(payoutsBtn).toBeInTheDocument();
    expect(licenseBtn).toBeInTheDocument();

    fireEvent.click(tiersBtn);
    fireEvent.click(payoutsBtn);
    fireEvent.click(licenseBtn);
    fireEvent.click(hubsBtn);
  });
});
