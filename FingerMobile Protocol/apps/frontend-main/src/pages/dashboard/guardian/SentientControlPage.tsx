import React, { useState, useEffect } from 'react';
import {
  CpuChipIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  ChartPieIcon,
  QueueListIcon,
  DocumentTextIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '../../../components/icons';
import { sentientService, BehavioralAnalysis, BehavioralBaseline } from '../../../services/sentientService';
import PlatformOwnershipCard from '../../../components/dashboard/PlatformOwnershipCard';

interface Process {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  priority: 'high' | 'medium' | 'low';
  startTime: string;
  estimatedCompletion: string;
}

interface Insight {
  id: string;
  title: string;
  category:
    | 'content_trends'
    | 'security'
    | 'member_behavior'
    | 'system_optimization';
  confidence: number;
  timestamp: string;
  description?: string;
}

interface Conversation {
  id: string;
  member: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const SentientControlPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('processes');
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  // Real data states
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [engineStatus, setEngineStatus] = useState<any>(null);
  const [configs, setConfigs] = useState<any[]>([]);
  const [baseline, setBaseline] = useState<BehavioralBaseline | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sentient telemetry on mount
  useEffect(() => {
    fetchSentientData();
  }, []);

  const fetchSentientData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [anomData, statusData, configsData] = await Promise.all([
        sentientService.getAnomalies(undefined, 50).catch(() => []),
        sentientService.getStatus().catch(() => null),
        sentientService.getConfigs().catch(() => [])
      ]);
      setAnomalies(anomData);
      if (statusData) {
        setEngineStatus(statusData);
        if (statusData.killSwitchEngaged) {
          setIsProcessing(false);
        }
      }
      if (configsData) setConfigs(configsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sentient telemetry');
      console.error('Error fetching sentient data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnomalies = fetchSentientData;

  const fetchBaseline = async (memberId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sentientService.getBaseline(memberId);
      setBaseline(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch baseline');
      console.error('Error fetching baseline:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for cognitive processes (keeping for UI demonstration)
  const [cognitiveProcesses, setCognitiveProcesses] = useState<Process[]>([
    {
      id: 'cp-1',
      name: 'Member Behavior Analysis',
      status: 'active',
      progress: 78,
      priority: 'high',
      startTime: '2023-06-15 10:30:00',
      estimatedCompletion: '2023-06-15 16:45:00'
    },
    {
      id: 'cp-2',
      name: 'Content Moderation Scan',
      status: 'active',
      progress: 42,
      priority: 'medium',
      startTime: '2023-06-15 12:15:00',
      estimatedCompletion: '2023-06-15 18:30:00'
    },
    {
      id: 'cp-3',
      name: 'Trend Prediction Model',
      status: 'paused',
      progress: 25,
      priority: 'low',
      startTime: '2023-06-14 09:00:00',
      estimatedCompletion: '2023-06-16 09:00:00'
    },
    {
      id: 'cp-4',
      name: 'Security Threat Assessment',
      status: 'active',
      progress: 95,
      priority: 'high',
      startTime: '2023-06-15 08:45:00',
      estimatedCompletion: '2023-06-15 14:20:00'
    },
    {
      id: 'cp-5',
      name: 'Personalization Engine',
      status: 'active',
      progress: 63,
      priority: 'medium',
      startTime: '2023-06-15 11:20:00',
      estimatedCompletion: '2023-06-15 17:45:00'
    }
  ]);

  // Mock data for insights
  const insights: Insight[] = [
    {
      id: 'ins-1',
      title: 'Increased engagement with music content',
      category: 'content_trends',
      confidence: 92,
      timestamp: '2023-06-15 14:22:33',
      description:
        'Members are 34% more likely to engage with music-related posts during evening hours.'
    },
    {
      id: 'ins-2',
      title: 'Potential security threat identified',
      category: 'security',
      confidence: 87,
      timestamp: '2023-06-15 13:45:12',
      description:
        'Unusual login patterns detected from 5 accounts. Recommend verification.'
    },
    {
      id: 'ins-3',
      title: 'Optimal posting times for creators',
      category: 'member_behavior',
      confidence: 78,
      timestamp: '2023-06-15 12:30:45',
      description:
        'Posts published between 18:00-21:00 receive 42% higher engagement.'
    },
    {
      id: 'ins-4',
      title: 'System performance optimization',
      category: 'system_optimization',
      confidence: 95,
      timestamp: '2023-06-15 11:15:27',
      description:
        'Database queries can be optimized by 23% with suggested indexing changes.'
    }
  ];

  // Mock data for conversations
  const conversations: Conversation[] = [
    {
      id: 'conv-1',
      member: 'Admin Member',
      lastMessage: 'Can you analyze the recent member drop-off rates?',
      timestamp: '2023-06-15 14:30:22',
      unread: 0
    },
    {
      id: 'conv-2',
      member: 'Content Team',
      lastMessage: 'We need recommendations for trending topics next week',
      timestamp: '2023-06-15 13:45:11',
      unread: 2
    },
    {
      id: 'conv-3',
      member: 'Security Team',
      lastMessage: 'Please review the flagged accounts from yesterday',
      timestamp: '2023-06-15 12:20:05',
      unread: 1
    },
    {
      id: 'conv-4',
      member: 'Marketing Team',
      lastMessage:
        'What are the predicted engagement rates for our new campaign?',
      timestamp: '2023-06-15 11:05:33',
      unread: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'paused':
      return 'bg-yellow-500';
    case 'completed':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
    case 'low':
      return 'bg-gray-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'high':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
    case 'member_behavior':
      return 'bg-blue-500/20 text-blue-300';
    case 'content_trends':
      return 'bg-purple-500/20 text-purple-300';
    case 'system_optimization':
      return 'bg-green-500/20 text-green-300';
    case 'security':
      return 'bg-red-500/20 text-red-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
    }
  };

  const toggleProcess = async (processId: string | null) => {
    if (!processId) return;
    const current = cognitiveProcesses.find(p => p.id === processId);
    const nextStatus = current?.status === 'active' ? 'paused' : 'active';
    try {
      await sentientService.toggleKillSwitch(processId, nextStatus === 'paused').catch(() => null);
    } catch (e) {
      console.error('Failed to toggle kill switch for process:', e);
    }
    setCognitiveProcesses((processes) =>
      processes.map((process) =>
        process.id === processId
          ? {
            ...process,
            status: nextStatus
          }
          : process,
      ),
    );
  };

  const toggleAllProcesses = async () => {
    const nextState = !isProcessing;
    setIsProcessing(nextState);
    try {
      await sentientService.toggleKillSwitch(undefined, !nextState).catch(() => null);
    } catch (e) {
      console.error('Failed to toggle global kill switch:', e);
    }
    setCognitiveProcesses((processes) =>
      processes.map((process) => ({
        ...process,
        status: nextState ? 'active' : 'paused'
      })),
    );
  };

  const ProcessCard: React.FC<{ process: Process }> = ({ process }) => (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
        selectedProcess === process.id
          ? 'border-brand-blue bg-blue-500/10'
          : 'border-gray-700 bg-gray-800'
      }`}
      onClick={() =>
        setSelectedProcess(selectedProcess === process.id ? null : process.id)
      } role="button" tabIndex={0}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor(process.status)}`}
            ></div>
            <h3 className="font-bold text-white">{process.name}</h3>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(process.priority)}`}
            >
              {process.priority}
            </span>
            <span className="text-xs text-slate-300 font-medium">{process.startTime}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-white">
            {process.progress}%
          </div>
          <div className="text-xs text-slate-300 font-medium">
            ETA: {process.estimatedCompletion}
          </div>
        </div>
      </div>

      <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-brand-blue h-2 rounded-full"
          style={{ width: `${process.progress}%` }}
        ></div>
      </div>

      <div className="flex justify-end mt-3 gap-2">
        <button
          className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white"
          onClick={(e) => {
            e.stopPropagation();
            toggleProcess(process.id);
          }}
        >
          {process.status === 'active' ? 'Pause' : 'Resume'}
        </button>
        <button
          className="text-xs bg-red-900/30 hover:bg-red-900/50 text-red-300 px-2 py-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            setCognitiveProcesses((processes) =>
              processes.filter((p) => p.id !== process.id),
            );
          }}
        >
          Terminate
        </button>
      </div>
    </div>
  );

  const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => (
    <div className="p-4 rounded-lg border border-gray-700 bg-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white">{insight.title}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(insight.category)}`}
            >
              {insight.category.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-gray-300 mt-2">{insight.description}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-300 font-medium">{insight.timestamp}</div>
          <div
            className="text-xs font-bold mt-1"
            style={{ color: `hsl(${insight.confidence * 1.2}, 100%, 70%)` }}
          >
            {insight.confidence}% confidence
          </div>
        </div>
      </div>
    </div>
  );

  const ConversationCard: React.FC<{ conversation: Conversation }> = ({
    conversation
  }) => (
    <div className="p-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700/50 cursor-pointer">
      <div className="flex justify-between">
        <h3 className="font-bold text-white">{conversation.member}</h3>
        <div className="text-xs text-slate-300 font-medium">{conversation.timestamp}</div>
      </div>
      <p className="text-sm text-gray-300 mt-2 truncate">
        {conversation.lastMessage}
      </p>
      {conversation.unread > 0 && (
        <div className="mt-2 w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center text-xs font-bold text-white">
          {conversation.unread}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Sovereign Platform Ownership Proof */}
      <PlatformOwnershipCard />

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-md">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <CpuChipIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                SENTIENT™©® AI Control Center
              </h1>
              <p className="text-sm text-slate-300 font-medium">
                Cognitive Processing & Insight Generation System
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-800">
          <div className="flex">
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'processes'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('processes')}
            >
              <div className="flex items-center gap-2">
                <QueueListIcon className="w-4 h-4" />
                Cognitive Processes
              </div>
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'insights'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('insights')}
            >
              <div className="flex items-center gap-2">
                <LightBulbIcon className="w-4 h-4" />
                Insights ({insights.length})
              </div>
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'conversations'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('conversations')}
            >
              <div className="flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                AI Conversations
              </div>
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'processes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  Active Cognitive Processes
                </h2>
                <div className="flex gap-2">
                  <button
                    className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded flex items-center gap-2"
                    onClick={toggleAllProcesses}
                  >
                    {isProcessing ? (
                      <>
                        <PauseIcon className="w-4 h-4" />
                        Pause All
                      </>
                    ) : (
                      <>
                        <PlayIcon className="w-4 h-4" />
                        Start All
                      </>
                    )}
                  </button>
                  <button className="text-sm bg-brand-blue hover:bg-blue-700 text-white px-3 py-1 rounded">
                    Start New Process
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {cognitiveProcesses.map((process) => (
                  <ProcessCard key={process.id} process={process} />
                ))}
              </div>

              {selectedProcess && (
                <div className="mt-6 bg-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {
                          cognitiveProcesses.find(
                            (p) => p.id === selectedProcess,
                          )?.name
                        }
                      </h3>
                      <p className="text-slate-300 font-medium mt-1">
                        Detailed process information and controls
                      </p>
                    </div>
                    <button
                      className="text-slate-300 hover:text-white"
                      onClick={() => setSelectedProcess(null)}
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-3">
                        Process Details
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-300 font-semibold">Status</span>
                          <span className="text-white capitalize">
                            {
                              cognitiveProcesses.find(
                                (p) => p.id === selectedProcess,
                              )?.status
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300 font-semibold">Priority</span>
                          <span className="text-white capitalize">
                            {
                              cognitiveProcesses.find(
                                (p) => p.id === selectedProcess,
                              )?.priority
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300 font-semibold">Start Time</span>
                          <span className="text-white">
                            {
                              cognitiveProcesses.find(
                                (p) => p.id === selectedProcess,
                              )?.startTime
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300 font-semibold">
                            Estimated Completion
                          </span>
                          <span className="text-white">
                            {
                              cognitiveProcesses.find(
                                (p) => p.id === selectedProcess,
                              )?.estimatedCompletion
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300 font-semibold">Progress</span>
                          <span className="text-white">
                            {
                              cognitiveProcesses.find(
                                (p) => p.id === selectedProcess,
                              )?.progress
                            }
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-3">
                        Process Controls
                      </h4>
                      <div className="space-y-3">
                        <button
                          className="w-full text-left px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm flex items-center gap-2"
                          onClick={() => toggleProcess(selectedProcess)}
                        >
                          {cognitiveProcesses.find(
                            (p) => p.id === selectedProcess,
                          )?.status === 'active' ? (
                              <>
                                <PauseIcon className="w-4 h-4" />
                              Pause Process
                              </>
                            ) : (
                              <>
                                <PlayIcon className="w-4 h-4" />
                              Resume Process
                              </>
                            )}
                        </button>
                        <button className="w-full text-left px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm flex items-center gap-2">
                          <ChartPieIcon className="w-4 h-4" />
                          Adjust Priority
                        </button>
                        <button className="w-full text-left px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm flex items-center gap-2">
                          <DocumentTextIcon className="w-4 h-4" />
                          View Detailed Logs
                        </button>
                        <button className="w-full text-left px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg text-sm text-red-300 flex items-center gap-2">
                          <StopIcon className="w-4 h-4" />
                          Terminate Process
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'insights' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  Generated Insights & Anomalies
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={fetchAnomalies}
                    disabled={loading}
                    className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    Refresh Data
                  </button>
                  <button className="text-sm bg-brand-blue hover:bg-blue-700 text-white px-3 py-1 rounded">
                    Generate New Insights
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
                  Error: {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-8 text-slate-300 font-medium">
                  Loading anomalies...
                </div>
              ) : (
                <>
                  {/* Real Anomaly Data */}
                  {anomalies.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Behavioral Anomalies ({anomalies.length})
                      </h3>
                      <div className="space-y-4">
                        {anomalies.map((anomaly, index) => (
                          <div key={anomaly.id || index} className="p-4 rounded-lg border border-gray-700 bg-gray-800">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-white">{anomaly.type || 'Anomaly Detected'}</h3>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    anomaly.risk_level === 'critical' ? 'bg-red-500/20 text-red-300' :
                                      anomaly.risk_level === 'high' ? 'bg-orange-500/20 text-orange-300' :
                                        anomaly.risk_level === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                          'bg-green-500/20 text-green-300'
                                  }`}>
                                    {anomaly.risk_level || 'unknown'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-300 mt-2">
                                  {anomaly.description || 'Behavioral anomaly detected'}
                                </p>
                                {anomaly.member_id && (
                                  <p className="text-xs text-slate-300 font-medium mt-1">Member: {anomaly.member_id}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-slate-300 font-medium">
                                  {new Date(anomaly.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mock Insights (keeping for demonstration) */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">AI Insights</h3>
                    <div className="space-y-4">
                      {insights.map((insight) => (
                        <InsightCard key={insight.id} insight={insight} />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'conversations' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  AI Conversations
                </h2>
                <button className="text-sm bg-brand-blue hover:bg-blue-700 text-white px-3 py-1 rounded">
                  New Conversation
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {conversations.map((conversation) => (
                  <ConversationCard
                    key={conversation.id}
                    conversation={conversation}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentientControlPage;
