import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Eye, 
  EyeOff, 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  Pause,
  Settings,
  Zap,
  Network,
  Server,
  Wifi,
  Users,
  TrendingUp,
  Filter,
  Search,
  MoreHorizontal,
  Ban,
  ShieldCheck,
  Bug,
  Scan,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SecurityEvent {
  id: number;
  userId?: number | null;
  userName: string;
  action: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ipAddress: string;
  userAgent: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  resolvedBy?: number;
  resolutionNotes?: string;
}

interface ThreatDetection {
  id: number;
  type: string;
  sourceIp: string;
  targetEndpoint: string;
  confidence: number;
  timestamp: string;
  status: 'detected' | 'analyzed' | 'mitigated' | 'false_positive';
  details: any;
}

interface SecurityPolicy {
  id: number;
  name: string;
  description: string;
  type: string;
  configuration: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const SecurityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'threats' | 'policies' | 'monitoring' | 'incidents'>('events');
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [threats, setThreats] = useState<ThreatDetection[]>([]);
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>([]);
  const [filteredThreats, setFilteredThreats] = useState<ThreatDetection[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<SecurityPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [securityStats, setSecurityStats] = useState<any>(null);
  const [monitoringData, setMonitoringData] = useState<any>(null);

  const navigate = useNavigate();
  const history = { push: (path: string) => navigate(path), replace: (path: string) => navigate(path, { replace: true }) };

  // Simulate loading security data
  useEffect(() => {
    const fetchSecurityData = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        const mockEvents: SecurityEvent[] = [
          {
            id: 1,
            userId: 1,
            userName: 'john_doe',
            action: 'failed_login_attempt',
            severity: 'medium',
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 Chrome/91.0',
            description: 'Multiple failed login attempts from same IP',
            timestamp: '2024-10-09T10:30:00Z',
            resolved: false
          },
          {
            id: 2,
            userId: 2,
            userName: 'jane_smith',
            action: 'suspicious_activity',
            severity: 'high',
            ipAddress: '203.0.113.45',
            userAgent: 'Mozilla/5.0 Safari/14.0',
            description: 'Unusual login from new device/location',
            timestamp: '2024-10-09T09:15:00Z',
            resolved: true,
            resolvedBy: 1,
            resolutionNotes: 'User confirmed activity was legitimate'
          },
          {
            id: 3,
            userId: null,
            userName: 'Unknown',
            action: 'brute_force_attack',
            severity: 'critical',
            ipAddress: '198.51.100.23',
            userAgent: 'Automated script',
            description: 'Massive number of login attempts detected',
            timestamp: '2024-10-09T08:45:00Z',
            resolved: true,
            resolvedBy: 1,
            resolutionNotes: 'IP blocked automatically'
          },
          {
            id: 4,
            userId: 3,
            userName: 'bob_johnson',
            action: 'unusual_behavior',
            severity: 'medium',
            ipAddress: '192.168.1.150',
            userAgent: 'Mozilla/5.0 Firefox/89.0',
            description: 'Accessing restricted areas of the platform',
            timestamp: '2024-10-09T07:30:00Z',
            resolved: false
          }
        ];

        const mockThreats: ThreatDetection[] = [
          {
            id: 1,
            type: 'DDoS Attack',
            sourceIp: '198.51.100.23',
            targetEndpoint: '/api/login',
            confidence: 95,
            timestamp: '2024-10-09T08:45:00Z',
            status: 'mitigated',
            details: { attackVector: 'volume_based', duration: '45 minutes', peakRequests: 12000 }
          },
          {
            id: 2,
            type: 'SQL Injection',
            sourceIp: '203.0.113.67',
            targetEndpoint: '/api/search',
            confidence: 87,
            timestamp: '2024-10-09T07:30:00Z',
            status: 'analyzed',
            details: { payload: "' OR '1'='1", blocked: true }
          },
          {
            id: 3,
            type: 'XSS Attempt',
            sourceIp: '192.0.2.89',
            targetEndpoint: '/api/comment',
            confidence: 78,
            timestamp: '2024-10-09T06:15:00Z',
            status: 'detected',
            details: { payload: '<script>alert("XSS")</script>', blocked: true }
          }
        ];

        const mockPolicies: SecurityPolicy[] = [
          {
            id: 1,
            name: 'Brute Force Protection',
            description: 'Prevent brute force attacks by limiting login attempts',
            type: 'rate_limiting',
            configuration: { maxAttempts: 5, lockoutPeriod: 900 },
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-10-01T00:00:00Z'
          },
          {
            id: 2,
            name: 'Password Policy',
            description: 'Enforce strong password requirements',
            type: 'authentication',
            configuration: { minLength: 8, requireNumbers: true, requireSymbols: true },
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-09-15T00:00:00Z'
          },
          {
            id: 3,
            name: 'Session Timeout',
            description: 'Automatically expire sessions after inactivity',
            type: 'session_management',
            configuration: { timeoutMinutes: 30 },
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-08-20T00:00:00Z'
          }
        ];

        const mockStats = {
          totalIncidents: 125,
          openIncidents: 8,
          closedIncidents: 117,
          criticalIncidents: 3,
          highSeverityIncidents: 12,
          activeThreats: 3,
          securityScore: 92,
          lastScan: '2024-10-09T10:00:00Z',
          vulnerabilitiesDetected: 7
        };

        const mockMonitoring = {
          firewallStatus: 'active',
          intrusionDetection: 'active',
          anomalyDetection: 'active',
          activeBlocks: 5,
          alertsGenerated: 24,
          complianceStatus: 'compliant',
          certificateExpiry: '2024-12-31T23:59:59Z',
          lastBackup: '2024-10-08T23:30:00Z'
        };

        setSecurityEvents(mockEvents);
        setThreats(mockThreats);
        setPolicies(mockPolicies);
        setFilteredEvents(mockEvents);
        setFilteredThreats(mockThreats);
        setFilteredPolicies(mockPolicies);
        setSecurityStats(mockStats);
        setMonitoringData(mockMonitoring);
        setLoading(false);
      }, 1000);
    };

