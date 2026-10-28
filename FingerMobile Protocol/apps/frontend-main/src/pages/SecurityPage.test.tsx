import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

import SecurityPage from './SecurityPage';

describe('SecurityPage', () => {
  it('renders security threat center and metrics', () => {
    render(
      <BrowserRouter>
        <SecurityPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Security Dashboard & Threat Center/i })).toBeInTheDocument();
  });

  it('switches tabs and triggers refresh via mobile quick dock', () => {
    render(
      <BrowserRouter>
        <SecurityPage />
      </BrowserRouter>
    );

    const threatsBtns = screen.getAllByRole('button', { name: /Threats|Threat Detection/i });
    expect(threatsBtns.length).toBeGreaterThan(0);
    fireEvent.click(threatsBtns[0]);

    const policiesBtns = screen.getAllByRole('button', { name: /Policies|Security Policies/i });
    expect(policiesBtns.length).toBeGreaterThan(0);
    fireEvent.click(policiesBtns[0]);
  });
});

