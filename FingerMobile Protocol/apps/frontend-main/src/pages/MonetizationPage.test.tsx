import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MonetizationPage from './MonetizationPage';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

describe('MonetizationPage Component', () => {
  it('renders Monetization Management heading and default revenue streams', () => {
    render(
      <BrowserRouter>
        <MonetizationPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Monetization Management/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Revenue Stream/i })).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', () => {
    render(
      <BrowserRouter>
        <MonetizationPage />
      </BrowserRouter>
    );

    const nav = screen.getByRole('navigation', { name: /Monetization Management Mobile Navigation/i });
    expect(nav).toBeInTheDocument();

    const streamsBtn = within(nav).getByRole('button', { name: /^Streams$/i });
    const plansBtn = within(nav).getByRole('button', { name: /^Plans$/i });
    const ledgerBtn = within(nav).getByRole('button', { name: /^Ledger$/i });
    const analyticsBtn = within(nav).getByRole('button', { name: /^Analytics$/i });

    expect(streamsBtn).toBeInTheDocument();
    expect(plansBtn).toBeInTheDocument();
    expect(ledgerBtn).toBeInTheDocument();
    expect(analyticsBtn).toBeInTheDocument();

    fireEvent.click(plansBtn);
  });
});
