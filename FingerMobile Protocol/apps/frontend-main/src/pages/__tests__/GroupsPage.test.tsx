import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import GroupsPage from '../GroupsPage';
import groupsService, { Group } from '../../services/groupsService';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({ showToast: jest.fn(), ficBalance: 0 }),
}));
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, logout: jest.fn() }),
}));

jest.mock('../../components/LoadingSpinner', () => () => <div>Loading…</div>);

const groups: Group[] = [
  {
    id: 'group-1', name: 'Test Group One', description: 'First group',
    members: 10, online: 2, privacy: 'public', category: 'general',
    avatarUrl: '', isJoined: true, lastActivity: 'Today', owner: 'owner-1',
  },
  {
    id: 'group-2', name: 'Test Group Two', description: 'Second group',
    members: 20, online: 3, privacy: 'private', category: 'general',
    avatarUrl: '', isJoined: false, lastActivity: 'Yesterday', owner: 'owner-2',
  },
];

const renderPage = () => render(
  <MemoryRouter><GroupsPage /></MemoryRouter>,
);

describe('GroupsPage', () => {
  afterEach(() => jest.restoreAllMocks());

  it('shows a loading state while groups are fetched', () => {
    jest.spyOn(groupsService, 'getAllGroups').mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(screen.getByText(/Loading Digital Living Rooms/)).toBeInTheDocument();
  });

  it('renders groups returned by the groups service', async () => {
    jest.spyOn(groupsService, 'getAllGroups').mockResolvedValue({ success: true, data: groups });

    renderPage();

    expect(await screen.findByText('Test Group One')).toBeInTheDocument();
    expect(screen.getByText('Test Group Two')).toBeInTheDocument();
  });

  it('shows a useful error when the group request fails', async () => {
    jest.spyOn(groupsService, 'getAllGroups').mockRejectedValue(new Error('offline'));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Failed to connect to groups database')).toBeInTheDocument();
    });
  });

  it('renders mobile quick dock with interactive targets', async () => {
    jest.spyOn(groupsService, 'getAllGroups').mockResolvedValue({ success: true, data: groups });
    renderPage();
    const dock = await screen.findByTestId('groups-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^discover$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^joined$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^create$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^guides$/i })).toBeInTheDocument();
  });
});
