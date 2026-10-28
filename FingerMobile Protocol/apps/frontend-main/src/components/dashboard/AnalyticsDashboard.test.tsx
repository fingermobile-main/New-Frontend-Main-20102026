import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AnalyticsDashboard from './AnalyticsDashboard';

describe('AnalyticsDashboard Component', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  test('renders Analytics Dashboard, metrics and quick dock', () => {
    render(<AnalyticsDashboard userId="user-1" period="week" />);

    expect(screen.getByText('Analytics Overview')).toBeInTheDocument();
    expect(screen.getByText(/Key performance metrics and platform audience growth/i)).toBeInTheDocument();
    expect(screen.getByText('Total Views')).toBeInTheDocument();
    expect(screen.getByText('Engagement Rate')).toBeInTheDocument();
    expect(screen.getByText('Followers')).toBeInTheDocument();

    // Check Sovereign Mobile Navigation Quick Dock buttons
    const dayBtn = screen.getByRole('button', { name: /Period Day/i });
    expect(dayBtn).toBeInTheDocument();
    fireEvent.click(dayBtn);

    const monthBtn = screen.getByRole('button', { name: /Period Month/i });
    fireEvent.click(monthBtn);

    const refreshBtn = screen.getByRole('button', { name: /Refresh Analytics/i });
    fireEvent.click(refreshBtn);

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});

