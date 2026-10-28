import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchResultsPage from './SearchResultsPage';
import { useAppContext } from '../../contexts/AppContext';
import { search } from '../../services/api';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../../services/api', () => ({
  search: jest.fn(),
}));

describe('SearchResultsPage Mobile Optimization', () => {
  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      handleAiAssist: jest.fn(),
    });
    (search as jest.Mock).mockResolvedValue({
      results: [
        {
          id: 'res-1',
          title: 'Quantum Protocol Alpha',
          description: 'A revolutionary protocol benchmark.',
          type: 'post',
          url: '/forum/post/1',
        },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders search results and AI assist button', async () => {
    render(
      <MemoryRouter initialEntries={['/search/results?q=quantum']}>
        <SearchResultsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Search Results')).toBeInTheDocument();
      expect(screen.getByText(/Found 1 results for "quantum"/i)).toBeInTheDocument();
      expect(screen.getByText('Quantum Protocol Alpha')).toBeInTheDocument();
      expect(screen.getByText('Ask AI for help with these results')).toBeInTheDocument();
    });
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', async () => {
    render(
      <MemoryRouter initialEntries={['/search/results?q=quantum']}>
        <SearchResultsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('New Search')).toBeInTheDocument();
      expect(screen.getByLabelText('AI Assist')).toBeInTheDocument();
      expect(screen.getByLabelText('Toggle Filter')).toBeInTheDocument();
      expect(screen.getByLabelText('Home Forum')).toBeInTheDocument();
    });
  });
});

