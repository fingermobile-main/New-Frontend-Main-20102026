import { useNavigate} from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { useAppContext } from "../contexts/AppContext";

import { useAuth } from '../contexts/AuthContext';
import {
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  MemberGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  VideoCameraIcon
} from '../icons';
import PageHeader from '../components/PageHeader';
import EnhancedFilterBar from '../components/shared/EnhancedFilterBar';

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  enrolledDate: string;
  dueDate?: string;
  thumbnail: string;
  category: string;
  rating: number;
  duration: string;
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  completed: boolean;
  submitted: boolean;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "live-session" | "deadline" | "exam";
}

const LmsPage: React.FC = () => {
  const { member } = useAuth();
  const navigate = useNavigate();
  const { courses, assignments, showToast } = useAppContext();

  const [myCourses, setMyCourses] = useState<Course[]> ([
    {
      id: "1",
      title: "Introduction to Digital Marketing",
      instructor: "Dr. Jane Smith",
      progress: 75,
      enrolledDate: "2024-09-15",
      dueDate: "2025-01-30",
      thumbnail: "/images/digital-marketing.jpg",
      category: "Marketing",
      rating: 4.8,
      duration: "8 weeks"
    },
    {
      id: "2",
      title: "Advanced JavaScript Concepts",
      instructor: "Prof. John Doe",
      progress: 45,
      enrolledDate: "2024-10-01",
      thumbnail: "/images/javascript.jpg",
      category: "Programming",
      rating: 4.9,
      duration: "10 weeks"
    },
    {
      id: "3",
      title: "Data Science Fundamentals",
      instructor: "Dr. Emily Johnson",
      progress: 20,
      enrolledDate: "2024-10-10",
      thumbnail: "/images/data-science.jpg",
      category: "Data Science",
      rating: 4.7,
      duration: "12 weeks"
    },
    {
      id: "4",
      title: "UI/UX Design Principles",
      instructor: "Michael Brown",
      progress: 100,
      enrolledDate: "2024-08-20",
      dueDate: "2024-12-15",
      thumbnail: "/images/ui-ux-design.jpg",
      category: "Design",
      rating: 4.6,
      duration: "6 weeks"
    }
  ]);

  const [filter, setFilter] = useState("");

  useEffect(() => {
    // Component logic
  }, []);

  const [myAssignments, setMyAssignments] = useState<Assignment[]> ([
    {
      id: "a1",
      title: "Marketing Strategy Analysis",
      course: "Digital Marketing",
      dueDate: "2025-01-20",
      completed: false,
      submitted: false
    },
    {
      id: "a2",
      title: "JavaScript DOM Manipulation",
      course: "Advanced JavaScript",
      dueDate: "2025-01-25",
      completed: false,
      submitted: false
    },
    {
      id: "a3",
      title: "Final Project Submission",
      course: "UI/UX Design",
      dueDate: "2024-12-15",
      completed: true,
      submitted: true
    }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]> ([
    {
      id: "e1",
      title: "Live Q&A Session: JavaScript Best Practices",
      date: "2025-01-15",
      time: "15:00 GMT",
      type: "live-session"
    },
    {
      id: "e2",
      title: "Assignment Deadline: Data Science Project",
      date: "2025-01-18",
      time: "23:59 GMT",
      type: "deadline"
    },
    {
      id: "e3",
      title: "Midterm Exam: Digital Marketing",
      date: "2025-01-22",
      time: "10:00 GMT",
      type: "exam"
    }
  ]);

  const [activeTab, setActiveTab] = useState<
    "courses" | "assignments" | "calendar"
  >("courses");

  const incompleteAssignments = myAssignments.filter(
    (a) => !a.completed && !a.submitted,
  );

  const stats = {
    totalCourses: myCourses.length,
    inProgress: myCourses.filter((c) => c.progress > 0 && c.progress < 100)
      .length,
    completed: myCourses.filter((c) => c.progress === 100).length,
    avgProgress:
      myCourses.reduce((sum, course) => sum + course.progress, 0) /
        myCourses.length || 0
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Learning Management System"
        description="Manage your courses, assignments, and track your educational progress"
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <BookOpenIcon className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalCourses}
              </p>
              <p className="text-sm text-gray-500">Total Courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {stats.avgProgress.toFixed(0)}%
              </p>
              <p className="text-sm text-gray-500">Avg Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <AcademicCapIcon className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {stats.inProgress}
              </p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <DocumentTextIcon className="w-8 h-8 text-indigo-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {incompleteAssignments.length}
              </p>
              <p className="text-sm text-gray-500">Pending Assignments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === "courses" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("courses")}
        >
          My Courses
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === "assignments" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("assignments")}
        >
          Assignments
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === "calendar" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          onClick={() => setActiveTab("calendar")}
        >
          Calendar
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "courses" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
            <button
              onClick={() => navigate("/camus/explore")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Browse More Courses
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                   />
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                    {course.category}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    by {course.instructor}
                  </p>

                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(course.rating) ? "fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-1">
                      {course.rating}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>
                      <ClockIcon className="w-4 h-4 inline mr-1" />{" "}
                      {course.duration}
                    </span>
                    <span>
                      {new Date(course.enrolledDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm font-medium"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigate(`/courses/${course.id}/continue`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "assignments" && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            My Assignments
          </h2>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Assignment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Course
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {assignment.course}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          assignment.submitted
                            ? "bg-green-100 text-green-800"
                            : assignment.completed
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {assignment.submitted
                          ? "Submitted"
                          : assignment.completed
                            ? "Completed"
                            : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          navigate(`/assignments/${assignment.id}`)
                        }
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {assignment.submitted ? "Review" : "Work On"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "calendar" && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Upcoming Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500"
              >
                <div className="flex items-start">
                  <div className="mr-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      {event.type === "live-session" && (
                        <VideoCameraIcon className="w-6 h-6 text-blue-600" />
                      )}
                      {event.type === "deadline" && (
                        <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                      )}
                      {event.type === "exam" && (
                        <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.date} at {event.time}
                    </p>
                    <button
                      onClick={() => navigate("/calendar")}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Add to Calendar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Learning Progress
            </h3>
            <div className="h-64 flex items-end space-x-2">
              {myCourses.slice(0, 6).map((course, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all"
                    style={{ height: `${course.progress}%` }}
                  ></div>
                  <span className="text-xs mt-2 text-gray-500 truncate w-full text-center">
                    {course.title.substring(0, 10)}..
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LmsPage;