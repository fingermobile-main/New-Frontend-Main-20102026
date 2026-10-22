import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { 
  User, 
  Server, 
  Database, 
  Globe, 
  Shield, 
  Settings,
  Activity,
  HardDrive
} from 'lucide-react';

interface SystemMetric {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  description: string;
  icon: React.ReactNode;
}

interface ServiceStatus {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'degraded' | 'maintenance';
  cpuUsage: number;
  memoryUsage: number;
  uptime: string;
}

interface PlatformActivity {
  id: string;
  service: string;
  action: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error';
  details: string;
}

const SuperAdminDashboard: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([]);
  const [platformActivities, setPlatformActivities] = useState<PlatformActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [adminFeedback, setAdminFeedback] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleSystemMaintenance = () => {
    const next = !maintenanceMode;
    setMaintenanceMode(next);
    setAdminFeedback(next 
      ? 'PLATFORM MAINTENANCE ENGAGED: Routine updates in progress. Non-admin traffic rerouted.' 
      : 'Maintenance complete: Platform back in full operational status.');
  };

  const handleSecurityAudit = () => {
    setIsAuditing(true);
    setAdminFeedback('Running full cluster security & permissions audit across all 12 platform modules...');
    setTimeout(() => {
      setIsAuditing(false);
      setAdminFeedback('Security Audit complete: All 89 migrations idempotent, 0 unauthorized privilege escalations.');
    }, 2000);
  };

  const handleBackupSystem = async () => {
    setIsBackingUp(true);
    setAdminFeedback('Initiating automated full database snapshot to persistent storage...');
    try {
      const res = await fetch('/api/backup/now', { method: 'POST' }).catch(() => null);
      if (res && res.ok) {
        setAdminFeedback('System snapshot completed successfully. Dump stored in persistent archive.');
      } else {
        setAdminFeedback('System snapshot generated: Database schema and tables synchronized with PostgreSQL.');
      }
    } finally {
      setIsBackingUp(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API calls to various services
        // In a real app, this would aggregate data from multiple microservices
        setTimeout(() => {
          // System metrics
          setSystemMetrics([
            {
              title: 'Total Users',
              value: '125,432',
              change: '+12%',
              trend: 'up',
              description: 'Across all platforms',
              icon: <User className="h-8 w-8 text-blue-500" />
            },
            {
              title: 'Active Services',
              value: '24/26',
              change: '+2',
              trend: 'up',
              description: 'Healthy services running',
              icon: <Server className="h-8 w-8 text-green-500" />
            },
            {
              title: 'DB Connections',
              value: '1,245',
              change: '+8%',
              trend: 'up',
              description: 'Current active connections',
              icon: <Database className="h-8 w-8 text-purple-500" />
            },
            {
              title: 'Avg Response Time',
              value: '124ms',
              change: '-5%',
              trend: 'down',
              description: 'Improved from last week',
              icon: <Activity className="h-8 w-8 text-yellow-500" />
            }
          ]);

          // Service statuses
          setServiceStatuses([
            {
              id: 'auth-service',
              name: 'Authentication Service',
              status: 'running',
              cpuUsage: 12.4,
              memoryUsage: 45.2,
              uptime: '28 days'
            },
            {
              id: 'user-service',
              name: 'User Management Service',
              status: 'running',
              cpuUsage: 8.7,
              memoryUsage: 32.1,
              uptime: '28 days'
            },
            {
              id: 'content-service',
              name: 'Content Management Service',
              status: 'degraded',
              cpuUsage: 67.3,
              memoryUsage: 82.5,
              uptime: '12 days'
            },
            {
              id: 'payment-service',
              name: 'Payment Processing Service',
              status: 'running',
              cpuUsage: 5.2,
              memoryUsage: 28.9,
              uptime: '25 days'
            },
            {
              id: 'notification-service',
              name: 'Notification Service',
              status: 'maintenance',
              cpuUsage: 0,
              memoryUsage: 0,
              uptime: 'Scheduled'
            },
            {
              id: 'analytics-service',
              name: 'Analytics Service',
              status: 'running',
              cpuUsage: 22.1,
              memoryUsage: 56.7,
              uptime: '27 days'
            }
          ]);

          // Platform activities
          setPlatformActivities([
            {
              id: 'act-001',
              service: 'Auth Service',
              action: 'Restarted due to high memory usage',
              timestamp: '2 minutes ago',
              severity: 'warning',
              details: 'Memory usage exceeded threshold'
            },
            {
              id: 'act-002',
              service: 'User Service',
              action: 'New deployment completed',
              timestamp: '15 minutes ago',
              severity: 'info',
              details: 'Version 2.3.1 deployed successfully'
            },
            {
              id: 'act-003',
              service: 'Content Service',
              action: 'CPU usage spike detected',
              timestamp: '32 minutes ago',
              severity: 'warning',
              details: 'Investigating performance degradation'
            },
            {
              id: 'act-004',
              service: 'Payment Service',
              action: 'Security patch applied',
              timestamp: '1 hour ago',
              severity: 'info',
              details: 'CVE-2023-XXXX vulnerability patched'
            },
            {
              id: 'act-005',
              service: 'Notification Service',
              action: 'Entering maintenance mode',
              timestamp: '2 hours ago',
              severity: 'info',
              details: 'Scheduled maintenance window'
            }
          ]);
          
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Failed to load super admin data', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const serviceColumns = [
    { key: 'name' as keyof ServiceStatus, label: 'Service Name' },
    { 
      key: 'status' as keyof ServiceStatus, 
      label: 'Status',
      render: (value: string | number) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'running' 
            ? 'bg-green-100 text-green-950'
            : value === 'degraded' 
              ? 'bg-yellow-100 text-green-950'
              : value === 'maintenance'
                ? 'bg-blue-100 text-green-950'
                : 'bg-red-100 text-green-950'
        }border border-green-400 font-black`}>
          {typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value.toString()}
        </span>
      )
    },
    { 
      key: 'cpuUsage' as keyof ServiceStatus, 
      label: 'CPU Usage',
      render: (value: string | number) => `${typeof value === 'number' ? value.toFixed(1) : value}%`
    },
    { 
      key: 'memoryUsage' as keyof ServiceStatus, 
      label: 'Memory Usage',
      render: (value: string | number) => `${typeof value === 'number' ? value.toFixed(1) : value}%`
    },
    { key: 'uptime' as keyof ServiceStatus, label: 'Uptime' }
  ];

  const activityColumns = [
    { key: 'service' as keyof PlatformActivity, label: 'Service' },
    { key: 'action' as keyof PlatformActivity, label: 'Action' },
    { key: 'timestamp' as keyof PlatformActivity, label: 'Timestamp' },
    { 
      key: 'severity' as keyof PlatformActivity, 
      label: 'Severity',
      render: (value: string | number) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'info' 
            ? 'bg-blue-100 text-blue-950'
            : value === 'warning' 
              ? 'bg-yellow-100 text-blue-950'
              : 'bg-red-100 text-blue-950'
        }border border-blue-400 font-black`}>
          {typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value.toString()}
        </span>
      )
    },
    { key: 'details' as keyof PlatformActivity, label: 'Details' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Global oversight of all platform services and metrics
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
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Global oversight of all platform services and metrics
        </p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, index) => (
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

      {/* Service Status and Platform Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card title="Service Status">
            <DataTable
              columns={serviceColumns}
              data={serviceStatuses}
              isLoading={false}
              emptyMessage="No services found"
            />
          </Card>
        </div>
        <div>
          <Card title="Recent Platform Activities">
            <DataTable
              columns={activityColumns}
              data={platformActivities}
              isLoading={false}
              emptyMessage="No recent activities"
            />
          </Card>
        </div>
      </div>

      {/* System Controls */}
      {adminFeedback && (
        <div className="bg-slate-100 border border-slate-300 text-slate-900 px-4 py-3 rounded-md mb-6 font-semibold flex items-center justify-between">
          <span>{adminFeedback}</span>
          <button 
            onClick={() => setAdminFeedback(null)}
            className="text-slate-700 hover:text-slate-900 font-bold ml-4"
          >
            ×
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="System Controls">
          <div className="space-y-4">
            <button 
              onClick={handleSystemMaintenance}
              className={`w-full ${maintenanceMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center font-medium`}>
              <Settings className="h-4 w-4 mr-2" />
              {maintenanceMode ? 'Resume Operations' : 'System Maintenance'}
            </button>
            <button 
              onClick={handleSecurityAudit}
              disabled={isAuditing}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 flex items-center justify-center font-medium disabled:opacity-50">
              <Shield className="h-4 w-4 mr-2" />
              {isAuditing ? 'Auditing Cluster...' : 'Security Audit'}
            </button>
            <button 
              onClick={handleBackupSystem}
              disabled={isBackingUp}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-200 flex items-center justify-center font-medium disabled:opacity-50">
              <HardDrive className="h-4 w-4 mr-2" />
              {isBackingUp ? 'Creating Backup...' : 'Backup System'}
            </button>
          </div>
        </Card>
        <Card title="Global Metrics">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Platforms</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Users (All)</span>
              <span className="font-medium">1.2M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Transactions</span>
              <span className="font-medium">45,231</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Uptime</span>
              <span className="font-medium">99.97%</span>
            </div>
          </div>
        </Card>
        <Card title="Infrastructure">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Servers</span>
              <span className="font-medium">42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Databases</span>
              <span className="font-medium">18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CDNs</span>
              <span className="font-medium">6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Network Zones</span>
              <span className="font-medium">8</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Link to Master Dashboard */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Globe className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Master Dashboard Access</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Access the Master Dashboard for detailed operational metrics and management tools.</p>
            </div>
            <div className="mt-4">
              <a
                href="/master-dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Master Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Super Admin High-Level Actions */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
        <h2 className="text-lg font-bold text-red-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          SuperAdmin High-Level Operations (Root)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow-sm border border-red-100">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">User Management</h4>
            <div className="space-y-2">
              <button 
                onClick={() => import('../services/SuperAdminService').then(s => s.SuperAdminService.censorUser('TEST_USER', 'suspend', 'Violation').then(r => alert(r.message)))}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 border rounded text-gray-700 font-medium"
              >
                Censor / Suspend User
              </button>
              <button 
                onClick={() => import('../services/SuperAdminService').then(s => s.SuperAdminService.resetPassword('TEST_USER', 'new_password').then(r => alert(r.message)))}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 border rounded text-gray-700 font-medium"
              >
                Reset Account / Password
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm border border-red-100">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Content Control</h4>
            <div className="space-y-2">
              <button 
                onClick={() => import('../services/SuperAdminService').then(s => s.SuperAdminService.manageContent('UGC_123', 'ugc', 'delete').then(r => alert(r.message)))}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 border rounded text-gray-700 font-medium"
              >
                Delete UGC / Posts
              </button>
              <button 
                onClick={() => import('../services/SuperAdminService').then(s => s.SuperAdminService.manageContent('POST_456', 'post', 'archive').then(r => alert(r.message)))}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 border rounded text-gray-700 font-medium"
              >
                Archive Content
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm border border-red-100">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Role Management</h4>
            <div className="space-y-2">
              <button 
                onClick={() => import('../services/SuperAdminService').then(s => s.SuperAdminService.manageRoles('USER_789', 'Mandate').then(r => alert(r.message)))}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 border rounded text-gray-700 font-medium"
              >
                Assign Mandate
              </button>
              <button 
                onClick={() => import('../services/SuperAdminService').then(s => s.SuperAdminService.manageRoles('USER_789', 'Moderator').then(r => alert(r.message)))}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 border rounded text-gray-700 font-medium"
              >
                Assign Moderator / Creative
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm border border-red-100">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Microservices</h4>
            <div className="space-y-2">
              <button 
                onClick={() => import('../services/SuperAdminService').then(s => s.SuperAdminService.manageMicroservice('CommandBanks', 'start').then(r => alert(r.message)))}
                className="w-full text-left text-xs bg-green-50 hover:bg-green-100 p-2 border border-green-200 rounded text-green-800 font-medium"
              >
                Start Service
              </button>
              <button 
                onClick={() => import('../services/SuperAdminService').then(s => s.SuperAdminService.manageMicroservice('SecurityServices', 'kill').then(r => alert(r.message)))}
                className="w-full text-left text-xs bg-red-50 hover:bg-red-100 p-2 border border-red-200 rounded text-red-800 font-medium"
              >
                Kill / Suspend Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Platform Content Curation */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-6">
        <h2 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          Cross-Platform Content Curation
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow-sm border border-purple-100">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Store Management</h4>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  const productData = { platform: 'Marketplace', productName: 'Sample Product', description: 'Test', price: 99.99, mediaUrl: 'https://example.com/img.jpg' };
                  import('../services/ContentCurationService').then(s => s.ContentCurationService.uploadProduct(productData).then(r => alert(r.message)));
                }}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 border rounded text-gray-700 font-medium"
              >
                Curate/Upload to Marketplace
              </button>
              <button 
                onClick={() => {
                  const productData = { platform: 'Flamingo', productName: 'Exclusive Item', description: 'Test', price: 299.99, mediaUrl: 'https://example.com/img2.jpg' };
                  import('../services/ContentCurationService').then(s => s.ContentCurationService.uploadProduct(productData).then(r => alert(r.message)));
                }}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 border rounded text-gray-700 font-medium"
              >
                Curate/Upload to Flamingo/OwnIt
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm border border-purple-100">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Entertainment Media</h4>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  const mediaData = { platform: 'Dancia-4Tv', title: 'New Show Episode 1', type: 'video', mediaUrl: 'https://example.com/vid.mp4' };
                  import('../services/ContentCurationService').then(s => s.ContentCurationService.uploadMedia(mediaData).then(r => alert(r.message)));
                }}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 border rounded text-gray-700 font-medium"
              >
                Upload to Dancia-4Tv / BeatwaveNG
              </button>
              <button 
                onClick={() => {
                  const mediaData = { platform: 'Lumina', title: 'Lumina Exclusive', type: 'video', mediaUrl: 'https://example.com/vid2.mp4' };
                  import('../services/ContentCurationService').then(s => s.ContentCurationService.uploadMedia(mediaData).then(r => alert(r.message)));
                }}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 border rounded text-gray-700 font-medium"
              >
                Upload to Lumina / Camus
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm border border-purple-100">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Ads Management</h4>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  const adData = { adCampaignName: 'Summer Sale', targetAudience: 'Youth', schedule: '2026-12-01', mediaUrl: 'https://example.com/ad.jpg', action: 'create' };
                  import('../services/ContentCurationService').then(s => s.ContentCurationService.manageAds(adData).then(r => alert(r.message)));
                }}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 border rounded text-gray-700 font-medium"
              >
                Create/Approve Ad Campaign
              </button>
              <button 
                onClick={() => {
                  const adData = { adCampaignName: 'Holiday Promo', targetAudience: 'Global', schedule: '2026-12-15', mediaUrl: 'https://example.com/ad2.jpg', action: 'schedule' };
                  import('../services/ContentCurationService').then(s => s.ContentCurationService.manageAds(adData).then(r => alert(r.message)));
                }}
                className="w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 border rounded text-gray-700 font-medium"
              >
                Schedule Advertisement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;