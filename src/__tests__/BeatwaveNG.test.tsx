import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BeatwaveNGDemoPage from '../pages/BeatwaveNGDemoPage';

// Mock the child components to isolate the test
jest.mock("../components/EnhancedBeatwaveNGPlayer", () => {
  return function MockEnhancedBeatwaveNGPlayer() {
    return (
      <div data-testid="enhanced-beatwave-player">Enhanced Beatwave Player</div>
    );
  };
});

jest.mock("../components/AmeboHistory", () => {
  return function MockAmeboHistory() {
    return <div data-testid="amebo-history">Amebo History</div>;
  };
});

jest.mock("../components/TierSelector", () => {
  return function MockTierSelector() {
    return <div data-testid="tier-selector">Tier Selector</div>;
  };
});

jest.mock("../components/MusicUploadForm", () => {
  return function MockMusicUploadForm() {
    return <div data-testid="music-upload-form">Music Upload Form</div>;
  };
});

describe("BeatwaveNGDemoPage", () => {
  it("renders without crashing", () => {
    render(<BeatwaveNGDemoPage />);
    expect(screen.getByText("BeatwaveNG")).toBeInTheDocument();
  });

  it("renders all BeatwaveNG components", () => {
    render(<BeatwaveNGDemoPage />);

    expect(screen.getByTestId("enhanced-beatwave-player")).toBeInTheDocument();
    expect(screen.getByTestId("amebo-history")).toBeInTheDocument();
    expect(screen.getByTestId("tier-selector")).toBeInTheDocument();
    expect(screen.getByTestId("music-upload-form")).toBeInTheDocument();
  });

  it("displays the correct title", () => {
    render(<BeatwaveNGDemoPage />);
    const titleElement = screen.getByText("BeatwaveNG");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe("H1");
  });
});
