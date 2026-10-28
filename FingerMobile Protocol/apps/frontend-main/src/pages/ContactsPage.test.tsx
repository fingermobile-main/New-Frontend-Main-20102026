import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContactsPage from './ContactsPage';
import { AppProvider } from '../contexts/AppContext';

describe('ContactsPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <ContactsPage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Contacts & Communication Hub/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Directory/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Queues/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Abuse/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Export/i }).length).toBeGreaterThan(0);
  });
});
