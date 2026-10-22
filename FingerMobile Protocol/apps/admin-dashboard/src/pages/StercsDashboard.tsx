import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { GuardianGeminiCommandConsole } from '../components/GuardianGeminiCommandConsole';
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  Settings,
  DollarSign,
  UserMinus
} from 'lucide-react';

interface SecurityMetric {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  description: string;
  icon: React.ReactNode;
}

interface SecurityReport {
  id: string;
  reporter: string;
  reportedUser: string;
  type: string;
  status: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityEvent {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  details: string;
}

// Interfaces for spend caps and account inactivity
interface SpendCapMetric {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  description: string;
  icon: React.ReactNode;
}

interface InactivityMetric {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  description: string;
  icon: React.ReactNode;
}

const StercsDashboard: React.FC = () => {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [securityReports, setSecurityReports] = useState<SecurityReport[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [spendCapMetrics, setSpendCapMetrics] = useState<SpendCapMetric[]>([]);
  const [inactivityMetrics, setInactivityMetrics] = useState<InactivityMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [stercsFeedback, setStercsFeedback] = useState<string | null>(null);

  const handleReviewCaps = () => {
    setStercsFeedback('Reviewing account spend caps: 1,420 accounts evaluated against platform velocity thresholds.');
  };

  const handleCapSettings = () => {
    setStercsFeedback('Cap Settings opened: Global daily spend limit set to ₦5,000,000 / $10,000.');
  };

  const handleCapAnalytics = () => {
    setStercsFeedback('Cap Analytics generated: 98.4% of transactions within standard safety thresholds.');
  };

  const handleReviewInactive = () => {
    setStercsFeedback('Inactive account audit: 24 accounts identified dormant for > 180 days.');
  };

  const handleUnpaidLiabilities = () => {
    setStercsFeedback('Liability report: Total unsettled claims ₦450,000; collections queued.');
  };

  const handleManageFreezes = () => {
    setStercsFeedback('Account freezes console: 2 accounts currently locked pending KYC re-verification.');
  };

  const handleBlockIpRange = () => {
    const range = prompt('Enter IP CIDR range to block (e.g. 192.168.1.0/24):');
    if (range) {
      setStercsFeedback(`IP range ${range} successfully added to STERCS firewall blacklist.`);
    }
  };

  const handleQuarantineAccount = () => {
    const account = prompt('Enter Account ID or Email to quarantine:');
    if (account) {
      setStercsFeedback(`Account "${account}" quarantined: Session revoked, permissions restricted.`);
    }
  };

  const handleSecuritySettings = () => {
    setStercsFeedback('STERCS Security Policy: Hardware key 2FA and DEFCON level 4 monitoring active.');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API calls to security services
        // In a real app, this would aggregate data from security monitoring systems
        setTimeout(() => {
          // Security metrics
          setSecurityMetrics([
            {
              title: 'Active Threats',
              value: '3',
              change: '+1',
              trend: 'up',
              description: 'Currently monitored threats',
              icon: <AlertTriangle className="h-8 w-8 text-orange-500" />
            },
            {
              title: 'Resolved Incidents',
              value: '42',
              change: '+8%',
              trend: 'up',
              description: 'This month',
              icon: <CheckCircle className="h-8 w-8 text-green-500" />
            },
            {
              title: 'Security Events',
              value: '1,245',
              change: '+12%',
              trend: 'up',
              description: 'Today\'s events',
              icon: <Activity className="h-8 w-8 text-blue-500" />
            },
            {
              title: 'Compliance Score',
              value: '98.5%',
              change: '+2%',
              trend: 'up',
              description: 'GDPR & SOC2 compliance',
              icon: <Shield className="h-8 w-8 text-purple-500" />
            }
          ]);

          // Security reports
          setSecurityReports([
            {
              id: 'rep-001',
              reporter: 'user-123',
              reportedUser: 'user-456',
              type: 'harassment',
              status: 'reviewed',
              createdAt: '2023-10-02',
              priority: 'high'
            },
            {
              id: 'rep-002',
              reporter: 'user-789',
              reportedUser: 'user-012',
              type: 'spam',
              status: 'pending',
              createdAt: '2023-10-02',
              priority: 'medium'
            },
            {
              id: 'rep-003',
              reporter: 'user-345',
              reportedUser: 'user-678',
              type: 'hate_speech',
              status: 'action_taken',
              createdAt: '2023-10-01',
              priority: 'critical'
            },
            {
              id: 'rep-004',
              reporter: 'user-901',
              reportedUser: 'user-234',
              type: 'violence',
              status: 'dismissed',
              createdAt: '2023-10-01',
              priority: 'high'
            },
            {
              id: 'rep-005',
              reporter: 'user-567',
              reportedUser: 'user-890',
              type: 'nudity',
              status: 'pending',
              createdAt: '2023-09-30',
              priority: 'low'
            }
          ]);

          // Security events
          setSecurityEvents([
            {
              id: 'evt-001',
              user: 'user-111',
              action: 'Suspicious login from new device',
              timestamp: '2 minutes ago',
              riskLevel: 'medium',
              details: 'Login from IP 192.168.1.100'
            },
            {
              id: 'evt-002',
              user: 'user-222',
              action: 'Multiple failed login attempts',
              timestamp: '5 minutes ago',
              riskLevel: 'high',
              details: '10 failed attempts in 2 minutes'
            },
            {
              id: 'evt-003',
              user: 'user-333',
              action: 'Password change detected',
              timestamp: '15 minutes ago',
              riskLevel: 'low',
              details: 'Password changed successfully'
            },
            {
              id: 'evt-004',
              user: 'user-444',
              action: 'Account access from new location',
              timestamp: '1 hour ago',
              riskLevel: 'medium',
              details: 'Access from Tokyo, Japan'
            },
            {
              id: 'evt-005',
              user: 'user-555',
              action: 'Unusual API usage pattern',
              timestamp: '2 hours ago',
              riskLevel: 'high',
              details: '1000+ requests in 5 minutes'
            }
          ]);

          // Spend Cap Metrics
          setSpendCapMetrics([
            {
              title: 'Users with Caps',
              value: '1,247',
              change: '+5%',
              trend: 'up',
              description: 'Active spend cap configurations',
              icon: <DollarSign className="h-8 w-8 text-green-500" />
            },
            {
              title: 'Avg. Cap Amount',
              value: '$150.75',
              change: '+2%',
              trend: 'up',
              description: 'Average monthly spending limit',
              icon: <DollarSign className="h-8 w-8 text-blue-500" />
            },
            {
              title: 'Total Protected',
              value: '$187,923',
              change: '+8%',
              trend: 'up',
              description: 'Total spending under protection',
              icon: <DollarSign className="h-8 w-8 text-purple-500" />
            },
            {
              title: 'Compliance Rate',
              value: '96.2%',
              change: '+1%',
              trend: 'up',
              description: 'Successful cap enforcement',
              icon: <Shield className="h-8 w-8 text-indigo-500" />
            }
          ]);

          // Account Inactivity Metrics
          setInactivityMetrics([
            {
              title: 'Inactive Accounts',
              value: '2,438',
              change: '-3%',
              trend: 'down',
              description: 'Accounts with no login for 60+ days',
              icon: <UserMinus className="h-8 w-8 text-orange-500" />
            },
            {
              title: 'Frozen Accounts',
              value: '842',
              change: '+2%',
              trend: 'up',
              description: 'Auto-frozen due to inactivity',
              icon: <Lock className="h-8 w-8 text-red-500" />
            },
            {
              title: 'Unpaid Liabilities',
              value: '$12,456',
              change: '+5%',
              trend: 'up',
              description: 'Outstanding debts from inactive accounts',
              icon: <DollarSign className="h-8 w-8 text-amber-500" />
            },
            {
              title: 'Auto-Reconciled',
              value: '68',
              change: '+12%',
              trend: 'up',
              description: 'Liabilities auto-settled this month',
              icon: <CheckCircle className="h-8 w-8 text-green-500" />
            }
          ]);
          
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to load security data');
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const reportColumns = [
    { key: 'id' as keyof SecurityReport, label: 'Report ID' },
    { key: 'reporter' as keyof SecurityReport, label: 'Reporter' },
    { key: 'reportedUser' as keyof SecurityReport, label: 'Reported User' },
    { key: 'type' as keyof SecurityReport, label: 'Type' },
    { 
      key: 'priority' as keyof SecurityReport, 
      label: 'Priority',
      render: (value: string) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'critical' 
            ? 'bg-red-100 text-red-950'
            : value === 'high' 
              ? 'bg-orange-100 text-red-950'
              : value === 'medium'
                ? 'bg-yellow-100 text-red-950'
                : 'bg-blue-100 text-red-950'
        }border border-red-400 font-black`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    { 
      key: 'status' as keyof SecurityReport, 
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'pending' 
            ? 'bg-yellow-100 text-yellow-950'
            : value === 'reviewed' 
              ? 'bg-blue-100 text-yellow-950'
              : value === 'action_taken'
                ? 'bg-green-100 text-yellow-950'
                : 'bg-gray-100 text-yellow-950'
        }border border-yellow-400 font-black`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    { key: 'createdAt' as keyof SecurityReport, label: 'Date' }
  ];

  const eventColumns = [
    { key: 'user' as keyof SecurityEvent, label: 'User' },
    { key: 'action' as keyof SecurityEvent, label: 'Action' },
    { key: 'timestamp' as keyof SecurityEvent, label: 'Time' },
    { 
      key: 'riskLevel' as keyof SecurityEvent, 
      label: 'Risk Level',
      render: (value: string) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'critical' 
            ? 'bg-red-100 text-red-950'
            : value === 'high' 
              ? 'bg-orange-100 text-red-950'
              : value === 'medium'
                ? 'bg-yellow-100 text-red-950'
                : 'bg-blue-100 text-red-950'
        }border border-red-400 font-black`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    { key: 'details' as keyof SecurityEvent, label: 'Details' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">STERCS Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Security, Threat Evaluation, Risk Control & Safeguarding
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
        <h1 className="text-2xl font-bold text-gray-900">STERCS Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Security, Threat Evaluation, Risk Control & Safeguarding
        </p>
      </div>

      {/* SuperAdmin Guardian AI & Gemini AI Command Console */}
      <div className="mb-6">
        <GuardianGeminiCommandConsole contextName="StercsDashboard" />
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => (
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

      {/* Spend Cap Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {spendCapMetrics.map((metric, index) => (
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

      {/* Account Inactivity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inactivityMetrics.map((metric, index) => (
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

      {/* Security Reports and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card title="Recent Security Reports">
            <DataTable
              columns={reportColumns}
              data={securityReports}
              isLoading={false}
              emptyMessage="No security reports found"
            />
          </Card>
        </div>
        <div>
          <Card title="Recent Security Events">
            <DataTable
              columns={eventColumns}
              data={securityEvents}
              isLoading={false}
              emptyMessage="No security events found"
            />
          </Card>
        </div>
      </div>

      {/* Feedback Banner */}
      {stercsFeedback && (
        <div className="bg-slate-100 border border-slate-300 text-slate-900 px-4 py-3 rounded-md mb-6 font-semibold flex items-center justify-between">
          <span>{stercsFeedback}</span>
          <button 
            onClick={() => setStercsFeedback(null)}
            className="text-slate-700 hover:text-slate-900 font-bold ml-4"
          >
            ×
          </button>
        </div>
      )}

      {/* Spend Cap and Inactivity Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Spend Cap Controls">
          <div className="space-y-4">
            <button 
              onClick={handleReviewCaps}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 flex items-center justify-center font-medium">
              <DollarSign className="h-4 w-4 mr-2" />
              Review Caps
            </button>
            <button 
              onClick={handleCapSettings}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center font-medium">
              <Settings className="h-4 w-4 mr-2" />
              Cap Settings
            </button>
            <button 
              onClick={handleCapAnalytics}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200 flex items-center justify-center font-medium">
              <Activity className="h-4 w-4 mr-2" />
              Cap Analytics
            </button>
          </div>
        </Card>
        <Card title="Account Inactivity">
          <div className="space-y-4">
            <button 
              onClick={handleReviewInactive}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 flex items-center justify-center font-medium">
              <UserMinus className="h-4 w-4 mr-2" />
              Review Inactive
            </button>
            <button 
              onClick={handleUnpaidLiabilities}
              className="w-full bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 transition duration-200 flex items-center justify-center font-medium">
              <DollarSign className="h-4 w-4 mr-2" />
              Unpaid Liabilities
            </button>
            <button 
              onClick={handleManageFreezes}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 flex items-center justify-center font-medium">
              <Lock className="h-4 w-4 mr-2" />
              Manage Freezes
            </button>
          </div>
        </Card>
        <Card title="Risk Assessment">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Spending Risk</span>
              <span className="font-medium text-green-600">Low</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Inactivity Risk</span>
              <span className="font-medium text-amber-600">Medium</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Liability Risk</span>
              <span className="font-medium text-orange-600">Medium</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Overall Security</span>
              <span className="font-medium text-green-600">Good</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Security Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Security Controls">
          <div className="space-y-4">
            <button 
              onClick={handleBlockIpRange}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 flex items-center justify-center font-medium">
              <Lock className="h-4 w-4 mr-2" />
              Block IP Range
            </button>
            <button 
              onClick={handleQuarantineAccount}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-200 flex items-center justify-center font-medium">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Quarantine Account
            </button>
            <button 
              onClick={handleSecuritySettings}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 flex items-center justify-center font-medium">
              <Settings className="h-4 w-4 mr-2" />
              Security Settings
            </button>
          </div>
        </Card>
        <Card title="Threat Assessment">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Critical Threats</span>
              <span className="font-medium text-red-600">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">High Risk Users</span>
              <span className="font-medium text-orange-600">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vulnerabilities</span>
              <span className="font-medium text-yellow-600">7</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Security Score</span>
              <span className="font-medium text-green-600">87%</span>
            </div>
          </div>
        </Card>
        <Card title="Compliance Status">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">GDPR</span>
              <span className="font-medium text-green-600">✓ Compliant</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">SOC2 Type II</span>
              <span className="font-medium text-green-600">✓ Certified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ISO 27001</span>
              <span className="font-medium text-yellow-600">In Progress</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">PCI DSS</span>
              <span className="font-medium text-green-600">✓ Compliant</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Link to Master Dashboard */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Eye className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Master Dashboard Access</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Access the Master Dashboard for comprehensive platform metrics and management tools.</p>
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
    </div>
  );
};

export default StercsDashboard;