import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

// Mock contexts and services
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    setUser: jest.fn()
  })
}));

jest.mock('../../services/authService', () => ({
  login: jest.fn().mockResolvedValue({ token: 'mock-token', user: { id: 'usr_1', username: 'mbah' } })
}));

jest.mock('../../services/UserProfileSyncService', () => ({
  userProfileSyncService: {
    updateProfile: jest.fn()
  }
}));

describe('LoginPage Mobile Optimization', () => {
  it('renders login form and inputs', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/FingerMobile/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin, user@fingermobileprotocol.com/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile quick dock with Home, Biometric, and Register', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /biometric/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });
});
