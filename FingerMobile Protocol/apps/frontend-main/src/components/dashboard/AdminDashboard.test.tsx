import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  test('renders Admin Dashboard title, metrics and quick dock', async () => {
    render(
      <MemoryRouter>
        <AdminDashboard adminId="admin-123" />
      </MemoryRouter>
    );

    // Wait for mock data to finish loading
    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText(/Platform overview and management/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Users/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Posts/i)).toBeInTheDocument();

    // Check Sovereign Mobile Navigation Quick Dock
    const refreshButtons = screen.getAllByRole('button', { name: /Refresh/i });
    expect(refreshButtons.length).toBeGreaterThan(0);

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  test('refreshes dashboard data on refresh click', async () => {
    render(
      <MemoryRouter>
        <AdminDashboard adminId="admin-123" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    const refreshBtn = screen.getByRole('button', { name: /Refresh Dashboard/i });
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
  });
});

