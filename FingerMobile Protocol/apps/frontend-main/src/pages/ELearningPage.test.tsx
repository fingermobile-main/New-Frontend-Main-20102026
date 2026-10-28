import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ELearningPage from './ELearningPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

// Mock elearningService
jest.mock('../services/elearningService', () => ({
  elearningService: {
    getCourses: jest.fn().mockResolvedValue({
      courses: [
        {
          id: 1,
          title: 'Fullstack React Architecture',
          instructor: { id: 10, displayName: 'Senior Engineer' },
          category: 'Software Engineering',
          price: 99,
          rating_average: 4.9,
          rating_count: 50,
          enrollment_count: 200,
          duration_hours: 12,
          level: 'advanced',
          description: 'Advanced patterns and scaling principles',
          is_published: true
        }
      ]
    })
  }
}));

describe('ELearningPage Mobile View & Sovereign Quick Dock', () => {
  it('renders correctly with headline and mobile quick dock navigation', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <ELearningPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Transform Your Future with/i)).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: /E-Learning Quick Navigation/i });
    expect(nav).toBeInTheDocument();

    const coursesBtn = screen.getByRole('button', { name: /^Courses$/i });
    const myLearnBtn = screen.getByRole('button', { name: /^My Learn$/i });
    const catalogBtn = screen.getByRole('button', { name: /^Catalog$/i });
    const dashboardBtn = screen.getByRole('button', { name: /^Dashboard$/i });

    expect(coursesBtn).toBeInTheDocument();
    expect(myLearnBtn).toBeInTheDocument();
    expect(catalogBtn).toBeInTheDocument();
    expect(dashboardBtn).toBeInTheDocument();

    fireEvent.click(coursesBtn);
    fireEvent.click(myLearnBtn);
    fireEvent.click(catalogBtn);
    fireEvent.click(dashboardBtn);
  });
});

