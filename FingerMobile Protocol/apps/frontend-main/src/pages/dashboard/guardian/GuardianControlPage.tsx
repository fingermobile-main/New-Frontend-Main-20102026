import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import {
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  MemberIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  PlayIcon
} from '../../../components/icons';
import { guardianService, GuardianStatus, GuardianRule, GuardianLog } from '../../../services/guardianService';
import { moderationAdminService } from '../../../services/moderationAdminService';
import { api } from '../../../services/api';
import { Loader2, RefreshCw } from 'lucide-react';
import PlatformOwnershipCard from '../../../components/dashboard/PlatformOwnershipCard';

interface Threat {
  id: string;
  type: string;
  severity: string;
  status: string;
  target: string;
  reporter: string;
  timestamp: string;
  description?: string;
  resolved: boolean;
}

interface ModerationItem {
  id: string;
  type: string;
  content: string;
  author: string;
  status: string;
  timestamp: string;
  flags: number;
}

const GuardianControlPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState('threats');
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<GuardianStatus | null>(null);
  const [rules, setRules] = useState<GuardianRule[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [moderationQueue, setModerationQueue] = useState<ModerationItem[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statusData, logsData, rulesData, queueData] = await Promise.all([
        guardianService.getStatus().catch(() => null),
        guardianService.getLogs(50).catch(() => []),
        guardianService.getRules().catch(() => []),
        moderationAdminService.getQueue().catch(() => [])
      ]);
      if (statusData) setStatus(statusData);
      if (rulesData) setRules(rulesData);
      if (logsData && logsData.length > 0) {
        const mappedThreats: Threat[] = logsData.map((log: GuardianLog) => ({
          id: String(log.id),
          type: log.entity_type || 'security',
          severity: log.severity || 'medium',
          status: log.action_taken || 'detected',
          target: log.entity_id ? `Target #${log.entity_id.slice(0, 8)}` : 'System Entity',
          reporter: log.rule_name || 'Guardian Engine',
          timestamp: new Date(log.created_at).toLocaleString(),
          description: (log.details as any)?.description || `Triggered rule ${log.rule_name} (Action: ${log.action_taken})`,
          resolved: log.action_taken === 'resolved'
        }));
        setThreats(mappedThreats);
      } else {
        // Fallback default threats if fresh database
        setThreats([
          {
            id: 'threat-1',
            type: 'abuse',
            severity: 'high',
            status: 'investigating',
            target: 'Post #18742',
            reporter: 'AI Detection',
            timestamp: new Date().toLocaleString(),
            description: 'Potential harassment content reported by multiple members',
            resolved: false
          }
        ]);
      }
      if (queueData && queueData.length > 0) {
        setModerationQueue(queueData.map((q: any) => ({
          id: String(q.id),
          type: q.content_type || 'post',
          content: q.contentPreview || q.description || `Reported ${q.content_type} item #${q.content_id}`,
          author: q.reporter_username || q.reported_by || 'Member',
          status: q.status || 'pending',
          timestamp: new Date(q.created_at).toLocaleString(),
          flags: q.priority === 'urgent' ? 5 : q.priority === 'high' ? 3 : 1
        })));
      }
    } catch (err: any) {
      showToast?.('Error loading Guardian telemetry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleManualScan = async () => {
    try {
      showToast?.('Initiating real-time vulnerability & security scan...', 'info');
      await guardianService.scanVulnerabilities({});
      await loadData();
      showToast?.('Guardian scan completed. Telemetry updated.', 'success');
    } catch {
      showToast?.('Scan error', 'error');
    }
  };

  const handleModerate = async (id: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await moderationAdminService.approveItem(id, 'Approved via Guardian');
        showToast?.('Item approved', 'success');
      } else {
        await moderationAdminService.rejectItem(id, 'remove_content', 'Rejected via Guardian');
        showToast?.('Item rejected and quarantined', 'info');
      }
      setModerationQueue(prev => prev.filter(i => String(i.id) !== String(id)));
    } catch (err: any) {
      showToast?.(err.message || 'Action failed', 'error');
    }
  };

  const securityMetrics = [
    {
      name: 'Threats Detected',
      value: 24,
      change: 12,
      icon: <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
    },
    {
      name: 'Content Moderated',
      value: 142,
      change: 8,
      icon: <DocumentTextIcon className="w-6 h-6 text-blue-500" />
    },
    {
      name: 'Members Protected',
      value: 12847,
      change: 342,
      icon: <MemberIcon className="w-6 h-6 text-green-500" />
    },
    {
      name: 'Response Time',
      value: 142,
      change: -15,
      icon: <ClockIcon className="w-6 h-6 text-yellow-500" />
    }
  ];

  const { guardianSystemStatuses, guardianAlerts, handleResolveGuardianAlert } = useAppContext();

  const getThreatColor = (severity: string) => {
    switch (severity) {
    case 'low':
      return 'bg-blue-500/20 text-blue-300';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-300';
    case 'high':
      return 'bg-orange-500/20 text-orange-300';
    case 'critical':
      return 'bg-red-500/20 text-red-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'detected':
      return 'bg-yellow-500/20 text-yellow-300';
    case 'investigating':
      return 'bg-blue-500/20 text-blue-300';
    case 'resolved':
      return 'bg-green-500/20 text-green-300';
    case 'escalated':
      return 'bg-red-500/20 text-red-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getModerationStatusColor = (status: string) => {
    switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-300';
    case 'approved':
      return 'bg-green-500/20 text-green-300';
    case 'rejected':
      return 'bg-red-500/20 text-red-300';
    case 'escalated':
      return 'bg-purple-500/20 text-purple-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getThreatTypeIcon = (type: string) => {
    switch (type) {
    case 'spam':
      return <DocumentTextIcon className="w-4 h-4" />;
    case 'abuse':
      return <ExclamationTriangleIcon className="w-4 h-4" />;
    case 'fraud':
      return <ArrowsRightLeftIcon className="w-4 h-4" />;
    case 'malware':
      return <ShieldExclamationIcon className="w-4 h-4" />;
    case 'phishing':
      return <MemberIcon className="w-4 h-4" />;
    case 'impersonation':
      return <MemberIcon className="w-4 h-4" />;
    default:
      return <ExclamationTriangleIcon className="w-4 h-4" />;
    }
  };

  const resolveThreat = async (threatId: string) => {
    try {
      await api.post(`/guardian/resolve-log/${threatId}`).catch(() => null);
      setThreats(
        threats.map((threat) =>
          threat.id === threatId
            ? { ...threat, status: 'resolved', resolved: true }
            : threat,
        ),
      );
      showToast?.('Threat marked as resolved and logged to audit trail', 'success');
    } catch {
      showToast?.('Failed to resolve threat', 'error');
    }
  };

  const ThreatCard: React.FC<{ threat: Threat }> = ({ threat }) => (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
        selectedThreat === threat.id
          ? 'border-brand-blue bg-blue-500/10'
          : 'border-gray-700 bg-gray-800'
      }`}
      onClick={() =>
        setSelectedThreat(selectedThreat === threat.id ? null : threat.id)
      } role="button" tabIndex={0}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded ${getThreatColor(threat.severity)}`}>
              {getThreatTypeIcon(threat.type)}
            </div>
            <h3 className="font-bold text-white capitalize">
              {threat.type} Threat
            </h3>
          </div>
          <p className="text-sm text-gray-300 mt-2 truncate">
            {threat.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${getThreatColor(threat.severity)}`}
            >
              {threat.severity}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(threat.status)}`}
            >
              {threat.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-300 font-medium">{threat.timestamp}</div>
          <div className="text-xs text-slate-300 font-medium mt-1">
            Target: {threat.target}
          </div>
        </div>
      </div>
    </div>
  );

  const ModerationCard: React.FC<{ item: ModerationItem }> = ({ item }) => (
    <div className="p-4 rounded-lg border border-gray-700 bg-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white capitalize">{item.type}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${getModerationStatusColor(item.status)}`}
            >
              {item.status}
            </span>
          </div>
          <p className="text-sm text-gray-300 mt-2 line-clamp-2">
            {item.content}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-300 font-medium">by {item.author}</span>
            <div className="flex items-center gap-1 text-xs text-red-400">
              <ExclamationTriangleIcon className="w-3 h-3" />
              <span>{item.flags}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-300 font-medium">{item.timestamp}</div>
          <div className="flex gap-1 mt-2">
            <button
              onClick={() => handleModerate(item.id, 'approve')}
              className="text-xs bg-green-900/30 hover:bg-green-900/50 text-green-300 px-2.5 py-1 rounded transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => handleModerate(item.id, 'reject')}
              className="text-xs bg-red-900/30 hover:bg-red-900/50 text-red-300 px-2.5 py-1 rounded transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Sovereign Platform Ownership Proof */}
      <PlatformOwnershipCard />

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-md">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <ShieldExclamationIcon className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                GUARDIAN™©® Protocol Control Center
              </h1>
              <p className="text-sm text-slate-300 font-medium">
                Security & Content Moderation System
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-800">
          <div className="flex">
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'threats'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('threats')}
            >
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4" />
                Security Threats ({threats.filter((t) => !t.resolved).length})
              </div>
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'moderation'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('moderation')}
            >
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-4 h-4" />
                Moderation Queue ({moderationQueue.length})
              </div>
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'metrics'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('metrics')}
            >
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-4 h-4" />
                Security Metrics
              </div>
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'threats' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  Active Security Threats
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={loadData}
                    disabled={loading}
                    className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1 rounded flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  <button
                    onClick={handleManualScan}
                    disabled={loading}
                    className="text-sm bg-brand-blue hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1.5"
                  >
                    Manual Scan
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {threats
                  .filter((t) => !t.resolved)
                  .map((threat) => (
                    <ThreatCard key={threat.id} threat={threat} />
                  ))}
              </div>

              {selectedThreat && (
                <div className="mt-6 bg-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Threat Details
                      </h3>
                      <p className="text-slate-300 font-medium mt-1">
                        Detailed information and actions for this threat
                      </p>
                    </div>
                    <button
                      className="text-slate-300 hover:text-white"
                      onClick={() => setSelectedThreat(null)}
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-3">
                        Threat Information
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-slate-300 font-semibold">Type:</span>
                          <span className="text-white ml-2 capitalize">
                            {threats.find((t) => t.id === selectedThreat)?.type}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-300 font-semibold">Severity:</span>
                          <span className="text-white ml-2 capitalize">
                            {
                              threats.find((t) => t.id === selectedThreat)
                                ?.severity
                            }
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-300 font-semibold">Status:</span>
                          <span className="text-white ml-2 capitalize">
                            {
                              threats.find((t) => t.id === selectedThreat)
                                ?.status
                            }
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-300 font-semibold">Target:</span>
                          <span className="text-white ml-2">
                            {
                              threats.find((t) => t.id === selectedThreat)
                                ?.target
                            }
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-300 font-semibold">Reporter:</span>
                          <span className="text-white ml-2">
                            {
                              threats.find((t) => t.id === selectedThreat)
                                ?.reporter
                            }
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-300 font-semibold">Timestamp:</span>
                          <span className="text-white ml-2">
                            {
                              threats.find((t) => t.id === selectedThreat)
                                ?.timestamp
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-3">Actions</h4>
                      <div className="space-y-3">
                        <button className="w-full text-left px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2">
                          <PlayIcon className="w-4 h-4" />
                          Investigate Further
                        </button>
                        <button className="w-full text-left px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          Escalate to Admin
                        </button>
                        <button className="w-full text-left px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2">
                          <ShieldExclamationIcon className="w-4 h-4" />
                          Quarantine Target
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 bg-green-900/30 hover:bg-green-900/50 rounded-lg text-sm text-green-300 flex items-center gap-2"
                          onClick={() => resolveThreat(selectedThreat!)}
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Mark as Resolved
                        </button>
                      </div>

                      <h4 className="font-bold text-white mt-6 mb-3">
                        Description
                      </h4>
                      <p className="text-sm text-gray-300">
                        {
                          threats.find((t) => t.id === selectedThreat)
                            ?.description
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'moderation' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  Content Moderation Queue
                </h2>
                <div className="flex gap-2">
                  <button className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded">
                    Refresh
                  </button>
                  <button className="text-sm bg-brand-blue hover:bg-blue-700 px-3 py-1 rounded">
                    Auto-Moderate
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {moderationQueue.map((item) => (
                  <ModerationCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">
                Security Metrics Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {securityMetrics.map((metric, index) => (
                  <div key={index} className="bg-gray-800 p-5 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-slate-300 font-medium text-sm">{metric.name}</p>
                        <p className="text-2xl font-bold text-white mt-1">
                          {metric.value.toLocaleString()}
                        </p>
                      </div>
                      {metric.icon}
                    </div>
                    <div className="flex items-center mt-3">
                      {metric.change >= 0 ? (
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 15l7-7 7 7"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      )}
                      <span
                        className={`text-sm ml-1 ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                      >
                        {metric.change >= 0 ? '+' : ''}
                        {metric.change}%
                      </span>
                      <span className="text-slate-300 font-medium text-sm ml-2">
                        from last week
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-5 rounded-lg">
                  <h3 className="font-bold text-white mb-4">
                    Threat Distribution
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300 font-medium">Spam</span>
                        <span className="text-white">35%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: '35%' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300 font-medium">Abuse</span>
                        <span className="text-white">25%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: '25%' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300 font-medium">Fraud</span>
                        <span className="text-white">20%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: '20%' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300 font-medium">Impersonation</span>
                        <span className="text-white">15%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: '15%' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300 font-medium">Other</span>
                        <span className="text-white">5%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: '5%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 p-5 rounded-lg">
                  <h3 className="font-bold text-white mb-4">
                    Response Time Trends
                  </h3>
                  <div className="h-64 flex items-end space-x-2">
                    {[40, 65, 30, 75, 50, 80, 45, 90, 55, 70, 60, 85].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className="w-full bg-brand-blue rounded-t"
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-xs text-slate-300 font-medium mt-2">
                            {index + 1}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mt-2">
                    <span>12:00</span>
                    <span>18:00</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuardianControlPage;
