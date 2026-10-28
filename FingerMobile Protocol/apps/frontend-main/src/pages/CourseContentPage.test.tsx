import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CourseContentPage from './CourseContentPage';
import { AppProvider } from '../contexts/AppContext';

describe('CourseContentPage Mobile & Accessibility', () => {
  it('renders the header and sovereign mobile dock actions', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <CourseContentPage />
        </AppProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('heading', { level: 1 }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Prev/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Modules/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Next/i }).length).toBeGreaterThan(0);
  });
});

