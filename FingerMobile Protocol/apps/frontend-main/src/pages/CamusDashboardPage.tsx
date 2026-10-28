import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { CAMUS_COURSES, CAMUS_COURSE_BUNDLES, CAMUS_SUBSCRIPTION_PLANS } from '../constants/camusConstants';
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
import CamusAdminDashboard from '../components/camus/CamusAdminDashboard';
import MainLayout from '../components/layout/MainLayout';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';
import { CheckCircle, Award, Play, ShieldCheck, Download, ExternalLink, Package, Sparkles, Building, Layers } from 'lucide-react';

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
  instructor?: { name: string; avatarUrl?: string } | string;
  instructorId?: string;
  rating?: number;
  status?: string;
  price?: number;
  duration?: string;
  level?: string;
  modules?: Module[];
}

interface EnrolledCourse extends CamusCourse {
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
  const { ficBalance, showToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Multi-role state for switching between Student, Instructor Studio, and Admin Console
  const [activeRole, setActiveRole] = useState<'student' | 'instructor' | 'admin'>('student');

  // Tab state (supports URL subpaths or internal tab state)
  const pathParts = location.pathname.split('/');
  const subTab = pathParts[3] || 'dashboard';
  const [activeTab, setActiveTab] = useState<string>(subTab);

  useEffect(() => {
    if (subTab) {
      setActiveTab(subTab);
    }
  }, [subTab]);

  const memberRole = member?.role || 'student';
  const studentName = (member as any)?.name || member?.username || 'Fellow Scholar';

  // Read enrolled course IDs from localStorage & defaults
  const [enrolledIds, setEnrolledIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('camus_enrolled_courses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ['1', '2', '3']; // Default demo enrolled courses
  });

  // Calculate enrolled courses from catalog
  const enrolledCourses: EnrolledCourse[] = (CAMUS_COURSES as CamusCourse[])
    .filter((c) => enrolledIds.includes(c.id))
    .map((course, idx) => {
      const totalLessons = 16;
      // Staggered demo progress
      const completedLessonsCount = idx === 0 ? 12 : idx === 1 ? 6 : 16;
      const progress = Math.round((completedLessonsCount / totalLessons) * 100);

      return {
        ...course,
        progress,
        completedLessonsCount,
        totalLessons
      };
    });

  const enrolledStats = {
    totalEnrolled: enrolledCourses.length,
    coursesInProgress: enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length,
    coursesCompleted: enrolledCourses.filter(c => c.progress === 100).length,
    wishlistCount: 2
  };

  const getStats = (): StatOption[] => [
    {
      label: 'Enrolled Courses',
      value: enrolledStats.totalEnrolled.toString(),
      icon: 'courses'
    },
    {
      label: 'Active In Progress',
      value: enrolledStats.coursesInProgress.toString(),
      icon: 'active'
    },
    {
      label: 'Completed & Certified',
      value: enrolledStats.coursesCompleted.toString(),
      icon: 'completed'
    },
    {
      label: 'Wishlist Items',
      value: enrolledStats.wishlistCount.toString(),
      icon: 'wishlist'
    }
  ];

  const getNavItems = (): NavOption[] => [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <AcademicCapIcon className="w-5 h-5" />
    },
    {
      id: 'courses',
      label: 'Enrolled Courses',
      icon: <BookOpenIcon className="w-5 h-5" />
    },
    {
      id: 'bundles',
      label: 'Bundles & Subscriptions',
      icon: <Package className="w-5 h-5" />
    },
    {
      id: 'certificates',
      label: 'My Certificates',
      icon: <DocumentTextIcon className="w-5 h-5" />
    },
    {
      id: 'quiz',
      label: 'Quiz Attempts',
      icon: <ClipboardListIcon className="w-5 h-5" />
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: <HeartIcon className="w-5 h-5" />
    },
    {
      id: 'reviews',
      label: 'Course Reviews',
      icon: <StarIcon className="w-5 h-5" />
    },
    {
      id: 'live-sessions',
      label: 'Live Stream Classes',
      icon: <VideoCameraIcon className="w-5 h-5" />
    }
  ];

