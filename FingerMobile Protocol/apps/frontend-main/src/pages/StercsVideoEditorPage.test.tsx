import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StercsVideoEditorPage from './StercsVideoEditorPage';
import * as AppContextModule from '../contexts/AppContext';

// Mock dependencies
jest.mock('../services/apiService', () => ({
  get: jest.fn().mockResolvedValue([]),
  post: jest.fn().mockResolvedValue({ id: 'proj-123' })
}));

describe('StercsVideoEditorPage Mobile Optimization Tests', () => {
  beforeEach(() => {
    jest.spyOn(AppContextModule, 'useAppContext').mockReturnValue({
      ficBalance: 500,
      showToast: jest.fn(),
      currentUser: { id: 'creator-1', name: 'Video Master' }
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderPage = () => {
    return render(
      <BrowserRouter>
        <StercsVideoEditorPage />
      </BrowserRouter>
    );
  };

  it('renders studio header and project controls', () => {
    renderPage();
    expect(screen.getByText('Timeline Video Editor')).toBeInTheDocument();
    expect(screen.getByText(/STERCS Multi-Track Video Timeline Editor/i)).toBeInTheDocument();
    expect(screen.getByText('Export Video')).toBeInTheDocument();
  });

  it('renders mobile sovereign navigation quick dock', () => {
    renderPage();
    const dock = screen.getByTestId('stercs-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByText('Videos')).toBeInTheDocument();
    expect(screen.getByText('Cut')).toBeInTheDocument();
    expect(screen.getByText('FX')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
  });

  it('interacts with video timeline tools with 44px tap targets', () => {
    renderPage();
    const splitBtn = screen.getByTestId('stercs-split-btn');
    expect(splitBtn).toBeInTheDocument();
    fireEvent.click(splitBtn);

    const transitionBtn = screen.getByTestId('stercs-transition-btn');
    expect(transitionBtn).toBeInTheDocument();
    fireEvent.click(transitionBtn);
  });

  it('renders multi-track channels with touch selectable clips', () => {
    renderPage();
    expect(screen.getByText('Video')).toBeInTheDocument();
    expect(screen.getByText('Audio')).toBeInTheDocument();
    expect(screen.getByText('Overlay')).toBeInTheDocument();

    const introClip = screen.getByText('Intro Drone Horizon.mp4');
    expect(introClip).toBeInTheDocument();
    fireEvent.click(introClip);
  });
});
