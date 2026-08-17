import { useNavigate, NavLink } from 'react-router-dom';
import React from 'react';

import { useAppContext } from "../contexts/AppContext";
import { useAuth } from '../contexts/AuthContext';
import { CAMUS_COURSES } from '../constants/camusConstants';
import {
  BookOpenIcon,
  MemberIcon,
  HeartIcon,
  StarIcon,
  ClipboardListIcon,
  CalendarIcon,
  BellIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ChatIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  LightBulbIcon
} from '../icons';
import InstructorDashboard from '../components/InstructorDashboard';
import MainLayout from '../components/layout/MainLayout';

interface Lesson {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
  lessons?: Lesson[];
}

interface CamusCourse {
  id: string;
  title: string;
  instructorId?: string;
  rating?: number;
  status?: string;
  modules?: Module[];
}

interface Enrollment {
  memberId: string;
  courseId: string;
  completedLessons: string[];
}

interface EnrolledCourse extends CamusCourse {
  enrollment: Enrollment;
  progress: number;
  completedLessonsCount: number;
  totalLessons: number;
}

interface StatOption {
  label: string;
  value: string;
  icon: string;
}

interface NavOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const CamusDashboardPage: React.FC = () => {
  const { member } = useAuth();
  const { enrollments, ficBalance } = useAppContext();
  const navigate = useNavigate();

  // Member role from context or default to student
  const memberRole = member?.role || "student";

  // Filter enrollments for current member safely
  const memberEnrollments: Enrollment[] = member
    ? (enrollments as any[]).filter((e: any) => e.memberId === member.id)
    : [];

  // Get enrolled courses and calculate progress
  const enrolledCourses: EnrolledCourse[] = memberEnrollments
    .map((enrollment) => {
      const course = (CAMUS_COURSES as CamusCourse[]).find((c) => c.id === enrollment.courseId);
      if (!course) return null;

      const totalLessons = (course.modules || []).reduce(
        (acc: number, mod: Module) => acc + (mod.lessons?.length || 0),
        0,
      );
      const completedLessonsCount = enrollment.completedLessons?.length || 0;
      const progress =
        totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

      return {
        ...course,
        enrollment,
        progress,
        completedLessonsCount,
        totalLessons
      };
    })
    .filter((c): c is EnrolledCourse => c !== null);

  // Calculate stats for enrolled courses
  const enrolledStats = enrolledCourses.reduce(
    (acc, course) => {
      if (course.progress === 100) acc.coursesCompleted += 1;
      if (course.progress > 0 && course.progress < 100) acc.coursesInProgress += 1;
      acc.totalEnrolled += 1;
      return acc;
    },
    { coursesCompleted: 0, coursesInProgress: 0, totalEnrolled: 0 },
  );

  // Get my courses if instructor
  const myCourses = member
    ? (CAMUS_COURSES as CamusCourse[]).filter((course) => course.instructorId === member.id)
    : [];

  const createdStats = {
    totalCourses: myCourses.length,
    totalEnrollments: myCourses.reduce((acc: number, course) => {
      const courseEnrollments = memberEnrollments.filter(
        (e) => e.courseId === course.id,
      );
      return acc + courseEnrollments.length;
    }, 0),
    totalRevenue: 0,
  };

  const totalStudents = myCourses.reduce((acc: number, course) => {
    return acc + (enrollments as any[]).filter((e: any) => e.courseId === course.id).length;
  }, 0);

  // Stats for different member roles
  const getStats = (): StatOption[] => {
    if (memberRole === "instructor") {
      return [
        {
          label: "My Courses",
          value: createdStats.totalCourses.toString(),
          icon: "courses"
        },
        {
          label: "Total Students",
          value: totalStudents.toString(),
          icon: "students"
        },
        {
          label: "Pending Approval",
          value: myCourses
            .filter((c) => c.status === "pending")
            .length.toString(),
          icon: "pending"
        },
        { label: "Total Earnings", value: "₦0.00", icon: "earnings" }
      ];
    }
    
    return [
      {
        label: "Enrolled Courses",
        value: enrolledStats.totalEnrolled.toString(),
        icon: "courses"
      },
      {
        label: "Active Courses",
        value: enrolledStats.coursesInProgress.toString(),
        icon: "active"
      },
      {
        label: "Completed Courses",
        value: enrolledStats.coursesCompleted.toString(),
        icon: "completed"
      },
      { label: "Wishlist Items", value: "0", icon: "wishlist" }
    ];
  };

