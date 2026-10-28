import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GiftsShopPage from './GiftsShopPage';
import { AppProvider } from '../contexts/AppContext';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('GiftsShopPage Component & Sovereign Mobile Quick Dock', () => {
  const renderGiftsShopPage = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <GiftsShopPage />
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('renders the header and product catalog', () => {
    renderGiftsShopPage();

    expect(screen.getByRole('heading', { name: /Lush Luxury Gift Shop/i })).toBeInTheDocument();
    expect(screen.getByText(/Escrow Protected/i)).toBeInTheDocument();
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with controls', () => {
    renderGiftsShopPage();

    const mobileDock = screen.getByLabelText(/Gifts Shop Mobile Navigation/i);
    expect(mobileDock).toBeInTheDocument();

    const plushiesBtn = screen.getByRole('button', { name: /^Plushies$/i });
    const virtualBtn = screen.getByRole('button', { name: /^Virtual$/i });
    const feedBtn = screen.getByRole('button', { name: /^Feed$/i });

    expect(plushiesBtn).toBeInTheDocument();
    expect(virtualBtn).toBeInTheDocument();
    expect(feedBtn).toBeInTheDocument();

    // Click Virtual tab
    fireEvent.click(virtualBtn);
    expect(virtualBtn.className).toContain('text-emerald-700');

    // Click Feed
    fireEvent.click(feedBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/lush-pressies');
  });
});

