import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import TrendsPage from '../TrendsPage';
import { ApiService } from '../../services/apiService';

jest.mock('../../services/apiService', () => ({ ApiService: { get: jest.fn() } }));

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({ showToast: jest.fn() }),
}));
jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('TrendsPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows its loading state while trends are fetched', () => {
    (ApiService.get as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<MemoryRouter><TrendsPage /></MemoryRouter>);

    expect(screen.getByText('Syncing Worldwide Trends...')).toBeInTheDocument();
  });

  it('renders trend titles returned by the trends API', async () => {
    (ApiService.get as jest.Mock).mockResolvedValue({ data: [{
      id: 'trend-1', title: 'Community arts week', content: 'A local trend',
      category: 'ugc', metrics: { likes: 4, comments: 2, shares: 1 },
    }] } as any);

    render(<MemoryRouter><TrendsPage /></MemoryRouter>);

    expect((await screen.findAllByText('Community arts week')).length).toBeGreaterThan(0);
  });

  it('shows an API error and remains usable when trends cannot load', async () => {
    (ApiService.get as jest.Mock).mockRejectedValue(new Error('Trends service offline'));

    render(<MemoryRouter><TrendsPage /></MemoryRouter>);

    expect(await screen.findByText('Trends service offline')).toBeInTheDocument();
  });
});
