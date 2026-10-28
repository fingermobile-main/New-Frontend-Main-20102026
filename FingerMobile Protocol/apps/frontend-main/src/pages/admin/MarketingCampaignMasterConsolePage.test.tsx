import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/dashboard/MasterMarketingCampaignConsole', () => ({
  MasterMarketingCampaignConsole: () => <div data-testid="master-marketing-campaign-console">Marketing Campaign Console</div>,
}));

import { MarketingCampaignMasterConsolePage } from './MarketingCampaignMasterConsolePage';

describe('MarketingCampaignMasterConsolePage', () => {
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
        <MarketingCampaignMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-marketing-campaign-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Marketing Campaign Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Campaigns/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Marketing/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

