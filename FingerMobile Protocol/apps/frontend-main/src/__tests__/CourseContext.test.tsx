import React, {} from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CourseProvider, useCourseContext } from '../contexts/CourseContext';
import { ApiService } from '../services/api';

const mockShowToast = jest.fn();

// Mock the api service
jest.mock('../services/api', () => ({
  ApiService: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
}));
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({ showToast: mockShowToast }),
}));

// Test component to use the context
const TestComponent: React.FC = () => {
  const { courses, enrollments, loading, error, fetchCourses, createCourse } =
    useCourseContext();

  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'null'}</div>
      <div data-testid="courses-count">{courses.length}</div>
      <div data-testid="enrollments-count">{enrollments.length}</div>
      <button data-testid="fetch-courses" onClick={() => fetchCourses()}>
        Fetch Courses
      </button>
      <button
        data-testid="create-course"
        onClick={() => { void createCourse({ title: 'Test Course' }).catch(() => {}); }}
      >
        Create Course
      </button>
    </div>
  );
};

describe('CourseContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ApiService.get as jest.Mock).mockResolvedValue({ data: [] });
  });

  test('should provide initial state', async () => {
    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(screen.getByTestId('error')).toHaveTextContent('null');
    expect(screen.getByTestId('courses-count')).toHaveTextContent('0');
    expect(screen.getByTestId('enrollments-count')).toHaveTextContent('0');
  });

  test('should fetch courses successfully', async () => {
    const mockCourses = [
      { id: '1', title: 'Course 1' },
      { id: '2', title: 'Course 2' },
    ];

    (ApiService.get as jest.Mock).mockResolvedValue({
      data: mockCourses});

    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>,
    );

    // Click fetch button
    screen.getByTestId('fetch-courses').click();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    // Check courses count
    expect(screen.getByTestId('courses-count')).toHaveTextContent('2');
  });

  test('should handle fetch courses error', async () => {
    (ApiService.get as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch'),
    );

    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>,
    );

    // Click fetch button
    screen.getByTestId('fetch-courses').click();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    // Check error message
    expect(screen.getByTestId('error')).toHaveTextContent(
      'Failed to fetch',
    );
  });

  test('should create course successfully', async () => {
    const newCourse = { id: '3', title: 'Test Course' };

    (ApiService.post as jest.Mock).mockResolvedValue({
      data: newCourse});

    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>,
    );

    // Click create button
    screen.getByTestId('create-course').click();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    // Check courses count
    expect(screen.getByTestId('courses-count')).toHaveTextContent('1');
  });

  test('should handle create course error', async () => {
    (ApiService.post as jest.Mock).mockRejectedValue(
      new Error('Failed to create'),
    );

    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>,
    );

    // Click create button
    screen.getByTestId('create-course').click();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    // Check error message
    expect(screen.getByTestId('error')).toHaveTextContent(
      'Failed to create',
    );
  });
});
