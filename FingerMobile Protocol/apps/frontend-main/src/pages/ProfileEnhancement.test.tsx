import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    user: { id: 'u-1', name: 'Amina' },
    member: { id: 'm-1', name: 'Amina' },
    showToast: jest.fn(),
  }),
}));

jest.mock('../services/identityService', () => ({
  __esModule: true,
  identityService: {
    getProfile: jest.fn().mockResolvedValue({
      bio: 'Lead Security Architect',
      website: 'https://amina.dev',
      interests: ['Rust', 'Cryptography']
    }),
    enhanceProfile: jest.fn().mockResolvedValue({ success: true }),
  },
  default: {
    getProfile: jest.fn().mockResolvedValue({
      bio: 'Lead Security Architect',
      website: 'https://amina.dev',
      interests: ['Rust', 'Cryptography']
    }),
    enhanceProfile: jest.fn().mockResolvedValue({ success: true }),
  }
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

import ProfileEnhancement from './ProfileEnhancement';

describe('ProfileEnhancement', () => {
  it('renders profile enhancement form and loaded data', async () => {
    render(
      <BrowserRouter>
        <ProfileEnhancement />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Profile Enhancement/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByDisplayValue(/Lead Security Architect/i)).toBeInTheDocument();
    });
  });

  it('renders mobile quick dock buttons and triggers save', async () => {
    render(
      <BrowserRouter>
        <ProfileEnhancement />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue(/Lead Security Architect/i)).toBeInTheDocument();
    });

    const saveBtns = screen.getAllByRole('button', { name: /Save & Publish Enhancements|Save/i });
    expect(saveBtns.length).toBeGreaterThan(0);
    fireEvent.click(saveBtns[0]);
  });
});
