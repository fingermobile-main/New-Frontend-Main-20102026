import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Compass,
  Radio,
  Hash,
  Share2,
  TrendingUp,
  Layers,
  ShieldCheck,
  Archive,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Sliders,
  ExternalLink,
  Eye,
  FileText,
  X,
  Server
} from 'lucide-react';

interface TopicItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  postCount: number;
  resonanceScore: number;
  velocity: number;
  trendAffinityPct: number;
  p2pSwarmNodes: number;
  topTags: string[];
  featuredAuthor: string;
}

interface HashtagItem {
  tag: string;
  postCount: number;
  volume24h: number;
  velocityPct: number;
  isTrendingCandidate: boolean;
  category: string;
  trendContributionPct: number;
}

interface ContentItem {
  id: string;
  title: string;
  body: string;
  excerpt?: string;
  author_name: string;
  author_handle: string;
  author_avatar?: string;
  category: string;
  topic_slug: string;
  tags: string[];
  media_urls?: string[];
  views: number;
  likes_count: number;
  shares_count: number;
  p2pSeeders: number;
  velocityScore: number;
  isSeshatVerified: boolean;
  isPermanenceArchived: boolean;
  permanenceProof?: string | null;
  p2pSwarmId?: string;
  created_at: string;
}

interface ConsoleStats {
  totalTopics: number;
  totalHashtags: number;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalSeeders: number;
  seshatVerifiedCount: number;
  permanenceArchivedCount: number;
  averageVelocity: number;
  averageResonance: number;
  trendsSyndicationQuotaPct: number;
  p2pSwarmStatus: string;
  activeSwarmNodes: number;
  lastSyncTimestamp: string;
}

