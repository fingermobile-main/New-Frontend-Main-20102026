import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InvestorRelationsPage from './InvestorRelationsPage';
import { AppProvider } from '../contexts/AppContext';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../components/dashboard/InvestorRelationsDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="ir-dashboard">InvestorRelationsDashboard</div>
}));

jest.mock('../services/apiService', () => ({
  ApiService: {
    get: jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({ success: true })
  }
}));

describe('InvestorRelationsPage Component & Sovereign Mobile Quick Dock', () => {
  const renderInvestorRelationsPage = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <InvestorRelationsPage />
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('renders the Investor Relations page header and dashboard', async () => {
    renderInvestorRelationsPage();

    expect(await screen.findByRole('heading', { name: /^Investor Relations$/i })).toBeInTheDocument();
    expect(screen.getByTestId('ir-dashboard')).toBeInTheDocument();
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with all controls', async () => {
    renderInvestorRelationsPage();

    const mobileDock = await screen.findByLabelText(/Investor Relations Mobile Navigation/i);
    expect(mobileDock).toBeInTheDocument();

    const overviewBtn = within(mobileDock).getByRole('button', { name: /^Overview$/i });
    const filingsBtn = within(mobileDock).getByRole('button', { name: /^Filings$/i });
    const kpisBtn = within(mobileDock).getByRole('button', { name: /^KPIs$/i });
    const fileReportBtn = within(mobileDock).getByRole('button', { name: /^File Report$/i });

    expect(overviewBtn).toBeInTheDocument();
    expect(filingsBtn).toBeInTheDocument();
    expect(kpisBtn).toBeInTheDocument();
    expect(fileReportBtn).toBeInTheDocument();

    // Click File Report
    fireEvent.click(fileReportBtn);
    expect(await screen.findByText(/Publish Regulatory Disclosure/i)).toBeInTheDocument();
  });
});
