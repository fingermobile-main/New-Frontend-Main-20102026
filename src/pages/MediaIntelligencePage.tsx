import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Cpu,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  RefreshCw,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  FileVideo,
  FileAudio,
  FileImage,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  ArrowLeft,
  Server,
  Play
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface IngestionItem {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image' | 'text';
  model: string;
  stage: 'transcribing' | 'ocr' | 'safety_tagging' | 'completed' | 'flagged';
  latencyMs: number;
  confidence: number;
  tokensUsed: number;
  cost: number;
  safetyScore: number;
  timestamp: string;
  metadata: {
    transcription?: string;
    ocrText?: string;
    labels?: string[];
  };
}

const INITIAL_QUEUE: IngestionItem[] = [
  {
    id: 'MI-89412',
    name: 'street_dance_contest_finals_4k.mp4',
    type: 'video',
    model: 'Gemini 1.5 Flash + Whisper v3',
    stage: 'completed',
    latencyMs: 148,
    confidence: 98.4,
    tokensUsed: 1420,
    cost: 0.0028,
    safetyScore: 99.7,
    timestamp: 'Just now',
    metadata: {
      transcription: 'Welcome to the Dancia Lagos finals! Contestant 4 starting in 3, 2, 1...',
      ocrText: 'DANCIA LEAGUE 2026 #BEATWAVE',
      labels: ['Dance', 'Sports', 'Stage Performance', 'Urban Music']
    }
  },
  {
    id: 'MI-89413',
    name: 'dj_beatwave_afrobeat_mix_track7.flac',
    type: 'audio',
    model: 'Whisper v3 Turbo',
    stage: 'transcribing',
    latencyMs: 84,
    confidence: 96.1,
    tokensUsed: 620,
    cost: 0.0011,
    safetyScore: 100.0,
    timestamp: '12s ago',
    metadata: {
      transcription: 'Audio streaming frequency 44.1kHz vocal isolation active...',
      labels: ['Afrobeat', 'Bass', 'Vocal Stems']
    }
  },
  {
    id: 'MI-89414',
    name: 'luxury_watch_storefront_hero.png',
    type: 'image',
    model: 'Cloud Vision OCR v2 + Safety',
    stage: 'completed',
    latencyMs: 62,
    confidence: 99.2,
    tokensUsed: 310,
    cost: 0.0006,
    safetyScore: 100.0,
    timestamp: '45s ago',
    metadata: {
      ocrText: 'FLAMINGO CHRONO 2026 EDITION - WATERPROOF 50M',
      labels: ['Luxury Product', 'Jewelry', 'Wristwatch', 'Storefront Hero']
    }
  },
  {
    id: 'MI-89415',
    name: 'forum_thread_deepdive_crypto_security.txt',
    type: 'text',
    model: 'Gemini 1.5 Flash',
    stage: 'safety_tagging',
    latencyMs: 41,
    confidence: 94.8,
    tokensUsed: 840,
    cost: 0.0014,
    safetyScore: 98.2,
    timestamp: '1m ago',
    metadata: {
      ocrText: 'Multi-signature consensus on FingerMobile Protocol L2 escrow nodes.',
      labels: ['Discussion', 'Fintech', 'Escrow', 'Security']
    }
  },
  {
    id: 'MI-89416',
    name: 'live_stream_recap_clip_fingerwars.mp4',
    type: 'video',
    model: 'Gemini 1.5 Flash',
    stage: 'flagged',
    latencyMs: 210,
    confidence: 76.5,
    tokensUsed: 1840,
    cost: 0.0039,
    safetyScore: 78.1,
    timestamp: '2m ago',
    metadata: {
      transcription: 'Rapid combat shoutcasting with loud crowd acoustic spikes.',
      ocrText: 'TOURNAMENT MATCH #4 DISPUTED KILL',
      labels: ['Esports', 'High Energy', 'Shouting', 'Borderline Loudness']
    }
  }
];

