import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => {
  return function MockMainLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="main-layout">{children}</div>;
  };
});

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    ficBalance: 12500,
  }),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'usr-1', username: 'obinna', firstName: 'Israel', lastName: 'Mbah' },
    setUser: jest.fn(),
  }),
}));

jest.mock('../../services/VoiceLineService', () => ({
  __esModule: true,
  default: {
    getSettings: jest.fn().mockReturnValue({
      audioQuality: 'high',
      spatialAudio: true,
      masterVolume: 80,
      ambienceAudio: true,
      voiceLinesEnabled: true,
    }),
    updateSettings: jest.fn(),
  },
}));

jest.mock('../../services/UserProfileSyncService', () => ({
  __esModule: true,
  default: {
    getProfile: jest.fn().mockReturnValue({
      name: 'Mbah Israel Obinna',
      username: 'obinna',
      email: 'obinna@fingermobile.org',
      phone: '+234 801 234 5678',
      headline: 'Architect',
      avatar: '/assets/branding/mbah_israel_obinna.jpeg',
      location: 'Lagos, Nigeria',
    }),
    subscribe: jest.fn().mockReturnValue(() => {}),
    saveProfile: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock('../../services/UserService', () => ({
  __esModule: true,
  default: {
    updateUserProfile: jest.fn().mockResolvedValue({}),
  },
}));

import SettingsPage from './SettingsPage';

describe('SettingsPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders settings page and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Account Settings & Preferences/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Profile/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Security/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Privacy/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Media/i }).length).toBeGreaterThan(0);
  });

  it('switches tabs on mobile quick dock click', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    const securityBtn = screen.getAllByRole('button', { name: /Security/i })[0];
    fireEvent.click(securityBtn);

    expect(screen.getAllByText(/Security/i).length).toBeGreaterThan(0);
  });
});
