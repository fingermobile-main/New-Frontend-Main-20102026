import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Settings, 
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

interface ComplianceRequirement {
  id: number;
  name: string;
  description: string;
  regulation: string;
  jurisdiction: string;
  status: 'active' | 'pending' | 'deprecated';
  category: 'data_protection' | 'financial' | 'healthcare' | 'content' | 'accessibility' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline?: string;
  assignedTo: number;
  assignedToName: string;
  complianceStatus: 'not_started' | 'in_progress' | 'compliant' | 'non_compliant' | 'requires_attention';
  lastAssessment: string;
  nextReview: string;
  createdAt: string;
  updatedAt: string;
}

interface ComplianceAudit {
  id: number;
  requirementId: number;
  requirementName: string;
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

interface ComplianceReport {
  id: number;
  title: string;
  description: string;
  type: 'regulatory' | 'internal' | 'external';
  period: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  dueDate: string;
  submittedAt?: string;
  approverId?: number;
  approverName?: string;
  recipients: string[];
  createdAt: string;
  updatedAt: string;
}

const CompliancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requirements' | 'audits' | 'reports' | 'dashboard' | 'settings'>('requirements');
  const [complianceRequirements, setComplianceRequirements] = useState<ComplianceRequirement[]>([]);
  const [complianceAudits, setComplianceAudits] = useState<ComplianceAudit[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [filteredRequirements, setFilteredRequirements] = useState<ComplianceRequirement[]>([]);
  const [filteredAudits, setFilteredAudits] = useState<ComplianceAudit[]>([]);
  const [filteredReports, setFilteredReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [complianceStats, setComplianceStats] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRequirement, setNewRequirement] = useState({
    name: '',
    description: '',
    regulation: '',
    jurisdiction: '',
    category: 'data_protection' as 'data_protection' | 'financial' | 'healthcare' | 'content' | 'accessibility' | 'other',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    deadline: '',
    assignedToName: ''
  });

  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const history = { push: (path: string) => navigate(path), replace: (path: string) => navigate(path, { replace: true }) };

  // Simulate loading compliance data
  useEffect(() => {
    const fetchComplianceData = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        const mockRequirements: ComplianceRequirement[] = [
          {
            id: 1,
            name: 'GDPR Data Processing',
            description: 'Ensure all data processing activities comply with GDPR requirements',
            regulation: 'GDPR',
            jurisdiction: 'EU',
            status: 'active',
            category: 'data_protection',
            priority: 'high',
            deadline: '2024-12-31',
            assignedTo: 1,
            assignedToName: 'Compliance Officer',
            complianceStatus: 'in_progress',
            lastAssessment: '2024-09-15',
            nextReview: '2024-12-15',
            createdAt: '2024-01-01',
            updatedAt: '2024-10-01'
          },
          {
            id: 2,
            name: 'CCPA Consumer Rights',
            description: 'Implement mechanisms for consumers to exercise their rights under CCPA',
            regulation: 'CCPA',
            jurisdiction: 'California, USA',
            status: 'active',
            category: 'data_protection',
            priority: 'medium',
            deadline: '2024-11-30',
            assignedTo: 2,
            assignedToName: 'Privacy Specialist',
            complianceStatus: 'compliant',
            lastAssessment: '2024-08-20',
            nextReview: '2025-02-20',
            createdAt: '2024-02-01',
            updatedAt: '2024-09-15'
          },
          {
            id: 3,
            name: 'SOX Financial Controls',
            description: 'Maintain adequate financial controls as required by SOX',
            regulation: 'SOX',
            jurisdiction: 'USA',
            status: 'active',
            category: 'financial',
            priority: 'critical',
            deadline: '2024-10-31',
            assignedTo: 3,
            assignedToName: 'Finance Manager',
            complianceStatus: 'requires_attention',
            lastAssessment: '2024-07-10',
            nextReview: '2024-10-10',
            createdAt: '2024-01-15',
            updatedAt: '2024-10-05'
          },
          {
            id: 4,
            name: 'WCAG Accessibility',
            description: 'Ensure website meets WCAG 2.1 AA accessibility standards',
            regulation: 'WCAG 2.1',
            jurisdiction: 'Global',
            status: 'active',
            category: 'accessibility',
            priority: 'medium',
            deadline: '2025-03-31',
            assignedTo: 4,
            assignedToName: 'Accessibility Lead',
            complianceStatus: 'not_started',
            lastAssessment: '2024-06-01',
            nextReview: '2024-12-01',
            createdAt: '2024-03-01',
            updatedAt: '2024-03-01'
          }
        ];

        const mockAudits: ComplianceAudit[] = [
          {
            id: 1,
            requirementId: 1,
            requirementName: 'GDPR Data Processing',
            auditorId: 1,
            auditorName: 'External Auditor',
            date: '2024-09-15',
            status: 'partial',
            findings: 'Some processes documented, but consent mechanisms need improvement',
            recommendations: 'Implement granular consent controls and improve audit trails',
            evidence: ['Policy Document v2.1', 'Consent Form Screenshots', 'Data Flow Diagram'],
            score: 75,
            createdAt: '2024-09-15',
            updatedAt: '2024-09-15'
          },
          {
            id: 2,
            requirementId: 2,
            requirementName: 'CCPA Consumer Rights',
            auditorId: 2,
            auditorName: 'Internal Auditor',
            date: '2024-08-20',
            status: 'passed',
            findings: 'All consumer rights mechanisms properly implemented',
            recommendations: 'Continue monitoring for any new CCPA amendments',
            evidence: ['Consumer Rights Portal', 'Deletion Process Documentation', 'Verification Procedures'],
            score: 95,
            createdAt: '2024-08-20',
            updatedAt: '2024-08-20'
          },
          {
            id: 3,
            requirementId: 3,
            requirementName: 'SOX Financial Controls',
            auditorId: 3,
            auditorName: 'SOX Specialist',
            date: '2024-07-10',
            status: 'failed',
            findings: 'Missing documentation for quarterly controls assessment',
            recommendations: 'Implement formal quarterly controls assessment process',
            evidence: ['Controls Matrix', 'Risk Assessment Document', 'Testing Procedures'],
            score: 60,
            createdAt: '2024-07-10',
            updatedAt: '2024-07-10'
          }
        ];

        const mockReports: ComplianceReport[] = [
          {
            id: 1,
            title: 'Q3 2024 GDPR Compliance Report',
            description: 'Quarterly assessment of GDPR compliance status',
            type: 'regulatory',
            period: '2024-Q3',
            status: 'published',
            dueDate: '2024-10-15',
            submittedAt: '2024-10-10',
            approverId: 1,
            approverName: 'Compliance Officer',
            recipients: ['board@company.com', 'legal@company.com'],
            createdAt: '2024-07-01',
            updatedAt: '2024-10-10'
          },
          {
            id: 2,
            title: 'CCPA Annual Assessment',
            description: 'Annual review of CCPA compliance measures',
            type: 'regulatory',
            period: '2024-Annual',
            status: 'approved',
            dueDate: '2024-12-31',
            submittedAt: '2024-12-15',
            approverId: 1,
            approverName: 'Compliance Officer',
            recipients: ['executive@company.com', 'legal@company.com'],
            createdAt: '2024-01-01',
            updatedAt: '2024-12-15'
          },
          {
            id: 3,
            title: 'SOX Internal Controls Review',
            description: 'Quarterly internal review of financial controls',
            type: 'internal',
            period: '2024-Q3',
            status: 'review',
            dueDate: '2024-10-31',
            approverId: 3,
            approverName: 'Finance Manager',
            recipients: ['finance@company.com', 'audit@company.com'],
            createdAt: '2024-07-01',
            updatedAt: '2024-10-20'
          }
        ];

        const mockStats = {
          totalRequirements: 42,
          activeRequirements: 38,
          criticalRequirements: 5,
          overdueRequirements: 3,
          compliantRequirements: 28,
          nonCompliantRequirements: 7,
          requiresAttention: 3,
          totalAudits: 125,
          passedAudits: 98,
          failedAudits: 15,
          pendingAudits: 12,
          totalReports: 24,
          pendingReports: 3,
          overdueReports: 1,
          complianceScore: 85.5,
          riskAssessment: {
            highRisk: 8,
            mediumRisk: 12,
            lowRisk: 22
          }
        };

        setComplianceRequirements(mockRequirements);
        setComplianceAudits(mockAudits);
        setComplianceReports(mockReports);
        setFilteredRequirements(mockRequirements);
        setFilteredAudits(mockAudits);
        setFilteredReports(mockReports);
        setComplianceStats(mockStats);
        setLoading(false);
      }, 1000);
    };

