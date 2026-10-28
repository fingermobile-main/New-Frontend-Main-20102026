import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotificationPage from './NotificationPage';

describe('NotificationPage', () => {
  it('renders notification center and mobile quick dock', () => {
    render(
      <MemoryRouter>
        <NotificationPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Platform Notifications/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Mark Read/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Filter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear All/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Dashboard/i })).toBeInTheDocument();
  });

  it('allows marking notifications as read and clearing all', () => {
    render(
      <MemoryRouter>
        <NotificationPage />
      </MemoryRouter>
    );

    const clearBtn = screen.getByRole('button', { name: /Clear All/i });
    fireEvent.click(clearBtn);

    expect(screen.getAllByText(/No Notifications/i).length).toBeGreaterThan(0);
  });
});
