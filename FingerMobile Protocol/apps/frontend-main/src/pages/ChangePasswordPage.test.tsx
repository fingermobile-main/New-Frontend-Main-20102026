import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChangePasswordPage from './ChangePasswordPage';

// Mock authService and useToast
jest.mock('../services/authService', () => ({
  changePassword: jest.fn().mockResolvedValue({}),
  clearMustChangePasswordFlag: jest.fn()
}));

jest.mock('../hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('ChangePasswordPage Mobile Optimization', () => {
  it('renders change password form and input fields', async () => {
    render(
      <BrowserRouter>
        <ChangePasswordPage />
      </BrowserRouter>
    );

    expect(screen.getAllByText(/Change Password/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByPlaceholderText(/Enter current password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter new password/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile quick dock with Forum and Login navigation', () => {
    render(
      <BrowserRouter>
        <ChangePasswordPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /forum/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
