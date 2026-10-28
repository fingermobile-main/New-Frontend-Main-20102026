import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GroupsPage from './GroupsPage.tsx';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

jest.mock('../components/widgets/PlatformWidgetsAndAdsRail', () => ({
  __esModule: true,
  default: () => <div>PlatformWidgetsAndAdsRail</div>,
  PlatformWidgetsAndAdsRail: () => <div>PlatformWidgetsAndAdsRail</div>
}));

jest.mock('../components/widgets/ConnectWidget', () => ({
  __esModule: true,
  default: () => <div>ConnectWidget</div>
}));

jest.mock('../components/widgets/DiscoverWidget', () => ({
  __esModule: true,
  default: () => <div>DiscoverWidget</div>
}));

jest.mock('../services/groupsService', () => ({
  __esModule: true,
  default: {
    getGroups: jest.fn().mockResolvedValue([
      {
        id: 'grp_1',
        name: 'React Sovereign Builders',
        category: 'tech',
        membersCount: 420,
        privacy: 'public',
        description: 'Elite collective of protocol developers',
        isMember: false,
        icon: 'Code'
      }
    ]),
    createGroup: jest.fn().mockResolvedValue({ id: 'grp_new', success: true }),
    joinGroup: jest.fn().mockResolvedValue({ success: true }),
    leaveGroup: jest.fn().mockResolvedValue({ success: true })
  }
}));

describe('GroupsPage Component & Sovereign Mobile Quick Dock', () => {
  const renderGroupsPage = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <GroupsPage />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders the groups page header and sections', async () => {
    renderGroupsPage();

    expect(await screen.findByText(/The Digital Living Room™ Micro-Community Architecture/i)).toBeInTheDocument();
  });

  it('renders the Sovereign Mobile Navigation Quick Dock with all tabs', async () => {
    renderGroupsPage();

    const mobileDock = await screen.findByTestId('groups-mobile-dock');
    expect(mobileDock).toBeInTheDocument();

    const discoverBtn = screen.getByRole('button', { name: /^Discover$/i });
    const joinedBtn = screen.getByRole('button', { name: /^Joined$/i });
    const createBtn = screen.getByRole('button', { name: /^Create$/i });
    const guidesBtn = screen.getByRole('button', { name: /^Guides$/i });

    expect(discoverBtn).toBeInTheDocument();
    expect(joinedBtn).toBeInTheDocument();
    expect(createBtn).toBeInTheDocument();
    expect(guidesBtn).toBeInTheDocument();

    // Click Joined
    fireEvent.click(joinedBtn);
    expect(joinedBtn.className).toContain('text-blue-400');

    // Click Create button to trigger modal
    fireEvent.click(createBtn);
    expect(await screen.findByText(/Initialize Digital Living Room/i)).toBeInTheDocument();
  });
});
