import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dancia4TvPage from './Dancia4TvPage';
import { Dancia4TvProvider } from '../contexts/Dancia4TvContext';
import { AppProvider } from '../contexts/AppContext';

// Mock apiService
jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    request: jest.fn().mockImplementation((url: string) => {
      if (url.includes('/videos')) {
        return Promise.resolve({ success: true, data: [] });
      }
      if (url.includes('/plans')) {
        return Promise.resolve({ success: true, data: [] });
      }
      return Promise.resolve({ success: true, data: {} });
    }),
  },
}));

describe('Dancia4TvPage Component', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('dancia4tv_age_verified', 'true');
    localStorage.setItem('dancia4tv_onboarding_completed', 'true');
  });

  const renderWithProviders = () =>
    render(
      <MemoryRouter>
        <AppProvider>
          <Dancia4TvProvider>
            <Dancia4TvPage />
          </Dancia4TvProvider>
        </AppProvider>
      </MemoryRouter>
    );

  it('renders Dancia-4Tv header, title, and hero movie banner', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/Live & OTT 4K Stream/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText('The Sovereign Throne: Crown of Fire').length).toBeGreaterThan(0);
    expect(screen.getByText(/PRIME EXCLUSIVE/i)).toBeInTheDocument();
  });

  it('renders mobile navigation dock with Stream, Catalog, Plans, and Library buttons', async () => {
    renderWithProviders();

    await waitFor(() => {
      const mobileDock = screen.getByRole('complementary', { name: 'Dancia-4Tv Mobile Navigation Dock' });
      expect(mobileDock).toBeInTheDocument();
      expect(mobileDock).toHaveTextContent('Stream');
      expect(mobileDock).toHaveTextContent('Catalog');
      expect(mobileDock).toHaveTextContent('Plans');
      expect(mobileDock).toHaveTextContent('Library');
    });
  });

  it('renders mobile channels bar with Movies, TV Shows, Live TV, Sports, VoD, and AI Studios', async () => {
    renderWithProviders();

    await waitFor(() => {
      const channelsNav = screen.getByRole('navigation', { name: 'Streaming Channels' });
      expect(channelsNav).toBeInTheDocument();
      expect(channelsNav).toHaveTextContent('Movies');
      expect(channelsNav).toHaveTextContent('TV Shows');
      expect(channelsNav).toHaveTextContent('Live TV');
      expect(channelsNav).toHaveTextContent('Sports');
      expect(channelsNav).toHaveTextContent('VoD Models');
      expect(channelsNav).toHaveTextContent('AI Studios');
    });
  });

  it('allows switching to Catalog Browse tab', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Catalog Browse')).toBeInTheDocument();
    });

    const catalogBrowseButton = screen.getByText('Catalog Browse');
    fireEvent.click(catalogBrowseButton);

    await waitFor(() => {
      expect(screen.getByText('Movie Types')).toBeInTheDocument();
    });
  });

  it('shows age verification modal when not verified and accepts input', async () => {
    localStorage.removeItem('dancia4tv_age_verified');
    localStorage.removeItem('dancia4tv_onboarding_completed');

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Age Verification')).toBeInTheDocument();
    });

    const yearInput = screen.getByPlaceholderText('e.g. 1995');
    const monthInput = screen.getByPlaceholderText('1 - 12');
    const verifyButton = screen.getByRole('button', { name: /Verify & Enter/i });

    fireEvent.change(yearInput, { target: { value: '1992' } });
    fireEvent.change(monthInput, { target: { value: '8' } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.queryByText('Age Verification')).not.toBeInTheDocument();
    });
  });
});
