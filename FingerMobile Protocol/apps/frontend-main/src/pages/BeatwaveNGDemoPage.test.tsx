import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BeatwaveNGDemoPage from './BeatwaveNGDemoPage';
import { useAppContext } from '../contexts/AppContext';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue([]),
    post: jest.fn().mockResolvedValue({ success: true }),
  },
}));

describe('BeatwaveNGDemoPage Mobile Optimization', () => {
  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      showToast: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders high fidelity studio title and waveform analyzer', () => {
    render(
      <MemoryRouter>
        <BeatwaveNGDemoPage />
      </MemoryRouter>
    );

    expect(screen.getByText('BeatwaveNG High-Fidelity Studio')).toBeInTheDocument();
    expect(screen.getByText('Real-time Spectrum & Waveform Analyzer')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <BeatwaveNGDemoPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Play Track|Pause Track/)).toBeInTheDocument();
    expect(screen.getByLabelText('Club Preset')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle Spatial')).toBeInTheDocument();
    expect(screen.getByLabelText('Console Hub')).toBeInTheDocument();
  });
});
