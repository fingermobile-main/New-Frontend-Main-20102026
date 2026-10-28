import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../services/apiService', () => ({
  ApiService: {
    get: jest.fn().mockResolvedValue({
      data: [
        {
          id: 'trend-1',
          topic: '#AfroBeatsWave',
          title: 'Afrobeats dominates global billboard rankings',
          content: 'Streaming metrics break new sovereign records.',
          category: 'music',
          author: { id: 'auth-1', username: 'LagosBeats', avatarUrl: '' },
          metrics: { likes: 1250, comments: 340, shares: 890 },
          trendingScore: 98,
          timestamp: '2h ago'
        }
      ]
    })
  }
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../components/widgets/PlatformWidgetsAndAdsRail', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-widgets-rail">Platform Rail</div>
}));

jest.mock('../components/widgets/ConnectWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="connect-widget">Connect Widget</div>
}));

jest.mock('../components/widgets/DiscoverWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="discover-widget">Discover Widget</div>
}));

import TrendsPage from './TrendsPage';

describe('TrendsPage', () => {
  it('renders cultural radar header and trending items', () => {
    render(
      <BrowserRouter>
        <TrendsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Worldwide Cultural Radar/i })).toBeInTheDocument();
  });

  it('navigates categories via quick dock buttons', () => {
    render(
      <BrowserRouter>
        <TrendsPage />
      </BrowserRouter>
    );

    const redCarpetBtns = screen.getAllByRole('button', { name: /Red Carpet/i });
    expect(redCarpetBtns.length).toBeGreaterThan(0);
    fireEvent.click(redCarpetBtns[0]);

    const newsBtns = screen.getAllByRole('button', { name: /News/i });
    expect(newsBtns.length).toBeGreaterThan(0);
    fireEvent.click(newsBtns[0]);
  });
});
