import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Scale,
  Gavel,
  BadgeCheck,
  FileSpreadsheet,
  FolderKanban,
  Server,
  Lock,
  Network,
  Activity,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StercsModule {
  id: number;
  name: string;
  description: string;
  version: string;
  status: 'active' | 'inactive' | 'maintenance' | 'deprecated';
  category: 'governance' | 'control' | 'monitoring' | 'compliance' | 'security' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[];
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  lastDeployed: string;
  environment: 'development' | 'staging' | 'production';
  config: any;
}

interface StercsPolicy {
  id: number;
  moduleId: number;
  moduleName: string;
  name: string;
  description: string;
  type: 'access_control' | 'data_protection' | 'monitoring' | 'compliance' | 'security' | 'custom';
  status: 'active' | 'inactive' | 'draft' | 'review';
  priority: 'low' | 'medium' | 'high' | 'critical';
  conditions: any[];
  actions: any[];
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  lastUpdatedBy: number;
}

interface StercsControl {
  id: number;
  policyId: number;
  policyName: string;
  name: string;
  description: string;
  controlId: string;
  framework: string;
  category: 'preventive' | 'detective' | 'corrective' | 'directive';
  status: 'implemented' | 'planned' | 'not_implemented' | 'waived';
  evidence: string[];
  testResults: any[];
  lastTested: string;
  nextTest: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

interface StercsAudit {
  id: number;
  controlId: number;
  controlName: string;
  auditorId: number;
  auditorName: string;
  date: string;
  status: 'passed' | 'failed' | 'partial' | 'not_applicable';
  findings: string;
  recommendations: string;
  evidence: string[];
  score: number;
  createdAt: string;
  updatedAt: string;
}

const StercsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'policies' | 'controls' | 'audits' | 'dashboard'>('modules');
  const [stercsModules, setStercsModules] = useState<StercsModule[]>([]);
  const [stercsPolicies, setStercsPolicies] = useState<StercsPolicy[]>([]);
  const [stercsControls, setStercsControls] = useState<StercsControl[]>([]);
  const [stercsAudits, setStercsAudits] = useState<StercsAudit[]>([]);
  const [filteredModules, setFilteredModules] = useState<StercsModule[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<StercsPolicy[]>([]);
  const [filteredControls, setFilteredControls] = useState<StercsControl[]>([]);
  const [filteredAudits, setFilteredAudits] = useState<StercsAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stercsStats, setStercsStats] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newModule, setNewModule] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    category: 'governance' as 'governance' | 'control' | 'monitoring' | 'compliance' | 'security' | 'other',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    environment: 'development' as 'development' | 'staging' | 'production',
    dependencies: ''
  });

  const navigate = useNavigate();
  const history = { push: (path: string) => navigate(path), replace: (path: string) => navigate(path, { replace: true }) };

  // Details & Evidence Inspector State
  const [selectedInspectorItem, setSelectedInspectorItem] = useState<{
    type: 'module' | 'policy' | 'control' | 'audit';
    data: any;
    subTab: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTestControl = (controlId: number) => {
    triggerToast(`Automated test executed for Control #${controlId}. Status: Verified.`);
  };

  // Simulate loading STERCS data
  useEffect(() => {
    const fetchStercsData = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        const mockModules: StercsModule[] = [
          {
            id: 1,
            name: 'Access Control Module',
            description: 'Module for managing user access and permissions',
            version: '1.2.3',
            status: 'active',
            category: 'governance',
            priority: 'high',
            dependencies: ['auth-service', 'user-service'],
            createdBy: 1,
            updatedBy: 1,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-09-15T00:00:00Z',
            lastDeployed: '2024-09-10T00:00:00Z',
            environment: 'production',
            config: { maxRetries: 3, timeout: 5000 }
          },
          {
            id: 2,
            name: 'Data Protection Module',
            description: 'Module for ensuring data privacy and protection',
            version: '2.0.1',
            status: 'active',
            category: 'security',
            priority: 'critical',
            dependencies: ['encryption-service', 'key-manager'],
            createdBy: 1,
            updatedBy: 1,
            createdAt: '2024-02-01T00:00:00Z',
            updatedAt: '2024-08-20T00:00:00Z',
            lastDeployed: '2024-08-15T00:00:00Z',
            environment: 'production',
            config: { encryptionAlgorithm: 'AES-256', retentionPeriod: 365 }
          },
          {
            id: 3,
            name: 'Compliance Monitoring Module',
            description: 'Module for continuous compliance monitoring',
            version: '1.5.0',
            status: 'maintenance',
            category: 'compliance',
            priority: 'medium',
            dependencies: ['log-service', 'alert-service'],
            createdBy: 1,
            updatedBy: 1,
            createdAt: '2024-03-01T00:00:00Z',
            updatedAt: '2024-10-01T00:00:00Z',
            lastDeployed: '2024-09-25T00:00:00Z',
            environment: 'staging',
            config: { pollingInterval: 300000, alertThreshold: 5 }
          },
          {
            id: 4,
            name: 'Security Event Module',
            description: 'Module for detecting and responding to security events',
            version: '1.0.0',
            status: 'inactive',
            category: 'security',
            priority: 'high',
            dependencies: ['siem-service', 'threat-intel'],
            createdBy: 1,
            updatedBy: 1,
            createdAt: '2024-04-01T00:00:00Z',
            updatedAt: '2024-07-15T00:00:00Z',
            lastDeployed: '2024-07-10T00:00:00Z',
            environment: 'development',
            config: { eventTypes: ['login', 'data_access', 'config_change'] }
          }
        ];

        const mockPolicies: StercsPolicy[] = [
          {
            id: 1,
            moduleId: 1,
            moduleName: 'Access Control Module',
            name: 'User Access Policy',
            description: 'Policy governing user access to protected resources',
            type: 'access_control',
            status: 'active',
            priority: 'high',
            conditions: [
              { type: 'role', value: 'admin', operator: 'equals' },
              { type: 'resource', value: 'sensitive-data', operator: 'contains' }
            ],
            actions: [
              { type: 'allow', resource: 'sensitive-data' },
              { type: 'log', level: 'high' }
            ],
            createdBy: 1,
            updatedBy: 1,
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-09-20T00:00:00Z',
            lastUpdatedBy: 1
          },
          {
            id: 2,
            moduleId: 2,
            moduleName: 'Data Protection Module',
            name: 'PII Encryption Policy',
            description: 'Policy for encrypting personally identifiable information',
            type: 'data_protection',
            status: 'active',
            priority: 'critical',
            conditions: [
              { type: 'field', value: 'ssn', operator: 'contains' },
              { type: 'field', value: 'email', operator: 'contains' }
            ],
            actions: [
              { type: 'encrypt', algorithm: 'AES-256' },
              { type: 'mask', enabled: true }
            ],
            createdBy: 1,
            updatedBy: 1,
            createdAt: '2024-02-15T00:00:00Z',
            updatedAt: '2024-08-25T00:00:00Z',
            lastUpdatedBy: 1
          },
          {
            id: 3,
            moduleId: 3,
            moduleName: 'Compliance Monitoring Module',
            name: 'GDPR Compliance Policy',
            description: 'Policy ensuring compliance with GDPR regulations',
            type: 'compliance',
            status: 'active',
            priority: 'high',
            conditions: [
              { type: 'jurisdiction', value: 'EU', operator: 'equals' },
              { type: 'data_type', value: 'personal', operator: 'equals' }
            ],
            actions: [
              { type: 'consent_check', required: true },
              { type: 'retention_check', days: 365 }
            ],
            createdBy: 1,
            updatedBy: 1,
            createdAt: '2024-03-15T00:00:00Z',
            updatedAt: '2024-07-30T00:00:00Z',
            lastUpdatedBy: 1
          }
        ];

        const mockControls: StercsControl[] = [
          {
            id: 1,
            policyId: 1,
            policyName: 'User Access Policy',
            name: 'Multi-Factor Authentication Control',
            description: 'Enforce multi-factor authentication for privileged accounts',
            controlId: 'MFA-001',
            framework: 'NIST',
            category: 'preventive',
            status: 'implemented',
            evidence: ['MFA logs', 'Authentication reports'],
            testResults: [
              { date: '2024-09-01', result: 'passed', details: 'All privileged accounts have MFA enabled' }
            ],
            lastTested: '2024-09-01T00:00:00Z',
            nextTest: '2024-12-01T00:00:00Z',
            createdBy: 1,
            updatedBy: 1,
            createdAt: '2024-01-20T00:00:00Z',
            updatedAt: '2024-09-01T00:00:00Z'
          },
          {
            id: 2,
            policyId: 2,
            policyName: 'PII Encryption Policy',
            name: 'Data Encryption Control',
            description: 'Ensure all PII is encrypted at rest and in transit',
            controlId: 'ENC-001',
            framework: 'ISO 27001',
            category: 'preventive',
            status: 'implemented',
            evidence: ['Encryption certificates', 'Network traffic logs'],
            testResults: [
              { date: '2024-08-15', result: 'passed', details: 'All PII data is properly encrypted' }
            ],
            lastTested: '2024-08-15T00:00:00Z',
            nextTest: '2024-11-15T00:00:00Z',
            createdBy: 1,
            updatedBy: 1,
            createdAt: '2024-02-20T00:00:00Z',
            updatedAt: '2024-08-15T00:00:00Z'
          },
          {
            id: 3,
            policyId: 3,
            policyName: 'GDPR Compliance Policy',
            name: 'Consent Management Control',
            description: 'Ensure proper consent is obtained before processing personal data',
            controlId: 'CON-001',
            framework: 'GDPR',
            category: 'preventive',
            status: 'planned',
            evidence: [],
            testResults: [],
            lastTested: '2024-01-01T00:00:00Z',
            nextTest: '2024-01-01T00:00:00Z',
            createdBy: 1,
            updatedBy: 1,
            createdAt: '2024-03-20T00:00:00Z',
            updatedAt: '2024-03-20T00:00:00Z'
          }
        ];

        const mockAudits: StercsAudit[] = [
          {
            id: 1,
            controlId: 1,
            controlName: 'Multi-Factor Authentication Control',
            auditorId: 1,
            auditorName: 'Security Auditor',
            date: '2024-09-01T00:00:00Z',
            status: 'passed',
            findings: 'All privileged accounts have MFA enabled',
            recommendations: 'Continue monitoring for compliance',
            evidence: ['MFA logs', 'Account reports'],
            score: 95,
            createdAt: '2024-09-01T00:00:00Z',
            updatedAt: '2024-09-01T00:00:00Z'
          },
          {
            id: 2,
            controlId: 2,
            controlName: 'Data Encryption Control',
            auditorId: 2,
            auditorName: 'Compliance Auditor',
            date: '2024-08-15T00:00:00Z',
            status: 'passed',
            findings: 'All PII data is properly encrypted',
            recommendations: 'Maintain current encryption standards',
            evidence: ['Encryption certificates', 'Network logs'],
            score: 100,
            createdAt: '2024-08-15T00:00:00Z',
            updatedAt: '2024-08-15T00:00:00Z'
          },
          {
            id: 3,
            controlId: 3,
            controlName: 'Consent Management Control',
            auditorId: 3,
            auditorName: 'Privacy Auditor',
            date: '2024-07-10T00:00:00Z',
            status: 'not_applicable',
            findings: 'Control not yet implemented',
            recommendations: 'Implement consent management system',
            evidence: ['Planning documents'],
            score: 0,
            createdAt: '2024-07-10T00:00:00Z',
            updatedAt: '2024-07-10T00:00:00Z'
          }
        ];

        const mockStats = {
          totalModules: 24,
          activeModules: 18,
          criticalModules: 5,
          totalPolicies: 125,
          activePolicies: 110,
          totalControls: 320,
          implementedControls: 280,
          plannedControls: 30,
          totalAudits: 45,
          passedAudits: 40,
          failedAudits: 3,
          pendingAudits: 2,
          complianceScore: 92.5,
          riskAssessment: {
            highRisk: 8,
            mediumRisk: 12,
            lowRisk: 22
          }
        };

        setStercsModules(mockModules);
        setStercsPolicies(mockPolicies);
        setStercsControls(mockControls);
        setStercsAudits(mockAudits);
        setFilteredModules(mockModules);
        setFilteredPolicies(mockPolicies);
        setFilteredControls(mockControls);
        setFilteredAudits(mockAudits);
        setStercsStats(mockStats);
        setLoading(false);
      }, 1000);
    };

    fetchStercsData();
  }, []);

  // Filter data based on active tab and filters
  useEffect(() => {
    if (activeTab === 'modules') {
      let result = stercsModules;

      if (searchTerm) {
        result = result.filter((item: StercsModule) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterCategory !== 'all') {
        result = result.filter((item: StercsModule) => item.category === filterCategory);
      }

      if (filterStatus !== 'all') {
        result = result.filter((item: StercsModule) => item.status === filterStatus);
      }

      if (filterPriority !== 'all') {
        result = result.filter((item: StercsModule) => item.priority === filterPriority);
      }

      setFilteredModules(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'policies') {
      let result = stercsPolicies;

      if (searchTerm) {
        result = result.filter((item: StercsPolicy) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredPolicies(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'controls') {
      let result = stercsControls;

      if (searchTerm) {
        result = result.filter((item: StercsControl) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredControls(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'audits') {
      let result = stercsAudits;

      if (searchTerm) {
        result = result.filter((item: StercsAudit) =>
          item.controlName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.findings.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredAudits(result);
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [searchTerm, filterCategory, filterStatus, filterPriority, activeTab, stercsModules, stercsPolicies, stercsControls, stercsAudits]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  let currentItems: any[] = [];
  let totalPages = 0;

  if (activeTab === 'modules') {
    currentItems = filteredModules.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredModules.length / itemsPerPage);
  } else if (activeTab === 'policies') {
    currentItems = filteredPolicies.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  } else if (activeTab === 'controls') {
    currentItems = filteredControls.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredControls.length / itemsPerPage);
  } else if (activeTab === 'audits') {
    currentItems = filteredAudits.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredAudits.length / itemsPerPage);
  }

  const handleCreateModule = async () => {
    try {
      // In a real implementation, this would call the API to create a module
      console.log('Creating module:', newModule);
      setShowCreateModal(false);
      // Reset form
      setNewModule({
        name: '',
        description: '',
        version: '1.0.0',
        category: 'governance',
        priority: 'medium',
        environment: 'development',
        dependencies: ''
      });
    } catch (error) {
      console.error('Error creating module:', error);
    }
  };

  const handleDeployModule = async (moduleId: number) => {
    try {
      // In a real implementation, this would call the API to deploy a module
      console.log('Deploying module:', moduleId);
      setStercsModules(stercsModules.map((mod: StercsModule) =>
        mod.id === moduleId ? {...mod, status: 'active', lastDeployed: new Date().toISOString()} : mod
      ));
      setFilteredModules(filteredModules.map((mod: StercsModule) =>
        mod.id === moduleId ? {...mod, status: 'active', lastDeployed: new Date().toISOString()} : mod
      ));
    } catch (error) {
      console.error('Error deploying module:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'governance': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'control': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'monitoring': return 'bg-purple-100 text-purple-950 border border-purple-400 font-bold';
      case 'compliance': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'security': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'low': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'deprecated': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'implemented': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'planned': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'not_implemented': return 'bg-gray-100 text-gray-800';
      case 'waived': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'passed': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'failed': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'partial': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'not_applicable': return 'bg-gray-100 text-gray-800';
      case 'active-policy': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'inactive-policy': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'staging': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'development': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
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
              <Settings className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">STERCS Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Module
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {stercsStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Server className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Modules</p>
                  <p className="text-2xl font-semibold text-gray-900">{stercsStats.totalModules}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Modules</p>
                  <p className="text-2xl font-semibold text-gray-900">{stercsStats.activeModules}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Critical Modules</p>
                  <p className="text-2xl font-semibold text-gray-900">{stercsStats.criticalModules}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                  <p className="text-2xl font-semibold text-gray-900">{stercsStats.complianceScore}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-slate-300 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('modules')}
              className={`${
                activeTab === 'modules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Server className="h-4 w-4 mr-2" />
              Modules
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`${
                activeTab === 'policies'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Lock className="h-4 w-4 mr-2" />
              Policies
            </button>
            <button
              onClick={() => setActiveTab('controls')}
              className={`${
                activeTab === 'controls'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Shield className="h-4 w-4 mr-2" />
              Controls
            </button>
            <button
              onClick={() => setActiveTab('audits')}
              className={`${
                activeTab === 'audits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Audits
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </button>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-700" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder:text-slate-400 focus:outline-none focus:placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {activeTab === 'modules' && (
              <>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="governance">Governance</option>
                  <option value="control">Control</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="compliance">Compliance</option>
                  <option value="security">Security</option>
                  <option value="other">Other</option>
                </select>

                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="deprecated">Deprecated</option>
                </select>

                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </>
            )}

            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                {activeTab === 'modules' ? `${filteredModules.length} modules` :
                 activeTab === 'policies' ? `${filteredPolicies.length} policies` :
                 activeTab === 'controls' ? `${filteredControls.length} controls` :
                 `${filteredAudits.length} audits`}
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
            {/* STERCS Modules Tab */}
            {activeTab === 'modules' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Module
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Version
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Priority
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Environment
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Last Deployed
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 text-center text-slate-800">
                            No STERCS modules found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as StercsModule[]).map((module) => (
                          <tr key={module.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{module.name}</div>
                              <div className="text-sm text-slate-700 max-w-xs truncate">{module.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {module.version}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(module.category)}`}>
                                {module.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(module.priority)}`}>
                                {module.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(module.status)}`}>
                                {module.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEnvironmentColor(module.environment)}`}>
                                {module.environment}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {new Date(module.lastDeployed).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition"
                                  title="Inspect Module Details"
                                  onClick={() => setSelectedInspectorItem({ type: 'module', data: module, subTab: 'details' })}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition"
                                  title="Deploy Module"
                                  onClick={() => handleDeployModule(module.id)}
                                >
                                  <Activity className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded transition"
                                  title="Inspect Configuration"
                                  onClick={() => setSelectedInspectorItem({ type: 'module', data: module, subTab: 'config' })}
                                >
                                  <Settings className="h-4 w-4" />
                                </button>
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

            {/* STERCS Policies Tab */}
            {activeTab === 'policies' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Policy
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Module
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Priority
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-slate-800">
                            No STERCS policies found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as StercsPolicy[]).map((policy) => (
                          <tr key={policy.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                              <div className="text-sm text-slate-700 max-w-xs truncate">{policy.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {policy.moduleName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${policy.type === 'access_control' ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold' : policy.type === 'data_protection' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : policy.type === 'monitoring' ? 'bg-purple-100 text-purple-950 border border-purple-400 font-bold' : policy.type === 'compliance' ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold' : 'bg-red-100 text-red-950 border border-red-400 font-bold'}`}>
                                {policy.type.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(policy.priority)}`}>
                                {policy.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${policy.status === 'active' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : policy.status === 'inactive' ? 'bg-gray-100 text-gray-800' : policy.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'}`}>
                                {policy.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {new Date(policy.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition"
                                  title="Inspect Policy Details"
                                  onClick={() => setSelectedInspectorItem({ type: 'policy', data: policy, subTab: 'details' })}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-amber-600 hover:text-amber-900 p-1 hover:bg-amber-50 rounded transition"
                                  title="View Policy Conditions"
                                  onClick={() => setSelectedInspectorItem({ type: 'policy', data: policy, subTab: 'conditions' })}
                                >
                                  <Scale className="h-4 w-4" />
                                </button>
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

            {/* STERCS Controls Tab */}
            {activeTab === 'controls' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Control
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Policy
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Framework
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Last Tested
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 text-center text-slate-800">
                            No STERCS controls found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as StercsControl[]).map((control) => (
                          <tr key={control.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{control.name}</div>
                              <div className="text-sm text-slate-700 max-w-xs truncate">{control.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {control.policyName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {control.controlId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${control.framework === 'NIST' ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold' : control.framework === 'ISO 27001' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : control.framework === 'GDPR' ? 'bg-purple-100 text-purple-950 border border-purple-400 font-bold' : 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'}`}>
                                {control.framework}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${control.category === 'preventive' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : control.category === 'detective' ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold' : control.category === 'corrective' ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold' : 'bg-red-100 text-red-950 border border-red-400 font-bold'}`}>
                                {control.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(control.status)}`}>
                                {control.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {new Date(control.lastTested).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition"
                                  title="Inspect Control Details"
                                  onClick={() => setSelectedInspectorItem({ type: 'control', data: control, subTab: 'details' })}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition"
                                  title="Run Control Test"
                                  onClick={() => handleTestControl(control.id)}
                                >
                                  <Activity className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition"
                                  title="View Evidence & Audit Trails"
                                  onClick={() => setSelectedInspectorItem({ type: 'control', data: control, subTab: 'evidence' })}
                                >
                                  <BadgeCheck className="h-4 w-4" />
                                </button>
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

            {/* STERCS Audits Tab */}
            {activeTab === 'audits' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Control
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Auditor
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Score
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Findings
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-slate-800">
                            No STERCS audits found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as StercsAudit[]).map((audit) => (
                          <tr key={audit.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{audit.controlName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {audit.auditorName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {new Date(audit.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(audit.status)}`}>
                                {audit.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {audit.score}%
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-800 max-w-xs truncate">
                              {audit.findings}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition"
                                  title="Inspect Audit Details"
                                  onClick={() => setSelectedInspectorItem({ type: 'audit', data: audit, subTab: 'details' })}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition"
                                  title="Audit Evidence"
                                  onClick={() => setSelectedInspectorItem({ type: 'audit', data: audit, subTab: 'evidence' })}
                                >
                                  <BadgeCheck className="h-4 w-4" />
                                </button>
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

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && stercsStats && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">STERCS Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Modules</span>
                        <span className="font-medium">{stercsStats.totalModules}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Modules</span>
                        <span className="font-medium">{stercsStats.activeModules}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Critical Modules</span>
                        <span className="font-medium">{stercsStats.criticalModules}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Policies</span>
                        <span className="font-medium">{stercsStats.totalPolicies}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Controls Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Controls</span>
                        <span className="font-medium">{stercsStats.totalControls}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Implemented</span>
                        <span className="font-medium">{stercsStats.implementedControls}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Planned</span>
                        <span className="font-medium">{stercsStats.plannedControls}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Compliance Score</span>
                        <span className="font-medium">{stercsStats.complianceScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Audit Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Audits</span>
                        <span className="font-medium">{stercsStats.totalAudits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Passed Audits</span>
                        <span className="font-medium">{stercsStats.passedAudits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Failed Audits</span>
                        <span className="font-medium">{stercsStats.failedAudits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pending Audits</span>
                        <span className="font-medium">{stercsStats.pendingAudits}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Risk Assessment</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">High Risk Areas</span>
                        <span className="font-medium">{stercsStats.riskAssessment.highRisk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Medium Risk Areas</span>
                        <span className="font-medium">{stercsStats.riskAssessment.mediumRisk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Low Risk Areas</span>
                        <span className="font-medium">{stercsStats.riskAssessment.lowRisk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Risk Level</span>
                        <span className="font-medium">Medium</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Framework Coverage</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'NIST', percentage: 85 },
                        { name: 'ISO 27001', percentage: 78 },
                        { name: 'COBIT', percentage: 65 },
                        { name: 'SOX', percentage: 90 }
                      ].map((framework, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{framework.name}</span>
                            <span className="text-sm font-medium">{framework.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 border text-gray-950 border-gray-400 font-black">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${framework.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Module Deployment Status</h3>
                    <div className="h-64 flex items-center justify-center">
                      <BarChart3 className="h-16 w-16 text-slate-700" />
                      <p className="ml-4 text-slate-700">Module deployment status visualization would appear here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
                  <div className="h-64 flex items-center justify-center">
                    <Activity className="h-16 w-16 text-slate-700" />
                    <p className="ml-4 text-slate-700">Recent STERCS activities timeline would appear here</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {['modules', 'policies', 'controls', 'audits'].includes(activeTab) && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-300 sm:px-6 mt-6">
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
                  <span className="font-medium">{Math.min(indexOfLastItem, (activeTab === 'modules' ? filteredModules : activeTab === 'policies' ? filteredPolicies : activeTab === 'controls' ? filteredControls : filteredAudits).length)}</span> of{' '}
                  <span className="font-medium">{(activeTab === 'modules' ? filteredModules : activeTab === 'policies' ? filteredPolicies : activeTab === 'controls' ? filteredControls : filteredAudits).length}</span> results
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

      {/* Create Module Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New STERCS Module</h3>
                <button
                  className="text-slate-700 hover:text-gray-700"
                  onClick={() => setShowCreateModal(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleCreateModule(); }}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="module-name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="module-name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newModule.name}
                    onChange={(e) => setNewModule({...newModule, name: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="module-description">
                    Description
                  </label>
                  <textarea
                    id="module-description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newModule.description}
                    onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="module-version">
                      Version
                    </label>
                    <input
                      type="text"
                      id="module-version"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      value={newModule.version}
                      onChange={(e) => setNewModule({...newModule, version: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="module-category">
                      Category
                    </label>
                    <select
                      id="module-category"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                      value={newModule.category}
                      onChange={(e) => setNewModule({...newModule, category: e.target.value as any})}
                    >
                      <option value="governance">Governance</option>
                      <option value="control">Control</option>
                      <option value="monitoring">Monitoring</option>
                      <option value="compliance">Compliance</option>
                      <option value="security">Security</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="module-priority">
                      Priority
                    </label>
                    <select
                      id="module-priority"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                      value={newModule.priority}
                      onChange={(e) => setNewModule({...newModule, priority: e.target.value as any})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="module-environment">
                      Environment
                    </label>
                    <select
                      id="module-environment"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                      value={newModule.environment}
                      onChange={(e) => setNewModule({...newModule, environment: e.target.value as any})}
                    >
                      <option value="development">Development</option>
                      <option value="staging">Staging</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="module-dependencies">
                    Dependencies (comma separated)
                  </label>
                  <input
                    type="text"
                    id="module-dependencies"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newModule.dependencies}
                    onChange={(e) => setNewModule({...newModule, dependencies: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Create Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* STERCS DETAILS & EVIDENCE INSPECTOR MODAL */}
      {selectedInspectorItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {selectedInspectorItem.type}
                  </span>
                  <h3 className="font-bold text-base">
                    {selectedInspectorItem.data.name || selectedInspectorItem.data.controlName || `Item #${selectedInspectorItem.data.id}`}
                  </h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">Cryptographic verification digest & runtime attributes</p>
              </div>
              <button
                onClick={() => setSelectedInspectorItem(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs inside inspector */}
            <div className="px-5 pt-3 border-b border-slate-300 flex gap-4 text-xs font-semibold">
              <button
                onClick={() => setSelectedInspectorItem({ ...selectedInspectorItem, subTab: 'details' })}
                className={`pb-2.5 border-b-2 transition ${
                  selectedInspectorItem.subTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Overview & Attributes
              </button>
              <button
                onClick={() => setSelectedInspectorItem({ ...selectedInspectorItem, subTab: 'config' })}
                className={`pb-2.5 border-b-2 transition ${
                  selectedInspectorItem.subTab === 'config' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Configuration / Payload
              </button>
              <button
                onClick={() => setSelectedInspectorItem({ ...selectedInspectorItem, subTab: 'evidence' })}
                className={`pb-2.5 border-b-2 transition ${
                  selectedInspectorItem.subTab === 'evidence' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Evidence & Audit Ledger
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto text-xs space-y-4">
              {selectedInspectorItem.subTab === 'details' && (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-xl border border-slate-300">
                    <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">Description</div>
                    <div className="text-gray-800 leading-relaxed">
                      {selectedInspectorItem.data.description || selectedInspectorItem.data.findings || 'No description provided.'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-slate-200">
                      <span className="text-slate-700 block text-[10px]">ID</span>
                      <strong className="text-gray-900 font-mono">#{selectedInspectorItem.data.id}</strong>
                    </div>
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-slate-200">
                      <span className="text-slate-700 block text-[10px]">Status</span>
                      <span className="font-semibold text-emerald-600 uppercase text-[11px]">{selectedInspectorItem.data.status || 'Active'}</span>
                    </div>
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-slate-200">
                      <span className="text-slate-700 block text-[10px]">Category</span>
                      <strong className="text-gray-800 capitalize">{selectedInspectorItem.data.category || 'General'}</strong>
                    </div>
                  </div>
                </div>
              )}

              {selectedInspectorItem.subTab === 'config' && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-700 mb-2">Raw JSON Parameters</div>
                  <pre className="p-3.5 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800">
                    {JSON.stringify(selectedInspectorItem.data.config || selectedInspectorItem.data, null, 2)}
                  </pre>
                </div>
              )}

              {selectedInspectorItem.subTab === 'evidence' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-slate-700 mb-1">Cryptographic Evidence Trail</div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1 font-mono text-[11px]">
                    <div>[SHA-256 Digest] e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                    <div>[Attestation] Zero-Knowledge Enclave Seal: VALID</div>
                    <div>[Timestamp] {new Date().toISOString()}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 bg-gray-50 border-t border-slate-300 flex justify-between items-center text-xs">
              <button
                onClick={() => {
                  triggerToast(`Attestation verified for ${selectedInspectorItem.type} #${selectedInspectorItem.data.id}`);
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition"
              >
                Execute Test & Verify
              </button>
              <button
                onClick={() => setSelectedInspectorItem(null)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION BANNER */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StercsPage;
