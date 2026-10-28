import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdvancedAnalyticsDashboard from './AdvancedAnalyticsDashboard';

describe('AdvancedAnalyticsDashboard Component', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  test('renders Advanced Analytics dashboard, metrics and quick dock', () => {
    render(<AdvancedAnalyticsDashboard userId="user-1" />);

    expect(screen.getByText('Advanced Analytics')).toBeInTheDocument();
    expect(screen.getByText(/Real-time ecosystem metrics & predictive insights/i)).toBeInTheDocument();
    expect(screen.getByText('User Growth')).toBeInTheDocument();
    expect(screen.getAllByText('Revenue').length).toBeGreaterThan(0);
    expect(screen.getByText('Engagement')).toBeInTheDocument();

    // Check Sovereign Mobile Navigation Quick Dock buttons
    const growthBtn = screen.getByRole('button', { name: /Filter Growth/i });
    expect(growthBtn).toBeInTheDocument();
    fireEvent.click(growthBtn);

    const revenueBtn = screen.getByRole('button', { name: /Filter Revenue/i });
    fireEvent.click(revenueBtn);

    const engageBtn = screen.getByRole('button', { name: /Filter Engagement/i });
    fireEvent.click(engageBtn);

    const resetBtn = screen.getByRole('button', { name: /Reset All/i });
    fireEvent.click(resetBtn);

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
