import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GemsPage from './GemsPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

jest.mock('../services/gemsService', () => ({
  __esModule: true,
  default: {
    getGems: jest.fn().mockResolvedValue([
      {
        id: 'gem_1',
        name: 'Sapphire Spark',
        category: 'effects',
        priceGems: 100,
        rarity: 'rare',
        rating: 4.8,
        description: 'Shimmering sapphire effect',
        icon: 'Sparkles',
        badge: 'Popular',
        isUnlocked: false
      }
    ]),
    getUserGemBalance: jest.fn().mockResolvedValue(1250),
    redeemGemItem: jest.fn().mockResolvedValue({ success: true, newBalance: 1150 })
  }
}));

jest.mock('../services/VoiceLineService', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn().mockReturnValue({
      on: jest.fn(),
      off: jest.fn()
    })
  }
}));

jest.mock('../components/widgets/PlatformWidgetsAndAdsRail', () => ({
  __esModule: true,
  PlatformWidgetsAndAdsRail: () => <div data-testid="widgets-rail">Rail</div>,
  ConnectWidget: () => <div>Connect</div>,
  DiscoverWidget: () => <div>Discover</div>
}));

jest.mock('../components/widgets/ConnectWidget', () => ({
  __esModule: true,
  default: () => <div>ConnectWidget</div>
}));

jest.mock('../components/widgets/DiscoverWidget', () => ({
  __esModule: true,
  default: () => <div>DiscoverWidget</div>
}));

// Mock autoReplyService and other dependencies


describe('GemsPage Component & Sovereign Mobile Quick Dock', () => {
  const renderGemsPage = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <GemsPage />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders the gems page header and container elements', async () => {
    renderGemsPage();

    expect(await screen.findByText(/Virtual Economy & Broadcast Architecture/i)).toBeInTheDocument();
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with all controls', async () => {
    renderGemsPage();

    const mobileDock = await screen.findByLabelText(/Gems Mobile Navigation/i);
    expect(mobileDock).toBeInTheDocument();

    const marketBtn = screen.getByRole('button', { name: /^Market$/i });
    const broadcastBtn = screen.getByRole('button', { name: /^Broadcast$/i });
    const addGemsBtn = screen.getByRole('button', { name: /^Add Gems$/i });
    const toolsBtn = screen.getByRole('button', { name: /^Tools$/i });

    expect(marketBtn).toBeInTheDocument();
    expect(broadcastBtn).toBeInTheDocument();
    expect(addGemsBtn).toBeInTheDocument();
    expect(toolsBtn).toBeInTheDocument();

    // Switch to Broadcast tab
    fireEvent.click(broadcastBtn);
    expect(broadcastBtn.className).toContain('text-emerald-400');

    // Switch to Tools tab
    fireEvent.click(toolsBtn);
    expect(toolsBtn.className).toContain('text-purple-400');

    // Open Add Gems Modal
    fireEvent.click(addGemsBtn);
    expect(await screen.findByRole('heading', { name: /Acquire Sovereign Gems/i })).toBeInTheDocument();
  });
});
