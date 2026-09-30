import React, { useState, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { ApiService } from '../services/api';
import type { Course } from '../types';
import { Enrollment } from '../types'; // Import the Enrollment type

interface CourseContextType {
  courses: Course[];
  enrollments: Enrollment[]; // Now properly typed
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  createCourse: (courseData: Partial<Course>) => Promise<void>;
  updateCourse: (courseId: string, courseData: Partial<Course>) => Promise<void>;
  getEnrollmentStatus: (courseId: string) => 'not_enrolled' | 'enrolled' | 'completed';
}

const CourseContext = React.createContext<CourseContextType | undefined>(undefined);

export const useCourseContext = (): CourseContextType => {
  const context = React.useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { showToast } = useAppContext();
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [enrollments, setEnrollments] = React.useState<Enrollment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCourses = React.useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await ApiService.get('/elearning/courses');
      const data = response?.data || response;
      const coursesList = (data?.courses || data) as Course[];
      setCourses(Array.isArray(coursesList) ? coursesList : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch courses';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const enrollInCourse = React.useCallback(async (courseId: string): Promise<void> => {
    try {
      const response: any = await ApiService.post(`/mylearning/courses/${courseId}/enroll`, {});
      const newEnrollment = (response?.data || response) as Enrollment;
      setEnrollments((prev) => [...prev, newEnrollment]);

      setCourses((prev) =>
        prev.map((course) =>
          String(course.id) === String(courseId)
            ? { ...course, enrolledCount: (course.enrolledCount || 0) + 1 }
            : course
        )
      );
      showToast('Successfully enrolled in course', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to enroll in course';
      setError(message);
      showToast(message, 'error');
    }
  }, [showToast]);

  const createCourse = React.useCallback(async (courseData: Partial<Course>): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        categoryId: (courseData as any).category_id || 1,
        title: courseData.title,
        description: courseData.description,
        level: (courseData.level || 'beginner').toLowerCase(),
        language: courseData.language || 'English',
        price: Number(courseData.price || 0)
      };
      const response: any = await ApiService.post('/elearning/courses', payload);
      const data = response?.data || response;
      const newCourse = (data?.course || data) as Course;
      setCourses((prev) => [newCourse, ...prev]);
      showToast('Course created successfully', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create course';
      setError(message);
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const updateCourse = React.useCallback(async (courseId: string, courseData: Partial<Course>): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await ApiService.put(`/elearning/courses/${courseId}`, courseData);
      const data = response?.data || response;
      const updatedCourse = (data?.course || data) as Course;
      setCourses((prev) => prev.map((course) => String(course.id) === String(courseId) ? updatedCourse : course));
      showToast('Course updated successfully', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update course';
      setError(message);
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Create a safer version of getEnrollmentStatus that doesn't assume properties exist
  const getEnrollmentStatus = (courseId: string) => {
    const enrollment = enrollments.find(e => e.courseId === courseId);
    if (!enrollment) {
      return 'not_enrolled';
    }
    // Safe way to check for completion without assuming properties exist
    // We'll use a type guard to check if the enrollment has the properties we expect
    if (typeof enrollment === 'object' && enrollment !== null) {
      // If enrollment has a status property, use it
      if ('status' in enrollment && typeof enrollment.status === 'string') {
        return enrollment.status as 'not_enrolled' | 'enrolled' | 'completed';
      }
      // Otherwise, try to determine status from other properties if they exist
      if ('progress' in enrollment && typeof (enrollment as any).progress === 'object') {
        const enrollmentWithProgress = enrollment as any;
        if (enrollmentWithProgress.progress?.completed === true) {
          return 'completed';
        }
      }
    }
    return 'enrolled'; // default status if we can't determine otherwise
  };

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const contextValue = React.useMemo(
    () => ({
      courses,
      enrollments,
      loading,
      error,
      fetchCourses,
      enrollInCourse,
      createCourse,
      updateCourse,
      getEnrollmentStatus
    }),
    [
      courses,
      enrollments,
      loading,
      error,
      fetchCourses,
      enrollInCourse,
      createCourse,
      updateCourse,
      getEnrollmentStatus
    ]
  );

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};
