import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const mockSubmitTicket = jest.fn().mockResolvedValue({ success: true });

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 1200,
    showToast: jest.fn(),
    handleSubmitTicket: mockSubmitTicket,
  }),
}));

import SupportPage from './SupportPage';

describe('SupportPage', () => {
  it('renders support center and ticket form', () => {
    render(
      <BrowserRouter>
        <SupportPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Support Center/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Submit a Support Ticket/i })).toBeInTheDocument();
  });

  it('triggers quick dock actions', () => {
    render(
      <BrowserRouter>
        <SupportPage />
      </BrowserRouter>
    );

    const ticketBtns = screen.getAllByRole('button', { name: /New Ticket|Submit Ticket/i });
    expect(ticketBtns.length).toBeGreaterThan(0);
    fireEvent.click(ticketBtns[0]);
  });
});
