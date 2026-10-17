import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import {
  BookOpenIcon,
  AcademicCapIcon,
  MemberGroupIcon,
  ChartBarIcon,
  ClockIcon,
  VideoCameraIcon,
  ClipboardCheckIcon
} from '../icons';
import type { Course, Enrollment } from '../types';
import CourseCard from '../components/CourseCard';
import EnhancedFilterBar from '../components/shared/EnhancedFilterBar';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = React.memo(({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300">
    <div className="flex items-center">
      <div className="p-3 bg-blue-100 rounded-lg">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm sm:text-base text-slate-700">{title}</p>
      </div>
    </div>
  </div>
));
StatsCard.displayName = 'StatsCard';

interface FeatureCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = React.memo(({ title, description, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
  </div>
));
FeatureCard.displayName = 'FeatureCard';


interface CourseFilters {
  query?: string;
  category?: string;
  sortBy?: string;
}

const ELearningPage: React.FC = () => {
  const { member } = useAuth();
  const { enrollments } = useAppContext();
  const navigate = useNavigate();

  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { elearningService } = await import('../services/elearningService');
        const res = await elearningService.getCourses({ isPublished: 'true' });
        const rawCourses = res.courses || [];

        const courses: Course[] = rawCourses.map((c: any) => ({
          id: String(c.id),
          title: c.title,
          instructor: c.instructor ? {
            id: String(c.instructor.id),
            name: c.instructor.displayName || `${c.instructor.firstName || ''} ${c.instructor.lastName || ''}`.trim() || c.instructor.username
          } : { id: String(c.instructor_id || '1'), name: 'Dr. Expert' },
          category: c.category || (c.category_id === 1 ? 'Software Engineering' : c.category_id === 2 ? 'Data Science & AI' : 'Design'),
          price: parseFloat(c.price) || 0,
          rating: parseFloat(c.rating_average || c.rating) || 4.8,
          reviewsCount: c.rating_count || 48,
          enrolledCount: c.enrollment_count || 120,
          thumbnailUrl: c.thumbnail_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
          duration: c.duration_hours ? `${c.duration_hours} hours` : '4 weeks',
          level: c.level ? c.level.charAt(0).toUpperCase() + c.level.slice(1) : 'Beginner',
          description: c.description || c.short_description || '',
          isPublished: c.is_published ?? true,
          createdAt: c.created_at || new Date().toISOString(),
          updatedAt: c.updated_at || new Date().toISOString()
        }));

        setAllCourses(courses);
        setFilteredCourses(courses);

        const cats = Array.from(new Set(courses.map((c: any) => c.category).filter(Boolean))) as string[];
        setCategories(cats);

        setStats([
          {
            title: 'Available Courses',
            value: courses.length.toString(),
            icon: <BookOpenIcon className="w-6 h-6 text-blue-600" />
          },
          {
            title: 'Expert Instructors',
            value: Array.from(new Set(courses.map((c: any) => typeof c.instructor === 'object' ? c.instructor?.id || '' : c.instructor))).filter(Boolean).length.toString(),
            icon: <AcademicCapIcon className="w-6 h-6 text-blue-600" />
          },
          {
            title: 'Active Learners',
            value: '10,000+',
            icon: <MemberGroupIcon className="w-6 h-6 text-blue-600" />
          },
          {
            title: 'Completion Rate',
            value: '87%',
            icon: <ClipboardCheckIcon className="w-6 h-6 text-blue-600" />
          }
        ]);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const applyFilters = useCallback((newFilters: CourseFilters) => {
    let result = [...allCourses];

    if (newFilters.query) {
      const query = newFilters.query.toLowerCase();
      result = result.filter(course => {
        const instructorName = typeof course.instructor === 'object'
          ? course.instructor?.name || ''
          : course.instructor || '';

        return (
          course.title.toLowerCase().includes(query) ||
          instructorName.toLowerCase().includes(query) ||
          (course.description?.toLowerCase() || '').includes(query)
        );
      });
    }

    if (newFilters.category && newFilters.category !== 'all') {
      result = result.filter(course => course.category === newFilters.category);
    }

    switch (newFilters.sortBy) {
    case 'price_asc':
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'price_desc':
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'rating':
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'students':
      result.sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0));
      break;
    case 'popular':
    default:
      result.sort((a, b) =>
        ((b.rating || 0) * (b.enrolledCount || 0)) - ((a.rating || 0) * (a.enrolledCount || 0))
      );
      break;
    }

    setFilteredCourses(result);
  }, [allCourses]);

  const features = [
    {
      title: 'Interactive Learning',
      description: 'Engage with multimedia content, quizzes, and assignments to reinforce your learning.',
      icon: <VideoCameraIcon className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed progress reports and completion certificates.',
      icon: <ChartBarIcon className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Flexible Schedule',
      description: 'Learn at your own pace with 24/7 access to course materials from anywhere.',
      icon: <ClockIcon className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Community Support',
      description: 'Connect with fellow learners and instructors through discussion forums and Q&A sessions.',
      icon: <MemberGroupIcon className="w-6 h-6 text-blue-600" />
    }
  ];

  const memberEnrollments = member ? (enrollments as Enrollment[]).filter((e) => e.memberId === member.id) : [];
  const enrolledCourses = memberEnrollments
    .map((e) => allCourses.find((c) => c.id === e.courseId))
    .filter(Boolean) as Course[];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                <span className="block">Transform Your Future with</span>
                <span className="block text-blue-200 mt-2">E-Learning Excellence</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-blue-100">
                Access world-class education anytime, anywhere. Advance your career with our comprehensive online learning platform.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {member ? (
                  <button
                    onClick={() => navigate('/camus/dashboard')}
                    className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                  >
                    Continue Learning
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/auth/signup')}
                      className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                    >
                      Get Started
                    </button>
                    <button
                      onClick={() => navigate('/camus')}
                      className="px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-blue-700 transition-colors"
                    >
                      Explore Courses
                    </button>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Your Learning Journey</h2>
                {member ? (
                  <div>
                    <p className="mb-4 text-base sm:text-lg">Welcome back, {(member as any).name || (member as any).username || 'Learner'}!</p>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm sm:text-base mb-1">
                          <span>Enrolled Courses</span>
                          <span>{enrolledCourses.length}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (enrolledCourses.length / (allCourses.length || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/camus/dashboard/courses')}
                        className="w-full py-2 bg-white text-blue-600 font-medium rounded-lg text-base sm:text-lg hover:bg-blue-50 transition-colors"
                      >
                        View My Courses
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="mb-4 text-blue-100">Join thousands of learners advancing their careers</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/20 p-4 rounded-lg text-center">
                        <BookOpenIcon className="w-8 h-8 mx-auto" />
                        <p className="mt-2 text-sm sm:text-base font-medium">1,000+ Courses</p>
                      </div>
                      <div className="bg-white/20 p-4 rounded-lg text-center">
                        <AcademicCapIcon className="w-8 h-8 mx-auto" />
                        <p className="mt-2 text-sm sm:text-base font-medium">Expert Instructors</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-12 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">Why Choose Our E-Learning Platform</h2>
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-slate-700">
              Designed to provide the best learning experience for modern learners
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="py-12 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">Featured Courses</h2>
              <p className="mt-2 max-w-2xl text-base sm:text-lg text-slate-700">
                Hand-picked courses to advance your skills
              </p>
            </div>
          </div>

          <EnhancedFilterBar
            filterOptions={{
              categories: [
                { value: 'all', label: 'All Categories' },
                ...categories.map((category) => ({ value: category, label: category }))
              ],
              sortByOptions: [
                { value: 'popular', label: 'Most Popular' },
                { value: 'rating', label: 'Highest Rated' },
                { value: 'students', label: 'Most Students' },
                { value: 'price_asc', label: 'Price: Low to High' },
                { value: 'price_desc', label: 'Price: High to Low' }
              ],
              searchPlaceholder: 'Search courses...'
            }}
            onFiltersChange={(filters: any) => applyFilters(filters)}
          />

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenIcon className="mx-auto h-12 w-12 text-slate-700" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No courses found</h3>
              <p className="mt-1 text-slate-700 text-base sm:text-lg">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((c: Course) => (
                <CourseCard
                  key={c.id}
                  title={c.title}
                  description={c.description}
                  instructor={typeof c.instructor === 'object' ? c.instructor.name || 'Unknown Instructor' : c.instructor || 'Unknown Instructor'}
                  duration={String(c.duration || 0)}
                  level={c.level || 'beginner'}
                  price={c.price || 0}
                  enrolled={c.enrolledCount || 0}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/camus')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base sm:text-lg font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              View All Courses
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Courses Section */}
      <div className="py-12 p-4 sm:p-6 lg:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">Recommended Courses</h2>
            <p className="mt-2 max-w-2xl text-base sm:text-lg text-slate-700">
              Based on your interests and learning history
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.slice(0, 3).map((c: Course) => (
              <CourseCard
                key={c.id}
                title={c.title}
                description={c.description}
                instructor={typeof c.instructor === 'object' ? c.instructor.name || 'Unknown Instructor' : c.instructor || 'Unknown Instructor'}
                duration={String(c.duration || 0)}
                level={c.level || 'beginner'}
                price={c.price || 0}
                enrolled={c.enrolledCount || 0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-white">
            <span className="block">Ready to start learning?</span>
            <span className="block text-blue-200">Join our community of learners today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <button
              onClick={() => member ? navigate('/camus') : navigate('/auth/signup')}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base sm:text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            >
              {member ? 'Browse Courses' : 'Get Started'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ELearningPage;