export const DiscoverMasterConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'hashtags' | 'dispatches' | 'swarm' | 'trends'>('overview');
  const [stats, setStats] = useState<ConsoleStats | null>(null);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [hashtags, setHashtags] = useState<HashtagItem[]>([]);
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Form states for multipart file upload & dispatch
  const [dispatchTitle, setDispatchTitle] = useState('');
  const [dispatchBody, setDispatchBody] = useState('');
  const [dispatchCategory, setDispatchCategory] = useState('P2P Technology');
  const [dispatchTopicSlug, setDispatchTopicSlug] = useState('p2p-mesh-swarms');
  const [dispatchTags, setDispatchTags] = useState('#Discover, #P2PMesh, #SeshatMedia');
  const [dispatchSeshat, setDispatchSeshat] = useState(true);
  const [dispatchPermanence, setDispatchPermanence] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmittingDispatch, setIsSubmittingDispatch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals for CRUD
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicItem | null>(null);
  const [topicName, setTopicName] = useState('');
  const [topicCategory, setTopicCategory] = useState('');
  const [topicDesc, setTopicDesc] = useState('');
  const [topicAuthor, setTopicAuthor] = useState('');

  const [isHashtagModalOpen, setIsHashtagModalOpen] = useState(false);
  const [newHashtagName, setNewHashtagName] = useState('');
  const [newHashtagCategory, setNewHashtagCategory] = useState('General');

  // Load all console data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, topicsRes, hashtagsRes, contentRes] = await Promise.all([
        fetch('http://localhost:5001/api/discover/console/stats').then(r => r.json()),
        fetch('http://localhost:5001/api/discover/topics').then(r => r.json()),
        fetch('http://localhost:5001/api/discover/hashtags').then(r => r.json()),
        fetch('http://localhost:5001/api/discover/content?limit=50').then(r => r.json())
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (topicsRes.success) setTopics(topicsRes.data || []);
      if (hashtagsRes.success) setHashtags(hashtagsRes.data || []);
      if (contentRes.success) setContentList(contentRes.data || []);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Failed to load Discover console data: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showNotification = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // 1. Submit Content Dispatch with Multipart/form-data
  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchTitle.trim() || !dispatchBody.trim()) {
      showNotification('error', 'Title and content body are required for dispatch.');
      return;
    }

    setIsSubmittingDispatch(true);
    try {
      const formData = new FormData();
      formData.append('title', dispatchTitle);
      formData.append('body', dispatchBody);
      formData.append('category', dispatchCategory);
      formData.append('topic_slug', dispatchTopicSlug);
      formData.append('tags', dispatchTags);
      formData.append('isSeshatVerified', String(dispatchSeshat));
      formData.append('isPermanenceArchived', String(dispatchPermanence));

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await fetch('http://localhost:5001/api/discover/content/dispatch', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        showNotification('success', 'Content dispatch successfully published and seeded to P2P swarm!');
        setDispatchTitle('');
        setDispatchBody('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchData();
      } else {
        showNotification('error', data.message || 'Dispatch failed.');
      }
    } catch (err: any) {
      showNotification('error', `Dispatch error: ${err.message}`);
    } finally {
      setIsSubmittingDispatch(false);
    }
  };

  // 2. Delete Content Dispatch
  const handleDeleteContent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this content item from Discover?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/discover/content/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Content item deleted.');
        fetchData();
      } else {
        showNotification('error', data.message || 'Delete failed.');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // 3. Topic CRUD Handlers
  const handleSaveTopic = async () => {
    if (!topicName.trim()) {
      showNotification('error', 'Topic name is required');
      return;
    }

    try {
      if (editingTopic) {
        // Update
        const res = await fetch(`http://localhost:5001/api/discover/topics/${editingTopic.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: topicName,
            category: topicCategory,
            description: topicDesc,
            featuredAuthor: topicAuthor
          })
        });
        const data = await res.json();
        if (data.success) {
          showNotification('success', 'Topic updated successfully.');
          setIsTopicModalOpen(false);
          fetchData();
        }
      } else {
        // Create
        const res = await fetch('http://localhost:5001/api/discover/topics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: topicName,
            category: topicCategory || 'General',
            description: topicDesc || 'Curated topic cluster',
            featuredAuthor: topicAuthor || 'Editorial Board'
          })
        });
        const data = await res.json();
        if (data.success) {
          showNotification('success', 'New topic registered in Topics Engine.');
          setIsTopicModalOpen(false);
          fetchData();
        }
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!window.confirm('Delete this topic category?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/discover/topics/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Topic removed from engine.');
        fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // 4. Hashtag CRUD Handlers
  const handleSaveHashtag = async () => {
    if (!newHashtagName.trim()) return;
    try {
      const res = await fetch('http://localhost:5001/api/discover/hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: newHashtagName, category: newHashtagCategory, trendContributionPct: 32 })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Hashtag registered in Hashtag Engine.');
        setIsHashtagModalOpen(false);
        setNewHashtagName('');
        fetchData();
      } else {
        showNotification('error', data.message || 'Hashtag creation failed.');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleDeleteHashtag = async (tag: string) => {
    if (!window.confirm(`Delete hashtag ${tag}?`)) return;
    try {
      const encoded = encodeURIComponent(tag);
      const res = await fetch(`http://localhost:5001/api/discover/hashtags/${encoded}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `Hashtag ${tag} removed.`);
        fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // 5. P2P Swarm Rebalance
  const handleRebalanceSwarm = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/discover/p2p-swarm/rebalance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boostRatio: 1.25 })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', data.message);
        fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // 6. Trends 30% Syndication Push
  const handleTriggerTrendsPush = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/discover/trends-syndication/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', data.message);
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 space-y-8">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-950 border border-blue-400">
              <Compass className="w-7 h-7 text-blue-900" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Discover MasterDashboard Console
              </h1>
              <p className="text-sm font-semibold text-slate-700">
                Totality Micro-Management: Topics Engine, Hashtag Engine, P2P Swarm & 30% Trends Syndication Feeder
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold hover:bg-slate-100 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 text-slate-700 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Telemetry
          </button>
          <a
            href="/discover"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Globe className="w-4 h-4" />
            View Live /discover
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
              : statusMessage.type === 'error'
              ? 'bg-rose-100 border-rose-400 text-rose-950 font-bold'
              : 'bg-blue-100 border-blue-400 text-blue-950 font-bold'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{statusMessage.text}</span>
          </div>
          <button aria-label="Close" type="button" onClick={() => setStatusMessage(null)} className="text-slate-700 hover:text-slate-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Telemetry Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Topics</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalTopics ?? topics.length}</p>
          <span className="text-[11px] font-bold text-blue-800">Engine Active</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Hashtags</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalHashtags ?? hashtags.length}</p>
          <span className="text-[11px] font-bold text-indigo-800">Tracking 24h</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Dispatches</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalPosts ?? contentList.length}</p>
          <span className="text-[11px] font-bold text-emerald-800">Seeded Stream</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Impressions</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{(stats?.totalViews ?? 0).toLocaleString()}</p>
          <span className="text-[11px] font-bold text-amber-800">Global Views</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">P2P Seeders</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalSeeders ?? 0}</p>
          <span className="text-[11px] font-bold text-cyan-800">WebRTC Swarm</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Trends Quota</p>
          <p className="text-2xl font-black text-blue-900 mt-1">30.0%</p>
          <span className="text-[11px] font-bold text-blue-800">Syndication Feeder</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Seshat Vault</p>
          <p className="text-2xl font-black text-purple-900 mt-1">{stats?.seshatVerifiedCount ?? 0}</p>
          <span className="text-[11px] font-bold text-purple-800">Verified Seals</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Permanence</p>
          <p className="text-2xl font-black text-amber-900 mt-1">{stats?.permanenceArchivedCount ?? 0}</p>
          <span className="text-[11px] font-bold text-amber-800">Merkle Roots</span>
        </div>
      </div>

      {/* Console Tab Selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-300 pb-2">
        {[
          { id: 'overview', label: 'Overview & Telemetry', icon: Server },
          { id: 'topics', label: 'Topics Engine Control', icon: Radio },
          { id: 'hashtags', label: 'Hashtag Engine Control', icon: Hash },
          { id: 'dispatches', label: 'Dispatches & Multipart Upload', icon: Upload },
          { id: 'swarm', label: 'P2P Swarm & Mesh Topology', icon: Share2 },
          { id: 'trends', label: '30% Trends Syndication Feeder', icon: TrendingUp }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-700'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & TELEMETRY */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-300 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-700" />
                Interconnected Discovery Architecture & Micro-Management Flow
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                The Discover ecosystem operates as the authoritative decentralized content routing hub for FingerMobile Protocol.
                It aggregates from all multi-relational database tables, feeds <strong>30% of its velocity signal directly into the Trends Engine</strong>,
                and synchronizes back and forth with <strong>Leadership Boards</strong>, <strong>Seshat Sovereign Media</strong>, and <strong>Permanence Immutable Storage</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">Topics Engine Velocity</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-950 border border-blue-400">
                      {stats?.averageVelocity || 92.2}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats?.averageVelocity || 92}%` }}></div>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">Real-time engagement density across active categories.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">30% Trends Syndication Quota</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                      Active (30.0%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">Strict 30% top-velocity stream dispatched to Trends daily.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">P2P Swarm Topology</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-950 border border-cyan-400">
                      {stats?.activeSwarmNodes || 1420} Nodes
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">Zero-intermediary WebRTC browser-to-browser media seeding.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">Leadership Board Sync</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-950 border border-purple-400">
                      Two-Way Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">Ranks exchange data bidirectionally with Discover viral metrics.</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-slate-800" />
                Master Control Actions
              </h2>

              <div className="space-y-3">
                <button
                  onClick={handleRebalanceSwarm}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 transition-colors text-left"
                >
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Rebalance P2P Swarms</p>
                    <p className="text-xs text-slate-700">Recalculate peer choke limits & DHT routing</p>
                  </div>
                  <Zap className="w-5 h-5 text-amber-600" />
                </button>

                <button
                  onClick={handleTriggerTrendsPush}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 transition-colors text-left"
                >
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Push 30% Trends Syndication</p>
                    <p className="text-xs text-slate-700">Manual flush to Trends broadcast pipeline</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </button>

                <button
                  onClick={() => {
                    setEditingTopic(null);
                    setTopicName('');
                    setTopicCategory('');
                    setTopicDesc('');
                    setTopicAuthor('');
                    setIsTopicModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 transition-colors text-left"
                >
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Register New Topic</p>
                    <p className="text-xs text-slate-700">Add category to Topics Engine</p>
                  </div>
                  <Plus className="w-5 h-5 text-emerald-600" />
                </button>

                <button
                  onClick={() => setIsHashtagModalOpen(true)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 transition-colors text-left"
                >
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Pin / Track Hashtag</p>
                    <p className="text-xs text-slate-700">Add tag to real-time velocity monitor</p>
                  </div>
                  <Hash className="w-5 h-5 text-indigo-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOPICS ENGINE CONTROL */}
      {activeTab === 'topics' && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Topics Engine Registry</h2>
              <p className="text-sm font-semibold text-slate-700">
                Manage all discoverable topic clusters, velocity scores, and trend affinity percentages.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingTopic(null);
                setTopicName('');
                setTopicCategory('');
                setTopicDesc('');
                setTopicAuthor('');
                setIsTopicModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Topic
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Topic Name / Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Velocity</th>
                  <th className="py-3 px-4">Resonance</th>
                  <th className="py-3 px-4">Trend Affinity</th>
                  <th className="py-3 px-4">P2P Swarm Nodes</th>
                  <th className="py-3 px-4">Tags</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-800">
                {topics.map(topic => (
                  <tr key={topic.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{topic.name}</div>
                      <span className="text-xs text-slate-700 font-mono">/{topic.slug}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{topic.category}</td>
                    <td className="py-3.5 px-4 font-bold text-blue-900">{topic.velocity}%</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-900">{topic.resonanceScore}</td>
                    <td className="py-3.5 px-4 font-bold text-indigo-900">{topic.trendAffinityPct}%</td>
                    <td className="py-3.5 px-4 font-semibold text-cyan-950">{topic.p2pSwarmNodes}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(topic.topTags || []).map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-900 border border-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" aria-label="Edit"
                          onClick={() => {
                            setEditingTopic(topic);
                            setTopicName(topic.name);
                            setTopicCategory(topic.category);
                            setTopicDesc(topic.description);
                            setTopicAuthor(topic.featuredAuthor);
                            setIsTopicModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button type="button" aria-label="Delete"
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="p-1.5 rounded-lg border border-slate-300 hover:bg-rose-50 text-rose-700 hover:text-rose-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: HASHTAG ENGINE CONTROL */}
      {activeTab === 'hashtags' && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Hashtag Engine Registry</h2>
              <p className="text-sm font-semibold text-slate-700">
                Live hashtag trending queue, 24-hour volume monitoring, and velocity calculations.
              </p>
            </div>
            <button
              onClick={() => setIsHashtagModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Register Hashtag
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Hashtag</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">24h Volume</th>
                  <th className="py-3 px-4">Velocity %</th>
                  <th className="py-3 px-4">Trend Contribution</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-800">
                {hashtags.map(h => (
                  <tr key={h.tag} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{h.tag}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{h.category}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{h.volume24h.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-900">+{h.velocityPct}%</td>
                    <td className="py-3.5 px-4 font-bold text-blue-900">{h.trendContributionPct}%</td>
                    <td className="py-3.5 px-4">
                      {h.isTrendingCandidate ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-400">
                          Trending Candidate
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button type="button" aria-label="Delete"
                        onClick={() => handleDeleteHashtag(h.tag)}
                        className="p-1.5 rounded-lg border border-slate-300 hover:bg-rose-50 text-rose-700 hover:text-rose-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DISPATCHES & MULTIPART UPLOAD */}
      {activeTab === 'dispatches' && (
        <div className="space-y-8">
          {/* Dispatch Submission Form with multipart/form-data */}
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-700" />
                Publish Sovereign Content Dispatch (multipart/form-data)
              </h2>
              <p className="text-sm font-semibold text-slate-700">
                Upload media, attach cryptographic Seshat verification and Permanence Merkle trees, and seed directly into the P2P swarm.
              </p>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Dispatch Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={dispatchTitle}
                    onChange={e => setDispatchTitle(e.target.value)}
                    placeholder="e.g. Lagos to Paris: High-Fashion Runway Exclusive"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={dispatchCategory}
                    onChange={e => setDispatchCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="P2P Technology">P2P Technology</option>
                    <option value="Seshat & Monetization">Seshat & Monetization</option>
                    <option value="Permanence Protocol">Permanence Protocol</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Audio & Music">Audio & Music</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Content Body & Editorial *
                </label>
                <textarea
                  required
                  rows={4}
                  value={dispatchBody}
                  onChange={e => setDispatchBody(e.target.value)}
                  placeholder="Full editorial or manifest text to persist into PostgreSQL..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Topic Slug *
                  </label>
                  <select
                    value={dispatchTopicSlug}
                    onChange={e => setDispatchTopicSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    {topics.map(t => (
                      <option key={t.id} value={t.slug}>
                        {t.name} ({t.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Hashtags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={dispatchTags}
                    onChange={e => setDispatchTags(e.target.value)}
                    placeholder="#SeshatMedia, #P2PMesh, #Fintech"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              {/* File upload input (multipart) */}
              <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2">
                <Upload className="w-8 h-8 text-slate-600" />
                <p className="text-sm font-bold text-slate-800">
                  {selectedFile ? `Selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)` : 'Upload Media Asset (Image, Video, Audio)'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="text-xs text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
              </div>

              {/* Sovereignty Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dispatchSeshat}
                    onChange={e => setDispatchSeshat(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    Attach Seshat Sovereign Verified Seal
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dispatchPermanence}
                    onChange={e => setDispatchPermanence(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    <Archive className="w-4 h-4 text-amber-700" />
                    Archive Permanence Merkle Tree Root
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingDispatch}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-colors shadow-md flex items-center gap-2"
                >
                  {isSubmittingDispatch ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isSubmittingDispatch ? 'Publishing & Seeding...' : 'Submit & Dispatch to Swarm'}
                </button>
              </div>
            </form>
          </div>

          {/* List of active dispatches */}
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Active Content Dispatches ({contentList.length})</h3>
            <div className="space-y-3">
              {contentList.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-950 border border-blue-400">
                        {item.category}
                      </span>
                      {item.isSeshatVerified && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-950 border border-purple-400">
                          Seshat Verified
                        </span>
                      )}
                      {item.isPermanenceArchived && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-400">
                          Permanence
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base">{item.title}</h4>
                    <p className="text-xs text-slate-700 line-clamp-1">{item.body}</p>
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 pt-1">
                      <span>Author: {item.author_name}</span>
                      <span>Views: {item.views.toLocaleString()}</span>
                      <span>Seeders: {item.p2pSeeders}</span>
                      <span>Velocity: {item.velocityScore}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button type="button" aria-label="Delete"
                      onClick={() => handleDeleteContent(item.id)}
                      className="p-2 rounded-lg border border-slate-300 hover:bg-rose-50 text-rose-700 hover:text-rose-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: P2P SWARM & MESH TOPOLOGY */}
      {activeTab === 'swarm' && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-cyan-700" />
                P2P Swarm & Distributed Mesh Topology
              </h2>
              <p className="text-sm font-semibold text-slate-700">
                Inspect browser WebRTC relays, BitTorrent DHT health, and choke threshold telemetry.
              </p>
            </div>
            <button
              onClick={handleRebalanceSwarm}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-700 text-white font-bold hover:bg-cyan-800 transition-colors shadow-sm"
            >
              <Zap className="w-4 h-4" />
              Rebalance Swarms Now
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-1">
              <span className="text-xs font-bold text-slate-700 uppercase">Distributed DHT State</span>
              <p className="text-xl font-extrabold text-emerald-950">STABLE_OPTIMAL</p>
              <p className="text-xs text-slate-700">1,420 Connected peers globally</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-1">
              <span className="text-xs font-bold text-slate-700 uppercase">Average Seeder Ratio</span>
              <p className="text-xl font-extrabold text-blue-950">8.4 Seeders / Content</p>
              <p className="text-xs text-slate-700">Sub-second WebRTC negotiation</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-1">
              <span className="text-xs font-bold text-slate-700 uppercase">Server Bandwidth Saved</span>
              <p className="text-xl font-extrabold text-purple-950">92.4% Offloaded</p>
              <p className="text-xs text-slate-700">Direct peer relay of high-res assets</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-base font-extrabold text-slate-900">Active Swarms by Topic Slug</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map(t => (
                <div key={t.id} className="p-4 rounded-xl border border-slate-300 bg-white flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">swarm-{t.slug}</h4>
                    <p className="text-xs text-slate-700 font-semibold">{t.name}</p>
                    <span className="text-xs font-mono text-cyan-950 font-bold">{t.p2pSwarmNodes} active peers</span>
                  </div>
                  <button
                    onClick={handleRebalanceSwarm}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-800"
                  >
                    Boost +25%
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: 30% TRENDS SYNDICATION FEEDER */}
      {activeTab === 'trends' && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-700" />
                30% Trends Syndication Quota Feeder
              </h2>
              <p className="text-sm font-semibold text-slate-700">
                Trends derives roughly 30% of its real-time signals from Discover content velocity, hashtag frequency, and topic resonance.
              </p>
            </div>
            <button
              onClick={handleTriggerTrendsPush}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <TrendingUp className="w-4 h-4" />
              Push 30% Quota Now
            </button>
          </div>

          <div className="p-5 rounded-xl bg-blue-50 border border-blue-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-blue-950">Syndication Pipeline Status</span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-950 border border-blue-400">
                30.0% QUOTA LOCKED
              </span>
            </div>
            <p className="text-sm text-slate-800 font-semibold leading-relaxed">
              Every hour, the top 30% highest velocity dispatches and hashtags from this console are automatically packaged into a high-priority message bus delivered to <code>/api/trends</code>.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-slate-900">Top 30% Candidates Eligible for Trends Feed</h3>
            <div className="divide-y divide-slate-200 border border-slate-300 rounded-xl overflow-hidden">
              {contentList
                .slice()
                .sort((a, b) => (b.velocityScore || 0) - (a.velocityScore || 0))
                .slice(0, Math.ceil(contentList.length * 0.3) || 3)
                .map((item, idx) => (
                  <div key={item.id} className="p-4 bg-white hover:bg-slate-50 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-blue-900">#{idx + 1}</span>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">Category: {item.category} • Author: {item.author_name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-950">Velocity {item.velocityScore}</span>
                      <p className="text-xs text-slate-700 font-semibold">Feed weight: 30%</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TOPIC ADD/EDIT */}
      {isTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                {editingTopic ? 'Edit Topic Category' : 'Register New Topic'}
              </h3>
              <button aria-label="Close" type="button" onClick={() => setIsTopicModalOpen(false)} className="text-slate-700 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Topic Name *</label>
                <input
                  type="text"
                  value={topicName}
                  onChange={e => setTopicName(e.target.value)}
                  placeholder="e.g. Pan-African Creative Fintech"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Category *</label>
                <input
                  type="text"
                  value={topicCategory}
                  onChange={e => setTopicCategory(e.target.value)}
                  placeholder="e.g. Fintech & Web3"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={topicDesc}
                  onChange={e => setTopicDesc(e.target.value)}
                  placeholder="Topic focus and mission statement..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Featured Curator</label>
                <input
                  type="text"
                  value={topicAuthor}
                  onChange={e => setTopicAuthor(e.target.value)}
                  placeholder="e.g. Dr. Amina Seshat"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setIsTopicModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTopic}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-extrabold hover:bg-blue-700 shadow-sm"
              >
                Save Topic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HASHTAG ADD */}
      {isHashtagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Register Tracked Hashtag</h3>
              <button aria-label="Close" type="button" onClick={() => setIsHashtagModalOpen(false)} className="text-slate-700 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Hashtag Name *</label>
                <input
                  type="text"
                  value={newHashtagName}
                  onChange={e => setNewHashtagName(e.target.value)}
                  placeholder="#YourHashtag"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Category</label>
                <input
                  type="text"
                  value={newHashtagCategory}
                  onChange={e => setNewHashtagCategory(e.target.value)}
                  placeholder="e.g. Technology"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setIsHashtagModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHashtag}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-extrabold hover:bg-indigo-700 shadow-sm"
              >
                Register Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverMasterConsole;
