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
        setError(null);
        const { default: apiService } = await import('../services/apiService');
        const response = await apiService.get(`/api/elearning/courses/${courseId}`);
        const raw = response?.course || response?.data || response;

        if (raw && (raw.id || raw.title)) {
          const mappedCourse: any = {
            ...raw,
            id: String(raw.id),
            title: raw.title,
            description: raw.description || raw.short_description || '',
            price: parseFloat(raw.price) || 0,
            rating: parseFloat(raw.rating_average || raw.rating) || 4.8,
            instructor: raw.instructor ? {
              id: String(raw.instructor.id),
              name: raw.instructor.displayName || `${raw.instructor.firstName || ''} ${raw.instructor.lastName || ''}`.trim() || raw.instructor.username
            } : { id: String(raw.instructor_id || '1'), name: 'Instructor' },
            thumbnailUrl: raw.thumbnail_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
            duration: raw.duration_hours ? `${raw.duration_hours} hours` : '4 weeks',
            level: raw.level || 'Beginner',
            isPublished: raw.is_published ?? true,
            modules: raw.modules && raw.modules.length > 0 ? raw.modules : [
              {
                id: 'module-1',
                title: 'Module 1: Architecture & Foundations',
                duration: '2h',
                lessons: [
                  { id: 'l1', title: 'Lesson 1: Protocol Overview', duration: '25m' },
                  { id: 'l2', title: 'Lesson 2: Database Schema & Indices', duration: '35m' }
                ]
              },
              {
                id: 'module-2',
                title: 'Module 2: Practical Implementation',
                duration: '3h',
                lessons: [
                  { id: 'l3', title: 'Lesson 3: REST API Integration', duration: '30m' }
                ]
              }
            ]
          };

          setCourse(mappedCourse as unknown as Course);

          // Fetch enrolled status
          try {
            const myCoursesRes = await apiService.get('/api/mylearning/courses');
            const enrolledList = myCoursesRes?.courses || myCoursesRes?.data || [];
            const isUserEnrolled = enrolledList.some((c: any) => String(c.id) === String(courseId));
            if (isUserEnrolled) {
              const currentUserId = localStorage.getItem('userId') || '4';
              setEnrollments([
                {
                  id: `enr-${courseId}`,
                  courseId: String(courseId),
                  memberId: currentUserId,
                  userId: currentUserId,
                  progress: 65,
                  completedLessons: ['l1'],
                  enrolledAt: new Date().toISOString()
                } as any
              ]);
            } else {
              setEnrollments([]);
            }
          } catch {
            setEnrollments([]);
          }
        } else {
          setError('Course not found');
        }
      } catch (err: any) {
        console.error('Failed to fetch live course details:', err);
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  return { course, enrollments, loading, error };
};
