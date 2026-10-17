import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit3, 
  Trash2, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  Scale,
  Gavel,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AIDecision {
  id: number;
  modelId: string;
  input: string;
  output: string;
  decision: string;
  confidence: number;
  timestamp: string;
  userId?: number;
  userName?: string;
  sessionId?: string;
  policyApplied: string;
  outcome: 'allowed' | 'blocked' | 'flagged' | 'review_required';
  reviewerId?: number;
  reviewNotes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
}

interface AIPolicy {
  id: number;
  name: string;
  description: string;
  category: string;
  rules: any[];
  isActive: boolean;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  lastReviewed: string;
}

interface AIIncident {
  id: number;
  decisionId: number;
  type: 'bias_detection' | 'safety_violation' | 'accuracy_error' | 'ethical_concern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  reportedBy: number;
  reportedByName: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  resolutionNotes?: string;
  resolvedBy?: number;
}

const AIGovernancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'decisions' | 'policies' | 'incidents' | 'analytics' | 'settings'>('decisions');
  const [aiDecisions, setAiDecisions] = useState<AIDecision[]>([]);
  const [aiPolicies, setAiPolicies] = useState<AIPolicy[]>([]);
  const [aiIncidents, setAiIncidents] = useState<AIIncident[]>([]);
  const [filteredDecisions, setFilteredDecisions] = useState<AIDecision[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<AIPolicy[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<AIIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOutcome, setFilterOutcome] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [governanceStats, setGovernanceStats] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    description: '',
    category: 'safety',
    rules: []
  });

  const navigate = useNavigate();
  const history = { push: (path: string) => navigate(path), replace: (path: string) => navigate(path, { replace: true }) };

  // Simulate loading AI governance data
  useEffect(() => {
    const fetchGovernanceData = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        const mockDecisions: AIDecision[] = [
          {
            id: 1,
            modelId: 'gpt-4-0613',
            input: 'Can you help me write a professional email?',
            output: 'Certainly! Here is a professional email template...',
            decision: 'allowed',
            confidence: 0.95,
            timestamp: '2024-10-09T10:30:00Z',
            userId: 1,
            userName: 'UserOne',
            sessionId: 'sess_abc123',
            policyApplied: 'content_moderation_v1',
            outcome: 'allowed',
            status: 'approved'
          },
          {
            id: 2,
            modelId: 'gpt-4-0613',
            input: 'How to bypass security measures?',
            output: 'I cannot provide information on bypassing security...',
            decision: 'blocked',
            confidence: 0.99,
            timestamp: '2024-10-09T09:45:00Z',
            userId: 2,
            userName: 'UserTwo',
            sessionId: 'sess_def456',
            policyApplied: 'security_policy_v1',
            outcome: 'blocked',
            status: 'approved'
          },
          {
            id: 3,
            modelId: 'gpt-4-0613',
            input: 'What is your opinion on politics?',
            output: 'I don\'t have personal opinions on political matters...',
            decision: 'flagged',
            confidence: 0.75,
            timestamp: '2024-10-09T08:20:00Z',
            userId: 3,
            userName: 'UserThree',
            sessionId: 'sess_ghi789',
            policyApplied: 'political_neutrality_v1',
            outcome: 'flagged',
            status: 'pending',
            reviewerId: 1,
            reviewNotes: 'Requires human review for political neutrality'
          },
          {
            id: 4,
            modelId: 'gpt-4-0613',
            input: 'Tell me about the company values',
            output: 'Our company values include integrity, innovation, and customer focus...',
            decision: 'allowed',
            confidence: 0.98,
            timestamp: '2024-10-09T07:45:00Z',
            userId: 4,
            userName: 'UserFour',
            sessionId: 'sess_jkl012',
            policyApplied: 'brand_guidelines_v1',
            outcome: 'allowed',
            status: 'approved'
          }
        ];

        const mockPolicies: AIPolicy[] = [
          {
            id: 1,
            name: 'Content Moderation Policy',
            description: 'Policy to moderate harmful or inappropriate content',
            category: 'safety',
            rules: [
              { condition: 'contains_hate_speech', action: 'block' },
              { condition: 'contains_violence', action: 'flag' },
              { condition: 'sexual_content', action: 'block' }
            ],
            isActive: true,
            createdBy: 1,
            createdByName: 'AdminUser',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-09-01T00:00:00Z',
            lastReviewed: '2024-09-01T00:00:00Z'
          },
          {
            id: 2,
            name: 'Political Neutrality Policy',
            description: 'Policy to ensure AI remains politically neutral',
            category: 'ethics',
            rules: [
              { condition: 'political_opinion', action: 'flag_for_review' },
              { condition: 'partisan_language', action: 'redirect_to_facts' }
            ],
            isActive: true,
            createdBy: 1,
            createdByName: 'AdminUser',
            createdAt: '2024-02-01T00:00:00Z',
            updatedAt: '2024-09-15T00:00:00Z',
            lastReviewed: '2024-09-15T00:00:00Z'
          },
          {
            id: 3,
            name: 'Privacy Protection Policy',
            description: 'Policy to protect user privacy and data',
            category: 'privacy',
            rules: [
              { condition: 'request_personal_info', action: 'deny_and_explain' },
              { condition: 'attempt_data_extraction', action: 'block' }
            ],
            isActive: true,
            createdBy: 1,
            createdByName: 'AdminUser',
            createdAt: '2024-03-01T00:00:00Z',
            updatedAt: '2024-08-20T00:00:00Z',
            lastReviewed: '2024-08-20T00:00:00Z'
          },
          {
            id: 4,
            name: 'Factual Accuracy Policy',
            description: 'Policy to ensure AI provides factually accurate information',
            category: 'accuracy',
            rules: [
              { condition: 'unverified_claim', action: 'flag_for_verification' },
              { condition: 'opinion_as_fact', action: 'clarify_as_opinion' }
            ],
            isActive: false,
            createdBy: 1,
            createdByName: 'AdminUser',
            createdAt: '2024-04-01T00:00:00Z',
            updatedAt: '2024-07-15T00:00:00Z',
            lastReviewed: '2024-07-15T00:00:00Z'
          }
        ];

        const mockIncidents: AIIncident[] = [
          {
            id: 1,
            decisionId: 1,
            type: 'bias_detection',
            severity: 'medium',
            description: 'Potential gender bias detected in response',
            reportedBy: 2,
            reportedByName: 'ModeratorTwo',
            timestamp: '2024-10-09T10:45:00Z',
            status: 'investigating'
          },
          {
            id: 2,
            decisionId: 2,
            type: 'safety_violation',
            severity: 'high',
            description: 'Attempted to provide harmful information',
            reportedBy: 3,
            reportedByName: 'ModeratorThree',
            timestamp: '2024-10-09T09:30:00Z',
            status: 'resolved',
            resolutionNotes: 'Correctly blocked request, no action needed',
            resolvedBy: 1
          },
          {
            id: 3,
            decisionId: 3,
            type: 'ethical_concern',
            severity: 'low',
            description: 'Response could be perceived as taking sides',
            reportedBy: 4,
            reportedByName: 'ModeratorFour',
            timestamp: '2024-10-09T08:15:00Z',
            status: 'open'
          }
        ];

        const mockStats = {
          totalDecisions: 12500,
          allowedDecisions: 11800,
          blockedDecisions: 550,
          flaggedDecisions: 150,
          pendingReviews: 25,
          totalPolicies: 12,
          activePolicies: 10,
          inactivePolicies: 2,
          totalIncidents: 42,
          openIncidents: 8,
          resolvedIncidents: 34,
          decisionAccuracy: 97.8,
          humanInterventionRate: 2.3,
          biasDetectionRate: 1.2
        };

        setAiDecisions(mockDecisions);
        setAiPolicies(mockPolicies);
        setAiIncidents(mockIncidents);
        setFilteredDecisions(mockDecisions);
        setFilteredPolicies(mockPolicies);
        setFilteredIncidents(mockIncidents);
        setGovernanceStats(mockStats);
        setLoading(false);
      }, 1000);
    };

    fetchGovernanceData();
  }, []);

  // Filter data based on active tab and filters
  useEffect(() => {
    if (activeTab === 'decisions') {
      let result = aiDecisions;

      if (searchTerm) {
        result = result.filter(item => 
          item.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.output.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.policyApplied.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterOutcome !== 'all') {
        result = result.filter(item => item.outcome === filterOutcome);
      }

      if (filterStatus !== 'all') {
        result = result.filter(item => item.status === filterStatus);
      }

      setFilteredDecisions(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'policies') {
      let result = aiPolicies;

      if (searchTerm) {
        result = result.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterCategory !== 'all') {
        result = result.filter(item => item.category === filterCategory);
      }

      if (filterStatus !== 'all') {
        const isActive = filterStatus === 'active';
        result = result.filter(item => item.isActive === isActive);
      }

      setFilteredPolicies(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'incidents') {
      let result = aiIncidents;

      if (searchTerm) {
        result = result.filter(item => 
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.reportedByName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredIncidents(result);
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [searchTerm, filterOutcome, filterStatus, filterCategory, activeTab, aiDecisions, aiPolicies, aiIncidents]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  let currentItems: any[] = [];
  let totalPages = 0;
  
  if (activeTab === 'decisions') {
    currentItems = filteredDecisions.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredDecisions.length / itemsPerPage);
  } else if (activeTab === 'policies') {
    currentItems = filteredPolicies.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  } else if (activeTab === 'incidents') {
    currentItems = filteredIncidents.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
  }

  const handleCreatePolicy = async () => {
    try {
      // In a real implementation, this would call the API to create a policy
      console.log('Creating policy:', newPolicy);
      setShowCreateModal(false);
      // Reset form
      setNewPolicy({
        name: '',
        description: '',
        category: 'safety',
        rules: []
      });
    } catch (error) {
      console.error('Error creating policy:', error);
    }
  };

  const handleTogglePolicy = async (policyId: number) => {
    try {
      // In a real implementation, this would call the API to toggle policy status
      console.log('Toggling policy:', policyId);
      setAiPolicies(aiPolicies.map(policy => 
        policy.id === policyId ? {...policy, isActive: !policy.isActive} : policy
      ));
      setFilteredPolicies(filteredPolicies.map(policy => 
        policy.id === policyId ? {...policy, isActive: !policy.isActive} : policy
      ));
    } catch (error) {
      console.error('Error toggling policy:', error);
    }
  };

  const handleReviewDecision = async (decisionId: number, status: 'pending' | 'approved' | 'rejected' | 'archived', notes: string) => {
    try {
      // In a real implementation, this would call the API to review a decision
      console.log('Reviewing decision:', decisionId, status, notes);
      setAiDecisions(aiDecisions.map(decision => 
        decision.id === decisionId ? {...decision, status, reviewNotes: notes} : decision
      ));
      setFilteredDecisions(filteredDecisions.map(decision => 
        decision.id === decisionId ? {...decision, status, reviewNotes: notes} : decision
      ));
    } catch (error) {
      console.error('Error reviewing decision:', error);
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'allowed': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'blocked': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'flagged': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'review_required': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'approved': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'rejected': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'open': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'investigating': return 'bg-purple-100 text-purple-950 border border-purple-400 font-bold';
      case 'resolved': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'escalated': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'ethics': return 'bg-purple-100 text-purple-950 border border-purple-400 font-bold';
      case 'privacy': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'accuracy': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'fairness': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'medium': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
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
              <Brain className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">AI Governance Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Policy
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {governanceStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Decisions</p>
                  <p className="text-2xl font-semibold text-gray-900">{governanceStats.totalDecisions.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Allowed Decisions</p>
                  <p className="text-2xl font-semibold text-gray-900">{governanceStats.allowedDecisions.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Flagged Decisions</p>
                  <p className="text-2xl font-semibold text-gray-900">{governanceStats.flaggedDecisions}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Scale className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-semibold text-gray-900">{governanceStats.pendingReviews}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-slate-300 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('decisions')}
              className={`${
                activeTab === 'decisions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <FileText className="h-4 w-4 mr-2" />
              AI Decisions
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`${
                activeTab === 'policies'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Shield className="h-4 w-4 mr-2" />
              AI Policies
            </button>
            <button
              onClick={() => setActiveTab('incidents')}
              className={`${
                activeTab === 'incidents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Incidents
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
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
            
            {activeTab === 'decisions' && (
              <>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                  value={filterOutcome}
                  onChange={(e) => setFilterOutcome(e.target.value)}
                >
                  <option value="all">All Outcomes</option>
                  <option value="allowed">Allowed</option>
                  <option value="blocked">Blocked</option>
                  <option value="flagged">Flagged</option>
                  <option value="review_required">Review Required</option>
                </select>
                
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="archived">Archived</option>
                </select>
              </>
            )}
            
            {activeTab === 'policies' && (
              <>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="safety">Safety</option>
                  <option value="ethics">Ethics</option>
                  <option value="privacy">Privacy</option>
                  <option value="accuracy">Accuracy</option>
                  <option value="fairness">Fairness</option>
                </select>
                
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </>
            )}
            
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                {activeTab === 'decisions' ? `${filteredDecisions.length} decisions` : 
                 activeTab === 'policies' ? `${filteredPolicies.length} policies` : 
                 `${filteredIncidents.length} incidents`}
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
            {/* AI Decisions Tab */}
            {activeTab === 'decisions' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Input
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Output
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Outcome
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Policy
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Confidence
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Status
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
                            No AI decisions found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as AIDecision[]).map((decision) => (
                          <tr key={decision.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 max-w-xs truncate">
                              {decision.input}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-800 max-w-xs truncate">
                              {decision.output}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {decision.userName || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getOutcomeColor(decision.outcome)}`}>
                                {decision.outcome}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {decision.policyApplied}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {decision.confidence * 100}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(decision.status)}`}>
                                {decision.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/ai-governance/decisions/${decision.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                {decision.status === 'pending' && (
                                  <button 
                                    className="text-green-600 hover:text-green-900"
                                    onClick={() => {
                                      // Approve decision
                                      handleReviewDecision(decision.id, 'approved', 'Decision approved by moderator');
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                )}
                                <div className="relative">
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/ai-governance/decisions/${decision.id}/analysis`)}
                                    >
                                      Decision Analysis
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/ai-governance/decisions/${decision.id}/policy`)}
                                    >
                                      Policy Applied
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

            {/* AI Policies Tab */}
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
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Created By
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Rules
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
                            No AI policies found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as AIPolicy[]).map((policy) => (
                          <tr key={policy.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-800 max-w-xs truncate">
                              {policy.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(policy.category)}`}>
                                {policy.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {policy.createdByName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${policy.isActive ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : 'bg-red-100 text-green-950 border border-green-400 font-bold'}font-black`}>
                                {policy.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {policy.rules.length} rules
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/ai-governance/policies/${policy.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  className={`${policy.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                  onClick={() => handleTogglePolicy(policy.id)}
                                >
                                  {policy.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                </button>
                                <div className="relative">
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/ai-governance/policies/${policy.id}/edit`)}
                                    >
                                      Edit Policy
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/ai-governance/policies/${policy.id}/impact-analysis`)}
                                    >
                                      Impact Analysis
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/ai-governance/policies/${policy.id}/effectiveness`)}
                                    >
                                      Effectiveness Report
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

            {/* AI Incidents Tab */}
            {activeTab === 'incidents' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Severity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Reported By
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Date
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
                            No AI incidents found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as AIIncident[]).map((incident) => (
                          <tr key={incident.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(incident.type)}`}>
                                {incident.type.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(incident.severity)}`}>
                                {incident.severity}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-800 max-w-xs truncate">
                              {incident.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {incident.reportedByName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                                {incident.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {new Date(incident.timestamp).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/ai-governance/incidents/${incident.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                {incident.status === 'open' && (
                                  <button 
                                    className="text-green-600 hover:text-green-900"
                                    onClick={() => {
                                      // Resolve incident
                                      console.log('Resolving incident:', incident.id);
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                )}
                                <div className="relative">
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/ai-governance/incidents/${incident.id}/analysis`)}
                                    >
                                      Incident Analysis
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/ai-governance/incidents/${incident.id}/report`)}
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

            {/* Analytics Tab */}
            {activeTab === 'analytics' && governanceStats && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Decision Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Decisions</span>
                        <span className="font-medium">{governanceStats.totalDecisions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Allowed Decisions</span>
                        <span className="font-medium">{governanceStats.allowedDecisions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Blocked Decisions</span>
                        <span className="font-medium">{governanceStats.blockedDecisions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Accuracy Rate</span>
                        <span className="font-medium">{governanceStats.decisionAccuracy}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Policy Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Policies</span>
                        <span className="font-medium">{governanceStats.totalPolicies}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Policies</span>
                        <span className="font-medium">{governanceStats.activePolicies}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Human Interventions</span>
                        <span className="font-medium">{governanceStats.humanInterventionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Bias Detection</span>
                        <span className="font-medium">{governanceStats.biasDetectionRate}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Incident Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Incidents</span>
                        <span className="font-medium">{governanceStats.totalIncidents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Open Incidents</span>
                        <span className="font-medium">{governanceStats.openIncidents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Resolved Incidents</span>
                        <span className="font-medium">{governanceStats.resolvedIncidents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pending Reviews</span>
                        <span className="font-medium">{governanceStats.pendingReviews}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Policy Effectiveness</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Content Moderation</span>
                        <span className="font-medium">98.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Safety Policy</span>
                        <span className="font-medium">99.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Privacy Protection</span>
                        <span className="font-medium">97.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ethical Guidelines</span>
                        <span className="font-medium">96.3%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Decision Trend</h3>
                  <div className="h-64 flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-slate-700" />
                    <p className="ml-4 text-slate-700">Weekly decision trend visualization would appear here</p>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">AI Governance Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Decision Parameters</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Minimum Confidence Threshold</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue="70"
                            className="w-32 accent-blue-600 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                          />
                          <span className="text-sm text-gray-900">70%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Auto-Approval Limit</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue="90"
                            className="w-32 accent-blue-600 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                          />
                          <span className="text-sm text-gray-900">90%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Review Queue Size</span>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            defaultValue="10"
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Monitoring Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Bias Detection</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border text-gray-950 border-gray-400 font-black"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Ethical Violations</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border text-gray-950 border-gray-400 font-black"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Accuracy Checks</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border text-gray-950 border-gray-400 font-black"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <input
                        id="gdpr-compliance"
                        type="checkbox"
                        className="h-4 w-4 text-slate-900 focus:ring-blue-500 border-gray-300 rounded mt-1 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                        defaultChecked
                      />
                      <div className="ml-3">
                        <label htmlFor="gdpr-compliance" className="block text-sm font-medium text-gray-700">
                          GDPR Compliance
                        </label>
                        <p className="text-sm text-slate-700">Enable GDPR-compliant data handling for AI decisions</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <input
                        id="ccpa-compliance"
                        type="checkbox"
                        className="h-4 w-4 text-slate-900 focus:ring-blue-500 border-gray-300 rounded mt-1 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                        defaultChecked
                      />
                      <div className="ml-3">
                        <label htmlFor="ccpa-compliance" className="block text-sm font-medium text-gray-700">
                          CCPA Compliance
                        </label>
                        <p className="text-sm text-slate-700">Enable CCPA-compliant data handling for AI decisions</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <input
                        id="hipaa-compliance"
                        type="checkbox"
                        className="h-4 w-4 text-slate-900 focus:ring-blue-500 border-gray-300 rounded mt-1 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                      />
                      <div className="ml-3">
                        <label htmlFor="hipaa-compliance" className="block text-sm font-medium text-gray-700">
                          HIPAA Compliance
                        </label>
                        <p className="text-sm text-slate-700">Enable HIPAA-compliant data handling for AI decisions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {['decisions', 'policies', 'incidents'].includes(activeTab) && totalPages > 1 && (
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
                  <span className="font-medium">{Math.min(indexOfLastItem, (activeTab === 'decisions' ? filteredDecisions : activeTab === 'policies' ? filteredPolicies : filteredIncidents).length)}</span> of{' '}
                  <span className="font-medium">{(activeTab === 'decisions' ? filteredDecisions : activeTab === 'policies' ? filteredPolicies : filteredIncidents).length}</span> results
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

      {/* Create Policy Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New AI Policy</h3>
                <button 
                  className="text-slate-700 hover:text-gray-700"
                  onClick={() => setShowCreateModal(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleCreatePolicy(); }}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="policy-name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="policy-name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newPolicy.name}
                    onChange={(e) => setNewPolicy({...newPolicy, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="policy-description">
                    Description
                  </label>
                  <textarea
                    id="policy-description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newPolicy.description}
                    onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="policy-category">
                    Category
                  </label>
                  <select
                    id="policy-category"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                    value={newPolicy.category}
                    onChange={(e) => setNewPolicy({...newPolicy, category: e.target.value})}
                  >
                    <option value="safety">Safety</option>
                    <option value="ethics">Ethics</option>
                    <option value="privacy">Privacy</option>
                    <option value="accuracy">Accuracy</option>
                    <option value="fairness">Fairness</option>
                  </select>
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
                    Create Policy
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

export default AIGovernancePage;