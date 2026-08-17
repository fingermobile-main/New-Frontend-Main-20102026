import React, { useState, useEffect } from 'react';

interface Course {
  id: string;
  title: string;
  description?: string;
  students: number;
  revenue: number;
  rating: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
}

interface InstructorDashboardProps {
  courses?: Course[];
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ courses: propCourses }) => {
  const [courses, setCourses] = React.useState<Course[]>(propCourses || []);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'courses' | 'analytics'>('overview');

  // Mock data if no courses provided
  React.useEffect(() => {
    if (!propCourses || propCourses.length === 0) {
      setCourses([
        {
          id: '1',
          title: 'Introduction to Web Development',
          description: 'Learn the basics of HTML, CSS, and JavaScript',
          students: 245,
          revenue: 12250,
          rating: 4.8,
          status: 'published',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          title: 'Advanced React Patterns',
          description: 'Master advanced React concepts and patterns',
          students: 189,
          revenue: 9450,
          rating: 4.9,
          status: 'published',
          createdAt: '2024-02-20'
        }
      ]);
    }
  }, [propCourses]);

  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
  const totalRevenue = courses.reduce((sum, course) => sum + course.revenue, 0);
  const avgRating = courses.length > 0 
    ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-sm font-medium opacity-90">Total Students</h3>
              <p className="text-3xl font-bold mt-2">{totalStudents.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
              <p className="text-3xl font-bold mt-2">{totalRevenue.toLocaleString()} FIC</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-sm font-medium opacity-90">Average Rating</h3>
              <p className="text-3xl font-bold mt-2">⭐ {avgRating}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">New enrollment in "Introduction to Web Development"</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <span className="text-sm text-green-600 font-medium">+1 student</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Course review received</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
                <span className="text-sm text-yellow-600 font-medium">⭐ 5.0</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">My Courses</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {courses.map((course) => (
              <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>👥 {course.students} students</span>
                      <span>💰 {course.revenue.toLocaleString()} FIC</span>
                      <span>⭐ {course.rating}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status === 'published' ? 'bg-green-100 text-green-800' :
                    course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Analytics</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Enrollment Trends</h3>
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Chart coming soon</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Revenue Breakdown</h3>
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Chart coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-t border-gray-200 pt-4">
        {(['overview', 'courses', 'analytics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InstructorDashboard;
