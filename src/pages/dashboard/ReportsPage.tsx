import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAppContext } from '../../contexts/AppContext';
import { adminOperationsService } from '../../services/adminOperationsService';
import { moderationAdminService } from '../../services/moderationAdminService';
import { Loader2, RefreshCw } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dash, mod] = await Promise.all([
        adminOperationsService.getDashboardStats().catch(() => null),
        moderationAdminService.getStats().catch(() => null)
      ]);
      setStats({ ...dash, moderation: mod });
    } catch (e) {
      console.error('Failed to load reports data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Monthly activity data
  const monthlyData = [
    { month: 'Jan', users: 400, posts: 240, engagement: 2400 },
    { month: 'Feb', users: 600, posts: 400, engagement: 3800 },
    { month: 'Mar', users: 800, posts: 300, engagement: 2000 },
    { month: 'Apr', users: 1200, posts: 600, engagement: 4800 },
    { month: 'May', users: 1600, posts: 800, engagement: 3800 },
    { month: 'Jun', users: stats?.usersCount || 2000, posts: stats?.totalPosts || 1000, engagement: 5800 }
  ];

  const engagementData = [
    { name: 'Posts', value: stats?.totalPosts || 400 },
    { name: 'Comments', value: 300 },
    { name: 'Shares', value: 300 },
    { name: 'Likes', value: 200 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Generate and view platform reports</p>
        </div>

        <div className="flex space-x-2 mb-6">
          <Button
            variant={activeTab === 'overview' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'users' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('users')}
          >
            User Reports
          </Button>
          <Button
            variant={activeTab === 'content' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('content')}
          >
            Content Reports
          </Button>
          <Button
            variant={activeTab === 'finance' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('finance')}
          >
            Financial Reports
          </Button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" fill="#8884d8" name="New Users" />
                    <Bar dataKey="posts" fill="#82ca9d" name="New Posts" />
                    <Bar dataKey="engagement" fill="#ffc658" name="Engagement" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {engagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.usersCount != null ? Number(stats.usersCount).toLocaleString() : '12,402'}</div>
              <p className="text-xs text-muted-foreground">PostgreSQL platform users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeUsers != null ? Number(stats.activeUsers).toLocaleString() : '8,230'}</div>
              <p className="text-xs text-muted-foreground">Verified & active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Platform Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalPosts != null ? Number(stats.totalPosts).toLocaleString() : '24,678'}</div>
              <p className="text-xs text-muted-foreground">Live feed content items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats?.moderation?.pending ?? 0}</div>
              <p className="text-xs text-muted-foreground">{stats?.moderation?.highPriorityPending ?? 0} high priority pending</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Report Type</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User Activity</SelectItem>
                      <SelectItem value="content">Content Engagement</SelectItem>
                      <SelectItem value="finance">Financial Summary</SelectItem>
                      <SelectItem value="moderation">Moderation Activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Date Range</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Last Day</SelectItem>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last Quarter</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Format</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button>Generate Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Monthly User Engagement Report</p>
                    <p className="text-sm text-gray-500">Generated on May 15, 2023</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm">Download</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Q2 Financial Summary</p>
                    <p className="text-sm text-gray-500">Generated on April 30, 2023</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm">Download</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Content Moderation Stats</p>
                    <p className="text-sm text-gray-500">Generated on May 10, 2023</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm">Download</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default ReportsPage;
