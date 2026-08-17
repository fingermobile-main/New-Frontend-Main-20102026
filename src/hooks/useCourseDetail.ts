import { useState, useEffect } from 'react';
import { Course, Enrollment } from '../types';

export const useCourseDetail = (courseId: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock data for now since the service is not available
        const mockCourse = {
          id: courseId,
          title: 'Sample Course',
          description: 'Sample course description',
          instructor: 'instructor1',
          category: 'Technology',
          subcategory: 'Web Development',
          level: 'Beginner',
          duration: 3600, // in seconds
          price: 99.99,
          thumbnail: '',
          previewVideoUrl: '',
          tags: ['web', 'development'],
          rating: 4.5,
          totalRatings: 100,
          curriculum: [],
          prerequisites: [],
          learningOutcomes: [],
          isPublished: true,
          isFeatured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          enrollmentCount: 50,
          completionCount: 30,
          language: 'English',
          certificateAvailable: true,
          subtitlesAvailable: false,
          quizCount: 5,
          assignmentCount: 3,
          forumEnabled: true,
          supportAvailable: true,
        } as Course;

        setCourse(mockCourse);
        setEnrollments([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]); // Removed fetchCourseDetail from dependency array

  return { course, enrollments, loading, error };
};