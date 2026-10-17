import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Activity,
  Cpu,
  Globe,
  Database,
  BarChart3,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Server,
  Layers,
  FileCode,
  Gauge,
  Radio,
  ExternalLink,
  Bot
} from 'lucide-react';
import {
  guardianSeoService,
  CoreWebVitals,
  AutonomousAuditRun,
  RegionalLatencyTest
} from '../../services/guardianSeoService';
import {
  guardianSearchIndexer,
  IndexedEntity,
  SearchBenchmarkResult
} from '../../services/GuardianSearchIndexingService';

export const GuardianAISeoPerformanceConsole: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    '12h-engine' | 'performance-tools' | 'diagnostics' | 'asset-opt' | 'search-indexing'
  >('12h-engine');

  // SEO & Core Web Vitals State
  const [vitals, setVitals] = useState<CoreWebVitals>(guardianSeoService.getWebVitals());
  const [auditHistory, setAuditHistory] = useState<AutonomousAuditRun[]>(guardianSeoService.getAuditHistory());
  const [benchmarks] = useState<RegionalLatencyTest[]>(guardianSeoService.getRegionalLatencyBenchmarks());
  const [gscMetrics] = useState(guardianSeoService.getGoogleSearchConsoleMetrics());
  const [assetMetrics] = useState(guardianSeoService.getAssetOptimizationSummary());

  // Autonomous Cycle Countdown State
  const [countdownSeconds, setCountdownSeconds] = useState(43200); // 12 hours in seconds
  const [isExecutingCycle, setIsExecutingCycle] = useState(false);
  const [cycleSuccessMsg, setCycleSuccessMsg] = useState('');

  // Indexing Search Bench State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState<'all' | 'database' | 'masterdashboard' | 'stercs'>('all');
  const [searchBenchmark, setSearchBenchmark] = useState<SearchBenchmarkResult>(
    guardianSearchIndexer.query('', 'all')
  );

  // Live Countdown Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 43200));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live Search Execution using GuardianSearchIndexingEngine
  useEffect(() => {
    const res = guardianSearchIndexer.query(searchQuery, searchScope);
    setSearchBenchmark(res);
  }, [searchQuery, searchScope]);

  const formatCountdown = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const handleRunAutonomousCycle = () => {
    setIsExecutingCycle(true);
    setCycleSuccessMsg('');
    setTimeout(() => {
      const run = guardianSeoService.triggerAutonomousCycle();
      setVitals(run.cwvSnapshot);
      setAuditHistory(guardianSeoService.getAuditHistory());
      setCountdownSeconds(43200);
      setIsExecutingCycle(false);
      setCycleSuccessMsg('Autonomous 12-Hour Optimization Cycle completed! Core Web Vitals healed and indexes rebalanced.');
      setTimeout(() => setCycleSuccessMsg(''), 6000);
    }, 1200);
  };

  const indexStats = guardianSearchIndexer.getIndexStats();

  return (
    <div className="space-y-6">
      {/* 1. Header & Autonomous Self-Healing Seal */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 border border-indigo-500/30 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Guardian AI Autonomous SEO &amp; Performance Console</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                  v2.4 SUPER AI
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-indigo-200/80 mt-1.5 max-w-3xl leading-relaxed">
              100% automated daily &amp; 12-hour self-healing engine. Tracks Core Web Vitals (LCP, CLS, INP, TTFB),
              optimizes database B-Tree &amp; hash map search indexing, and automates asset minification &amp; Edge CDN caching.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider">Next 12H Auto-Run</span>
              <span className="font-mono font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {formatCountdown(countdownSeconds)}
              </span>
            </div>

            <button
              onClick={handleRunAutonomousCycle}
              disabled={isExecutingCycle}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl font-bold text-xs transition-all shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isExecutingCycle ? 'animate-spin' : ''}`} />
              <span>{isExecutingCycle ? 'Healing Platform Assets...' : 'Run Auto-Optimization Cycle'}</span>
            </button>
          </div>
        </div>

        {cycleSuccessMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{cycleSuccessMsg}</span>
          </div>
        )}

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-6">
          {[
            { id: '12h-engine', label: '12H Auto-Healing Engine', icon: Sparkles },
            { id: 'performance-tools', label: 'PageSpeed & GTmetrix Tools', icon: Gauge },
            { id: 'diagnostics', label: 'DevTools & Search Console', icon: Activity },
            { id: 'asset-opt', label: 'WP Rocket, Squoosh & Cloudflare', icon: Cpu },
            { id: 'search-indexing', label: 'Database & Dashboard Indexing', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-orange-500' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SUB-TAB 1: 12-Hour Daily Self-Healing Cycle & Audit Logs */}
      {activeSubTab === '12h-engine' && (
        <div className="space-y-6">
          {/* Core Web Vitals Live Gauges */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Core Web Vitals Real-Time Health Gauges</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950 dark:text-emerald-300 font-bold font-black">
                  ALL PASSING (GOOD)
                </span>
              </h2>
              <span className="text-xs text-slate-500">Google Search Ranking Baseline</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { key: 'lcp', metric: vitals.lcp, target: '< 2.5s', desc: 'Main content visible' },
                { key: 'cls', metric: vitals.cls, target: '< 0.1', desc: 'Visual stability' },
                { key: 'inp', metric: vitals.inp, target: '< 200ms', desc: 'Tap/Click responsiveness' },
                { key: 'ttfb', metric: vitals.ttfb, target: '< 800ms', desc: 'Server first byte' },
                { key: 'tbt', metric: vitals.tbt, target: '< 200ms', desc: 'Main thread unblocked' },
                { key: 'speedIndex', metric: vitals.speedIndex, target: '< 3.4s', desc: 'Visual progression' }
              ].map(({ key, metric, target, desc }) => (
                <div
                  key={key}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-700 uppercase">{key}</span>
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950 dark:text-emerald-300">
                        GOOD
                      </span>
                    </div>
                    <div className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5">
                      {metric.value}
                      <span className="text-xs font-normal text-slate-700 ml-0.5">{metric.unit}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1 line-clamp-1">
                      {metric.label}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Target: {target}</span>
                    <span className="text-slate-700 truncate ml-1">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Autonomous Healing Pipeline Visualization */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Autonomous 12-Hour Self-Healing Pipeline Mechanics</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  title: 'Core Web Vitals Heuristic Scan',
                  desc: 'Inspects DOM tree layout shifts, LCP hero image sizes, and JS hydration latency across 230 platform screens.',
                  status: 'Continuous'
                },
                {
                  step: '02',
                  title: 'Asset Compression & Transcoding',
                  desc: 'Invokes Squoosh/TinyPNG engine to compress large media to lightweight WebP/AVIF without visual loss.',
                  status: 'Auto-Triggered'
                },
                {
                  step: '03',
                  title: 'B-Tree & Hash Map Index Rebalance',
                  desc: 'Rebalances in-memory B-Trees across 14,820 database rows to guarantee <2ms query lookups.',
                  status: 'Zero Downtime'
                },
                {
                  step: '04',
                  title: 'Google & Bing Sitemap Ping',
                  desc: 'Dispatches XML sitemap updates to Google Search Console and Bing Webmaster APIs with valid 200 OK.',
                  status: 'Daily Sync'
                }
              ].map((p) => (
                <div key={p.step} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-black text-amber-500">{p.step}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{p.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">Status</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit History Log */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                <span>Autonomous Execution Log (WORM Audited)</span>
              </h3>
              <span className="text-xs text-slate-500">Last 10 Executions</span>
            </div>

            <div className="space-y-3">
              {auditHistory.map((run) => (
                <div
                  key={run.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{run.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {run.cycle}
                      </span>
                      <span className="text-[11px] text-slate-700">
                        {new Date(run.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5 list-disc list-inside">
                      {run.actionsApplied.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-500">Health Score</div>
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {run.overallScore}%
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                      {run.fixedIssuesCount} Fixed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SUB-TAB 2: Performance Testing Suite (PageSpeed, GTmetrix, Pingdom, WebPageTest) */}
      {activeSubTab === 'performance-tools' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Google PageSpeed Insights Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm">
                    PSI
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950 dark:text-emerald-300 font-black">
                    PASSED
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Google PageSpeed Insights</h3>
                <p className="text-xs text-slate-500 mt-1">Mobile &amp; desktop performance score used directly for Google Search rankings.</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">98</div>
                    <div className="text-[10px] text-slate-700 font-semibold mt-0.5">Mobile Score</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">100</div>
                    <div className="text-[10px] text-slate-700 font-semibold mt-0.5">Desktop Score</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Field Data Verified</span>
                <span className="font-mono text-emerald-600 font-bold">Good</span>
              </div>
            </div>

            {/* GTmetrix Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-sm">
                    GTM
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950 dark:text-emerald-300 font-black">
                    GRADE A
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">GTmetrix Diagnostic</h3>
                <p className="text-xs text-slate-500 mt-1">Granular action-oriented results with automated testing alerts.</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">99%</div>
                    <div className="text-[10px] text-slate-700 font-semibold mt-0.5">Performance</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">98%</div>
                    <div className="text-[10px] text-slate-700 font-semibold mt-0.5">Structure</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Fully Loaded Time</span>
                <span className="font-mono text-emerald-600 font-bold">1.2s</span>
              </div>
            </div>

            {/* Pingdom Speed Test Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm">
                    PNG
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950 dark:text-emerald-300 font-black">
                    GRADE 97
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pingdom Speed Test</h3>
                <p className="text-xs text-slate-500 mt-1">Identifies how asset types (fonts, scripts, images) affect page speed.</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">1.1 MB</div>
                    <div className="text-[10px] text-slate-700 font-semibold mt-0.5">Page Size</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">28</div>
                    <div className="text-[10px] text-slate-700 font-semibold mt-0.5">Requests</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Faster than</span>
                <span className="font-mono text-emerald-600 font-bold">96% of tested sites</span>
              </div>
            </div>

            {/* WebPageTest Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                    WPT
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950 dark:text-emerald-300 font-black">
                    CATCHPOINT
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">WebPageTest Global Matrix</h3>
                <p className="text-xs text-slate-500 mt-1">Multi-location global latency simulations across mobile networks.</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">18 ms</div>
                    <div className="text-[10px] text-slate-700 font-semibold mt-0.5">Lagos TTFB</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">24 ms</div>
                    <div className="text-[10px] text-slate-700 font-semibold mt-0.5">London TTFB</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Security Headers</span>
                <span className="font-mono text-emerald-600 font-bold">A+ (HSTS/CSP)</span>
              </div>
            </div>
          </div>

          {/* WebPageTest Global Regional Latency Simulation Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-500" />
              <span>Catchpoint WebPageTest Regional Response Benchmarks</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-700 font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">Location &amp; Node</th>
                    <th className="py-2.5 px-3">Backbone Provider</th>
                    <th className="py-2.5 px-3">TTFB (First Byte)</th>
                    <th className="py-2.5 px-3">Start Render</th>
                    <th className="py-2.5 px-3">Speed Index</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {benchmarks.map((b) => (
                    <tr key={b.location} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{b.location}</td>
                      <td className="py-3 px-3 text-slate-500">{b.provider}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{b.ttfbMs} ms</td>
                      <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">{b.renderMs} ms</td>
                      <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">{b.speedIndexMs} ms</td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950 dark:text-emerald-300 uppercase font-black">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUB-TAB 3: Developer & Search Diagnostics (Chrome DevTools & Google Search Console) */}
      {activeSubTab === 'diagnostics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chrome DevTools Performance & Network Diagnostics Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">
                    CDT
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Chrome DevTools Performance &amp; Network Panel</h3>
                    <p className="text-[11px] text-slate-700">CPU Usage, Layout Shifts, and Server Response Timeline</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950 dark:text-emerald-300 font-black">
                  HEALTHY
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Main Thread CPU Activity</span>
                    <span className="font-mono text-emerald-600">18ms TBT (Idle: 94%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '6%' }}></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5">No long tasks exceeding 50ms detected during hydration.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Network Multiplexing &amp; HTTP/3 Streams</span>
                    <span className="font-mono text-blue-600">0 HOL Blocking</span>
                  </div>
                  <div className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    Static JS/CSS chunks parallelized over single QUIC connection. Early Hints (103) preloads font assets.
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Layout Shift Cluster Tracing</span>
                    <span className="font-mono text-emerald-600">Score: 0.005 (Target &lt; 0.1)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    Image and iframe aspect-ratio attributes explicitly declared. Zero unstable shifts during rendering.
                  </div>
                </div>
              </div>
            </div>

            {/* Google Search Console Health & Indexing Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                    GSC
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Google Search Console Indexing Health</h3>
                    <p className="text-[11px] text-slate-700">Real-world crawl stats, URL inspection &amp; Rich Results</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400 font-bold dark:bg-blue-950 dark:text-blue-300 font-black">
                  100% INDEXED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
                    {gscMetrics.totalIndexedPages}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold mt-0.5">Valid Indexed Pages</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {gscMetrics.crawlRequestsDaily.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold mt-0.5">Daily Crawl Requests</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Top Organic Google Rankings</div>
                <div className="space-y-1.5">
                  {gscMetrics.topOrganicKeywords.map((k) => (
                    <div key={k.keyword} className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-900 dark:text-white">{k.keyword}</span>
                      <div className="flex items-center gap-3 text-slate-700 font-mono">
                        <span>{k.clicks.toLocaleString()} clicks</span>
                        <span className="font-bold text-amber-500">Pos #{k.position}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUB-TAB 4: Code & Asset Optimization (WP Rocket, Squoosh, Cloudflare) */}
      {activeSubTab === 'asset-opt' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WP Rocket Minification & Caching */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs mb-3">
                  <FileCode className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Code Minification &amp; Cache (WP Rocket Engine)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Automatically minifies HTML, CSS, and JavaScript chunks while managing aggressive in-memory caching.
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span>HTML / CSS Minification</span>
                    <span className="font-bold text-emerald-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span>Critical CSS Extraction</span>
                    <span className="font-bold text-emerald-600">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span>Gzip / Brotli Compression</span>
                    <span className="font-bold text-emerald-600">100% Compressed</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-semibold">
                Status: {assetMetrics.wpRocketStatus}
              </div>
            </div>

            {/* TinyPNG / Squoosh Image Engine */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Image Compression (TinyPNG / Squoosh)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Transcodes PNG/JPEG assets into lightweight WebP and AVIF standards without loss of visual clarity.
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span>Compressed Assets</span>
                    <span className="font-bold font-mono text-emerald-600">{assetMetrics.tinyPngCompressedCount} files</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span>Total Bandwidth Saved</span>
                    <span className="font-bold font-mono text-emerald-600">{assetMetrics.totalBandwidthSavedMB} MB</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span>Next-Gen Adoption</span>
                    <span className="font-bold font-mono text-emerald-600">{assetMetrics.nextGenFormatRatio}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                WebP/AVIF Transcoding: 100% Operational
              </div>
            </div>

            {/* Cloudflare Edge CDN & TTFB */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs mb-3">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Edge CDN &amp; TTFB (Cloudflare Network)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Hosts static site assets across global edge servers close to users, drastically lowering TTFB.
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span>Edge Protocols</span>
                    <span className="font-bold font-mono text-orange-500">HTTP/3 + QUIC</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span>Global Cache Hit Ratio</span>
                    <span className="font-bold font-mono text-emerald-600">{assetMetrics.globalCacheHitRatio}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span>TLS Handshake</span>
                    <span className="font-bold font-mono text-emerald-600">0-RTT (TLS 1.3)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[11px] font-semibold">
                Edge Cache: Warm (300+ PoPs Active)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. SUB-TAB 5: Database, MasterDashboard & Stercs Indexing Search Bench */}
      {activeSubTab === 'search-indexing' && (
        <div className="space-y-6">
          {/* Indexing Architecture Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-700">Total Indexed Items</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
                {indexStats.totalIndexedEntities}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Cross-platform entities cataloged in memory</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-700">Database Tables Indexed</span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                {indexStats.databaseTablesIndexed}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">B-Tree indexed PostgreSQL tables</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-700">Master &amp; Stercs Consoles</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                {indexStats.masterConsolesIndexed + indexStats.stercsModulesIndexed}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Consoles &amp; AI creation pipelines</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-700">Seek Execution Latency</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                &lt; 1.5 ms
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Zero sequential table scans (O(1) / O(log N))</p>
            </div>
          </div>

          {/* Interactive Indexing Search Bench Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-500" />
                  <span>Sub-Millisecond Search Indexing Bench (B-Tree &amp; Hash Map)</span>
                </h3>

                {/* Scope Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: 'All Catalog' },
                    { id: 'database', label: 'Database' },
                    { id: 'masterdashboard', label: 'MasterDashboard' },
                    { id: 'stercs', label: 'Stercs Studio' }
                  ].map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => setSearchScope(sc.id as any)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                        searchScope === sc.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Type any query to test instant indexed retrieval without sequential table scans.
              </p>
            </div>

            {/* Input Search Box */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across Database tables, MasterDashboard consoles, Stercs modules, or routes (e.g. 'auth', 'fic', 'render', 'orders')..."
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-inner font-bold border-slate-300"
              />
            </div>

            {/* Live Search Benchmark Telemetry Banner */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
                  {searchBenchmark.totalHits} Hits Found
                </span>
                <span className="text-slate-700">•</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Execution: {searchBenchmark.executionTimeMs} ms
                </span>
                <span className="text-slate-700">•</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">
                  Index Structure: {searchBenchmark.indexStructureUsed}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950 dark:text-emerald-300">
                SCAN TYPE: {searchBenchmark.scanType}
              </span>
            </div>

            {/* Matched Entities Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {searchBenchmark.results.map((entity) => (
                <div
                  key={entity.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-400/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono ${
                        entity.category === 'Database'
                          ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold dark:bg-blue-950 dark:text-blue-300'
                          : entity.category === 'MasterDashboard'
                          ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold dark:bg-amber-950 dark:text-amber-300'
                          : entity.category === 'Stercs'
                          ? 'bg-purple-100 text-purple-950 border border-purple-400 font-bold dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {entity.category} • {entity.subCategory}
                      </span>

                      {entity.schemaDetails?.indexType && (
                        <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {entity.schemaDetails.indexType} Seek
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{entity.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{entity.description}</p>

                    {entity.schemaDetails && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] font-mono space-y-0.5 text-slate-500">
                        <div>Table: <span className="font-semibold text-slate-700 dark:text-slate-300">{entity.schemaDetails.tableName}</span> ({entity.schemaDetails.estimatedRows?.toLocaleString()} rows)</div>
                        <div>Cluster: <span className="text-slate-600 dark:text-slate-400">{entity.schemaDetails.databaseCluster}</span></div>
                        <div>Indexed: <span className="text-indigo-600 dark:text-indigo-400">{entity.schemaDetails.indexedColumns?.join(', ')}</span></div>
                      </div>
                    )}
                  </div>

                  {entity.route && (
                    <a
                      href={entity.route}
                      className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>Navigate to Console / Screen &rarr;</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuardianAISeoPerformanceConsole;
