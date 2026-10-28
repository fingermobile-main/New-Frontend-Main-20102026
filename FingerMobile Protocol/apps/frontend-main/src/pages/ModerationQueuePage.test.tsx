import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ModerationQueuePage from './ModerationQueuePage';

// Mock Header & Footer
jest.mock('../components/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('../components/Footer', () => () => <div data-testid="footer">Footer</div>);

// Mock moderationAdminService
jest.mock('../services/moderationAdminService', () => ({
  moderationAdminService: {
    getQueue: jest.fn().mockResolvedValue([
      {
        id: 'mod-101',
        content_type: 'post',
        description: 'Suspicious community post flagged by automated keyword heuristics',
        reason: 'hate_speech',
        reporter_username: 'Sentinel Node',
        created_at: new Date().toISOString(),
        status: 'pending'
      }
    ]),
    approveItem: jest.fn().mockResolvedValue({ success: true }),
    rejectItem: jest.fn().mockResolvedValue({ success: true })
  }
}));

describe('ModerationQueuePage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ModerationQueuePage />
      </BrowserRouter>
    );

  it('renders moderation queue header and item review elements', async () => {
    renderComponent();
    expect(screen.getByText('Moderation Queue')).toBeInTheDocument();
    expect(await screen.findByText('#mod-101')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /approve content/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reject & remove/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^queue$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^refresh$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^dashboard$/i })).toBeInTheDocument();
  });
});
