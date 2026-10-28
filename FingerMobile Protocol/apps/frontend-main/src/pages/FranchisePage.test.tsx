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
    const metricsBtn = within(nav).getByRole('button', { name: /^Metrics$/i });
    const licenseBtn = within(nav).getByRole('button', { name: /^License$/i });
    const auditsBtn = within(nav).getByRole('button', { name: /^Audits$/i });

    expect(hubsBtn).toBeInTheDocument();
    expect(metricsBtn).toBeInTheDocument();
    expect(licenseBtn).toBeInTheDocument();
    expect(auditsBtn).toBeInTheDocument();

    fireEvent.click(metricsBtn);
    fireEvent.click(licenseBtn);
    fireEvent.click(auditsBtn);
    fireEvent.click(hubsBtn);
  });
});
