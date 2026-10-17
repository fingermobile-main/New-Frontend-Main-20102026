import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Activity, 
  DollarSign, 
  Calendar, 
  Download,
  Filter,
  PieChart,
  LineChart,
  Grid3X3,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AnalyticsDataPoint {
  date: string;
  value: number;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {change} from last period
        </p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'content' | 'revenue' | 'historical'>('overview');
  const [dateRange, setDateRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  const navigate = useNavigate();
  const history = { push: (path: string) => navigate(path), replace: (path: string) => navigate(path, { replace: true }) };

  // Simulate loading analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        setAnalyticsData({
          platform: {
            users: {
              activeDaily: 1250,
              activeWeekly: 8750,
              activeMonthly: 25000,
              totalUsers: 150000,
              newUsersToday: 45,
              newUsersThisWeek: 320,
              newUsersThisMonth: 1200
            },
            engagement: {
              avgSessionDuration: '4m 32s',
              pagesPerSession: 3.2,
              bounceRate: '32.5%',
              returnVisitorRate: '68%'
            },
            content: {
              totalPosts: 50000,
              postsToday: 120,
              totalComments: 125000,
              commentsToday: 350,
              totalLikes: 2500000,
              likesToday: 8500
            },
            revenue: {
              today: 1250.75,
              thisWeek: 8750.25,
              thisMonth: 25000.00,
              thisYear: 300000.00
            }
          },
          engagement: {
            overall: {
              totalSessions: 12500,
              avgSessionDuration: '4m 32s',
              pagesPerSession: 3.2,
              bounceRate: '32.5%',
              returnVisitorRate: '68%'
            },
            byDevice: [
              { device: 'Desktop', percentage: 45.2 },
              { device: 'Mobile', percentage: 42.1 },
              { device: 'Tablet', percentage: 12.7 }
            ],
            byBrowser: [
              { browser: 'Chrome', percentage: 62.3 },
              { browser: 'Safari', percentage: 18.7 },
              { browser: 'Firefox', percentage: 10.2 },
              { browser: 'Edge', percentage: 5.8 },
              { browser: 'Others', percentage: 3.0 }
            ],
            bySource: [
              { source: 'Direct', percentage: 35.2 },
              { source: 'Organic Search', percentage: 28.7 },
              { source: 'Social Media', percentage: 22.1 },
              { source: 'Referral', percentage: 10.5 },
              { source: 'Email', percentage: 3.5 }
            ],
            retention: {
              day1: 68.2,
              day7: 45.6,
              day30: 28.3
            }
          },
          content: {
            overview: {
              totalContent: 50000,
              publishedToday: 120,
              totalViews: 2500000,
              viewsToday: 12500,
              totalShares: 350000,
              sharesToday: 1750,
              averageEngagement: 4.2
            },
            byCategory: [
              { category: 'News', count: 8500, views: 850000, engagement: 3.8 },
              { category: 'Blog', count: 12000, views: 750000, engagement: 4.5 },
              { category: 'Tutorial', count: 6500, views: 600000, engagement: 5.1 },
              { category: 'Review', count: 5500, views: 300000, engagement: 3.2 }
            ],
            topPerforming: [
              { id: 1, title: 'Top Performing Article 1', views: 12500, engagement: 6.2 },
              { id: 2, title: 'Top Performing Article 2', views: 11800, engagement: 5.8 },
              { id: 3, title: 'Top Performing Article 3', views: 10950, engagement: 5.5 }
            ],
            trends: [
              { date: '2024-10-01', views: 12500 },
              { date: '2024-10-02', views: 13200 },
              { date: '2024-10-03', views: 11800 },
              { date: '2024-10-04', views: 14500 },
              { date: '2024-10-05', views: 13800 },
              { date: '2024-10-06', views: 15200 },
              { date: '2024-10-07', views: 14900 }
            ]
          },
          revenue: {
            overview: {
              totalRevenue: 250000,
              revenueToday: 1250.75,
              revenueThisWeek: 8750.25,
              revenueThisMonth: 25000.00,
              revenueThisYear: 300000.00,
              transactionsToday: 45,
              avgOrderValue: 27.85
            },
            bySource: [
              { source: 'Subscriptions', amount: 150000, percentage: 60 },
              { source: 'E-commerce', amount: 75000, percentage: 30 },
              { source: 'Advertising', amount: 25000, percentage: 10 }
            ],
            byProduct: [
              { product: 'Premium Membership', amount: 100000, units: 2000 },
              { product: 'Basic Membership', amount: 50000, units: 5000 },
              { product: 'Merchandise', amount: 75000, units: 3000 }
            ],
            trends: [
              { date: '2024-10-01', revenue: 1250.75 },
              { date: '2024-10-02', revenue: 1320.50 },
              { date: '2024-10-03', revenue: 1180.25 },
              { date: '2024-10-04', revenue: 1450.00 },
              { date: '2024-10-05', revenue: 1380.75 },
              { date: '2024-10-06', revenue: 1520.25 },
              { date: '2024-10-07', revenue: 1490.50 }
            ]
          }
        });
        setLoading(false);
      }, 1000);
    };

    fetchAnalytics();
  }, [dateRange]);

  // Sample chart data
  const platformTrendsData: AnalyticsDataPoint[] = [
    { date: 'Oct 1', value: 1200 },
    { date: 'Oct 2', value: 1350 },
    { date: 'Oct 3', value: 1180 },
    { date: 'Oct 4', value: 1420 },
    { date: 'Oct 5', value: 1580 },
    { date: 'Oct 6', value: 1620 },
    { date: 'Oct 7', value: 1490 },
    { date: 'Oct 8', value: 1550 },
    { date: 'Oct 9', value: 1680 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">Analytics Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="year">This year</option>
              </select>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                <Download className="h-4 w-4 mr-1" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-slate-300 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('engagement')}
              className={`${
                activeTab === 'engagement'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Activity className="h-4 w-4 mr-2" />
              User Engagement
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Eye className="h-4 w-4 mr-2" />
              Content Performance
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`${
                activeTab === 'revenue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Revenue
            </button>
            <button
              onClick={() => setActiveTab('historical')}
              className={`${
                activeTab === 'historical'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Clock className="h-4 w-4 mr-2" />
              Historical Data
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && analyticsData && (
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard
                    title="Active Users Today"
                    value={analyticsData.platform.users.activeDaily}
                    change="+12.4%"
                    icon={<Users className="h-6 w-6 text-white" />}
                    color="bg-blue-500"
                  />
                  <MetricCard
                    title="Total Revenue"
                    value={`$${analyticsData.platform.revenue.thisMonth.toLocaleString()}`}
                    change="+8.2%"
                    icon={<DollarSign className="h-6 w-6 text-white" />}
                    color="bg-green-500"
                  />
                  <MetricCard
                    title="Avg. Session Duration"
                    value={analyticsData.platform.engagement.avgSessionDuration}
                    change="+5.3%"
                    icon={<Clock className="h-6 w-6 text-white" />}
                    color="bg-purple-500"
                  />
                  <MetricCard
                    title="Content Published"
                    value={analyticsData.platform.content.postsToday}
                    change="+15.7%"
                    icon={<Eye className="h-6 w-6 text-white" />}
                    color="bg-yellow-500"
                  />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Growth</h3>
                    <div className="h-64 flex items-center justify-center">
                      <LineChart className="h-16 w-16 text-slate-700" />
                      <p className="ml-4 text-gray-500">Growth chart visualization would appear here</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">User Acquisition Sources</h3>
                    <div className="h-64 flex items-center justify-center">
                      <PieChart className="h-16 w-16 text-slate-700" />
                      <p className="ml-4 text-gray-500">User acquisition pie chart would appear here</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            IP Address
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">John Doe</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">Created new post</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            10 mins ago
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            192.168.1.1
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">Purchased premium</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            25 mins ago
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            192.168.1.2
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">Bob Johnson</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">Updated profile</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            1 hour ago
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            192.168.1.3
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Engagement Tab */}
            {activeTab === 'engagement' && analyticsData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Overview</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Total Sessions</span>
                        <span className="font-medium">{analyticsData.engagement.overall.totalSessions.toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Avg. Session Duration</span>
                        <span className="font-medium">{analyticsData.engagement.overall.avgSessionDuration}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Pages Per Session</span>
                        <span className="font-medium">{analyticsData.engagement.overall.pagesPerSession}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Bounce Rate</span>
                        <span className="font-medium">{analyticsData.engagement.overall.bounceRate}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Return Visitor Rate</span>
                        <span className="font-medium">{analyticsData.engagement.overall.returnVisitorRate}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">By Device</h3>
                    <div className="space-y-4">
                      {analyticsData.engagement.byDevice.map((device: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{device.device}</span>
                            <span className="text-sm font-medium text-gray-700">{device.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${device.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">By Browser</h3>
                    <div className="space-y-4">
                      {analyticsData.engagement.byBrowser.map((browser: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{browser.browser}</span>
                            <span className="text-sm font-medium text-gray-700">{browser.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${browser.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Retention</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{analyticsData.engagement.retention.day1}%</p>
                      <p className="text-sm text-gray-600">Day 1</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{analyticsData.engagement.retention.day7}%</p>
                      <p className="text-sm text-gray-600">Day 7</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{analyticsData.engagement.retention.day30}%</p>
                      <p className="text-sm text-gray-600">Day 30</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && analyticsData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard
                    title="Total Content"
                    value={analyticsData.content.overview.totalContent.toLocaleString()}
                    change="+3.2%"
                    icon={<Eye className="h-6 w-6 text-white" />}
                    color="bg-blue-500"
                  />
                  <MetricCard
                    title="Published Today"
                    value={analyticsData.content.overview.publishedToday}
                    change="+12.1%"
                    icon={<TrendingUp className="h-6 w-6 text-white" />}
                    color="bg-green-500"
                  />
                  <MetricCard
                    title="Total Views"
                    value={analyticsData.content.overview.totalViews.toLocaleString()}
                    change="+8.5%"
                    icon={<Eye className="h-6 w-6 text-white" />}
                    color="bg-purple-500"
                  />
                  <MetricCard
                    title="Average Engagement"
                    value={analyticsData.content.overview.averageEngagement}
                    change="+2.3%"
                    icon={<Activity className="h-6 w-6 text-white" />}
                    color="bg-yellow-500"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Content Performance by Category</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Count
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Views
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Engagement
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analyticsData.content.byCategory.map((cat: any, index: number) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {cat.category}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {cat.count.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {cat.views.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {cat.engagement}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Content</h3>
                    <div className="space-y-4">
                      {analyticsData.content.topPerforming.map((content: any, index: number) => (
                        <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{content.title}</p>
                            <p className="text-sm text-gray-500">{content.views.toLocaleString()} views</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{content.engagement} engagement</p>
                            <p className="text-sm text-gray-500">#{index + 1}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Content Views Trend</h3>
                  <div className="h-64 flex items-center justify-center">
                    <LineChart className="h-16 w-16 text-slate-700" />
                    <p className="ml-4 text-gray-500">Content views trend chart would appear here</p>
                  </div>
                </div>
              </div>
            )}

            {/* Revenue Tab */}
            {activeTab === 'revenue' && analyticsData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard
                    title="Total Revenue"
                    value={`$${analyticsData.revenue.overview.totalRevenue.toLocaleString()}`}
                    change="+12.4%"
                    icon={<DollarSign className="h-6 w-6 text-white" />}
                    color="bg-green-500"
                  />
                  <MetricCard
                    title="Revenue Today"
                    value={`$${analyticsData.revenue.overview.revenueToday}`}
                    change="+8.7%"
                    icon={<TrendingUp className="h-6 w-6 text-white" />}
                    color="bg-blue-500"
                  />
                  <MetricCard
                    title="Avg. Order Value"
                    value={`$${analyticsData.revenue.overview.avgOrderValue}`}
                    change="+3.2%"
                    icon={<DollarSign className="h-6 w-6 text-white" />}
                    color="bg-purple-500"
                  />
                  <MetricCard
                    title="Transactions Today"
                    value={analyticsData.revenue.overview.transactionsToday}
                    change="+15.6%"
                    icon={<Activity className="h-6 w-6 text-white" />}
                    color="bg-yellow-500"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Source</h3>
                    <div className="space-y-4">
                      {analyticsData.revenue.bySource.map((source: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{source.source}</span>
                            <span className="text-sm font-medium text-gray-700">${source.amount.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${source.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Product</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Units Sold
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analyticsData.revenue.byProduct.map((product: any, index: number) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {product.product}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${product.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.units.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
                  <div className="h-64 flex items-center justify-center">
                    <LineChart className="h-16 w-16 text-slate-700" />
                    <p className="ml-4 text-gray-500">Revenue trend chart would appear here</p>
                  </div>
                </div>
              </div>
            )}

            {/* Historical Tab */}
            {activeTab === 'historical' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Historical Analytics Data</h3>
                  <div className="h-96 flex items-center justify-center">
                    <LineChart className="h-16 w-16 text-slate-700" />
                    <p className="ml-4 text-gray-500">Historical data visualization would appear here</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Export Options</h4>
                    <p className="text-sm text-gray-600 mb-4">Download analytics data in various formats</p>
                    <div className="flex space-x-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        CSV
                      </button>
                      <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                        Excel
                      </button>
                      <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm">
                        PDF
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Time Range</h4>
                    <p className="text-sm text-gray-600 mb-4">Select time period for historical data</p>
                    <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2">
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>Last 6 months</option>
                      <option>Last year</option>
                      <option>Custom range</option>
                    </select>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Data Points</h4>
                    <p className="text-sm text-gray-600 mb-4">Available metrics for historical analysis</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• User activity</li>
                      <li>• Content performance</li>
                      <li>• Revenue trends</li>
                      <li>• Engagement metrics</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AnalyticsPage;