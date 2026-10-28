import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/CourseContext', () => ({
  useCourseContext: () => ({
    courses: [],
    updateCourse: jest.fn(),
    loading: false,
  }),
}));

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 100,
    showToast: jest.fn(),
  }),
}));

import EditCourse from './EditCourse';

describe('EditCourse', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders edit course page and quick dock', () => {
    render(
      <MemoryRouter>
        <EditCourse />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Courses Hub/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Form/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

