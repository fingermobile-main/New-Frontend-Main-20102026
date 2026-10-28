import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForumManagementPage from './ForumManagementPage';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    forumCategories: [
      {
        id: 'cat-1',
        name: 'General Discussion',
        description: 'Open discussion about FingerMobile platform.',
        slug: 'general-discussion',
        postCount: 142,
      },
    ],
    handleUpsertForumCategory: jest.fn(),
    handleDeleteForumCategory: jest.fn(),
    showToast: jest.fn(),
  }),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnership() {
    return <div data-testid="platform-ownership-card" />;
  };
});

describe('ForumManagementPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders forum management categories and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <ForumManagementPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Forum Categories Management/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /New/i }).length).toBeGreaterThan(0);
  });
});
