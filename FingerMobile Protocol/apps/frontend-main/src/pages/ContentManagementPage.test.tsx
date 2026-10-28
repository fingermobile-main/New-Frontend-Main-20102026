import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContentManagementPage from './ContentManagementPage';
import { AppProvider } from '../contexts/AppContext';

describe('ContentManagementPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <ContentManagementPage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('heading', { name: /Content Management/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /All/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Published/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Drafts/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Create/i }).length).toBeGreaterThan(0);
  });
});
