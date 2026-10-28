import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoanSqrPage from './LoanSqrPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

jest.mock('../services/loanSqrService', () => ({
  loanSqrService: {
    getProducts: jest.fn().mockResolvedValue({
      products: [
        {
          id: 'prod_1',
          name: 'SME Working Capital Booster',
          minAmount: 50000,
          maxAmount: 2000000,
          interestRate: 3.5,
          tenorDays: 90,
          category: 'sme_working_capital',
          tag: 'Most Popular',
          description: 'Instant liquidity for trade expansion'
        }
      ]
    }),
    getActiveLoans: jest.fn().mockResolvedValue({ loans: [] }),
    getApplications: jest.fn().mockResolvedValue({ applications: [] }),
    getPosSettlements: jest.fn().mockResolvedValue({ settlements: [] }),
    getStats: jest.fn().mockResolvedValue({
      totalDisbursed: 540000000,
      activeBorrowers: 4120,
      repaymentRate: 98.7,
      averageCreditScore: 742
    }),
    submitApplication: jest.fn().mockResolvedValue({ success: true })
  }
}));

describe('LoanSqrPage Component & Sovereign Mobile Quick Dock', () => {
  const renderLoanSqrPage = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <LoanSqrPage />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders the LoanSqr founder brand and header', async () => {
    renderLoanSqrPage();

    expect(await screen.findByText(/Mbah Israel Obinna/i)).toBeInTheDocument();
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with all controls', async () => {
    renderLoanSqrPage();

    const mobileDock = await screen.findByLabelText(/LoanSqr Mobile Navigation/i);
    expect(mobileDock).toBeInTheDocument();

    const productsBtn = within(mobileDock).getByRole('button', { name: /^Products$/i });
    const loansBtn = within(mobileDock).getByRole('button', { name: /^Loans$/i });
    const posFloatBtn = within(mobileDock).getByRole('button', { name: /^POS Float$/i });
    const calculatorBtn = within(mobileDock).getByRole('button', { name: /^Calculator$/i });

    expect(productsBtn).toBeInTheDocument();
    expect(loansBtn).toBeInTheDocument();
    expect(posFloatBtn).toBeInTheDocument();
    expect(calculatorBtn).toBeInTheDocument();

    // Click Loans
    fireEvent.click(loansBtn);
    expect(loansBtn.className).toContain('text-indigo-400');

    // Click Calculator
    fireEvent.click(calculatorBtn);
    expect(calculatorBtn.className).toContain('text-indigo-400');
  });
});
