import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/MasterStreamingMediaConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-streaming-media-console">Streaming Media Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import { MediaStreamingMasterConsolePage } from './MediaStreamingMasterConsolePage';

describe('MediaStreamingMasterConsolePage', () => {
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
        <MediaStreamingMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-streaming-media-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Media Streaming Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Media/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Media/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

