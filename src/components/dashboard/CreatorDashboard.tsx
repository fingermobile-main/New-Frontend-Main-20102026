import React, { useEffect, useState } from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  EyeIcon,
  VideoCameraIcon,
  PhotoIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  PlusIcon,
  CalendarDaysIcon
} from '../../components/icons';
import * as creatorService from '../../services/creatorService';

// Define TypeScript interfaces
interface CreatorMetric {
  id: string;
  name: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

interface CreatorContentPerformance {
  id: string;
  title: string;
  thumbnail: 'video' | 'photo' | 'document';
  likes: number;
  comments: number;
  views: number;
  engagement: number;
}

interface CreatorScheduledContent {
  id: string;
  title: string;
  date: string;
  type: string;
}

interface CreatorDetailedMetric {
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  watch: string;
  rate: string;
}

interface CreatorAgeDistribution {
  range: string;
  members: string;
  percentage: number;
}

interface CreatorTopInterest {
  interest: string;
  percentage: number;
}

interface CreatorGeographicReach {
  country: string;
  reach: number;
}

interface CreatorEarnings {
  totalEarnings: string;
  contentRevenue: string;
  affiliateEarnings: string;
  revenueBySource: Array<{
    source: string;
    amount: string;
    percentage: number;
    color: string;
  }>;
  topPerforming: Array<{
    content: string;
    revenue: string;
    change: number;
  }>;
}

interface CreatorBestPostingTime {
  day: string;
  time: string;
  engagement: 'Very High' | 'High' | 'Medium' | 'Low';
}

const CreatorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [creatorMetrics, setCreatorMetrics] = useState<CreatorMetric[]>([]);
  const [contentPerformance, setContentPerformance] = useState<CreatorContentPerformance[]>([]);
  const [scheduledContent, setScheduledContent] = useState<CreatorScheduledContent[]>([]);
  const [detailedMetrics, setDetailedMetrics] = useState<CreatorDetailedMetric[]>([]);
  const [ageDistribution, setAgeDistribution] = useState<CreatorAgeDistribution[]>([]);
  const [genderSplit, setGenderSplit] = useState<{ male: number; female: number }>({ male: 55, female: 45 });
  const [topInterests, setTopInterests] = useState<CreatorTopInterest[]>([]);
  const [geographicReach, setGeographicReach] = useState<CreatorGeographicReach[]>([]);
  const [earnings, setEarnings] = useState<CreatorEarnings | null>(null);
  const [bestPostingTimes, setBestPostingTimes] = useState<CreatorBestPostingTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [timeRange, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        // Mock data for demonstration
        setCreatorMetrics([
          { id: '1', name: 'Total Views', value: '124.5K', change: 12.5, icon: 'EyeIcon', color: 'bg-blue-500' },
          { id: '2', name: 'Total Likes', value: '24.8K', change: 8.3, icon: 'HeartIcon', color: 'bg-red-500' },
          { id: '3', name: 'Total Comments', value: '5.2K', change: 15.2, icon: 'ChatBubbleLeftRightIcon', color: 'bg-green-500' },
          { id: '4', name: 'Total Shares', value: '3.7K', change: -2.1, icon: 'ShareIcon', color: 'bg-purple-500' }
        ]);

        setContentPerformance([
          { id: '1', title: 'New Product Launch', thumbnail: 'video', likes: 1240, comments: 89, views: 12400, engagement: 12.4 },
          { id: '2', title: 'Behind the Scenes', thumbnail: 'video', likes: 890, comments: 45, views: 8900, engagement: 9.8 },
          { id: '3', title: 'Tutorial Guide', thumbnail: 'document', likes: 2100, comments: 120, views: 15600, engagement: 18.2 }
        ]);

        setScheduledContent([
          { id: '1', title: 'Weekly Recap', date: '2023-06-15', type: 'Video' },
          { id: '2', title: 'Product Demo', date: '2023-06-18', type: 'Image' },
          { id: '3', title: 'Q&A Session', date: '2023-06-20', type: 'Live' }
        ]);
      } else if (activeTab === 'analytics') {
        // Mock detailed metrics
        setDetailedMetrics([
          { id: '1', title: 'Product Launch Video', views: 12400, likes: 1240, comments: 89, shares: 45, watch: '4m 22s', rate: '12.4%' },
          { id: '2', title: 'Tutorial Series', views: 8900, likes: 890, comments: 45, shares: 23, watch: '8m 15s', rate: '9.8%' },
          { id: '3', title: 'Behind the Scenes', views: 15600, likes: 2100, comments: 120, shares: 67, watch: '3m 45s', rate: '18.2%' }
        ]);
      } else if (activeTab === 'audience') {
        // Mock audience data
        setAgeDistribution([
          { range: '13-17', members: '1.2K', percentage: 15 },
          { range: '18-24', members: '4.5K', percentage: 45 },
          { range: '25-34', members: '2.8K', percentage: 28 },
          { range: '35-44', members: '0.8K', percentage: 8 },
          { range: '45+', members: '0.4K', percentage: 4 }
        ]);

        setTopInterests([
          { interest: 'Technology', percentage: 32 },
          { interest: 'Gaming', percentage: 28 },
          { interest: 'Music', percentage: 22 },
          { interest: 'Sports', percentage: 12 },
          { interest: 'Fashion', percentage: 6 }
        ]);

        setGeographicReach([
          { country: 'United States', reach: 42 },
          { country: 'Canada', reach: 18 },
          { country: 'United Kingdom', reach: 15 },
          { country: 'Australia', reach: 12 },
          { country: 'Germany', reach: 13 }
        ]);
      } else if (activeTab === 'monetization') {
        // Mock earnings data
        setEarnings({
          totalEarnings: '$12,450.00',
          contentRevenue: '$8,230.00',
          affiliateEarnings: '$4,220.00',
          revenueBySource: [
            { source: 'Ad Revenue', amount: '$5,420', percentage: 44, color: 'bg-blue-500' },
            { source: 'Sponsorships', amount: '$3,810', percentage: 31, color: 'bg-green-500' },
            { source: 'Affiliate', amount: '$2,220', percentage: 18, color: 'bg-purple-500' },
            { source: 'Merchandise', amount: '$1,000', percentage: 7, color: 'bg-yellow-500' }
          ],
          topPerforming: [
            { content: 'Product Launch', revenue: '$2,450', change: 24.5 },
            { content: 'Tutorial Series', revenue: '$1,890', change: 18.2 },
            { content: 'Review Video', revenue: '$1,650', change: 12.8 }
          ]
        });
      } else if (activeTab === 'schedule') {
        // Mock scheduled content and best times
        setScheduledContent([
          { id: '1', title: 'Weekly Recap', date: '2023-06-15', type: 'Video' },
          { id: '2', title: 'Product Demo', date: '2023-06-18', type: 'Image' },
          { id: '3', title: 'Q&A Session', date: '2023-06-20', type: 'Live' }
        ]);

        setBestPostingTimes([
          { day: 'Monday', time: '9:00 AM', engagement: 'Very High' },
          { day: 'Wednesday', time: '2:00 PM', engagement: 'High' },
          { day: 'Friday', time: '7:00 PM', engagement: 'Medium' },
          { day: 'Sunday', time: '11:00 AM', engagement: 'High' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
    case 'EyeIcon':
      return <EyeIcon className="w-6 h-6" />;
    case 'HeartIcon':
      return <HeartIcon className="w-6 h-6" />;
    case 'ChatBubbleLeftRightIcon':
      return <ChatBubbleLeftRightIcon className="w-6 h-6" />;
    case 'ShareIcon':
      return <ShareIcon className="w-6 h-6" />;
    case 'CurrencyDollarIcon':
      return <CurrencyDollarIcon className="w-6 h-6" />;
    case 'ArrowTrendingUpIcon':
    case 'TrendingUpIcon':  // Same icon for both names to maintain compatibility
      return <ArrowTrendingUpIcon className="w-6 h-6" />;
    case 'VideoCameraIcon':
      return <VideoCameraIcon className="w-6 h-6" />;
    case 'PhotoIcon':
      return <PhotoIcon className="w-6 h-6" />;
    case 'DocumentTextIcon':
      return <DocumentTextIcon className="w-6 h-6" />;
    default:
      return <ChartBarIcon className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border border-slate-300 dark:border-gray-700 overflow-hidden p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border border-slate-300 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-slate-300 dark:border-gray-700">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Creator Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">Manage your content, audience, and earnings</p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 mt-4 sm:mt-0">
          <select
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold border-slate-300"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white">
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Content
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-slate-300 dark:border-gray-700">
        {[
          { id: 'overview', name: 'Overview', icon: <ChartBarIcon className="w-4 h-4" /> },
          { id: 'content', name: 'Content Studio', icon: <VideoCameraIcon className="w-4 h-4" /> },
          { id: 'analytics', name: 'Analytics', icon: <ArrowTrendingUpIcon className="w-4 h-4" /> },
          { id: 'audience', name: 'Audience', icon: <UserGroupIcon className="w-4 h-4" /> },
          { id: 'monetization', name: 'Earnings', icon: <CurrencyDollarIcon className="w-4 h-4" /> },
          { id: 'schedule', name: 'Scheduler', icon: <CalendarDaysIcon className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span className="ml-2">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Dashboard Content */}
      <div className="p-4 sm:p-6">
        {activeTab === 'overview' && (
          <div>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {creatorMetrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{metric.name}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
                      <p className={`text-sm mt-2 flex items-center ${
                        metric.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
                      </p>
                    </div>
                    <div className={`${metric.color} p-3 rounded-lg text-white`}>
                      {getIconComponent(metric.icon)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Performance and Scheduled Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top Performing Content */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Top Performing Content</h3>
                  <button className="text-sm text-blue-600 dark:text-blue-400">View All</button>
                </div>
                <div className="space-y-4">
                  {contentPerformance.map((content) => (
                    <div key={content.id} className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                        {content.thumbnail === 'video' ? (
                          <VideoCameraIcon className="w-6 h-6 text-gray-600 dark:text-slate-500" />
                        ) : content.thumbnail === 'photo' ? (
                          <PhotoIcon className="w-6 h-6 text-gray-600 dark:text-slate-500" />
                        ) : (
                          <DocumentTextIcon className="w-6 h-6 text-gray-600 dark:text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{content.title}</div>
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                          <span className="flex items-center mr-3">
                            <HeartIcon className="w-3 h-3 mr-1" />
                            {content.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center mr-3">
                            <ChatBubbleLeftRightIcon className="w-3 h-3 mr-1" />
                            {content.comments.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <EyeIcon className="w-3 h-3 mr-1" />
                            {content.views.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{content.engagement}%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Engagement</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scheduled Content */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Scheduled Content</h3>
                  <button className="text-sm text-blue-600 dark:text-blue-400">View All</button>
                </div>
                <div className="space-y-4">
                  {scheduledContent.map((content) => (
                    <div key={content.id} className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <div className="font-medium text-sm">{content.title}</div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-gray-600 dark:text-gray-400">{content.date}</div>
                        <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                          {content.type}
                        </span>
                      </div>
                    </div>
                  ))}

                  <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-gray-300 flex items-center justify-center">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Schedule New Content
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Performance Overview</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm">
                    1D
                  </button>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white">
                    1W
                  </button>
                  <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm">
                    1M
                  </button>
                </div>
              </div>
              <div className="h-64 flex items-end space-x-2">
                {[45, 65, 30, 75, 50, 80, 55, 90, 40, 70, 60, 85].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                      style={{ height: `${value}%` }}
                    ></div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index % 7]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Content Studio</h3>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium">
                  Import Media
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create New
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white dark:bg-gray-800 rounded-xl border border-slate-300 dark:border-gray-700 overflow-hidden">
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {item % 3 === 1 ? (
                      <PhotoIcon className="w-10 h-10 text-gray-500" />
                    ) : item % 3 === 2 ? (
                      <VideoCameraIcon className="w-10 h-10 text-gray-500" />
                    ) : (
                      <DocumentTextIcon className="w-10 h-10 text-gray-500" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Content Item #{item}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Created 2 days ago</div>
                      </div>
                      <div className="flex space-x-1">
                        <button className="p-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg">
                          <HeartIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg" aria-label="Button"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <HeartIcon className="w-4 h-4 mr-1" />
                      <span>1.2K likes</span>
                      <ChatBubbleLeftRightIcon className="w-4 h-4 ml-3 mr-1" />
                      <span>87 comments</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Content Analytics</h3>
              <div className="flex space-x-2">
                <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold border-slate-300">
                  <option>By Content Type</option>
                  <option>By Date</option>
                  <option>By Engagement</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white">
                  Export Report
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                <h4 className="font-bold mb-4">Engagement Over Time</h4>
                <div className="h-64 flex items-end space-x-2">
                  {[45, 65, 30, 75, 50, 80, 55, 90, 40, 70, 60, 85].map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                        style={{ height: `${value}%` }}
                      ></div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                <h4 className="font-bold mb-4">Content Type Performance</h4>
                <div className="h-64 flex items-end space-x-2">
                  {[30, 50, 45, 65, 40, 75, 55, 80, 35, 60, 50, 70].map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                        style={{ height: `${value}%` }}
                      ></div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index % 7]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
              <h4 className="font-bold mb-6">Detailed Metrics</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-300 dark:border-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Content</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Views</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Likes</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Comments</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Shares</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Watch Time</th>
                      <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium text-sm">Engagement Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedMetrics.map((content) => (
                      <tr key={content.id} className="border-b border-slate-300 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/30">
                        <td className="py-3 px-4">
                          <div className="font-medium text-sm">{content.title}</div>
                        </td>
                        <td className="py-3 px-4 text-sm">{content.views}</td>
                        <td className="py-3 px-4 text-sm">{content.likes}</td>
                        <td className="py-3 px-4 text-sm">{content.comments}</td>
                        <td className="py-3 px-4 text-sm">{content.shares}</td>
                        <td className="py-3 px-4 text-sm">{content.watch}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-sm">{content.rate}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audience' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Audience Insights</h3>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white">
                Export Data
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                <h4 className="font-bold mb-4">Age Distribution</h4>
                <div className="space-y-3">
                  {ageDistribution.map((age, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{age.range}</span>
                        <span className="font-medium">{age.members}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${age.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {age.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                <h4 className="font-bold mb-4">Gender Split</h4>
                <div className="flex items-center justify-center h-40">
                  <div className="relative w-32 h-32 rounded-full border-4 border-blue-500">
                    <div className="absolute inset-0 rounded-full border-4 border-pink-500" style={{clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)'}}></div>
                    <div className="absolute inset-4 flex items-center justify-center">
                      <span className="text-lg font-bold">{genderSplit.male}%/{genderSplit.female}%</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{genderSplit.male}%</div>
                    <div className="text-sm">Male</div>
                  </div>
                  <div className="text-center p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">{genderSplit.female}%</div>
                    <div className="text-sm">Female</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                <h4 className="font-bold mb-4">Top Interests</h4>
                <div className="space-y-3">
                  {topInterests.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.interest}</span>
                        <span className="font-medium">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
              <h4 className="font-bold mb-6">Geographic Reach</h4>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">Interactive world map visualization</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monetization' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Earnings Dashboard</h3>
              <div className="flex space-x-2">
                <select
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold border-slate-300"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white">
                  Withdraw Earnings
                </button>
              </div>
            </div>

            {earnings && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Total Earnings</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{earnings.totalEarnings}</p>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">↑ 15.2% from last period</p>
                      </div>
                      <div className="p-3 bg-yellow-500 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Content Revenue</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{earnings.contentRevenue}</p>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">↑ 12.7% from last period</p>
                      </div>
                      <div className="p-3 bg-blue-500 rounded-lg">
                        <VideoCameraIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Affiliate Earnings</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{earnings.affiliateEarnings}</p>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">↑ 21.3% from last period</p>
                      </div>
                      <div className="p-3 bg-purple-500 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                  <h4 className="font-bold mb-6">Earnings Sources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium">By Revenue Source</h5>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</div>
                      </div>
                      <div className="space-y-4">
                        {earnings.revenueBySource.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{item.source}</span>
                              <span className="font-medium">{item.amount}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${item.color}`}
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium">Top Performing</h5>
                        <div className="text-sm text-gray-600 dark:text-gray-400">By content</div>
                      </div>
                      <div className="space-y-3">
                        {earnings.topPerforming.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                            <div>
                              <div className="font-medium">{item.content}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{item.revenue}</div>
                              <div className="text-xs text-green-600">+{item.change}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Content Scheduler</h3>
              <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white">
                <PlusIcon className="w-4 h-4 mr-2" />
                Schedule New Content
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                <h4 className="font-bold mb-4">Calendar View</h4>
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <CalendarDaysIcon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Interactive calendar with scheduled content</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                  <h4 className="font-bold mb-4">Scheduled Content</h4>
                  <div className="space-y-3">
                    {scheduledContent.map((content) => (
                      <div key={content.id} className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="font-medium text-sm">{content.title}</div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-xs text-gray-600 dark:text-gray-400">{content.date}</div>
                          <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                            {content.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-slate-300 dark:border-gray-700">
                  <h4 className="font-bold mb-4">Best Posting Times</h4>
                  <div className="space-y-3">
                    {bestPostingTimes.map((time, index) => (
                      <div key={index} className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="font-medium text-sm">{time.day}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{time.time}</div>
                        <div className="text-xs mt-2">
                          <span className={`px-2 py-1 rounded-full ${
                            time.engagement === 'Very High'
                              ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                              : time.engagement === 'High'
                                ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                                : time.engagement === 'Medium'
                                  ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                                  : 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
                          }`}>
                            {time.engagement} Engagement
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;
