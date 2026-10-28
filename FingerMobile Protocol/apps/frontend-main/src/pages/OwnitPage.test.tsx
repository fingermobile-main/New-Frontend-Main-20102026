import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OwnitPage from './OwnitPage';

// Mock contexts and services
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 500000,
    showToast: jest.fn()
  })
}));

jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      stores: [
        {
          id: 'store-1',
          name: 'Patek Philippe Haute Salon',
          slug: 'patek-philippe',
          store_type: 'branded_shopfront',
          curator_name: 'Geneva Master Guild',
          pavilion_location: 'Pavilion 1 - Geneva Grand Salon',
          description: 'Official verified salon for grand complications and minute repeaters.',
          authenticity_pledge: '100% Master Certified Horology',
          is_verified: true,
          rating: 5.0
        }
      ],
      products: [
        {
          id: 'ownit-01',
          name: 'Grand Celestial Tourbillon Minute Repeater',
          brand: 'Patek Philippe Vault',
          category: 'Haute Horlogerie',
          description: '4K Ultra-HD Masterpiece. Hand-chiseled 18k white gold case with celestial sky chart complications.',
          price: 3500000,
          priceFic: 350000,
          authenticity_cert_number: 'OWNIT-PP-SKY-001',
          cryptographic_sha256: '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d',
          rarity_level: 'Unique 1-of-1',
          stock: 1,
          likes: 342,
          dislikes: 5,
          rating: 5.0,
          poll_data: {
            question: 'Is this grand complication timepiece the masterpiece of the gala?',
            options: [
              { id: 1, text: 'Masterpiece of the Decade', votes: 124 },
              { id: 2, text: 'Incomparable Heritage Piece', votes: 88 }
            ]
          }
        }
      ]
    }),
    post: jest.fn().mockResolvedValue({ success: true })
  }
}));

jest.mock('../components/layout/MainLayout', () => ({ children }: { children: React.ReactNode }) => (
  <div data-testid="main-layout">{children}</div>
));

describe('OwnitPage Mobile Optimization', () => {
  it('renders Ownit luxury marquee, search bar, and reserve balance', async () => {
    render(
      <MemoryRouter>
        <OwnitPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/OwnIt™ Celebrity Red-Carpet Luxury Mall/i)).toBeInTheDocument();
    expect(screen.getByText(/500,000 FIC/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search 4K luxury assets/i)).toBeInTheDocument();
  });

  it('renders 4K luxury mall showcase product with escrow initiation button', async () => {
    render(
      <MemoryRouter>
        <OwnitPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Grand Celestial Tourbillon Minute Repeater')).toBeInTheDocument();
    });

    expect(screen.getByText('OWNIT-PP-SKY-001')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sovereign Escrow Acquisition/i })).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with 5 touch targets', () => {
    render(
      <MemoryRouter>
        <OwnitPage />
      </MemoryRouter>
    );

    const mobileDock = screen.getByTestId('ownit-mobile-dock');
    expect(mobileDock).toBeInTheDocument();

    expect(screen.getAllByRole('button', { name: /4K Mall/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Salons/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Vault/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Concierge/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Escrow/i }).length).toBeGreaterThan(0);
  });

  it('switches to Provenance Vault tab and allows viewing certificate', async () => {
    render(
      <MemoryRouter>
        <OwnitPage />
      </MemoryRouter>
    );

    const vaultBtns = screen.getAllByRole('button', { name: /Vault/i });
    fireEvent.click(vaultBtns[0]);

    await waitFor(() => {
      expect(screen.getByText(/Cryptographic Provenance Ledger/i)).toBeInTheDocument();
    });

    const viewCertBtn = screen.getAllByRole('button', { name: /View Certificate/i })[0];
    fireEvent.click(viewCertBtn);

    expect(screen.getByRole('heading', { level: 3, name: /Certificate of Authenticity/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close Certificate/i })).toBeInTheDocument();
  });

  it('opens Sovereign Escrow acquisition modal with 44px tap controls', async () => {
    render(
      <MemoryRouter>
        <OwnitPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Grand Celestial Tourbillon Minute Repeater')).toBeInTheDocument();
    });

    const escrowBtn = screen.getByRole('button', { name: /Sovereign Escrow Acquisition/i });
    fireEvent.click(escrowBtn);

    expect(screen.getAllByRole('heading', { level: 3, name: 'Grand Celestial Tourbillon Minute Repeater' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Lock Sovereign Escrow/i })).toBeInTheDocument();
  });
});
