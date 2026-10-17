import React, { useState } from 'react';
import {
  ChartBarIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  GiftIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  profileViews: number;
  likesReceived: number;
  messagesSent: number;
  messagesReceived: number;
  matches: number;
  giftsSent: number;
  giftsReceived: number;
  profileCompleteness: number;
  dailyActiveMinutes: number;
  avgResponseTime: number; // in minutes
}

const ProfileAnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [analytics] = useState<AnalyticsData>({
    profileViews: 1248,
    likesReceived: 342,
    messagesSent: 87,
    messagesReceived: 156,
    matches: 23,
    giftsSent: 12,
    giftsReceived: 8,
    profileCompleteness: 85,
    dailyActiveMinutes: 42,
    avgResponseTime: 120 // 2 hours
  });

  // Mock data for charts
  const engagementData = [
    { day: 'Mon', views: 120, likes: 32 },
    { day: 'Tue', views: 195, likes: 48 },
    { day: 'Wed', views: 180, likes: 38 },
    { day: 'Thu', views: 210, likes: 52 },
    { day: 'Fri', views: 250, likes: 65 },
    { day: 'Sat', views: 185, likes: 45 },
    { day: 'Sun', views: 160, likes: 35 },
  ];

  const matchesData = [
    { day: 'Mon', matches: 2 },
    { day: 'Tue', matches: 3 },
    { day: 'Wed', matches: 1 },
    { day: 'Thu', matches: 4 },
    { day: 'Fri', matches: 5 },
    { day: 'Sat', matches: 3 },
    { day: 'Sun', matches: 2 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Profile Analytics</h2>
            <p className="mt-1 text-sm text-slate-700">Track your engagement and performance metrics</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full border text-blue-950 border-blue-400 font-black">
                <EyeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.profileViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <HeartIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Likes Received</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.likesReceived.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-5 border border-purple-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full border text-purple-950 border-purple-400 font-black">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.messagesSent.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-5 border border-amber-100">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-full border text-amber-950 border-amber-400 font-black">
                <GiftIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Matches</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.matches.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Engagement Over Time</h3>
            <div className="flex items-center text-sm text-slate-700">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span>Profile Views</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>Likes</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-end h-40 gap-2">
              {engagementData.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="flex items-end justify-center w-full h-32 gap-1">
                    <div
                      className="w-8 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                      style={{ height: `${(day.views / 300) * 100}%` }}
                      title={`Views: ${day.views}`}
                    ></div>
                    <div
                      className="w-8 bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                      style={{ height: `${(day.likes / 80) * 100}%` }}
                      title={`Likes: ${day.likes}`}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-700 mt-2">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-slate-300 rounded-lg p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Profile Completeness</span>
                  <span className="font-medium">{analytics.profileCompleteness}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                    style={{ width: `${analytics.profileCompleteness}%` }}
                  ></div>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Daily Active Minutes</span>
                  <span className="font-medium">{analytics.dailyActiveMinutes} min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                    style={{ width: `${(analytics.dailyActiveMinutes / 120) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-lg p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Messaging Activity</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Messages Sent</span>
                <span className="font-medium">{analytics.messagesSent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Messages Received</span>
                <span className="font-medium">{analytics.messagesReceived}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Response Time</span>
                <span className="font-medium">{analytics.avgResponseTime} min</span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Response Rate</span>
                  <span className="font-medium">{Math.round((analytics.messagesSent / analytics.messagesReceived) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (analytics.messagesSent / analytics.messagesReceived) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Matches Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Matches Over Time</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-end h-32 gap-2">
              {matchesData.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full flex justify-center">
                    <div
                      className="w-8 bg-gradient-to-t from-rose-500 to-pink-600 rounded-t hover:opacity-90 transition-opacity"
                      style={{ height: `${(day.matches / 6) * 100}%` }}
                      title={`Matches: ${day.matches}`}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-700 mt-2">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
