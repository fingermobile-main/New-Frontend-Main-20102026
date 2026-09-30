import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LushPressiesPage from '../pages/LushPressiesPage';

// Mock the icons from heroicons
jest.mock('../components/icons', () => ({
  memberIcon: () => <div>member Icon</div>,
  HeartIcon: () => <div>Heart Icon</div>,
  GiftIcon: () => <div>Gift Icon</div>,
  ChatBubbleLeftRightIcon: () => <div>Chat Icon</div>,
  ChartBarIcon: () => <div>Chart Icon</div>,
  CogIcon: () => <div>Cog Icon</div>,
  MagnifyingGlassIcon: () => <div>Search Icon</div>}));

describe('LushPressiesPage', () => {
  it('renders without crashing', async () => {
    render(<LushPressiesPage />);
    expect(
      await screen.findByText('Discover Matches', undefined, { timeout: 2000 }),
    ).toBeInTheDocument();
  });

  it('displays the main tab navigation', async () => {
    render(<LushPressiesPage />);

    expect(
      await screen.findByText('member Icon', undefined, { timeout: 2000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Heart Icon', undefined, { timeout: 2000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Gift Icon', undefined, { timeout: 2000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Chat Icon', undefined, { timeout: 2000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Chart Icon', undefined, { timeout: 2000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Cog Icon', undefined, { timeout: 2000 }),
    ).toBeInTheDocument();
  });

  it('renders the discover tab by default', async () => {
    render(<LushPressiesPage />);
    // Check that elements specific to the discover tab are present
    expect(
      await screen.findByText('Discover Matches', undefined, { timeout: 2000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByPlaceholderText('Search matches...', undefined, {
        timeout: 2000}),
    ).toBeInTheDocument();
  });
});
