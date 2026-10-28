import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EmailServiceConsolePage from './EmailServiceConsolePage';

// Mock PageHeader and AppContext
jest.mock('../../../components/PageHeader', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="page-header">{title}</div>
}));

jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

// Mock apiService
jest.mock('../../../services/apiService', () => ({
  apiService: {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ data: {} })
  }
}));

describe('EmailServiceConsolePage Mobile Integration', () => {
  it('renders enterprise email suite heading and metrics', () => {
    render(
      <MemoryRouter>
        <EmailServiceConsolePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Enterprise Email & Deliverability Suite/i })).toBeInTheDocument();
    expect(screen.getByText(/Deliverability Score/i)).toBeInTheDocument();
    expect(screen.getByText(/98\/100 A\+/i)).toBeInTheDocument();
    expect(screen.getByText(/IP Warm-up Stage/i)).toBeInTheDocument();
  });

  it('renders quick dock navigation items', () => {
    render(
      <MemoryRouter>
        <EmailServiceConsolePage />
      </MemoryRouter>
    );

    expect(screen.getAllByRole('button', { name: /Templates/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Composer/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Health/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
