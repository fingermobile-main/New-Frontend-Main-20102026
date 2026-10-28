import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotificationsPage from './NotificationsPage';

describe('NotificationsPage', () => {
  it('renders notifications page header and list items', () => {
    render(
      <BrowserRouter>
        <NotificationsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Notifications/i })).toBeInTheDocument();
    expect(screen.getByText(/New Match!/i)).toBeInTheDocument();
    expect(screen.getByText(/Virtual Plushie Gift!/i)).toBeInTheDocument();
  });

  it('renders mobile quick dock buttons and triggers mark all as read', () => {
    render(
      <BrowserRouter>
        <NotificationsPage />
      </BrowserRouter>
    );

    const readAllButtons = screen.getAllByRole('button', { name: /Read All|Mark all as read/i });
    expect(readAllButtons.length).toBeGreaterThan(0);
    fireEvent.click(readAllButtons[0]);

    expect(screen.getByText(/0 unread notifications/i)).toBeInTheDocument();
  });
});

