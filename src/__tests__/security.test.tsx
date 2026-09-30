import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SecurityDashboard from '../components/dashboard/SecurityDashboard';
import SecurityEvents from '../components/dashboard/SecurityEvents';
import { useAuth } from '../contexts/AuthContext';
import * as securityService from '../services/securityService';

// Mock the AuthContext
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn()}));

// Mock the securityService
jest.mock('../services/securityService', () => ({
  securityService: {
    getSecuritySettings: jest.fn(),
    sendPhoneVerification: jest.fn(),
    verifyPhone: jest.fn(),
    enableTwoFactor: jest.fn(),
    enableMultiFactor: jest.fn(),
    generateBackupCodes: jest.fn(),
    enrollBiometric: jest.fn(),
    getSecurityEvents: jest.fn()}}));

describe('SecurityDashboard', () => {
  const mockmember = {
    id: 1,
    email: 'test@example.com',
    name: 'Test member',
    phoneVerified: false,
    twoFactorEnabled: false,
    multiFactorEnabled: false,
    biometricEnrolled: false,
    faceIdEnabled: false,
    fingerprintEnabled: false};

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      member: mockmember,
      logout: jest.fn()});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders security dashboard with all sections', async () => {
    (
      securityService.securityService.getSecuritySettings as jest.Mock
    ).mockResolvedValue({
      isSuccess: true,
      data: {
        settings: mockmember}});

    render(<SecurityDashboard />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Security Settings')).toBeInTheDocument();
    });

    // Check all sections are present
    expect(screen.getByText('Phone Verification')).toBeInTheDocument();
    expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
    expect(screen.getByText('Multi-Factor Authentication')).toBeInTheDocument();
    expect(screen.getByText('Backup Codes')).toBeInTheDocument();
    expect(screen.getByText('Biometric Authentication')).toBeInTheDocument();
    expect(screen.getByText('Security Events')).toBeInTheDocument();
  });

  test('displays phone verification form when not verified', async () => {
    (
      securityService.securityService.getSecuritySettings as jest.Mock
    ).mockResolvedValue({
      isSuccess: true,
      data: {
        settings: mockmember}});

    render(<SecurityDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Phone Verification')).toBeInTheDocument();
    });

    // Check phone input is visible
    expect(
      screen.getByPlaceholderText('+1 (555) 123-4567'),
    ).toBeInTheDocument();
    expect(screen.getByText('Send Verification Code')).toBeInTheDocument();
  });

  test('shows success message when phone verification is sent', async () => {
    (
      securityService.securityService.getSecuritySettings as jest.Mock
    ).mockResolvedValue({
      isSuccess: true,
      data: {
        settings: mockmember}});

    (
      securityService.securityService.sendPhoneVerification as jest.Mock
    ).mockResolvedValue({
      isSuccess: true});

    render(<SecurityDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Phone Verification')).toBeInTheDocument();
    });

    // Fill phone number
    const phoneInput = screen.getByPlaceholderText('+1 (555) 123-4567');
    fireEvent.change(phoneInput, { target: { value: '+1234567890' } });

    // Click send verification button
    const sendButton = screen.getByText('Send Verification Code');
    fireEvent.click(sendButton);

    // Wait for success message
    await waitFor(() => {
      expect(
        screen.getByText('Verification code sent to your phone'),
      ).toBeInTheDocument();
    });
  });

  test('shows error message when phone verification fails', async () => {
    (
      securityService.securityService.getSecuritySettings as jest.Mock
    ).mockResolvedValue({
      isSuccess: true,
      data: {
        settings: mockmember}});

    (
      securityService.securityService.sendPhoneVerification as jest.Mock
    ).mockResolvedValue({
      isSuccess: false,
      errorMessage: 'Failed to send verification code'});

    render(<SecurityDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Phone Verification')).toBeInTheDocument();
    });

    // Fill phone number
    const phoneInput = screen.getByPlaceholderText('+1 (555) 123-4567');
    fireEvent.change(phoneInput, { target: { value: '+1234567890' } });

    // Click send verification button
    const sendButton = screen.getByText('Send Verification Code');
    fireEvent.click(sendButton);

    // Wait for error message
    await waitFor(() => {
      expect(
        screen.getByText('Failed to send verification code'),
      ).toBeInTheDocument();
    });
  });

  test('enables 2FA successfully', async () => {
    const memberWithPhoneVerified = {
      ...mockmember,
      phoneVerified: true};

    (
      securityService.securityService.getSecuritySettings as jest.Mock
    ).mockResolvedValue({
      isSuccess: true,
      data: {
        settings: memberWithPhoneVerified}});

    (
      securityService.securityService.enableTwoFactor as jest.Mock
    ).mockResolvedValue({
      isSuccess: true});

    render(<SecurityDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
    });

    // Click enable SMS button
    const enableSmsButton = screen.getByText('Enable SMS');
    fireEvent.click(enableSmsButton);

    // Wait for success message
    await waitFor(() => {
      expect(
        screen.getByText('Two-factor authentication enabled with sms'),
      ).toBeInTheDocument();
    });
  });
});

describe('SecurityEvents', () => {
  const mockEvents = [
    {
      event_type: 'login',
      ip_address: '192.168.1.1',
      member_agent: 'Mozilla/5.0',
      success: true,
      details: {},
      created_at: '2023-01-01T00:00:00Z'},
    {
      event_type: 'failed_login',
      ip_address: '192.168.1.2',
      member_agent: 'Mozilla/5.0',
      success: false,
      details: {},
      created_at: '2023-01-01T01:00:00Z'},
  ];

  test('renders security events table', async () => {
    (
      securityService.securityService.getSecurityEvents as jest.Mock
    ).mockResolvedValue({
      isSuccess: true,
      data: {
        events: mockEvents}});

    render(<SecurityEvents />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Security Events')).toBeInTheDocument();
    });

    // Check events are displayed
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Failed Login')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.2')).toBeInTheDocument();
  });

  test('shows error message when fetching events fails', async () => {
    (
      securityService.securityService.getSecurityEvents as jest.Mock
    ).mockResolvedValue({
      isSuccess: false,
      errorMessage: 'Failed to fetch security events'});

    render(<SecurityEvents />);

    // Wait for error message
    await waitFor(() => {
      expect(
        screen.getByText('Failed to fetch security events'),
      ).toBeInTheDocument();
    });
  });
});
