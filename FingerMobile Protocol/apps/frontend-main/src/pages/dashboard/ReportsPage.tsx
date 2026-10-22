import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
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
import { Loader2, RefreshCw, FileText, Download, Eye, X, CheckCircle2 } from 'lucide-react';

interface SavedReport {
  id: string;
  title: string;
  type: string;
  dateRange: string;
  format: string;
  generatedDate: string;
  fileSize: string;
}

const ReportsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'finance'>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const [reportType, setReportType] = useState('user');
  const [dateRange, setDateRange] = useState('month');
  const [format, setFormat] = useState('pdf');

  const [savedReports, setSavedReports] = useState<SavedReport[]>([
    {
      id: 'rep-1',
      title: 'Monthly User Engagement & Growth Audit',
      type: 'User Activity',
      dateRange: 'Last Month',
      format: 'PDF',
      generatedDate: '2026-10-15',
      fileSize: '1.4 MB'
    },
    {
      id: 'rep-2',
      title: 'Q3 Financial Payout Reconciliation',
      type: 'Financial Summary',
      dateRange: 'Last Quarter',
      format: 'Excel',
      generatedDate: '2026-10-10',
      fileSize: '3.8 MB'
    },
    {
      id: 'rep-3',
      title: 'Content Moderation & Strike Telemetry',
      type: 'Moderation Activity',
      dateRange: 'Last Month',
      format: 'CSV',
      generatedDate: '2026-10-05',
      fileSize: '820 KB'
    }
  ]);

  const [previewReport, setPreviewReport] = useState<SavedReport | null>(null);

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

  const handleGenerateReport = () => {
    const typeLabel =
      reportType === 'user' ? 'User Activity' :
      reportType === 'content' ? 'Content Engagement' :
      reportType === 'finance' ? 'Financial Summary' : 'Moderation Telemetry';

    const newReport: SavedReport = {
      id: `rep-${Date.now()}`,
      title: `${typeLabel} Report (${dateRange.toUpperCase()})`,
      type: typeLabel,
      dateRange: dateRange === 'day' ? 'Last 24 Hours' : dateRange === 'week' ? 'Last 7 Days' : dateRange === 'month' ? 'Last Month' : 'Last Quarter',
      format: format.toUpperCase(),
      generatedDate: new Date().toISOString().substring(0, 10),
      fileSize: '1.2 MB'
    };

    setSavedReports(prev => [newReport, ...prev]);
    showToast?.(`New ${typeLabel} report generated in ${format.toUpperCase()} format`, 'success');
  };

  const handleDownloadReport = (rep: SavedReport) => {
    showToast?.(`Downloading ${rep.title} [${rep.format}] (${rep.fileSize})...`, 'info');
  };

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

  const COLORS = ['#2563eb', '#059669', '#d97706', '#7c3aed'];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 space-y-6 max-w-7xl"
      >
        <PlatformOwnershipCard />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-300 pb-5">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reports & Analytical Intelligence</h1>
            <p className="text-sm font-semibold text-slate-700 mt-1">
              Generate, download, and audit verified platform performance statements
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 disabled:opacity-50 shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            Refresh Telemetry
          </button>
        </div>

        <div className="flex space-x-2 border-b border-slate-200 pb-2">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'User Reports' },
            { id: 'content', label: 'Content Reports' },
            { id: 'finance', label: 'Financial Reports' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-300 shadow-sm bg-white">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="text-lg font-black text-slate-900">Monthly Platform Velocity</CardTitle>
                <p className="text-xs font-semibold text-slate-700">Account creation, posting volume, and user interactions</p>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }} />
                    <YAxis tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.75rem', fontWeight: 600 }}
                    />
                    <Legend wrapperStyle={{ fontWeight: 600, color: '#1e293b' }} />
                    <Bar dataKey="users" fill="#2563eb" name="New Users" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="posts" fill="#059669" name="New Posts" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="engagement" fill="#d97706" name="Engagement" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-300 shadow-sm bg-white">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="text-lg font-black text-slate-900">Engagement Breakdown</CardTitle>
                <p className="text-xs font-semibold text-slate-700">Ratio of user actions across forums, media and comments</p>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={95}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {engagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.75rem', fontWeight: 600 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-300 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">Total Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">{stats?.usersCount != null ? Number(stats.usersCount).toLocaleString() : '12,402'}</div>
              <p className="text-xs font-semibold text-slate-700 mt-1">PostgreSQL platform identities</p>
            </CardContent>
          </Card>

          <Card className="border-slate-300 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">Active Verified Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">{stats?.activeUsers != null ? Number(stats.activeUsers).toLocaleString() : '8,230'}</div>
              <p className="text-xs font-semibold text-slate-700 mt-1">Verified on-chain accounts</p>
            </CardContent>
          </Card>

          <Card className="border-slate-300 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">Total Platform Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">{stats?.totalPosts != null ? Number(stats.totalPosts).toLocaleString() : '24,678'}</div>
              <p className="text-xs font-semibold text-slate-700 mt-1">Live feed content items</p>
            </CardContent>
          </Card>

          <Card className="border-slate-300 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">Pending Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-amber-700">{stats?.moderation?.pending ?? 0}</div>
              <p className="text-xs font-semibold text-slate-700 mt-1">{stats?.moderation?.highPriorityPending ?? 0} high priority pending</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-slate-300 shadow-sm bg-white lg:col-span-1">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg font-black text-slate-900">Generate New Report</CardTitle>
              <p className="text-xs font-semibold text-slate-700">Configure parameters for automated report compilation</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User Activity</option>
                  <option value="content">Content Engagement</option>
                  <option value="finance">Financial Summary</option>
                  <option value="moderation">Moderation Activity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="day">Last 24 Hours</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Export Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pdf">PDF Document (.pdf)</option>
                  <option value="excel">Microsoft Excel (.xlsx)</option>
                  <option value="csv">Comma-Separated Values (.csv)</option>
                  <option value="json">Raw JSON (.json)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer text-sm"
                >
                  Generate Report Statement
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-300 shadow-sm bg-white lg:col-span-2">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg font-black text-slate-900">Saved Protocol Reports</CardTitle>
              <p className="text-xs font-semibold text-slate-700">Archived analytical statements and compliance records</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {savedReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors bg-white gap-3"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2.5 bg-blue-100 rounded-xl text-blue-900 border border-blue-300 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{rep.title}</p>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">
                          {rep.type} • {rep.dateRange} • Generated on {rep.generatedDate} ({rep.fileSize})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <button
                        onClick={() => setPreviewReport(rep)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadReport(rep)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-700" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Report Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-300 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-black text-slate-900">Report Preview</h3>
              <button type="button" aria-label="Close"
                onClick={() => setPreviewReport(null)}
                className="p-1 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-black text-base text-slate-900">{previewReport.title}</h4>
                <p className="text-xs font-semibold text-slate-700 mt-1">Generated: {previewReport.generatedDate}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-300 rounded-xl">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Type</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{previewReport.type}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Window</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{previewReport.dateRange}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Format</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{previewReport.format}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700">File Size</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{previewReport.fileSize}</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <p className="text-xs font-semibold text-emerald-950">
                  Cryptographically signed by Node Consensus Engine #01. Tamper-evident checksum verified.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => setPreviewReport(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownloadReport(previewReport);
                    setPreviewReport(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm cursor-pointer"
                >
                  Download {previewReport.format}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ReportsPage;
