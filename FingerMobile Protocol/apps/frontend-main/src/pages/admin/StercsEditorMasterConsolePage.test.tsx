import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StercsEditorMasterConsolePage from './StercsEditorMasterConsolePage';

// Mock dependencies
jest.mock('../../services/stercsEditorConsoleService', () => ({
  stercsEditorConsoleService: {
    getOverview: jest.fn().mockResolvedValue({
      total_items: 12,
      active_items: 10,
      frozen_items: 2,
      average_fps: 60,
      average_latency_ms: 16
    }),
    getItems: jest.fn().mockResolvedValue([]),
    getSpawns: jest.fn().mockResolvedValue([])
  }
}));

jest.mock('../../services/SuperViAudioEngine', () => ({
  __esModule: true,
  default: {
    playVoiceLine: jest.fn()
  }
}));

describe('StercsEditorMasterConsolePage Mobile Optimization', () => {
  it('renders the editor master console and header', async () => {
    render(
      <BrowserRouter>
        <StercsEditorMasterConsolePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/STERCS Editor & Motion Scripting Console/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile quick dock with refresh, add module, and spawn', () => {
    render(
      <BrowserRouter>
        <StercsEditorMasterConsolePage />
      </BrowserRouter>
    );

    expect(screen.getAllByRole('button', { name: /refresh/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /\+ module/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /spawn/i }).length).toBeGreaterThanOrEqual(1);
  });
});
