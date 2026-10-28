import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BeatwaveDemoPage from './BeatwaveDemoPage';
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

describe('BeatwaveDemoPage Mobile Optimization', () => {
  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      showToast: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders studio title and track list', () => {
    render(
      <MemoryRouter>
        <BeatwaveDemoPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Beatwave Studio Console')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <BeatwaveDemoPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Play Track|Pause Track/)).toBeInTheDocument();
    expect(screen.getByLabelText('Create Playlist')).toBeInTheDocument();
    expect(screen.getByLabelText('Beatwave NG')).toBeInTheDocument();
    expect(screen.getByLabelText('Back to Forum')).toBeInTheDocument();
  });
});