export const MediaIntelligencePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'routing' | 'workers' | 'reviews'>('pipeline');
  const [items, setItems] = useState<IngestionItem[]>(INITIAL_QUEUE);
  const [selectedItem, setSelectedItem] = useState<IngestionItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isReprocessing, setIsReprocessing] = useState(false);

  // Model Routing & Thresholds State
  const [primaryModel, setPrimaryModel] = useState('gemini-1.5-flash');
  const [audioModel, setAudioModel] = useState('whisper-v3-turbo');
  const [ocrModel, setOcrModel] = useState('cloud-vision-v2');
  const [safetyThreshold, setSafetyThreshold] = useState(85);
  const [confidenceGate, setConfidenceGate] = useState(80);
  const [promptCacheTtl, setPromptCacheTtl] = useState(3600);

  const handleRerun = (id: string) => {
    setIsReprocessing(true);
    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, stage: 'completed', confidence: 99.1, safetyScore: 99.8, latencyMs: 98 }
            : item
        )
      );
      setIsReprocessing(false);
      showToast(`Asset ${id} re-processed through ${primaryModel} successfully!`, 'success');
    }, 800);
  };

  const handleApproveFlagged = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stage: 'completed', safetyScore: 95.0 } : item
      )
    );
    showToast(`Asset ${id} approved by SuperAdmin!`, 'success');
    setSelectedItem(null);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.metadata.transcription && item.metadata.transcription.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate('/master-dashboard')}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-emerald-400 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Master Dashboard
              </button>
              <span className="text-zinc-600">/</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Media & Discovery
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Brain className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Mi (Media Intelligence) Console
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Health 96% • Online
                  </span>
                </h1>
                <p className="text-sm text-zinc-400">
                  Multimodal AI Ingestion Pipeline, Speech-to-Text, OCR, and Safety Governance
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                showToast('Telemetry export generated (CSV)', 'info');
              }}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition"
            >
              <Download className="w-4 h-4" />
              Export Telemetry
            </button>
            <button
              onClick={() => {
                showToast('Synchronizing worker queue & model status...', 'info');
              }}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Workers
            </button>
          </div>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Operational Health</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">96.0%</div>
            <div className="text-[11px] text-zinc-500 mt-1">Target ≥95.0% • Nominal</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>p95 Latency</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">142 ms</div>
            <div className="text-[11px] text-zinc-500 mt-1">p99: 188 ms • Fast Gating</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Throughput</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white">1,480/m</div>
            <div className="text-[11px] text-zinc-500 mt-1">Peak: 2,120 assets/min</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Avg Token Cost</span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">$0.0023</div>
            <div className="text-[11px] text-zinc-500 mt-1">Daily Cap: $150.00 ($34.12 used)</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Safety Accuracy</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">99.82%</div>
            <div className="text-[11px] text-zinc-500 mt-1">False Positives: 0.18%</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-zinc-800 mt-8">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'pipeline'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Live Ingestion Pipeline ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('routing')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'routing'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Model Routing & Safety Thresholds
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'workers'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            GPU Worker Queue & Backpressure
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'reviews'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Human Review Backlog ({items.filter((i) => i.stage === 'flagged').length})
          </button>
        </div>

        {/* TAB 1: Live Ingestion Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/40 p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2 w-full md:w-96 bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search assets, transcription, OCR text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm w-full focus:outline-none text-zinc-200"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Type:</span>
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-zinc-900 text-xs border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 focus:outline-none"
                >
                  <option value="all">All Modalities</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="image">Image</option>
                  <option value="text">Text</option>
                </select>
              </div>
            </div>

            {/* Ingestion Table */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/20">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900/80 text-zinc-400 uppercase tracking-wider text-[11px] border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Asset ID / Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Model Pipeline</th>
                      <th className="py-3 px-4">Stage</th>
                      <th className="py-3 px-4">Latency</th>
                      <th className="py-3 px-4">Confidence</th>
                      <th className="py-3 px-4">Safety</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-800/30 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {item.type === 'video' && <FileVideo className="w-4 h-4 text-blue-400" />}
                            {item.type === 'audio' && <FileAudio className="w-4 h-4 text-purple-400" />}
                            {item.type === 'image' && <FileImage className="w-4 h-4 text-emerald-400" />}
                            {item.type === 'text' && <FileText className="w-4 h-4 text-amber-400" />}
                            <div>
                              <div className="font-semibold text-zinc-200">{item.name}</div>
                              <div className="text-[10px] text-zinc-500">{item.id} • {item.timestamp}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 uppercase text-zinc-400 font-mono text-[11px]">
                          {item.type}
                        </td>
                        <td className="py-3 px-4 text-zinc-300 font-mono text-[11px]">
                          {item.model}
                        </td>
                        <td className="py-3 px-4">
                          {item.stage === 'completed' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Ready
                            </span>
                          )}
                          {item.stage === 'transcribing' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse">
                              <RefreshCw className="w-3 h-3 animate-spin" /> Transcribing
                            </span>
                          )}
                          {item.stage === 'safety_tagging' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <ShieldCheck className="w-3 h-3" /> Safety Tagging
                            </span>
                          )}
                          {item.stage === 'flagged' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                              <AlertTriangle className="w-3 h-3" /> Flagged (Review)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-300">
                          {item.latencyMs}ms
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-300">
                          {item.confidence}%
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-mono text-xs ${
                              item.safetyScore >= 90
                                ? 'text-emerald-400'
                                : item.safetyScore >= 80
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {item.safetyScore}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded transition"
                              title="Inspect AI extraction payload"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRerun(item.id)}
                              disabled={isReprocessing}
                              className="p-1.5 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded transition"
                              title="Re-run pipeline"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Model Routing & Safety Thresholds */}
        {activeTab === 'routing' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-6">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Sliders className="w-5 h-5" />
                <h3>Primary Model Endpoint Routing</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Primary Multimodal & LLM Pipeline
                  </label>
                  <select
                    value={primaryModel}
                    onChange={(e) => setPrimaryModel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-white font-semibold"
                  >
                    <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Default • Sub-150ms)</option>
                    <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Deep Multimodal Analysis)</option>
                    <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet (Fallback)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Speech-to-Text Transcription Engine
                  </label>
                  <select
                    value={audioModel}
                    onChange={(e) => setAudioModel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-white font-semibold"
                  >
                    <option value="whisper-v3-turbo">OpenAI Whisper v3 Turbo (GPU Worker)</option>
                    <option value="google-speech-v2">Google Cloud Speech-to-Text v2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Optical Character Recognition (OCR)
                  </label>
                  <select
                    value={ocrModel}
                    onChange={(e) => setOcrModel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-white font-semibold"
                  >
                    <option value="cloud-vision-v2">Google Cloud Vision OCR v2</option>
                    <option value="tesseract-fast">Tesseract 5.3 Local Worker</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-6">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-5 h-5" />
                <h3>Gating Thresholds & Policy Automation</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-300">Minimum Safety Gate Score:</span>
                    <span className="font-mono text-emerald-400">{safetyThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={safetyThreshold}
                    onChange={(e) => setSafetyThreshold(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-zinc-800 rounded-lg h-2"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Assets scoring below this score are automatically quarantined to Human Review.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-300">Confidence Threshold for Auto-Publish:</span>
                    <span className="font-mono text-emerald-400">{confidenceGate}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="99"
                    value={confidenceGate}
                    onChange={(e) => setConfidenceGate(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-zinc-800 rounded-lg h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-300">Prompt & Embedding Cache TTL:</span>
                    <span className="font-mono text-emerald-400">{promptCacheTtl} seconds</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="86400"
                    step="300"
                    value={promptCacheTtl}
                    onChange={(e) => setPromptCacheTtl(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-zinc-800 rounded-lg h-2"
                  />
                </div>

                <button
                  onClick={() => {
                    showToast('Model routing & safety parameters updated across worker nodes!', 'success');
                  }}
                  className="w-full py-2.5 px-4 bg-emerald-500 text-zinc-950 font-semibold text-xs rounded-lg hover:bg-emerald-400 transition"
                >
                  Save Model Routing Configuration
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Worker Queue & GPU Telemetry */}
        {activeTab === 'workers' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-xs mb-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>GPU Worker Fleet</span>
                </div>
                <div className="text-xl font-bold text-white">4 Online / 4 Total</div>
                <div className="text-xs text-zinc-500 mt-1">2x NVIDIA A10G • 2x T4 Tensor Cores</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-xs mb-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Queue Backpressure</span>
                </div>
                <div className="text-xl font-bold text-white">14 Jobs in Buffer</div>
                <div className="text-xs text-zinc-500 mt-1">Avg Wait Time: 1.2s • Nominal Backpressure</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-xs mb-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>Failover Status</span>
                </div>
                <div className="text-xl font-bold text-emerald-400">0 Dispatches to Fallback</div>
                <div className="text-xs text-zinc-500 mt-1">Primary model uptime: 99.98%</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-200 mb-4">
                Real-Time Worker Thread Allocation
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>worker-gpu-01 (Transcoding & Whisper v3)</span>
                    <span className="text-emerald-400">72% Load • 58°C</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[72%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>worker-gpu-02 (Gemini Flash Multimodal Ingest)</span>
                    <span className="text-emerald-400">45% Load • 52°C</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[45%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>worker-gpu-03 (Vision OCR & Bounding Box)</span>
                    <span className="text-emerald-400">38% Load • 49°C</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[38%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>worker-gpu-04 (Asynchronous Safety Gating)</span>
                    <span className="text-emerald-400">22% Load • 46°C</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[22%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Human Review Backlog */}
        {activeTab === 'reviews' && (
          <div className="mt-6 space-y-4">
            {items.filter((i) => i.stage === 'flagged').length === 0 ? (
              <div className="p-12 text-center border border-zinc-800 rounded-xl bg-zinc-900/30">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-white">Review Backlog Clear</h3>
                <p className="text-xs text-zinc-400 mt-1">All ingested media have passed automated AI safety gates.</p>
              </div>
            ) : (
              items
                .filter((i) => i.stage === 'flagged')
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-semibold text-rose-400 uppercase">
                          Quarantined for Review
                        </span>
                        <span className="text-xs text-zinc-500">• {item.id}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-zinc-300 mt-1">
                        Safety Score: <span className="text-rose-400 font-mono">{item.safetyScore}%</span> (Threshold: {safetyThreshold}%) • Confidence: {item.confidence}%
                      </p>
                      {item.metadata.transcription && (
                        <div className="text-xs text-zinc-400 bg-zinc-950/60 p-2.5 rounded mt-2 border border-zinc-800">
                          "{item.metadata.transcription}"
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 md:flex-none px-3.5 py-2 text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800"
                      >
                        Inspect Payload
                      </button>
                      <button
                        onClick={() => handleApproveFlagged(item.id)}
                        className="flex-1 md:flex-none px-3.5 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition"
                      >
                        Approve & Release
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Modal: Inspect AI Payload */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">
                    AI Inspection Payload: {selectedItem.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-zinc-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-zinc-500 font-medium">Source File:</span>
                  <div className="text-zinc-200 font-semibold">{selectedItem.name}</div>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <div>
                    <span className="text-zinc-500">Pipeline:</span>
                    <div className="text-zinc-200 font-mono">{selectedItem.model}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500">Latency:</span>
                    <div className="text-zinc-200 font-mono">{selectedItem.latencyMs} ms</div>
                  </div>
                  <div>
                    <span className="text-zinc-500">Token Cost:</span>
                    <div className="text-zinc-200 font-mono">${selectedItem.cost.toFixed(4)}</div>
                  </div>
                </div>

                {selectedItem.metadata.transcription && (
                  <div>
                    <span className="text-zinc-400 font-medium block mb-1">Whisper v3 Transcription:</span>
                    <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-zinc-300 font-mono">
                      {selectedItem.metadata.transcription}
                    </div>
                  </div>
                )}

                {selectedItem.metadata.ocrText && (
                  <div>
                    <span className="text-zinc-400 font-medium block mb-1">OCR Extracted Text:</span>
                    <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-zinc-300 font-mono">
                      {selectedItem.metadata.ocrText}
                    </div>
                  </div>
                )}

                {selectedItem.metadata.labels && (
                  <div>
                    <span className="text-zinc-400 font-medium block mb-1.5">Classified Semantic Labels:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.metadata.labels.map((lbl, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700"
                        >
                          {lbl}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg"
                >
                  Close
                </button>
                {selectedItem.stage === 'flagged' && (
                  <button
                    onClick={() => handleApproveFlagged(selectedItem.id)}
                    className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg"
                  >
                    Approve Asset
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaIntelligencePage;
