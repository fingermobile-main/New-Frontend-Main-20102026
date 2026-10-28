import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FeatureTogglesPage from './FeatureTogglesPage';

// Mock AppContext
jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: () => ({
    featureToggles: [
      {
        id: 'tropical_gifts',
        name: 'Tropical Fruit Gifts',
        description: 'Enable time-sensitive tropical fruit gifts',
        enabled: true,
        specialDays: ['2026-12-25']
      }
    ],
    setFeatureToggles: jest.fn(),
    showToast: jest.fn()
  })
}));

// Mock adminOperationsService
jest.mock('../../../services/adminOperationsService', () => ({
  getSettings: jest.fn().mockResolvedValue([]),
  updateSetting: jest.fn().mockResolvedValue({})
}));

describe('FeatureTogglesPage Mobile Integration', () => {
  it('renders feature toggles and epoch dates', () => {
    render(
      <MemoryRouter>
        <FeatureTogglesPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Feature Toggles & Operations/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Tropical Fruit Gifts/i).length).toBeGreaterThan(0);
  });

  it('renders quick dock buttons', () => {
    render(
      <MemoryRouter>
        <FeatureTogglesPage />
      </MemoryRouter>
    );

    expect(screen.getAllByRole('button', { name: /Save/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
