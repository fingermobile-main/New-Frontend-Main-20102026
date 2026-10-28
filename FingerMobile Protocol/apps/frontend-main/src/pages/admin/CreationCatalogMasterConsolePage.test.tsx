import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreationCatalogMasterConsolePage from './CreationCatalogMasterConsolePage';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../../services/creationCatalogConsoleService', () => ({
  creationCatalogConsoleService: {
    getItems: () => Promise.resolve([
      {
        id: 'cat-item-1',
        name: 'Enterprise Treasury Dashboard',
        code: 'SCR-ENT-01',
        domain: 'screen_catalog_management',
        category: 'Interactive Screen',
        route_path: '/dashboard/treasury',
        rotation_hours: 4.0,
        tier_pricing_fic: 500,
        seo_index_score: 98.0,
        status: 'active',
        priority_order: 1,
      },
    ]),
    getOverview: () => Promise.resolve({
      summary: {
        total_items: 1,
        active_count: 1,
        frozen_count: 0,
        total_screens: 1,
        total_channels: 0,
        total_billboards: 0,
        total_seo_nodes: 0,
        total_fic_value: 500,
        active_audiences: 12000,
      },
    }),
    getSpawnedConsoles: () => Promise.resolve([]),
  },
}));

jest.mock('../../services/SuperViAudioEngine', () => ({
  __esModule: true,
  default: {
    playVoiceLine: jest.fn(),
  },
}));

describe('CreationCatalogMasterConsolePage Mobile Optimization & Behavior', () => {
  it('renders creation catalog master console heading and catalog item', async () => {
    render(
      <BrowserRouter>
        <CreationCatalogMasterConsolePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /creation, widgets, screen catalog & subscriptions console/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Enterprise Treasury Dashboard/i)).toBeInTheDocument();
    });
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', async () => {
    render(
      <BrowserRouter>
        <CreationCatalogMasterConsolePage />
      </BrowserRouter>
    );

    const mobileDock = screen.getByRole('navigation', { name: /creation catalog master console mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});
