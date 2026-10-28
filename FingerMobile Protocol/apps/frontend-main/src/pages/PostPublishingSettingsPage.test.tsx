import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    member: { id: 'm-1', name: 'Test Member' },
    user: { id: 'm-1' },
    isAuthenticated: true,
  }),
}));

jest.mock('../contexts/PostPublishingContext', () => ({
  usePostPublishing: () => ({
    settings: {
      privacy: 'everyone',
      audience: { gender: 'everyone', ageBracket: 'all' },
      comments: 'everyone',
      schedule: { time: '', day: '' },
      shareToMi: false,
      monetization: { enabled: false, model: 'free' },
      collaboration: { enabled: false, collaborators: [] },
      broadcast: { enabled: false, audience: 'everyone' },
      boosting: { enabled: false, type: 'daily', amount: 10 },
      moderation: { autoModerate: true, filterProfanity: true },
    },
    updateSettings: jest.fn(),
    resetSettings: jest.fn(),
    applyAIRecommendations: jest.fn().mockResolvedValue({}),
    saveSettings: jest.fn().mockResolvedValue(true),
  }),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

import SafePostPublishingSettingsPage from './PostPublishingSettingsPage';

describe('PostPublishingSettingsPage', () => {
  it('renders settings title and options', () => {
    render(
      <BrowserRouter>
        <SafePostPublishingSettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Intelligent Post Publishing Settings/i })).toBeInTheDocument();
    expect(screen.getByText(/Privacy & Audience/i)).toBeInTheDocument();
  });

  it('renders mobile quick dock buttons and triggers save default', () => {
    render(
      <BrowserRouter>
        <SafePostPublishingSettingsPage />
      </BrowserRouter>
    );

    const saveBtns = screen.getAllByRole('button', { name: /Save as Default|Save/i });
    expect(saveBtns.length).toBeGreaterThan(0);
    fireEvent.click(saveBtns[0]);
  });
});
