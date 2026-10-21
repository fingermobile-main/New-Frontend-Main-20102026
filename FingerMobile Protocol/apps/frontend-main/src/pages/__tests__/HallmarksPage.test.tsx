import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import HallmarksPage from '../HallmarksPage';
import { hallmarksService } from '../../services/HallmarksService';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({ ficBalance: 0, user: null, showToast: jest.fn() }),
}));
jest.mock('../../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('HallmarksPage', () => {
  afterEach(() => jest.restoreAllMocks());

  it('shows the loading state while quota and communities load', () => {
    jest.spyOn(hallmarksService, 'getQuota').mockReturnValue(new Promise(() => {}));
    jest.spyOn(hallmarksService, 'getAllHallmarks').mockReturnValue(new Promise(() => {}));

    render(<MemoryRouter><HallmarksPage /></MemoryRouter>);

    expect(screen.getByText('Synchronizing Sovereign Hallmarks...')).toBeInTheDocument();
  });

  it('renders the page’s built-in communities when no remote list is available', async () => {
    jest.spyOn(hallmarksService, 'getQuota').mockResolvedValue({ success: false } as any);
    jest.spyOn(hallmarksService, 'getAllHallmarks').mockResolvedValue({ success: true, data: [] } as any);

    render(<MemoryRouter><HallmarksPage /></MemoryRouter>);

    expect(await screen.findByText('Digital Living Room')).toBeInTheDocument();
    expect(screen.getByText('Afro-Futurism Sound Lab')).toBeInTheDocument();
  });

  it('keeps built-in communities visible when remote requests fail', async () => {
    jest.spyOn(hallmarksService, 'getQuota').mockRejectedValue(new Error('offline'));
    jest.spyOn(hallmarksService, 'getAllHallmarks').mockRejectedValue(new Error('offline'));

    render(<MemoryRouter><HallmarksPage /></MemoryRouter>);

    expect(await screen.findByText('Digital Living Room')).toBeInTheDocument();
  });
});
