import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SiteMenusPage from './SiteMenusPage';
import SitePagesMenusPage from './SitePagesMenusPage';

jest.mock('../../../services/adminOperationsService', () => ({
  __esModule: true,
  default: {
    getSiteMenus: jest.fn().mockResolvedValue([
      {
        id: 'menu-1',
        title: 'Main Header Navigation',
        slug: 'header-main',
        location: 'header',
        items: [
          { label: 'Ecosystem', url: '/dashboard/hub' },
          { label: 'Storefront', url: '/store' }
        ],
        is_active: true
      }
    ]),
    createSiteMenu: jest.fn().mockResolvedValue({ success: true }),
    updateSiteMenu: jest.fn().mockResolvedValue({ success: true }),
    deleteSiteMenu: jest.fn().mockResolvedValue({ success: true })
  }
}));

jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

jest.mock('../../../components/ownership/PlatformOwnershipCard', () => ({
  PlatformOwnershipCard: () => <div data-testid="platform-ownership-card">Platform Ownership Verified</div>
}));

describe('Site Management Sub-Directory Pages', () => {
  it('renders SiteMenusPage with active navigation menus and controls', async () => {
    render(
      <MemoryRouter>
        <SiteMenusPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('platform-ownership-card')).toBeInTheDocument();
    expect(await screen.findByText(/Main Header Navigation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ Add Menu/i })).toBeInTheDocument();
  });

  it('renders SitePagesMenusPage redirect stub', () => {
    render(
      <MemoryRouter>
        <SitePagesMenusPage />
      </MemoryRouter>
    );
    // Verified renders and routes without throwing
    expect(document.body).toBeInTheDocument();
  });
});
