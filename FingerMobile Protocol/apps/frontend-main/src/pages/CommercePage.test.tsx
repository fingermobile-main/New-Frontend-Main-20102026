import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CommercePage from './CommercePage';

jest.mock('../services/CommerceService', () => ({
  __esModule: true,
  default: {
    getProducts: () => Promise.resolve([
      {
        id: 'prod-comm-101',
        name: 'Sovereign Hardware Enclave Key',
        category: 'Electronics',
        price: 25000,
        inventory: 15,
        sku: 'SKU-ENCLAVE-01',
        description: 'Hardware crypto enclave',
        status: 'active',
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300',
      },
    ]),
    getSalesAnalytics: () => Promise.resolve({
      totalRevenue: 50000000,
      totalOrders: 1500,
      conversionRate: 4.8,
      averageOrderValue: 33333,
    }),
  },
}));

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

describe('CommercePage Mobile Optimization & Behavior', () => {
  it('renders commerce management console header and products with min-44px buttons', async () => {
    render(<CommercePage />);

    expect(screen.getByRole('heading', { name: /e-commerce management console/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Sovereign Hardware Enclave Key/i)).toBeInTheDocument();
    });

    const addProductBtn = screen.getByRole('button', { name: /add new product to catalog/i });
    expect(addProductBtn.className).toContain('min-h-[44px]');
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(<CommercePage />);

    const mobileDock = screen.getByRole('navigation', { name: /commerce mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});
