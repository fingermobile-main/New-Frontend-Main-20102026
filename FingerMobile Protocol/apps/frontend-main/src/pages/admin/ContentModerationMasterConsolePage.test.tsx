import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContentModerationMasterConsolePage from './ContentModerationMasterConsolePage';

jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../../services/contentModerationConsoleService', () => ({
  contentModerationConsoleService: {
    getItems: () => Promise.resolve([
      {
        id: 'cm-pol-1',
        name: 'Toxic Content Heuristic Sieve',
        code: 'NLP-TOX-01',
        domain: 'heuristic_flagging_queue',
        category: 'NLP & Vision Heuristics',
        risk_score: 85.0,
        strike_level: 'STRIKE-1',
        action_policy: 'AUTO-FLAG & QUARANTINE',
        total_cases_processed: 125000,
        quarantined_items_count: 320,
        status: 'active',
        priority_order: 1,
      },
    ]),
    getOverview: () => Promise.resolve({
      summary: {
        total_items: 1,
        active_count: 1,
        frozen_count: 0,
        total_cases_processed: 125000,
        total_quarantined: 320,
        average_risk_score: 85.0,
        total_strike_rules: 1,
        total_child_shields: 0,
        total_tribunal_chambers: 0,
        total_copyright_engines: 0,
        active_penalty_holds: 10,
      },
    }),
    getSpawnedConsoles: () => Promise.resolve([]),
  },
}));

jest.mock('../../services/SuperViAudioEngine', () => ({
  __esModule: true,
  default: {
    playVoiceLine: jest.fn(),
  },
}));

describe('ContentModerationMasterConsolePage Mobile Optimization & Behavior', () => {
  it('renders the master safety console heading and policy item', async () => {
    render(
      <BrowserRouter>
        <ContentModerationMasterConsolePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /content moderation, trust, safety & ethics console/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Toxic Content Heuristic Sieve/i)).toBeInTheDocument();
    });
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', async () => {
    render(
      <BrowserRouter>
        <ContentModerationMasterConsolePage />
      </BrowserRouter>
    );

    const mobileDock = screen.getByRole('navigation', { name: /content moderation master console mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});
