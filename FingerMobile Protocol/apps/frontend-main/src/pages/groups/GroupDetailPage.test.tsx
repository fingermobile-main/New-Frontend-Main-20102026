import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GroupDetailPage from './GroupDetailPage';

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ slug: 'group-1' }),
}));

// Mock groupsService
jest.mock('../../services/groupsService', () => ({
  __esModule: true,
  default: {
    getGroupById: jest.fn().mockResolvedValue({
      group: {
        id: 'group-1',
        name: 'Afrobeat Masters Guild',
        description: 'Elite collective of producers and songwriters',
        avatarUrl: 'https://picsum.photos/seed/group/100/100',
        members: [{ id: '1', name: 'User 1' }],
        posts: [],
        isJoined: false,
      }
    }),
    joinGroup: jest.fn().mockResolvedValue({ success: true }),
  }
}));

// Mock AppContext
jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

// Mock VoiceLineService
jest.mock('../../services/VoiceLineService', () => ({
  __esModule: true,
  default: {
    playCommentaryVoiceLine: jest.fn(),
  }
}));

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = ['Users', 'Compass', 'ArrowLeft', 'MessageSquare', 'PhoneCall', 'Radio'];
  const mockIcons: Record<string, any> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={`icon-${name.toLowerCase()}`} {...props} />;
  });
  return mockIcons;
});

describe('GroupDetailPage Mobile & Responsive Suite', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <GroupDetailPage />
      </BrowserRouter>
    );
  };

  it('renders group header and private status for non-members', async () => {
    renderComponent();
    expect(await screen.findByText(/Afrobeat Masters Guild/i)).toBeInTheDocument();
    expect(await screen.findByText(/Private Sovereign Group/i)).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with touch targets', async () => {
    renderComponent();
    const dock = await screen.findByTestId('group-detail-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^groups$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^join$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /forum/i })).toBeInTheDocument();
  });

  it('allows joining the group with 44px tap target button', async () => {
    renderComponent();
    const joinBtns = await screen.findAllByRole('button', { name: /join group/i });
    expect(joinBtns.length).toBeGreaterThan(0);
    fireEvent.click(joinBtns[0]);
  });
});
