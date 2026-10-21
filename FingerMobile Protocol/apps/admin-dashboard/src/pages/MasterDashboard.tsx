import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { GuardianGeminiCommandConsole } from '../components/GuardianGeminiCommandConsole';
import { MasterDashboardService } from '../services/MasterDashboardService';
import { 
  Users, 
  DollarSign, 
  Shield, 
  Server,
} from 'lucide-react';

interface MasterMetric {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  description: string;
  icon: React.ReactNode;
}

interface PlatformSummary {
  id: string;
  name: string;
  users: number;
  revenue: number;
  uptime: string;
  status: 'operational' | 'degraded' | 'down';
}

const MasterDashboard: React.FC = () => {
  const [masterMetrics, setMasterMetrics] = useState<MasterMetric[]>([]);
  const [platformSummaries, setPlatformSummaries] = useState<PlatformSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch real data
        const overview = await MasterDashboardService.getOverview();
        const workspaces = await MasterDashboardService.getWorkspaces();
        // Safely extract overview stats, provide fallbacks
        const stats = overview.stats || {
          totalUsers: '0',
          monthlyRevenue: '$0',
          uptime: '0%',
          incidents: '0'
        };

        setMasterMetrics([
          {
            title: 'Total Users',
            value: stats.totalUsers || '0',
            change: '+12%',
            trend: 'up',
            description: 'Across all platforms',
            icon: <Users className="h-8 w-8 text-blue-500" />
          },
          {
            title: 'Monthly Revenue',
            value: stats.monthlyRevenue || '$0',
            change: '+8%',
            trend: 'up',
            description: 'Net revenue this month',
            icon: <DollarSign className="h-8 w-8 text-green-500" />
          },
          {
            title: 'Platform Uptime',
            value: stats.uptime || '0%',
            change: '+0.1%',
            trend: 'up',
            description: 'Global uptime across all services',
            icon: <Server className="h-8 w-8 text-purple-500" />
          },
          {
            title: 'Security Incidents',
            value: stats.incidents || '0',
            change: '-40%',
            trend: 'down',
            description: 'This month vs last month',
            icon: <Shield className="h-8 w-8 text-red-500" />
          }
        ]);

        // Process workspaces to format needed by DataTable
        const formattedWorkspaces = (workspaces.data || []).map((w: any) => ({
          id: w.workspace_id || String(Math.random()),
          name: w.name || 'Unknown',
          users: w.active_users || 0,
          revenue: w.revenue || 0,
          uptime: (w.uptime || 0) + '%',
          status: w.status || 'operational'
        }));
        
        // If no workspaces from API, fallback to default for demo purposes
        if (formattedWorkspaces.length === 0) {
           setPlatformSummaries([
            { id: 'fm-global', name: 'FingerMobile Global', users: 450000, revenue: 180000, uptime: '99.99%', status: 'operational' },
            { id: 'fm-enterprise', name: 'FingerMobile Enterprise', users: 120000, revenue: 95000, uptime: '99.95%', status: 'operational' }
          ]);
        } else {
           setPlatformSummaries(formattedWorkspaces);
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load master dashboard data');
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const platformColumns = [
    { key: 'name' as keyof PlatformSummary, label: 'Platform' },
    { key: 'users' as keyof PlatformSummary, label: 'Users' },
    { 
      key: 'revenue' as keyof PlatformSummary, 
      label: 'Revenue',
      render: (value: string | number) => `$${typeof value === 'number' ? value.toLocaleString() : value}`
    },
    { key: 'uptime' as keyof PlatformSummary, label: 'Uptime' },
    { 
      key: 'status' as keyof PlatformSummary, 
      label: 'Status',
      render: (value: string | number) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          (typeof value === 'string' && value === 'operational') 
            ? 'bg-green-100 text-green-950'
            : (typeof value === 'string' && value === 'degraded') 
              ? 'bg-yellow-100 text-green-950'
              : 'bg-red-100 text-green-950'
        }border border-green-400 font-black`}>
          {typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value.toString()}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
           <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Master Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Global overview of all FingerMobile Protocol platforms and services
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Master Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {masterMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            trend={metric.trend}
            description={metric.description}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* SuperAdmin Guardian AI & Gemini AI Command Console */}
      <div className="mb-6">
        <GuardianGeminiCommandConsole contextName="MasterDashboard" />
      </div>

      {/* Platform Summaries */}
      <div>
        <Card title="Platform Overview">
          <DataTable
            columns={platformColumns}
            data={platformSummaries}
            isLoading={false}
            emptyMessage="No platforms found"
          />
        </Card>
      </div>

      {/* Navigation to Specialized Dashboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Access Specialized Dashboards">
          <div className="space-y-4">
            <a 
              href="/super-admin" 
              className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center">
                <Server className="h-6 w-6 mr-3" />
                <span className="font-medium">Super Admin Dashboard</span>
              </div>
              <span className="text-sm opacity-80">→</span>
            </a>
            <a 
              href="/stercs" 
              className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center">
                <Shield className="h-6 w-6 mr-3" />
                <span className="font-medium">STERCS Dashboard</span>
              </div>
              <span className="text-sm opacity-80">→</span>
            </a>
          </div>
        </Card>
        <Card title="Global Metrics">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Services</span>
              <span className="font-medium">24/26</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Response Time</span>
              <span className="font-medium">124ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Data Processed</span>
              <span className="font-medium">2.4 PB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">API Calls Today</span>
              <span className="font-medium">45.2M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Countries Supported</span>
              <span className="font-medium">180+</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MasterDashboard;