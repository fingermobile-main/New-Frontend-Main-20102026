import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

jest.mock('../../components/dashboard/MasterLuminaGalleryConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-lumina-gallery-console">Lumina Gallery Console</div>,
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import LuminaGalleryMasterConsolePage from './LuminaGalleryMasterConsolePage';

describe('LuminaGalleryMasterConsolePage', () => {
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
        <LuminaGalleryMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-lumina-gallery-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Lumina Gallery Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Gallery/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Gallery/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

