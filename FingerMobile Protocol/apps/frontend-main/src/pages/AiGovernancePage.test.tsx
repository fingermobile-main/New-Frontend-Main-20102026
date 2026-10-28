import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AIGovernancePage from './AiGovernancePage';

jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

describe('AIGovernancePage Mobile Optimization', () => {
  it('renders header and governance title', () => {
    render(
      <MemoryRouter>
        <AIGovernancePage />
      </MemoryRouter>
    );

    expect(screen.getByText('AI Governance Management')).toBeInTheDocument();
    expect(screen.getByText('Create Policy')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <AIGovernancePage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Decisions Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Policies Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Incidents Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Analytics Tab')).toBeInTheDocument();
  });
});
