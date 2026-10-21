import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ForumPage from '../ForumPage';
import ForumService from '../../services/forumService';

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, logout: jest.fn() }),
}));
jest.mock('../../components/forum/ForumPostCard', () => ({
  __esModule: true,
  default: ({ post }: { post: { title: string } }) => <article>{post.title}</article>,
}));

const renderPage = () => render(<MemoryRouter><ForumPage /></MemoryRouter>);

describe('ForumPage', () => {
  afterEach(() => jest.restoreAllMocks());

  it('renders the current FingerMobile forum shell and search field', () => {
    renderPage();

    expect(screen.getByRole('button', { name: 'FingerMobile Protocol' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search sovereign posts, stems, keycards, tags...')).toBeInTheDocument();
  });

  it('renders the page’s built-in forum posts', async () => {
    jest.spyOn(ForumService, 'getCategories').mockResolvedValue({ success: true, data: { categories: [] }, message: 'ok' });
    jest.spyOn(ForumService, 'getAllPosts').mockResolvedValue({ success: true, data: { posts: [], total: 0 }, message: 'ok' });

    renderPage();

    expect(await screen.findByText('Deploying EAL6+ Conductive Sensors on High-Bandwidth Mesh Relays')).toBeInTheDocument();
  });

  it('keeps the fallback feed available when forum requests fail', async () => {
    jest.spyOn(ForumService, 'getCategories').mockRejectedValue(new Error('offline'));
    jest.spyOn(ForumService, 'getAllPosts').mockRejectedValue(new Error('offline'));

    renderPage();

    expect(await screen.findByText('Deploying EAL6+ Conductive Sensors on High-Bandwidth Mesh Relays')).toBeInTheDocument();
  });
});
