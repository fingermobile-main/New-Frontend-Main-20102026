import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminSecuritySettingsPage from './AdminSecuritySettingsPage';
import adminOperationsService from '../../services/adminOperationsService';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockOwnershipCard() {
    return <div data-testid="platform-ownership-card">Platform Ownership</div>;
  };
});

jest.mock('../../services/adminOperationsService', () => ({
  __esModule: true,
  default: {
    getSettings: jest.fn().mockResolvedValue([
      {
        config_key: 'enforce_mfa',
        config_value: 'true',
        config_group: 'security',
        description: 'Mandatory Multi-Factor Authentication',
      },
      {
        config_key: 'session_inactivity_timeout_minutes',
        config_value: '15',
        config_group: 'security',
        description: 'Automatically invalidate bearer tokens',
      },
    ]),
    updateSetting: jest.fn().mockResolvedValue({ success: true }),
  },
}));

describe('AdminSecuritySettingsPage (Subpage Screen)', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    jest.clearAllMocks();
  });

  test('renders security settings, rules list, and mobile quick dock', async () => {
    render(<AdminSecuritySettingsPage />);

    expect(screen.getByText(/Platform Security Policies/i)).toBeInTheDocument();
    expect(screen.getByText(/Guardian Shield Active/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Enforce Mfa')).toBeInTheDocument();
    });

    // Test Quick Dock buttons
    const mfaBtn = screen.getByRole('button', { name: /Toggle MFA/i });
    expect(mfaBtn).toBeInTheDocument();
    fireEvent.click(mfaBtn);

    const reloadBtn = screen.getByRole('button', { name: /Reload Policies/i });
    fireEvent.click(reloadBtn);

    const saveQuickBtn = screen.getByRole('button', { name: /Save Policies Quick/i });
    fireEvent.click(saveQuickBtn);

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});

