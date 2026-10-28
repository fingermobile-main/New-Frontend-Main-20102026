import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VerificationPage from './VerificationPage';

// Mock contexts and services
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    ficBalance: 250.75
  })
}));

jest.mock('../components/layout/MainLayout', () => ({ children }: any) => <div data-testid="main-layout">{children}</div>);

jest.mock('../services/identityService', () => ({
  getVerificationStatus: jest.fn().mockResolvedValue({ status: 'pending', kycCompleted: false }),
  sendVerificationCode: jest.fn().mockResolvedValue({ message: 'Code sent', testCode: '123456' }),
  verifyCode: jest.fn().mockResolvedValue({ success: true, message: 'Verified' })
}));

describe('VerificationPage Mobile Optimization', () => {
  it('renders verification page title and method selector', async () => {
    render(
      <BrowserRouter>
        <VerificationPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Account Verification/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile quick dock with Phone, Email, and Verify', () => {
    render(
      <BrowserRouter>
        <VerificationPage />
      </BrowserRouter>
    );

    expect(screen.getAllByRole('button', { name: /^phone$/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /^email$/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /verify/i }).length).toBeGreaterThanOrEqual(1);
  });
});
