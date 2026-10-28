import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    photoCreditItems: [
      {
        id: 'photo-1',
        title: 'Durbar Splendor',
        description: 'Vibrant festival photography in Kano',
        imageUrl: 'https://example.com/durbar.jpg',
        creditCost: 20,
        cost: 20,
        uploader: {
          id: 'u-1',
          name: 'Ahmed Bello',
          membername: 'ahmed',
          avatarUrl: 'https://example.com/avatar.jpg',
          isVerified: true
        }
      }
    ],
    fetchPhotoCredits: jest.fn(),
    ficBalance: 500,
    handleAiAssist: jest.fn(),
  }),
}));

jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      data: {
        id: 'photo-1',
        title: 'Durbar Splendor',
        description: 'Vibrant festival photography in Kano',
        imageUrl: 'https://example.com/durbar.jpg',
        price_credits: 20,
        cost: 20,
        photographer: 'Ahmed Bello'
      }
    }),
  }
}));

jest.mock('../components/CommentSection', () => ({
  __esModule: true,
  default: () => <div data-testid="comment-section">Comment Section</div>
}));

import PhotoCreditDetailPage from './PhotoCreditDetailPage';

describe('PhotoCreditDetailPage', () => {
  it('renders photo credit details and download trigger', async () => {
    render(
      <MemoryRouter initialEntries={['/photo-credits/photo-1']}>
        <Routes>
          <Route path="/photo-credits/:id" element={<PhotoCreditDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Durbar Splendor/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/500 FIC in wallet/i)).toBeInTheDocument();
  });

  it('renders mobile quick dock buttons', async () => {
    render(
      <MemoryRouter initialEntries={['/photo-credits/photo-1']}>
        <Routes>
          <Route path="/photo-credits/:id" element={<PhotoCreditDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Durbar Splendor/i)).toBeInTheDocument();
    });

    const downloadButtons = screen.getAllByRole('button', { name: /Download/i });
    expect(downloadButtons.length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
  });
});
