import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import MainLayout from '../components/layout/MainLayout';

/*
 * FingerMobile Protocol™ - CAMUS Learning Management System Page
 * Copyright © 2025-2026 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms.
 */

import { useAppContext } from '../contexts/AppContext';
import { UserCircleIcon } from '../icons';
import { useAuth } from '../contexts/AuthContext';
import {
  CamusIcon,
  VideoCameraIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '../icons';
import {
  CAMUS_STATS,
  CAMUS_CATEGORIES,
  CAMUS_COURSES,
  CAMUS_INSTRUCTORS,
  CAMUS_TESTIMONIALS
} from '../constants/camusConstants';
import type { Instructor, Testimonial, CourseCategory } from '../constants/camusConstants';
import CourseCard from '../components/CourseCard';
import AnimatedAvatar from '../components/AnimatedAvatar';
import EnhancedFilterBar from '../components/shared/EnhancedFilterBar';
import { Award, CheckCircle, Play, X, ExternalLink, Calendar, Download, ShieldCheck, Clock } from 'lucide-react';

interface CourseFilters {
  query: string;
  category: string;
  sortBy: string;
}

const CamusPage: React.FC = () => {
  const { member } = useAuth();
  const navigate = useNavigate();
  const { showToast, ficBalance } = useAppContext();
  const coursesSectionRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<CourseFilters>({
    query: '',
    category: 'all',
    sortBy: 'popular'
  });

  const [filteredCourses, setFilteredCourses] = useState(CAMUS_COURSES);

  // Modals for Camus Navigation
  const [isCertificatesModalOpen, setIsCertificatesModalOpen] = useState(false);
  const [isLiveSessionsModalOpen, setIsLiveSessionsModalOpen] = useState(false);
  const [isLessonPreviewModalOpen, setIsLessonPreviewModalOpen] = useState(false);
  const [selectedCourseForPreview, setSelectedCourseForPreview] = useState<any>(null);

  // Dynamic user learning stats
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('camus_enrolled_courses');
      if (stored) return JSON.parse(stored);
    } catch {}
    return ['1', '3']; // Default demo enrolled courses
  });

  const applyFilters = useCallback((newFilters: CourseFilters) => {
    let result = [...CAMUS_COURSES];

    // Apply search filter
    if (newFilters.query) {
      const query = newFilters.query.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.instructor.name.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (newFilters.category && newFilters.category !== 'all' && newFilters.category !== 'All Categories') {
      result = result.filter(
        (course) => course.category.toLowerCase() === newFilters.category.toLowerCase()
      );
    }

    // Apply sorting
    switch (newFilters.sortBy) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'students':
      result.sort((a, b) => b.students - a.students);
      break;
    case 'popular':
    default:
      result.sort((a, b) => b.rating * b.students - a.rating * a.students);
      break;
    }

    setFilteredCourses(result);
  }, []);

  useEffect(() => {
    applyFilters(filters);
  }, [filters, applyFilters]);

  const handleFiltersChange = (newFilters: CourseFilters | { query?: string; category?: string; sortBy?: string }) => {
    setFilters({
      query: newFilters.query !== undefined ? newFilters.query : filters.query,
      category: newFilters.category !== undefined ? newFilters.category : filters.category,
      sortBy: newFilters.sortBy !== undefined ? newFilters.sortBy : filters.sortBy
    });
  };

  const handleEnrollCourse = (course: any) => {
    if (!enrolledCourseIds.includes(course.id)) {
      const updated = [...enrolledCourseIds, course.id];
      setEnrolledCourseIds(updated);
      try {
        localStorage.setItem('camus_enrolled_courses', JSON.stringify(updated));
      } catch {}
      showToast(`Successfully enrolled in "${course.title}"! Course added to your learning dashboard.`, 'success');
    } else {
      showToast(`You are already enrolled in "${course.title}". Opening syllabus...`, 'info');
      setSelectedCourseForPreview(course);
      setIsLessonPreviewModalOpen(true);
    }
  };

  const handleResumeLearning = () => {
    if (enrolledCourseIds.length > 0) {
      const firstEnrolled = CAMUS_COURSES.find(c => enrolledCourseIds.includes(c.id)) || CAMUS_COURSES[0];
      setSelectedCourseForPreview(firstEnrolled);
      setIsLessonPreviewModalOpen(true);
      showToast(`Resuming "${firstEnrolled.title}"...`, 'info');
    } else {
      navigate('/camus/dashboard');
    }
  };

  const scrollToCourses = () => {
    coursesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const categories = [...new Set(CAMUS_COURSES.map((c) => c.category))];

  const StatCard: React.FC<{
    stat: { label: string; value: string; icon: string };
  }> = ({ stat }) => {
    const icons: Record<string, React.ReactNode> = {
      members: <UserGroupIcon className="w-8 h-8 text-blue-600" />,
      courses: <VideoCameraIcon className="w-8 h-8 text-blue-600" />,
      graduates: <AcademicCapIcon className="w-8 h-8 text-blue-600" />
    };

    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xs flex items-center gap-4 border border-slate-300 dark:border-gray-800">
        <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-2xl border border-blue-300 dark:border-blue-800">
          {icons[stat.icon] || (
            <BookOpenIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          )}
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">{stat.label}</p>
        </div>
      </div>
    );
  };

  const CategoryCard: React.FC<{ category: CourseCategory }> = ({
    category
  }) => {
    const isSelected = filters.category.toLowerCase() === category.name.toLowerCase();
    return (
      <div
        className={`p-4 rounded-2xl shadow-xs flex items-center gap-4 transition-all cursor-pointer border ${
          isSelected
            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 shadow-md ring-2 ring-blue-500/20'
            : 'bg-white dark:bg-gray-900 hover:bg-blue-50/50 dark:hover:bg-gray-800 border-slate-300 dark:border-gray-800'
        }`}
        onClick={() => {
          handleFiltersChange({ category: isSelected ? 'all' : category.name });
          scrollToCourses();
        }}
        role="button"
        tabIndex={0}
      >
        <div className="text-3xl p-2 rounded-xl bg-gray-50 dark:bg-gray-800">{category.icon}</div>
        <div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">{category.name}</h3>
          <p className="text-xs text-slate-700 dark:text-gray-400">{category.courseCount} Courses</p>
        </div>
      </div>
    );
  };

  const InstructorCard: React.FC<{ instructor: Instructor }> = ({
    instructor
  }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xs p-5 flex flex-col items-center text-center border border-slate-200 dark:border-gray-800 hover:shadow-md transition-shadow">
      <AnimatedAvatar
        staticUrl={instructor.avatarUrl || ''}
        altText={instructor.name}
        className="w-20 h-20"
      />
      <h3 className="font-bold mt-3 text-sm text-gray-900 dark:text-white">{instructor.name}</h3>
      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{instructor.specialty}</p>
      <div className="flex items-center mt-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.floor(instructor.rating) ? 'text-yellow-400' : 'text-slate-500'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-xs text-slate-700 ml-1.5 font-mono">
          ({instructor.students.toLocaleString()})
        </span>
      </div>
    </div>
  );

  const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
    testimonial
  }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xs p-6 border border-slate-200 dark:border-gray-800 flex flex-col justify-between">
      <div>
        <div className="flex items-center">
          <AnimatedAvatar
            staticUrl={testimonial.member.avatarUrl}
            altText={testimonial.member.name}
            className="w-12 h-12"
          />
          <div className="ml-3">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{testimonial.member.name}</h4>
            <p className="text-xs text-slate-700">{testimonial.member.title}</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">
          &ldquo;{testimonial.content}&rdquo;
        </p>
      </div>
      <div className="flex mt-4 pt-3 border-t border-slate-200 dark:border-gray-800">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-slate-500'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );

  return (
    <MainLayout pageTitle="Camus">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-md">
              <CamusIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-950 dark:text-blue-300 border  border-blue-400 font-black">
                  LMS &amp; Academy Protocol
                </span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                CAMUS Learning Management
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Advanced education, certifications &amp; live interactive lecture platform
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="sticky top-20 space-y-6">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-gray-800">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Camus Navigation</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => navigate('/camus/dashboard')}
                      className="w-full text-left font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 p-2.5 rounded-xl flex items-center transition"
                    >
                      <AcademicCapIcon className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                      <span>My Courses</span>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-950 dark:text-blue-200 font-mono border  border-blue-400 font-black">
                        {enrolledCourseIds.length}
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setIsCertificatesModalOpen(true)}
                      className="w-full text-left font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800/60 p-2.5 rounded-xl flex items-center transition"
                    >
                      <BookOpenIcon className="w-5 h-5 mr-3 text-slate-700" />
                      <span>Certificates</span>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-950 font-mono border  border-emerald-400 font-black">
                        3
                      </span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setIsLiveSessionsModalOpen(true)}
                      className="w-full text-left font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800/60 p-2.5 rounded-xl flex items-center transition"
                    >
                      <VideoCameraIcon className="w-5 h-5 mr-3 text-slate-700" />
                      <span>Live Sessions</span>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-950 font-mono font-bold animate-pulse border border-red-400 font-black">
                        LIVE
                      </span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Learning Stats */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-gray-800">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Your Learning</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-gray-800 pb-2.5">
                    <span className="text-xs text-slate-700">Courses Enrolled</span>
                    <span className="text-base font-black font-mono text-gray-900 dark:text-white">
                      {enrolledCourseIds.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-gray-800 pb-2.5">
                    <span className="text-xs text-slate-700">Courses Completed</span>
                    <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                      2
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-700">Hours Learned</span>
                    <span className="text-base font-black font-mono text-blue-600 dark:text-blue-400">
                      38h
                    </span>
                  </div>
                  <button
                    onClick={handleResumeLearning}
                    className="w-full mt-3 inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-xs font-bold rounded-xl shadow-md text-white bg-blue-600 hover:bg-blue-700 transition"
                  >
                    Resume Learning
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6 space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white rounded-3xl p-8 mb-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                  <CamusIcon className="w-10 h-10 text-slate-700" />
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                  <span className="block">Advanced Education Platform</span>
                  <span className="block text-blue-200 text-lg sm:text-2xl font-bold mt-1">
                    Empowering learners and educators globally
                  </span>
                </h1>
                <p className="mt-4 max-w-xl mx-auto text-xs sm:text-sm text-blue-100">
                  Access accredited modules, earn verified verifiable certificates, and engage directly in live WebRTC studio classes.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {member ? (
                    <button
                      onClick={() => navigate('/camus/dashboard')}
                      className="px-6 py-3 border border-transparent text-sm font-black rounded-xl text-blue-700 bg-white hover:bg-blue-50 shadow-lg transition"
                    >
                      Go to Dashboard
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate('/auth/signup?role=student')}
                        className="px-6 py-3 border border-transparent text-sm font-black rounded-xl text-blue-700 bg-white hover:bg-blue-50 shadow-lg transition"
                      >
                        Enroll as Student
                      </button>
                      <button
                        onClick={() => navigate('/auth/signup?role=instructor')}
                        className="px-6 py-3 border border-white/40 text-sm font-bold rounded-xl text-slate-700 bg-white/10 hover:bg-white/20 backdrop-blur transition"
                      >
                        Become Instructor
                      </button>
                    </>
                  )}
                  <button
                    onClick={scrollToCourses}
                    className="px-5 py-3 text-sm font-bold text-blue-100 hover:text-white transition"
                  >
                    Browse Catalog ↓
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {CAMUS_STATS.map(
                  (
                    stat: { label: string; value: string; icon: string },
                    index: number
                  ) => (
                    <StatCard key={index} stat={stat} />
                  )
                )}
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">
                    Explore Categories
                  </h2>
                  <p className="text-xs text-gray-500">
                    Find specialized courses across core industry verticals
                  </p>
                </div>
                {filters.category !== 'all' && (
                  <button
                    onClick={() => handleFiltersChange({ category: 'all' })}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Reset Filter ({filters.category})
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {CAMUS_CATEGORIES.map((category: CourseCategory, index: number) => (
                  <CategoryCard key={index} category={category} />
                ))}
              </div>
            </div>

            {/* Courses Section */}
            <div ref={coursesSectionRef} id="courses-section" className="pt-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                    Popular Courses
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Hand-picked courses from expert instructors and verified universities
                  </p>
                </div>
              </div>

              <EnhancedFilterBar
                filterOptions={{
                  categories: ['All Categories', ...categories],
                  sortByOptions: [
                    { value: 'popular', label: 'Most Popular' },
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'students', label: 'Most Students' },
                    { value: 'price_asc', label: 'Price: Low to High' },
                    { value: 'price_desc', label: 'Price: High to Low' }
                  ],
                  searchPlaceholder: 'Search courses by title, topic, or instructor...'
                }}
                onFiltersChange={handleFiltersChange}
              />

              {filteredCourses.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl shadow-xs border border-slate-200 dark:border-gray-800 p-8">
                  <BookOpenIcon className="mx-auto h-12 w-12 text-slate-700 mb-3" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    No courses match your filter
                  </h3>
                  <p className="text-xs text-slate-700 mt-1">
                    Try adjusting your search terms or clearing category filters.
                  </p>
                  <button
                    onClick={() => setFilters({ query: '', category: 'all', sortBy: 'popular' })}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {filteredCourses.map((course: any) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      isEnrolled={enrolledCourseIds.includes(course.id)}
                      onEnroll={handleEnrollCourse}
                      onViewDetails={(c) => {
                        setSelectedCourseForPreview(c);
                        setIsLessonPreviewModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Instructors Section */}
            <div className="pt-6">
              <div className="mb-6">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  Expert Instructors
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Learn from verified industry professionals and certified educators
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {CAMUS_INSTRUCTORS.map((instructor: Instructor, index: number) => (
                  <InstructorCard key={index} instructor={instructor} />
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="pt-6">
              <div className="mb-6">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  Learner Testimonials
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verified reviews from graduated cohort members
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {CAMUS_TESTIMONIALS.map(
                  (testimonial: Testimonial, index: number) => (
                    <TestimonialCard key={index} testimonial={testimonial} />
                  )
                )}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                    Ready to start learning?
                  </h2>
                  <p className="text-blue-100 text-xs sm:text-sm mt-1">
                    Join CAMUS Academy today and unlock complete access to certificates, workshops &amp; developer toolkits.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => navigate('/auth/signup')}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-black rounded-xl text-blue-700 bg-white hover:bg-blue-50 shadow-lg transition"
                  >
                    Get started →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-3xl p-6 border border-blue-100 dark:border-blue-900/60 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-gray-900 dark:text-white">
                  {ficBalance.toFixed(2)} FIC
                </span>
                <button
                  onClick={() => navigate('/wallet')}
                  className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl shadow-xs transition"
                >
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xs p-6 border border-slate-300 dark:border-gray-800">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Learning Actions</h2>
              <div className="space-y-2.5">
                <button
                  onClick={scrollToCourses}
                  className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors flex items-center text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Browse Courses
                </button>
                <button
                  onClick={() => navigate('/forum')}
                  className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors flex items-center text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  <UserGroupIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Join Community
                </button>
                <button
                  onClick={() => {
                    const firstCourse = CAMUS_COURSES[0];
                    setSelectedCourseForPreview(firstCourse);
                    setIsLessonPreviewModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors flex items-center text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  <VideoCameraIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Watch Lessons
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-3xl p-6 border border-amber-200/60 dark:border-amber-900/40">
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-2">
                Education Tips
              </h3>
              <ul className="space-y-2 text-xs text-amber-900/80 dark:text-amber-200/80">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>Set achievable learning goals each week</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>Complete practice quizzes to earn certifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>Participate in live instructor Q&amp;A sessions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * MODAL 1: CERTIFICATES MANAGEMENT
       * ========================================================================= */}
      {isCertificatesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-gray-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-blue-600 font-bold">Credential Verification</span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mt-0.5 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  My Earned Certificates
                </h3>
              </div>
              <button
                onClick={() => setIsCertificatesModalOpen(false)}
                className="p-2 rounded-xl text-slate-700 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 'CERT-8491-WEB',
                  title: 'Complete Web Development Bootcamp',
                  date: 'Issued: Oct 2026',
                  grade: 'Grade: 98% (Honors)',
                  instructor: 'John Smith'
                },
                {
                  id: 'CERT-3921-UX',
                  title: 'UI/UX Design Fundamentals',
                  date: 'Issued: Sept 2026',
                  grade: 'Grade: 95%',
                  instructor: 'Michael Chen'
                },
                {
                  id: 'CERT-1049-SEC',
                  title: 'FingerMobile Sovereign Protocol Architecture',
                  date: 'Issued: Aug 2026',
                  grade: 'Grade: 100% (Distinction)',
                  instructor: 'Dr. Obinna'
                }
              ].map((cert, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400  dark:bg-emerald-950 dark:text-emerald-300 font-black">
                        {cert.id}
                      </span>
                      <span className="text-[10px] text-slate-700 font-semibold">{cert.date}</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{cert.title}</h4>
                    <p className="text-xs text-slate-700">{cert.grade} • Instructor: {cert.instructor}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast(`Verifying cryptographic signature for ${cert.id}... Valid!`, 'success')}
                      className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 flex items-center gap-1.5 transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Verify
                    </button>
                    <button
                      onClick={() => showToast(`Downloading PDF Certificate: ${cert.id}`, 'info')}
                      className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsCertificatesModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * MODAL 2: LIVE SESSIONS
       * ========================================================================= */}
      {isLiveSessionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-gray-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-red-600 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  WebRTC Live Studio Classes
                </span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mt-0.5">
                  Interactive Live Sessions
                </h3>
              </div>
              <button
                onClick={() => setIsLiveSessionsModalOpen(false)}
                className="p-2 rounded-xl text-slate-700 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'React 19 & Next-Gen Server Components Architecture',
                  instructor: 'John Smith (Full Stack Lead)',
                  time: 'Live Now • Started 15m ago',
                  viewers: '342 Active Students',
                  isLive: true
                },
                {
                  title: 'High-Frequency Financial Modeling & Escrow Systems',
                  instructor: 'Jennifer Lee (FinTech Director)',
                  time: 'Today at 6:00 PM GMT+1',
                  viewers: '210 Registered',
                  isLive: false
                },
                {
                  title: 'Autonomous AI Multi-Agent Orchestration Workshop',
                  instructor: 'Sarah Williams (AI Research)',
                  time: 'Tomorrow at 4:30 PM GMT+1',
                  viewers: '480 Registered',
                  isLive: false
                }
              ].map((sess, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    sess.isLive
                      ? 'border-red-300 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20'
                      : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sess.isLive ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                        {sess.isLive ? 'BROADCASTING NOW' : 'UPCOMING'}
                      </span>
                      <span className="text-[11px] text-slate-700 font-semibold">{sess.time}</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{sess.title}</h4>
                    <p className="text-xs text-slate-700">{sess.instructor} • {sess.viewers}</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsLiveSessionsModalOpen(false);
                      navigate('/live-streaming');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 ${
                      sess.isLive
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <VideoCameraIcon className="w-4 h-4" />
                    <span>{sess.isLive ? 'Join Stream' : 'Set Reminder'}</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsLiveSessionsModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * MODAL 3: LESSON PREVIEW / WATCH LESSONS
       * ========================================================================= */}
      {isLessonPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-gray-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-blue-600 font-bold">Interactive Lesson Stream</span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mt-0.5">
                  {selectedCourseForPreview?.title || 'Course Lesson Player'}
                </h3>
              </div>
              <button
                onClick={() => setIsLessonPreviewModalOpen(false)}
                className="p-2 rounded-xl text-slate-700 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Box */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center text-white border border-slate-800">
              <div className="w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-500 flex items-center justify-center cursor-pointer shadow-xl transition transform hover:scale-110">
                <Play className="w-8 h-8 fill-white text-white ml-1" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs bg-black/60 backdrop-blur p-2.5 rounded-xl">
                <span className="font-semibold truncate max-w-md">
                  Lesson 1: Introduction, Architecture Overview &amp; Project Setup
                </span>
                <span className="font-mono text-gray-300">14:28 / 45:00</span>
              </div>
            </div>

            {/* Modules Syllabus */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Module Curriculum</h4>
              <div className="space-y-2">
                {[
                  { num: '01', title: 'Getting Started: Environment & Dependency Setup', duration: '18 mins', done: true },
                  { num: '02', title: 'Core Principles & Clean Component Architecture', duration: '32 mins', done: true },
                  { num: '03', title: 'State Management & Real-Time Telemetry Sync', duration: '45 mins', active: true },
                  { num: '04', title: 'Production Security, WORM Auditing & Deployment', duration: '29 mins' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition cursor-pointer ${
                      item.active
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-bold'
                        : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-700">{item.num}</span>
                      <span>{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-700">{item.duration}</span>
                      {item.done ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-gray-800">
              <button
                onClick={() => {
                  setIsLessonPreviewModalOpen(false);
                  navigate('/camus/dashboard');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Open Full Student Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsLessonPreviewModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default CamusPage;
