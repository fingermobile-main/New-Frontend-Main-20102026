import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

jest.mock('../../services/apiService', () => ({
  apiService: {
    get: jest.fn().mockResolvedValue({ data: [] }),
    delete: jest.fn().mockResolvedValue({}),
  },
}));

import ContentPage from './ContentPage';

describe('ContentPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders content management hub and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <ContentPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Content Management Hub/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /All/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Posts/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Create/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
