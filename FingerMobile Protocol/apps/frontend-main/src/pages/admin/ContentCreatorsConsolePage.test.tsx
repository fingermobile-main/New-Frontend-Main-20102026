import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../services/sovereignRbacApi', () => ({
  __esModule: true,
  default: {
    getCreatorsDirectory: jest.fn().mockResolvedValue({
      creators: [],
      stats: { total: 0, active: 0, tiers: [] },
    }),
    updateCreatorProfile: jest.fn().mockResolvedValue({ success: true }),
  },
}));

jest.mock('../../components/common/ExecutiveOnlyContent', () => ({
  usePlatformPrivilege: jest.fn(),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import { ContentCreatorsConsolePage } from './ContentCreatorsConsolePage';

describe('ContentCreatorsConsolePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders creators console and quick dock', async () => {
    render(
      <MemoryRouter>
        <ContentCreatorsConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Creators Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Creators/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh Creators/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

