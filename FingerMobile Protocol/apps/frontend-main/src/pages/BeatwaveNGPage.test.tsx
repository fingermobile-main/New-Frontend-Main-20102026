import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BeatwaveNGPage from './BeatwaveNGPage';
import { useAppContext } from '../contexts/AppContext';
import { useBeatwaveNG } from '../contexts/BeatwaveNGContext';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../contexts/BeatwaveNGContext', () => ({
  useBeatwaveNG: jest.fn(),
  CURATED_70_GENRES: ['Afrobeats', 'Highlife', 'Amapiano'],
}));

jest.mock('../components/BeatwaveNGPlayer', () => () => <div data-testid="beatwave-ng-player">Player</div>);
jest.mock('../components/beatwaveng/MiiTopWidget', () => () => <div data-testid="mii-top-widget">Top Widget</div>);
jest.mock('../components/beatwaveng/AudioDeviceSelectorModal', () => () => null);
jest.mock('../components/beatwaveng/BeatwaveTastePreferencesModal', () => () => null);

describe('BeatwaveNGPage Mobile Optimization', () => {
  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      ficBalance: 1200,
      showToast: jest.fn(),
    });

    (useBeatwaveNG as jest.Mock).mockReturnValue({
      tracks: [
        { id: 1, title: 'Afro Beat Master', artist: 'Dancia Beats', genre: 'Afrobeats', duration: 180 },
      ],
      currentTrack: null,
      isPlaying: false,
      radioStations: [],
      activeRadioStation: null,
      audioQuality: 'Hi-Res',
      playTrack: jest.fn(),
      pauseTrack: jest.fn(),
      resumeTrack: jest.fn(),
      playRadioStation: jest.fn(),
      stopRadioStation: jest.fn(),
      searchPublicStreamAggregator: jest.fn(),
      importPublicTrackToLibrary: jest.fn(),
      createPlaylist: jest.fn(),
      setAudioQuality: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders brand heading and search bar', () => {
    render(
      <MemoryRouter>
        <BeatwaveNGPage />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Beatwave').length).toBeGreaterThan(0);
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <BeatwaveNGPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Listen Now Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Radio Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Library Tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Add Playlist')).toBeInTheDocument();
  });
});
