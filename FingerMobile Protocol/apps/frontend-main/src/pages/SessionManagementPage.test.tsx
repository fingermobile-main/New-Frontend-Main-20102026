import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const mockFetchSessions = jest.fn();
const mockRevokeAllSessions = jest.fn().mockResolvedValue(true);
const mockRevokeSession = jest.fn().mockResolvedValue(true);

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../hooks/useSession', () => ({
  useSession: () => ({
    sessions: [
      {
        id: 'sess-1',
        platform: 'mobile',
        current: true,
        ipAddress: '197.210.65.12',
        lastAccessed: '2026-02-01T12:00:00Z'
      },
      {
        id: 'sess-2',
        platform: 'web',
        current: false,
        ipAddress: '102.89.44.18',
        lastAccessed: '2026-02-01T10:00:00Z'
      }
    ],
    loading: false,
    error: null,
    fetchSessions: mockFetchSessions,
    revokeSession: mockRevokeSession,
    revokeAllSessions: mockRevokeAllSessions,
  })
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>
}));

import SessionManagementPage from './SessionManagementPage';

describe('SessionManagementPage', () => {
  it('renders active sessions header and list', () => {
    render(
      <BrowserRouter>
        <SessionManagementPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Active Sessions/i })).toBeInTheDocument();
    expect(screen.getByText(/Current Device/i)).toBeInTheDocument();
  });

  it('triggers refresh and revoke all via quick dock', () => {
    render(
      <BrowserRouter>
        <SessionManagementPage />
      </BrowserRouter>
    );

    const refreshBtns = screen.getAllByRole('button', { name: /Refresh/i });
    expect(refreshBtns.length).toBeGreaterThan(0);
    fireEvent.click(refreshBtns[0]);
    expect(mockFetchSessions).toHaveBeenCalled();

    const revokeAllBtns = screen.getAllByRole('button', { name: /Revoke All/i });
    expect(revokeAllBtns.length).toBeGreaterThan(0);
    fireEvent.click(revokeAllBtns[0]);
  });
});
