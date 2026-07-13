import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from "../contexts/AppContext";
import { useAuth } from '../contexts/AuthContext';
import { BookOpenIcon, AcademicCapIcon, ChartBarIcon, ClockIcon } from '../icons';
import type { Course, Enrollment, Module } from '../types';

// Mock courses data (replacing CAMUS_COURSES)
const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Introduction to Programming',
    category: 'Computer Science',
    description: 'Learn the fundamentals of programming with hands-on exercises.',
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&h=300&fit=crop',
    instructor: {
      id: 'inst-1',
      name: 'Dr. Sarah Chen',
      avatarUrl: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    duration: 8,
    level: 'Beginner',
    rating: 4.8,
    enrolledCount: 1250,
    price: 49.99,
    modules: [
      {
        id: 'mod-1',
        title: 'Getting Started',
        lessons: [
          { id: 'lesson-1', title: 'Introduction to Programming Concepts' },
          { id: 'lesson-2', title: 'Setting Up Your Development Environment' },
          { id: 'lesson-3', title: 'Your First Program' }
        ]
      },
      {
        id: 'mod-2',
        title: 'Core Concepts',
        lessons: [
          { id: 'lesson-4', title: 'Variables and Data Types' },
          { id: 'lesson-5', title: 'Control Structures' },
          { id: 'lesson-6', title: 'Functions and Methods' }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Web Development Fundamentals',
    category: 'Web Development',
    description: 'Build modern websites with HTML, CSS, and JavaScript.',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop',
    instructor: {
      id: 'inst-2',
      name: 'Alex Johnson',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    duration: 10,
    level: 'Beginner',
    rating: 4.7,
    enrolledCount: 890,
    price: 79.99,
    modules: [
      {
        id: 'mod-3',
        title: 'HTML & CSS',
        lessons: [
          { id: 'lesson-7', title: 'HTML Structure and Semantics' },
          { id: 'lesson-8', title: 'CSS Styling Basics' },
          { id: 'lesson-9', title: 'Responsive Design' }
        ]
      },
      {
        id: 'mod-4',
        title: 'JavaScript',
        lessons: [
          { id: 'lesson-10', title: 'JavaScript Fundamentals' },
          { id: 'lesson-11', title: 'DOM Manipulation' },
          { id: 'lesson-12', title: 'Event Handling' }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Data Science Essentials',
    category: 'Data Science',
    description: 'An introduction to data analysis and visualization techniques.',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=300&fit=crop',
    instructor: {
      id: 'inst-3',
      name: 'Prof. Michael Rodriguez',
      avatarUrl: 'https://randomuser.me/api/portraits/men/68.jpg'
    },
    duration: 12,
    level: 'Intermediate',
    rating: 4.9,
    enrolledCount: 1560,
    price: 89.99,
    modules: [
      {
        id: 'mod-5',
        title: 'Data Analysis',
        lessons: [
          { id: 'lesson-13', title: 'Introduction to Data Analysis' },
          { id: 'lesson-14', title: 'Data Cleaning Techniques' },
          { id: 'lesson-15', title: 'Statistical Analysis' }
        ]
      },
      {
        id: 'mod-6',
        title: 'Data Visualization',
        lessons: [
          { id: 'lesson-16', title: 'Creating Effective Charts' },
          { id: 'lesson-17', title: 'Interactive Dashboards' }
        ]
      }
    ]
  }
];

const MyLearningPage: React.FC = () => {
   const { member } = useAuth();
    const { enrollments } = useAppContext();
    const navigate = useNavigate();

    const memberEnrollments = member ? enrollments.filter((e: Enrollment) => e.memberId === member.id) : [];

    // Calculate overall progress
    const calculateOverallProgress = () => {
        if (memberEnrollments.length === 0) return 0;
        
        const totalProgress = memberEnrollments.reduce((acc: number, enrollment: Enrollment) => {
            const course = MOCK_COURSES.find((c: Course) => c.id === enrollment.courseId);
            if (!course) return acc;
            
            const totalLessons = (course.modules || []).reduce((acc: number, mod: Module) => acc + (mod.lessons?.length ?? 0), 0);
            const completedLessonsCount = enrollment.completedLessons.length;
            const progress = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;
            
            return acc + progress;
        }, 0);
        
        return totalProgress / memberEnrollments.length;
    };

    const overallProgress = calculateOverallProgress();

    const EnrolledCourseCard: React.FC<{ enrollment: Enrollment }> = ({ enrollment }) => {
        const course = MOCK_COURSES.find(c => c.id === enrollment.courseId);
        if (!course) return null;

        const totalLessons = (course.modules || []).reduce((acc: number, mod: Module) => acc + (mod.lessons?.length ?? 0), 0);
        const completedLessonsCount = enrollment.completedLessons.length;
        const progress = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;
        
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                <img src={course.thumbnail} alt={course.title} className="w-full md:w-1/3 h-48 md:h-auto object-cover"  />
                <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                        <p className="text-sm font-semibold text-brand-blue">{course.category}</p>
                        <h3 className="font-bold text-xl mt-1">{course.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">by {typeof course.instructor === 'object' ? course.instructor.name : course.instructor}</p>
                    </div>
                    <div className="mt-4">
                         <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{completedLessonsCount} / {totalLessons} Lessons</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-brand-blue h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <NavLink 
                        to={`/camus/course/${course.id}`} 
                        className="mt-6 block text-center w-full md:w-auto md:self-end px-6 py-2 font-semibold bg-brand-blue text-white rounded-full hover:bg-blue-700"
                    >
                        Continue Learning
                    </NavLink>
                </div>
            </div>
        );
    };

    // Stats cards
    const StatsCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ 
        title, 
        value,
        icon
    }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                    {icon}
                </div>
                <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{title}</p>
                </div>
            </div>
        </div>
    );

    // Mock stats data
    const stats = [
        {
            title: "Enrolled Courses",
            value: memberEnrollments.length.toString(),
            icon: <BookOpenIcon className="w-6 h-6 text-blue-600" />
        },
        {
            title: "Completed Courses",
            value: memberEnrollments.filter(e => {
                const course = MOCK_COURSES.find(c => c.id === e.courseId);
                if (!course) return false;
                const totalLessons = (course.modules || []).reduce((sum: number, mod: Module) => sum + (mod.lessons?.length ?? 0), 0);
                return totalLessons > 0 && e.completedLessons.length === totalLessons;
            }).length.toString(),
            icon: <AcademicCapIcon className="w-6 h-6 text-blue-600" />
        },
        {
            title: "Learning Progress",
            value: `${Math.round(overallProgress)}%`,
            icon: <ChartBarIcon className="w-6 h-6 text-blue-600" />
        },
        {
            title: "Hours Learned",
            value: Math.round(overallProgress * memberEnrollments.length / 10).toString(),
            icon: <ClockIcon className="w-6 h-6 text-blue-600" />
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <BookOpenIcon className="h-8 w-8 text-blue-600" />
                            <h1 className="ml-2 text-xl font-bold text-gray-900">My Learning</h1>
                        </div>
                        <button
                            onClick={() => navigate('/camus/dashboard')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Full Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Section */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {stats.map((stat, index) => (
                        <StatsCard 
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                        />
                    ))}
                </div>

                {/* Progress Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Overall Progress</h2>
                        <span className="text-sm font-medium text-blue-600">{Math.round(overallProgress)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                            className="bg-blue-600 h-4 rounded-full" 
                            style={{ width: `${overallProgress}%` }}
                        ></div>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                        Keep up the great work! You're making steady progress in your learning journey.
                    </p>
                </div>

                {/* Courses Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium text-gray-900">My Courses</h2>
                        <button
                            onClick={() => navigate('/camus')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            Browse More Courses
                        </button>
                    </div>

                    <div className="space-y-6">
                        {memberEnrollments.length > 0 ? (
                            memberEnrollments.map((c: Enrollment) => (
                                <EnrolledCourseCard key={c.courseId} enrollment={c} />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No enrolled courses</h3>
                                <p className="mt-1 text-gray-500">Get started by enrolling in a course.</p>
                                <div className="mt-6">
                                    <button
                                        onClick={() => navigate('/camus')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Browse Courses
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyLearningPage;
