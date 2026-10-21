import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PostPublishingSettings from './PostPublishingSettings';

// Mock useAppContext to avoid provider dependency in unit test
jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

describe('PostPublishingSettings', () => {
  it('renders all four settings tabs', () => {
    render(<PostPublishingSettings />);
    expect(screen.getByRole('button', { name: /^Basic$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Monetization$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Advanced$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Demographics & Geofence/i })).toBeInTheDocument();
  });

  it('switches to Demographics tab and displays target locations and age range', () => {
    render(<PostPublishingSettings />);
    const demoTab = screen.getByRole('button', { name: /Demographics & Geofence/i });
    fireEvent.click(demoTab);

    expect(screen.getByText(/Target Geographic Locations/i)).toBeInTheDocument();
    expect(screen.getByText(/Age Range Minimum/i)).toBeInTheDocument();
    expect(screen.getByText(/Custom Geofence Heatmap Perimeter/i)).toBeInTheDocument();
  });
});
