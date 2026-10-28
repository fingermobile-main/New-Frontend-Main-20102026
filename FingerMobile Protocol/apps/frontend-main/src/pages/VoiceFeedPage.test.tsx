import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

import VoiceFeedPage from './VoiceFeedPage';

describe('VoiceFeedPage', () => {
  it('renders voice feed header and clips', () => {
    render(
      <BrowserRouter>
        <VoiceFeedPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /VoiceFeed Audio Hub/i })).toBeInTheDocument();
  });

  it('filters by category via mobile quick dock', () => {
    render(
      <BrowserRouter>
        <VoiceFeedPage />
      </BrowserRouter>
    );

    const musicBtns = screen.getAllByRole('button', { name: /Music/i });
    expect(musicBtns.length).toBeGreaterThan(0);
    fireEvent.click(musicBtns[0]);

    const podcastBtns = screen.getAllByRole('button', { name: /Podcast/i });
    expect(podcastBtns.length).toBeGreaterThan(0);
    fireEvent.click(podcastBtns[0]);
  });
});
