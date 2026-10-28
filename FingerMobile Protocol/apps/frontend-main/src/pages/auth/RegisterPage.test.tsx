import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';

// Mock contexts and services
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    setUser: jest.fn(),
    clearAuthData: jest.fn()
  })
}));

jest.mock('../../services/authService', () => ({
  register: jest.fn().mockResolvedValue({ token: 'mock-token', user: { id: 'usr_2', username: 'newuser' } })
}));

jest.mock('../../services/UserProfileSyncService', () => ({
  userProfileSyncService: {
    updateProfile: jest.fn()
  }
}));

describe('RegisterPage Mobile Optimization', () => {
  it('renders registration form and inputs', async () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Create your Sovereign Account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm your password/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile quick dock with Home and Sign In navigation', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /sign in/i }).length).toBeGreaterThanOrEqual(1);
  });
});

