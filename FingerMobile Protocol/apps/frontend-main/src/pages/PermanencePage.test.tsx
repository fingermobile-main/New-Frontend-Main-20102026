import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockImplementation((url: string) => {
      if (url.includes('challenges')) {
        return Promise.resolve({
          data: [
            {
              id: 'c1',
              title: 'Sovereign Dance Challenge',
              description: 'Showcase your choreography',
              category: 'Physical & Dexterity',
              mechanics: ['Upload Video', 'Tag #SovereignDance'],
              creatorId: 'cr-1',
              creatorName: 'Amara',
              stakeAmount: 10,
              participants: 120,
              views: 4500,
              shares: 320,
              likes: 1200,
              status: 'active',
              createdAt: '2026-10-12',
              duration: '3 months',
            }
          ]
        });
      }
      return Promise.resolve({ data: [] });
    }),
    post: jest.fn().mockResolvedValue({ data: {} }),
  }
}));

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

import PermanencePage from './PermanencePage';

describe('PermanencePage', () => {
  it('renders heading and loaded challenges', async () => {
    render(
      <BrowserRouter>
        <PermanencePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Permanence/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Sovereign Dance Challenge/i)).toBeInTheDocument();
    });
  });

  it('renders mobile quick dock buttons and switches tab', async () => {
    render(
      <BrowserRouter>
        <PermanencePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Sovereign Dance Challenge/i)).toBeInTheDocument();
    });

    const gamesBtns = screen.getAllByRole('button', { name: /Games/i });
    expect(gamesBtns.length).toBeGreaterThan(0);
    fireEvent.click(gamesBtns[0]);
  });
});

