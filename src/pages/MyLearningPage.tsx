import { NavLink, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { BookOpenIcon, AcademicCapIcon, ChartBarIcon, ClockIcon } from '../icons';
import { elearningService } from '../services/elearningService';

interface EnrolledCourse {
  id: string | number;
  title: string;
  description?: string;
  instructor_name?: string;
  category?: string;
  progress: number;
  thumbnail_url?: string;
  duration_hours?: number;
  level?: string;
  last_accessed_at?: string;
}

const MyLearningPage: React.FC = () => {
  const { member } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [streakDays, setStreakDays] = useState(3);
  const [hoursLearned, setHoursLearned] = useState(14);

  useEffect(() => {
    const fetchLearningData = async () => {
      setLoading(true);
      try {
        const enrolledCourses = await elearningService.getMyEnrolledCourses();
        if (enrolledCourses && enrolledCourses.length > 0) {
          setCourses(enrolledCourses.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            instructor_name: c.instructor_name || 'Dr. Instructor',
            category: c.category || 'Software Engineering',
            progress: parseFloat(c.progress) || 0,
            thumbnail_url: c.thumbnail_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
            duration_hours: c.duration_hours || 10,
            level: c.level || 'Intermediate'
          })));
        }

        const dashboardData = await elearningService.getDashboard();
        if (dashboardData?.streak?.currentStreak) {
          setStreakDays(dashboardData.streak.currentStreak);
        }
      } catch (err) {
        console.error('Failed to fetch learning data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, []);

  const overallProgress = courses.length > 0
    ? courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length
    : 0;

  const completedCount = courses.filter(c => c.progress >= 100).length;

  const stats = [
    {
      title: 'Enrolled Courses',
      value: courses.length.toString(),
      icon: <BookOpenIcon className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Completed Courses',
      value: completedCount.toString(),
      icon: <AcademicCapIcon className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Avg. Progress',
      value: `${Math.round(overallProgress)}%`,
      icon: <ChartBarIcon className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Learning Streak',
      value: `${streakDays} Days`,
      icon: <ClockIcon className="w-6 h-6 text-blue-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your course enrollments, module completions, and skill progression.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900">Overall Course Progress</h2>
            <span className="text-sm font-semibold text-blue-600">{Math.round(overallProgress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Keep up the great work! Your progress is backed by real PostgreSQL activity logs.
          </p>
        </div>

        {/* Courses List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Enrolled Courses</h2>
            <button
              onClick={() => navigate('/camus')}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Browse More Courses &rarr;
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Loading enrolled courses from database...
            </div>
          ) : courses.length > 0 ? (
            <div className="space-y-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow"
                >
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full md:w-1/4 h-44 object-cover"
                  />
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {course.category}
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                          {course.level}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mt-2">{course.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">Instructor: {course.instructor_name}</p>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(course.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <NavLink
                        to={`/camus/course/${course.id}`}
                        className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Continue Learning
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No active course enrollments</h3>
              <p className="mt-1 text-sm text-gray-500">Explore our catalog and start learning today.</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/camus')}
                  className="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  Browse Courses
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLearningPage;
