import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import userProfileSyncService, { ComprehensiveUserProfile } from '../services/UserProfileSyncService';
import {
  Shield,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Lock,
  Globe,
  BarChart3,
  Sparkles,
  Palette,
  Scissors,
  Mic,
  FileEdit,
  FileImage,
  Sliders,
  RefreshCw,
  Download,
  ChevronRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Brain,
  Bot,
  Briefcase,
  Users,
  DollarSign,
  Building,
  Workflow,
  X,
  Play
} from 'lucide-react';
import dashboardService from '../services/dashboardService';
import { SystemMetric } from '../types/dashboard';
import { guardianSearchIndexer } from '../services/GuardianSearchIndexingService';
import CorporateGovernanceConsole from '../components/dashboard/CorporateGovernanceConsole';
import EnterpriseFinancialEcosystemConsole from '../components/dashboard/EnterpriseFinancialEcosystemConsole';
import StercsControlCenter from '../components/dashboard/StercsControlCenter';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';

interface StercsModule {
  id: string;
  title: string;
  category: 'Security' | 'Creation' | 'Governance' | 'Intelligence';
  icon: React.ComponentType<any>;
  description: string;
  status: 'online' | 'optimal' | 'syncing' | 'maintenance' | 'warning';
  version: string;
  lastUpdated: string;
  responseTime: number;
  healthScore: number;
  route: string;
  trend: number[];
  requests24h: string;
}

interface GovernancePolicy {
  id: string;
  title: string;
  description: string;
  category: 'Content Safety' | 'AI Ethics' | 'Data Privacy' | 'Financial/ERP' | 'Cryptographic';
  status: 'active' | 'review' | 'draft';
  complianceLevel: 'strict' | 'moderate' | 'light';
  lastUpdated: string;
  passedPercent: number;
  route: string;
}

interface ComplianceCheck {
  id: string;
  name: string;
  category: string;
  status: 'passed' | 'warning' | 'failed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastRun: string;
  details: string;
  score: number;
}

interface DepartmentRole {
  id: string;
  department: string;
  title: string;
  head: string;
  clearance: string;
  activeAgents: number;
  status: 'operational' | 'review' | 'escalation';
}

const StercsDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [syncedProfile, setSyncedProfile] = useState<ComprehensiveUserProfile>(() =>
    userProfileSyncService.getProfile()
  );

  useEffect(() => {
    const unsub = userProfileSyncService.subscribe((updated) => {
      setSyncedProfile(updated);
    });
    return unsub;
  }, []);

  const [activeTab, setActiveTab] = useState<'overview' | 'defcon' | 'modules' | 'controls' | 'governance' | 'erp-crm' | 'roles'>('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedCluster, setSelectedCluster] = useState('Global Production [Enclave Alpha]');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);

  // Interactive Modals & Actions State
  const [selectedModuleForDrawer, setSelectedModuleForDrawer] = useState<StercsModule | null>(null);
  const [isAiAgentModalOpen, setIsAiAgentModalOpen] = useState(false);
  const [isErpModalOpen, setIsErpModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [aiTestPrompt, setAiTestPrompt] = useState('Audit user-generated media #FM-9842 for compliance with Sovereign Policy SEC-09.');
  const [aiSimulatedOutput, setAiSimulatedOutput] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Sovereign Action & Emergency Protocol State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFlushingMemory, setIsFlushingMemory] = useState(false);
  const [isQuarantineStandby, setIsQuarantineStandby] = useState(false);
  const [isRotatingKeys, setIsRotatingKeys] = useState(false);
  const [isSyncingLedger, setIsSyncingLedger] = useState(false);
  const [selectedPolicyForModal, setSelectedPolicyForModal] = useState<GovernancePolicy | null>(null);
  const [circuitBreakerTripped, setCircuitBreakerTripped] = useState(false);

  // Dynamic Security Feature Flags (Interactive State)
  const [securityFlags, setSecurityFlags] = useState([
    { id: 'content-flagging', name: 'Autonomous Heuristic Content Flagging', desc: 'Real-time NLP and visual deepfake scan prior to feed dispatch', active: true },
    { id: 'memory-lock', name: 'Camus Hardware Enclave Memory Lock', desc: 'Hardware-level isolated memory paging for execution modules', active: true },
    { id: 'ledger-verifier', name: 'Infinity Coin Ledger Double-Entry Verifier', desc: 'Live block proof cross-matching with database transaction logs', active: true },
    { id: 'minor-shield', name: 'Child Safety & Minor Persona Shield', desc: 'Restrict unverified contacts and blur unrated media automatically', active: true },
    { id: 'ddos-throttle', name: 'DDoS & Rate Limiter Sovereign Throttle', desc: 'Auto-ban IPs exceeding 2,500 socket requests per second', active: true },
    { id: 'zk-deletion', name: 'GDPR / NDPR Zero-Knowledge Deletion', desc: 'Cryptographically wipe revoked personal data within 100ms', active: false },
  ]);

  const handleToggleFlag = (id: string) => {
    setSecurityFlags(prev => prev.map(f => {
      if (f.id === id) {
        const next = !f.active;
        triggerToast(`Security policy "${f.name}" is now ${next ? 'ENFORCED' : 'STANDBY'}.`);
        return { ...f, active: next };
      }
      return f;
    }));
  };

  const handleToggleCircuitBreaker = () => {
    const nextState = !circuitBreakerTripped;
    setCircuitBreakerTripped(nextState);
    triggerToast(nextState
      ? 'CIRCUIT BREAKER TEST ENGAGED: Simulated high-throughput surge trip active.'
      : 'CIRCUIT BREAKER RESET: Normal throughput closed state restored.');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTriggerMemoryFlush = () => {
    setIsFlushingMemory(true);
    setTimeout(() => {
      setIsFlushingMemory(false);
      triggerToast('Enclave memory flushed cleanly across 1,280 hardware enclaves.');
    }, 600);
  };

  const handleTriggerQuarantine = () => {
    setIsQuarantineStandby(!isQuarantineStandby);
    triggerToast(!isQuarantineStandby
      ? 'Quarantine mode standby engaged. Multi-sig cryptographic notification dispatched.'
      : 'Quarantine mode disengaged. Standard public routing restored.');
  };

  const handleTriggerKeyRotation = () => {
    setIsRotatingKeys(true);
    setTimeout(() => {
      setIsRotatingKeys(false);
      triggerToast('Ephemeral hardware enclave keys rotated successfully (RSA/Kyber-1024).');
    }, 700);
  };

  const handleTriggerSyncLedger = () => {
    setIsSyncingLedger(true);
    setTimeout(() => {
      setIsSyncingLedger(false);
      triggerToast('Full ERP/CRM double-entry ledger synchronization completed. Zero delta.');
    }, 800);
  };

  const handleSavePolicy = (updated: GovernancePolicy) => {
    setGovernancePolicies(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelectedPolicyForModal(null);
    triggerToast(`Policy rule ${updated.id} successfully updated and propagated across nodes.`);
  };

  // 12 Specialized STERCS Modules with Canonical Routes
  const stercsModules: StercsModule[] = useMemo(() => [
    {
      id: 'sentient-control',
      title: 'Sentient Control',
      category: 'Intelligence',
      icon: Brain,
      description: 'Autonomous neural watchdog and heuristic cognitive threat isolator',
      status: 'online',
      version: 'v3.2.1-prod',
      lastUpdated: '2 mins ago',
      responseTime: 42,
      healthScore: 99.2,
      route: '/stercs',
      trend: [32, 45, 52, 48, 42, 38, 42],
      requests24h: '4.8M'
    },
    {
      id: 'guardian-ai',
      title: 'Guardian AI Core',
      category: 'Security',
      icon: ShieldCheck,
      description: 'Zero-trust perimeter protection, deepfake mitigation & sybil defense',
      status: 'online',
      version: 'v4.0.8-sovereign',
      lastUpdated: 'Just now',
      responseTime: 36,
      healthScore: 99.8,
      route: '/guardian-protection',
      trend: [40, 38, 35, 39, 36, 34, 36],
      requests24h: '8.2M'
    },
    {
      id: 'stercs-core',
      title: 'STERCS Control Core',
      category: 'Governance',
      icon: Zap,
      description: 'Consensus engine, cryptographic proof verification and ledger authority',
      status: 'online',
      version: 'v2.8.4',
      lastUpdated: '10 mins ago',
      responseTime: 50,
      healthScore: 97.5,
      route: '/guardian-protection',
      trend: [60, 58, 54, 52, 49, 53, 50],
      requests24h: '12.1M'
    },
    {
      id: 'stercs-curation',
      title: 'STERCS Curation Engine',
      category: 'Intelligence',
      icon: Sparkles,
      description: 'Real-time multi-modal quality ranking, toxicity scrub & virality index',
      status: 'online',
      version: 'v2.1.0',
      lastUpdated: '14 mins ago',
      responseTime: 64,
      healthScore: 95.8,
      route: '/trends',
      trend: [72, 68, 65, 70, 66, 62, 64],
      requests24h: '3.4M'
    },
    {
      id: 'stercs-editor',
      title: 'STERCS Site & Code IDE',
      category: 'Creation',
      icon: FileEdit,
      description: 'Full developer web IDE, live layout compilation and GitHub syncer',
      status: 'optimal',
      version: 'v2.4.2',
      lastUpdated: '1 hour ago',
      responseTime: 58,
      healthScore: 96.0,
      route: '/stercseditor',
      trend: [50, 52, 56, 62, 59, 55, 58],
      requests24h: '890k'
    },
    {
      id: 'stercs-media-library',
      title: 'STERCS Media Asset Core',
      category: 'Creation',
      icon: FileImage,
      description: 'Decentralized IPFS/S3 asset registry, deduplication & CDN pipeline',
      status: 'online',
      version: 'v1.9.4',
      lastUpdated: '25 mins ago',
      responseTime: 40,
      healthScore: 98.4,
      route: '/stercsmedialibrary',
      trend: [45, 42, 44, 40, 39, 41, 40],
      requests24h: '18.4M'
    },
    {
      id: 'stercs-theme-designer',
      title: 'STERCS Theme Designer',
      category: 'Creation',
      icon: Palette,
      description: 'System UI tokens, dark/light theme compiler & CSS glassmorphism studio',
      status: 'optimal',
      version: 'v1.6.2',
      lastUpdated: '2 hours ago',
      responseTime: 48,
      healthScore: 97.1,
      route: '/stercsthemedesigner',
      trend: [48, 49, 52, 50, 46, 47, 48],
      requests24h: '420k'
    },
    {
      id: 'stercs-video-editor',
      title: 'STERCS Video Studio',
      category: 'Creation',
      icon: Scissors,
      description: 'GPU-accelerated video transcode, trim, effects & HLS streaming parser',
      status: 'online',
      version: 'v2.2.0',
      lastUpdated: '40 mins ago',
      responseTime: 72,
      healthScore: 94.2,
      route: '/videos',
      trend: [80, 75, 78, 74, 76, 70, 72],
      requests24h: '1.2M'
    },
    {
      id: 'stercs-audio-editor',
      title: 'STERCS Audio & Voice Core',
      category: 'Creation',
      icon: Mic,
      description: 'Audio waveforms, BeatwaveNG master compression & stem separation',
      status: 'syncing',
      version: 'v1.3.1',
      lastUpdated: '15 mins ago',
      responseTime: 84,
      healthScore: 91.5,
      route: '/beatwaveng',
      trend: [92, 88, 90, 86, 85, 82, 84],
      requests24h: '780k'
    },
    {
      id: 'stercs-translation',
      title: 'Multilingual AI Translator',
      category: 'Intelligence',
      icon: Globe,
      description: 'Low-latency neural translation across 48 sovereign dialects',
      status: 'online',
      version: 'v3.1.5',
      lastUpdated: '5 mins ago',
      responseTime: 55,
      healthScore: 96.7,
      route: '/forum',
      trend: [58, 62, 59, 57, 54, 53, 55],
      requests24h: '5.1M'
    },
    {
      id: 'stercs-security',
      title: 'Enterprise Security Mesh',
      category: 'Security',
      icon: Lock,
      description: 'HSM key isolation, biometric token validation and access firewall',
      status: 'online',
      version: 'v4.1.2',
      lastUpdated: 'Just now',
      responseTime: 32,
      healthScore: 99.9,
      route: '/guardian-protection',
      trend: [34, 35, 33, 31, 30, 32, 32],
      requests24h: '24.9M'
    },
    {
      id: 'stercs-analytics',
      title: 'Deep Telemetry Analytics',
      category: 'Governance',
      icon: BarChart3,
      description: 'Real-time telemetry, retention funnel modeling & clickstream logs',
      status: 'online',
      version: 'v3.5.0',
      lastUpdated: '12 mins ago',
      responseTime: 46,
      healthScore: 98.0,
      route: '/analytics',
      trend: [48, 50, 46, 44, 47, 45, 46],
      requests24h: '16.7M'
    }
  ], []);

  // Stateful Governance Policies
  const [governancePolicies, setGovernancePolicies] = useState<GovernancePolicy[]>([
    {
      id: 'POL-01',
      title: 'Autonomous Content Moderation Standard',
      description: 'Zero-tolerance filter for harassment, hate speech, and illicit content generation.',
      category: 'Content Safety',
      status: 'active',
      complianceLevel: 'strict',
      lastUpdated: '2026-10-09',
      passedPercent: 99.4,
      route: '/stercs'
    },
    {
      id: 'POL-02',
      title: 'AI Decision Explainability & Auditability',
      description: 'Mandates full step-by-step heuristic reasoning logging for autonomous enforcement actions.',
      category: 'AI Ethics',
      status: 'active',
      complianceLevel: 'strict',
      lastUpdated: '2026-10-08',
      passedPercent: 98.7,
      route: '/stercs'
    },
    {
      id: 'POL-03',
      title: 'GDPR / NDPR Sovereign Data Residency',
      description: 'Strict geographical cryptographic anchoring of member personally identifiable data.',
      category: 'Data Privacy',
      status: 'active',
      complianceLevel: 'strict',
      lastUpdated: '2026-10-07',
      passedPercent: 100.0,
      route: '/stercs'
    },
    {
      id: 'POL-04',
      title: 'ERP Financial Settlement & Reconciliation',
      description: 'Automated double-entry reconciliation between Infinity Coin ledgers and fiat gateways.',
      category: 'Financial/ERP',
      status: 'active',
      complianceLevel: 'strict',
      lastUpdated: '2026-10-09',
      passedPercent: 99.8,
      route: '/stercs'
    },
    {
      id: 'POL-05',
      title: 'Zero-Trust Enclave Isolation (Camus Defense)',
      description: 'Micro-segmented execution environments for third-party plug-ins and marketplace scripts.',
      category: 'Cryptographic',
      status: 'active',
      complianceLevel: 'strict',
      lastUpdated: '2026-10-09',
      passedPercent: 99.9,
      route: '/stercs'
    }
  ]);

  // Compliance Checks
  const complianceChecks: ComplianceCheck[] = useMemo(() => [
    {
      id: 'CHK-101',
      name: 'Cryptographic Enclave Attestation',
      category: 'Zero-Trust Architecture',
      status: 'passed',
      severity: 'critical',
      lastRun: '12 mins ago',
      details: 'All 1,280 hardware security enclave signatures validated cleanly.',
      score: 100
    },
    {
      id: 'CHK-102',
      name: 'Autonomous AI Bias Variance Scan',
      category: 'AI Governance',
      status: 'passed',
      severity: 'high',
      lastRun: '35 mins ago',
      details: 'Parity score of 0.994 achieved across all age, demographic and linguistic cohorts.',
      score: 99.4
    },
    {
      id: 'CHK-103',
      name: 'ERP Double-Entry Ledger Reconciliation',
      category: 'Fiscal Integrity',
      status: 'passed',
      severity: 'critical',
      lastRun: '50 mins ago',
      details: 'Zero discrepancy found between fiat merchant settlements and Infinity Coin reserves.',
      score: 100
    },
    {
      id: 'CHK-104',
      name: 'WCAG 2.2 AA Accessibility & Screen Reader Audit',
      category: 'UX Inclusivity',
      status: 'warning',
      severity: 'medium',
      lastRun: '2 hours ago',
      details: '3 contrast warnings detected on custom neon community theme variants.',
      score: 94.2
    },
    {
      id: 'CHK-105',
      name: 'Camus Intrusion Probe & Penetration Simulation',
      category: 'Sovereign Security',
      status: 'passed',
      severity: 'critical',
      lastRun: '1 hour ago',
      details: 'Zero buffer overflows or memory leakage detected under 100k simulated hostile probes.',
      score: 100
    }
  ], []);

  // 19 Departmental Executive Roles Matrix (from specs)
  const departmentalRoles: DepartmentRole[] = useMemo(() => [
    { id: 'ROL-01', department: 'Corporate Secretarial', title: 'Group Company Secretary', head: 'Dr. A. E. Okoye', clearance: 'L5-Executive', activeAgents: 12, status: 'operational' },
    { id: 'ROL-02', department: 'Risk & Legal Affairs', title: 'Group Head, Risk, Credit & Legal', head: 'Barr. M. C. Danjuma', clearance: 'L5-Executive', activeAgents: 18, status: 'operational' },
    { id: 'ROL-03', department: 'Treasury & Fiscal Policy', title: 'Group Chief Finance Officer & Fiscal Policy', head: 'Chief E. V. Adeleke', clearance: 'L5-Executive', activeAgents: 24, status: 'operational' },
    { id: 'ROL-04', department: 'Consumer Products', title: 'Group Head, Consumer Products & Storefronts', head: 'K. O. Mensah', clearance: 'L4-Operational', activeAgents: 14, status: 'operational' },
    { id: 'ROL-05', department: 'Audit & Internal Affairs', title: 'Group Chief, Audit & Internal Affairs', head: 'S. N. Al-Mansoor', clearance: 'L5-Executive', activeAgents: 9, status: 'operational' },
    { id: 'ROL-06', department: 'Policy Compliance', title: 'Group Chief, Policy Compliance Officer', head: 'Elena Rostova', clearance: 'L5-Executive', activeAgents: 22, status: 'operational' },
    { id: 'ROL-07', department: 'Strategic Business', title: 'Group Head, Strategic Business Group', head: 'Marcus Thorne', clearance: 'L4-Operational', activeAgents: 15, status: 'operational' },
    { id: 'ROL-08', department: 'Franchise Services', title: 'Group Head, Franchise Business Services', head: 'Tariq Al-Fassi', clearance: 'L4-Operational', activeAgents: 11, status: 'operational' },
    { id: 'ROL-09', department: 'Corporate Comms & PR', title: 'Group Head, Corporate Communications & Marketing', head: 'Amara Nwosu', clearance: 'L4-Operational', activeAgents: 30, status: 'operational' },
    { id: 'ROL-10', department: 'Media Channels', title: 'Group Head, Media & Sales Channels (Dancia-4Tv / BeatwaveNG)', head: 'Devon Vance', clearance: 'L4-Operational', activeAgents: 28, status: 'operational' },
    { id: 'ROL-11', department: 'Information Tech', title: 'Group Head, Information Technology & Enclave Ops', head: 'Kenji Takahashi', clearance: 'L5-Executive', activeAgents: 45, status: 'operational' },
    { id: 'ROL-12', department: 'Operations & Planning', title: 'Group Head, Operations, Budget, Products & Planning', head: 'Claire Dupont', clearance: 'L4-Operational', activeAgents: 19, status: 'operational' },
    { id: 'ROL-13', department: 'International Treasury', title: 'Executive Director, International Treasury', head: 'Hon. O. B. Mbah', clearance: 'L5-Board', activeAgents: 16, status: 'operational' },
    { id: 'ROL-14', department: 'Finance & Risk', title: 'Executive Director, Finance & Risk Management', head: 'A. I. Bello', clearance: 'L5-Board', activeAgents: 21, status: 'operational' },
    { id: 'ROL-15', department: 'Protocol & IP Resources', title: 'Executive Director, Protocol, Logistics & IP Resources', head: 'IP Office Overseer', clearance: 'L5-Board', activeAgents: 35, status: 'operational' },
    { id: 'ROL-16', department: 'Human Resources', title: 'Executive Director, Human Resources & Compliance', head: 'Fatima Zahra', clearance: 'L5-Board', activeAgents: 14, status: 'operational' },
    { id: 'ROL-17', department: 'Procurement', title: 'Executive Director, Supply Chain & Procurement', head: 'Kwame Asante', clearance: 'L5-Board', activeAgents: 13, status: 'operational' },
    { id: 'ROL-18', department: 'Blockchain Core', title: 'Executive Director, Blockchain & Infinity Coin', head: 'Dr. Satoshi Sterling', clearance: 'L5-Board', activeAgents: 52, status: 'operational' },
    { id: 'ROL-19', department: 'Internal Affairs', title: 'Inspector General, Internal Affairs & Protocol Ethics', head: 'Special Envoy Group', clearance: 'L5-Board', activeAgents: 8, status: 'operational' },
  ], []);

  // Filtered modules based on Guardian Search B-Tree indexing
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return stercsModules;
    // Execute sub-millisecond query on Guardian Search Indexer
    const benchmark = guardianSearchIndexer.query(searchQuery, 'stercs');
    const matchedTitles = new Set(benchmark.results.map(r => r.title.toLowerCase()));
    const q = searchQuery.toLowerCase();
    return stercsModules.filter(m =>
      matchedTitles.has(m.title.toLowerCase()) ||
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  }, [stercsModules, searchQuery]);

  const getModuleCategoryColor = (category: string) => {
    switch (category) {
    case 'Security':
      return 'bg-rose-100 text-rose-950 border border-rose-300 font-bold';
    case 'Creation':
      return 'bg-purple-100 text-purple-950 border border-purple-300 font-bold';
    case 'Intelligence':
      return 'bg-blue-100 text-blue-950 border border-blue-300 font-bold';
    default:
      return 'bg-amber-100 text-amber-950 border border-amber-300 font-bold';
    }
  };

  const getModuleStatusBadge = (status: string) => {
    switch (status) {
    case 'online':
      return 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-black';
    case 'optimal':
      return 'bg-blue-100 text-blue-950 border border-blue-400 font-black';
    case 'syncing':
      return 'bg-amber-100 text-amber-950 border border-amber-400 font-black';
    default:
      return 'bg-slate-100 text-slate-900 border border-slate-300 font-black';
    }
  };

  const getModuleStatusDot = (status: string) => {
    switch (status) {
    case 'online':
      return 'bg-emerald-600';
    case 'optimal':
      return 'bg-blue-600';
    case 'syncing':
      return 'bg-amber-600';
    default:
      return 'bg-slate-500';
    }
  };

  const getCheckSeverityBadge = (severity: string) => {
    if (severity === 'critical') return 'bg-rose-100 text-rose-950 border border-rose-400 font-black';
    if (severity === 'high') return 'bg-amber-100 text-amber-950 border border-amber-400 font-black';
    return 'bg-blue-100 text-blue-950 border border-blue-400 font-black';
  };

  const getClearanceBadge = (clearance: string) => {
    if (clearance.includes('Board')) return 'bg-purple-100 text-purple-950 border border-purple-400 font-black';
    if (clearance.includes('Executive')) return 'bg-blue-100 text-blue-950 border border-blue-400 font-black';
    return 'bg-slate-100 text-slate-900 border border-slate-300 font-black';
  };

  // Load telemetry metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getAdminDashboardData(timeRange);
        setMetrics(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [timeRange]);

  // AI Prompt simulation
  const handleExecuteAiTest = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setAiSimulatedOutput(
        '[STERCS AI ENGINE v4.2 • EXECUTION REPORT]\n\n' +
        '• Target Subject: User-generated Media #FM-9842\n' +
        '• Policy Reference: Sovereign Policy SEC-09 (Child Protection & Content Integrity)\n' +
        '• Multimodal Heuristics Scan: Passed (0.000% Toxicity, 0.000% Illicit Signatures)\n' +
        '• Perceptual Hash Alignment: Verified against Sovereign Clean DB\n' +
        '• Automated Action: Approved for Global CDN Edge Distribution with Fast-Route Token #AGY-8841.\n' +
        '• Confidence Rating: 99.98% • Latency: 24ms'
      );
      setIsGeneratingAi(false);
    }, 900);
  };

  const handleCopySummary = () => {
    const summaryText = 'STERCS Sovereign Intelligence Summary: Cluster Enclave Alpha operates at 97.4% Health Index with 1,280 validated hardware enclaves and 0 security breaches across 14.8k hourly automated ERP/CRM workflows.';
    navigator.clipboard?.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* 1. SEMrush Standard Breadcrumb & Project Control Bar */}
      <div className="bg-white border-b border-slate-300 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 py-3">
            {/* Left: Breadcrumbs & Cluster Switcher */}
            <div className="flex items-center space-x-3 text-sm">
              <span className="font-bold text-blue-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                STERCS™ Platform
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-800 font-bold">Sovereign Control Core</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <div className="relative inline-block">
                <select
                  value={selectedCluster}
                  onChange={(e) => setSelectedCluster(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-900 font-bold text-xs rounded-md pl-2.5 pr-8 py-1.5 hover:bg-white transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  <option>Global Production [Enclave Alpha]</option>
                  <option>Regional Failover [US-East Sovereign]</option>
                  <option>EU-Frankfurt Sovereign Vault</option>
                  <option>Sandbox Staging Enclave</option>
                </select>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 font-black">
                <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-600 animate-spin' : 'bg-emerald-600 animate-pulse'}`} />
                {loading ? 'Syncing Telemetry...' : `Live Enclave Sync (${metrics.length || 12} Nodes)`}
              </span>
            </div>

            {/* Right: Date Picker & Global Action Suite */}
            <div className="flex items-center flex-wrap gap-2">
              {/* Date Filter Pills */}
              <div className="inline-flex rounded-md border border-slate-300 bg-slate-100 p-0.5 text-xs font-bold">
                {(['24h', '7d', '30d', '90d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded transition-colors ${
                      timeRange === range
                        ? 'bg-white text-blue-700 font-black shadow-xs border border-slate-300'
                        : 'text-slate-700 hover:text-slate-900 font-bold'
                    }`}
                  >
                    {range === '24h' ? 'Today' : `Last ${range}`}
                  </button>
                ))}
              </div>

              {/* Universal AI Search Trigger */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-universal-search'))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:text-blue-700 transition-colors shadow-2xs"
                title="Universal AI Search (Cmd+K)"
              >
                <Search className="w-3.5 h-3.5 text-cyan-700" />
                <span>Universal Search</span>
                <kbd className="px-1 py-0.2 text-[9px] font-mono bg-slate-100 border border-slate-300 rounded text-slate-800 font-bold">⌘K</kbd>
              </button>

              {/* Master Dashboard Link */}
              <button
                onClick={() => navigate('/master-dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:text-blue-700 transition-colors shadow-2xs"
              >
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                Master Dashboard
              </button>

              {/* Agentic AI Trigger */}
              <button
                onClick={() => setIsAiAgentModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-950 bg-purple-100 border border-purple-300 rounded-md hover:bg-purple-200 transition-colors shadow-2xs"
              >
                <Bot className="w-3.5 h-3.5 text-purple-700" />
                Agentic AI Engine
              </button>

              {/* ERP / CRM Bridge */}
              <button
                onClick={() => setIsErpModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-100 border border-emerald-400 rounded-md hover:bg-emerald-200 transition-colors shadow-2xs"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                ERP & CRM Suite
              </button>

              {/* Export to PDF */}
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                Export Audit PDF
              </button>

              {/* Sovereign Profile Quick Badge */}
              <div
                onClick={() => navigate('/settings')}
                className="inline-flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                title={`${syncedProfile.name} (@${syncedProfile.username}) • PIN Quota: ${syncedProfile.pinQuotaRemaining}/50 • Click to edit in Settings`}
              >
                <img
                  src={syncedProfile.avatar}
                  alt={syncedProfile.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-blue-600"
                />
                <span className="text-xs font-black text-slate-900 hidden sm:inline">{syncedProfile.name}</span>
                <span className="text-[10px] font-mono text-emerald-950 font-black bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-400">
                  PIN: ••{syncedProfile.pinNumber.slice(-2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PlatformOwnershipCard />

        {/* 2. Top SEMrush Hero Domain Analytics / Authority KPI Bar (5 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: STERCS Trust Index */}
          <div className="bg-white rounded-lg p-5 border border-slate-300 shadow-2xs relative overflow-hidden group hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-700 mb-2">
              <span className="font-bold uppercase tracking-wider text-slate-700 text-xs">STERCS Trust Index</span>
              <span className="inline-flex items-center text-emerald-950 font-bold bg-emerald-100 border border-emerald-400 px-1.5 py-0.5 rounded text-[11px]">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +1.8%
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">97.4</span>
              <span className="text-sm font-bold text-slate-600">/ 100</span>
            </div>
            {/* SVG Semicircle Micro-gauge */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2 border text-slate-950 border-slate-400 font-black">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full" style={{ width: '97.4%' }} />
            </div>
            <p className="text-xs text-slate-700 font-medium flex items-center justify-between">
              <span>Sovereign Enclave Status</span>
              <span className="font-bold text-emerald-800">Hardware Attested</span>
            </p>
          </div>

          {/* Card 2: Consensus Proof Velocity */}
          <div className="bg-white rounded-lg p-5 border border-slate-300 shadow-2xs relative overflow-hidden group hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-700 mb-2">
              <span className="font-bold uppercase tracking-wider text-slate-700 text-xs">Proof Velocity</span>
              <span className="inline-flex items-center text-emerald-950 font-bold bg-emerald-100 border border-emerald-400 px-1.5 py-0.5 rounded text-[11px]">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12.4%
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">48.6k</span>
              <span className="text-xs font-bold text-slate-700">proofs/s</span>
            </div>
            {/* Mini SVG Area Sparkline */}
            <div className="h-6 w-full">
              <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradVelocity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,18 Q20,15 35,12 T70,8 T100,4 L100,24 L0,24 Z" fill="url(#gradVelocity)" />
                <path d="M0,18 Q20,15 35,12 T70,8 T100,4" fill="none" stroke="#059669" strokeWidth="2" />
              </svg>
            </div>
            <p className="text-xs text-slate-700 font-medium flex items-center justify-between mt-1">
              <span>Sub-second Finality</span>
              <span className="font-bold text-slate-900">18.4 ms avg</span>
            </p>
          </div>

          {/* Card 3: Active Sovereign Enclaves */}
          <div className="bg-white rounded-lg p-5 border border-slate-300 shadow-2xs relative overflow-hidden group hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-700 mb-2">
              <span className="font-bold uppercase tracking-wider text-slate-700 text-xs">Enclave Nodes</span>
              <span className="text-xs text-emerald-800 font-black">99.69%</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">1,280</span>
              <span className="text-xs font-bold text-slate-600">/ 1,284 total</span>
            </div>
            {/* Mini SVG Area Sparkline */}
            <div className="h-6 w-full">
              <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradNodes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,12 Q25,8 50,10 T80,6 T100,4 L100,24 L0,24 Z" fill="url(#gradNodes)" />
                <path d="M0,12 Q25,8 50,10 T80,6 T100,4" fill="none" stroke="#2563EB" strokeWidth="2" />
              </svg>
            </div>
            <p className="text-xs text-slate-700 font-medium flex items-center justify-between mt-1">
              <span>Camus Isolation</span>
              <span className="font-bold text-emerald-800">0 Leaks</span>
            </p>
          </div>

          {/* Card 4: Threat Neutralization Ratio */}
          <div className="bg-white rounded-lg p-5 border border-slate-300 shadow-2xs relative overflow-hidden group hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-700 mb-2">
              <span className="font-bold uppercase tracking-wider text-slate-700 text-xs">Threat Mitigation</span>
              <span className="inline-flex items-center text-emerald-950 font-bold bg-emerald-100 border border-emerald-400 px-1.5 py-0.5 rounded text-[11px]">
                Active
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">99.98%</span>
            </div>
            {/* Multi-segment mini bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex mb-2 border text-slate-950 border-slate-400 font-black">
              <div className="bg-emerald-600 h-full" style={{ width: '99.98%' }} />
              <div className="bg-rose-600 h-full" style={{ width: '0.02%' }} />
            </div>
            <p className="text-xs text-slate-700 font-medium flex items-center justify-between">
              <span>Deflected Threats (24h)</span>
              <span className="font-bold text-slate-900">4,129 blocked</span>
            </p>
          </div>

          {/* Card 5: Autonomous ERP & CRM Workflows */}
          <div className="bg-white rounded-lg p-5 border border-slate-300 shadow-2xs relative overflow-hidden group hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-700 mb-2">
              <span className="font-bold uppercase tracking-wider text-slate-700 text-xs">ERP / CRM Tasks</span>
              <span className="inline-flex items-center text-emerald-950 font-bold bg-emerald-100 border border-emerald-400 px-1.5 py-0.5 rounded text-[11px]">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +8.5%
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">14.8k</span>
              <span className="text-xs font-bold text-slate-700">runs/hour</span>
            </div>
            {/* Mini SVG Area Sparkline */}
            <div className="h-6 w-full">
              <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradErp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,16 Q30,18 55,10 T85,6 T100,2 L100,24 L0,24 Z" fill="url(#gradErp)" />
                <path d="M0,16 Q30,18 55,10 T85,6 T100,2" fill="none" stroke="#7C3AED" strokeWidth="2" />
              </svg>
            </div>
            <p className="text-xs text-slate-700 font-medium flex items-center justify-between mt-1">
              <span>Auto-Reconciled</span>
              <span className="font-bold text-purple-900">100.0% accuracy</span>
            </p>
          </div>
        </div>

        {/* 3. Executive AI Summary Card ("Summary beta" SEMrush Standard) */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden border border-blue-800">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-500/20 rounded-lg border border-blue-400/30 text-blue-300 shrink-0">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-white tracking-tight">STERCS Sovereign Intelligence Summary</h3>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-blue-500 text-white rounded">
                    Beta
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                    ENCLAVE SECURE • ZERO ZERO-DAY EXPOSURE
                  </span>
                </div>
                <p className="text-sm text-blue-100/90 leading-relaxed max-w-4xl">
                  Cluster Enclave Alpha reports an aggregate <strong>97.4% Health Index</strong> across all 12 operational modules.
                  Camus micro-segmentation successfully contained 4,129 malicious probes with zero leakage. All 19 departmental leadership
                  oversight protocols are live, with double-entry ERP reconciliation recording $0 variance across Infinity Coin ledgers.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <button
                    onClick={() => setIsAiAgentModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded transition-colors shadow-xs"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    Open Autonomous Agent Console
                  </button>
                  <button
                    onClick={() => setIsRolesModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-blue-100 text-xs font-medium rounded transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    View 19 Departmental Leadership Matrix
                  </button>
                  <button
                    onClick={handleCopySummary}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-blue-100 text-xs font-medium rounded transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {copiedSummary ? 'Copied to Clipboard!' : 'Copy Executive Report'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
              <span className="text-xs text-blue-300">Epoch Timestamp</span>
              <span className="text-sm font-mono font-semibold text-white">2026-10-09 13:01 UTC</span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Next Epoch in 04:58
              </span>
            </div>
          </div>
        </div>

        {/* 4. Tab Navigation Strip */}
        <div className="border-b border-slate-300">
          <nav className="flex space-x-8 -mb-px">
            {[
              { id: 'overview', label: 'Enclave Overview', icon: Activity },
              { id: 'defcon', label: 'DEFCON Command & Geo-Fencing', icon: Shield },
              { id: 'modules', label: 'Module Consoles (12)', icon: Layers },
              { id: 'controls', label: 'Feature Flags & Security', icon: Sliders },
              { id: 'governance', label: 'Governance & Audits', icon: ShieldCheck },
              { id: 'erp-crm', label: 'ERP & CRM Suite', icon: Briefcase },
              { id: 'roles', label: '19 Executive Roles Matrix', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-1 border-b-2 font-bold text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-700 font-black'
                    : 'border-transparent text-slate-700 hover:text-slate-900 hover:border-slate-400'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-600'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Visual Analytics Grid: SEMrush Semicircle Dial, Stacked Toxicity Bar, and Policy Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Box 1: Semicircle Site Health & Enclave Integrity Dial */}
              <div className="bg-white rounded-lg p-5 border border-slate-300 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">Sovereign Enclave Health</h3>
                  <span className="text-xs text-blue-700 font-bold hover:underline cursor-pointer">
                    Inspect 1,280 Nodes
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center py-2">
                  {/* SVG Semicircle Dial */}
                  <div className="relative w-48 h-26 flex items-center justify-center">
                    <svg className="w-48 h-24" viewBox="0 0 200 100">
                      <path
                        d="M 20 90 A 80 80 0 0 1 180 90"
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="20"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 20 90 A 80 80 0 0 1 180 90"
                        fill="none"
                        stroke="url(#dialGradient)"
                        strokeWidth="20"
                        strokeDasharray="251.2"
                        strokeDashoffset="6.5"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="dialGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute bottom-0 text-center">
                      <span className="text-3xl font-black text-slate-900">97%</span>
                      <span className="block text-xs font-bold text-emerald-800 uppercase">Optimal Health</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-200 text-center">
                  <div className="p-2 rounded bg-emerald-100 border border-emerald-300">
                    <span className="block text-xs font-black text-emerald-950">1,276</span>
                    <span className="text-[10px] text-emerald-900 font-bold uppercase">Flawless</span>
                  </div>
                  <div className="p-2 rounded bg-amber-100 border border-amber-300">
                    <span className="block text-xs font-black text-amber-950">4</span>
                    <span className="text-[10px] text-amber-900 font-bold uppercase">Syncing</span>
                  </div>
                  <div className="p-2 rounded bg-rose-100 border border-rose-300">
                    <span className="block text-xs font-black text-rose-950">0</span>
                    <span className="text-[10px] text-rose-900 font-bold uppercase">Faulted</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Toxicity & Camus Intrusion Protection Bar */}
              <div className="bg-white rounded-lg p-5 border border-slate-300 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">Camus Security & Content Filtering</h3>
                  <span className="text-xs text-slate-700 font-bold">Last 24 Hours</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-bold">
                      <span className="text-slate-800">Aggregated Traffic Cleanliness</span>
                      <span className="text-emerald-800 font-black">99.4% Verified Clean</span>
                    </div>
                    {/* Stacked 4-segment distribution bar */}
                    <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-200 shadow-inner border text-slate-950 border-slate-400 font-black">
                      <div className="bg-emerald-600 h-full hover:opacity-90 transition-opacity" style={{ width: '92.4%' }} title="Clean: 92.4%" />
                      <div className="bg-blue-600 h-full hover:opacity-90 transition-opacity" style={{ width: '5.2%' }} title="Heuristics Scanned: 5.2%" />
                      <div className="bg-amber-500 h-full hover:opacity-90 transition-opacity" style={{ width: '2.1%' }} title="Quarantined: 2.1%" />
                      <div className="bg-rose-600 h-full hover:opacity-90 transition-opacity" style={{ width: '0.3%' }} title="Threat Blocked: 0.3%" />
                    </div>
                  </div>

                  {/* Legend Breakdown */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                      <span className="text-slate-700 font-bold">Clean Payload:</span>
                      <span className="font-black text-slate-900 ml-auto">92.4%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <span className="text-slate-700 font-bold">AI Verified:</span>
                      <span className="font-black text-slate-900 ml-auto">5.2%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-slate-700 font-bold">Quarantined:</span>
                      <span className="font-black text-slate-900 ml-auto">2.1%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                      <span className="text-slate-700 font-bold">Hostile Drops:</span>
                      <span className="font-black text-rose-700 ml-auto">0.3%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-100 rounded-lg border border-slate-300 text-xs text-slate-800 font-bold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-700" />
                      <span>Zero-Day Intrusion Signature Engine:</span>
                    </div>
                    <span className="font-black text-emerald-800">Active & Enforcing</span>
                  </div>
                </div>
              </div>

              {/* Box 3: 150-Rule Governance Policy Donut Chart */}
              <div className="bg-white rounded-lg p-5 border border-slate-300 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Policy Frameworks (150 Rules)</h3>
                  <span className="text-xs text-blue-700 font-bold hover:underline cursor-pointer" onClick={() => setActiveTab('governance')}>
                    View All Rules
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* SVG Multi-Colored Donut */}
                  <div className="relative w-28 h-28 shrink-0">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                      {/* Segment 1: Content Safety (45%) */}
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#2563EB" strokeWidth="5" strokeDasharray="45 55" strokeDashoffset="0" />
                      {/* Segment 2: AI Ethics (25%) */}
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#059669" strokeWidth="5" strokeDasharray="25 75" strokeDashoffset="-45" />
                      {/* Segment 3: Privacy (15%) */}
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#7C3AED" strokeWidth="5" strokeDasharray="15 85" strokeDashoffset="-70" />
                      {/* Segment 4: Financial (15%) */}
                      <circle cx="18" cy="18" r="14" fill="transparent" stroke="#D97706" strokeWidth="5" strokeDasharray="15 85" strokeDashoffset="-85" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-base font-black text-slate-900">150</span>
                      <span className="text-[10px] text-slate-700 uppercase font-bold">Rules</span>
                    </div>
                  </div>

                  {/* Donut Legend */}
                  <div className="space-y-1.5 text-xs flex-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        Content Safety
                      </span>
                      <span className="font-black text-slate-900">68 rules</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        AI Ethics & Bias
                      </span>
                      <span className="font-black text-slate-900">38 rules</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <span className="w-2 h-2 rounded-full bg-purple-600" />
                        Data Privacy / GDPR
                      </span>
                      <span className="font-black text-slate-900">22 rules</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-600" />
                        ERP & Financial
                      </span>
                      <span className="font-black text-slate-900">22 rules</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-bold">Autonomous Compliance:</span>
                  <span className="font-black text-emerald-800">99.7% Enforced</span>
                </div>
              </div>
            </div>

            {/* 12 STERCS Modules Grid */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">12 Specialized STERCS Consoles</h2>
                  <p className="text-xs text-slate-700 font-medium">
                    Direct access to specialized governance, creative suites, media engines, and sovereign security layers.
                  </p>
                </div>
                {/* Search Bar & Guardian AI SEO Launcher */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/masterdashboard?tab=seo')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-950 hover:bg-emerald-200 border border-emerald-400 rounded-md text-xs font-bold transition shadow-2xs"
                    title="Open Guardian AI Autonomous SEO & Search Indexing Console"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Guardian AI SEO &amp; Indexing</span>
                  </button>

                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search module or tool..."
                      className="pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 placeholder:text-slate-400 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-600 w-64 shadow-2xs"
                    />
                    {searchQuery.trim() && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-950 font-black border border-emerald-400">
                        B-Tree &lt; 1.2ms
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredModules.map((mod) => (
                  <div
                    key={mod.id}
                    className="bg-white rounded-lg border border-slate-300 p-4 shadow-2xs hover:shadow-md hover:border-blue-500 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Bar of Module Card */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-md ${getModuleCategoryColor(mod.category)}`}>
                            <mod.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                              {mod.title}
                            </h3>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                              {mod.category}
                            </span>
                          </div>
                        </div>

                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black capitalize ${getModuleStatusBadge(mod.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${getModuleStatusDot(mod.status)}`} />
                          {mod.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-medium line-clamp-2 mb-3 min-h-[32px]">
                        {mod.description}
                      </p>

                      {/* Health & Latency Row */}
                      <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-slate-50 rounded border border-slate-200 mb-3">
                        <span className="text-slate-700 font-medium">Latency: <strong className="text-slate-900 font-bold">{mod.responseTime}ms</strong></span>
                        <span className="text-slate-700 font-medium">Score: <strong className="text-emerald-800 font-black">{mod.healthScore}%</strong></span>
                        <span className="text-slate-700 font-mono text-[10px] font-bold">{mod.requests24h}</span>
                      </div>

                      {/* Mini Area Sparkline */}
                      <div className="h-7 w-full mb-3">
                        <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                          <path
                            d={`M 0,${24 - mod.trend[0] / 4} Q 25,${24 - mod.trend[2] / 4} 50,${24 - mod.trend[4] / 4} T 100,${24 - mod.trend[6] / 4} L 100,24 L 0,24 Z`}
                            fill="#E2E8F0"
                            opacity="0.7"
                          />
                          <path
                            d={`M 0,${24 - mod.trend[0] / 4} Q 25,${24 - mod.trend[2] / 4} 50,${24 - mod.trend[4] / 4} T 100,${24 - mod.trend[6] / 4}`}
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Action Buttons: Launch Console & Quick Telemetry */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => navigate(mod.route)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-colors shadow-2xs"
                      >
                        Launch Console
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedModuleForDrawer(mod)}
                        title="View Telemetry Drawer"
                        className="p-1.5 text-slate-700 hover:text-blue-700 hover:bg-blue-50 border border-slate-300 rounded transition-colors"
                      >
                        <Activity className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Table Preview */}
            <div className="bg-white rounded-lg border border-slate-300 p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Compliance Checks (Automated Watchdog)</h3>
                  <p className="text-xs text-slate-700 font-medium">Live cryptographic, ethical, accessibility and financial integrity scans.</p>
                </div>
                <button
                  onClick={() => setActiveTab('governance')}
                  className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                >
                  Run Full Suite <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-bold text-slate-800">Check Name</th>
                      <th className="px-4 py-2.5 text-left font-bold text-slate-800">Category</th>
                      <th className="px-4 py-2.5 text-left font-bold text-slate-800">Severity</th>
                      <th className="px-4 py-2.5 text-left font-bold text-slate-800">Last Execution</th>
                      <th className="px-4 py-2.5 text-left font-bold text-slate-800">Score</th>
                      <th className="px-4 py-2.5 text-left font-bold text-slate-800">Status</th>
                      <th className="px-4 py-2.5 text-right font-bold text-slate-800">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {complianceChecks.map((chk) => (
                      <tr key={chk.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          {chk.name}
                        </td>
                        <td className="px-4 py-3 text-slate-800 font-medium">{chk.category}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${getCheckSeverityBadge(chk.severity)}`}>
                            {chk.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-medium">{chk.lastRun}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{chk.score}%</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-emerald-950 font-bold bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded-full text-[11px] font-black">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            {chk.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setActiveTab('governance')}
                            className="text-blue-700 hover:text-blue-900 font-bold text-xs hover:underline"
                          >
                            Audit Logs
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEFCON COMMAND & GEO-FENCING */}
        {activeTab === 'defcon' && (
          <div className="space-y-6">
            <StercsControlCenter />
          </div>
        )}

        {/* TAB 3: MODULES MANAGEMENT */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-300 p-5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">STERCS Modular Control Plane</h3>
                  <p className="text-xs text-slate-700 font-medium">Configure, monitor, update and restart sovereign engine modules.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('modules')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-2xs"
                  >
                    Dedicated Modules Hub
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Module</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Category</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Version</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Status</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Response</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Health</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">24h Volume</th>
                      <th className="px-4 py-3 text-right font-bold text-slate-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {stercsModules.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                          <div className="p-1.5 bg-blue-100 text-blue-900 rounded shrink-0 border border-blue-200">
                            <m.icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <div className="truncate text-slate-900 font-bold">{m.title}</div>
                            <div className="text-[10px] font-medium text-slate-600 truncate" title={m.description}>{m.description}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-800 font-medium">{m.category}</td>
                        <td className="px-4 py-3 text-slate-700 font-mono text-[11px] font-bold">{m.version}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full ${getModuleStatusBadge(m.status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${getModuleStatusDot(m.status)}`} />
                            {m.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900">{m.responseTime} ms</td>
                        <td className="px-4 py-3 font-black text-emerald-800">{m.healthScore}%</td>
                        <td className="px-4 py-3 text-slate-800 font-mono font-bold">{m.requests24h}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => navigate(m.route)}
                            className="px-2.5 py-1 bg-blue-100 text-blue-900 hover:bg-blue-200 rounded font-bold text-xs transition-colors border border-blue-300"
                          >
                            Launch
                          </button>
                          <button
                            onClick={() => setSelectedModuleForDrawer(m)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded font-bold text-xs transition-colors border border-slate-300"
                          >
                            Telemetry
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTROLS & FEATURE FLAGS */}
        {activeTab === 'controls' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-300 p-5 shadow-2xs">
              <h3 className="text-base font-bold text-slate-900 mb-2">Automated Security & Governance Policies</h3>
              <p className="text-xs text-slate-700 font-medium mb-4">Toggle autonomous enforcement thresholds across cluster nodes.</p>

              <div className="space-y-3">
                {securityFlags.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-700 font-medium">{item.desc}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleFlag(item.id)}
                      className={`px-3 py-1 rounded text-xs font-bold uppercase border transition-colors ${
                        item.active 
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200' 
                          : 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300'
                      }`}
                    >
                      {item.active ? 'Enforced' : 'Standby'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-300 p-5 shadow-2xs">
              <h3 className="text-base font-bold text-slate-900 mb-2">Emergency Protocols & Sovereign Killswitches</h3>
              <p className="text-xs text-slate-700 font-medium mb-4">Cryptographically signed fail-safe actions for super-administrators.</p>

              <div className="space-y-4">
                <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-300 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">Enclave Memory Flush & Cache Eviction</h4>
                    <p className="text-[11px] text-amber-900 font-medium mt-0.5">Clears distributed memory caching across all 1,280 enclaves without session drop.</p>
                    <button
                      onClick={handleTriggerMemoryFlush}
                      disabled={isFlushingMemory}
                      className="mt-2 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded shadow-2xs transition disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      {isFlushingMemory && <RefreshCw className="w-3 h-3 animate-spin" />}
                      {isFlushingMemory ? 'Flushing Enclave Memory...' : 'Trigger Safe Memory Flush'}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-300 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-950">Sovereign Cluster Quarantine Mode</h4>
                    <p className="text-[11px] text-rose-900 font-medium mt-0.5">Isolates public traffic to readonly view while autonomous security probes execute.</p>
                    <button
                      onClick={handleTriggerQuarantine}
                      className={`mt-2 px-3 py-1 text-slate-700 text-xs font-semibold rounded shadow-2xs transition ${
                        isQuarantineStandby ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                      }`}
                    >
                      {isQuarantineStandby ? 'Disengage Quarantine Standby' : 'Request Multi-Sig Quarantine'}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-300 flex items-start gap-3">
                  <RefreshCw className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-950">Rotate Hardware Enclave Keys</h4>
                    <p className="text-[11px] text-blue-900 font-medium mt-0.5">Automated rolling re-encryption of all active sessions and symmetric channel keys.</p>
                    <button
                      onClick={handleTriggerKeyRotation}
                      disabled={isRotatingKeys}
                      className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-2xs transition disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      {isRotatingKeys && <RefreshCw className="w-3 h-3 animate-spin" />}
                      {isRotatingKeys ? 'Rotating Enclave Keys...' : 'Rotate Ephemeral Keys'}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-indigo-50 border border-indigo-300 flex items-start gap-3">
                  <Activity className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950">Throughput Surge Circuit Breaker</h4>
                    <p className="text-[11px] text-indigo-900 font-medium mt-0.5">Simulates automated circuit trip during severe traffic surges to protect database persistence.</p>
                    <button
                      onClick={handleToggleCircuitBreaker}
                      className={`mt-2 px-3 py-1 text-slate-700 text-xs font-semibold rounded shadow-2xs transition ${
                        circuitBreakerTripped ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {circuitBreakerTripped ? 'Reset Circuit Breaker (Closed)' : 'Engage Trip Test (Open)'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GOVERNANCE & COMPLIANCE */}
        {activeTab === 'governance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-300 p-5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">150-Rule Governance & Compliance Suite</h3>
                  <p className="text-xs text-slate-700 font-medium">Autonomous evaluation matrix covering content integrity, ethics, and sovereign law.</p>
                </div>
                <button
                  onClick={() => setActiveTab('governance')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-2xs"
                >
                  Open Legal Compliance Hub
                </button>
              </div>

              <div className="space-y-3">
                {governancePolicies.map((pol) => (
                  <div key={pol.id} className="p-4 rounded-lg border border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-blue-700">{pol.id}</span>
                        <h4 className="font-bold text-sm text-slate-900">{pol.title}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                          {pol.category}
                        </span>
                      </div>
                      <span className="text-xs font-black text-emerald-700">{pol.passedPercent}% Compliance</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mb-2 break-words">{pol.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium pt-2 border-t border-slate-200">
                      <span>Enforcement: <strong className="text-slate-900 font-bold capitalize">{pol.complianceLevel}</strong></span>
                      <span>Last Reviewed: <strong className="text-slate-800 font-bold">{pol.lastUpdated}</strong></span>
                      <button
                        onClick={() => setSelectedPolicyForModal(pol)}
                        className="text-blue-700 hover:text-blue-900 hover:underline font-bold"
                      >
                        Edit Rule Definition
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ERP & CRM SUITE */}
        {activeTab === 'erp-crm' && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="bg-white rounded-lg border border-slate-300 p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">ERP & CRM Autonomous Operations Core</h3>
                  <p className="text-xs text-slate-700 font-medium">
                    Automating core operations: Accounting, Procurement, Human Capital, Supply Chain, and Customer Pipelines.
                  </p>
                </div>
                <button
                  onClick={() => setIsErpModalOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded shadow-2xs"
                >
                  Launch Full ERP/CRM Console
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Box 1: Financial & Ledgers */}
              <div className="bg-white rounded-lg border border-slate-300 p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-700" />
                    Finance & Ledgers
                  </span>
                  <span className="text-emerald-700 font-bold">100% Synced</span>
                </div>
                <p className="text-xs text-slate-700 font-medium mb-3">Reconciliation across Infinity Coin and fiat bank accounts.</p>
                <div className="text-2xl font-black text-slate-900 mb-1">$4,892,140</div>
                <div className="text-[11px] text-slate-700 font-medium">Total Treasury Balance (Audit Complete)</div>
              </div>

              {/* Box 2: Supply Chain & Procurement */}
              <div className="bg-white rounded-lg border border-slate-300 p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-700" />
                    Procurement & Logistics
                  </span>
                  <span className="text-blue-700 font-bold">48 Orders</span>
                </div>
                <p className="text-xs text-slate-700 font-medium mb-3">Automated vendor purchase orders, logistics and tracking.</p>
                <div className="text-2xl font-black text-slate-900 mb-1">99.2%</div>
                <div className="text-[11px] text-slate-700 font-medium">On-Time Vendor Fulfillment</div>
              </div>

              {/* Box 3: Human Capital & Payroll */}
              <div className="bg-white rounded-lg border border-slate-300 p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-700" />
                    Human Capital & Payroll
                  </span>
                  <span className="text-purple-700 font-bold">342 Staff</span>
                </div>
                <p className="text-xs text-slate-700 font-medium mb-3">Smart contract payouts, performance reviews & recruitment.</p>
                <div className="text-2xl font-black text-slate-900 mb-1">Zero Delays</div>
                <div className="text-[11px] text-slate-700 font-medium">Next Payroll Epoch in 12 days</div>
              </div>

              {/* Box 4: CRM Pipeline & Leads */}
              <div className="bg-white rounded-lg border border-slate-300 p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Workflow className="w-4 h-4 text-amber-700" />
                    CRM Pipeline & Leads
                  </span>
                  <span className="text-amber-700 font-bold">12.4k Leads</span>
                </div>
                <p className="text-xs text-slate-700 font-medium mb-3">Lead scoring, automated replies, segmentation & support.</p>
                <div className="text-2xl font-black text-slate-900 mb-1">28.4%</div>
                <div className="text-[11px] text-slate-700 font-medium">High-Intent Conversion Rate</div>
              </div>
            </div>

            {/* Sovereign Financial Economic Ecosystem & Accounting Ratios Core */}
            <div className="mt-8 pt-8 border-t border-slate-300">
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Platform Financial Economic Ecosystem & Accounting Ratios
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  Full sovereign bank rails (Fidelity Bank Revenue vs Profit), live accounting ratio evaluators, growth engines, and modernized financial models.
                </p>
              </div>
              <EnterpriseFinancialEcosystemConsole />
            </div>
          </div>
        )}

        {/* TAB 6: 18 CORPORATE EXECUTIVE ROLES, GOVERNANCE & AGENTIC CLEARANCES */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <CorporateGovernanceConsole />

            <div className="bg-white rounded-lg border border-slate-300 p-5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Departmental AI Agents & Service Account Clearances</h3>
                  <p className="text-xs text-slate-700 font-medium">
                    Agentic operational matrix and autonomous service account permissions mapped to executive departmental portfolios.
                  </p>
                </div>
                <button
                  onClick={() => setIsRolesModalOpen(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-2xs"
                >
                  Expand Full Matrix Detail
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-300 text-xs">
                  <thead className="bg-slate-100 border-b border-slate-300">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">ID</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Department</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Designated Officer / Role</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Officer Lead</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Clearance</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Active AI Agents</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-800">Status</th>
                      <th className="px-4 py-3 text-right font-bold text-slate-800">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {departmentalRoles.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-slate-700 font-bold">{r.id}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{r.department}</td>
                        <td className="px-4 py-3 text-slate-800 font-medium">{r.title}</td>
                        <td className="px-4 py-3 text-blue-700 font-bold">{r.head}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getClearanceBadge(r.clearance)}`}>
                            {r.clearance}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800">{r.activeAgents} agents</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-emerald-950 font-bold bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded-full text-[11px]  font-black">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setIsRolesModalOpen(true)}
                            className="text-blue-700 hover:text-blue-900 hover:underline font-bold"
                          >
                            Permissions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: AUTONOMOUS AGENTIC AI ENGINE MODAL */}
      {isAiAgentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Bot className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Automated Generative & Agentic AI Engine</h3>
              </div>
              <button
                onClick={() => setIsAiAgentModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <p className="text-xs text-slate-700 font-medium">
                Test and execute autonomous multilingual agent workflows, conversational AI dispatchers, and automated policy enforcers.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Active Sovereign Model
                </label>
                <select className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500">
                  <option>Gemini 2.5 Sovereign Flash (Sub-50ms Heuristic Engine)</option>
                  <option>Gemini 2.5 Pro Neural Auditor (Multi-Modal Deep Inspector)</option>
                  <option>Camus Heuristic Isolator v4.2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Dispatch Prompt / Policy Verification Objective
                </label>
                <textarea
                  rows={3}
                  value={aiTestPrompt}
                  onChange={(e) => setAiTestPrompt(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono placeholder:text-slate-400"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  disabled={isGeneratingAi}
                  onClick={handleExecuteAiTest}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded transition-colors shadow-xs disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Evaluating Heuristics...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Execute Agentic Inspection
                    </>
                  )}
                </button>
              </div>

              {aiSimulatedOutput && (
                <div className="mt-4 p-3.5 bg-slate-900 text-emerald-400 rounded-lg font-mono text-xs whitespace-pre-wrap border border-slate-800">
                  {aiSimulatedOutput}
                </div>
              )}
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-300 flex justify-between items-center text-xs">
              <span className="text-slate-700 font-medium">Autonomous Heuristic Accuracy: <strong className="text-slate-900 font-bold">99.98%</strong></span>
              <button
                onClick={() => setIsAiAgentModalOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded border border-slate-300 transition-colors"
              >
                Close Engine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ERP & CRM OPERATIONS MODAL */}
      {isErpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-emerald-900 text-white p-4 flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm text-white">ERP & CRM Enterprise Autonomous Bridge</h3>
              </div>
              <button
                onClick={() => setIsErpModalOpen(false)}
                className="text-emerald-200 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded border border-slate-300">
                  <h4 className="font-bold text-slate-900 mb-1">Financial Ledgers & Double-Entry</h4>
                  <p className="text-slate-700 font-medium mb-2">Automated accounts payable, receivables & tax reconciliation.</p>
                  <div className="text-lg font-black text-emerald-700">$4,892,140.00</div>
                  <div className="text-[10px] text-slate-600 font-medium">Zero delta vs Infinity Coin reserves</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded border border-slate-300">
                  <h4 className="font-bold text-slate-900 mb-1">Procurement & Sourcing</h4>
                  <p className="text-slate-700 font-medium mb-2">Vendor purchase orders, inventory and supply chain tracking.</p>
                  <div className="text-lg font-black text-blue-700">142 Inbound Shipments</div>
                  <div className="text-[10px] text-slate-600 font-medium">All vendors verified</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded border border-slate-300 space-y-2">
                <h4 className="font-bold text-slate-900">CRM Customer Pipeline & Automated Dispatch</h4>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-700 font-medium">Total Contacts & Leads Managed:</span>
                  <strong className="text-slate-900 font-bold">12,480 Active Records</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-700 font-medium">Autonomous Email & Support Dispatch:</span>
                  <strong className="text-emerald-700 font-bold">4,120 replies sent today (0 wait time)</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-700 font-medium">Lead Scoring Engine:</span>
                  <strong className="text-purple-700 font-bold">Active (Multi-modal heuristic)</strong>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleTriggerSyncLedger}
                  disabled={isSyncingLedger}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs transition disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isSyncingLedger && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {isSyncingLedger ? 'Syncing Double-Entry Ledgers...' : 'Run Full Enterprise Sync'}
                </button>
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-300 flex justify-end">
              <button
                onClick={() => setIsErpModalOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded border border-slate-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: 19 DEPARTMENTAL ROLES EXPANDED MODAL */}
      {isRolesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm text-white">19 Corporate Departmental Leadership Structure</h3>
              </div>
              <button
                onClick={() => setIsRolesModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              <p className="text-xs text-slate-700 font-medium mb-4">
                Full protocol governance structure mapping departmental executive directors, heads of service, and clearance boundaries.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {departmentalRoles.map((r) => (
                  <div key={r.id} className="p-3 bg-slate-50 rounded-lg border border-slate-300">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[11px] font-black text-blue-700">{r.id}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                        {r.clearance}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900">{r.title}</h4>
                    <p className="text-slate-700 font-medium text-[11px]">Department: <strong className="text-slate-900">{r.department}</strong></p>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200 text-[11px]">
                      <span className="text-slate-700 font-medium">Officer: <strong className="text-slate-900">{r.head}</strong></span>
                      <span className="text-emerald-700 font-bold">{r.activeAgents} Agents Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-300 flex justify-between items-center text-xs">
              <button
                onClick={() => triggerToast('Direct role clearance delegation active. Permissions synced to sovereign directory.')}
                className="text-blue-700 font-bold hover:underline"
              >
                Manage Permissions in Role Management Console →
              </button>
              <button
                onClick={() => setIsRolesModalOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded border border-slate-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: MODULE TELEMETRY INSPECTION DRAWER */}
      {selectedModuleForDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200 border-l border-slate-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-300 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-700 rounded border border-blue-200">
                  <selectedModuleForDrawer.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedModuleForDrawer.title}</h3>
                  <span className="text-xs text-slate-700 font-medium">{selectedModuleForDrawer.category}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedModuleForDrawer(null)}
                className="text-slate-600 hover:text-slate-900 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 flex-1 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-1">Description</h4>
                <p className="text-slate-700 font-medium leading-relaxed">{selectedModuleForDrawer.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded border border-slate-300">
                  <span className="text-slate-700 font-medium block">Version</span>
                  <strong className="text-slate-900 font-mono font-bold">{selectedModuleForDrawer.version}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-300">
                  <span className="text-slate-700 font-medium block">Health Score</span>
                  <strong className="text-emerald-700 font-black text-sm">{selectedModuleForDrawer.healthScore}%</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-300">
                  <span className="text-slate-700 font-medium block">Socket Latency</span>
                  <strong className="text-slate-900 font-bold">{selectedModuleForDrawer.responseTime} ms</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-300">
                  <span className="text-slate-700 font-medium block">24h Requests</span>
                  <strong className="text-slate-900 font-mono font-bold">{selectedModuleForDrawer.requests24h}</strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-2">Live Enclave Socket Activity</h4>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded font-mono text-[11px] space-y-1 border border-slate-800">
                  <div>[OK] Socket connected: wss://stercs.enclave.alpha</div>
                  <div>[OK] TLS 1.3 handshake verified (256-bit AES-GCM)</div>
                  <div>[OK] Hardware attestation digest validated</div>
                  <div>[OK] Camus isolation: 0 boundaries penetrated</div>
                  <div>[OK] Memory usage: 142MB / 512MB allocated</div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    navigate(selectedModuleForDrawer.route);
                    setSelectedModuleForDrawer(null);
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  Launch Full Dedicated Console
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL 4: POLICY RULE DEFINITION EDITOR */}
      {selectedPolicyForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">Edit Policy Rule: {selectedPolicyForModal.id}</h3>
                <p className="text-xs text-slate-300 font-medium">Configure sovereign threshold and compliance severity</p>
              </div>
              <button
                onClick={() => setSelectedPolicyForModal(null)}
                className="text-slate-300 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-900 mb-1">Policy Title</label>
                <input
                  type="text"
                  value={selectedPolicyForModal.title}
                  onChange={(e) => setSelectedPolicyForModal({ ...selectedPolicyForModal, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-900 mb-1">Category</label>
                <input
                  type="text"
                  value={selectedPolicyForModal.category}
                  onChange={(e) => setSelectedPolicyForModal({ ...selectedPolicyForModal, category: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-900 mb-1">Enforcement Description</label>
                <textarea
                  rows={3}
                  value={selectedPolicyForModal.description}
                  onChange={(e) => setSelectedPolicyForModal({ ...selectedPolicyForModal, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs font-medium text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 font-bold placeholder:text-slate-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Compliance Level</label>
                  <select
                    value={selectedPolicyForModal.complianceLevel}
                    onChange={(e) => setSelectedPolicyForModal({ ...selectedPolicyForModal, complianceLevel: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="strict">Strict (Auto-Block)</option>
                    <option value="moderate">Moderate (Flag & Review)</option>
                    <option value="permissive">Permissive (Telemetry Only)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-900 mb-1">Current Score (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={selectedPolicyForModal.passedPercent}
                    onChange={(e) => setSelectedPolicyForModal({ ...selectedPolicyForModal, passedPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-300 rounded text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="bg-slate-100 px-5 py-3 border-t border-slate-300 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setSelectedPolicyForModal(null)}
                className="px-3.5 py-1.5 border border-slate-300 text-slate-800 bg-white hover:bg-slate-200 rounded font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSavePolicy(selectedPolicyForModal)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-xs transition-colors"
              >
                Save Rule Definition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION BANNER */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-300 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StercsDashboardPage;
