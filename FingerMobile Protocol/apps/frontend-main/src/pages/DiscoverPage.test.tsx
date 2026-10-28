import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DiscoverPage from './DiscoverPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

// Mock ApiService
jest.mock('../services/apiService', () => ({
  ApiService: {
    get: jest.fn().mockImplementation((url: string) => {
      if (url.includes('/discover/topics')) {
        return Promise.resolve({
          data: {
            topics: [
              {
                id: 'topic-1',
                name: 'Decentralized AI',
                slug: 'decentralized-ai',
                category: 'tech',
                description: 'Decentralized intelligence models and networks',
                postCount: 120,
                resonanceScore: 98,
                velocity: 12,
                trendAffinityPct: 88,
                p2pSwarmNodes: 45,
                topTags: ['ai', 'decentralized'],
                featuredAuthor: 'Dr. Turing'
              }
            ]
          }
        });
      }
      if (url.includes('/discover/hashtags')) {
        return Promise.resolve({
          data: {
            hashtags: [
              {
                tag: 'web3',
                postCount: 450,
                volume24h: 3200,
                velocityPct: 35,
                isTrendingCandidate: true,
                category: 'crypto',
                trendContributionPct: 75
              }
            ]
          }
        });
      }
      return Promise.resolve({
        data: {
          items: [],
          telemetry: {
            activeNodes: 128,
            connectedPeers: 64,
            swarmMeshHealth: 'Optimal',
            totalSeeders: 90,
            totalLeechers: 38,
            seedLeechRatio: '2.37:1',
            distributedStorageVolumeGb: 512,
            verifiedContentHashes: 1040,
            avgPropagationLatencyMs: 42,
            activeSwarms: []
          }
        }
      });
    }),
    post: jest.fn().mockResolvedValue({ data: { success: true } })
  }
}));

describe('DiscoverPage Mobile View & Sovereign Quick Dock', () => {
  it('renders correctly with title and quick navigation', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <DiscoverPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/FingerMobile Discovery Nexus/i)).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: /Discover Quick Navigation/i });
    expect(nav).toBeInTheDocument();

    const topicsBtn = screen.getByRole('button', { name: /^Topics$/i });
    const trendsBtn = screen.getByRole('button', { name: /^Trends$/i });
    const p2pBtn = screen.getByRole('button', { name: /^P2P Swarm$/i });
    const tagsBtn = screen.getByRole('button', { name: /^Tags$/i });

    expect(topicsBtn).toBeInTheDocument();
    expect(trendsBtn).toBeInTheDocument();
    expect(p2pBtn).toBeInTheDocument();
    expect(tagsBtn).toBeInTheDocument();

    fireEvent.click(trendsBtn);
    fireEvent.click(p2pBtn);
    fireEvent.click(tagsBtn);
    fireEvent.click(topicsBtn);
  });
});
