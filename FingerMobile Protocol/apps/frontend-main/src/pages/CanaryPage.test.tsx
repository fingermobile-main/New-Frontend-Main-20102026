import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CanaryPage from './CanaryPage';

// Mock contexts and services
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 3200,
    openModal: jest.fn(),
    showToast: jest.fn(),
  }),
}));

jest.mock('../contexts/Web3Context', () => ({
  useWeb3: () => ({
    balance: '10.5',
  }),
}));

jest.mock('../services/advertisingService', () => ({
  advertisingService: {
    getAnnouncements: jest.fn().mockResolvedValue([]),
    getAdvertiserProfile: jest.fn().mockResolvedValue({ id: 'adv-1', companyName: 'Acme Inc' }),
  },
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('CanaryPage Mobile Suite', () => {
  it('renders warrant canary title and disclosure banner after loading', async () => {
    render(
      <BrowserRouter>
        <CanaryPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/FingerMobile Canary Ads/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Warrant Canary & Sponsor Ads Studio/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile navigation quick dock controls', async () => {
    render(
      <BrowserRouter>
        <CanaryPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Active/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Disclosures/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Ad/i })).toBeInTheDocument();
  });
});
