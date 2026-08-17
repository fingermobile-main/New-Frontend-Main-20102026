import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CourseProvider, useCourseContext } from '../contexts/CourseContext';
import { api } from '../services/api';

// Mock the api service
jest.mock("../services/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()},
  ApiService: {}
}));

// Test component to use the context
const TestComponent: React.FC = () => {
  const { courses, enrollments, loading, error, fetchCourses, createCourse } =
    useCourseContext();

  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || "null"}</div>
      <div data-testid="courses-count">{courses.length}</div>
      <div data-testid="enrollments-count">{enrollments.length}</div>
      <button data-testid="fetch-courses" onClick={() => fetchCourses()}>
        Fetch Courses
      </button>
      <button
        data-testid="create-course"
        onClick={() => createCourse({ title: "Test Course" })}
      >
        Create Course
      </button>
    </div>
  );
};

describe("CourseContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should provide initial state", () => {
    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>,
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("false");
    expect(screen.getByTestId("error")).toHaveTextContent("null");
    expect(screen.getByTestId("courses-count")).toHaveTextContent("0");
    expect(screen.getByTestId("enrollments-count")).toHaveTextContent("0");
  });

  test("should fetch courses successfully", async () => {
    const mockCourses = [
      { id: "1", title: "Course 1" },
      { id: "2", title: "Course 2" },
    ];

    (api.get as jest.Mock).mockResolvedValue({
      data: mockCourses});

    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>,
    );

    // Click fetch button
    screen.getByTestId("fetch-courses").click();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    // Check courses count
    expect(screen.getByTestId("courses-count")).toHaveTextContent("2");
  });

  test("should handle fetch courses error", async () => {
    (api.get as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch"),
    );

    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>,
    );

    // Click fetch button
    screen.getByTestId("fetch-courses").click();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    // Check error message
    expect(screen.getByTestId("error")).toHaveTextContent(
      "Failed to fetch courses",
    );
  });

  test("should create course successfully", async () => {
    const newCourse = { id: "3", title: "Test Course" };

    (api.post as jest.Mock).mockResolvedValue({
      data: newCourse});

    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>,
    );

    // Click create button
    screen.getByTestId("create-course").click();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    // Check courses count
    expect(screen.getByTestId("courses-count")).toHaveTextContent("1");
  });

  test("should handle create course error", async () => {
    (api.post as jest.Mock).mockRejectedValue(
      new Error("Failed to create"),
    );

    render(
      <CourseProvider>
        <TestComponent />
      </CourseProvider>,
    );

    // Click create button
    screen.getByTestId("create-course").click();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    // Check error message
    expect(screen.getByTestId("error")).toHaveTextContent(
      "Failed to create course",
    );
  });
});