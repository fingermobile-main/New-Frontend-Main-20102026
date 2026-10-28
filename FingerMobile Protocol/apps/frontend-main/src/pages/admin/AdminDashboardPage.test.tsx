import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboardPage from './AdminDashboardPage';

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnershipCard() {
    return <div data-testid="platform-ownership-card">Platform Ownership Card</div>;
  };
});

jest.mock('../../components/admin/AdminDashboard', () => {
  return function MockAdminDashboard() {
    return <div data-testid="admin-dashboard-console">Admin Dashboard Console</div>;
  };
});

describe('AdminDashboardPage (Subpage Screen)', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  test('renders AdminDashboardPage with ownership card, console and quick dock', () => {
    render(<AdminDashboardPage />);

    expect(screen.getByTestId('platform-ownership-card')).toBeInTheDocument();
    expect(screen.getByTestId('admin-dashboard-console')).toBeInTheDocument();

    // Check Sovereign Mobile Navigation Quick Dock
    expect(screen.getByRole('link', { name: /Admin Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Security Events/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /User Admin/i })).toBeInTheDocument();

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});

