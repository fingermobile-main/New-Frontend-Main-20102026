import React from 'react';
/*
 * FingerMobile Protocol™ - CAMUS Learning Management System Page
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import { useAppContext } from "../contexts/AppContext";
import { logError } from '../utils/errorLogger';
import { GiftIcon, UserCircleIcon } from '../icons';

import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import {
  CamusIcon,
  MembersIcon as MembersGroupIcon,
  VideoCameraIcon,
  GraduationCapIcon,
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
import type { Instructor, Testimonial } from '../constants/camusConstants';
import type { CourseCategory } from '../constants/camusConstants';
import CourseCard from '../components/CourseCard';
import AnimatedAvatar from '../components/AnimatedAvatar';
import EnhancedFilterBar from '../components/shared/EnhancedFilterBar';
import MainLayout from '../components/layout/MainLayout';

interface CourseFilters {
  query: string;
  category: string;
  sortBy: string;
}

interface CourseCardProps {
  id: string;
  title: string;
  instructor: { name: string; avatarUrl: string };
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  students: number;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
}

const CamusPage: React.FC = () => {
  const { member } = useAuth();
  const navigate = useNavigate();
  const { showToast, ficBalance } = useAppContext();
  const [filters, setFilters] = React.useState<CourseFilters>({
    query: "",
    category: "all",
    sortBy: "popular"
  });

  const [filteredCourses, setFilteredCourses] = React.useState(CAMUS_COURSES);

  const applyFilters = React.useCallback((newFilters: CourseFilters) => {
    let result = [...CAMUS_COURSES];

    // Apply search filter
    if (newFilters.query) {
      const query = newFilters.query.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.instructor.name.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query),
      );
    }

    // Apply category filter
    if (newFilters.category !== "all") {
      result = result.filter(
        (course) => course.category === newFilters.category,
      );
    }

    // Apply sorting
    switch (newFilters.sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "students":
        result.sort((a, b) => b.students - a.students);
        break;
      case "popular":
      default:
        // Sort by a combination of rating and students
        result.sort((a, b) => b.rating * b.students - a.rating * a.students);
        break;
    }

    setFilteredCourses(result);
  }, []);

  React.useEffect(() => {
    applyFilters(filters);
  }, [filters, applyFilters]);

  const handleFiltersChange = (newFilters: CourseFilters | { query?: string; category?: string; sortBy?: string }) => {
    setFilters({
      query: newFilters.query || "",
      category: newFilters.category || "all",
      sortBy: newFilters.sortBy || "popular"
    });
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
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4 border border-gray-100">
        <div className="bg-blue-100 p-3 rounded-full">
          {icons[stat.icon] || (
            <BookOpenIcon className="w-8 h-8 text-blue-600" />
          )}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </div>
      </div>
    );
  };

  const CategoryCard: React.FC<{ category: CourseCategory }> = ({
    category
  }) => (
    <div
      className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4 hover:bg-blue-50 transition-colors cursor-pointer border border-gray-100"
      onClick={() =>
        handleFiltersChange({ ...filters, category: category.name })
      }
    >
      <div className="text-3xl">{category.icon}</div>
      <div>
        <h3 className="font-bold text-gray-900">{category.name}</h3>
        <p className="text-xs text-gray-500">{category.courseCount} Courses</p>
      </div>
    </div>
  );

  const InstructorCard: React.FC<{ instructor: Instructor }> = ({
    instructor
  }) => (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center border border-gray-100">
      <AnimatedAvatar
        staticUrl={instructor.avatarUrl || ""}
        altText={instructor.name}
        className="w-24 h-24"
      />
      <h3 className="font-bold mt-3 text-gray-900">{instructor.name}</h3>
      <p className="text-sm text-gray-500">{instructor.specialty}</p>
      <div className="flex items-center mt-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < Math.floor(instructor.rating) ? "text-yellow-400" : "text-gray-300"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-500 ml-1">
          ({instructor.students})
        </span>
      </div>
    </div>
  );

  const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
    testimonial
  }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center">
        <AnimatedAvatar
          staticUrl={testimonial.member.avatarUrl}
          altText={testimonial.member.name}
          className="w-16 h-16"
        />
        <div className="ml-4">
          <h4 className="font-bold text-gray-900">{testimonial.member.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.member.title}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-600 italic">"{testimonial.content}"</p>
      <div className="flex mt-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
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
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <CamusIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                CAMUS Learning Management
              </h1>
              <p className="text-gray-600">Advanced education platform for learners and educators</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-10">
              <div className="text-center">
                <CamusIcon className="w-16 h-16 mx-auto text-white" />
                <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl md:text-5xl">
                  <span className="block">Advanced Education Platform</span>
                  <span className="block text-blue-200 mt-2">
                    Empowering learners and educators
                  </span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
                  Join our cutting-edge educational experience with innovative technology solutions.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  {member ? (
                    <button
                      onClick={() => navigate("/camus/dashboard")}
                      className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
                    >
                      Go to Dashboard
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate("/auth/signup?role=student")}
                        className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
                      >
                        Enroll as Student
                      </button>
                      <button
                        onClick={() => navigate("/auth/signup?role=instructor")}
                        className="px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                      >
                        Become Instructor
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="py-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Empowering Education
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                  Join our growing community of learners and educators
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                {CAMUS_STATS.map(
                  (
                    stat: { label: string; value: string; icon: string },
                    index: number,
                  ) => (
                    <StatCard key={index} stat={stat} />
                  ),
                )}
              </div>
            </div>

            {/* Categories Section */}
            <div className="py-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Explore Categories
                </h2>
                <p className="mt-4 max-w-2xs mx-auto text-xl text-gray-500">
                  Find courses in your field of interest
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {CAMUS_CATEGORIES.map((category: CourseCategory, index: number) => (
                  <CategoryCard key={index} category={category} />
                ))}
              </div>
            </div>

            {/* Courses Section */}
            <div className="py-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Popular Courses
                  </h2>
                  <p className="mt-4 max-w-2xl text-xl text-gray-500">
                    Hand-picked courses from expert instructors
                  </p>
                </div>
              </div>

              <EnhancedFilterBar
                filterOptions={{
                  categories: ["All Categories", ...categories],
                  sortByOptions: [
                    { value: "popular", label: "Most Popular" },
                    { value: "rating", label: "Highest Rated" },
                    { value: "students", label: "Most Students" },
                    { value: "price_asc", label: "Price: Low to High" },
                    { value: "price_desc", label: "Price: High to Low" }
                  ],
                  searchPlaceholder: "Search courses..."
                }}
                onFiltersChange={handleFiltersChange}
              />

              {filteredCourses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100">
                  <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No courses found
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course: any) => (
                    <CourseCard key={course.id} {...({ course } as any)} />
                  ))}
                </div>
              )}
            </div>

            {/* Instructors Section */}
            <div className="py-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Expert Instructors
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                  Learn from industry professionals and academic experts
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {CAMUS_INSTRUCTORS.map((instructor: Instructor, index: number) => (
                  <InstructorCard key={index} instructor={instructor} />
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="py-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  What Our Students Say
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                  Hear from our community of learners
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {CAMUS_TESTIMONIALS.map(
                  (testimonial: Testimonial, index: number) => (
                    <TestimonialCard key={index} testimonial={testimonial} />
                  ),
                )}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    <span className="block">Ready to start learning?</span>
                    <span className="block text-blue-200">Join CAMUS LMS today.</span>
                  </h2>
                </div>
                <div className="mt-8 lg:mt-0">
                  <button
                    onClick={() => navigate("/auth/signup")}
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                  >
                    Get started
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Learning Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Browse Courses
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Join Community
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  <VideoCameraIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Watch Lessons
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Education Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Set achievable learning goals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Practice regularly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Join study groups</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default CamusPage;