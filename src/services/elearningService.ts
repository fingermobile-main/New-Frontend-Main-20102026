import { api } from './api';

export interface CourseInstructor {
  id: number | string;
  username: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

export interface Course {
  id: number | string;
  category_id?: number;
  instructor_id?: number;
  title: string;
  description: string;
  short_description?: string;
  thumbnail_url?: string;
  thumbnail?: string;
  preview_video_url?: string;
  level: string;
  language?: string;
  duration_hours?: number;
  duration?: string;
  price: number;
  discount_price?: number;
  currency?: string;
  is_published?: boolean;
  enrollment_count?: number;
  enrolledCount?: number;
  rating_average?: number;
  rating?: number;
  rating_count?: number;
  reviewsCount?: number;
  is_certificate_available?: boolean;
  skills_gained?: string[];
  requirements?: string[];
  target_audience?: string[];
  instructor?: CourseInstructor | any;
  created_at?: string;
  updated_at?: string;
  progress?: number;
}

export interface LearningDashboardData {
  courses: Array<Course & { progress: number; completedLessons?: number; totalLessons?: number }>;
  streak: {
    currentStreak: number;
    lastActivity?: string;
  };
  recentAchievements: any[];
  totalCourses: number;
}

class ElearningService {
  private baseUrl = '/elearning';
  private mylearningUrl = '/mylearning';

  async getCourses(params?: {
    page?: number;
    limit?: number;
    search?: string;
    level?: string;
    language?: string;
    isPublished?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ courses: Course[]; pagination?: any }> {
    try {
      const response = await api.get(`${this.baseUrl}/courses`, { params });
      return {
        courses: response.data?.courses || response.data?.data || [],
        pagination: response.data?.pagination
      };
    } catch (error) {
      console.error('Failed to get courses:', error);
      return { courses: [] };
    }
  }

  async getCourseById(id: string | number): Promise<Course | null> {
    try {
      const response = await api.get(`${this.baseUrl}/courses/${id}`);
      return response.data?.course || response.data?.data || null;
    } catch (error) {
      console.error(`Failed to get course ${id}:`, error);
      return null;
    }
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    const response = await api.post(`${this.baseUrl}/courses`, {
      categoryId: courseData.category_id || 1,
      title: courseData.title,
      description: courseData.description,
      shortDescription: courseData.short_description,
      thumbnailUrl: courseData.thumbnail_url || courseData.thumbnail,
      level: courseData.level || 'beginner',
      language: courseData.language || 'English',
      price: courseData.price || 0,
      skillsGained: courseData.skills_gained || [],
      requirements: courseData.requirements || [],
      targetAudience: courseData.target_audience || []
    });
    return response.data?.course || response.data?.data;
  }

  async updateCourse(id: string | number, courseData: Partial<Course>): Promise<Course> {
    const response = await api.put(`${this.baseUrl}/courses/${id}`, courseData);
    return response.data?.course || response.data?.data;
  }

  async getMyEnrolledCourses(): Promise<Course[]> {
    try {
      const response = await api.get(`${this.mylearningUrl}/courses`);
      return response.data?.courses || response.data?.data || [];
    } catch (error) {
      console.error('Failed to get enrolled courses:', error);
      return [];
    }
  }

  async getDashboard(): Promise<LearningDashboardData | null> {
    try {
      const response = await api.get(`${this.mylearningUrl}/dashboard`);
      return response.data?.data || null;
    } catch (error) {
      console.error('Failed to get learning dashboard:', error);
      return null;
    }
  }

  async enrollInCourse(courseId: string | number): Promise<boolean> {
    try {
      const response = await api.post(`${this.mylearningUrl}/courses/${courseId}/enroll`);
      return response.data?.success || false;
    } catch (error) {
      console.error(`Failed to enroll in course ${courseId}:`, error);
      throw error;
    }
  }

  async updateProgress(courseId: string | number, progress: number, lessonId?: number): Promise<boolean> {
    try {
      const response = await api.post(`${this.mylearningUrl}/progress`, {
        courseId,
        progress,
        lessonId
      });
      return response.data?.success || false;
    } catch (error) {
      console.error('Failed to update progress:', error);
      return false;
    }
  }
}

export const elearningService = new ElearningService();
export default elearningService;
