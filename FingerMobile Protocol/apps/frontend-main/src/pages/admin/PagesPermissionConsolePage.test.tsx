import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../services/sovereignRbacApi', () => ({
  __esModule: true,
  default: {
    getPagesDirectory: jest.fn().mockResolvedValue({
      pages: [],
      stats: { total: 0, public: 0, authenticated: 0, sovereignOnly: 0, cfoOnly: 0 },
    }),
    updatePageRules: jest.fn().mockResolvedValue({ success: true }),
  },
}));

jest.mock('../../components/common/ExecutiveOnlyContent', () => ({
  usePlatformPrivilege: jest.fn(),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import { PagesPermissionConsolePage } from './PagesPermissionConsolePage';

describe('PagesPermissionConsolePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders pages permission console and quick dock', () => {
    render(
      <MemoryRouter>
        <PagesPermissionConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Pages Permissions Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Pages/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh Pages/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