  // Navigation items based on member role
  const getNavItems = (): NavOption[] => {
    const allMemberItems: NavOption[] = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <AcademicCapIcon className="w-5 h-5" />
      },
      {
        id: "profile",
        label: "My Profile",
        icon: <MemberIcon className="w-5 h-5" />
      },
      {
        id: "courses",
        label: "Enrolled Courses",
        icon: <BookOpenIcon className="w-5 h-5" />
      },
      {
        id: "wishlist",
        label: "Wishlist",
        icon: <HeartIcon className="w-5 h-5" />
      },
      {
        id: "reviews",
        label: "Reviews",
        icon: <StarIcon className="w-5 h-5" />
      },
      {
        id: "quiz",
        label: "My Quiz Attempts",
        icon: <ClipboardListIcon className="w-5 h-5" />
      },
      {
        id: "orders",
        label: "Order History",
        icon: <DocumentTextIcon className="w-5 h-5" />
      },
      {
        id: "qna",
        label: "Question & Answer",
        icon: <ChatIcon className="w-5 h-5" />
      },
      {
        id: "calendar",
        label: "Calendar",
        icon: <CalendarIcon className="w-5 h-5" />
      }
    ];

    const instructorItems: NavOption[] = [
      {
        id: "my-courses",
        label: "My Courses",
        icon: <BookOpenIcon className="w-5 h-5" />
      },
      {
        id: "announcements",
        label: "Announcements",
        icon: <BellIcon className="w-5 h-5" />
      },
      {
        id: "withdrawals",
        label: "Withdrawals",
        icon: <DocumentTextIcon className="w-5 h-5" />
      },
      {
        id: "quiz-attempts",
        label: "Quiz Attempts",
        icon: <ClipboardListIcon className="w-5 h-5" />
      },
      {
        id: "meetings",
        label: "Google Meet",
        icon: <VideoCameraIcon className="w-5 h-5" />
      },
      {
        id: "assignments",
        label: "Assignments",
        icon: <ClipboardListIcon className="w-5 h-5" />
      },
      {
        id: "zoom",
        label: "Zoom",
        icon: <VideoCameraIcon className="w-5 h-5" />
      },
      {
        id: "certificates",
        label: "Certificates",
        icon: <DocumentTextIcon className="w-5 h-5" />
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: <ChartBarIcon className="w-5 h-5" />
      },
      {
        id: "ai-tools",
        label: "AI Tools",
        icon: <LightBulbIcon className="w-5 h-5" />
      },
      {
        id: "settings",
        label: "Settings",
        icon: <MemberIcon className="w-5 h-5" />
      }
    ];

    if (memberRole === "instructor") {
      return [...allMemberItems, ...instructorItems];
    }

    return allMemberItems;
  };

  const navItems = getNavItems();
  const stats = getStats();

  // Stat card component
  const StatCard: React.FC<{ stat: StatOption }> = ({ stat }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
        <div className="p-3 bg-blue-100 rounded-lg">
          <AcademicCapIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </div>
      </div>
    </div>
  );

  // In-progress course card
  const InProgressCourseCard: React.FC<{ course: EnrolledCourse }> = ({ course }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between">
        <h3 className="font-semibold text-gray-900">{course.title}</h3>
        <div className="flex items-center">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-600 ml-1">{course.rating || 0}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center text-sm text-gray-600">
        <span>
          {course.completedLessonsCount}/{course.totalLessons} lessons
        </span>
      </div>

      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
        <div className="text-right text-xs text-gray-500 mt-1">
          {Math.round(course.progress)}% complete
        </div>
      </div>

      <button
        onClick={() => navigate(`/camus/course/${course.id}`)}
        className="mt-3 w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Continue Learning
      </button>
    </div>
  );

  return (
    <MainLayout pageTitle="CAMUS LMS">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">CAMUS Learning Management System</h1>
              <p className="text-gray-600">Enhance your skills with our educational courses</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={`/camus/dashboard/${item.id}`}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-blue-100 text-blue-800"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`
                    }
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </nav>
            
            {/* FIC Balance Card */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MemberIcon className="h-5 w-5 text-purple-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-indigo-700">
                  Add Funds
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
              {memberRole === "instructor" ? (
                <InstructorDashboard />
              ) : (
                <>
                  <div className="pb-5 border-b border-gray-200">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                      Welcome back, {member?.name}. Here&apos;s what&apos;s happening with
                      your courses.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                      <StatCard key={index} stat={stat} />
                    ))}
                  </div>

                  {/* In Progress Courses */}
                  <div className="mt-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-medium text-gray-900">
                        In Progress Courses
                      </h2>
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        View All
                      </button>
                    </div>

                    {enrolledCourses.filter((course) => course.progress < 100).length > 0 ? (
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {enrolledCourses
                          .filter((course) => course.progress < 100)
                          .map((course) => (
                            <InProgressCourseCard
                              key={course.id}
                              course={course}
                            />
                          ))}
                      </div>
                    ) : (
                      <div className="mt-6 text-center">
                        <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No courses in progress
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Get started by browsing our course catalog.
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={() => navigate("/camus")}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            Browse Courses
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CamusDashboardPage;