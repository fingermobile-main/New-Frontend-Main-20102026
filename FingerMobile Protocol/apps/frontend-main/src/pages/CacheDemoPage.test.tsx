import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CacheDemoPage from './CacheDemoPage';

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
        hits: 154200,
        misses: 9200,
        hitRatioPct: 94,
        size: '128.4 MB',
        activeRules: 12,
      },
    }),
    clearCache: jest.fn().mockResolvedValue({ success: true }),
  },
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('CacheDemoPage Mobile Suite', () => {
  it('renders header and diagnostics stats', () => {
    render(
      <BrowserRouter>
        <CacheDemoPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/CDN & Protocol Cache Demo/i)).toBeInTheDocument();
    expect(screen.getByText(/Live edge caching diagnostics/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile navigation quick dock controls', () => {
    render(
      <BrowserRouter>
        <CacheDemoPage />
      </BrowserRouter>
    );

    expect(screen.getAllByRole('button', { name: /Refresh/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Purge/i }).length).toBeGreaterThan(0);
  });
});
