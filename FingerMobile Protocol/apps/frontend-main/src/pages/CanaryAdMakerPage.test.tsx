import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CanaryAdMakerPage from './CanaryAdMakerPage';

// Mock components and contexts
jest.mock('../components/layout/UniversalHeader', () => ({
  __esModule: true,
  default: ({ pageTitle }: { pageTitle: string }) => <div data-testid="universal-header">{pageTitle}</div>,
}));

jest.mock('../components/layout/H2AdBucket', () => ({
  __esModule: true,
  default: () => <div data-testid="h2-ad-bucket">Ad Bucket</div>,
}));

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    member: { id: 'test-user', membername: 'TestMerchant' },
    showToast: jest.fn(),
  }),
}));

jest.mock('../services/api', () => ({
  ApiService: {
    get: jest.fn().mockResolvedValue({
      success: true,
      data: {
        rulesByKey: {
          video: { base_price_usd: 15, base_price_fic: 150 },
          feed_video: { base_price_usd: 12, base_price_fic: 120 }
        },
        ficParity: { base_price_fic: 10 }
      }
    }),
    post: jest.fn().mockResolvedValue({ success: true })
  }
}));

describe('CanaryAdMakerPage Mobile Suite', () => {
  it('renders ad studio header and step 1 disclaimer agreement', () => {
    render(
      <BrowserRouter>
        <CanaryAdMakerPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/FingerMobile Ad Creator/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1: Merchant Agreement/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile navigation quick dock controls', () => {
    render(
      <BrowserRouter>
        <CanaryAdMakerPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Terms/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Type/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Creative/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Deploy/i })).toBeInTheDocument();
  });
});
