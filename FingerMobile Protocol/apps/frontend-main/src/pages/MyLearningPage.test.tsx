import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyLearningPage from './MyLearningPage';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    member: { id: 'student-1', name: 'Learner' }
  })
}));

jest.mock('../services/elearningService', () => ({
  elearningService: {
    getMyEnrolledCourses: jest.fn().mockResolvedValue([
      {
        id: 101,
        title: 'Full Stack TypeScript & Distributed Systems',
        category: 'Engineering',
        level: 'Advanced',
        progress: 65,
        instructor_name: 'Dr. Obinna'
      }
    ]),
    getDashboard: jest.fn().mockResolvedValue({
      streak: { currentStreak: 7 }
    })
  }
}));

describe('MyLearningPage Component', () => {
  it('renders My Learning Dashboard heading and enrolled course', async () => {
    render(
      <BrowserRouter>
        <MyLearningPage />
      </BrowserRouter>
    );

    expect(await screen.findByRole('heading', { level: 1, name: /My Learning Dashboard/i })).toBeInTheDocument();
    expect(await screen.findByText(/Full Stack TypeScript & Distributed Systems/i)).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', async () => {
    render(
      <BrowserRouter>
        <MyLearningPage />
      </BrowserRouter>
    );

    const nav = await screen.findByRole('navigation', { name: /My Learning Mobile Navigation/i });
    expect(nav).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /^Dashboard$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Catalog$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Certificates$/i })).toBeInTheDocument();
  });
});

