import React, { useState, useEffect } from 'react';
import { 
  Shield,
  ShieldAlert,
  ShieldCheck,
  Activity,
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
  FileText,
  FolderKanban,
  Server,
  Lock,
  Network,
  AlertTriangle,
  Zap,
  Bot,
  ChevronLeft,
  ChevronRight,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GuardianAISystem {
  id: number;
  name: string;
  description: string;
  version: string;
  status: 'active' | 'inactive' | 'training' | 'maintenance';
  category: 'threat_detection' | 'content_moderation' | 'behavioral_analysis' | 'privacy_protection' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidenceThreshold: number;
  sensitivityLevel: 'low' | 'medium' | 'high';
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  lastTrained: string;
  trainingDataSize: number;
  modelType: string;
  parameters: any;
}

interface GuardianAIEvent {
  id: number;
  systemId: number;
  systemName: string;
  eventType: 'threat_detected' | 'anomaly_found' | 'policy_violation' | 'false_positive' | 'system_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  confidence: number;
  status: 'new' | 'investigating' | 'resolved' | 'escalated';
  resolvedBy?: number;
  resolutionNotes?: string;
  triggeredBy: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

interface GuardianAIResponse {
  id: number;
  eventId: number;
  action: 'block' | 'flag' | 'allow' | 'notify' | 'quarantine';
  triggeredAt: string;
  executedBy: number;
  executedByName: string;
  outcome: 'success' | 'failure' | 'partial';
  details: string;
  createdAt: string;
  updatedAt: string;
}

interface GuardianAIReport {
  id: number;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'incident' | 'compliance';
  period: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  dueDate: string;
  submittedAt?: string;
  approverId?: number;
  approverName?: string;
  recipients: string[];
  createdAt: string;
  updatedAt: string;
  data: any;
}

const GuardianAiPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'systems' | 'events' | 'responses' | 'reports' | 'dashboard'>('systems');
  const [guardianAISystems, setGuardianAISystems] = useState<GuardianAISystem[]>([]);
  const [guardianAIEvents, setGuardianAIEvents] = useState<GuardianAIEvent[]>([]);
  const [guardianAIResponses, setGuardianAIResponses] = useState<GuardianAIResponse[]>([]);
  const [guardianAIReports, setGuardianAIReports] = useState<GuardianAIReport[]>([]);
  const [filteredSystems, setFilteredSystems] = useState<GuardianAISystem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<GuardianAIEvent[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<GuardianAIResponse[]>([]);
  const [filteredReports, setFilteredReports] = useState<GuardianAIReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [guardianAIStats, setGuardianAIStats] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSystem, setNewSystem] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    category: 'threat_detection' as 'threat_detection' | 'content_moderation' | 'behavioral_analysis' | 'privacy_protection' | 'other',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    confidenceThreshold: 0.8,
    sensitivityLevel: 'medium' as 'low' | 'medium' | 'high',
    modelType: 'neural_network'
  });

  const navigate = useNavigate();
  const history = { push: (path: string) => navigate(path), replace: (path: string) => navigate(path, { replace: true }) };

  // Simulate loading Guardian AI data
  useEffect(() => {
    const fetchGuardianAIData = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        const mockSystems: GuardianAISystem[] = [
          {
            id: 1,
            name: 'Threat Detection Engine',
            description: 'AI system for detecting security threats and anomalies',
            version: '2.3.1',
            status: 'active',
            category: 'threat_detection',
            priority: 'critical',
            confidenceThreshold: 0.85,
            sensitivityLevel: 'high',
            createdBy: 1,
            updatedBy: 1,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-09-15T00:00:00Z',
            lastTrained: '2024-09-10T00:00:00Z',
            trainingDataSize: 5000000,
            modelType: 'neural_network',
            parameters: { layers: 12, neurons: 512, activation: 'relu' }
          },
          {
            id: 2,
            name: 'Content Moderation AI',
            description: 'AI system for moderating user-generated content',
            version: '1.8.4',
            status: 'active',
            category: 'content_moderation',
            priority: 'high',
            confidenceThreshold: 0.90,
            sensitivityLevel: 'medium',
            createdBy: 1,
            updatedBy: 1,
            createdAt: '2024-02-01T00:00:00Z',
            updatedAt: '2024-08-20T00:00:00Z',
            lastTrained: '2024-08-15T00:00:00Z',
            trainingDataSize: 10000000,
            modelType: 'transformer',
            parameters: { maxTokens: 512, attentionHeads: 8 }
          },
          {
            id: 3,
            name: 'Behavioral Analysis AI',
            description: 'AI system for analyzing user behavior patterns',
            version: '1.5.2',
            status: 'training',
            category: 'behavioral_analysis',
            priority: 'medium',
            confidenceThreshold: 0.80,
            sensitivityLevel: 'low',
            createdBy: 1,
            updatedBy: 1,
            createdAt: '2024-03-01T00:00:00Z',
            updatedAt: '2024-10-01T00:00:00Z',
            lastTrained: '2024-09-25T00:00:00Z',
            trainingDataSize: 8000000,
            modelType: 'rnn',
            parameters: { sequenceLength: 50, lstmUnits: 256 }
          },
          {
            id: 4,
            name: 'Privacy Protection AI',
            description: 'AI system for protecting user privacy',
            version: '1.2.0',
            status: 'maintenance',
            category: 'privacy_protection',
            priority: 'high',
            confidenceThreshold: 0.95,
            sensitivityLevel: 'high',
            createdBy: 1,
            updatedBy: 1,
            createdAt: '2024-04-01T00:00:00Z',
            updatedAt: '2024-07-15T00:00:00Z',
            lastTrained: '2024-07-10T00:00:00Z',
            trainingDataSize: 3000000,
            modelType: 'classifier',
            parameters: { algorithm: 'svm', kernel: 'rbf' }
          }
        ];

        const mockEvents: GuardianAIEvent[] = [
          {
            id: 1,
            systemId: 1,
            systemName: 'Threat Detection Engine',
            eventType: 'threat_detected',
            severity: 'critical',
            description: 'Suspicious network activity detected from IP 192.168.1.100',
            timestamp: '2024-10-09T10:30:00Z',
            confidence: 0.95,
            status: 'investigating',
            triggeredBy: 'network_monitor',
            metadata: { ip: '192.168.1.100', port: 4444, protocol: 'tcp' },
            createdAt: '2024-10-09T10:30:00Z',
            updatedAt: '2024-10-09T10:30:00Z'
          },
          {
            id: 2,
            systemId: 2,
            systemName: 'Content Moderation AI',
            eventType: 'policy_violation',
            severity: 'high',
            description: 'Potentially harmful content detected in user post',
            timestamp: '2024-10-09T09:45:00Z',
            confidence: 0.88,
            status: 'new',
            triggeredBy: 'content_analyzer',
            metadata: { postId: 'post_12345', userId: 'user_67890', contentType: 'image' },
            createdAt: '2024-10-09T09:45:00Z',
            updatedAt: '2024-10-09T09:45:00Z'
          },
          {
            id: 3,
            systemId: 3,
            systemName: 'Behavioral Analysis AI',
            eventType: 'anomaly_found',
            severity: 'medium',
            description: 'Unusual login pattern detected for user account',
            timestamp: '2024-10-09T08:20:00Z',
            confidence: 0.75,
            status: 'resolved',
            resolvedBy: 2,
            resolutionNotes: 'False positive - legitimate user behavior',
            triggeredBy: 'behavior_analyzer',
            metadata: { userId: 'user_111213', location: 'different_from_usual', time: 'unusual_hour' },
            createdAt: '2024-10-09T08:20:00Z',
            updatedAt: '2024-10-09T08:25:00Z'
          },
          {
            id: 4,
            systemId: 4,
            systemName: 'Privacy Protection AI',
            eventType: 'policy_violation',
            severity: 'high',
            description: 'Unauthorized data access attempt detected',
            timestamp: '2024-10-09T07:15:00Z',
            confidence: 0.92,
            status: 'escalated',
            triggeredBy: 'privacy_monitor',
            metadata: { userId: 'user_141516', accessedResource: 'pii_data', action: 'read' },
            createdAt: '2024-10-09T07:15:00Z',
            updatedAt: '2024-10-09T07:20:00Z'
          }
        ];

        const mockResponses: GuardianAIResponse[] = [
          {
            id: 1,
            eventId: 1,
            action: 'block',
            triggeredAt: '2024-10-09T10:30:05Z',
            executedBy: 1,
            executedByName: 'AI System',
            outcome: 'success',
            details: 'IP address 192.168.1.100 blocked for 24 hours',
            createdAt: '2024-10-09T10:30:05Z',
            updatedAt: '2024-10-09T10:30:05Z'
          },
          {
            id: 2,
            eventId: 2,
            action: 'flag',
            triggeredAt: '2024-10-09T09:45:10Z',
            executedBy: 1,
            executedByName: 'AI System',
            outcome: 'success',
            details: 'Post flagged for human review',
            createdAt: '2024-10-09T09:45:10Z',
            updatedAt: '2024-10-09T09:45:10Z'
          },
          {
            id: 3,
            eventId: 3,
            action: 'allow',
            triggeredAt: '2024-10-09T08:25:00Z',
            executedBy: 2,
            executedByName: 'Human Moderator',
            outcome: 'success',
            details: 'Marked as false positive',
            createdAt: '2024-10-09T08:25:00Z',
            updatedAt: '2024-10-09T08:25:00Z'
          }
        ];

        const mockReports: GuardianAIReport[] = [
          {
            id: 1,
            title: 'Daily Threat Report - 2024-10-09',
            description: 'Daily summary of AI-detected threats',
            type: 'daily',
            period: '2024-10-09',
            status: 'published',
            dueDate: '2024-10-09T00:00:00Z',
            submittedAt: '2024-10-09T08:00:00Z',
            approverId: 1,
            approverName: 'Security Admin',
            recipients: ['security-team@company.com', 'executives@company.com'],
            createdAt: '2024-10-08T00:00:00Z',
            updatedAt: '2024-10-09T08:00:00Z',
            data: { 
              totalEvents: 45, 
              criticalEvents: 3, 
              highEvents: 12, 
              resolvedEvents: 38, 
              falsePositives: 7 
            }
          },
          {
            id: 2,
            title: 'Weekly AI Performance Report',
            description: 'Weekly performance metrics for Guardian AI systems',
            type: 'weekly',
            period: '2024-W41',
            status: 'approved',
            dueDate: '2024-10-14T00:00:00Z',
            submittedAt: '2024-10-14T10:00:00Z',
            approverId: 1,
            approverName: 'Security Admin',
            recipients: ['ai-team@company.com', 'ops@company.com'],
            createdAt: '2024-10-01T00:00:00Z',
            updatedAt: '2024-10-14T10:00:00Z',
            data: { 
              accuracy: 94.2, 
              responseTime: 0.25, 
              falsePositiveRate: 3.1, 
              systemUptime: 99.9 
            }
          },
          {
            id: 3,
            title: 'Monthly Privacy Compliance Report',
            description: 'Monthly assessment of privacy protection effectiveness',
            type: 'monthly',
            period: '2024-10',
            status: 'review',
            dueDate: '2024-11-05T00:00:00Z',
            approverId: 1,
            approverName: 'Privacy Officer',
            recipients: ['privacy@company.com', 'legal@company.com'],
            createdAt: '2024-10-01T00:00:00Z',
            updatedAt: '2024-10-25T00:00:00Z',
            data: { 
              privacyViolations: 5, 
              dataBreachAttempts: 12, 
              successfulPreventions: 48, 
              complianceScore: 97.5 
            }
          }
        ];

        const mockStats = {
          totalSystems: 12,
          activeSystems: 10,
          criticalSystems: 3,
          totalEvents: 1245,
          criticalEvents: 23,
          highEvents: 87,
          resolvedEvents: 1120,
          falsePositives: 102,
          systemAccuracy: 94.2,
          averageResponseTime: 0.25,
          protectionCoverage: 97.8,
          threatDetectionRate: 98.5,
          riskAssessment: {
            highRisk: 8,
            mediumRisk: 12,
            lowRisk: 22
          }
        };

        setGuardianAISystems(mockSystems);
        setGuardianAIEvents(mockEvents);
        setGuardianAIResponses(mockResponses);
        setGuardianAIReports(mockReports);
        setFilteredSystems(mockSystems);
        setFilteredEvents(mockEvents);
        setFilteredResponses(mockResponses);
        setFilteredReports(mockReports);
        setGuardianAIStats(mockStats);
        setLoading(false);
      }, 1000);
    };

    fetchGuardianAIData();
  }, []);

  // Filter data based on active tab and filters
  useEffect(() => {
    if (activeTab === 'systems') {
      let result = guardianAISystems;

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
        result = result.filter(item => item.status === filterStatus);
      }

      if (filterPriority !== 'all') {
        result = result.filter(item => item.priority === filterPriority);
      }

      setFilteredSystems(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'events') {
      let result = guardianAIEvents;

      if (searchTerm) {
        result = result.filter(item => 
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.systemName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredEvents(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'responses') {
      let result = guardianAIResponses;

      if (searchTerm) {
        result = result.filter(item => 
          item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.executedByName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredResponses(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'reports') {
      let result = guardianAIReports;

      if (searchTerm) {
        result = result.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredReports(result);
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [searchTerm, filterCategory, filterStatus, filterPriority, activeTab, guardianAISystems, guardianAIEvents, guardianAIResponses, guardianAIReports]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  let currentItems: any[] = [];
  let totalPages = 0;
  
  if (activeTab === 'systems') {
    currentItems = filteredSystems.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredSystems.length / itemsPerPage);
  } else if (activeTab === 'events') {
    currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  } else if (activeTab === 'responses') {
    currentItems = filteredResponses.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  } else if (activeTab === 'reports') {
    currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  }

  const handleCreateSystem = async () => {
    try {
      // In a real implementation, this would call the API to create a system
      console.log('Creating system:', newSystem);
      setShowCreateModal(false);
      // Reset form
      setNewSystem({
        name: '',
        description: '',
        version: '1.0.0',
        category: 'threat_detection',
        priority: 'medium',
        confidenceThreshold: 0.8,
        sensitivityLevel: 'medium',
        modelType: 'neural_network'
      });
    } catch (error) {
      console.error('Error creating system:', error);
    }
  };

  const handleTrainSystem = async (systemId: number) => {
    try {
      // In a real implementation, this would call the API to train a system
      console.log('Training system:', systemId);
      setGuardianAISystems(guardianAISystems.map(sys => 
        sys.id === systemId ? {...sys, status: 'training', lastTrained: new Date().toISOString()} : sys
      ));
      setFilteredSystems(filteredSystems.map(sys => 
        sys.id === systemId ? {...sys, status: 'training', lastTrained: new Date().toISOString()} : sys
      ));
    } catch (error) {
      console.error('Error training system:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'threat_detection': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'content_moderation': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'behavioral_analysis': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'privacy_protection': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
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
      case 'training': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'maintenance': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'new': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'investigating': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'resolved': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'escalated': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'approved': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'published': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'success': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'failure': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'partial': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'low': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'block': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'flag': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'allow': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'notify': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'quarantine': return 'bg-purple-100 text-purple-950 border border-purple-400 font-bold';
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
              <Bot className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">Guardian AI Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add System
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {guardianAIStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Server className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Systems</p>
                  <p className="text-2xl font-semibold text-gray-900">{guardianAIStats.totalSystems}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Systems</p>
                  <p className="text-2xl font-semibold text-gray-900">{guardianAIStats.activeSystems}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Critical Events</p>
                  <p className="text-2xl font-semibold text-gray-900">{guardianAIStats.criticalEvents}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">{guardianAIStats.systemAccuracy}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-slate-300 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('systems')}
              className={`${
                activeTab === 'systems'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Server className="h-4 w-4 mr-2" />
              Systems
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Activity className="h-4 w-4 mr-2" />
              Events
            </button>
            <button
              onClick={() => setActiveTab('responses')}
              className={`${
                activeTab === 'responses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Responses
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
            
            {activeTab === 'systems' && (
              <>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="threat_detection">Threat Detection</option>
                  <option value="content_moderation">Content Moderation</option>
                  <option value="behavioral_analysis">Behavioral Analysis</option>
                  <option value="privacy_protection">Privacy Protection</option>
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
                  <option value="training">Training</option>
                  <option value="maintenance">Maintenance</option>
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
                {activeTab === 'systems' ? `${filteredSystems.length} systems` : 
                 activeTab === 'events' ? `${filteredEvents.length} events` : 
                 activeTab === 'responses' ? `${filteredResponses.length} responses` : 
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
            {/* Guardian AI Systems Tab */}
            {activeTab === 'systems' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          System
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
                          Confidence
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Last Trained
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
                            No Guardian AI systems found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as GuardianAISystem[]).map((system) => (
                          <tr key={system.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{system.name}</div>
                              <div className="text-sm text-slate-700 max-w-xs truncate">{system.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {system.version}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(system.category)}`}>
                                {system.category.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(system.priority)}`}>
                                {system.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(system.status)}`}>
                                {system.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {(system.confidenceThreshold * 100).toFixed(0)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {new Date(system.lastTrained).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/guardian/systems/${system.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  className="text-green-600 hover:text-green-900"
                                  onClick={() => handleTrainSystem(system.id)}
                                >
                                  <Zap className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/guardian/systems/${system.id}/config`)}
                                    >
                                      Configuration
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/guardian/systems/${system.id}/performance`)}
                                    >
                                      Performance
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/guardian/systems/${system.id}/training`)}
                                    >
                                      Training Data
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

            {/* Guardian AI Events Tab */}
            {activeTab === 'events' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Event
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          System
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Severity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Confidence
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Timestamp
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
                            No Guardian AI events found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as GuardianAIEvent[]).map((event) => (
                          <tr key={event.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{event.description}</div>
                              <div className="text-sm text-slate-700 max-w-xs truncate">Triggered by: {event.triggeredBy}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {event.systemName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.eventType === 'threat_detected' ? 'bg-red-100 text-red-950 border border-red-400 font-bold' : event.eventType === 'anomaly_found' ? 'bg-amber-100 text-red-950 border border-red-400 font-bold' : event.eventType === 'policy_violation' ? 'bg-orange-100 text-red-950' : 'bg-gray-100 text-red-950'}font-black`}>
                                {event.eventType.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                                {event.severity}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {(event.confidence * 100).toFixed(0)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(event.status)}`}>
                                {event.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {new Date(event.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/guardian/events/${event.id}/details`)}
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
                                      onClick={() => history.push(`/dashboard/guardian/events/${event.id}/responses`)}
                                    >
                                      View Responses
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/guardian/events/${event.id}/metadata`)}
                                    >
                                      Metadata
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/guardian/events/${event.id}/related`)}
                                    >
                                      Related Events
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

            {/* Guardian AI Responses Tab */}
            {activeTab === 'responses' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Action
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Event
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Executed By
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Outcome
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Details
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Timestamp
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
                            No Guardian AI responses found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as GuardianAIResponse[]).map((response) => (
                          <tr key={response.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(response.action)}`}>
                                {response.action}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              Event #{response.eventId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {response.executedByName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${response.outcome === 'success' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : response.outcome === 'failure' ? 'bg-red-100 text-green-950 border border-green-400 font-bold' : 'bg-amber-100 text-green-950 border border-green-400 font-bold'}font-black`}>
                                {response.outcome}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-800 max-w-xs truncate">
                              {response.details}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {new Date(response.triggeredAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/guardian/responses/${response.id}/details`)}
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
                                      onClick={() => history.push(`/dashboard/guardian/responses/${response.id}/audit`)}
                                    >
                                      Audit Trail
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/guardian/responses/${response.id}/effectiveness`)}
                                    >
                                      Effectiveness Review
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

            {/* Guardian AI Reports Tab */}
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
                            No Guardian AI reports found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as GuardianAIReport[]).map((report) => (
                          <tr key={report.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{report.title}</div>
                              <div className="text-sm text-slate-700 max-w-xs truncate">{report.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.type === 'daily' ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold' : report.type === 'weekly' ? 'bg-green-100 text-blue-950 border border-blue-400 font-bold' : report.type === 'monthly' ? 'bg-purple-100 text-blue-950 border border-blue-400 font-bold' : 'bg-amber-100 text-blue-950 border border-blue-400 font-bold'}font-black`}>
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
                                  onClick={() => history.push(`/dashboard/guardian/reports/${report.id}/view`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  className="text-green-600 hover:text-green-900"
                                  onClick={() => {
                                    // Download report
                                    console.log('Downloading report:', report.id);
                                  }}
                                >
                                  <FileText className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/guardian/reports/${report.id}/edit`)}
                                    >
                                      Edit Report
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/guardian/reports/${report.id}/recipients`)}
                                    >
                                      Manage Recipients
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/guardian/reports/${report.id}/approval`)}
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
            {activeTab === 'dashboard' && guardianAIStats && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">System Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Systems</span>
                        <span className="font-medium">{guardianAIStats.totalSystems}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Systems</span>
                        <span className="font-medium">{guardianAIStats.activeSystems}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Critical Systems</span>
                        <span className="font-medium">{guardianAIStats.criticalSystems}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Accuracy Rate</span>
                        <span className="font-medium">{guardianAIStats.systemAccuracy}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Event Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Events</span>
                        <span className="font-medium">{guardianAIStats.totalEvents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Critical Events</span>
                        <span className="font-medium">{guardianAIStats.criticalEvents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">High Priority Events</span>
                        <span className="font-medium">{guardianAIStats.highEvents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Resolved Events</span>
                        <span className="font-medium">{guardianAIStats.resolvedEvents}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Accuracy Rate</span>
                        <span className="font-medium">{guardianAIStats.systemAccuracy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg. Response Time</span>
                        <span className="font-medium">{guardianAIStats.averageResponseTime}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">False Positives</span>
                        <span className="font-medium">{guardianAIStats.falsePositives}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Protection Coverage</span>
                        <span className="font-medium">{guardianAIStats.protectionCoverage}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Risk Assessment</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">High Risk Areas</span>
                        <span className="font-medium">{guardianAIStats.riskAssessment.highRisk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Medium Risk Areas</span>
                        <span className="font-medium">{guardianAIStats.riskAssessment.mediumRisk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Low Risk Areas</span>
                        <span className="font-medium">{guardianAIStats.riskAssessment.lowRisk}</span>
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
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Events</h3>
                    <div className="space-y-4">
                      {[
                        { id: 1, name: 'Threat Detected', severity: 'critical', timestamp: '2024-10-09 10:30:00', system: 'Threat Detection Engine' },
                        { id: 2, name: 'Policy Violation', severity: 'high', timestamp: '2024-10-09 09:45:00', system: 'Content Moderation AI' },
                        { id: 3, name: 'Anomaly Found', severity: 'medium', timestamp: '2024-10-09 08:20:00', system: 'Behavioral Analysis AI' }
                      ].map((event, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{event.name}</p>
                            <p className="text-sm text-slate-700">{event.system} • {event.timestamp}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${event.severity === 'critical' ? 'bg-red-100 text-red-950 border border-red-400 font-bold' : event.severity === 'high' ? 'bg-orange-100 text-red-950' : 'bg-amber-100 text-red-950 border border-red-400 font-bold'}font-black`}>
                            {event.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">System Performance</h3>
                    <div className="h-64 flex items-center justify-center">
                      <BarChart3 className="h-16 w-16 text-slate-700" />
                      <p className="ml-4 text-slate-700">System performance visualization would appear here</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Protection Coverage</h3>
                  <div className="h-64 flex items-center justify-center">
                    <ShieldCheck className="h-16 w-16 text-slate-700" />
                    <p className="ml-4 text-slate-700">Protection coverage visualization would appear here</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {['systems', 'events', 'responses', 'reports'].includes(activeTab) && totalPages > 1 && (
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
                  <span className="font-medium">{Math.min(indexOfLastItem, (activeTab === 'systems' ? filteredSystems : activeTab === 'events' ? filteredEvents : activeTab === 'responses' ? filteredResponses : filteredReports).length)}</span> of{' '}
                  <span className="font-medium">{(activeTab === 'systems' ? filteredSystems : activeTab === 'events' ? filteredEvents : activeTab === 'responses' ? filteredResponses : filteredReports).length}</span> results
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

      {/* Create System Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Guardian AI System</h3>
                <button 
                  className="text-slate-700 hover:text-gray-700"
                  onClick={() => setShowCreateModal(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleCreateSystem(); }}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="system-name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="system-name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newSystem.name}
                    onChange={(e) => setNewSystem({...newSystem, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="system-description">
                    Description
                  </label>
                  <textarea
                    id="system-description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newSystem.description}
                    onChange={(e) => setNewSystem({...newSystem, description: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="system-version">
                      Version
                    </label>
                    <input
                      type="text"
                      id="system-version"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      value={newSystem.version}
                      onChange={(e) => setNewSystem({...newSystem, version: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="system-category">
                      Category
                    </label>
                    <select
                      id="system-category"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                      value={newSystem.category}
                      onChange={(e) => setNewSystem({...newSystem, category: e.target.value as any})}
                    >
                      <option value="threat_detection">Threat Detection</option>
                      <option value="content_moderation">Content Moderation</option>
                      <option value="behavioral_analysis">Behavioral Analysis</option>
                      <option value="privacy_protection">Privacy Protection</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="system-priority">
                      Priority
                    </label>
                    <select
                      id="system-priority"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                      value={newSystem.priority}
                      onChange={(e) => setNewSystem({...newSystem, priority: e.target.value as any})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="system-model-type">
                      Model Type
                    </label>
                    <select
                      id="system-model-type"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                      value={newSystem.modelType}
                      onChange={(e) => setNewSystem({...newSystem, modelType: e.target.value})}
                    >
                      <option value="neural_network">Neural Network</option>
                      <option value="transformer">Transformer</option>
                      <option value="rnn">RNN</option>
                      <option value="classifier">Classifier</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="system-confidence">
                      Confidence Threshold (%)
                    </label>
                    <input
                      type="number"
                      id="system-confidence"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                      value={newSystem.confidenceThreshold * 100}
                      onChange={(e) => setNewSystem({...newSystem, confidenceThreshold: parseFloat(e.target.value)/100})}
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="system-sensitivity">
                      Sensitivity
                    </label>
                    <select
                      id="system-sensitivity"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                      value={newSystem.sensitivityLevel}
                      onChange={(e) => setNewSystem({...newSystem, sensitivityLevel: e.target.value as any})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
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
                    Create System
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

export default GuardianAiPage;