import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InsightsPage from './InsightsPage';
import { AppProvider } from '../contexts/AppContext';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../services/apiService', () => ({
  ApiService: {
    get: jest.fn().mockImplementation((url: string) => {
      if (url.includes('/creator')) {
        return Promise.resolve({
          totalReach: 45000,
          totalPosts: 120,
          totalEngagement: 4800,
          engagementRate: '8.4%',
          trend_month_over_month: '+22.5%',
          communities: [
            {
              id: 'c1',
              name: 'Sovereign Nodes Hub',
              type: 'Technology',
              members: 1540,
              posts: 88,
              engagement: 2900,
              trend: '+15%'
            }
          ]
        });
      }
      if (url.includes('/ai-recommendations')) {
        return Promise.resolve([
          {
            id: 'rec_1',
            insight_type: 'retention',
            title: 'Optimize Peak Broadcast Hours',
            summary: 'Higher conversion rates observed between 18:00 - 21:00 UTC.',
            actionable_recommendations: ['Schedule 24-hr drops at 19:00 UTC'],
            confidence_score: 96
          }
        ]);
      }
      return Promise.resolve({});
    })
  }
}));

describe('InsightsPage Component & Sovereign Mobile Quick Dock', () => {
  const renderInsightsPage = () => {
    return render(
      <BrowserRouter>
        <AppProvider>
          <InsightsPage />
        </AppProvider>
      </BrowserRouter>
    );
  };

  it('renders the Insights header and telemetry metrics', async () => {
    renderInsightsPage();

    expect(await screen.findByRole('heading', { name: /Creator Analytics & AI Insights/i })).toBeInTheDocument();
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with all controls', async () => {
    renderInsightsPage();

    const mobileDock = await screen.findByLabelText(/Insights Mobile Navigation/i);
    expect(mobileDock).toBeInTheDocument();

    const metricsBtn = within(mobileDock).getByRole('button', { name: /^Metrics$/i });
    const aiGrowthBtn = within(mobileDock).getByRole('button', { name: /^AI Growth$/i });
    const guildsBtn = within(mobileDock).getByRole('button', { name: /^Guilds$/i });
    const exportBtn = within(mobileDock).getByRole('button', { name: /^Export$/i });

    expect(metricsBtn).toBeInTheDocument();
    expect(aiGrowthBtn).toBeInTheDocument();
    expect(guildsBtn).toBeInTheDocument();
    expect(exportBtn).toBeInTheDocument();
  });
});

