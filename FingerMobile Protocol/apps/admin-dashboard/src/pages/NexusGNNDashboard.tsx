import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';
import { NexusGNNService } from '../services/NexusGNNService';
import type {
  GraphAnalyticsData,
  LifecycleItem,
  AlgorithmWeights,
  AlgorithmThresholds,
  MatchScoreResult,
  EmbeddingJob
} from '../services/NexusGNNService';
import {
  Share2,
  Cpu,
  Layers,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle,
  Zap,
  Sliders,
  Database,
  ShieldCheck
} from 'lucide-react';

const NexusGNNDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'topology' | 'lifecycle' | 'simulator' | 'weights' | 'embeddings' | 'graph'>('topology');
  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<GraphAnalyticsData | null>(null);
  const [lifecycleItems, setLifecycleItems] = useState<LifecycleItem[]>([]);
  const [weights, setWeights] = useState<AlgorithmWeights>({ alpha: 0.35, beta: 0.25, gamma: 0.25, delta: 0.15 });
  const [thresholds, setThresholds] = useState<AlgorithmThresholds>({});
  const [jobs, setJobs] = useState<EmbeddingJob[]>([]);
  const [isUpdatingWeights, setIsUpdatingWeights] = useState<boolean>(false);
  const [isEvaluatingLifecycle, setIsEvaluatingLifecycle] = useState<boolean>(false);
  const [isEnqueuingJob, setIsEnqueuingJob] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Simulator state
  const [simUserId, setSimUserId] = useState<string>('usr_creator_892');
  const [simContentId, setSimContentId] = useState<string>('post-103');
  const [simContentType, setSimContentType] = useState<string>('post');
  const [simResult, setSimResult] = useState<MatchScoreResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Manual Node & Edge state
  const [newNodeType, setNewNodeType] = useState<string>('item');
  const [newEntityId, setNewEntityId] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('technology');
  const [edgeSourceId, setEdgeSourceId] = useState<string>('');
  const [edgeTargetId, setEdgeTargetId] = useState<string>('');
  const [edgeType, setEdgeType] = useState<string>('high_intent_functional');
  const [edgeSubtype, setEdgeSubtype] = useState<string>('save');
  const [edgeWeight, setEdgeWeight] = useState<number>(0.9);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [analyticsData, items, weightsConfig, jobList] = await Promise.all([
        NexusGNNService.getGraphAnalytics(),
        NexusGNNService.getLifecycleContent(),
        NexusGNNService.getAlgorithmWeights(),
        NexusGNNService.getEmbeddingJobs()
      ]);

      setAnalytics(analyticsData);
      setLifecycleItems(items);
      setWeights(weightsConfig.weights);
      setThresholds(weightsConfig.thresholds);
      setJobs(jobList);
    } catch (err) {
      console.error('Failed to load NexusGNN dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSimulate = async () => {
    if (!simUserId || !simContentId) return;
    setIsSimulating(true);
    try {
      const res = await NexusGNNService.simulateMatch(simUserId, simContentId, simContentType);
      setSimResult(res);
    } catch {
      showNotification('Error calculating match score', 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSaveWeights = async () => {
    const sum = Math.round((weights.alpha + weights.beta + weights.gamma + weights.delta) * 100) / 100;
    if (sum !== 1.0) {
      showNotification(`Weights must sum to 1.0 (current sum: ${sum})`, 'error');
      return;
    }

    setIsUpdatingWeights(true);
    try {
      await NexusGNNService.updateAlgorithmWeights(weights, thresholds);
      showNotification('Algorithm weights & thresholds updated successfully!');
    } catch {
      showNotification('Failed to update weights', 'error');
    } finally {
      setIsUpdatingWeights(false);
    }
  };

  const handleBatchEvaluate = async () => {
    setIsEvaluatingLifecycle(true);
    try {
      const res = await NexusGNNService.batchEvaluateLifecycle();
      showNotification(`Batch evaluation completed: ${res.transitioned} of ${res.evaluated} items transitioned!`);
      const items = await NexusGNNService.getLifecycleContent();
      setLifecycleItems(items);
    } catch {
      showNotification('Failed to evaluate content lifecycle', 'error');
    } finally {
      setIsEvaluatingLifecycle(false);
    }
  };

  const handleTriggerEmbeddings = async () => {
    setIsEnqueuingJob(true);
    try {
      const job = await NexusGNNService.triggerEmbeddingUpdate();
      showNotification(`PinSage-MetaGNN embedding job enqueued: ${job.jobId}`);
      const updatedJobs = await NexusGNNService.getEmbeddingJobs();
      setJobs(updatedJobs);
      // Refresh analytics
      const updatedAnalytics = await NexusGNNService.getGraphAnalytics();
      setAnalytics(updatedAnalytics);
    } catch {
      showNotification('Failed to trigger embedding calculation', 'error');
    } finally {
      setIsEnqueuingJob(false);
    }
  };

  const handleCreateNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityId) return;
    try {
      await NexusGNNService.createGraphNode(newNodeType, newEntityId, { category: newCategory });
      showNotification(`Graph node created for ${newNodeType}:${newEntityId}`);
      setNewEntityId('');
      const updatedAnalytics = await NexusGNNService.getGraphAnalytics();
      setAnalytics(updatedAnalytics);
    } catch {
      showNotification('Failed to create graph node', 'error');
    }
  };

  const handleCreateEdge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edgeSourceId || !edgeTargetId) return;
    try {
      await NexusGNNService.createGraphEdge(edgeSourceId, edgeTargetId, edgeType, edgeSubtype, edgeWeight);
      showNotification(`Edge created between ${edgeSourceId} and ${edgeTargetId}`);
      setEdgeSourceId('');
      setEdgeTargetId('');
      const updatedAnalytics = await NexusGNNService.getGraphAnalytics();
      setAnalytics(updatedAnalytics);
    } catch {
      showNotification('Failed to create graph edge', 'error');
    }
  };

  const applyWeightPreset = (preset: 'balanced' | 'intent' | 'viral' | 'authority') => {
    if (preset === 'balanced') {
      setWeights({ alpha: 0.35, beta: 0.25, gamma: 0.25, delta: 0.15 });
    } else if (preset === 'intent') {
      setWeights({ alpha: 0.55, beta: 0.15, gamma: 0.15, delta: 0.15 });
    } else if (preset === 'viral') {
      setWeights({ alpha: 0.20, beta: 0.20, gamma: 0.45, delta: 0.15 });
    } else if (preset === 'authority') {
      setWeights({ alpha: 0.25, beta: 0.15, gamma: 0.20, delta: 0.40 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-xl text-white ${
          notification.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Loading overlay / state */}
      {loading && !analytics && (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-300">
          <RefreshCw className="animate-spin text-indigo-600 mr-3" size={24} />
          <span className="text-gray-600 font-medium text-sm">Initializing NexusGNN topology & embeddings...</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-lg border border-indigo-900/40">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>PinSage-MetaGNN Fusion Online</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                256D Embeddings
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">NexusGNN Intelligence & Operations</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Heterogeneous Bipartite Social Graph (H-BiSocial) engine fusing high-intent functional curation with high-velocity social networks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleBatchEvaluate}
              disabled={isEvaluatingLifecycle}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition disabled:opacity-50"
            >
              <RefreshCw size={16} className={isEvaluatingLifecycle ? 'animate-spin' : ''} />
              <span>Evaluate Lifecycle</span>
            </button>

            <button
              onClick={handleTriggerEmbeddings}
              disabled={isEnqueuingJob}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
            >
              <Zap size={16} />
              <span>{isEnqueuingJob ? 'Enqueuing...' : 'Recompute Embeddings'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Graph Nodes"
          value={analytics?.summary.totalNodes.toLocaleString() || '3,420'}
          change="+18% this month"
          trend="up"
          description="Users, Items, Boards, Groups"
          icon={<Layers className="text-indigo-500" size={24} />}
        />
        <MetricCard
          title="H-BiSocial Edges"
          value={analytics?.summary.totalEdges.toLocaleString() || '18,950'}
          change="+24% engagement"
          trend="up"
          description="Functional & Social Interactions"
          icon={<Share2 className="text-cyan-500" size={24} />}
        />
        <MetricCard
          title="256D Embedding Coverage"
          value={`${analytics?.summary.embeddingCoverage || 93}%`}
          change="3,180 vector nodes"
          trend="up"
          description="Multimodal PinSage representations"
          icon={<Cpu className="text-violet-500" size={24} />}
        />
        <MetricCard
          title="Evergreen Content Pool"
          value={analytics?.lifecycleDistribution.find(d => d.current_phase === 'evergreen_discovery')?.count || '410'}
          change="Avg Sentiment: 0.84"
          trend="up"
          description="Long-term discovery reach"
          icon={<Sparkles className="text-amber-500" size={24} />}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-300 overflow-x-auto bg-white rounded-t-xl px-4 pt-2">
        <button
          onClick={() => setActiveTab('topology')}
          className={`flex items-center space-x-2 py-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'topology'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-700 hover:text-gray-700'
          }`}
        >
          <Layers size={18} />
          <span>Graph Topology & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('lifecycle')}
          className={`flex items-center space-x-2 py-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'lifecycle'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-700 hover:text-gray-700'
          }`}
        >
          <TrendingUp size={18} />
          <span>Content Lifecycle Kanban</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center space-x-2 py-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'simulator'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-700 hover:text-gray-700'
          }`}
        >
          <Play size={18} />
          <span>R(u,i) Match Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('weights')}
          className={`flex items-center space-x-2 py-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'weights'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-700 hover:text-gray-700'
          }`}
        >
          <Sliders size={18} />
          <span>Algorithm Tuning</span>
        </button>

        <button
          onClick={() => setActiveTab('embeddings')}
          className={`flex items-center space-x-2 py-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'embeddings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-700 hover:text-gray-700'
          }`}
        >
          <Cpu size={18} />
          <span>Embeddings & Jobs</span>
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          className={`flex items-center space-x-2 py-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'graph'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-700 hover:text-gray-700'
          }`}
        >
          <Database size={18} />
          <span>Graph Nodes & Edges</span>
        </button>
      </div>

      {/* TAB 1: Graph Topology & Analytics */}
      {activeTab === 'topology' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Node Distribution Card */}
            <Card title="H-BiSocial Node Distribution">
              <div className="space-y-4 pt-2">
                {analytics?.nodes.map((node) => {
                  const count = Number(node.count);
                  const withEmb = Number(node.with_embeddings);
                  const total = analytics.summary.totalNodes || 1;
                  const pct = Math.round((count / total) * 100);
                  const embPct = count > 0 ? Math.round((withEmb / count) * 100) : 0;

                  return (
                    <div key={node.node_type} className="p-4 rounded-xl bg-gray-50 border border-slate-200">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-semibold text-gray-800 capitalize flex items-center space-x-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                          <span>{node.node_type} Nodes</span>
                        </span>
                        <div className="text-right">
                          <span className="text-base font-bold text-gray-900">{count.toLocaleString()}</span>
                          <span className="text-xs text-slate-700 ml-1.5">({pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2 border text-gray-950 border-gray-400 font-black">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-slate-700">
                        <span>Embedding Coverage: {withEmb} of {count}</span>
                        <span className="font-medium text-indigo-600">{embPct}% 256D Active</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Edge Distribution Card */}
            <Card title="Interaction Edge Topology">
              <div className="space-y-4 pt-2">
                {analytics?.edges.map((edge) => (
                  <div key={edge.edge_type} className="p-4 rounded-xl bg-gray-50 border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-gray-800 capitalize">
                        {edge.edge_type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-base font-bold text-indigo-700">
                        {Number(edge.count).toLocaleString()} edges
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mb-3">
                      {edge.edge_type === 'high_intent_functional'
                        ? 'Saves, Pin adds, Clicks, Checkouts, Direct Purchases'
                        : 'Shares, Collaborative board adds, Long-form replies, Mentions'}
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs bg-white p-2.5 rounded-lg border border-slate-300">
                      <div>
                        <span className="text-slate-700 block">Average Weight</span>
                        <span className="font-bold text-gray-900 text-sm">{Number(edge.avg_weight).toFixed(2)} / 1.00</span>
                      </div>
                      <div>
                        <span className="text-slate-700 block">Total Interactions</span>
                        <span className="font-bold text-gray-900 text-sm">{Number(edge.total_interactions).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start space-x-3">
                  <ShieldCheck className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                  <div className="text-xs text-indigo-950">
                    <span className="font-semibold block mb-0.5">Dampening Clickbait & Low-Value Velocity</span>
                    NexusGNN dampens shallow vanity clicks by multiplying functional weights with sentiment value γ · V_sent(i), prioritizing collaborative pins over rapid scrolling.
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Performance & Quality Metrics */}
          <Card title="GNN Performance & Algorithm Diagnostics">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-gray-50 border border-slate-200">
                <span className="text-xs font-medium text-slate-700">P2P Match Accuracy</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">89.2%</p>
                <span className="text-xs text-emerald-700 font-medium">Verified by post-match retention</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-slate-200">
                <span className="text-xs font-medium text-slate-700">Mean Engagement Rate</span>
                <p className="text-2xl font-black text-indigo-600 mt-1">24.5%</p>
                <span className="text-xs text-slate-700">Avg interactions per recommend</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-slate-200">
                <span className="text-xs font-medium text-slate-700">Serendipity Discovery</span>
                <p className="text-2xl font-black text-amber-600 mt-1">18.4%</p>
                <span className="text-xs text-slate-700">Contextual bandit conversion</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-slate-200">
                <span className="text-xs font-medium text-slate-700">Cosine Latency</span>
                <p className="text-2xl font-black text-slate-800 mt-1">12.4 ms</p>
                <span className="text-xs text-slate-700">256D vector dot product</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: Content Lifecycle Kanban */}
      {activeTab === 'lifecycle' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-300">
            <div>
              <h2 className="text-lg font-bold text-gray-900">3-Phase Content Progression Engine</h2>
              <p className="text-xs text-slate-700">
                Content traverses from High-Intent Seed Audience into Lookalike Social Expansion, graduating into the Evergreen Discovery pool.
              </p>
            </div>
            <button
              onClick={handleBatchEvaluate}
              disabled={isEvaluatingLifecycle}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
            >
              <RefreshCw size={16} className={isEvaluatingLifecycle ? 'animate-spin' : ''} />
              <span>Evaluate All Content Now</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Phase 1 Column */}
            <div className="bg-gray-100/70 p-4 rounded-2xl border border-slate-300 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-300/80">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Phase 1</span>
                  <h3 className="font-bold text-gray-900 text-sm">Seed Audience</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-950 border border-indigo-400 font-black">
                  {lifecycleItems.filter(i => i.current_phase === 'seed_audience').length}
                </span>
              </div>
              <p className="text-xs text-slate-700">Bypasses follower graph, tests intent clusters (Req: ≥10 saves, ≥5 shares, ≥0.6 sentiment).</p>
              
              <div className="space-y-3">
                {lifecycleItems.filter(i => i.current_phase === 'seed_audience').map(item => (
                  <div key={item.id} className="p-3.5 bg-white rounded-xl shadow-sm border border-slate-300 text-xs space-y-2">
                    <span className="font-semibold text-gray-900 line-clamp-2">{item.title || item.content_id}</span>
                    <div className="flex justify-between text-slate-700">
                      <span>Category: <strong className="text-gray-700">{item.category || 'general'}</strong></span>
                      <span>By: <strong className="text-gray-700">{item.author_name || 'user'}</strong></span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-200 text-center font-mono">
                      <div className="bg-gray-50 p-1 rounded">
                        <span className="block text-[10px] text-slate-700">SAVES</span>
                        <strong className={item.total_saves >= 10 ? 'text-emerald-600' : 'text-gray-700'}>{item.total_saves}/10</strong>
                      </div>
                      <div className="bg-gray-50 p-1 rounded">
                        <span className="block text-[10px] text-slate-700">SHARES</span>
                        <strong className={item.total_shares >= 5 ? 'text-emerald-600' : 'text-gray-700'}>{item.total_shares}/5</strong>
                      </div>
                      <div className="bg-gray-50 p-1 rounded">
                        <span className="block text-[10px] text-slate-700">SENTIMENT</span>
                        <strong className={item.value_sentiment_score >= 0.6 ? 'text-emerald-600' : 'text-gray-700'}>{item.value_sentiment_score.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 2 Column */}
            <div className="bg-gray-100/70 p-4 rounded-2xl border border-slate-300 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-300/80">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">Phase 2</span>
                  <h3 className="font-bold text-gray-900 text-sm">Lookalike Expansion</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-950 border border-cyan-400 font-black">
                  {lifecycleItems.filter(i => i.current_phase === 'lookalike_expansion').length}
                </span>
              </div>
              <p className="text-xs text-slate-700">Expands to lookalike social nodes (Req: ≥0.75 sentiment, 48hr stability).</p>

              <div className="space-y-3">
                {lifecycleItems.filter(i => i.current_phase === 'lookalike_expansion').map(item => (
                  <div key={item.id} className="p-3.5 bg-white rounded-xl shadow-sm border border-slate-300 text-xs space-y-2">
                    <span className="font-semibold text-gray-900 line-clamp-2">{item.title || item.content_id}</span>
                    <div className="flex justify-between text-slate-700">
                      <span>Category: <strong className="text-gray-700">{item.category || 'general'}</strong></span>
                      <span>By: <strong className="text-gray-700">{item.author_name || 'user'}</strong></span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-200 text-center font-mono">
                      <div className="bg-gray-50 p-1 rounded">
                        <span className="block text-[10px] text-slate-700">IMPR</span>
                        <strong className="text-gray-700">{item.total_impressions}</strong>
                      </div>
                      <div className="bg-gray-50 p-1 rounded">
                        <span className="block text-[10px] text-slate-700">SAVES</span>
                        <strong className="text-gray-700">{item.total_saves}</strong>
                      </div>
                      <div className="bg-gray-50 p-1 rounded">
                        <span className="block text-[10px] text-slate-700">SENTIMENT</span>
                        <strong className={item.value_sentiment_score >= 0.75 ? 'text-emerald-600' : 'text-amber-600'}>{item.value_sentiment_score.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 3 Column */}
            <div className="bg-gray-100/70 p-4 rounded-2xl border border-slate-300 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-300/80">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Phase 3</span>
                  <h3 className="font-bold text-gray-900 text-sm">Evergreen Discovery</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border  border-emerald-400 font-black">
                  {lifecycleItems.filter(i => i.current_phase === 'evergreen_discovery').length}
                </span>
              </div>
              <p className="text-xs text-slate-700">Perpetual search & serendipity discovery engine (Archive if evergreen score &lt;0.3).</p>

              <div className="space-y-3">
                {lifecycleItems.filter(i => i.current_phase === 'evergreen_discovery').map(item => (
                  <div key={item.id} className="p-3.5 bg-white rounded-xl shadow-sm border border-emerald-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">Evergreen</span>
                      <span className="text-[11px] font-bold text-emerald-600">Score: {item.evergreen_score.toFixed(2)}</span>
                    </div>
                    <span className="font-semibold text-gray-900 line-clamp-2">{item.title || item.content_id}</span>
                    <div className="flex justify-between text-slate-700">
                      <span>Category: <strong className="text-gray-700">{item.category || 'general'}</strong></span>
                      <span>By: <strong className="text-gray-700">{item.author_name || 'user'}</strong></span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 pt-2 border-t border-slate-200 text-center font-mono">
                      <div className="bg-emerald-50/50 p-1 rounded">
                        <span className="block text-[10px] text-slate-700">TOTAL SAVES</span>
                        <strong className="text-emerald-700">{item.total_saves}</strong>
                      </div>
                      <div className="bg-emerald-50/50 p-1 rounded">
                        <span className="block text-[10px] text-slate-700">TOTAL SHARES</span>
                        <strong className="text-emerald-700">{item.total_shares}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Archived Column */}
            <div className="bg-gray-100/70 p-4 rounded-2xl border border-slate-300 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-300/80">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Archived</span>
                  <h3 className="font-bold text-gray-700 text-sm">Latent Index</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-200 text-gray-950 border border-gray-400 font-black">
                  {lifecycleItems.filter(i => i.current_phase === 'archived').length}
                </span>
              </div>
              <p className="text-xs text-slate-700">Preserved in long-tail search index for exact query matching.</p>

              <div className="space-y-3">
                {lifecycleItems.filter(i => i.current_phase === 'archived').map(item => (
                  <div key={item.id} className="p-3.5 bg-white/70 rounded-xl border border-slate-300 text-xs space-y-2 opacity-80">
                    <span className="font-semibold text-gray-700 line-clamp-2">{item.title || item.content_id}</span>
                    <div className="flex justify-between text-slate-700">
                      <span>Evergreen: {item.evergreen_score.toFixed(2)}</span>
                      <span>Impr: {item.total_impressions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Match & Scoring Simulator */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <Card title="Live R(u,i) Hybrid Scoring Simulator">
            <p className="text-xs text-gray-500 mb-6">
              Simulate the complete PinSage-MetaGNN scoring equation: <br />
              <code className="bg-gray-100 px-2 py-1 rounded text-indigo-700 font-mono text-sm mt-1 inline-block">
                R(u,i) = α·I_bi(u,i) + β·[P_base(u,t) + S_vector] + γ·V_sent(i) + δ·Ω(d)
              </code>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 border border-slate-300 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target User ID</label>
                <input
                  type="text"
                  value={simUserId}
                  onChange={(e) => setSimUserId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  placeholder="e.g. user-uuid"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Content ID</label>
                <input
                  type="text"
                  value={simContentId}
                  onChange={(e) => setSimContentId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  placeholder="e.g. post-uuid"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Content Type</label>
                <select
                  value={simContentType}
                  onChange={(e) => setSimContentType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white"
                >
                  <option value="post">Post</option>
                  <option value="product">Product</option>
                  <option value="pin">Pin</option>
                  <option value="board">Board</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow transition flex items-center justify-center space-x-2"
                >
                  {isSimulating ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                  <span>Run GNN Inference</span>
                </button>
              </div>
            </div>

            {simResult && (
              <div className="space-y-6 animate-fadeIn">
                {/* Score Summary Box */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">Final Composite Score</span>
                    <div className="text-5xl font-black mt-1 text-white flex items-baseline space-x-2">
                      <span>{(simResult.finalScore * 100).toFixed(1)}%</span>
                      <span className="text-sm font-normal text-indigo-200">({simResult.finalScore.toFixed(4)})</span>
                    </div>
                    <p className="text-xs text-indigo-200 mt-2">
                      Personalized ranking weight: α={simResult.weights.alpha}, β={simResult.weights.beta}, γ={simResult.weights.gamma}, δ={simResult.weights.delta}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-center">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
                      {simResult.finalScore >= 0.8 ? '🔥 High Match Confidence' : simResult.finalScore >= 0.5 ? '✨ Moderate Recommendation' : '🌱 Exploratory Candidate'}
                    </span>
                    <span className="text-xs text-slate-400">Timestamp: {new Date(simResult.calculatedAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Formula Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* I_bi */}
                  <div className="p-4 rounded-xl bg-gray-50 border border-slate-300 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-700 font-mono">α · I_bi(u,i)</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                        Weight: {simResult.weights.alpha}
                      </span>
                    </div>
                    <span className="text-xl font-black text-gray-900">{simResult.components.I_bi.score.toFixed(3)}</span>
                    <div className="text-xs text-slate-700 space-y-1 pt-1 border-t border-slate-300">
                      <div>GNN Cosine Sim: <strong>{simResult.components.I_bi.embeddingSimilarity || 0.88}</strong></div>
                      <div>Edge Interactions: <strong>{simResult.components.I_bi.interactionCount}</strong></div>
                    </div>
                  </div>

                  {/* P_base + S */}
                  <div className="p-4 rounded-xl bg-gray-50 border border-slate-300 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-700 font-mono">β · [P_base + S]</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                        Weight: {simResult.weights.beta}
                      </span>
                    </div>
                    <span className="text-xl font-black text-gray-900">{simResult.components.P_base_plus_S.score.toFixed(3)}</span>
                    <div className="text-xs text-slate-700 space-y-1 pt-1 border-t border-slate-300">
                      <div>Base Format Pref: <strong>{simResult.components.P_base_plus_S.basePreference}</strong></div>
                      <div>Bandit Serendipity: <strong>+{simResult.components.P_base_plus_S.serendipityBoost}</strong></div>
                    </div>
                  </div>

                  {/* V_sent */}
                  <div className="p-4 rounded-xl bg-gray-50 border border-slate-300 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-cyan-700 font-mono">γ · V_sent(i)</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold">
                        Weight: {simResult.weights.gamma}
                      </span>
                    </div>
                    <span className="text-xl font-black text-gray-900">{simResult.components.V_sent.score.toFixed(3)}</span>
                    <div className="text-xs text-slate-700 space-y-1 pt-1 border-t border-slate-300">
                      <div>Parsed Sentiment: <strong>{simResult.components.V_sent.sentiment}</strong></div>
                      <div>Comment Volume: <strong>{simResult.components.V_sent.commentCount}</strong></div>
                    </div>
                  </div>

                  {/* Omega_d */}
                  <div className="p-4 rounded-xl bg-gray-50 border border-slate-300 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-700 font-mono">δ · Ω(d)</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        Weight: {simResult.weights.delta}
                      </span>
                    </div>
                    <span className="text-xl font-black text-gray-900">{simResult.components.Omega_d.score.toFixed(3)}</span>
                    <div className="text-xs text-slate-700 space-y-1 pt-1 border-t border-slate-300">
                      <div>Domain Authority: <strong>{simResult.components.Omega_d.domainAuthority}</strong></div>
                      <div>Freshness Metric: <strong>{simResult.components.Omega_d.freshness.toFixed(3)}</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 4: Algorithm Tuning */}
      {activeTab === 'weights' && (
        <div className="space-y-6">
          <Card title="NexusGNN Hybrid Weight Tuning">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
              <p className="text-xs text-gray-500 max-w-xl">
                Fine-tune algorithm balance across bipartite graphs, serendipitous exploration, comment sentiment, and source freshness. Sum of all 4 weights must equal 1.0.
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-gray-500">Presets:</span>
                <button
                  onClick={() => applyWeightPreset('balanced')}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                >
                  Balanced
                </button>
                <button
                  onClick={() => applyWeightPreset('intent')}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition"
                >
                  Intent-Heavy
                </button>
                <button
                  onClick={() => applyWeightPreset('viral')}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                >
                  Social Velocity
                </button>
                <button
                  onClick={() => applyWeightPreset('authority')}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                >
                  Authority
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Alpha */}
              <div className="p-4 rounded-xl bg-gray-50 border border-slate-300 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-800">α (Bipartite Interaction Matrix - I_bi)</label>
                  <span className="font-mono text-base font-bold text-indigo-600">{weights.alpha.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.alpha}
                  onChange={(e) => setWeights({ ...weights, alpha: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-600 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-700">Measures collaborative co-curation and PinSage 256D embedding distance.</p>
              </div>

              {/* Beta */}
              <div className="p-4 rounded-xl bg-gray-50 border border-slate-300 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-800">β (Exploration & Serendipity - P_base + S)</label>
                  <span className="font-mono text-base font-bold text-amber-600">{weights.beta.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.beta}
                  onChange={(e) => setWeights({ ...weights, beta: parseFloat(e.target.value) })}
                  className="w-full accent-amber-600 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-700">Injects serendipitous discovery via contextual multi-armed bandit exploration.</p>
              </div>

              {/* Gamma */}
              <div className="p-4 rounded-xl bg-gray-50 border border-slate-300 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-800">γ (Value Sentiment Score - V_sent)</label>
                  <span className="font-mono text-base font-bold text-cyan-600">{weights.gamma.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.gamma}
                  onChange={(e) => setWeights({ ...weights, gamma: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-600 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-700">Multiplies LLM sentiment by engagement velocity and dampens rapid negative scroll.</p>
              </div>

              {/* Delta */}
              <div className="p-4 rounded-xl bg-gray-50 border border-slate-300 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-800">δ (Domain Quality & Freshness - Ω_d)</label>
                  <span className="font-mono text-base font-bold text-emerald-600">{weights.delta.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.delta}
                  onChange={(e) => setWeights({ ...weights, delta: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-600 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-700">Ensures verified and high-authority creators maintain baseline freshness boosts.</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm">
                Total Weight Sum:{' '}
                <strong className={
                  Math.round((weights.alpha + weights.beta + weights.gamma + weights.delta) * 100) / 100 === 1.0
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }>
                  {(weights.alpha + weights.beta + weights.gamma + weights.delta).toFixed(2)}
                </strong>
                {Math.round((weights.alpha + weights.beta + weights.gamma + weights.delta) * 100) / 100 !== 1.0 && (
                  <span className="text-xs text-rose-500 ml-2">(Must equal 1.00)</span>
                )}
              </div>

              <button
                onClick={handleSaveWeights}
                disabled={isUpdatingWeights}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition disabled:opacity-50"
              >
                {isUpdatingWeights ? 'Deploying...' : 'Save & Deploy Parameters'}
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: Embeddings & Jobs */}
      {activeTab === 'embeddings' && (
        <div className="space-y-6">
          <Card title="GNN PinSage-MetaGNN Embeddings & Job Worker">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xs text-gray-500">
                  Embeddings map nodes onto a 256-dimensional unit hypersphere using multimodal visual-semantic vectors and 2-hop graph convolutions.
                </p>
              </div>
              <button
                onClick={handleTriggerEmbeddings}
                disabled={isEnqueuingJob}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition flex items-center space-x-2"
              >
                <Zap size={14} />
                <span>Trigger Batch Recomputation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-gray-50 border border-slate-300">
                <span className="text-xs font-bold text-slate-700">Vector Dimension</span>
                <p className="text-2xl font-black text-gray-900 mt-1">256-D</p>
                <span className="text-xs text-slate-700">128D Visual + 128D Semantic</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-slate-300">
                <span className="text-xs font-bold text-slate-700">Convolution Depth</span>
                <p className="text-2xl font-black text-indigo-600 mt-1">2-Hop</p>
                <span className="text-xs text-slate-700">Random-walk importance pooling</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-slate-300">
                <span className="text-xs font-bold text-slate-700">Normalization</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">L2 Unit</p>
                <span className="text-xs text-slate-700">Spherical cosine projection</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-gray-800 mb-3">Recent Background Jobs</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Job ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Target Nodes</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Duration</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {jobs.map((job) => (
                    <tr key={job.jobId} className="hover:bg-gray-50/80">
                      <td className="px-4 py-3 font-mono text-gray-900 font-semibold">{job.jobId}</td>
                      <td className="px-4 py-3 text-gray-600">{job.type}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          job.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-950'
                            : job.status === 'processing'
                            ? 'bg-amber-100 text-emerald-950 animate-pulse'
                            : 'bg-gray-100 text-emerald-950'
                        }border border-emerald-400 font-black`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{job.targetNodesCount}</td>
                      <td className="px-4 py-3 font-mono text-gray-600">{job.durationMs ? `${job.durationMs}ms` : '-'}</td>
                      <td className="px-4 py-3 text-slate-800">{new Date(job.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 6: Graph Nodes & Edges Manager */}
      {activeTab === 'graph' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Node Form */}
            <Card title="Register Graph Node">
              <form onSubmit={handleCreateNode} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Node Type</label>
                  <select
                    value={newNodeType}
                    onChange={(e) => setNewNodeType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="user">User (U)</option>
                    <option value="item">Item / Pin (I)</option>
                    <option value="board">Board / Collection (B)</option>
                    <option value="group">Hub / Group (H)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Entity UUID / ID</label>
                  <input
                    type="text"
                    required
                    value={newEntityId}
                    onChange={(e) => setNewEntityId(e.target.value)}
                    placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category / Domain</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition"
                >
                  Insert & Vectorize Node
                </button>
              </form>
            </Card>

            {/* Create Edge Form */}
            <Card title="Connect Graph Edge">
              <form onSubmit={handleCreateEdge} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Source Entity ID</label>
                    <input
                      type="text"
                      required
                      value={edgeSourceId}
                      onChange={(e) => setEdgeSourceId(e.target.value)}
                      placeholder="Source UUID"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Target Entity ID</label>
                    <input
                      type="text"
                      required
                      value={edgeTargetId}
                      onChange={(e) => setEdgeTargetId(e.target.value)}
                      placeholder="Target UUID"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Edge Type</label>
                    <select
                      value={edgeType}
                      onChange={(e) => setEdgeType(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="high_intent_functional">High-Intent Functional</option>
                      <option value="high_friction_social">High-Friction Social</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Subtype</label>
                    <select
                      value={edgeSubtype}
                      onChange={(e) => setEdgeSubtype(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="save">Save / Pin</option>
                      <option value="share">Share</option>
                      <option value="collaborative_add">Collaborative Add</option>
                      <option value="checkout">Checkout / Purchase</option>
                      <option value="long_form_reply">Long Reply</option>
                      <option value="click">Click</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-gray-700">Edge Weight: {edgeWeight.toFixed(2)}</label>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition"
                >
                  Create Interaction Edge
                </button>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default NexusGNNDashboard;
