import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GovernancePage from './GovernancePage';
import { AppProvider } from '../contexts/AppContext';

jest.mock('../layouts/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../components/GovernanceDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="governance-dashboard">GovernanceDashboard</div>
}));

jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">PlatformOwnershipCard</div>
}));

describe('GovernancePage Component & Sovereign Mobile Quick Dock', () => {
  const renderGovernancePage = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <GovernancePage />
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('renders the governance headings and policies', () => {
    renderGovernancePage();

    expect(screen.getByRole('heading', { name: /AI-Driven Integrity/i })).toBeInTheDocument();
    expect(screen.getByText(/Privacy Manifesto/i)).toBeInTheDocument();
    expect(screen.getByText(/Fair Usage Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Ethics Code/i)).toBeInTheDocument();
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with all controls', () => {
    renderGovernancePage();

    const mobileDock = screen.getByLabelText(/Governance Mobile Navigation/i);
    expect(mobileDock).toBeInTheDocument();

    const overviewBtn = screen.getByRole('button', { name: /^Overview$/i });
    const integrityBtn = screen.getByRole('button', { name: /^Integrity$/i });
    const policiesBtn = screen.getByRole('button', { name: /^Policies$/i });
    const reportBtn = screen.getByRole('button', { name: /^Report$/i });

    expect(overviewBtn).toBeInTheDocument();
    expect(integrityBtn).toBeInTheDocument();
    expect(policiesBtn).toBeInTheDocument();
    expect(reportBtn).toBeInTheDocument();

    // Click Integrity
    fireEvent.click(integrityBtn);
    expect(integrityBtn.className).toContain('text-blue-600');

    // Click Policies
    fireEvent.click(policiesBtn);
    expect(policiesBtn.className).toContain('text-blue-600');
  });
});
