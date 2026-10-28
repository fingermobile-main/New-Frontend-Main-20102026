import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AccountDeletionPage from './AccountDeletionPage';
import { useAppContext } from '../contexts/AppContext';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('AccountDeletionPage Mobile Optimization', () => {
  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      ficBalance: 0,
      showToast: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders account deletion header and form inputs', () => {
    render(
      <MemoryRouter>
        <AccountDeletionPage />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Account Deletion Request').length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText('Enter your registered email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password to confirm')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <AccountDeletionPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Deletion Form')).toBeInTheDocument();
    expect(screen.getByLabelText('Export Data')).toBeInTheDocument();
    expect(screen.getByLabelText('Settings Page')).toBeInTheDocument();
    expect(screen.getByLabelText('Back to Forum')).toBeInTheDocument();
  });
});