    fetchSecurityData();
  }, []);

  // Filter data based on active tab and filters
  useEffect(() => {
    if (activeTab === 'events') {
      let result = securityEvents;

      if (searchTerm) {
        result = result.filter(item => 
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.ipAddress.includes(searchTerm) ||
          item.userName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterSeverity !== 'all') {
        result = result.filter(item => item.severity === filterSeverity);
      }

      setFilteredEvents(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'threats') {
      let result = threats;

      if (searchTerm) {
        result = result.filter(item => 
          item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sourceIp.includes(searchTerm) ||
          item.targetEndpoint.includes(searchTerm)
        );
      }

      if (filterStatus !== 'all') {
        result = result.filter(item => item.status === filterStatus);
      }

      setFilteredThreats(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'policies') {
      let result = policies;

      if (searchTerm) {
        result = result.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterStatus !== 'all') {
        const isActive = filterStatus === 'active';
        result = result.filter(item => item.isActive === isActive);
      }

      setFilteredPolicies(result);
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [searchTerm, filterSeverity, filterStatus, activeTab, securityEvents, threats, policies]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  let currentItems: any[] = [];
  let totalPages = 0;
  
  if (activeTab === 'events') {
    currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  } else if (activeTab === 'threats') {
    currentItems = filteredThreats.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredThreats.length / itemsPerPage);
  } else if (activeTab === 'policies') {
    currentItems = filteredPolicies.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  }

  const handleResolveEvent = async (eventId: number) => {
    try {
      // In a real implementation, this would call the API to resolve an event
      console.log('Resolving event:', eventId);
      setSecurityEvents(securityEvents.map(event => 
        event.id === eventId ? {...event, resolved: true, resolvedBy: 1} : event
      ));
      setFilteredEvents(filteredEvents.map(event => 
        event.id === eventId ? {...event, resolved: true, resolvedBy: 1} : event
      ));
    } catch (error) {
      console.error('Error resolving event:', error);
    }
  };

  const handleTogglePolicy = async (policyId: number) => {
    try {
      // In a real implementation, this would call the API to toggle a policy
      console.log('Toggling policy:', policyId);
      setPolicies(policies.map(policy => 
        policy.id === policyId ? {...policy, isActive: !policy.isActive} : policy
      ));
      setFilteredPolicies(filteredPolicies.map(policy => 
        policy.id === policyId ? {...policy, isActive: !policy.isActive} : policy
      ));
    } catch (error) {
      console.error('Error toggling policy:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'detected': return 'bg-yellow-100 text-yellow-800';
      case 'analyzed': return 'bg-blue-100 text-blue-800';
      case 'mitigated': return 'bg-green-100 text-green-800';
      case 'false_positive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">Security Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                <Scan className="h-4 w-4 mr-1" />
                Run Security Scan
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {securityStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open Incidents</p>
                  <p className="text-2xl font-semibold text-gray-900">{securityStats.openIncidents}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <Shield className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Threats</p>
                  <p className="text-2xl font-semibold text-gray-900">{securityStats.activeThreats}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Security Score</p>
                  <p className="text-2xl font-semibold text-gray-900">{securityStats.securityScore}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Bug className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Vulnerabilities</p>
                  <p className="text-2xl font-semibold text-gray-900">{securityStats.vulnerabilitiesDetected}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('events')}
              className={`${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Activity className="h-4 w-4 mr-2" />
              Security Events
            </button>
            <button
              onClick={() => setActiveTab('threats')}
              className={`${
                activeTab === 'threats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Threat Detection
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`${
                activeTab === 'policies'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Security Policies
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`${
                activeTab === 'monitoring'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Network className="h-4 w-4 mr-2" />
              Monitoring
            </button>
            <button
              onClick={() => setActiveTab('incidents')}
              className={`${
                activeTab === 'incidents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Incidents
            </button>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search security data..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="detected">Detected</option>
              <option value="analyzed">Analyzed</option>
              <option value="mitigated">Mitigated</option>
              <option value="false_positive">False Positive</option>
            </select>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                {activeTab === 'events' ? `${filteredEvents.length} events` : 
                 activeTab === 'threats' ? `${filteredThreats.length} threats` : 
                 `${filteredPolicies.length} policies`}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Security Events Tab */}
            {activeTab === 'events' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IP Address
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Severity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                            No security events found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as SecurityEvent[]).map((event) => (
                          <tr key={event.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 capitalize">{event.action.replace(/_/g, ' ')}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{event.userName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {event.ipAddress}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                                {event.severity}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {event.resolved ? 'Resolved' : 'Open'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(event.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                {!event.resolved && (
                                  <button 
                                    className="text-green-600 hover:text-green-900"
                                    onClick={() => handleResolveEvent(event.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                )}
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/security/events/${event.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/security/events/${event.id}/analysis`)}
                                    >
                                      Analyze Event
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/security/events/${event.id}/report`)}
                                    >
                                      Generate Report
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Threat Detection Tab */}
            {activeTab === 'threats' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Threat Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Source IP
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Target Endpoint
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Confidence
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                            No threats detected
                          </td>
                        </tr>
                      ) : (
                        (currentItems as ThreatDetection[]).map((threat) => (
                          <tr key={threat.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 capitalize">{threat.type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {threat.sourceIp}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {threat.targetEndpoint}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-green-500" 
                                    style={{ width: `${threat.confidence}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2">{threat.confidence}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(threat.status)}`}>
                                {threat.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(threat.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/security/threats/${threat.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => {
                                    // Block IP
                                    console.log('Blocking IP:', threat.sourceIp);
                                  }}
                                >
                                  <Ban className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/security/threats/${threat.id}/analysis`)}
                                    >
                                      Deep Analysis
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/security/threats/${threat.id}/mitigation`)}
                                    >
                                      Mitigation Plan
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Security Policies Tab */}
            {activeTab === 'policies' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Policy Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            No security policies found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as SecurityPolicy[]).map((policy) => (
                          <tr key={policy.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {policy.type.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                              {policy.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${policy.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {policy.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(policy.updatedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className={`${policy.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                  onClick={() => handleTogglePolicy(policy.id)}
                                >
                                  {policy.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                </button>
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/security/policies/${policy.id}/edit`)}
                                >
                                  <Settings className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/security/policies/${policy.id}/details`)}
                                    >
                                      View Details
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/security/policies/${policy.id}/compliance`)}
                                    >
                                      Compliance Report
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Monitoring Tab */}
            {activeTab === 'monitoring' && monitoringData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-green-100">
                        <ShieldCheck className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Firewall Status</p>
                        <p className={`text-lg font-semibold ${monitoringData.firewallStatus === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                          {monitoringData.firewallStatus.charAt(0).toUpperCase() + monitoringData.firewallStatus.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-green-100">
                        <Zap className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Intrusion Detection</p>
                        <p className={`text-lg font-semibold ${monitoringData.intrusionDetection === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                          {monitoringData.intrusionDetection.charAt(0).toUpperCase() + monitoringData.intrusionDetection.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-green-100">
                        <Network className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Anomaly Detection</p>
                        <p className={`text-lg font-semibold ${monitoringData.anomalyDetection === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                          {monitoringData.anomalyDetection.charAt(0).toUpperCase() + monitoringData.anomalyDetection.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Blocks</span>
                        <span className="font-medium">{monitoringData.activeBlocks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alerts Generated (24h)</span>
                        <span className="font-medium">{monitoringData.alertsGenerated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Compliance Status</span>
                        <span className={`font-medium ${monitoringData.complianceStatus === 'compliant' ? 'text-green-600' : 'text-red-600'}`}>
                          {monitoringData.complianceStatus.charAt(0).toUpperCase() + monitoringData.complianceStatus.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Certificate Expiry</span>
                        <span className="font-medium">{new Date(monitoringData.certificateExpiry).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Security Scan</span>
                        <span>{new Date(securityStats?.lastScan).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Backup</span>
                        <span>{new Date(monitoringData.lastBackup).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Update</span>
                        <span>{new Date().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">System Uptime</span>
                        <span>99.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Incidents Tab */}
            {activeTab === 'incidents' && securityStats && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Incident Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Incidents</span>
                        <span className="font-medium">{securityStats.totalIncidents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Open Incidents</span>
                        <span className="font-medium text-red-600">{securityStats.openIncidents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Closed Incidents</span>
                        <span className="font-medium text-green-600">{securityStats.closedIncidents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resolved This Month</span>
                        <span className="font-medium">{securityStats.closedIncidents}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Severity Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Critical</span>
                        <span className="font-medium text-red-600">{securityStats.criticalIncidents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">High</span>
                        <span className="font-medium text-orange-600">{securityStats.highSeverityIncidents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Medium</span>
                        <span className="font-medium text-yellow-600">35</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Low</span>
                        <span className="font-medium text-green-600">75</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Most Common Types</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Failed Login Attempts</span>
                        <span className="font-medium">45</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Suspicious Activity</span>
                        <span className="font-medium">32</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Brute Force Attacks</span>
                        <span className="font-medium">18</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Malware Detection</span>
                        <span className="font-medium">15</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Incident Timeline</h3>
                  <div className="h-64 flex items-center justify-center">
                    <TrendingUp className="h-16 w-16 text-gray-300" />
                    <p className="ml-4 text-gray-500">Incident timeline visualization would appear here</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {['events', 'threats', 'policies'].includes(activeTab) && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastItem, (activeTab === 'events' ? filteredEvents : activeTab === 'threats' ? filteredThreats : filteredPolicies).length)}</span> of{' '}
                  <span className="font-medium">{(activeTab === 'events' ? filteredEvents : activeTab === 'threats' ? filteredThreats : filteredPolicies).length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-1" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-400' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-400' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SecurityPage;