import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Eye, 
  Lock, 
  Settings,
} from 'lucide-react';
import { type SecurityAlert, type SecurityIncident } from '../services/SecurityMonitoringService';

import { type FirewallRule } from '../services/NetworkSecurityService';
import { type AnomalousBehavior } from '../services/UserBehaviorAnalyticsService';

interface SecurityMetric {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  description: string;
  icon: React.ReactNode;
}

const SecurityOperationsDashboard: React.FC = () => {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<SecurityAlert[]>([]);
  const [recentIncidents, setRecentIncidents] = useState<SecurityIncident[]>([]);
  const [anomalousBehaviors, setAnomalousBehaviors] = useState<AnomalousBehavior[]>([]);
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLockdownActive, setIsLockdownActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [securityStatusMessage, setSecurityStatusMessage] = useState<string | null>(null);

  const handleEmergencyLockdown = () => {
    const next = !isLockdownActive;
    setIsLockdownActive(next);
    setSecurityStatusMessage(next ? 'EMERGENCY LOCKDOWN ACTIVATED: All external IP gateways restricted.' : 'Lockdown released: System operating normally.');
  };

  const handleRunSecurityScan = () => {
    setIsScanning(true);
    setSecurityStatusMessage('Security vulnerability scan initiated across all cluster nodes...');
    setTimeout(() => {
      setIsScanning(false);
      setSecurityStatusMessage('Security scan complete: 0 critical vulnerabilities found.');
    }, 2000);
  };

  const handleSecuritySettings = () => {
    setSecurityStatusMessage('Security Configuration: Standard cluster firewall and zero-trust policies active.');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API calls to security services
        setTimeout(() => {
          // Security metrics
          setSecurityMetrics([
            {
              title: 'Active Alerts',
              value: '12',
              change: '+3',
              trend: 'up',
              description: 'Currently active security alerts',
              icon: <AlertTriangle className="h-8 w-8 text-orange-500" />
            },
            {
              title: 'Open Incidents',
              value: '5',
              change: '-2',
              trend: 'down',
              description: 'Security incidents awaiting resolution',
              icon: <Shield className="h-8 w-8 text-red-500" />
            },
            {
              title: 'Anomalous Behaviors',
              value: '24',
              change: '+5',
              trend: 'up',
              description: 'Detected unusual user behaviors',
              icon: <Activity className="h-8 w-8 text-yellow-500" />
            },
            {
              title: 'High-Risk Users',
              value: '8',
              change: '+1',
              trend: 'up',
              description: 'Users with elevated risk profiles',
              icon: <Eye className="h-8 w-8 text-purple-500" />
            }
          ]);

          // Recent alerts
          setRecentAlerts([
            {
              id: 'al-001',
              type: 'unauthorized_access',
              severity: 'high',
              description: 'Unauthorized access attempt from IP 192.168.1.100',
              timestamp: '2023-10-02T10:30:00Z',
              status: 'new',
              sourceIp: '192.168.1.100'
            },
            {
              id: 'al-002',
              type: 'ddos',
              severity: 'critical',
              description: 'DDoS attack detected on web servers',
              timestamp: '2023-10-02T09:15:00Z',
              status: 'investigating',
              sourceIp: '104.28.29.100'
            },
            {
              id: 'al-003',
              type: 'vulnerability',
              severity: 'medium',
              description: 'SSL certificate expiring soon',
              timestamp: '2023-10-02T08:45:00Z',
              status: 'new',
              sourceIp: 'internal'
            },
            {
              id: 'al-004',
              type: 'malware',
              severity: 'high',
              description: 'Malware detected in file upload',
              timestamp: '2023-10-02T07:20:00Z',
              status: 'resolved',
              sourceIp: '172.16.0.50'
            },
            {
              id: 'al-005',
              type: 'phishing',
              severity: 'medium',
              description: 'Phishing attempt detected',
              timestamp: '2023-10-02T06:10:00Z',
              status: 'investigating',
              sourceIp: '203.0.113.45'
            }
          ]);

          // Recent incidents
          setRecentIncidents([
            {
              id: 'inc-001',
              title: 'Data Breach Attempt',
              description: 'Unauthorized access to customer database',
              severity: 'critical',
              status: 'in_progress',
              reportedAt: '2023-10-01T14:30:00Z',
              affectedResources: ['Customer DB', 'User Profiles'],
              evidence: ['IP: 192.168.1.100', 'Time: 14:25']
            },
            {
              id: 'inc-002',
              title: 'Phishing Campaign',
              description: 'Mass phishing emails sent to employees',
              severity: 'high',
              status: 'open',
              reportedAt: '2023-10-01T11:15:00Z',
              affectedResources: ['Employee Emails', 'Internal Systems'],
              evidence: ['Domain: fake-company.com', 'Subject: Urgent Update Required']
            },
            {
              id: 'inc-003',
              title: 'Privilege Escalation',
              description: 'User attempted to elevate privileges',
              severity: 'medium',
              status: 'resolved',
              reportedAt: '2023-09-30T09:45:00Z',
              resolvedAt: '2023-09-30T12:30:00Z',
              affectedResources: ['Admin Panel', 'User Management'],
              evidence: ['User: user-123', 'Action: Admin Access Attempt']
            }
          ]);

          // Anomalous behaviors
          setAnomalousBehaviors([
            {
              id: 'ab-001',
              userId: 'user-123',
              userName: 'John Doe',
              type: 'unusual_login',
              severity: 'high',
              timestamp: '2023-10-02T08:30:00Z',
              description: 'Login from new location: Tokyo, Japan',
              evidence: ['IP: 203.0.113.45', 'Location: Tokyo', 'Device: Unknown'],
              status: 'new',
              riskScore: 0.8,
              recommendedAction: 'Verify identity'
            },
            {
              id: 'ab-002',
              userId: 'user-456',
              userName: 'Jane Smith',
              type: 'unusual_activity',
              severity: 'medium',
              timestamp: '2023-10-02T07:45:00Z',
              description: 'Accessed restricted files outside business hours',
              evidence: ['File: /admin/config.txt', 'Time: 07:45 AM', 'User: jane.smith'],
              status: 'investigating',
              riskScore: 0.6,
              recommendedAction: 'Review access rights'
            },
            {
              id: 'ab-003',
              userId: 'user-789',
              userName: 'Bob Johnson',
              type: 'potential_breach',
              severity: 'critical',
              timestamp: '2023-10-01T23:15:00Z',
              description: 'Downloaded large amount of customer data',
              evidence: ['Download: 5GB customer_data.zip', 'Time: 11:15 PM', 'User: bob.johnson'],
              status: 'new',
              riskScore: 0.9,
              recommendedAction: 'Immediate investigation required'
            }
          ]);

          // Firewall rules
          setFirewallRules([
            {
              id: 'fw-001',
              name: 'Block Malicious IPs',
              action: 'deny',
              protocol: 'any',
              sourceIp: '192.168.1.100',
              destinationIp: 'any',
              enabled: true,
              priority: 1,
              description: 'Block known malicious IP address',
              createdBy: 'admin',
              createdAt: '2023-09-01T10:00:00Z',
              lastModified: '2023-09-01T10:00:00Z'
            },
            {
              id: 'fw-002',
              name: 'Allow Internal Access',
              action: 'allow',
              protocol: 'tcp',
              sourceIp: '10.0.0.0/8',
              destinationIp: 'any',
              destinationPort: 80,
              enabled: true,
              priority: 10,
              description: 'Allow internal access to web services',
              createdBy: 'admin',
              createdAt: '2023-08-15T09:30:00Z',
              lastModified: '2023-08-15T09:30:00Z'
            },
            {
              id: 'fw-003',
              name: 'Restrict Admin Access',
              action: 'deny',
              protocol: 'tcp',
              sourceIp: 'any',
              destinationIp: '10.1.1.100',
              destinationPort: 22,
              enabled: true,
              priority: 5,
              description: 'Restrict SSH access to admin server',
              createdBy: 'admin',
              createdAt: '2023-07-20T14:20:00Z',
              lastModified: '2023-07-20T14:20:00Z'
            }
          ]);
          
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Failed to load security operations data', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const alertColumns = [
    { key: 'id' as keyof SecurityAlert, label: 'ID' },
    { key: 'type' as keyof SecurityAlert, label: 'Type' },
    { 
      key: 'severity' as keyof SecurityAlert, 
      label: 'Severity',
      render: (value: string | string[] | number | boolean | undefined) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'critical' 
            ? 'bg-red-100 text-red-950'
            : value === 'high' 
              ? 'bg-orange-100 text-red-950'
              : value === 'medium'
                ? 'bg-yellow-100 text-red-950'
                : 'bg-blue-100 text-red-950'
        }border border-red-400 font-black`}>
          {value ? (value as string).charAt(0).toUpperCase() + (value as string).slice(1) : ''}
        </span>
      )
    },
    { key: 'description' as keyof SecurityAlert, label: 'Description' },
    { key: 'timestamp' as keyof SecurityAlert, label: 'Time' },
    { 
      key: 'status' as keyof SecurityAlert, 
      label: 'Status',
      render: (value: string | string[] | number | boolean | undefined) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'new' 
            ? 'bg-yellow-100 text-yellow-950'
            : value === 'investigating' 
              ? 'bg-blue-100 text-yellow-950'
              : value === 'resolved'
                ? 'bg-green-100 text-yellow-950'
                : 'bg-gray-100 text-yellow-950'
        }border border-yellow-400 font-black`}>
          {value ? (value as string).charAt(0).toUpperCase() + (value as string).slice(1) : ''}
        </span>
      )
    }
  ];

  const incidentColumns = [
    { key: 'id' as keyof SecurityIncident, label: 'ID' },
    { key: 'title' as keyof SecurityIncident, label: 'Title' },
    { 
      key: 'severity' as keyof SecurityIncident, 
      label: 'Severity',
      render: (value: string | string[] | number | boolean | undefined) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'critical' 
            ? 'bg-red-100 text-red-950'
            : value === 'high' 
              ? 'bg-orange-100 text-red-950'
              : value === 'medium'
                ? 'bg-yellow-100 text-red-950'
                : 'bg-blue-100 text-red-950'
        }border border-red-400 font-black`}>
          {value ? (value as string).charAt(0).toUpperCase() + (value as string).slice(1) : ''}
        </span>
      )
    },
    { 
      key: 'status' as keyof SecurityIncident, 
      label: 'Status',
      render: (value: string | string[] | number | boolean | undefined) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'open' 
            ? 'bg-yellow-100 text-yellow-950'
            : value === 'in_progress' 
              ? 'bg-blue-100 text-yellow-950'
              : value === 'resolved'
                ? 'bg-green-100 text-yellow-950'
                : 'bg-gray-100 text-yellow-950'
        }border border-yellow-400 font-black`}>
          {value ? (value as string).charAt(0).toUpperCase() + (value as string).slice(1) : ''}
        </span>
      )
    },
    { key: 'reportedAt' as keyof SecurityIncident, label: 'Reported' }
  ];

  const behaviorColumns = [
    { key: 'id' as keyof AnomalousBehavior, label: 'ID' },
    { key: 'userName' as keyof AnomalousBehavior, label: 'User' },
    { key: 'type' as keyof AnomalousBehavior, label: 'Type' },
    { 
      key: 'severity' as keyof AnomalousBehavior, 
      label: 'Severity',
      render: (value: string | string[] | number | boolean | undefined) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'critical' 
            ? 'bg-red-100 text-red-950'
            : value === 'high' 
              ? 'bg-orange-100 text-red-950'
              : value === 'medium'
                ? 'bg-yellow-100 text-red-950'
                : 'bg-blue-100 text-red-950'
        }border border-red-400 font-black`}>
          {value ? (value as string).charAt(0).toUpperCase() + (value as string).slice(1) : ''}
        </span>
      )
    },
    { key: 'description' as keyof AnomalousBehavior, label: 'Description' },
    { key: 'timestamp' as keyof AnomalousBehavior, label: 'Time' }
  ];

  const firewallColumns = [
    { key: 'name' as keyof FirewallRule, label: 'Name' },
    { key: 'action' as keyof FirewallRule, label: 'Action' },
    { key: 'sourceIp' as keyof FirewallRule, label: 'Source IP' },
    { key: 'destinationIp' as keyof FirewallRule, label: 'Destination IP' },
    { 
      key: 'enabled' as keyof FirewallRule, 
      label: 'Status',
      render: (value: string | string[] | number | boolean | undefined) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value 
            ? 'bg-green-100 text-green-950'
            : 'bg-red-100 text-green-950'
        }border border-green-400 font-black`}>
          {value ? 'Enabled' : 'Disabled'}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Operations Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time monitoring and management of security operations
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
        <h1 className="text-2xl font-bold text-gray-900">Security Operations Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Real-time monitoring and management of security operations
        </p>
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

      {/* Security Alerts and Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card title="Recent Security Alerts">
            <DataTable
              columns={alertColumns}
              data={recentAlerts}
              isLoading={false}
              emptyMessage="No recent security alerts"
            />
          </Card>
        </div>
        <div>
          <Card title="Active Security Incidents">
            <DataTable
              columns={incidentColumns}
              data={recentIncidents}
              isLoading={false}
              emptyMessage="No active security incidents"
            />
          </Card>
        </div>
      </div>

      {/* Anomalous Behaviors and Firewall Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card title="Anomalous Behaviors">
            <DataTable
              columns={behaviorColumns}
              data={anomalousBehaviors}
              isLoading={false}
              emptyMessage="No anomalous behaviors detected"
            />
          </Card>
        </div>
        <div>
          <Card title="Active Firewall Rules">
            <DataTable
              columns={firewallColumns}
              data={firewallRules}
              isLoading={false}
              emptyMessage="No firewall rules configured"
            />
          </Card>
        </div>
      </div>

      {/* Security Controls */}
      {securityStatusMessage && (
        <div className="bg-slate-100 border border-slate-300 text-slate-900 px-4 py-3 rounded-md mb-6 font-semibold flex items-center justify-between">
          <span>{securityStatusMessage}</span>
          <button 
            onClick={() => setSecurityStatusMessage(null)}
            className="text-slate-700 hover:text-slate-900 font-bold ml-4"
          >
            ×
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Security Controls">
          <div className="space-y-4">
            <button 
              onClick={handleEmergencyLockdown}
              className={`w-full ${isLockdownActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-600 hover:bg-red-700'} text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center font-medium`}>
              <Lock className="h-4 w-4 mr-2" />
              {isLockdownActive ? 'Release Lockdown' : 'Emergency Lockdown'}
            </button>
            <button 
              onClick={handleRunSecurityScan}
              disabled={isScanning}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-200 flex items-center justify-center font-medium disabled:opacity-50">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {isScanning ? 'Scanning Cluster...' : 'Run Security Scan'}
            </button>
            <button 
              onClick={handleSecuritySettings}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 flex items-center justify-center font-medium">
              <Settings className="h-4 w-4 mr-2" />
              Security Settings
            </button>
          </div>
        </Card>
        <Card title="Risk Assessment">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Critical Risks</span>
              <span className="font-medium text-red-600">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">High Risks</span>
              <span className="font-medium text-orange-600">7</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Medium Risks</span>
              <span className="font-medium text-yellow-600">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Security Score</span>
              <span className="font-medium text-green-600">87%</span>
            </div>
          </div>
        </Card>
        <Card title="Security Statistics">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Blocked IPs</span>
              <span className="font-medium">42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quarantined Files</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Policies</span>
              <span className="font-medium">18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Scan</span>
              <span className="font-medium">2h ago</span>
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

export default SecurityOperationsDashboard;