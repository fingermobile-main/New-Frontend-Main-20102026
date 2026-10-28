import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CommerceLuxuryMasterConsolePage from './CommerceLuxuryMasterConsolePage';

jest.mock('../../components/layout/MainLayout', () => ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-main-layout">{children}</div>
));

jest.mock('../../components/dashboard/MasterCommerceLuxuryConsole', () => () => (
  <div data-testid="master-commerce-luxury">Master Commerce Luxury</div>
));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => () => (
  <div data-testid="platform-ownership-card">Platform Ownership</div>
));

describe('CommerceLuxuryMasterConsolePage (Subpage Screen)', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  test('renders CommerceLuxuryMasterConsolePage and mobile quick dock', () => {
    render(<CommerceLuxuryMasterConsolePage />);

    expect(screen.getByTestId('master-commerce-luxury')).toBeInTheDocument();
    expect(screen.getByTestId('platform-ownership-card')).toBeInTheDocument();

    // Check Sovereign Mobile Navigation Quick Dock
    expect(screen.getByRole('link', { name: /Luxury Catalog/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Luxury/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sync Luxury/i })).toBeInTheDocument();

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
