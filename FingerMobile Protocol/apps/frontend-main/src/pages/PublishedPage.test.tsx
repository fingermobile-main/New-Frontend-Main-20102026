import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../services/api', () => ({
  getPublishedPage: jest.fn().mockResolvedValue({
    id: 'page-101',
    title: 'Sovereign Community Constitution',
    contentBlocks: [
      { id: 'b-1', type: 'heading', content: { text: 'Section 1: Data Sovereignty' } },
      { id: 'b-2', type: 'paragraph', content: { text: 'All data is cryptographically anchored.' } }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-02T00:00:00Z',
    publishedAt: '2026-01-02T00:00:00Z',
    status: 'published'
  })
}));

import PublishedPage from './PublishedPage';

describe('PublishedPage', () => {
  it('renders published page content blocks', async () => {
    render(
      <MemoryRouter initialEntries={['/p/page-101']}>
        <Routes>
          <Route path="/p/:pageId" element={<PublishedPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Sovereign Community Constitution/i })).toBeInTheDocument();
      expect(screen.getByText(/Section 1: Data Sovereignty/i)).toBeInTheDocument();
      expect(screen.getByText(/All data is cryptographically anchored./i)).toBeInTheDocument();
    });
  });

  it('renders mobile quick dock buttons', async () => {
    render(
      <MemoryRouter initialEntries={['/p/page-101']}>
        <Routes>
          <Route path="/p/:pageId" element={<PublishedPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Share/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
    });
  });
});

