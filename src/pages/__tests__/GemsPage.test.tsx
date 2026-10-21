import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GemsPage from '../GemsPage';
import gemsService from '../../services/gemsService';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({ ficBalance: 100, showToast: jest.fn() }),
}));
jest.mock('../../components/common/UniversalProfileCard', () => () => null);
jest.mock('../../components/widgets/PlatformWidgetsAndAdsRail', () => ({
  PlatformWidgetsAndAdsRail: () => null,
}));
jest.mock('../../components/widgets/ConnectWidget', () => () => null);
jest.mock('../../components/widgets/DiscoverWidget', () => () => null);
jest.mock('../../components/LoadingSpinner', () => () => <div>Loading…</div>);

const gem = {
  id: 'gem-1', title: 'Test Gem One', description: 'A test gem', price: 10,
  category: 'collectibles', rating: 4.5, creator: 'Test Creator', likes: 0,
  thumbnail: '', privacy_type: 'public',
};

describe('GemsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(gemsService, 'getGemBalance').mockResolvedValue({ success: true, balance: 100 } as any);
    jest.spyOn(gemsService, 'getBroadcastFeed').mockResolvedValue({ success: true, data: [] } as any);
  });
  afterEach(() => jest.restoreAllMocks());

  it('shows loading while the marketplace request is pending', () => {
    jest.spyOn(gemsService, 'getGems').mockReturnValue(new Promise(() => {}));

    render(<GemsPage />);

    expect(screen.getByText('Syncing Gem store from PostgreSQL cluster...')).toBeInTheDocument();
  });

  it('renders gem cards returned by the marketplace service', async () => {
    jest.spyOn(gemsService, 'getGems').mockResolvedValue({ success: true, data: [gem], total: 1, limit: 50, offset: 0 });

    render(<GemsPage />);

    expect(await screen.findByText('Test Gem One')).toBeInTheDocument();
  });

  it('shows a useful message when the marketplace request fails', async () => {
    jest.spyOn(gemsService, 'getGems').mockRejectedValue(new Error('offline'));

    render(<GemsPage />);

    expect(await screen.findByText('Failed to load gems marketplace items from database')).toBeInTheDocument();
  });
});
