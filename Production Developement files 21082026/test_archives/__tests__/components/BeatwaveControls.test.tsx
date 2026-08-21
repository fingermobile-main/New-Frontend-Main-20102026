import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BeatwaveControls from '../../components/BeatwaveControls';

// Mock the heroicons
jest.mock("../components/icons", () => ({
  PlayIcon: () => <div>Play Icon</div>,
  PauseIcon: () => <div>Pause Icon</div>,
  ArrowLeftIcon: () => <div>Previous Icon</div>,
  ArrowRightIcon: () => <div>Next Icon</div>,
  SpeakerWaveIcon: () => <div>Volume Icon</div>,
  ArrowsPointingOutIcon: () => <div>Fullscreen Icon</div>}));

describe("BeatwaveControls", () => {
  const mockProps = {
    isPlaying: false,
    onPlayPause: jest.fn(),
    onPrevious: jest.fn(),
    onNext: jest.fn(),
    volume: 50,
    onVolumeChange: jest.fn(),
    onFullscreen: jest.fn()};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<BeatwaveControls {...mockProps} />);
    expect(screen.getByLabelText("Previous track")).toBeInTheDocument();
    expect(screen.getByLabelText("Play")).toBeInTheDocument();
    expect(screen.getByLabelText("Next track")).toBeInTheDocument();
    expect(screen.getByLabelText("Volume control")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle fullscreen")).toBeInTheDocument();
  });

  it("displays play icon when not playing", () => {
    render(<BeatwaveControls {...mockProps} />);
    expect(screen.getByText("Play Icon")).toBeInTheDocument();
  });

  it("displays pause icon when playing", () => {
    render(<BeatwaveControls {...mockProps} isPlaying={true} />);
    expect(screen.getByText("Pause Icon")).toBeInTheDocument();
  });

  it("calls onPlayPause when play/pause button is clicked", () => {
    render(<BeatwaveControls {...mockProps} />);
    const playButton = screen.getByLabelText("Play");
    fireEvent.click(playButton);
    expect(mockProps.onPlayPause).toHaveBeenCalledTimes(1);
  });

  it("calls onPrevious when previous button is clicked", () => {
    render(<BeatwaveControls {...mockProps} />);
    const prevButton = screen.getByLabelText("Previous track");
    fireEvent.click(prevButton);
    expect(mockProps.onPrevious).toHaveBeenCalledTimes(1);
  });

  it("calls onNext when next button is clicked", () => {
    render(<BeatwaveControls {...mockProps} />);
    const nextButton = screen.getByLabelText("Next track");
    fireEvent.click(nextButton);
    expect(mockProps.onNext).toHaveBeenCalledTimes(1);
  });

  it("calls onVolumeChange when volume is adjusted", () => {
    render(<BeatwaveControls {...mockProps} />);
    const volumeInput = screen.getByLabelText("Volume control");
    fireEvent.change(volumeInput, { target: { value: "80" } });
    expect(mockProps.onVolumeChange).toHaveBeenCalledWith(80);
  });

  it("calls onFullscreen when fullscreen button is clicked", () => {
    render(<BeatwaveControls {...mockProps} />);
    const fullscreenButton = screen.getByLabelText("Toggle fullscreen");
    fireEvent.click(fullscreenButton);
    expect(mockProps.onFullscreen).toHaveBeenCalledTimes(1);
  });
});
