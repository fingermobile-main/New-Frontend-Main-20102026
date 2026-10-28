import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminUserManagement from './AdminUserManagement';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../components/Header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('../../components/Footer', () => () => <div data-testid="mock-footer">Footer</div>);
jest.mock('../../components/layout/MainLayout', () => ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-main-layout">{children}</div>
));
jest.mock('../../components/dashboard/PlatformOwnershipCard', () => () => (
  <div data-testid="mock-platform-ownership">Platform Ownership</div>
));

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      data: {
        success: true,
        users: [
          {
            id: 'USR-891',
            username: 'chidi_sovereign',
            email: 'chidi.n@fingermobileprotocol.com',
            status: 'ACTIVE',
            strikes: 0,
            fiatBalance: 24500.0,
            cryptoBalance: 1250,
            aiCredits: 500,
          },
        ],
      },
    }),
    post: jest.fn().mockResolvedValue({ data: { success: true } }),
  },
}));

describe('AdminUserManagement (Subpage Screen)', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    jest.clearAllMocks();
  });

  test('renders user management header, user cards and quick dock', async () => {
    render(<AdminUserManagement />);

    expect(screen.getByText('Admin User & Credential Management')).toBeInTheDocument();
    expect(screen.getByText(/Review member status, issue moderation strikes/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('chidi_sovereign')).toBeInTheDocument();
    });

    // Test Quick Dock buttons
    const activeBtn = screen.getByRole('button', { name: /Filter Active/i });
    expect(activeBtn).toBeInTheDocument();
    fireEvent.click(activeBtn);

    const bannedBtn = screen.getByRole('button', { name: /Filter Banned/i });
    fireEvent.click(bannedBtn);

    const allBtn = screen.getByRole('button', { name: /Clear Search Filter/i });
    fireEvent.click(allBtn);

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});

