import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GuardianProtectionPage from './GuardianProtectionPage';
import { AppProvider } from '../contexts/AppContext';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../services/api', () => ({
  ApiService: {
    get: jest.fn().mockImplementation((url: string) => {
      if (url.includes('/status')) {
        return Promise.resolve({
          timestamp: new Date().toISOString(),
          modules: {
            firewall: { status: 'healthy', description: 'Packet filter operational' }
          },
          killSwitch: {
            isActive: false,
            emergencyMode: false,
            countdownActive: false,
            countdownEndTime: null,
            lastActivationTime: null
          },
          stercesConfig: {
            authorizedEmails: ['admin@fingermobile.org'],
            authorizedIndividuals: [{ name: 'Sovereign Officer', phone: '+123456789' }]
          }
        });
      }
      if (url.includes('/rules')) {
        return Promise.resolve([
          {
            id: 1,
            name: 'Anti-Tamper Rule Alpha',
            category: 'Tamper',
            description: 'Immediate node isolation upon unauthorized key mutation',
            severity: 'critical',
            threshold_value: 1,
            action: 'isolate',
            is_active: true
          }
        ]);
      }
      if (url.includes('/logs')) {
        return Promise.resolve([
          {
            id: 1,
            event_type: 'AUTH_SUCCESS',
            event_description: 'Sovereign root session authenticated',
            source_ip: '127.0.0.1',
            user_id: 'usr_root',
            resource_affected: 'vault_escrow',
            action_taken: 'allow',
            severity: 'low',
            created_at: new Date().toISOString()
          }
        ]);
      }
      return Promise.resolve({});
    }),
    post: jest.fn().mockResolvedValue({ success: true }),
    put: jest.fn().mockResolvedValue({ success: true }),
    delete: jest.fn().mockResolvedValue({ success: true })
  }
}));

describe('GuardianProtectionPage Component & Sovereign Mobile Quick Dock', () => {
  const renderGuardianProtectionPage = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <GuardianProtectionPage />
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('renders the Guardian Protection overview header', async () => {
    renderGuardianProtectionPage();

    expect(await screen.findByText(/Guardian Protection System/i)).toBeInTheDocument();
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with all controls', async () => {
    renderGuardianProtectionPage();

    const mobileDock = await screen.findByLabelText(/Guardian Protection Mobile Navigation/i);
    expect(mobileDock).toBeInTheDocument();

    const statusBtn = within(mobileDock).getByRole('button', { name: /^Status$/i });
    const stercesBtn = within(mobileDock).getByRole('button', { name: /^Sterces$/i });
    const rulesBtn = within(mobileDock).getByRole('button', { name: /^Rules$/i });
    const logsBtn = within(mobileDock).getByRole('button', { name: /^Logs$/i });

    expect(statusBtn).toBeInTheDocument();
    expect(stercesBtn).toBeInTheDocument();
    expect(rulesBtn).toBeInTheDocument();
    expect(logsBtn).toBeInTheDocument();

    // Click Sterces
    fireEvent.click(stercesBtn);
    expect(stercesBtn.className).toContain('text-red-600');

    // Click Rules
    fireEvent.click(rulesBtn);
    expect(rulesBtn.className).toContain('text-red-600');
  });
});
