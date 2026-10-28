import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    member: { id: 'usr-1', username: 'obinna' },
    showToast: jest.fn(),
  }),
}));

jest.mock('../../services/identityService', () => ({
  identityService: {
    getProfileByUsername: jest.fn().mockResolvedValue({
      id: 'usr-1',
      username: 'obinna',
      name: 'Mbah Israel Obinna',
      headline: 'Founder & Protocol Architect',
      bio: 'Decentralized systems researcher',
      avatarUrl: '/assets/branding/mbah_israel_obinna.jpeg',
      coverPhotoUrl: '',
      verifiedLevel: 5,
      meritsScore: 980,
      hallmarkBadges: [],
    }),
  },
}));

jest.mock('../../services/UserProfileSyncService', () => ({
  __esModule: true,
  default: {
    getProfile: jest.fn().mockReturnValue({
      name: 'Mbah Israel Obinna',
      username: 'obinna',
      email: 'obinna@fingermobile.org',
      headline: 'Architect',
      avatar: '/assets/branding/mbah_israel_obinna.jpeg',
      location: 'Lagos, Nigeria',
    }),
    subscribe: jest.fn().mockReturnValue(() => {}),
    saveProfile: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock('../../components/profile/SovereignMediaCropperModal', () => ({
  SovereignMediaCropperModal: () => <div data-testid="cropper-modal" />,
}));

jest.mock('../../components/profile/PeopleYouMayKnowCarousel', () => ({
  PeopleYouMayKnowCarousel: () => <div data-testid="carousel" />,
}));

jest.mock('../../components/forum/ForumPostCard', () => () => <div data-testid="forum-post" />);
jest.mock('../../components/forum/MiiStoriesBar', () => ({
  MiiStoriesBar: () => <div data-testid="mii-stories" />,
}));
jest.mock('../../components/forum/ForumPostComposer', () => ({
  ForumPostComposer: () => <div data-testid="post-composer" />,
}));
jest.mock('../../components/profile/FriendsDirectorySection', () => ({
  FriendsDirectorySection: () => <div data-testid="friends-directory" />,
}));
jest.mock('../../components/profile/ComprehensiveEditProfileModal', () => ({
  ComprehensiveEditProfileModal: () => <div data-testid="edit-modal" />,
}));
jest.mock('../../components/profile/CoverPhotoEditorModal', () => ({
  CoverPhotoEditorModal: () => <div data-testid="cover-modal" />,
}));
jest.mock('../../components/profile/StructuredAboutSection', () => ({
  StructuredAboutSection: () => <div data-testid="about-section" />,
}));
jest.mock('../../components/profile/ReelsSection', () => ({
  ReelsSection: () => <div data-testid="reels-section" />,
}));

import ProfilePage from './ProfilePage';

describe('ProfilePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders profile page with simulator toolbar and mobile quick dock', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Charter Relationship & Privacy Simulator/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /👑 Owner View/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Wall/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /About/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Edit/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
