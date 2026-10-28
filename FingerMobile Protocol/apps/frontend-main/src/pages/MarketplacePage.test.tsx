import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MarketplacePage from './MarketplacePage';
import { AppProvider } from '../contexts/AppContext';

// Mock AuthContext
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-1', name: 'Sovereign Tester' }, logout: jest.fn() }),
}));

// Mock apiService
jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockImplementation((url: string) => {
      if (url.includes('/flagship')) {
        return Promise.resolve({
          products: [
            {
              id: 'flagship-1',
              name: 'Sovereign Keycard V3',
              tagline: 'EAL6+ Cryptographic Hardware',
              description: 'Military-grade sovereign keycard with cold-storage capability.',
              price: 199,
              priceFic: 2500,
              category: 'Hardware & Security',
              sku: 'FMP-SEC-001',
              images: ['https://images.unsplash.com/photo-1563770660941-20978e870e26'],
              likes: 42,
              dislikes: 1,
              rating: 5,
              authenticity_ledger_hash: '0x1234567890abcdef1234567890abcdef12345678',
              specifications: { Element: 'EAL6+', Interface: 'NFC / USB-C' }
            }
          ]
        });
      }
      if (url.includes('/orders')) {
        return Promise.resolve({
          orders: [
            {
              id: 'ORD-9901',
              productId: 'flagship-1',
              productName: 'Sovereign Keycard V3',
              total: 2500,
              currency: 'FIC',
              date: '2026-10-28',
              status: 'confirmed'
            }
          ]
        });
      }
      return Promise.resolve({});
    }),
    post: jest.fn().mockImplementation(() => Promise.resolve({ success: true, data: { id: 'ORD-NEW-1' } })),
    put: jest.fn().mockResolvedValue({ success: true }),
    delete: jest.fn().mockResolvedValue({ success: true })
  },
}));

describe('MarketplacePage Component', () => {
  const renderWithProviders = () =>
    render(
      <MemoryRouter>
        <AppProvider>
          <MarketplacePage />
        </AppProvider>
      </MemoryRouter>
    );

  it('renders Flagship Store hero, banner, and flagship drops', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/Platform Flagship Store • Sovereign Drops/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/The Platform's/i)).toBeInTheDocument();
    expect(screen.getByText('Flagship Store')).toBeInTheDocument();
    expect(screen.getAllByText('Sovereign Keycard V3').length).toBeGreaterThan(0);
    expect(screen.getByText('2,500 FIC')).toBeInTheDocument();
  });

  it('renders mobile navigation dock with Drops, Hardware, Ledger, and Orders tabs', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Drops')).toBeInTheDocument();
      expect(screen.getByText('Hardware')).toBeInTheDocument();
      expect(screen.getByText('Ledger')).toBeInTheDocument();
      expect(screen.getByText('Orders')).toBeInTheDocument();
    });
  });

  it('switches to Authenticity Ledger view when clicking Ledger tab', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getAllByText('Sovereign Keycard V3').length).toBeGreaterThan(0);
    });

    const ledgerTab = screen.getByRole('button', { name: /Authenticity Ledger/i });
    fireEvent.click(ledgerTab);

    expect(screen.getByText(/FingerMobile Protocol™ Authenticity Ledger/i)).toBeInTheDocument();
    expect(screen.getByText('0x1234567890abcdef1234567890abcdef12345678')).toBeInTheDocument();
  });

  it('switches to My Orders view when clicking Orders tab', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getAllByText('Sovereign Keycard V3').length).toBeGreaterThan(0);
    });

    const ordersTab = screen.getByRole('button', { name: /My Orders & Invoices/i });
    fireEvent.click(ordersTab);

    expect(screen.getByText(/My Flagship Orders & Settlements/i)).toBeInTheDocument();
    expect(screen.getByText('ORD-9901')).toBeInTheDocument();
  });

  it('opens and closes AI assistant drawer', async () => {
    renderWithProviders();

    const askAiBtn = screen.getByRole('button', { name: /Ask Flagship AI Assistant/i });
    fireEvent.click(askAiBtn);

    expect(screen.getByRole('heading', { name: 'Flagship AI Assistant' })).toBeInTheDocument();
    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Flagship AI Assistant' })).not.toBeInTheDocument();
    });
  });
});
