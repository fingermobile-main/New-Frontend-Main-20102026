import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StoreManagementPage from './StoreManagementPage';

// Mock AppContext
jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

// Mock apiService
jest.mock('../../../services/apiService', () => ({
  get: jest.fn().mockImplementation((url: string) => {
    if (url.includes('/products')) {
      return Promise.resolve({
        data: [
          {
            id: 'prod-001',
            name: 'FingerMobile Protocol Hardware Key',
            price: 150,
            imageUrl: '',
            category: 'Hardware',
            stock: 25
          }
        ]
      });
    }
    if (url.includes('/orders')) {
      return Promise.resolve({
        data: [
          {
            id: 'ord-8831a9',
            customerName: 'Marcus Vance (Enterprise Node)',
            productName: 'FIC Quantum Staking Node License',
            total: 499,
            status: 'Completed',
            createdAt: new Date().toISOString()
          }
        ]
      });
    }
    return Promise.resolve({ data: [] });
  }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} })
}));

describe('StoreManagementPage Mobile Integration', () => {
  it('renders store management layout, stats, and products', async () => {
    render(
      <MemoryRouter>
        <StoreManagementPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /eCommerce Store Management/i })).toBeInTheDocument();
    expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Orders/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Manage Products/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Store/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New Product/i })).toBeInTheDocument();
  });
});
