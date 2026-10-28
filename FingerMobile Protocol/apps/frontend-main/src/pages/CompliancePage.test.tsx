import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CompliancePage from './CompliancePage';

// Mock contexts
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    currentUser: { id: 'admin-1', membername: 'Auditor' },
    showToast: jest.fn(),
  }),
}));

describe('CompliancePage Mobile Suite', () => {
  it('renders compliance management header and add requirement button', () => {
    render(
      <BrowserRouter>
        <CompliancePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Compliance Management/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Requirement/i })).toBeInTheDocument();
  });

  it('renders sovereign mobile navigation quick dock controls', () => {
    render(
      <BrowserRouter>
        <CompliancePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Rules/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Audits/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Reports/i }).length).toBeGreaterThan(0);
  });
});
