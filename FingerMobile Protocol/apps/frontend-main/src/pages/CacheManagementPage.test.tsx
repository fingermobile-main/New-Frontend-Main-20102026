import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CacheManagementPage from './CacheManagementPage';

// Mock contexts and services
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../services/cacheManagementService', () => ({
  cacheManagementService: {
    getCacheStats: jest.fn().mockResolvedValue({
      data: {
        totalRules: 15,
        size: '128.4MB',
        hitRatioPct: 94.2,
        purgesCount: 42,
        activeRules: 12,
      },
    }),
  },
}));

jest.mock('../services/api', () => ({
  api: {
    get: jest.fn().mockResolvedValue({
      data: [
        {
          key: 'session:001',
          type: 'string',
          ttl: 3600,
          size: '1.2KB',
          lastAccessed: '2026-03-01',
        },
      ],
    }),
    delete: jest.fn().mockResolvedValue({ data: { success: true } }),
    post: jest.fn().mockResolvedValue({ data: { success: true } }),
  },
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Ownership</div>,
}));

describe('CacheManagementPage Mobile Suite', () => {
  it('renders header and cache key statistics', () => {
    render(
      <BrowserRouter>
        <CacheManagementPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Cache Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Keys/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile navigation quick dock controls', () => {
    render(
      <BrowserRouter>
        <CacheManagementPage />
      </BrowserRouter>
    );

    expect(screen.getAllByRole('button', { name: /Overview/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Keys/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Analytics/i }).length).toBeGreaterThan(0);
  });
});
