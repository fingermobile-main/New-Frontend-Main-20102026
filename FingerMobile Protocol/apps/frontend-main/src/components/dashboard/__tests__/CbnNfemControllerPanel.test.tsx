import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CbnNfemControllerPanel } from '../CbnNfemControllerPanel';
import { cbnNfemIngestionService } from '../../../services/cbnNfemIngestionService';

describe('CbnNfemControllerPanel Component', () => {
  beforeEach(() => {
    cbnNfemIngestionService.resetToDefaultTape();
  });

  it('renders the CBN NFEM Controller Panel with official branding and metrics', () => {
    render(<CbnNfemControllerPanel />);

    // Header check
    expect(
      screen.getByText('Central Bank of Nigeria (CBN) NFEM Ingestion Engine & REER Controller')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Autonomous ingestion of the official Central Bank of Nigeria daily rate/i)
    ).toBeInTheDocument();

    // Check VWAP Card
    expect(screen.getByText('Daily NFEM VWAP Rate')).toBeInTheDocument();

    // Check FIC Parity Anchor Card (₦65.00 / $0.05)
    expect(screen.getByText('Calibrated FIC Parity')).toBeInTheDocument();
    expect(screen.getAllByText('₦65.00').length).toBeGreaterThan(0);
    expect(screen.getByText('1 FIC = $0.05 USD')).toBeInTheDocument();
    expect(
      screen.getByText(/Strict protocol standard: 1 USD = 20 FIC/i)
    ).toBeInTheDocument();

    // Check REER Index Card
    expect(screen.getByText('Composite REER Index')).toBeInTheDocument();
    expect(screen.getAllByText('FAIR_VALUE').length).toBeGreaterThan(0);
  });

  it('renders Methodology 1 (VWAP Interbank Tape and formula)', () => {
    render(<CbnNfemControllerPanel />);

    expect(
      screen.getByText('Methodology 1: Volume-Weighted Average Price (VWAP) Calculation')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Bloomberg BMatch Interbank Order Book/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Daily NFEM Rate = ∑ \(Price of Transaction × Volume of Transaction\) ÷ Total Daily Turnover Volume/i)
    ).toBeInTheDocument();
  });

  it('renders Methodology 2 (Macroeconomic Structural Variables telemetry)', () => {
    render(<CbnNfemControllerPanel />);

    expect(
      screen.getByText('Methodology 2: Macroeconomic Structural Drivers')
    ).toBeInTheDocument();
    expect(screen.getByText(/1\. Money Supply Differentials/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Foreign Exchange Turnover/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Inflation Variance \(CPI Gap\)/i)).toBeInTheDocument();
    expect(screen.getByText('+30.3% Gap')).toBeInTheDocument();
  });

  it('renders Methodology 3 (6-partner BIS REER basket table)', () => {
    render(<CbnNfemControllerPanel />);

    expect(
      screen.getByText(/The Real Effective Exchange Rate \(REER\) Matrix \(Bank for International Settlements Methodology\)/i)
    ).toBeInTheDocument();

    // Verify 6 trade partner currencies are listed in the table
    expect(screen.getByText(/People's Republic of China/i)).toBeInTheDocument();
    expect(screen.getByText(/European Union/i)).toBeInTheDocument();
    expect(screen.getByText(/United States/i)).toBeInTheDocument();
    expect(screen.getByText(/Republic of India/i)).toBeInTheDocument();
    expect(screen.getByText(/United Kingdom/i)).toBeInTheDocument();
    expect(screen.getByText(/Japan/i)).toBeInTheDocument();

    // Check partner weights (e.g., China 28%, EU 24%)
    expect(screen.getByText('28%')).toBeInTheDocument();
    expect(screen.getByText('24%')).toBeInTheDocument();
  });

  it('toggles the autonomous daily scheduler', () => {
    render(<CbnNfemControllerPanel />);

    const schedulerBtn = screen.getByText(/Auto-Timer: OFF/i);
    fireEvent.click(schedulerBtn);

    expect(screen.getByText(/Auto-Timer: ON/i)).toBeInTheDocument();

    // Toggle off
    fireEvent.click(screen.getByText(/Auto-Timer: ON/i));
    expect(screen.getByText(/Auto-Timer: OFF/i)).toBeInTheDocument();
  });

  it('allows opening trade simulator modal and injecting an interbank transaction', async () => {
    render(<CbnNfemControllerPanel />);

    // Click "Simulate Interbank Trade" button
    const openModalBtn = screen.getByText('Simulate Interbank Trade');
    fireEvent.click(openModalBtn);

    // Check modal opened
    expect(screen.getByText('Simulate Interbank Order Book Trade')).toBeInTheDocument();

    // Inspect pre-populated dealer input and change value
    const dealerInput = screen.getByDisplayValue('Standard Chartered Bank Nigeria');
    fireEvent.change(dealerInput, { target: { value: 'Zenith Bank Treasury Desk' } });

    // Submit trade
    const submitBtn = screen.getByText('Submit Trade to BMatch Tape');
    fireEvent.click(submitBtn);

    // Modal closes
    await waitFor(() => {
      expect(
        screen.queryByText('Simulate Interbank Order Book Trade')
      ).not.toBeInTheDocument();
    });

    // Check newly added transaction is visible in interbank tape
    expect(screen.getByText('Zenith Bank Treasury Desk')).toBeInTheDocument();
  });
});
