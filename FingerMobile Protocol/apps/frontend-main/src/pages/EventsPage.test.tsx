import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EventsPage from './EventsPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

describe('EventsPage Mobile View & Sovereign Quick Dock', () => {
  it('renders correctly with title and sovereign mobile navigation dock', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <EventsPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Platform Events Calendar/i)).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: /Events Quick Navigation/i });
    expect(nav).toBeInTheDocument();

    const allBtn = within(nav).getByRole('button', { name: /^All$/i });
    const concertsBtn = within(nav).getByRole('button', { name: /^Concerts$/i });
    const virtualBtn = within(nav).getByRole('button', { name: /^Virtual$/i });
    const hostBtn = within(nav).getByRole('button', { name: /^Host$/i });

    expect(allBtn).toBeInTheDocument();
    expect(concertsBtn).toBeInTheDocument();
    expect(virtualBtn).toBeInTheDocument();
    expect(hostBtn).toBeInTheDocument();

    fireEvent.click(concertsBtn);
    fireEvent.click(virtualBtn);
    fireEvent.click(allBtn);
    fireEvent.click(hostBtn);

    // Host modal should appear
    expect(screen.getByRole('heading', { name: /Host Community Event/i })).toBeInTheDocument();
  });
});
