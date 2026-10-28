import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BusinessOrganizationsConsolePage from './BusinessOrganizationsConsolePage';
import sovereignRbacApi from '../../services/sovereignRbacApi';

jest.mock('../../components/common/ExecutiveOnlyContent', () => ({
  usePlatformPrivilege: () => ({ isExecutive: true }),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => () => (
  <div data-testid="platform-ownership-card">Platform Ownership</div>
));

jest.mock('../../services/sovereignRbacApi', () => ({
  __esModule: true,
  default: {
    getBusinessDirectory: jest.fn().mockResolvedValue({
      businesses: [
        {
          id: 'org-1',
          name: 'Apex Sovereign Holdings',
          country: 'Nigeria',
          city: 'Lagos',
          is_verified: true,
          accreditation_status: 'verified',
          metadata: {
            tier: 'ENTERPRISE',
            ads_credit_allocated: 50000,
            sla_tier: 'PLATINUM',
          },
        },
      ],
      stats: { total: 1, verified: 1 },
    }),
    updateBusinessAccreditation: jest.fn().mockResolvedValue({ success: true }),
  },
}));

describe('BusinessOrganizationsConsolePage (Subpage Screen)', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    jest.clearAllMocks();
  });

  test('renders business console, organization items and mobile quick dock', async () => {
    render(
      <MemoryRouter>
        <BusinessOrganizationsConsolePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Business & Organizations Console')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Apex Sovereign Holdings')).toBeInTheDocument();
    });

    // Test Quick Dock buttons
    const verifiedBtn = screen.getByRole('button', { name: /Filter Verified/i });
    expect(verifiedBtn).toBeInTheDocument();
    fireEvent.click(verifiedBtn);

    const pendingBtn = screen.getByRole('button', { name: /Filter Pending/i });
    fireEvent.click(pendingBtn);

    const allBtn = screen.getByRole('button', { name: /Filter All Organizations/i });
    fireEvent.click(allBtn);

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
