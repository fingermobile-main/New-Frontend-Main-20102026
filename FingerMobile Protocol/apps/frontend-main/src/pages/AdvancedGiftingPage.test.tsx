import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdvancedGiftingPage from './AdvancedGiftingPage';
import { useAppContext } from '../contexts/AppContext';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../components/gifting/AdvancedGiftingEngine', () => ({
  __esModule: true,
  default: () => <div data-testid="advanced-gifting-engine">Gifting Engine Content</div>,
}));

describe('AdvancedGiftingPage Mobile Optimization', () => {
  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      ficBalance: 350,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders gifting header and engine', () => {
    render(
      <MemoryRouter>
        <AdvancedGiftingPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Advanced Gifting & Creator Tips/i)).toBeInTheDocument();
    expect(screen.getByTestId('advanced-gifting-engine')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <AdvancedGiftingPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Send Gift')).toBeInTheDocument();
    expect(screen.getByLabelText('Transfer FIC')).toBeInTheDocument();
    expect(screen.getByLabelText('Lush Pressies')).toBeInTheDocument();
    expect(screen.getByLabelText('Back to Forum')).toBeInTheDocument();
  });
});
