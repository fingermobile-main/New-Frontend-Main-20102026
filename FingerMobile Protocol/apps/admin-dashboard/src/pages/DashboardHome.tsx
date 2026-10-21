import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { 
  User, 
  Eye, 
  DollarSign, 
  AlertTriangle 
} from 'lucide-react';
import AnalyticsService from '../services/AnalyticsService';
import ReportService from '../services/ReportService';


interface RecentActivity {
  id: string;
  user: string;
  action: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
}

interface ReportSummary {
  id: string;
  reporter: string;
  reportedUser: string;
  type: string;
  status: string;
  createdAt: string;
}

const DashboardHome: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [recentReports, setRecentReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data
        const [stats, reports] = await Promise.all([
          AnalyticsService.getDashboardStats(),
          ReportService.getReports({ limit: 5 })
        ]);

        setDashboardStats(stats);
        
        // Mock recent activities - in a real app, this would come from an API
        setRecentActivities([
          { id: '1', user: 'John Doe', action: 'Created new user account', time: '2 mins ago', status: 'completed' },
          { id: '2', user: 'Jane Smith', action: 'Updated product inventory', time: '15 mins ago', status: 'completed' },
          { id: '3', user: 'Mike Johnson', action: 'Processed payment', time: '1 hour ago', status: 'completed' },
          { id: '4', user: 'Sarah Williams', action: 'Submitted support ticket', time: '2 hours ago', status: 'pending' },
          { id: '5', user: 'Robert Brown', action: 'Failed login attempt', time: '3 hours ago', status: 'failed' },
        ]);

        // Format reports for display
        setRecentReports(
          reports.data.map((report: any) => ({
            id: report.id,
            reporter: report.reporterUser?.username || 'Unknown',
            reportedUser: report.reportedUser?.username || 'Unknown',
            type: report.type,
            status: report.status,
            createdAt: new Date(report.createdAt).toLocaleDateString()
          }))
        );
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activityColumns = [
    { key: 'user' as keyof RecentActivity, label: 'User' },
    { key: 'action' as keyof RecentActivity, label: 'Action' },
    { key: 'time' as keyof RecentActivity, label: 'Time' },
    { 
      key: 'status' as keyof RecentActivity, 
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'completed' 
            ? 'bg-green-100 text-green-950'
            : value === 'pending' 
              ? 'bg-yellow-100 text-green-950'
              : 'bg-red-100 text-green-950'
        }border border-green-400 font-black`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    }
  ];

  const reportColumns = [
    { key: 'reporter' as keyof ReportSummary, label: 'Reporter' },
    { key: 'reportedUser' as keyof ReportSummary, label: 'Reported User' },
    { key: 'type' as keyof ReportSummary, label: 'Type' },
    { key: 'status' as keyof ReportSummary, label: 'Status' },
    { key: 'createdAt' as keyof ReportSummary, label: 'Date' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white shadow rounded-lg p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4 mb-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex-1 h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4 mb-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex-1 h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={dashboardStats?.totalUsers || 0}
          change="+12%"
          trend="up"
          description="Compared to last month"
          icon={<User className="h-8 w-8 text-blue-500" />}
        />
        <MetricCard
          title="Daily Active Users"
          value={dashboardStats?.dailyActiveUsers || 0}
          change="+5%"
          trend="up"
          description="Users active today"
          icon={<Eye className="h-8 w-8 text-green-500" />}
        />
        <MetricCard
          title="Total Revenue"
          value={`$${(dashboardStats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change="+8%"
          trend="up"
          description="Monthly recurring revenue"
          icon={<DollarSign className="h-8 w-8 text-purple-500" />}
        />
        <MetricCard
          title="Pending Reports"
          value={dashboardStats?.totalReports || 0}
          change="-3%"
          trend="down"
          description="Moderation queue"
          icon={<AlertTriangle className="h-8 w-8 text-yellow-500" />}
        />
      </div>

      {/* Recent Activity and Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card title="Recent Activity">
            <DataTable
              columns={activityColumns}
              data={recentActivities}
              isLoading={false}
              emptyMessage="No recent activities"
            />
          </Card>
        </div>
        <div>
          <Card title="Recent Reports">
            <DataTable
              columns={reportColumns}
              data={recentReports}
              isLoading={false}
              emptyMessage="No recent reports"
            />
          </Card>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Content Stats">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Posts</span>
              <span className="font-medium">{dashboardStats?.totalPosts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Comments</span>
              <span className="font-medium">{dashboardStats?.totalComments || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">New Today</span>
              <span className="font-medium">{dashboardStats?.newPostsToday || 0}</span>
            </div>
            <div className="pt-2">
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200">
                View Content Analytics
              </button>
            </div>
          </div>
        </Card>
        <Card title="User Growth">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">New Users Today</span>
              <span className="font-medium">{dashboardStats?.newUsersToday || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weekly Active</span>
              <span className="font-medium">{dashboardStats?.weeklyActiveUsers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Active</span>
              <span className="font-medium">{dashboardStats?.monthlyActiveUsers || 0}</span>
            </div>
            <div className="pt-2">
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200">
                View User Analytics
              </button>
            </div>
          </div>
        </Card>
        <Card title="Monetization">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Subscriptions</span>
              <span className="font-medium">{dashboardStats?.activeSubscriptions || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-medium">4.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Churn Rate</span>
              <span className="font-medium">1.8%</span>
            </div>
            <div className="pt-2">
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200">
                View Monetization Analytics
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;