  const navItems = getNavItems();
  const stats = getStats();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/camus/dashboard/${tabId}`);
  };

  return (
    <MainLayout pageTitle="CAMUS LMS Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">
        <PlatformOwnershipCard />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-8 rounded-3xl text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
              <AcademicCapIcon className="h-10 w-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold">
                  Active Scholar
                </span>
                <span className="text-xs text-blue-200">ID: CAMUS-{member?.id || '8492'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Welcome back, {studentName}!
              </h1>
              <p className="text-xs text-blue-100 mt-0.5">
                Manage your enrolled syllabus, track certifications, and join live WebRTC workshops.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/camus')}
              className="px-5 py-2.5 bg-white text-blue-800 font-bold text-xs rounded-xl shadow-md hover:bg-blue-50 transition"
            >
              Browse Full Catalog →
            </button>
          </div>
        </div>

        {/* Multi-Role Switcher: Student | Instructor Studio | University Admin */}
        <div className="bg-white dark:bg-gray-900 p-2 sm:p-3 rounded-2xl border border-slate-300 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-2">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
              LMS Workspace Mode:
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveRole('student')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeRole === 'student'
                  ? 'bg-blue-600 text-white shadow-sm font-black'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-800'
              }`}
            >
              <AcademicCapIcon className="w-4 h-4" />
              <span>Student Scholar</span>
            </button>

            <button
              onClick={() => setActiveRole('instructor')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeRole === 'instructor'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Instructor Studio</span>
            </button>

            <button
              onClick={() => setActiveRole('admin')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeRole === 'admin'
                  ? 'bg-slate-900 text-white shadow-sm font-black'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>

        {/* INSTRUCTOR STUDIO WORKSPACE */}
        {activeRole === 'instructor' && (
          <InstructorDashboard />
        )}

        {/* UNIVERSITY ADMIN WORKSPACE */}
        {activeRole === 'admin' && (
          <CamusAdminDashboard />
        )}

        {/* STUDENT SCHOLAR WORKSPACE */}
        {activeRole === 'student' && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 w-full flex-shrink-0 space-y-4">
            <nav className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-slate-200 dark:border-gray-800 p-3">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-xs font-bold rounded-2xl transition ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className={isActive ? 'text-white' : 'text-slate-600 dark:text-slate-300'}>{item.icon}</span>
                      <span className="ml-3 truncate">{item.label}</span>
                      {item.id === 'courses' && (
                        <span className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 font-semibold'}`}>
                          {enrolledCourses.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* FIC Balance Card */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 rounded-3xl p-6 border border-purple-100 dark:border-purple-900/60 shadow-xs">
              <h2 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <MemberIcon className="h-4 w-4 text-purple-600 mr-2" />
                Wallet FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black font-mono text-gray-900 dark:text-white">
                  {ficBalance.toFixed(2)} FIC
                </span>
                <button
                  onClick={() => navigate('/wallet')}
                  className="text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-xl transition"
                >
                  Add Funds
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-6">
            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-xs"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                        {stat.label}
                      </div>
                      <div className="text-2xl font-black font-mono text-gray-900 dark:text-white mt-1">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* In Progress Courses */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-gray-900 dark:text-white">
                        Courses In Progress
                      </h2>
                      <p className="text-xs text-slate-700">Pick up right where you left off</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      View All ({enrolledCourses.length}) →
                    </button>
                  </div>

                  {enrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {enrolledCourses.map((course) => (
                        <div
                          key={course.id}
                          className="p-5 rounded-2xl border border-slate-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 space-y-3 hover:shadow-md transition"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                              {course.title}
                            </h3>
                            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                              {course.progress}%
                            </span>
                          </div>

                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden border text-gray-950 border-gray-400 font-black">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between pt-1 text-xs text-slate-700">
                            <span>
                              {course.completedLessonsCount} of {course.totalLessons} lessons completed
                            </span>
                            <button
                              onClick={() => {
                                showToast(`Launching video lesson for "${course.title}"...`, 'info');
                              }}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                            >
                              <Play className="w-3 h-3 fill-white" />
                              <span>Resume</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpenIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">No courses in progress</h4>
                      <p className="text-xs text-slate-700 mt-1">Enroll in your first course to begin learning.</p>
                      <button
                        onClick={() => navigate('/camus')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                      >
                        Browse Course Catalog
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: ENROLLED COURSES */}
            {activeTab === 'courses' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">
                      All Enrolled Courses ({enrolledCourses.length})
                    </h2>
                    <p className="text-xs text-slate-700">Your registered coursework and syllabus tracking</p>
                  </div>
                  <button
                    onClick={() => navigate('/camus')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    + Enroll in More Courses
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="p-5 rounded-2xl border border-slate-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-950 dark:text-blue-300 border  border-blue-400 font-black">
                            {course.level || 'Beginner'}
                          </span>
                          <h3 className="font-bold text-base text-gray-900 dark:text-white mt-1">
                            {course.title}
                          </h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-blue-600">
                          {course.progress}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden border text-gray-950 border-gray-400 font-black">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-300 dark:border-gray-700">
                        <span className="text-slate-700">
                          {course.completedLessonsCount}/{course.totalLessons} Lessons
                        </span>
                        <button
                          onClick={() => showToast(`Opening course player for "${course.title}"`, 'info')}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>{course.progress === 100 ? 'Review Course' : 'Continue Lesson'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: BUNDLES & SUBSCRIPTIONS */}
            {activeTab === 'bundles' && (
              <div className="space-y-6">
                {/* Degree Bundles Card */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-300 dark:border-gray-800 p-6 shadow-xs space-y-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Package className="w-6 h-6 text-indigo-600" />
                      Academic Course Bundles &amp; Degree Suites
                    </h2>
                    <p className="text-xs text-slate-700">
                      Multi-course packaged degree tracks across Arts &amp; Social Sciences with bundled tuition discounts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CAMUS_COURSE_BUNDLES.map((bundle) => (
                      <div
                        key={bundle.id}
                        className="p-5 rounded-2xl border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/40 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                            {bundle.faculty}
                          </span>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">
                            {bundle.title}
                          </h3>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {bundle.description}
                          </p>

                          <div className="flex items-center gap-3 pt-1">
                            <span className="text-lg font-black font-mono text-emerald-800 dark:text-emerald-400">
                              {bundle.bundlePrice} FIC
                            </span>
                            <span className="text-xs text-slate-500 line-through">
                              {bundle.regularPrice} FIC
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 text-[10px] font-bold">
                              Save {bundle.savingsPercentage}%
                            </span>
                          </div>
                          <div className="text-xs text-slate-800">
                            <strong>Includes:</strong> {bundle.courseCount} Courses • {bundle.level}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200 dark:border-gray-700 flex items-center justify-between">
                          <button
                            onClick={() => {
                              const newIds = Array.from(new Set([...enrolledIds, ...bundle.coursesIncluded]));
                              setEnrolledIds(newIds);
                              try { localStorage.setItem('camus_enrolled_courses', JSON.stringify(newIds)); } catch {}
                              showToast(`Enrolled in degree bundle: "${bundle.title}"!`, 'success');
                              setActiveTab('courses');
                            }}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                          >
                            Enroll in Complete Bundle →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subscriptions Card */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-300 dark:border-gray-800 p-6 shadow-xs space-y-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-amber-500" />
                      Scholar Subscriptions &amp; All-Access Passes
                    </h2>
                    <p className="text-xs text-slate-700">
                      Unlimited access to School of Arts &amp; Social Sciences microlessons, AI tutoring, and WebRTC workshops.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {CAMUS_SUBSCRIPTION_PLANS.map((plan) => (
                      <div
                        key={plan.id}
                        className="p-5 rounded-2xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          {plan.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400 font-bold text-[10px] uppercase">
                              {plan.badge}
                            </span>
                          )}
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{plan.name}</h4>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                              {plan.priceFic} FIC
                            </span>
                            <span className="text-xs text-slate-700">/{plan.billingPeriod}</span>
                          </div>
                          <ul className="text-xs text-slate-800 space-y-1.5 pt-2">
                            {plan.features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => showToast(`Activated subscription: ${plan.name}`, 'success')}
                          className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                        >
                          Subscribe with FIC
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CERTIFICATES */}
            {activeTab === 'certificates' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-500" />
                    Verified Cryptographic Certificates
                  </h2>
                  <p className="text-xs text-slate-700">
                    Blockchain and WORM ledger verified graduation certificates
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'CERT-8491-WEB', title: 'Complete Web Development Bootcamp', date: 'Oct 2026', grade: '98%' },
                    { id: 'CERT-3921-UX', title: 'UI/UX Design Fundamentals', date: 'Sept 2026', grade: '95%' },
                    { id: 'CERT-1049-SEC', title: 'FingerMobile Sovereign Protocol Architecture', date: 'Aug 2026', grade: '100%' }
                  ].map((cert) => (
                    <div
                      key={cert.id}
                      className="p-5 rounded-2xl border border-slate-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {cert.id}
                          </span>
                          <span className="text-xs text-slate-700 font-semibold">• Issued {cert.date}</span>
                        </div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white mt-1">
                          {cert.title}
                        </h3>
                        <p className="text-xs text-slate-700">Final Score: {cert.grade} (Verified Distinction)</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => showToast(`Verifying certificate ${cert.id}... Cryptographically Authentic!`, 'success')}
                          className="px-3 py-2 text-xs font-bold bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 flex items-center gap-1.5 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          Verify
                        </button>
                        <button
                          onClick={() => showToast(`Downloading ${cert.title} PDF Certificate`, 'info')}
                          className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: QUIZ ATTEMPTS */}
            {activeTab === 'quiz' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  Quiz &amp; Assessment Records
                </h2>
                <div className="space-y-3">
                  {[
                    { title: 'TypeScript Advanced Generics Quiz', score: '100%', date: 'Oct 8, 2026', status: 'Passed' },
                    { title: 'Responsive Design & Media Queries Check', score: '92%', date: 'Oct 3, 2026', status: 'Passed' },
                    { title: 'REST vs GraphQL Protocol Exam', score: '96%', date: 'Sept 28, 2026', status: 'Passed' }
                  ].map((q, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl border border-slate-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 flex items-center justify-between text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{q.title}</h4>
                        <span className="text-slate-700">{q.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-emerald-600 text-sm">{q.score}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold  text-[10px] font-black">
                          {q.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  Saved Wishlist Courses
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    CAMUS_COURSES[3],
                    CAMUS_COURSES[4]
                  ].map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl border border-slate-300 dark:border-gray-800 space-y-2">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{c.title}</h4>
                      <p className="text-xs text-slate-700">{c.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">${c.price}.00</span>
                        <button
                          onClick={() => {
                            const updated = [...enrolledIds, c.id];
                            setEnrolledIds(updated);
                            try { localStorage.setItem('camus_enrolled_courses', JSON.stringify(updated)); } catch {}
                            showToast(`Enrolled in "${c.title}" from Wishlist!`, 'success');
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700"
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  Your Course Reviews
                </h2>
                <div className="p-4 rounded-2xl border border-slate-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Complete Web Development Bootcamp</h4>
                    <span className="flex text-yellow-400">★★★★★</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 italic">
                    &ldquo;Outstanding instruction and practical code exercises that prepared me for production workflows.&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* TAB 7: LIVE STREAM CLASSES */}
            {activeTab === 'live-sessions' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <VideoCameraIcon className="w-6 h-6 text-red-600" />
                    Live Streaming Workshops
                  </h2>
                  <button
                    onClick={() => navigate('/live-streaming')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    Open Live Studio
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                      LIVE NOW
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-1">
                      WebRTC Live Studio Session with Instructor John Smith
                    </h3>
                    <p className="text-xs text-slate-700">Interactive code reviews and student Q&amp;A</p>
                  </div>
                  <button
                    onClick={() => navigate('/live-streaming')}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                  >
                    Join Live Broadcast
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-300 dark:border-slate-800 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => handleNavClick('enrolled')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 ${
            activeTab === 'enrolled' ? 'text-blue-600 font-bold' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <BookOpenIcon className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Courses</span>
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('certifications')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 ${
            activeTab === 'certifications' ? 'text-blue-600 font-bold' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Award className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] tracking-tight">Certs</span>
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('live-sessions')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 ${
            activeTab === 'live-sessions' ? 'text-blue-600 font-bold' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <VideoCameraIcon className="w-5 h-5 text-red-500" />
          <span className="text-[10px] tracking-tight">Live</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/camus')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 text-slate-700 dark:text-slate-300 hover:text-slate-900"
        >
          <AcademicCapIcon className="w-5 h-5 text-indigo-600" />
          <span className="text-[10px] tracking-tight">Catalog</span>
        </button>
      </div>
    </MainLayout>
  );
};

export default CamusDashboardPage;