    fetchComplianceData();
  }, []);

  // Filter data based on active tab and filters
  useEffect(() => {
    if (activeTab === 'requirements') {
      let result = complianceRequirements;

      if (searchTerm) {
        result = result.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.regulation.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterCategory !== 'all') {
        result = result.filter(item => item.category === filterCategory);
      }

      if (filterPriority !== 'all') {
        result = result.filter(item => item.priority === filterPriority);
      }

      if (filterStatus !== 'all') {
        result = result.filter(item => item.complianceStatus === filterStatus);
      }

      setFilteredRequirements(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'audits') {
      let result = complianceAudits;

      if (searchTerm) {
        result = result.filter(item => 
          item.requirementName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.findings.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.auditorName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredAudits(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'reports') {
      let result = complianceReports;

      if (searchTerm) {
        result = result.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredReports(result);
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [searchTerm, filterCategory, filterPriority, filterStatus, activeTab, complianceRequirements, complianceAudits, complianceReports]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  let currentItems: any[] = [];
  let totalPages = 0;
  
  if (activeTab === 'requirements') {
    currentItems = filteredRequirements.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredRequirements.length / itemsPerPage);
  } else if (activeTab === 'audits') {
    currentItems = filteredAudits.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredAudits.length / itemsPerPage);
  } else if (activeTab === 'reports') {
    currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  }

  const handleDownloadReport = (report: ComplianceReport) => {
    const reportData = JSON.stringify(report, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${report.id}-${report.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreateRequirement = async () => {
    try {
      const created: ComplianceRequirement = {
        id: Date.now(),
        name: newRequirement.name,
        description: newRequirement.description,
        regulation: newRequirement.regulation,
        jurisdiction: newRequirement.jurisdiction,
        category: newRequirement.category as any,
        priority: newRequirement.priority as any,
        status: 'active',
        complianceStatus: 'compliant',
        assignedTo: 1,
        assignedToName: newRequirement.assignedToName || 'Admin',
        deadline: newRequirement.deadline || new Date().toISOString(),
        lastAssessment: new Date().toISOString(),
        nextReview: new Date(Date.now() + 90 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setComplianceRequirements(prev => [created, ...prev]);
      setFilteredRequirements(prev => [created, ...prev]);
      setShowCreateModal(false);
      // Reset form
      setNewRequirement({
        name: '',
        description: '',
        regulation: '',
        jurisdiction: '',
        category: 'data_protection',
        priority: 'medium',
        deadline: '',
        assignedToName: ''
      });
    } catch (error) {
      console.error('Error creating requirement:', error);
    }
  };

  const handleUpdateStatus = async (reqId: number, status: string) => {
    try {
      setComplianceRequirements(complianceRequirements.map(req => 
        req.id === reqId ? {...req, complianceStatus: status as any, lastAssessment: new Date().toISOString()} : req
      ));
      setFilteredRequirements(filteredRequirements.map(req => 
        req.id === reqId ? {...req, complianceStatus: status as any, lastAssessment: new Date().toISOString()} : req
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'data_protection': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'financial': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'healthcare': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'content': return 'bg-purple-100 text-purple-950 border border-purple-400 font-bold';
      case 'accessibility': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
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
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'compliant': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'non_compliant': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'requires_attention': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'passed': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'failed': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'partial': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'not_applicable': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'approved': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'published': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAuditStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'partial': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">Compliance Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Requirement
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {complianceStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Requirements</p>
                  <p className="text-2xl font-semibold text-gray-900">{complianceStats.totalRequirements}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Compliant</p>
                  <p className="text-2xl font-semibold text-gray-900">{complianceStats.compliantRequirements}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Requires Attention</p>
                  <p className="text-2xl font-semibold text-gray-900">{complianceStats.requiresAttention}</p>
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
                  <p className="text-2xl font-semibold text-gray-900">{complianceStats.complianceScore}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-slate-300 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('requirements')}
              className={`${
                activeTab === 'requirements'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FolderKanban className="h-4 w-4 mr-2" />
              Requirements
            </button>
            <button
              onClick={() => setActiveTab('audits')}
              className={`${
                activeTab === 'audits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Audits
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder:text-slate-400 focus:outline-none focus:placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 focus:ring-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {activeTab === 'requirements' && (
              <>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="data_protection">Data Protection</option>
                  <option value="financial">Financial</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="content">Content</option>
                  <option value="accessibility">Accessibility</option>
                  <option value="other">Other</option>
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
                
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="compliant">Compliant</option>
                  <option value="non_compliant">Non-Compliant</option>
                  <option value="requires_attention">Requires Attention</option>
                </select>
              </>
            )}
            
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                {activeTab === 'requirements' ? `${filteredRequirements.length} requirements` : 
                 activeTab === 'audits' ? `${filteredAudits.length} audits` : 
                 `${filteredReports.length} reports`}
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
            {/* Compliance Requirements Tab */}
            {activeTab === 'requirements' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Requirement
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Regulation
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
                          Deadline
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Assigned To
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
                            No compliance requirements found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as ComplianceRequirement[]).map((requirement) => (
                          <tr key={requirement.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{requirement.name}</div>
                              <div className="text-sm text-slate-700 max-w-xs truncate">{requirement.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {requirement.regulation}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(requirement.category)}`}>
                                {requirement.category.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(requirement.priority)}`}>
                                {requirement.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(requirement.complianceStatus)}`}>
                                {requirement.complianceStatus.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {requirement.deadline ? new Date(requirement.deadline).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {requirement.assignedToName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  type="button"
                                  aria-label={`View requirement ${requirement.name} details`}
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/compliance/requirements/${requirement.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button
                                    type="button"
                                    aria-label={`More options for requirement ${requirement.name}`}
                                    onClick={() => showToast(`Actions for requirement: ${requirement.name}`, 'info')}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => handleUpdateStatus(requirement.id, 'compliant')}
                                    >
                                      Mark as Compliant
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => handleUpdateStatus(requirement.id, 'non_compliant')}
                                    >
                                      Mark as Non-Compliant
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/compliance/requirements/${requirement.id}/edit`)}
                                    >
                                      Edit Requirement
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

            {/* Compliance Audits Tab */}
            {activeTab === 'audits' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Requirement
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
                            No compliance audits found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as ComplianceAudit[]).map((audit) => (
                          <tr key={audit.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{audit.requirementName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {audit.auditorName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {new Date(audit.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getAuditStatusIcon(audit.status)}
                                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(audit.status)}`}>
                                  {audit.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {audit.score}%
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-800 max-w-xs truncate">
                              {audit.findings}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  type="button"
                                  aria-label={`View audit #${audit.id} details`}
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/compliance/audits/${audit.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button
                                    type="button"
                                    aria-label={`More options for audit #${audit.id}`}
                                    onClick={() => showToast(`Actions for audit #${audit.id}`, 'info')}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/compliance/audits/${audit.id}/findings`)}
                                    >
                                      View Findings
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/compliance/audits/${audit.id}/recommendations`)}
                                    >
                                      View Recommendations
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/compliance/audits/${audit.id}/evidence`)}
                                    >
                                      View Evidence
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

            {/* Compliance Reports Tab */}
            {activeTab === 'reports' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Report
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Period
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Submitted
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
                            No compliance reports found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as ComplianceReport[]).map((report) => (
                          <tr key={report.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{report.title}</div>
                              <div className="text-sm text-slate-700 max-w-xs truncate">{report.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.type === 'regulatory' ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold' : report.type === 'internal' ? 'bg-green-100 text-blue-950 border border-blue-400 font-bold' : 'bg-purple-100 text-blue-950 border border-blue-400 font-bold'}font-black`}>
                                {report.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {report.period}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}>
                                {report.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {new Date(report.dueDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {report.submittedAt ? new Date(report.submittedAt).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/compliance/reports/${report.id}/view`)}
                                  aria-label={`View report ${report.title}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  className="text-green-600 hover:text-green-900"
                                  onClick={() => handleDownloadReport(report)}
                                  aria-label={`Download report ${report.title}`}
                                >
                                  <FileText className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => showToast(`Actions for report: ${report.title}`, 'info')}
                                    className="text-gray-600 hover:text-gray-900"
                                    aria-label={`More options for report ${report.title}`}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/compliance/reports/${report.id}/edit`)}
                                    >
                                      Edit Report
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/compliance/reports/${report.id}/recipients`)}
                                    >
                                      Manage Recipients
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/compliance/reports/${report.id}/approval`)}
                                    >
                                      Approval Workflow
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

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && complianceStats && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Compliance Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Requirements</span>
                        <span className="font-medium">{complianceStats.totalRequirements}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Requirements</span>
                        <span className="font-medium">{complianceStats.activeRequirements}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Critical Requirements</span>
                        <span className="font-medium">{complianceStats.criticalRequirements}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Overdue Requirements</span>
                        <span className="font-medium">{complianceStats.overdueRequirements}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Compliance Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Compliant</span>
                        <span className="font-medium">{complianceStats.compliantRequirements}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Non-Compliant</span>
                        <span className="font-medium">{complianceStats.nonCompliantRequirements}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Requires Attention</span>
                        <span className="font-medium">{complianceStats.requiresAttention}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Compliance Score</span>
                        <span className="font-medium">{complianceStats.complianceScore}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Audit Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Audits</span>
                        <span className="font-medium">{complianceStats.totalAudits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Passed Audits</span>
                        <span className="font-medium">{complianceStats.passedAudits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Failed Audits</span>
                        <span className="font-medium">{complianceStats.failedAudits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pending Audits</span>
                        <span className="font-medium">{complianceStats.pendingAudits}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Report Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Reports</span>
                        <span className="font-medium">{complianceStats.totalReports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pending Reports</span>
                        <span className="font-medium">{complianceStats.pendingReports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Overdue Reports</span>
                        <span className="font-medium">{complianceStats.overdueReports}</span>
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
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Deadlines</h3>
                    <div className="space-y-4">
                      {[
                        { id: 1, name: 'SOX Financial Controls', deadline: '2024-10-31', priority: 'critical' },
                        { id: 2, name: 'GDPR Data Processing', deadline: '2024-12-31', priority: 'high' },
                        { id: 3, name: 'CCPA Consumer Rights', deadline: '2024-11-30', priority: 'medium' }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-slate-700">Due: {new Date(item.deadline).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.priority === 'critical' ? 'bg-red-100 text-red-950 border border-red-400 font-bold' : item.priority === 'high' ? 'bg-orange-100 text-red-950' : 'bg-amber-100 text-red-950 border border-red-400 font-bold'}font-black`}>
                            {item.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Assessment</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">High Risk Areas</span>
                        <span className="font-medium">{complianceStats.riskAssessment.highRisk}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 border text-gray-950 border-gray-400 font-black">
                        <div 
                          className="bg-red-600 h-2.5 rounded-full" 
                          style={{ width: `${(complianceStats.riskAssessment.highRisk / 42) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Medium Risk Areas</span>
                        <span className="font-medium">{complianceStats.riskAssessment.mediumRisk}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 border text-gray-950 border-gray-400 font-black">
                        <div 
                          className="bg-yellow-500 h-2.5 rounded-full" 
                          style={{ width: `${(complianceStats.riskAssessment.mediumRisk / 42) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Low Risk Areas</span>
                        <span className="font-medium">{complianceStats.riskAssessment.lowRisk}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 border text-gray-950 border-gray-400 font-black">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${(complianceStats.riskAssessment.lowRisk / 42) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Jurisdiction Coverage</h3>
                  <div className="h-64 flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-slate-700" />
                    <p className="ml-4 text-slate-700">Jurisdiction coverage visualization would appear here</p>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Notification Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Deadline Reminders</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border text-gray-950 border-gray-400 font-black"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Audit Notifications</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border text-gray-950 border-gray-400 font-black"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Compliance Alerts</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border text-gray-950 border-gray-400 font-black"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Reporting Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Auto-Generate Reports</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border text-gray-950 border-gray-400 font-black"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Report Frequency</span>
                          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2">
                            <option>Monthly</option>
                            <option>Quarterly</option>
                            <option>Annually</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Approval Workflow</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border text-gray-950 border-gray-400 font-black"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Regulatory Frameworks</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="gdpr-framework"
                        type="checkbox"
                        className="h-4 w-4 text-slate-900 focus:ring-blue-500 border-gray-300 rounded mt-1 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                        defaultChecked
                      />
                      <div className="ml-3">
                        <label htmlFor="gdpr-framework" className="block text-sm font-medium text-gray-700">
                          GDPR (General Data Protection Regulation)
                        </label>
                        <p className="text-sm text-slate-700">European Union data protection regulation</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="ccpa-framework"
                        type="checkbox"
                        className="h-4 w-4 text-slate-900 focus:ring-blue-500 border-gray-300 rounded mt-1 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                        defaultChecked
                      />
                      <div className="ml-3">
                        <label htmlFor="ccpa-framework" className="block text-sm font-medium text-gray-700">
                          CCPA (California Consumer Privacy Act)
                        </label>
                        <p className="text-sm text-slate-700">California consumer privacy regulation</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="sox-framework"
                        type="checkbox"
                        className="h-4 w-4 text-slate-900 focus:ring-blue-500 border-gray-300 rounded mt-1 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                        defaultChecked
                      />
                      <div className="ml-3">
                        <label htmlFor="sox-framework" className="block text-sm font-medium text-gray-700">
                          SOX (Sarbanes-Oxley Act)
                        </label>
                        <p className="text-sm text-slate-700">Financial reporting and corporate accountability</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {['requirements', 'audits', 'reports'].includes(activeTab) && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-300 sm:px-6 mt-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-slate-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-slate-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastItem, (activeTab === 'requirements' ? filteredRequirements : activeTab === 'audits' ? filteredAudits : filteredReports).length)}</span> of{' '}
                  <span className="font-medium">{(activeTab === 'requirements' ? filteredRequirements : activeTab === 'audits' ? filteredAudits : filteredReports).length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-1" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-slate-700' : 'text-slate-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      type="button"
                      aria-label={`Go to page ${i + 1}`}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-slate-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-slate-700' : 'text-slate-700 hover:bg-gray-50'
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

      {/* Create Requirement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Compliance Requirement</h3>
                <button 
                  type="button"
                  aria-label="Close modal"
                  className="text-slate-700 hover:text-gray-700"
                  onClick={() => setShowCreateModal(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleCreateRequirement(); }}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requirement-name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="requirement-name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newRequirement.name}
                    onChange={(e) => setNewRequirement({...newRequirement, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requirement-description">
                    Description
                  </label>
                  <textarea
                    id="requirement-description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newRequirement.description}
                    onChange={(e) => setNewRequirement({...newRequirement, description: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requirement-regulation">
                    Regulation
                  </label>
                  <input
                    type="text"
                    id="requirement-regulation"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newRequirement.regulation}
                    onChange={(e) => setNewRequirement({...newRequirement, regulation: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requirement-category">
                      Category
                    </label>
                    <select
                      id="requirement-category"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                      value={newRequirement.category}
                      onChange={(e) => setNewRequirement({...newRequirement, category: e.target.value as any})}
                    >
                      <option value="data_protection">Data Protection</option>
                      <option value="financial">Financial</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="content">Content</option>
                      <option value="accessibility">Accessibility</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requirement-priority">
                      Priority
                    </label>
                    <select
                      id="requirement-priority"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                      value={newRequirement.priority}
                      onChange={(e) => setNewRequirement({...newRequirement, priority: e.target.value as any})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requirement-deadline">
                      Deadline
                    </label>
                    <input
                      type="date"
                      id="requirement-deadline"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      value={newRequirement.deadline}
                      onChange={(e) => setNewRequirement({...newRequirement, deadline: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requirement-assigned">
                      Assigned To
                    </label>
                    <input
                      type="text"
                      id="requirement-assigned"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      value={newRequirement.assignedToName}
                      onChange={(e) => setNewRequirement({...newRequirement, assignedToName: e.target.value})}
                    />
                  </div>
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
                    Create Requirement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompliancePage;
