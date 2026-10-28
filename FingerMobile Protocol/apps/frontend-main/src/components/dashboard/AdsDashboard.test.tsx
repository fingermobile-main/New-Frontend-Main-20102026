import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdsDashboard from './AdsDashboard';
import adsService from '../../services/adsService';

jest.mock('../../services/adsService', () => ({
  __esModule: true,
  default: {
    getMetrics: jest.fn().mockResolvedValue([
      { label: 'Total Spend', value: '$12,450', change: 12.5 },
      { label: 'Impressions', value: '450K', change: 8.3 },
      { label: 'Clicks', value: '18.2K', change: -2.1 },
      { label: 'Conversions', value: '1,420', change: 15.0 },
    ]),
    getPerformanceMetrics: jest.fn().mockResolvedValue([
      { name: 'Sovereign Launch Campaign', status: 'Active', value: '$4,500', trend: 14 },
    ]),
    getDemographics: jest.fn().mockResolvedValue([
      { ageRange: '18-24', percentage: 35 },
      { ageRange: '25-34', percentage: 45 },
    ]),
    getInterests: jest.fn().mockResolvedValue([
      { name: 'Decentralized Tech' },
      { name: 'Sovereign Finance' },
    ]),
  },
}));

describe('AdsDashboard Component', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    jest.clearAllMocks();
  });

  test('renders Ads Dashboard, metrics, tabs and quick dock', async () => {
    render(<AdsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Ads Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText(/Track and manage your advertising campaigns/i)).toBeInTheDocument();
    expect(screen.getByText('Total Spend')).toBeInTheDocument();
    expect(screen.getByText('$12,450')).toBeInTheDocument();

    // Check Sovereign Mobile Navigation Quick Dock buttons
    const performBtn = screen.getByRole('button', { name: /Performance Tab/i });
    expect(performBtn).toBeInTheDocument();
    fireEvent.click(performBtn);

    await waitFor(() => {
      expect(screen.getByText('Campaign Performance')).toBeInTheDocument();
    });

    const audienceBtn = screen.getByRole('button', { name: /Audience Tab/i });
    fireEvent.click(audienceBtn);

    await waitFor(() => {
      expect(screen.getByText('Demographics')).toBeInTheDocument();
    });

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
