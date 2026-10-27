import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BeatwaveNGPage from './BeatwaveNGPage';
import { BeatwaveNGProvider } from '../contexts/BeatwaveNGContext';
import { AppProvider } from '../contexts/AppContext';

describe('BeatwaveNGPage Component', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('beatwave_taste_onboarded', 'true');
  });

  const renderWithProviders = () =>
    render(
      <MemoryRouter>
        <AppProvider>
          <BeatwaveNGProvider>
            <BeatwaveNGPage />
          </BeatwaveNGProvider>
        </AppProvider>
      </MemoryRouter>
    );

  it('renders BeatwaveNG header, Mii top widget, and Listen Now view by default', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: 'Listen Now' })).toBeInTheDocument();
    });

    expect(screen.getByText('Featured Spotlights & Master Exclusives')).toBeInTheDocument();
    expect(screen.getByText('Adebayo FM')).toBeInTheDocument();
    expect(screen.getByText('Live Broadcast Status')).toBeInTheDocument();
  });

  it('renders mobile navigation dock with Listen, Browse, Radio, Library, and Upload buttons', async () => {
    renderWithProviders();

    const mobileDock = screen.getByRole('navigation', { name: 'Mobile Navigation Dock' });
    expect(mobileDock).toBeInTheDocument();
    expect(mobileDock).toHaveTextContent('Listen');
    expect(mobileDock).toHaveTextContent('Browse');
    expect(mobileDock).toHaveTextContent('Radio');
    expect(mobileDock).toHaveTextContent('Library');
    expect(mobileDock).toHaveTextContent('Upload');
  });

  it('allows switching to Browse tab and displays Top 100 Charts', async () => {
    renderWithProviders();

    const browseButtons = screen.getAllByRole('button', { name: /Browse/i });
    expect(browseButtons.length).toBeGreaterThan(0);
    fireEvent.click(browseButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('BeatwaveNG Official Nigerian Top 100')).toBeInTheDocument();
    });
  });

  it('allows opening Creator Upload Modal from mobile and desktop triggers', async () => {
    renderWithProviders();

    const uploadButtons = screen.getAllByRole('button', { name: /Upload/i });
    expect(uploadButtons.length).toBeGreaterThan(0);
    fireEvent.click(uploadButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Upload Music or Podcast to BeatwaveNG')).toBeInTheDocument();
    });

    expect(screen.getByText('Publish to BeatwaveNG')).toBeInTheDocument();

    // Close the modal
    const closeBtn = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Upload Music or Podcast to BeatwaveNG')).not.toBeInTheDocument();
    });
  });

  it('allows switching to Live Radio Stations tab', async () => {
    renderWithProviders();

    const radioButtons = screen.getAllByRole('button', { name: /Radio/i });
    expect(radioButtons.length).toBeGreaterThan(0);
    fireEvent.click(radioButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Taste-Based Live Radio Streaming Stations')).toBeInTheDocument();
    });
  });
});
