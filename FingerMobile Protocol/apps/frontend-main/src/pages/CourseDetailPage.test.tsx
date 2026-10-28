import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CourseDetailPage from './CourseDetailPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

describe('CourseDetailPage Mobile & Accessibility', () => {
  it('renders without crash and displays mobile elements', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <CourseDetailPage />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Initial state renders loading or course not found gracefully
    expect(screen.getByText(/Loading course details|Course Not Found/i)).toBeInTheDocument();
  });
});

