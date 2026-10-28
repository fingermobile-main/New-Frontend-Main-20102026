import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VideosPage from './VideosPage';
import * as AppContextModule from '../contexts/AppContext';

// Mock dependencies
jest.mock('../services/apiService', () => ({
  get: jest.fn().mockResolvedValue([]),
  post: jest.fn().mockResolvedValue({ id: '123' })
}));

describe('VideosPage Mobile Optimization Tests', () => {
  beforeEach(() => {
    jest.spyOn(AppContextModule, 'useAppContext').mockReturnValue({
      ficBalance: 250,
      showToast: jest.fn(),
      currentUser: { id: 'user-1', name: 'Sovereign Tester' }
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderVideosPage = () => {
    return render(
      <BrowserRouter>
        <VideosPage />
      </BrowserRouter>
    );
  };

  it('renders videos gallery title and upload action', () => {
    renderVideosPage();
    expect(screen.getByText('Videos Gallery')).toBeInTheDocument();
    expect(screen.getByText('Video Commons • Dancia & UGC Hub')).toBeInTheDocument();
    expect(screen.getAllByText('Upload Video')[0]).toBeInTheDocument();
  });

  it('renders mobile sovereign navigation quick dock', () => {
    renderVideosPage();
    const dock = screen.getByTestId('videos-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByText('Feed')).toBeInTheDocument();
    expect(screen.getByText('Hot')).toBeInTheDocument();
    expect(screen.getByText('Tip')).toBeInTheDocument();
  });

  it('renders search input and category filter', () => {
    renderVideosPage();
    const searchInput = screen.getByPlaceholderText(/Search videos or creators/i);
    expect(searchInput).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: 'Travel' } });
    expect(searchInput).toHaveValue('Travel');
  });

  it('opens gift modal with touch-friendly controls', () => {
    renderVideosPage();
    const giftButtons = screen.getAllByRole('button', { name: /gift/i });
    expect(giftButtons.length).toBeGreaterThan(0);
    fireEvent.click(giftButtons[0]);
    expect(screen.getByText('Send Gift to Creator')).toBeInTheDocument();
  });

  it('opens paylink modal with touch-friendly controls', () => {
    renderVideosPage();
    const payButtons = screen.getAllByRole('button', { name: /pay/i });
    expect(payButtons.length).toBeGreaterThan(0);
    fireEvent.click(payButtons[0]);
    expect(screen.getByText('Create Paylink for Video')).toBeInTheDocument();
  });
});
