import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HallmarksPage from './HallmarksPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../components/widgets/PlatformWidgetsAndAdsRail', () => ({
  __esModule: true,
  PlatformWidgetsAndAdsRail: () => <div>PlatformWidgetsAndAdsRail</div>
}));

jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockImplementation((url: string) => {
      if (url.includes('/communities')) {
        return Promise.resolve({
          data: [
            {
              id: 'comm_1',
              name: 'Sovereign Creators Alliance',
              badge: 'Flagship',
              description: 'Official protocol creator council',
              membersCount: 1200,
              reputation: 98,
              hallmarkScore: 99
            }
          ]
        });
      }
      return Promise.resolve({ data: [] });
    }),
    post: jest.fn().mockResolvedValue({ data: { success: true } })
  }
}));

jest.mock('../services/HallmarksService', () => ({
  __esModule: true,
  default: {
    getQuota: jest.fn().mockResolvedValue({
      hasPaid: true,
      pagesCreated: 1,
      maxPages: 5,
      canCreatePage: true
    }),
    getAllHallmarks: jest.fn().mockResolvedValue([]),
    getCommunityHallmarks: jest.fn().mockResolvedValue([]),
    getCommunityAnalytics: jest.fn().mockResolvedValue({
      totalMembers: 1200,
      engagementRate: 85
    }),
    awardHallmark: jest.fn().mockResolvedValue({ success: true }),
    revokeHallmark: jest.fn().mockResolvedValue({ success: true })
  }
}));

describe('HallmarksPage Component & Sovereign Mobile Quick Dock', () => {
  const renderHallmarksPage = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <HallmarksPage />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders the hallmarks header and flagship sections', async () => {
    renderHallmarksPage();

    expect(await screen.findByText(/Sovereign Protocol Governance & Mega-Communities/i)).toBeInTheDocument();
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with all controls', async () => {
    renderHallmarksPage();

    const mobileDock = await screen.findByLabelText(/Hallmarks Master Navigation/i);
    expect(mobileDock).toBeInTheDocument();

    const guildsBtn = within(mobileDock).getByRole('button', { name: /^Guilds$/i });
    const accoladesBtn = within(mobileDock).getByRole('button', { name: /^Accolades$/i });
    const createBtn = within(mobileDock).getByRole('button', { name: /^Create$/i });
    const auditBtn = within(mobileDock).getByRole('button', { name: /^Audit$/i });

    expect(guildsBtn).toBeInTheDocument();
    expect(accoladesBtn).toBeInTheDocument();
    expect(createBtn).toBeInTheDocument();
    expect(auditBtn).toBeInTheDocument();

    // Click Accolades
    fireEvent.click(accoladesBtn);
    expect(accoladesBtn.className).toContain('text-amber-400');
  });
});
