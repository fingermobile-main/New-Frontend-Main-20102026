import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/dashboard/MasterGamificationRewardsConsole', () => ({
  MasterGamificationRewardsConsole: () => <div data-testid="master-gamification-rewards-console">Gamification Rewards Console</div>,
}));

import { GamificationRewardsMasterConsolePage } from './GamificationRewardsMasterConsolePage';

describe('GamificationRewardsMasterConsolePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders console and quick dock', () => {
    render(
      <MemoryRouter>
        <GamificationRewardsMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-gamification-rewards-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Gamification Rewards Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Rewards/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Rewards/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

